import { test, expect } from '@playwright/test';
import { zaloguj } from '../pomocnicze/logowanie';

// Dodatkowy test (spoza P1–P16): cena promocyjna w złożonym zamówieniu.
// P9 sprawdza cenę promocyjną kremu w koszyku; ten test sprawdza, że do zamówienia trafia
// cena promocyjna innego produktu, a nie cena obniżona drugi raz.
// Zamówienia nie da się usunąć, więc każde uruchomienie zostawia jedno zamówienie odżywki.

test('zamówienie Odżywki do włosów w promocji ma wartość 11,99 zł na liście zamówień i w API', async ({ page }) => {
  await zaloguj(page);
  await page.goto('/');

  // Punkt odniesienia: cena regularna 14,99 zł, promocyjna 11,99 zł (-20%).
  const odzywka = page.getByRole('row').filter({ hasText: 'Odżywka do włosów' });
  await expect(odzywka.getByRole('cell', { name: '14,99 zł 11,99 zł', exact: true })).toBeVisible();
  await odzywka.getByRole('button', { name: 'Dodaj do koszyka' }).click();
  await expect(page.getByText('Dodano do koszyka: Odżywka do włosów')).toBeVisible();

  // W koszyku ma być tylko odżywka, żeby zamówienie zawierało jedną pozycję.
  await page.goto('/koszyk');
  await expect(page.getByText(/^Pozycji: 1,/)).toBeVisible();
  await page.getByRole('button', { name: 'Złóż zamówienie (płatność przy odbiorze)' }).click();

  // Numer nowego zamówienia aplikacja podaje w adresie strony.
  await expect(page).toHaveURL(/\/zamowienia\?zlozono=ZAM-\d+$/);
  const numer = new URL(page.url()).searchParams.get('zlozono') ?? '';

  // Lista „Moje zamówienia”: wartość zamówienia to cena promocyjna.
  const zamowienie = page.getByRole('row').filter({ hasText: numer });
  await expect(zamowienie.getByRole('cell', { name: 'Odżywka do włosów', exact: true })).toBeVisible();
  await expect(zamowienie.getByRole('cell', { name: '11,99 zł', exact: true })).toBeVisible();

  // To samo zamówienie w API: 11,99 zł to 1199 groszy.
  const odpowiedz = await page.request.get(`/api/orders/${numer}`);
  expect(odpowiedz.status()).toBe(200);
  expect((await odpowiedz.json()).total_cents).toBe(1199);
});
