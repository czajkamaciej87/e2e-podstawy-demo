import { test, expect } from '@playwright/test';
import { zaloguj } from '../pomocnicze/logowanie';

// P16. Ilość z karty produktu (E2E).

test('3 sztuki Żelu pod prysznic dodane z karty produktu dają w koszyku wartość 29,97 zł', async ({ page }) => {
  await zaloguj(page);
  await page.goto('/');

  // Karta produktu otwierana z kafelka.
  await page.getByRole('article', { name: 'Żel pod prysznic', exact: true }).getByRole('link', { name: 'Żel pod prysznic' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Żel pod prysznic' })).toBeVisible();

  await page.getByLabel('Ilość').fill('3');
  await page.getByRole('button', { name: 'Dodaj do koszyka' }).click();
  await expect(page.getByText('Dodano do koszyka: Żel pod prysznic')).toBeVisible();

  await page.goto('/koszyk');
  const wiersz = page.getByRole('row').filter({ hasText: 'Żel pod prysznic' });
  await expect(wiersz.getByRole('cell', { name: '3', exact: true })).toBeVisible();
  await expect(wiersz.getByRole('cell', { name: '29,97 zł', exact: true })).toBeVisible();

  // W koszyku jest tylko żel, więc suma „razem” to suma kolumny „Wartość”, czyli 29,97 zł.
  await expect(page.getByText('Pozycji: 1, razem: 29,97 zł')).toBeVisible();

  // Sprzątanie: żel znika z koszyka.
  await wiersz.getByRole('button', { name: 'Usuń: Żel pod prysznic' }).click();
  await expect(wiersz).toHaveCount(0);
});
