import { test, expect } from '@playwright/test';
import { zaloguj } from '../pomocnicze/logowanie';

// Dodatkowy test (spoza P1–P16): sortowanie produktów po cenie na stronie „Produkty”.
// Kategoria Dziecko ma 3 produkty: Chusteczki 7,99 zł, Szampon 10,99 zł, Krem ochronny 14,99 zł.
// Ceny 7,99 / 10,99 / 14,99 wykrywają sortowanie po tekście zamiast po liczbie
// (jako tekst „10,99” jest przed „7,99”).

test.describe('Sortowanie produktów po cenie', () => {
  test.beforeEach(async ({ page }) => {
    await zaloguj(page);
    await page.goto('/');
    await page.getByLabel('Kategoria').selectOption('Dziecko');
  });

  test('sortowanie „Cena: od najniższej” ustawia produkty od 7,99 zł do 14,99 zł', async ({ page }) => {
    await page.getByLabel('Sortuj').selectOption('Cena: od najniższej');
    await page.getByRole('button', { name: 'Filtruj' }).click();

    // Wiersze produktów (nagłówek tabeli nie zawiera nazwy kategorii).
    const wiersze = page.getByRole('row').filter({ hasText: 'Dziecko' });
    await expect(wiersze).toHaveText([
      /Chusteczki nawilżane dla dzieci.*7,99 zł/,
      /Szampon dla dzieci.*10,99 zł/,
      /Krem ochronny dla dzieci.*14,99 zł/,
    ]);
  });

  test('sortowanie „Cena: od najwyższej” ustawia produkty od 14,99 zł do 7,99 zł', async ({ page }) => {
    await page.getByLabel('Sortuj').selectOption('Cena: od najwyższej');
    await page.getByRole('button', { name: 'Filtruj' }).click();

    const wiersze = page.getByRole('row').filter({ hasText: 'Dziecko' });
    await expect(wiersze).toHaveText([
      /Krem ochronny dla dzieci.*14,99 zł/,
      /Szampon dla dzieci.*10,99 zł/,
      /Chusteczki nawilżane dla dzieci.*7,99 zł/,
    ]);
  });
});
