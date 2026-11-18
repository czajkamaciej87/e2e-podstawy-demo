# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: polowanie\dod-sortowanie-po-cenie.spec.ts >> Sortowanie produktów po cenie >> sortowanie „Cena: od najniższej” ustawia produkty od 7,99 zł do 14,99 zł
- Location: tests\polowanie\dod-sortowanie-po-cenie.spec.ts:16:7

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: getByRole('row').filter({ hasText: 'Dziecko' })
Timeout: 5000ms
- Expected  -  3
+ Received  + 18

  Array [
-   /Chusteczki nawilżane dla dzieci.*7,99 zł/,
-   /Szampon dla dzieci.*10,99 zł/,
-   /Krem ochronny dla dzieci.*14,99 zł/,
+   "
+         Szampon dla dzieciDziecko10,99 zł
+         64
+         Dostępny
+         
+         Dodaj do koszyka",
+   "
+         Krem ochronny dla dzieciDziecko14,99 zł
+         50
+         Dostępny
+         
+         Dodaj do koszyka",
+   "
+         Chusteczki nawilżane dla dzieciDziecko7,99 zł
+         200
+         Dostępny
+         
+         Dodaj do koszyka",
  ]

Call log:
  - Expect "toHaveText" getByRole('row').filter({ hasText: 'Dziecko' }) with timeout 5000ms
  - waiting for getByRole('row').filter({ hasText: 'Dziecko' })
    14 × locator resolved to 3 elements

```

# Page snapshot

```yaml
- generic [active] [ref=f3e1]:
  - banner [ref=f3e2]:
    - generic [ref=f3e3]:
      - link "namssor" [ref=f3e4] [cursor=pointer]:
        - /url: /
      - navigation "Menu główne" [ref=f3e8]:
        - link "Produkty" [ref=f3e9] [cursor=pointer]:
          - /url: /
        - link "Koszyk" [ref=f3e10] [cursor=pointer]:
          - /url: /koszyk
        - link "Moje zamówienia" [ref=f3e11] [cursor=pointer]:
          - /url: /zamowienia
        - link "Adres dostawy" [ref=f3e12] [cursor=pointer]:
          - /url: /konto/adres
        - link "Moje adresy" [ref=f3e13] [cursor=pointer]:
          - /url: /konto/adresy
      - generic [ref=f3e14]:
        - generic [ref=f3e15]: Zalogowano jako tester11 (user)
        - button "Wyloguj" [ref=f3e17] [cursor=pointer]
  - main [ref=f3e18]:
    - heading "Produkty" [level=1] [ref=f3e19]
    - search [ref=f3e20]:
      - generic [ref=f3e21]:
        - text: Szukaj produktu
        - searchbox "Szukaj produktu" [ref=f3e22]
      - generic [ref=f3e23]:
        - text: Kategoria
        - combobox "Kategoria" [ref=f3e24]:
          - option "Wszystkie"
          - option "Ciało"
          - option "Dom"
          - option "Dziecko" [selected]
          - option "Higiena jamy ustnej"
          - option "Twarz"
          - option "Włosy"
          - option "Święta"
      - generic [ref=f3e25]:
        - text: Sortuj
        - combobox "Sortuj" [ref=f3e26]:
          - option "Domyślnie"
          - 'option "Cena: od najniższej" [selected]'
          - 'option "Cena: od najwyższej"'
          - 'option "Nazwa: A–Z"'
      - button "Filtruj" [ref=f3e27] [cursor=pointer]
    - paragraph [ref=f3e28]: "Liczba produktów: 3"
    - table [ref=f3e29]:
      - rowgroup [ref=f3e30]:
        - row [ref=f3e31]:
          - columnheader "Nazwa" [ref=f3e32]
          - columnheader "Kategoria" [ref=f3e33]
          - columnheader "Cena" [ref=f3e34]
          - columnheader "Stan" [ref=f3e35]
          - columnheader "Dostępność" [ref=f3e36]
          - columnheader [ref=f3e37]
      - rowgroup [ref=f3e38]:
        - row [ref=f3e39]:
          - cell "Szampon dla dzieci" [ref=f3e40]
          - cell "Dziecko" [ref=f3e41]
          - cell "10,99 zł" [ref=f3e42]
          - cell "64" [ref=f3e43]
          - cell "Dostępny" [ref=f3e44]
          - cell [ref=f3e45]:
            - 'button "Dodaj do koszyka: Szampon dla dzieci" [ref=f3e47] [cursor=pointer]': Dodaj do koszyka
        - row [ref=f3e48]:
          - cell "Krem ochronny dla dzieci" [ref=f3e49]
          - cell "Dziecko" [ref=f3e50]
          - cell "14,99 zł" [ref=f3e51]
          - cell "50" [ref=f3e52]
          - cell "Dostępny" [ref=f3e53]
          - cell [ref=f3e54]:
            - 'button "Dodaj do koszyka: Krem ochronny dla dzieci" [ref=f3e56] [cursor=pointer]': Dodaj do koszyka
        - row [ref=f3e57]:
          - cell "Chusteczki nawilżane dla dzieci" [ref=f3e58]
          - cell "Dziecko" [ref=f3e59]
          - cell "7,99 zł" [ref=f3e60]
          - cell "200" [ref=f3e61]
          - cell "Dostępny" [ref=f3e62]
          - cell [ref=f3e63]:
            - 'button "Dodaj do koszyka: Chusteczki nawilżane dla dzieci" [ref=f3e65] [cursor=pointer]': Dodaj do koszyka
    - region [ref=f3e66]:
      - heading "Oferta na Czarny Piątek" [level=2] [ref=f3e67]
      - paragraph [ref=f3e68]: Czarny Piątek w Namssorze startuje 27.11.2026. Do startu promocji zostało 9 dni.
      - generic [ref=f3e69]:
        - article [ref=f3e70]:
          - heading [level=3] [ref=f3e71]:
            - link "Szampon dla dzieci" [ref=f3e72] [cursor=pointer]:
              - /url: /produkt/18
          - paragraph [ref=f3e73]: Dziecko
          - paragraph [ref=f3e74]: 10,99 zł
          - paragraph [ref=f3e75]: Dostępny
        - article [ref=f3e76]:
          - heading [level=3] [ref=f3e77]:
            - link "Krem ochronny dla dzieci" [ref=f3e78] [cursor=pointer]:
              - /url: /produkt/19
          - paragraph [ref=f3e79]: Dziecko
          - paragraph [ref=f3e80]: 14,99 zł
          - paragraph [ref=f3e81]: Dostępny
        - article [ref=f3e82]:
          - heading [level=3] [ref=f3e83]:
            - link "Chusteczki nawilżane dla dzieci" [ref=f3e84] [cursor=pointer]:
              - /url: /produkt/17
          - paragraph [ref=f3e85]: Dziecko
          - paragraph [ref=f3e86]: 7,99 zł
          - paragraph [ref=f3e87]: Dostępny
  - contentinfo [ref=f3e88]:
    - generic [ref=f3e89]: Namssor to fikcyjna drogeria do ćwiczeń z automatyzacji testów. Dane są przykładowe.
    - generic [ref=f3e90]:
      - text: Grzegorz Brzezinka, Prosit AS,
      - link "https://agentgreg.ai" [ref=f3e91] [cursor=pointer]:
        - /url: https://agentgreg.ai
    - link "Regulamin" [ref=f3e92] [cursor=pointer]:
      - /url: /regulamin
    - link "API" [ref=f3e93] [cursor=pointer]:
      - /url: /api/docs
    - generic [ref=f3e94]: "Wersja: rc"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { zaloguj } from '../pomocnicze/logowanie';
  3  | 
  4  | // Dodatkowy test (spoza P1–P16): sortowanie produktów po cenie na stronie „Produkty”.
  5  | // Kategoria Dziecko ma 3 produkty: Chusteczki 7,99 zł, Szampon 10,99 zł, Krem ochronny 14,99 zł.
  6  | // Ceny 7,99 / 10,99 / 14,99 wykrywają sortowanie po tekście zamiast po liczbie
  7  | // (jako tekst „10,99” jest przed „7,99”).
  8  | 
  9  | test.describe('Sortowanie produktów po cenie', () => {
  10 |   test.beforeEach(async ({ page }) => {
  11 |     await zaloguj(page);
  12 |     await page.goto('/');
  13 |     await page.getByLabel('Kategoria').selectOption('Dziecko');
  14 |   });
  15 | 
  16 |   test('sortowanie „Cena: od najniższej” ustawia produkty od 7,99 zł do 14,99 zł', async ({ page }) => {
  17 |     await page.getByLabel('Sortuj').selectOption('Cena: od najniższej');
  18 |     await page.getByRole('button', { name: 'Filtruj' }).click();
  19 | 
  20 |     // Wiersze produktów (nagłówek tabeli nie zawiera nazwy kategorii).
  21 |     const wiersze = page.getByRole('row').filter({ hasText: 'Dziecko' });
> 22 |     await expect(wiersze).toHaveText([
     |                           ^ Error: expect(locator).toHaveText(expected) failed
  23 |       /Chusteczki nawilżane dla dzieci.*7,99 zł/,
  24 |       /Szampon dla dzieci.*10,99 zł/,
  25 |       /Krem ochronny dla dzieci.*14,99 zł/,
  26 |     ]);
  27 |   });
  28 | 
  29 |   test('sortowanie „Cena: od najwyższej” ustawia produkty od 14,99 zł do 7,99 zł', async ({ page }) => {
  30 |     await page.getByLabel('Sortuj').selectOption('Cena: od najwyższej');
  31 |     await page.getByRole('button', { name: 'Filtruj' }).click();
  32 | 
  33 |     const wiersze = page.getByRole('row').filter({ hasText: 'Dziecko' });
  34 |     await expect(wiersze).toHaveText([
  35 |       /Krem ochronny dla dzieci.*14,99 zł/,
  36 |       /Szampon dla dzieci.*10,99 zł/,
  37 |       /Chusteczki nawilżane dla dzieci.*7,99 zł/,
  38 |     ]);
  39 |   });
  40 | });
  41 | 
```