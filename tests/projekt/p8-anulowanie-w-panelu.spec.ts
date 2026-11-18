import { test, expect } from '@playwright/test';
import { zaloguj, zalogujPrzezApi } from '../pomocnicze/logowanie';

// P8. Zamówienie z API anulowane w panelu (API + E2E).
// Test z kontem admin uruchamiamy tylko lokalnie.

test('zamówienie anulowane przez administratora ma status „Anulowane”, a inne zamówienia nie zmieniają statusu', async ({ page, request }) => {
  // Klient zakłada własne zamówienie przez API, żeby nie anulować cudzych danych.
  await zalogujPrzezApi(request);
  const nowe = await request.post('/api/orders', { data: { product_id: 10, qty: 1 } });
  expect(nowe.status()).toBe(201);
  const numer: string = (await nowe.json()).number;

  // Administrator wyszukuje zamówienie po numerze i je anuluje.
  await zaloguj(page, 'admin', 'admin123');
  await page.goto('/admin/zamowienia');
  await page.getByLabel('Szukaj zamówienia').fill(numer);
  await page.getByRole('button', { name: 'Szukaj' }).click();

  const wiersz = page.getByRole('row').filter({ hasText: numer });
  await wiersz.getByRole('button', { name: 'Anuluj' }).click();

  await expect(page.getByText(`Anulowano zamówienie ${numer}`)).toBeVisible();
  await expect(wiersz.getByRole('cell', { name: 'Anulowane', exact: true })).toBeVisible();
  await expect(wiersz.getByRole('button', { name: 'Anuluj' })).toHaveCount(0);

  // Inne zamówienie (ZAM-1001 z danych startowych) nadal ma status „Nowe”.
  const inne = page.getByRole('row').filter({ hasText: 'ZAM-1001' });
  await expect(inne.getByRole('cell', { name: 'Nowe', exact: true })).toBeVisible();

  // Klient widzi w API status cancelled.
  const pobrane = await request.get(`/api/orders/${numer}`);
  expect(pobrane.status()).toBe(200);
  expect((await pobrane.json()).status).toBe('cancelled');
});
