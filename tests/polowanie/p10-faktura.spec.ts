import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { zaloguj } from '../pomocnicze/logowanie';

// P10. Zamówienie na firmę i faktura (E2E).
// Dane firmy ma konto biuro, dlatego logujemy je jawnie.

test.describe('Zamówienie na firmę i faktura', () => {
  // Oba testy używają koszyka konta biuro, więc nie mogą biec równolegle.
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await zaloguj(page, 'biuro', 'biuro123');
    await page.goto('/');
    await page
      .getByRole('row')
      .filter({ hasText: 'Kalendarz adwentowy 2026' })
      .getByRole('button', { name: 'Dodaj do koszyka' })
      .click();
    await expect(page.getByText('Dodano do koszyka: Kalendarz adwentowy 2026')).toBeVisible();
    await page.goto('/koszyk');
    await page.getByLabel('Faktura na firmę').check();
    await page.getByLabel('Nazwa firmy').fill('Biuro Mikołaja');
  });

  test('zamówienie z poprawnym NIP ma fakturę FV/2026/<numer> na Biuro Mikołaja na 39,99 zł', async ({ page }) => {
    await page.getByLabel('NIP').fill('101-202-30-36');
    await page.getByRole('button', { name: 'Złóż zamówienie (płatność przy odbiorze)' }).click();

    // Numer nowego zamówienia aplikacja podaje w adresie strony.
    await expect(page).toHaveURL(/\/zamowienia\?zlozono=ZAM-\d+$/);
    await expect(page.getByRole('heading', { name: 'Moje zamówienia' })).toBeVisible();
    const numer = new URL(page.url()).searchParams.get('zlozono') ?? '';

    // Strona zamówienia: dane do faktury, NIP zapisany bez kresek.
    await page.goto(`/zamowienia/${numer}`);
    await expect(page.getByText('Faktura na firmę: Biuro Mikołaja, NIP 1012023036')).toBeVisible();

    // Pobranie faktury.
    const pobieranie = page.waitForEvent('download');
    await page.getByRole('link', { name: 'Pobierz fakturę' }).click();
    const plik = await pobieranie;
    expect(plik.suggestedFilename()).toBe(`faktura-${numer}.html`);

    // Pobrany plik otwieramy w przeglądarce, żeby sprawdzić go zwykłymi lokatorami.
    await page.setContent(readFileSync(await plik.path(), 'utf8'));
    await expect(page.getByRole('heading', { name: `Faktura FV/2026/${numer}` })).toBeVisible();
    // Nazwa nabywcy i jego NIP są w jednym akapicie pod nagłówkiem „Nabywca”.
    await expect(page.getByText('NIP nabywcy: 1012023036')).toContainText('Biuro Mikołaja');
    await expect(page.getByText('Razem do zapłaty: 39,99 zł')).toBeVisible();
  });

  test('NIP z błędną sumą kontrolną zatrzymuje zamówienie i klient zostaje w koszyku', async ({ page }) => {
    await page.getByLabel('NIP').fill('101-202-30-37');
    await page.getByRole('button', { name: 'Złóż zamówienie (płatność przy odbiorze)' }).click();

    await expect(page.getByText('Nieprawidłowy NIP: błędna suma kontrolna')).toBeVisible();
    await expect(page).toHaveURL(/\/koszyk/);
    await expect(page.getByRole('heading', { name: 'Koszyk' })).toBeVisible();

    // Sprzątanie: kalendarz znika z koszyka.
    const wiersz = page.getByRole('row').filter({ hasText: 'Kalendarz adwentowy 2026' });
    await wiersz.getByRole('button', { name: 'Usuń: Kalendarz adwentowy 2026' }).click();
    await expect(wiersz).toHaveCount(0);
  });
});
