import { test, expect } from '@playwright/test';
import { zaloguj } from '../pomocnicze/logowanie';

// Dodatkowy test (spoza P1–P16): karta produktu, którego nie ma na stanie.
// W tabeli na stronie „Produkty” przycisk „Dodaj do koszyka” takiego produktu jest wyłączony;
// karta produktu ma działać tak samo.

test('na karcie niedostępnego Dezodorantu w sprayu przycisk „Dodaj do koszyka” jest wyłączony', async ({ page }) => {
  await zaloguj(page);
  await page.goto('/');

  // Punkt odniesienia: w tabeli produkt jest niedostępny, a przycisk wyłączony.
  const wiersz = page.getByRole('row').filter({ hasText: 'Dezodorant w sprayu' });
  await expect(wiersz.getByRole('cell', { name: 'Niedostępny', exact: true })).toBeVisible();
  await expect(wiersz.getByRole('button', { name: 'Dodaj do koszyka' })).toBeDisabled();

  // Karta produktu otwierana z kafelka.
  await page.getByRole('article', { name: 'Dezodorant w sprayu', exact: true }).getByRole('link', { name: 'Dezodorant w sprayu' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Dezodorant w sprayu' })).toBeVisible();
  await expect(page.getByText('Niedostępny', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Dodaj do koszyka' })).toBeDisabled();
});
