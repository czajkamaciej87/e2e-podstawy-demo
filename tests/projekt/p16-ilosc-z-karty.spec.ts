import { test, expect } from '@playwright/test';
import { zaloguj } from '../pomocnicze/logowanie';

// P16. Ilość z karty produktu (E2E).
// Zmiana wymagań Bożeny z 13:00: Biuro Mikołaja kupuje 24 kalendarze adwentowe (po jednym na okienko).

test('24 sztuki Kalendarza adwentowego 2026 dodane z karty produktu dają w koszyku wartość 959,76 zł', async ({ page }) => {
  await zaloguj(page);
  await page.goto('/');

  // Karta produktu otwierana z kafelka.
  await page.getByRole('article', { name: 'Kalendarz adwentowy 2026', exact: true }).getByRole('link', { name: 'Kalendarz adwentowy 2026' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Kalendarz adwentowy 2026' })).toBeVisible();

  await page.getByLabel('Ilość').fill('24');
  await page.getByRole('button', { name: 'Dodaj do koszyka' }).click();
  await expect(page.getByText('Dodano do koszyka: Kalendarz adwentowy 2026')).toBeVisible();

  await page.goto('/koszyk');
  const wiersz = page.getByRole('row').filter({ hasText: 'Kalendarz adwentowy 2026' });
  await expect(wiersz.getByRole('cell', { name: '24', exact: true })).toBeVisible();
  await expect(wiersz.getByRole('cell', { name: '959,76 zł', exact: true })).toBeVisible();

  // W koszyku jest tylko kalendarz, więc suma „razem” to suma kolumny „Wartość”, czyli 959,76 zł.
  await expect(page.getByText('Pozycji: 1, razem: 959,76 zł')).toBeVisible();

  // Sprzątanie: kalendarz znika z koszyka.
  await wiersz.getByRole('button', { name: 'Usuń: Kalendarz adwentowy 2026' }).click();
  await expect(wiersz).toHaveCount(0);
});
