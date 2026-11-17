//import { test, expect } from '@playwright/test';

// Ćwiczenie 08, część B: zamówienie firmowe „Biuro Mikołaja” → status → faktura.
// Przypadek testowy: docs/scenariusze/biuro-mikolaja.md (kroki 1–10),
// ten sam scenariusz w Gherkinie: docs/scenariusze/biuro-mikolaja.feature.
//
// Gdy test jest gotowy, zamień test.fixme na test i uruchom:
//   npx playwright test tests/cwiczenia/08-biuro-mikolaja.spec.ts

//test.fixme('Biuro Mikołaja: zamówienie na firmę, status „Wysłane” i faktura z NIP nabywcy', async ({ page }) => {
  // Krok 1 (gotowy). Logowanie klienta firmowego. Koszyk musi być pusty (warunek wstępny):
  // po nieudanym przebiegu mogły w nim zostać kalendarze. DELETE /api/cart opróżnia koszyk
  // zalogowanego klienta; page.request korzysta z logowania z tej przeglądarki.
  //await page.goto('/logowanie');
  //await page.getByLabel('Login').fill('biuro');
  //await page.getByLabel('Hasło').fill('biuro123');
  //await page.getByRole('button', { name: 'Zaloguj' }).click();
  //await expect(page.getByText('Zalogowano jako biuro')).toBeVisible();
  //await page.request.delete('/api/cart');

  // TODO 2: karta produktu /produkt/21, „Ilość” 10, „Dodaj do koszyka”, sprawdź komunikat
  // TODO 3: koszyk: ilość 10 w wierszu kalendarza, jedna pozycja, razem 399,90 zł
  // TODO 4: „Faktura na firmę”, NIP i nazwa firmy, „Złóż zamówienie (płatność przy odbiorze)”.
  //   Komunikat „Złożono zamówienie: …” znika po kilku sekundach: sprawdź go od razu.
  //   Numer zamówienia jest w adresie strony (/zamowienia?zlozono=ZAM-1008):
  //     const numer = new URL(page.url()).searchParams.get('zlozono') ?? '';
  // TODO 5: strona zamówienia: status „Nowe”, NIP 2412241228, link „Pobierz fakturę”
  // TODO 6–8: „Wyloguj”, logowanie jako admin, /admin/zamowienia/<numer>,
  //   status „Opłacone”, „Zapisz status”, potem „Wysłane”. Po każdym zapisie sprawdź status.
  //   Lista „Status zamówienia” to <select>: selectOption('Opłacone').
  // TODO 9: „Wyloguj”, logowanie jako biuro, /zamowienia/<numer>: status „Wysłane”
  // TODO 10: pobranie faktury. Najpierw page.waitForEvent('download') do zmiennej, potem kliknięcie,
  //   potem await tej zmiennej. Sprawdź nazwę pliku (suggestedFilename) i treść:
  //   NIP nabywcy, pozycję z ilością 10 i wartością, „Razem do zapłaty: 399,90 zł”.
  //   Treść pliku: fs.readFileSync(await pobieranie.path(), 'utf8') (import fs from 'node:fs').
  //   Plik to strona HTML: page.setContent(tresc) wczytuje go do przeglądarki, potem zwykłe lokatory.
//});
import { test, expect } from '@playwright/test';
import fs from 'node:fs';

// Ćwiczenie 08, część B: zamówienie firmowe „Biuro Mikołaja” → status → faktura.
// Przypadek testowy: docs/scenariusze/biuro-mikolaja.md (kroki 1–10),
// ten sam scenariusz w Gherkinie: docs/scenariusze/biuro-mikolaja.feature.
//
// Uruchomienie:
//   npx playwright test tests/cwiczenia/08-biuro-mikolaja.spec.ts

test('Biuro Mikołaja: zamówienie na firmę, status „Wysłane” i faktura z NIP nabywcy', async ({ page }) => {
  // Krok 1. Logowanie klienta firmowego. Koszyk musi być pusty (warunek wstępny):
  // po nieudanym przebiegu mogły w nim zostać kalendarze. DELETE /api/cart opróżnia koszyk
  // zalogowanego klienta; page.request korzysta z logowania z tej przeglądarki.
  await page.goto('/logowanie');
  await page.getByLabel('Login').fill('biuro');
  await page.getByLabel('Hasło').fill('biuro123');
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await expect(page.getByText('Zalogowano jako biuro (user)')).toBeVisible();
  const oproznienie = await page.request.delete('/api/cart');
  expect(oproznienie.ok()).toBeTruthy();

  // Krok 2: z karty produktu dodajemy 10 kalendarzy do koszyka.
  await page.goto('/produkt/21');
  await page.getByLabel('Ilość').fill('10');
  await page.getByRole('button', { name: 'Dodaj do koszyka' }).click();
  await expect(page.getByText('Dodano do koszyka: Kalendarz adwentowy 2026')).toBeVisible();

  // Krok 3: w koszyku jest jedna pozycja: 10 kalendarzy za 399,90 zł.
  await page.getByRole('link', { name: 'Koszyk' }).click();
  const wierszKoszyka = page.getByRole('row').filter({ hasText: 'Kalendarz adwentowy 2026' });
  await expect(wierszKoszyka.getByRole('cell', { name: '10', exact: true })).toBeVisible();
  await expect(page.getByText('Pozycji: 1, razem: 399,90 zł')).toBeVisible();

  // Krok 4: zamówienie z fakturą na firmę.
  await page.getByLabel('Faktura na firmę').check();
  await page.getByLabel('NIP').fill('241-224-12-28');
  await page.getByLabel('Nazwa firmy').fill('Biuro Mikołaja');
  await page.getByRole('button', { name: 'Złóż zamówienie (płatność przy odbiorze)' }).click();
  // Komunikat znika po kilku sekundach, więc sprawdzamy go od razu.
  await expect(page.getByText(/Złożono zamówienie: ZAM-\d+/)).toBeVisible();
  // Numer zamówienia bierzemy z adresu strony: /zamowienia?zlozono=ZAM-1008
  const numer = new URL(page.url()).searchParams.get('zlozono') ?? '';

  // Krok 5: strona zamówienia: status „Nowe”, dane firmy i link do faktury.
  await page.getByRole('link', { name: numer }).click();
  await expect(page.getByRole('heading', { name: `Zamówienie ${numer}` })).toBeVisible();
  await expect(page.getByText('Status: Nowe')).toBeVisible();
  await expect(page.getByText('Faktura na firmę: Biuro Mikołaja, NIP 2412241228')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Pobierz fakturę' })).toBeVisible();

  // Krok 6: admin otwiera to zamówienie w panelu.
  await page.getByRole('button', { name: 'Wyloguj' }).click();
  await page.goto('/logowanie');
  await page.getByLabel('Login').fill('admin');
  await page.getByLabel('Hasło').fill('admin123');
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await expect(page.getByText('Zalogowano jako admin')).toBeVisible();
  await page.goto(`/admin/zamowienia/${numer}`);
  await expect(page.getByText('Status: Nowe')).toBeVisible();
  await expect(page.getByLabel('Status zamówienia')).toBeVisible();

  // Krok 7: status „Opłacone”.
  await page.getByLabel('Status zamówienia').selectOption('Opłacone');
  await page.getByRole('button', { name: 'Zapisz status' }).click();
  await expect(page.getByText('Status: Opłacone')).toBeVisible();

  // Krok 8: status „Wysłane”.
  await page.getByLabel('Status zamówienia').selectOption('Wysłane');
  await page.getByRole('button', { name: 'Zapisz status' }).click();
  await expect(page.getByText('Status: Wysłane')).toBeVisible();

  // Krok 9: klient widzi status „Wysłane”.
  await page.getByRole('button', { name: 'Wyloguj' }).click();
  await page.goto('/logowanie');
  await page.getByLabel('Login').fill('biuro');
  await page.getByLabel('Hasło').fill('biuro123');
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await expect(page.getByText('Zalogowano jako biuro (user)')).toBeVisible();
  await page.goto(`/zamowienia/${numer}`);
  await expect(page.getByText('Status: Wysłane')).toBeVisible();

  // Krok 10: pobieramy fakturę. Czekanie na pobieranie zaczynamy przed kliknięciem.
  const czekamNaPobieranie = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Pobierz fakturę' }).click();
  const pobieranie = await czekamNaPobieranie;
  expect(pobieranie.suggestedFilename()).toBe(`faktura-${numer}.html`);

  // Faktura to strona HTML: wczytujemy ją do przeglądarki i sprawdzamy zwykłymi lokatorami.
  const tresc = fs.readFileSync(await pobieranie.path(), 'utf8');
  await page.setContent(tresc);
  // Nazwa i NIP nabywcy są w tym samym akapicie, więc sprawdzamy je razem.
  await expect(page.getByText('NIP nabywcy: 2412241228')).toContainText('Biuro Mikołaja');
  const pozycja = page.getByRole('row').filter({ hasText: 'Kalendarz adwentowy 2026' });
  await expect(pozycja.getByRole('cell', { name: '10', exact: true })).toBeVisible();
  await expect(pozycja.getByRole('cell', { name: '39,99 zł', exact: true })).toBeVisible();
  await expect(pozycja.getByRole('cell', { name: '399,90 zł', exact: true })).toBeVisible();
  await expect(page.getByText('Razem do zapłaty: 399,90 zł')).toBeVisible();
});
