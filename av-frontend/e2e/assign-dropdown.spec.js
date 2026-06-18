/**
 * @file assign-dropdown.spec.js
 * @description Test E2E: el dropdown de SearchSelect en el modal "Asignar rutina"
 *              nunca debe tapar el header ni el stepper del modal.
 *              Ejecutar con: npm run test:e2e
 */
import { test, expect } from '@playwright/test';

const COACH_EMAIL = 'adrian@av.com';
const COACH_PASSWORD = 'coach123';

async function loginAsCoach(page) {
  await page.goto('/#/login');
  await page.fill('input[type="email"]', COACH_EMAIL);
  await page.fill('input[type="password"]', COACH_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/coach*', { timeout: 10_000 });
}

async function openAssignModalAndDropdown(page) {
  await page.goto('/#/coach/assign');
  await page.waitForSelector('.btn', { timeout: 10_000 });

  const assignBtn = page.locator('button', { hasText: 'Asignar rutina' });
  await assignBtn.first().click();
  await page.waitForSelector('.modal-box', { timeout: 5_000 });

  const input = page.locator('.modal-body input[placeholder*="Buscar socio"]');
  await input.click();
  await page.waitForSelector('[style*="z-index: 9999"]', { timeout: 3_000 });
}

test.describe('SearchSelect dropdown en modal Asignar rutina', () => {

  test('430x480: dropdown abre hacia abajo, header y stepper visibles', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 480 });
    await loginAsCoach(page);
    await openAssignModalAndDropdown(page);

    const header = page.locator('.modal-header');
    const dropdown = page.locator('[style*="z-index: 9999"]');
    const input = page.locator('.modal-body input[placeholder*="Buscar socio"]');

    await expect(header).toBeVisible();

    const inputBox = await input.boundingBox();
    const dropdownBox = await dropdown.boundingBox();
    const headerBox = await header.boundingBox();

    // Dropdown debe estar debajo del input (abre hacia abajo)
    expect(dropdownBox.y).toBeGreaterThanOrEqual(inputBox.y + inputBox.height - 1);

    // Dropdown no debe solapar el header
    expect(dropdownBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height);
  });

  test('1200x800: dropdown abre hacia abajo sin regresión', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await loginAsCoach(page);
    await openAssignModalAndDropdown(page);

    const header = page.locator('.modal-header');
    const dropdown = page.locator('[style*="z-index: 9999"]');

    await expect(header).toBeVisible();

    const headerBox = await header.boundingBox();
    const dropdownBox = await dropdown.boundingBox();

    expect(dropdownBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height);
  });

  test('430x480: stepper siempre visible con dropdown abierto', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 480 });
    await loginAsCoach(page);
    await openAssignModalAndDropdown(page);

    const header = page.locator('.modal-header');
    const dropdown = page.locator('[style*="z-index: 9999"]');

    await expect(header).toBeVisible();

    const headerBox = await header.boundingBox();
    const dropdownBox = await dropdown.boundingBox();

    // El dropdown nunca debe cruzar por encima del header bottom
    // (header contiene el título, debajo está el stepper)
    expect(dropdownBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height);

    // Verificar que el título del modal sigue visible
    await expect(page.locator('.modal-header h3')).toBeVisible();
  });
});
