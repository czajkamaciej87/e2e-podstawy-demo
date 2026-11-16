import { test, expect } from '@playwright/test';

// Ćwiczenie 04, scenariusz A: filtr kategorii na stronie „Produkty”.
// Karta: docs/cwiczenia/04-locatory-codegen.md
// Kod nagraj Codegenem, wklej tutaj i popraw. Potem zamień `test.fixme` na `test`.

test('filtr „Dziecko” pokazuje tylko produkty dla dzieci', async ({ page }) => {
  // TODO 1: otwórz stronę „Produkty” (adres /).
  // TODO 2: w polu „Kategoria” wybierz „Dziecko” i kliknij „Filtruj”.
  // TODO 3: sprawdź, że „Liczba produktów” to 3.
  // TODO 4: sprawdź, że widać „Chusteczki nawilżane dla dzieci”, „Szampon dla dzieci” i „Krem ochronny dla dzieci”.
  // TODO 5: sprawdź, że NIE widać „Szampon nawilżający” (kategoria Włosy).
  await page.goto('http://localhost:4100/');
  await page.getByLabel('Kategoria WszystkieCiał').selectOption('Dziecko');
  await page.getByRole('button', { name: 'Filtruj' }).click();
  await expect(page.getByTestId('product-count')).toContainText('3');
  await expect(page.locator('tbody')).toContainText('Chusteczki nawilżane dla dzieci');
  await expect(page.locator('tbody')).toContainText('Krem ochronny dla dzieci');
  await expect(page.locator('tbody')).toContainText('Szampon dla dzieci');
});
