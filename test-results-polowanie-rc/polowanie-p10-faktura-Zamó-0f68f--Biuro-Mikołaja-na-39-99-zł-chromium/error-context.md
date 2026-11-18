# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: polowanie\p10-faktura.spec.ts >> Zamówienie na firmę i faktura >> zamówienie z poprawnym NIP ma fakturę FV/2026/<numer> na Biuro Mikołaja na 39,99 zł
- Location: tests\polowanie\p10-faktura.spec.ts:26:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByText('NIP nabywcy: 1012023036')
Expected substring: "Biuro Mikołaja"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" getByText('NIP nabywcy: 1012023036') with timeout 5000ms
  - waiting for getByText('NIP nabywcy: 1012023036')

```

```yaml
- heading "Faktura FV/2026/ZAM-1308" [level=1]
- paragraph: "Zamówienie: ZAM-1308 Data wystawienia: 2026-11-18"
- heading "Sprzedawca" [level=2]
- paragraph: "Namssor sp. z o.o. (firma fikcyjna) ul. Szkoleniowa 1, 00-001 Warszawa NIP sprzedawcy: 1234563218"
- heading "Nabywca" [level=2]
- paragraph: "Biuro Mikołaja NIP nabywcy: 1234563218"
- table:
  - rowgroup:
    - row "Lp. Nazwa Ilość Cena Wartość":
      - columnheader "Lp."
      - columnheader "Nazwa"
      - columnheader "Ilość"
      - columnheader "Cena"
      - columnheader "Wartość"
  - rowgroup:
    - row "1 Kalendarz adwentowy 2026 1 39,99 zł 39,99 zł":
      - cell "1"
      - cell "Kalendarz adwentowy 2026"
      - cell "1"
      - cell "39,99 zł"
      - cell "39,99 zł"
- paragraph:
  - strong: "Razem do zapłaty: 39,99 zł"
  - text: (kwoty brutto)
- paragraph: Dokument wygenerowany przez aplikację szkoleniową Namssor. Nie jest prawdziwą fakturą.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { readFileSync } from 'node:fs';
  3  | import { zaloguj } from '../pomocnicze/logowanie';
  4  | 
  5  | // P10. Zamówienie na firmę i faktura (E2E).
  6  | // Dane firmy ma konto biuro, dlatego logujemy je jawnie.
  7  | 
  8  | test.describe('Zamówienie na firmę i faktura', () => {
  9  |   // Oba testy używają koszyka konta biuro, więc nie mogą biec równolegle.
  10 |   test.describe.configure({ mode: 'serial' });
  11 | 
  12 |   test.beforeEach(async ({ page }) => {
  13 |     await zaloguj(page, 'biuro', 'biuro123');
  14 |     await page.goto('/');
  15 |     await page
  16 |       .getByRole('row')
  17 |       .filter({ hasText: 'Kalendarz adwentowy 2026' })
  18 |       .getByRole('button', { name: 'Dodaj do koszyka' })
  19 |       .click();
  20 |     await expect(page.getByText('Dodano do koszyka: Kalendarz adwentowy 2026')).toBeVisible();
  21 |     await page.goto('/koszyk');
  22 |     await page.getByLabel('Faktura na firmę').check();
  23 |     await page.getByLabel('Nazwa firmy').fill('Biuro Mikołaja');
  24 |   });
  25 | 
  26 |   test('zamówienie z poprawnym NIP ma fakturę FV/2026/<numer> na Biuro Mikołaja na 39,99 zł', async ({ page }) => {
  27 |     await page.getByLabel('NIP').fill('101-202-30-36');
  28 |     await page.getByRole('button', { name: 'Złóż zamówienie (płatność przy odbiorze)' }).click();
  29 | 
  30 |     // Numer nowego zamówienia aplikacja podaje w adresie strony.
  31 |     await expect(page).toHaveURL(/\/zamowienia\?zlozono=ZAM-\d+$/);
  32 |     await expect(page.getByRole('heading', { name: 'Moje zamówienia' })).toBeVisible();
  33 |     const numer = new URL(page.url()).searchParams.get('zlozono') ?? '';
  34 | 
  35 |     // Strona zamówienia: dane do faktury, NIP zapisany bez kresek.
  36 |     await page.goto(`/zamowienia/${numer}`);
  37 |     await expect(page.getByText('Faktura na firmę: Biuro Mikołaja, NIP 1012023036')).toBeVisible();
  38 | 
  39 |     // Pobranie faktury.
  40 |     const pobieranie = page.waitForEvent('download');
  41 |     await page.getByRole('link', { name: 'Pobierz fakturę' }).click();
  42 |     const plik = await pobieranie;
  43 |     expect(plik.suggestedFilename()).toBe(`faktura-${numer}.html`);
  44 | 
  45 |     // Pobrany plik otwieramy w przeglądarce, żeby sprawdzić go zwykłymi lokatorami.
  46 |     await page.setContent(readFileSync(await plik.path(), 'utf8'));
  47 |     await expect(page.getByRole('heading', { name: `Faktura FV/2026/${numer}` })).toBeVisible();
  48 |     // Nazwa nabywcy i jego NIP są w jednym akapicie pod nagłówkiem „Nabywca”.
> 49 |     await expect(page.getByText('NIP nabywcy: 1012023036')).toContainText('Biuro Mikołaja');
     |                                                             ^ Error: expect(locator).toContainText(expected) failed
  50 |     await expect(page.getByText('Razem do zapłaty: 39,99 zł')).toBeVisible();
  51 |   });
  52 | 
  53 |   test('NIP z błędną sumą kontrolną zatrzymuje zamówienie i klient zostaje w koszyku', async ({ page }) => {
  54 |     await page.getByLabel('NIP').fill('101-202-30-37');
  55 |     await page.getByRole('button', { name: 'Złóż zamówienie (płatność przy odbiorze)' }).click();
  56 | 
  57 |     await expect(page.getByText('Nieprawidłowy NIP: błędna suma kontrolna')).toBeVisible();
  58 |     await expect(page).toHaveURL(/\/koszyk/);
  59 |     await expect(page.getByRole('heading', { name: 'Koszyk' })).toBeVisible();
  60 | 
  61 |     // Sprzątanie: kalendarz znika z koszyka.
  62 |     const wiersz = page.getByRole('row').filter({ hasText: 'Kalendarz adwentowy 2026' });
  63 |     await wiersz.getByRole('button', { name: 'Usuń: Kalendarz adwentowy 2026' }).click();
  64 |     await expect(wiersz).toHaveCount(0);
  65 |   });
  66 | });
  67 | 
```