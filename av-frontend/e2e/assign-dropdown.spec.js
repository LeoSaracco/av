/**
 * @file assign-form.spec.js
 * @description Test E2E: el formulario full-page de asignación de rutinas
 *              funciona correctamente en viewport mobile y desktop.
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

test.describe('Formulario de asignación de rutinas', () => {

  test('430x480: formulario full-page, inputs visibles sin modal', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 480 });
    await loginAsCoach(page);
    await page.goto('/#/coach/assign');

    const assignBtn = page.locator('button', { hasText: 'Asignar rutina' });
    await assignBtn.first().click();

    await expect(page.locator('text=Volver a asignaciones')).toBeVisible();
    await expect(page.locator('text=Buscar socio')).toBeVisible();

    const searchInput = page.locator('input[placeholder*="Buscar socio"]');
    await expect(searchInput).toBeVisible();

    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('1200x800: flujo completo assign sin regresión', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await loginAsCoach(page);
    await page.goto('/#/coach/assign');

    const assignBtn = page.locator('button', { hasText: 'Asignar rutina' });
    await assignBtn.first().click();

    await expect(page.locator('text=Asignar rutina')).toBeVisible();
    await expect(page.locator('input[placeholder*="Buscar socio"]')).toBeVisible();

    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('430x480: stepper siempre visible en formulario', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 480 });
    await loginAsCoach(page);
    await page.goto('/#/coach/assign');

    const assignBtn = page.locator('button', { hasText: 'Asignar rutina' });
    await assignBtn.first().click();

    await expect(page.locator('text=Socio')).toBeVisible();
    await expect(page.locator('text=Rutina')).toBeVisible();
    await expect(page.locator('text=Ejercicios')).toBeVisible();
    await expect(page.locator('text=Confirmar')).toBeVisible();
  });

  test('volver a asignaciones cierra el formulario', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await loginAsCoach(page);
    await page.goto('/#/coach/assign');

    const assignBtn = page.locator('button', { hasText: 'Asignar rutina' });
    await assignBtn.first().click();
    await expect(page.locator('text=Buscar socio')).toBeVisible();

    await page.click('text=Volver a asignaciones');
    await expect(page.locator('text=Buscar cliente o rutina')).toBeVisible();
  });

  test('no hay botón Editar rutina en las cards', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await loginAsCoach(page);
    await page.goto('/#/coach/assign');

    await expect(page.locator('button', { hasText: 'Editar rutina' })).not.toBeVisible();
  });
});
