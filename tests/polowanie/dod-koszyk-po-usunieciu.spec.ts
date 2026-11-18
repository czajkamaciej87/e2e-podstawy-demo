import { test, expect } from '@playwright/test';
import { zaloguj } from '../pomocnicze/logowanie';

// Dodatkowy test (spoza P1–P16): licznik koszyka zaraz po usunięciu ostatniej pozycji.
// Sprawdzamy stronę, na którą aplikacja przenosi po kliknięciu „Usuń”, bez jej odświeżania.

test.afterEach(async ({ page }) => {
  // Sprzątanie na wypadek błędu: test mógł paść, zanim usunął żel z koszyka.
  const czyszczenie = await page.request.delete('/api/cart');
  expect(czyszczenie.ok()).toBe(true);
});

test('po usunięciu jedynego produktu koszyk od razu pokazuje „Pozycji: 0, razem: 0,00 zł”', async ({ page }) => {
  await zaloguj(page);

  // Stan przed testem: koszyk jest pusty.
  await page.goto('/koszyk');
  await expect(page.getByText('Pozycji: 0, razem: 0,00 zł')).toBeVisible();

  // Dodaj żel z tabeli produktów.
  await page.goto('/');
  await page.getByRole('row').filter({ hasText: 'Żel pod prysznic' }).getByRole('button', { name: 'Dodaj do koszyka' }).click();
  await expect(page.getByText('Dodano do koszyka: Żel pod prysznic')).toBeVisible();

  await page.goto('/koszyk');
  await expect(page.getByText('Pozycji: 1, razem: 9,99 zł')).toBeVisible();

  // Usuń jedyną pozycję.
  const wiersz = page.getByRole('row').filter({ hasText: 'Żel pod prysznic' });
  await wiersz.getByRole('button', { name: 'Usuń: Żel pod prysznic' }).click();

  // Strona po usunięciu: brak wiersza, licznik i suma pokazują pusty koszyk.
  await expect(wiersz).toHaveCount(0);
  await expect(page.getByText('Koszyk jest pusty.')).toBeVisible();
  await expect(page.getByText('Pozycji: 0, razem: 0,00 zł')).toBeVisible();
});
