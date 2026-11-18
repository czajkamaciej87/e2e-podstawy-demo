import { test, expect } from '@playwright/test';
import { zaloguj } from '../pomocnicze/logowanie';

// P3. Administrator dodaje produkt (E2E).
// Test wymaga konta admin, więc uruchamiamy go tylko lokalnie.

test('produkt dodany przez administratora jest w wyszukiwarce jako dostępny za 12,50 zł', async ({ page }) => {
  // Unikalna nazwa, bo produktu nie da się usunąć, a test ma działać przy każdym uruchomieniu.
  const nazwa = `Test P3 ${Date.now()}`;

  await zaloguj(page, 'admin', 'admin123');
  await page.goto('/admin/produkty');

  await page.getByLabel('Nazwa').fill(nazwa);
  await page.getByLabel('Kategoria').fill('Testowe');
  await page.getByLabel('Cena (zł)').fill('12,50');
  await page.getByLabel('Stan').fill('5');
  await page.getByRole('button', { name: 'Dodaj produkt' }).click();

  await expect(page.getByText(`Dodano produkt: ${nazwa}`)).toBeVisible();

  // Wyszukiwarka na stronie „Produkty” znajduje nowy produkt.
  await page.goto('/');
  await page.getByLabel('Szukaj produktu').fill(nazwa);
  await page.getByRole('button', { name: 'Filtruj' }).click();

  // Pod tabelą są kafelki z tą samą nazwą i ceną, więc sprawdzamy w wierszu tabeli.
  const wiersz = page.getByRole('row').filter({ hasText: nazwa });
  await expect(wiersz.getByRole('cell', { name: '12,50 zł', exact: true })).toBeVisible();
  await expect(wiersz.getByRole('cell', { name: 'Dostępny', exact: true })).toBeVisible();
  await expect(wiersz.getByRole('button', { name: 'Dodaj do koszyka' })).toBeEnabled();
});
