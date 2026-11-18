import { test, expect } from '@playwright/test';
import { zaloguj } from '../pomocnicze/logowanie';

// P1. Zakup z płatnością przy odbiorze (E2E).

test('zakup Balsamu do ciała z płatnością przy odbiorze tworzy zamówienie „Nowe” i zmniejsza stan o 1', async ({ page, request }) => {
  // Stan przed zakupem bierzemy z API, bo zmienia się po każdym uruchomieniu testu.
  const odpowiedz = await request.get('/api/products/10');
  expect(odpowiedz.status()).toBe(200);
  const produkt = await odpowiedz.json();
  expect(produkt.name).toBe('Balsam do ciała');
  const stanPrzed: number = produkt.stock;

  await zaloguj(page);

  // Dodaj balsam do koszyka z wiersza tabeli produktów.
  await page.goto('/');
  const balsam = page.getByRole('row').filter({ hasText: 'Balsam do ciała' });
  await balsam.getByRole('button', { name: 'Dodaj do koszyka' }).click();
  await expect(page.getByText('Dodano do koszyka: Balsam do ciała')).toBeVisible();

  // W koszyku ma być tylko balsam, inaczej zamówienie obejmie też cudze pozycje.
  await page.goto('/koszyk');
  await expect(page.getByText('Pozycji: 1, razem: 18,99 zł')).toBeVisible();
  await page.getByRole('button', { name: 'Złóż zamówienie (płatność przy odbiorze)' }).click();

  // Numer nowego zamówienia aplikacja podaje w adresie strony.
  await expect(page).toHaveURL(/\/zamowienia\?zlozono=ZAM-\d+$/);
  const numer = new URL(page.url()).searchParams.get('zlozono') ?? '';
  await expect(page.getByRole('heading', { name: 'Moje zamówienia' })).toBeVisible();
  await expect(page.getByText(`Złożono zamówienie: ${numer}`)).toBeVisible();

  const zamowienie = page.getByRole('row').filter({ hasText: numer });
  await expect(zamowienie.getByRole('cell', { name: 'Balsam do ciała', exact: true })).toBeVisible();
  await expect(zamowienie.getByRole('cell', { name: 'Nowe', exact: true })).toBeVisible();

  // Na stronie „Produkty” stan balsamu jest mniejszy o 1.
  await page.goto('/');
  await expect(balsam.getByRole('cell', { name: String(stanPrzed - 1), exact: true })).toBeVisible();
});
