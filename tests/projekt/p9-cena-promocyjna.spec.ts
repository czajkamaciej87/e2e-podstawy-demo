import { test, expect } from '@playwright/test';
import { zaloguj } from '../pomocnicze/logowanie';

// P9. Ta sama cena promocyjna w trzech miejscach (E2E).

test('Krem do twarzy na dzień ma cenę promocyjną 26,39 zł na kafelku, na karcie produktu i w koszyku', async ({ page }) => {
  await zaloguj(page);
  await page.goto('/');

  // Kafelek: stara cena przekreślona, nowa cena i plakietka.
  const kafelek = page.getByRole('article', { name: 'Krem do twarzy na dzień', exact: true });
  await expect(kafelek.getByText('32,99 zł', { exact: true })).toHaveCSS('text-decoration-line', 'line-through');
  await expect(kafelek.getByText('26,39 zł', { exact: true })).toBeVisible();
  await expect(kafelek.getByText('-20%', { exact: true })).toBeVisible();

  // Karta produktu: te same ceny i plakietka.
  await kafelek.getByRole('link', { name: 'Krem do twarzy na dzień' }).click();
  const karta = page.getByRole('article').filter({
    has: page.getByRole('heading', { level: 1, name: 'Krem do twarzy na dzień' }),
  });
  await expect(karta.getByText('32,99 zł', { exact: true })).toHaveCSS('text-decoration-line', 'line-through');
  await expect(karta.getByText('26,39 zł', { exact: true })).toBeVisible();
  await expect(karta.getByText('-20%', { exact: true })).toBeVisible();

  // Koszyk: w wierszu kremu cena promocyjna 26,39 zł.
  await karta.getByRole('button', { name: 'Dodaj do koszyka' }).click();
  await expect(page.getByText('Dodano do koszyka: Krem do twarzy na dzień')).toBeVisible();
  await page.goto('/koszyk');
  const wiersz = page.getByRole('row').filter({ hasText: 'Krem do twarzy na dzień' });
  await expect(wiersz.getByRole('cell', { name: '32,99 zł 26,39 zł -20%', exact: true })).toBeVisible();
  await expect(wiersz.getByRole('cell', { name: '26,39 zł', exact: true })).toBeVisible();

  // Sprzątanie: krem znika z koszyka.
  await wiersz.getByRole('button', { name: 'Usuń: Krem do twarzy na dzień' }).click();
  await expect(wiersz).toHaveCount(0);
});
