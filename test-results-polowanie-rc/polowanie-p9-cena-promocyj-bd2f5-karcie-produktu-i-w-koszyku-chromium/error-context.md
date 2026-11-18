# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: polowanie\p9-cena-promocyjna.spec.ts >> Krem do twarzy na dzień ma cenę promocyjną 26,39 zł na kafelku, na karcie produktu i w koszyku
- Location: tests\polowanie\p9-cena-promocyjna.spec.ts:6:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('row').filter({ hasText: 'Krem do twarzy na dzień' }).getByRole('cell', { name: '32,99 zł 26,39 zł -20%', exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('row').filter({ hasText: 'Krem do twarzy na dzień' }).getByRole('cell', { name: '32,99 zł 26,39 zł -20%', exact: true }) with timeout 5000ms
  - waiting for getByRole('row').filter({ hasText: 'Krem do twarzy na dzień' }).getByRole('cell', { name: '32,99 zł 26,39 zł -20%', exact: true })

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
  - paragraph: "Pozycji: 1, razem: 21,11 zł"
  - table:
    - rowgroup:
      - row "Produkt Cena Ilość Wartość":
        - columnheader "Produkt"
        - columnheader "Cena"
        - columnheader "Ilość"
        - columnheader "Wartość"
        - columnheader
    - rowgroup:
      - 'row "Krem do twarzy na dzień 32,99 zł 21,11 zł -20% 1 21,11 zł Usuń: Krem do twarzy na dzień"':
        - cell "Krem do twarzy na dzień"
        - cell "32,99 zł 21,11 zł -20%"
        - cell "1"
        - cell "21,11 zł"
        - 'cell "Usuń: Krem do twarzy na dzień"':
          - 'button "Usuń: Krem do twarzy na dzień"': Usuń
  - text: Kod rabatowy
  - textbox "Kod rabatowy"
  - button "Zastosuj kod"
  - paragraph:
    - checkbox "Faktura na firmę"
    - text: Faktura na firmę
  - button "Złóż zamówienie (płatność przy odbiorze)"
  - link "Zapłać kartą online":
    - /url: /koszyk/platnosc
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
  4  | // P9. Ta sama cena promocyjna w trzech miejscach (E2E).
  5  | 
  6  | test('Krem do twarzy na dzień ma cenę promocyjną 26,39 zł na kafelku, na karcie produktu i w koszyku', async ({ page }) => {
  7  |   await zaloguj(page);
  8  |   await page.goto('/');
  9  | 
  10 |   // Kafelek: stara cena przekreślona, nowa cena i plakietka.
  11 |   const kafelek = page.getByRole('article', { name: 'Krem do twarzy na dzień', exact: true });
  12 |   await expect(kafelek.getByText('32,99 zł', { exact: true })).toHaveCSS('text-decoration-line', 'line-through');
  13 |   await expect(kafelek.getByText('26,39 zł', { exact: true })).toBeVisible();
  14 |   await expect(kafelek.getByText('-20%', { exact: true })).toBeVisible();
  15 | 
  16 |   // Karta produktu: te same ceny i plakietka.
  17 |   await kafelek.getByRole('link', { name: 'Krem do twarzy na dzień' }).click();
  18 |   const karta = page.getByRole('article').filter({
  19 |     has: page.getByRole('heading', { level: 1, name: 'Krem do twarzy na dzień' }),
  20 |   });
  21 |   await expect(karta.getByText('32,99 zł', { exact: true })).toHaveCSS('text-decoration-line', 'line-through');
  22 |   await expect(karta.getByText('26,39 zł', { exact: true })).toBeVisible();
  23 |   await expect(karta.getByText('-20%', { exact: true })).toBeVisible();
  24 | 
  25 |   // Koszyk: w wierszu kremu cena promocyjna 26,39 zł.
  26 |   await karta.getByRole('button', { name: 'Dodaj do koszyka' }).click();
  27 |   await expect(page.getByText('Dodano do koszyka: Krem do twarzy na dzień')).toBeVisible();
  28 |   await page.goto('/koszyk');
  29 |   const wiersz = page.getByRole('row').filter({ hasText: 'Krem do twarzy na dzień' });
> 30 |   await expect(wiersz.getByRole('cell', { name: '32,99 zł 26,39 zł -20%', exact: true })).toBeVisible();
     |                                                                                           ^ Error: expect(locator).toBeVisible() failed
  31 |   await expect(wiersz.getByRole('cell', { name: '26,39 zł', exact: true })).toBeVisible();
  32 | 
  33 |   // Sprzątanie: krem znika z koszyka.
  34 |   await wiersz.getByRole('button', { name: 'Usuń: Krem do twarzy na dzień' }).click();
  35 |   await expect(wiersz).toHaveCount(0);
  36 | });
  37 | 
```