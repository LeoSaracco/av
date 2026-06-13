/**
 * @file onboarding.spec.js
 * @description Test E2E del flujo completo de conversión:
 *              landing → pago → onboarding (6 pasos).
 *              Ejecutar con: npm run test:e2e
 */
import { test, expect } from '@playwright/test';

test.describe('Flujo completo de onboarding', () => {
  test('landing → pago plan 2 → formulario 6 pasos', async ({ page }) => {
    // ── Paso 1: Landing page ───────────────────────────────────────────────
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Adrián');

    // ── Paso 2: Click "Lo quiero" en el plan 2 (Método 90/90, featured) ──
    // El plan featured tiene la clase .plan-card.featured
    const plan2Button = page.locator('.plan-card.featured .btn');
    await plan2Button.click();

    // El botón usa window.location.href para navegar a #/pago?plan=plan2
    await page.waitForURL('**/pago*');

    // ── Paso 3: Verificar página de pago con datos pre-cargados ───────────
    await expect(page.getByText('Mercado Pago')).toBeVisible();

    // Verificar que el campo de número de tarjeta tiene el valor pre-cargado
    const cardNumberInput = page.getByPlaceholder('1234 5678 9012 3456');
    await expect(cardNumberInput).toHaveValue('4509953566233704');

    // Verificar que el nombre del titular está pre-cargado
    const cardNameInput = page.getByPlaceholder('Como aparece en la tarjeta');
    await expect(cardNameInput).toHaveValue('JUAN PEREZ');

    // ── Paso 4: Click "Pagar" ─────────────────────────────────────────────
    const payButton = page.getByRole('button', { name: /Pagar/ });
    await expect(payButton).toBeEnabled();
    await payButton.click();

    // ── Paso 5: Verificar estado de procesamiento ─────────────────────────
    await expect(page.getByText('Procesando tu pago')).toBeVisible({ timeout: 5000 });

    // ── Paso 6: Verificar estado aprobado ─────────────────────────────────
    await expect(page.getByText('Pago aprobado')).toBeVisible({ timeout: 5000 });

    // ── Paso 7: Esperar redirección al onboarding ─────────────────────────
    // Después del countdown de 3s se redirige a #/onboarding?plan=plan2
    await page.waitForURL('**/onboarding*', { timeout: 10_000 });

    // ── Paso 8: Verificar página de onboarding ────────────────────────────
    await expect(page.getByText('Cuestionario')).toBeVisible();

    // ── Paso 9: Llenar Step 1 — Datos personales ──────────────────────────
    await page.locator('#step1_name').fill('Juan Carlos Pérez');
    await page.locator('#step1_email').fill('juan@test.com');
    await page.locator('#step1_whatsapp').fill('+54 11 1234-5678');
    await page.locator('#step1_age').fill('30');
    await page.locator('#step1_height').fill('175');
    await page.locator('#step1_weight').fill('78');

    // Seleccionar sexo "Masculino"
    await page.getByRole('radio', { name: 'Masculino' }).click();

    // Click "Siguiente →"
    await page.getByRole('button', { name: /Siguiente/ }).click();

    // ── Paso 10: Step 2 — Actividad y hábitos ─────────────────────────────
    await expect(page.getByText('Actividad y hábitos')).toBeVisible();

    // Seleccionar opciones del step 2
    await page.getByRole('radio', { name: /Trabajo de oficina/ }).click();
    await page.getByRole('radio', { name: /5\.000-10\.000/ }).click();
    await page.getByRole('radio', { name: /7-8 horas/ }).click();

    await page.getByRole('button', { name: /Siguiente/ }).click();

    // ── Paso 11: Step 3 — Salud y aptitud física ──────────────────────────
    await expect(page.getByText('Salud y aptitud física')).toBeVisible();
    await page.getByRole('radio', { name: /^No$/ }).first().click(); // Sin patologías
    await page.getByRole('radio', { name: /^Sí$/ }).click(); // Apto médico
    await page.getByRole('radio', { name: /Intermedio/ }).click(); // Nivel físico
    // Compromiso (solo para plan2)
    await page.getByRole('radio', { name: /^Alto/ }).click();
    await page.getByRole('radio', { name: /3 veces/ }).click(); // Frecuencia

    await page.getByRole('button', { name: /Siguiente/ }).click();

    // ── Paso 12: Step 4 — Perfil y motivación ─────────────────────────────
    await expect(page.getByText('Perfil y motivación')).toBeVisible();
    await page.locator('#step4_body').fill('Me siento bien con mi cuerpo pero quiero mejorar');
    await page.locator('#step4_purpose').fill('Ganar masa muscular y definir');
    await page.locator('#step4_city').fill('Buenos Aires');

    await page.getByRole('button', { name: /Siguiente/ }).click();

    // ── Paso 13: Step 5 — Revisar datos (summary) ─────────────────────────
    await expect(page.getByText('Revisar datos')).toBeVisible();

    // Click continuar desde el summary
    await page.getByRole('button', { name: /Todo OK/ }).click();

    // ── Paso 14: Step 6 — Crear cuenta ────────────────────────────────────
    await expect(page.getByText('Creá tu cuenta')).toBeVisible();
    await page.locator('#step5_password').fill('test1234');
    await page.locator('#step5_confirm').fill('test1234');
    await page.locator('#step5_code').fill('123456');
    // Aceptar términos
    await page.locator('.checkbox-input').check();

    await page.getByRole('button', { name: /Crear cuenta/ }).click();

    // ── Paso 15: Verificar pantalla de éxito ──────────────────────────────
    await expect(page.getByText('Todo listo')).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: /dashboard/i })).toBeVisible();
  });
});
