#!/usr/bin/env python3
"""Launch, export, and gate a Tenable Vulnerability Management scan."""

from __future__ import annotations

import csv
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


API_URL = os.getenv("TENABLE_API_URL", "https://cloud.tenable.com").rstrip("/")
ACCESS_KEY = os.getenv("TENABLE_ACCESS_KEY", "")
SECRET_KEY = os.getenv("TENABLE_SECRET_KEY", "")
SCAN_ID = os.getenv("TENABLE_SCAN_ID", "")
HISTORY_ID = os.getenv("TENABLE_HISTORY_ID", "")
LAUNCH_SCAN = os.getenv("TENABLE_LAUNCH_SCAN", "true").lower() == "true"
WAIT_FOR_COMPLETION = os.getenv("TENABLE_WAIT_FOR_COMPLETION", "true").lower() == "true"
ALT_TARGETS = [target.strip() for target in os.getenv("TENABLE_ALT_TARGETS", "").split(",") if target.strip()]
FAIL_ON_SEVERITIES = {
    severity.strip().lower()
    for severity in os.getenv("TENABLE_FAIL_ON_SEVERITIES", "critical,high").split(",")
    if severity.strip()
}
SCAN_TIMEOUT_SECONDS = int(os.getenv("TENABLE_SCAN_TIMEOUT_SECONDS", "5400"))
EXPORT_TIMEOUT_SECONDS = int(os.getenv("TENABLE_EXPORT_TIMEOUT_SECONDS", "600"))
POLL_SECONDS = int(os.getenv("TENABLE_POLL_SECONDS", "30"))
RESULTS_DIR = Path(os.getenv("TENABLE_RESULTS_DIR", "tenable-results"))


def fail(message: str) -> None:
    print(f"::error::{message}")
    raise SystemExit(1)


def request(method: str, path: str, body: dict | None = None, accept: str = "application/json") -> bytes:
    headers = {
        "Accept": accept,
        "X-ApiKeys": f"accessKey={ACCESS_KEY}; secretKey={SECRET_KEY}",
    }
    data = None
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(f"{API_URL}{path}", data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as response:
            return response.read()
    except urllib.error.HTTPError as exc:
        details = exc.read().decode("utf-8", errors="replace")
        fail(f"Tenable API {method} {path} failed with HTTP {exc.code}: {details[:500]}")
    except urllib.error.URLError as exc:
        fail(f"Tenable API {method} {path} failed: {exc}")


def request_json(method: str, path: str, body: dict | None = None) -> dict:
    raw = request(method, path, body)
    if not raw:
        return {}
    try:
        return json.loads(raw.decode("utf-8"))
    except json.JSONDecodeError:
        fail(f"Tenable API {method} {path} returned invalid JSON")


def require_config() -> None:
    missing = [
        name
        for name, value in {
            "TENABLE_ACCESS_KEY": ACCESS_KEY,
            "TENABLE_SECRET_KEY": SECRET_KEY,
            "TENABLE_SCAN_ID": SCAN_ID,
        }.items()
        if not value
    ]
    if missing:
        fail(f"Missing required environment variables: {', '.join(missing)}")
    if not FAIL_ON_SEVERITIES:
        fail("TENABLE_FAIL_ON_SEVERITIES must include at least one severity")


def launch_scan() -> None:
    body: dict[str, object] = {}
    if ALT_TARGETS:
        body["alt_targets"] = ALT_TARGETS

    print(f"Launching Tenable scan {SCAN_ID}")
    request_json("POST", f"/scans/{urllib.parse.quote(SCAN_ID)}/launch", body)


def latest_status() -> str:
    payload = request_json("GET", f"/scans/{urllib.parse.quote(SCAN_ID)}/latest-status")
    status = payload.get("status") or payload.get("info", {}).get("status")
    return str(status or "unknown").lower()


def wait_for_scan() -> None:
    deadline = time.monotonic() + SCAN_TIMEOUT_SECONDS
    complete_statuses = {"completed", "complete"}
    failed_statuses = {"aborted", "canceled", "cancelled", "error", "failed", "pausing", "stopped"}

    while True:
        status = latest_status()
        print(f"Tenable scan status: {status}")
        if status in complete_statuses:
            return
        if status in failed_statuses:
            fail(f"Tenable scan ended with status: {status}")
        if time.monotonic() >= deadline:
            fail(f"Tenable scan did not complete within {SCAN_TIMEOUT_SECONDS} seconds")
        time.sleep(POLL_SECONDS)


def export_scan() -> str:
    body = {"format": "csv"}
    query = ""
    if HISTORY_ID:
        query = f"?history_id={urllib.parse.quote(HISTORY_ID)}"

    payload = request_json("POST", f"/scans/{urllib.parse.quote(SCAN_ID)}/export{query}", body)
    file_id = payload.get("file") or payload.get("file_id")
    if not file_id:
        fail(f"Tenable export response did not include a file id: {payload}")
    return str(file_id)


def wait_for_export(file_id: str) -> None:
    deadline = time.monotonic() + EXPORT_TIMEOUT_SECONDS
    while True:
        payload = request_json(
            "GET",
            f"/scans/{urllib.parse.quote(SCAN_ID)}/export/{urllib.parse.quote(file_id)}/status",
        )
        status = str(payload.get("status", "unknown")).lower()
        print(f"Tenable export status: {status}")
        if status == "ready":
            return
        if status in {"error", "failed"}:
            fail(f"Tenable export ended with status: {status}")
        if time.monotonic() >= deadline:
            fail(f"Tenable export did not become ready within {EXPORT_TIMEOUT_SECONDS} seconds")
        time.sleep(min(POLL_SECONDS, 15))


def download_export(file_id: str) -> Path:
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    output_path = RESULTS_DIR / "tenable-scan.csv"
    raw = request(
        "GET",
        f"/scans/{urllib.parse.quote(SCAN_ID)}/export/{urllib.parse.quote(file_id)}/download",
        accept="application/octet-stream",
    )
    output_path.write_bytes(raw)
    print(f"Downloaded Tenable CSV export to {output_path}")
    return output_path


def normalized_severity(value: str) -> str:
    lookup = {
        "4": "critical",
        "3": "high",
        "2": "medium",
        "1": "low",
        "0": "none",
    }
    cleaned = value.strip().lower()
    return lookup.get(cleaned, cleaned)


def find_column(fieldnames: list[str], candidates: tuple[str, ...]) -> str | None:
    by_lower = {field.lower(): field for field in fieldnames}
    for candidate in candidates:
        if candidate in by_lower:
            return by_lower[candidate]
    return None


def analyze_csv(csv_path: Path) -> tuple[dict[str, int], list[dict[str, str]]]:
    with csv_path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        if not reader.fieldnames:
            fail("Tenable CSV export is empty or missing headers")

        severity_column = find_column(reader.fieldnames, ("risk", "severity"))
        plugin_column = find_column(reader.fieldnames, ("plugin name", "name", "plugin"))
        host_column = find_column(reader.fieldnames, ("host", "asset", "hostname", "dns name"))
        plugin_id_column = find_column(reader.fieldnames, ("plugin id", "plugin_id"))

        if not severity_column:
            fail(f"Tenable CSV export has no Risk or Severity column. Columns: {reader.fieldnames}")

        counts = {severity: 0 for severity in ["critical", "high", "medium", "low", "none"]}
        blockers: list[dict[str, str]] = []

        for row in reader:
            severity = normalized_severity(row.get(severity_column, ""))
            counts[severity] = counts.get(severity, 0) + 1
            if severity in FAIL_ON_SEVERITIES:
                blockers.append(
                    {
                        "severity": severity,
                        "host": row.get(host_column or "", ""),
                        "plugin_id": row.get(plugin_id_column or "", ""),
                        "plugin": row.get(plugin_column or "", ""),
                    }
                )

    return counts, blockers


def write_summary(counts: dict[str, int], blockers: list[dict[str, str]]) -> None:
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    summary_path = RESULTS_DIR / "tenable-summary.md"

    lines = [
        "# Tenable Scan Summary",
        "",
        f"- Scan ID: `{SCAN_ID}`",
        f"- Fail-on severities: `{', '.join(sorted(FAIL_ON_SEVERITIES))}`",
        "",
        "| Severity | Count |",
        "| --- | ---: |",
    ]
    for severity in ["critical", "high", "medium", "low", "none"]:
        lines.append(f"| {severity} | {counts.get(severity, 0)} |")

    if blockers:
        lines.extend(["", "## Blocking Findings", ""])
        for item in blockers[:20]:
            host = item["host"] or "unknown host"
            plugin = item["plugin"] or "unknown plugin"
            plugin_id = item["plugin_id"] or "unknown id"
            lines.append(f"- `{item['severity']}` on `{host}`: {plugin} (`{plugin_id}`)")
        if len(blockers) > 20:
            lines.append(f"- ...and {len(blockers) - 20} more blocking findings.")
    else:
        lines.extend(["", "No blocking findings matched the configured severity gate."])

    summary_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    github_summary = os.getenv("GITHUB_STEP_SUMMARY")
    if github_summary:
        with open(github_summary, "a", encoding="utf-8") as handle:
            handle.write(summary_path.read_text(encoding="utf-8"))


def main() -> int:
    require_config()
    if LAUNCH_SCAN:
        launch_scan()
    else:
        print("Skipping scan launch; exporting the latest available scan result")

    if WAIT_FOR_COMPLETION:
        wait_for_scan()
    else:
        print("Skipping scan completion wait")

    file_id = export_scan()
    wait_for_export(file_id)
    csv_path = download_export(file_id)
    counts, blockers = analyze_csv(csv_path)
    write_summary(counts, blockers)

    if blockers:
        for item in blockers[:20]:
            print(
                "::error::"
                f"{item['severity']} finding on {item['host'] or 'unknown host'}: "
                f"{item['plugin'] or 'unknown plugin'} ({item['plugin_id'] or 'unknown id'})"
            )
        fail(f"Tenable scan found {len(blockers)} blocking findings")

    print("Tenable scan passed the configured severity gate")
    return 0


if __name__ == "__main__":
    sys.exit(main())
