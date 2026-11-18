# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projekt\dod-koszyk-po-usunieciu.spec.ts >> po usunięciu jedynego produktu koszyk od razu pokazuje „Pozycji: 0, razem: 0,00 zł”
- Location: tests\projekt\dod-koszyk-po-usunieciu.spec.ts:13:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Pozycji: 0, razem: 0,00 zł')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Pozycji: 0, razem: 0,00 zł') with timeout 5000ms
  - waiting for getByText('Pozycji: 0, razem: 0,00 zł')

```

```yaml
- banner:
  - link "namssor":
    - /url: /
  - navigation "Menu główne":
    - link "Produkty":
      - /url: /
    - link "Koszyk":
      - /url: /koszyk
    - link "Moje zamówienia":
      - /url: /zamowienia
    - link "Adres dostawy":
      - /url: /konto/adres
    - link "Moje adresy":
      - /url: /konto/adresy
  - text: Zalogowano jako tester11 (user)
  - button "Wyloguj"
- main:
  - heading "Koszyk" [level=1]
  - paragraph: "Pozycji: 1, razem: 0,00 zł"
  - paragraph:
    - text: Koszyk jest pusty.
    - link "Wybierz produkty":
      - /url: /
  - table:
    - rowgroup:
      - row "Produkt Cena Ilość Wartość":
        - columnheader "Produkt"
        - columnheader "Cena"
        - columnheader "Ilość"
        - columnheader "Wartość"
        - columnheader
    - rowgroup
  - button "Złóż zamówienie (płatność przy odbiorze)" [disabled]
- contentinfo:
  - text: Namssor to fikcyjna drogeria do ćwiczeń z automatyzacji testów. Dane są przykładowe. Grzegorz Brzezinka, Prosit AS,
  - link "https://agentgreg.ai":
    - /url: https://agentgreg.ai
  - link "Regulamin":
    - /url: /regulamin
  - link "API":
    - /url: /api/docs
  - text: "Wersja: rc"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { zaloguj } from '../pomocnicze/logowanie';
  3  | 
  4  | // Dodatkowy test (spoza P1–P16): licznik koszyka zaraz po usunięciu ostatniej pozycji.
  5  | // Sprawdzamy stronę, na którą aplikacja przenosi po kliknięciu „Usuń”, bez jej odświeżania.
  6  | 
  7  | test.afterEach(async ({ page }) => {
  8  |   // Sprzątanie na wypadek błędu: test mógł paść, zanim usunął żel z koszyka.
  9  |   const czyszczenie = await page.request.delete('/api/cart');
  10 |   expect(czyszczenie.ok()).toBe(true);
  11 | });
  12 | 
  13 | test('po usunięciu jedynego produktu koszyk od razu pokazuje „Pozycji: 0, razem: 0,00 zł”', async ({ page }) => {
  14 |   await zaloguj(page);
  15 | 
  16 |   // Stan przed testem: koszyk jest pusty.
  17 |   await page.goto('/koszyk');
  18 |   await expect(page.getByText('Pozycji: 0, razem: 0,00 zł')).toBeVisible();
  19 | 
  20 |   // Dodaj żel z tabeli produktów.
  21 |   await page.goto('/');
  22 |   await page.getByRole('row').filter({ hasText: 'Żel pod prysznic' }).getByRole('button', { name: 'Dodaj do koszyka' }).click();
  23 |   await expect(page.getByText('Dodano do koszyka: Żel pod prysznic')).toBeVisible();
  24 | 
  25 |   await page.goto('/koszyk');
  26 |   await expect(page.getByText('Pozycji: 1, razem: 9,99 zł')).toBeVisible();
  27 | 
  28 |   // Usuń jedyną pozycję.
  29 |   const wiersz = page.getByRole('row').filter({ hasText: 'Żel pod prysznic' });
  30 |   await wiersz.getByRole('button', { name: 'Usuń: Żel pod prysznic' }).click();
  31 | 
  32 |   // Strona po usunięciu: brak wiersza, licznik i suma pokazują pusty koszyk.
  33 |   await expect(wiersz).toHaveCount(0);
  34 |   await expect(page.getByText('Koszyk jest pusty.')).toBeVisible();
> 35 |   await expect(page.getByText('Pozycji: 0, razem: 0,00 zł')).toBeVisible();
     |                                                              ^ Error: expect(locator).toBeVisible() failed
  36 | });
  37 | 
```