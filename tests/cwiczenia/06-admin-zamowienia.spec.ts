import { test, expect } from '@playwright/test';

// Ćwiczenie 06: tabela zamówień w panelu admina (/admin/zamowienia).
// Każdy wiersz dostaje nowe, losowe id przy każdym wyświetleniu strony
// i nie ma data-testid. Wiersz trzeba znaleźć po treści.
//
// Gdy test jest gotowy, zamień test.fixme na test i uruchom:
//   npx playwright test tests/cwiczenia/06-admin-zamowienia.spec.ts

test.describe('Panel admina: zamówienia', () => {
  test.beforeEach(async ({ page }) => {
    // Logowanie jako administrator i przejście do listy zamówień
    await page.goto('/logowanie');
    await page.getByLabel('Login').fill('admin');
    await page.getByLabel('Hasło').fill('admin123');
    await page.getByRole('button', { name: 'Zaloguj' }).click();
    await expect(page.getByText('Zalogowano jako admin')).toBeVisible();
    await page.goto('/admin/zamowienia');
  });

  test('anulowanie ZAM-1003 zmienia jego status na „Anulowane”', async ({ page }) => {
    // TODO 1: lokator wiersza z numerem ZAM-1003:
    //   page.getByRole('row').filter({ hasText: 'ZAM-1003' })
    // TODO 2: sprawdź, że wiersz ma status „Nowe” (stan przed akcją)
    // TODO 3: kliknij „Anuluj” w tym wierszu (szukaj przycisku wewnątrz wiersza)
    // TODO 4: sprawdź komunikat „Anulowano zamówienie ZAM-1003”
    // TODO 5: sprawdź, że wiersz ma status „Anulowane” i nie ma już przycisku „Anuluj”
    
      // Wiersz szukamy po numerze zamówienia, bo id wierszy są losowe
      const wiersz = page.getByRole('row').filter({ hasText: 'ZAM-1003' });
  
      // Stan przed akcją: zamówienie jest nowe
      await expect(wiersz).toContainText('Nowe');
  
      // Przycisk „Anuluj” szukamy tylko w tym wierszu, nie na całej stronie
      await wiersz.getByRole('button', { name: 'Anuluj' }).click();
  
      // Komunikat po anulowaniu
      await expect(page.getByText('Anulowano zamówienie ZAM-1003')).toBeVisible();
  
      // Stan po akcji: status „Anulowane” i brak przycisku „Anuluj”
      await expect(wiersz).toContainText('Anulowane');
      await expect(wiersz.getByRole('button', { name: 'Anuluj' })).toHaveCount(0);
    });
  

  test('wyszukanie „Mydło” zostawia jedno zamówienie, ZAM-1006', async ({ page }) => {
    // TODO 1: wpisz „Mydło” w pole „Szukaj zamówienia” i kliknij „Szukaj”
    // TODO 2: sprawdź napis „Znaleziono: 1”
    // TODO 3: policz wiersze z danymi (wiersz nagłówka nie zawiera „ZAM-”)
    //   i sprawdź, że jedyny wiersz to ZAM-1006
 // Wpisujemy frazę w wyszukiwarkę i zatwierdzamy
 await page.getByLabel('Szukaj zamówienia').fill('Mydło');
 await page.getByRole('button', { name: 'Szukaj' }).click();

 // exact: true, bo bez tego „Znaleziono: 1” pasowałoby też do „Znaleziono: 10”
 await expect(page.getByText('Znaleziono: 1', { exact: true })).toBeVisible();

 // Wiersze z danymi to te, które zawierają numer „ZAM-”, więc nagłówek się nie liczy
 const wierszeZDanymi = page.getByRole('row').filter({ hasText: 'ZAM-' });
 await expect(wierszeZDanymi).toHaveCount(1);
 await expect(wierszeZDanymi).toContainText('ZAM-1006');
  });

  test('wyszukanie nieistniejącego numeru daje pustą tabelę', async ({ page }) => {
    // TODO 1: wyszukaj „ZAM-9999”
    // TODO 2: sprawdź napis „Znaleziono: 0” i brak wierszy z danymi
  // Szukamy numeru, którego nie ma w bazie
  await page.getByLabel('Szukaj zamówienia').fill('ZAM-9999');
  await page.getByRole('button', { name: 'Szukaj' }).click();

  // Licznik pokazuje zero, a w tabeli nie ma żadnego wiersza z danymi
  await expect(page.getByText('Znaleziono: 0', { exact: true })).toBeVisible();
  await expect(page.getByRole('row').filter({ hasText: 'ZAM-' })).toHaveCount(0);
  });
});
