import { test, expect } from '@playwright/test';
import { zaloguj, zalogujPrzezApi } from '../pomocnicze/logowanie';

// P15. Status zamówienia w panelu admina (API + E2E).
// Test z kontem admin uruchamiamy tylko lokalnie.

test('administrator zmienia status zamówienia na „Opłacone”, potem „Wysłane”, a klient widzi w API status shipped', async ({ page, request }) => {
  // Klient składa zamówienie przez API.
  await zalogujPrzezApi(request);
  const nowe = await request.post('/api/orders', { data: { product_id: 10, qty: 1 } });
  expect(nowe.status()).toBe(201);
  const numer: string = (await nowe.json()).number;

  await zaloguj(page, 'admin', 'admin123');
  await page.goto(`/admin/zamowienia/${numer}`);
  await expect(page.getByRole('heading', { name: `Zamówienie ${numer}` })).toBeVisible();

  await page.getByLabel('Status zamówienia').selectOption('Opłacone');
  await page.getByRole('button', { name: 'Zapisz status' }).click();
  await expect(page.getByText('Status: Opłacone', { exact: true })).toBeVisible();

  await page.getByLabel('Status zamówienia').selectOption('Wysłane');
  await page.getByRole('button', { name: 'Zapisz status' }).click();
  await expect(page.getByText('Status: Wysłane', { exact: true })).toBeVisible();

  // Klient widzi nowy status w API.
  const pobrane = await request.get(`/api/orders/${numer}`);
  expect(pobrane.status()).toBe(200);
  expect((await pobrane.json()).status).toBe('shipped');
});
