import { test, expect } from '@playwright/test';
import { zaloguj } from '../pomocnicze/logowanie';

// Dodatkowy test (spoza P1–P16): walidacja kodu pocztowego w formularzu „Moje adresy”.
// Wymagany format podaje sama aplikacja: podpowiedź „Format: 00-000” przy polu.

// Unikalna nazwa, żeby sprzątanie usunęło tylko adres z tego testu.
const nazwa = `Zły kod ${Date.now()}`;

test.afterEach(async ({ page }) => {
  // Sprzątanie na wypadek błędu: aplikacja mogła zapisać adres mimo złego kodu.
  const adresy = await (await page.request.get('/api/account/addresses')).json();
  for (const adres of adresy.filter((a: { name: string }) => a.name === nazwa)) {
    await page.request.delete(`/api/account/addresses/${adres.id}`);
  }
});

test('kod pocztowy bez kreski „00950” jest odrzucany i adres nie zostaje zapisany', async ({ page }) => {
  await zaloguj(page);
  await page.goto('/konto/adresy');

  await page.getByLabel('Nazwa adresu').fill(nazwa);
  await page.getByLabel('Ulica i numer').fill('ul. Biurowa 7');
  await page.getByLabel('Kod pocztowy').fill('00950');
  await page.getByLabel('Miasto').fill('Warszawa');
  await page.getByLabel('Telefon').fill('600 700 800');
  await page.getByRole('button', { name: 'Dodaj adres' }).click();

  await expect(page.getByText('Kod pocztowy musi mieć format 00-000')).toBeVisible();
  await expect(page.getByLabel('Kod pocztowy')).toHaveAttribute('aria-invalid', 'true');
  // Adres z błędnym kodem nie pojawia się na liście.
  await expect(page.getByRole('article').filter({ hasText: nazwa })).toHaveCount(0);
});
