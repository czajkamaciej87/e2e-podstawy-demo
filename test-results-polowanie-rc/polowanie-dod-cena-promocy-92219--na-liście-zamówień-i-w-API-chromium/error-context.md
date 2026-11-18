# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: polowanie\dod-cena-promocyjna-w-zamowieniu.spec.ts >> zamówienie Odżywki do włosów w promocji ma wartość 11,99 zł na liście zamówień i w API
- Location: tests\polowanie\dod-cena-promocyjna-w-zamowieniu.spec.ts:9:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('row').filter({ hasText: 'ZAM-1305' }).getByRole('cell', { name: '11,99 zł', exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('row').filter({ hasText: 'ZAM-1305' }).getByRole('cell', { name: '11,99 zł', exact: true }) with timeout 5000ms
  - waiting for getByRole('row').filter({ hasText: 'ZAM-1305' }).getByRole('cell', { name: '11,99 zł', exact: true })

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
  - heading "Moje zamówienia" [level=1]
  - table:
    - rowgroup:
      - row "Numer Data Produkt Ilość Wartość Status":
        - columnheader "Numer"
        - columnheader "Data"
        - columnheader "Produkt"
        - columnheader "Ilość"
        - columnheader "Wartość"
        - columnheader "Status"
    - rowgroup:
      - row "ZAM-1305 2026-11-18 11:38 Odżywka do włosów 1 9,59 zł Nowe":
        - cell "ZAM-1305":
          - link "ZAM-1305":
            - /url: /zamowienia/ZAM-1305
        - cell "2026-11-18 11:38"
        - cell "Odżywka do włosów"
        - cell "1"
        - cell "9,59 zł"
        - cell "Nowe"
      - row "ZAM-1283 2026-11-18 11:27 Żel pod prysznic 1 9,99 zł Nowe":
        - cell "ZAM-1283":
          - link "ZAM-1283":
            - /url: /zamowienia/ZAM-1283
        - cell "2026-11-18 11:27"
        - cell "Żel pod prysznic"
        - cell "1"
        - cell "9,99 zł"
        - cell "Nowe"
      - row "ZAM-1266 2026-11-18 11:22 Żel pod prysznic 1 9,99 zł Nowe":
        - cell "ZAM-1266":
          - link "ZAM-1266":
            - /url: /zamowienia/ZAM-1266
        - cell "2026-11-18 11:22"
        - cell "Żel pod prysznic"
        - cell "1"
        - cell "9,99 zł"
        - cell "Nowe"
      - row "ZAM-1265 2026-11-18 11:22 Żel pod prysznic 10 99,90 zł Nowe":
        - cell "ZAM-1265":
          - link "ZAM-1265":
            - /url: /zamowienia/ZAM-1265
        - cell "2026-11-18 11:22"
        - cell "Żel pod prysznic"
        - cell "10"
        - cell "99,90 zł"
        - cell "Nowe"
      - row "ZAM-1242 2026-11-18 11:14 Żel pod prysznic 2 19,98 zł Nowe":
        - cell "ZAM-1242":
          - link "ZAM-1242":
            - /url: /zamowienia/ZAM-1242
        - cell "2026-11-18 11:14"
        - cell "Żel pod prysznic"
        - cell "2"
        - cell "19,98 zł"
        - cell "Nowe"
      - row "ZAM-1226 2026-11-18 11:12 Żel pod prysznic 1 7,99 zł Nowe":
        - cell "ZAM-1226":
          - link "ZAM-1226":
            - /url: /zamowienia/ZAM-1226
        - cell "2026-11-18 11:12"
        - cell "Żel pod prysznic"
        - cell "1"
        - cell "7,99 zł"
        - cell "Nowe"
      - row "ZAM-1225 2026-11-18 11:12 Lakier do włosów 2 19,18 zł Nowe":
        - cell "ZAM-1225":
          - link "ZAM-1225":
            - /url: /zamowienia/ZAM-1225
        - cell "2026-11-18 11:12"
        - cell "Lakier do włosów"
        - cell "2"
        - cell "19,18 zł"
        - cell "Nowe"
      - row "ZAM-1214 2026-11-18 11:02 Odżywka do włosów 1 9,59 zł Nowe":
        - cell "ZAM-1214":
          - link "ZAM-1214":
            - /url: /zamowienia/ZAM-1214
        - cell "2026-11-18 11:02"
        - cell "Odżywka do włosów"
        - cell "1"
        - cell "9,59 zł"
        - cell "Nowe"
      - row "ZAM-1199 2026-11-18 10:59 Krem do twarzy na dzień 1 21,11 zł Nowe":
        - cell "ZAM-1199":
          - link "ZAM-1199":
            - /url: /zamowienia/ZAM-1199
        - cell "2026-11-18 10:59"
        - cell "Krem do twarzy na dzień"
        - cell "1"
        - cell "21,11 zł"
        - cell "Nowe"
      - row "ZAM-1164 2026-11-18 10:40 Balsam do ciała 1 18,99 zł Nowe":
        - cell "ZAM-1164":
          - link "ZAM-1164":
            - /url: /zamowienia/ZAM-1164
        - cell "2026-11-18 10:40"
        - cell "Balsam do ciała"
        - cell "1"
        - cell "18,99 zł"
        - cell "Nowe"
      - row "ZAM-1143 2026-11-18 10:36 Balsam do ciała 2 37,98 zł Nowe":
        - cell "ZAM-1143":
          - link "ZAM-1143":
            - /url: /zamowienia/ZAM-1143
        - cell "2026-11-18 10:36"
        - cell "Balsam do ciała"
        - cell "2"
        - cell "37,98 zł"
        - cell "Nowe"
      - row "ZAM-1141 2026-11-18 10:35 Balsam do ciała 1 18,99 zł Nowe":
        - cell "ZAM-1141":
          - link "ZAM-1141":
            - /url: /zamowienia/ZAM-1141
        - cell "2026-11-18 10:35"
        - cell "Balsam do ciała"
        - cell "1"
        - cell "18,99 zł"
        - cell "Nowe"
      - row "ZAM-1120 2026-11-18 10:32 Balsam do ciała 1 18,99 zł Nowe":
        - cell "ZAM-1120":
          - link "ZAM-1120":
            - /url: /zamowienia/ZAM-1120
        - cell "2026-11-18 10:32"
        - cell "Balsam do ciała"
        - cell "1"
        - cell "18,99 zł"
        - cell "Nowe"
      - row "ZAM-1119 2026-11-18 10:32 Balsam do ciała 2 37,98 zł Nowe":
        - cell "ZAM-1119":
          - link "ZAM-1119":
            - /url: /zamowienia/ZAM-1119
        - cell "2026-11-18 10:32"
        - cell "Balsam do ciała"
        - cell "2"
        - cell "37,98 zł"
        - cell "Nowe"
      - row "ZAM-1118 2026-11-18 10:31 Balsam do ciała 1 18,99 zł Nowe":
        - cell "ZAM-1118":
          - link "ZAM-1118":
            - /url: /zamowienia/ZAM-1118
        - cell "2026-11-18 10:31"
        - cell "Balsam do ciała"
        - cell "1"
        - cell "18,99 zł"
        - cell "Nowe"
      - row "ZAM-1115 2026-11-18 10:31 Balsam do ciała 1 18,99 zł Nowe":
        - cell "ZAM-1115":
          - link "ZAM-1115":
            - /url: /zamowienia/ZAM-1115
        - cell "2026-11-18 10:31"
        - cell "Balsam do ciała"
        - cell "1"
        - cell "18,99 zł"
        - cell "Nowe"
      - row "ZAM-1039 2026-11-18 10:09 Balsam do ciała 1 18,99 zł Nowe":
        - cell "ZAM-1039":
          - link "ZAM-1039":
            - /url: /zamowienia/ZAM-1039
        - cell "2026-11-18 10:09"
        - cell "Balsam do ciała"
        - cell "1"
        - cell "18,99 zł"
        - cell "Nowe"
      - row "ZAM-1038 2026-11-18 10:09 Balsam do ciała 2 37,98 zł Nowe":
        - cell "ZAM-1038":
          - link "ZAM-1038":
            - /url: /zamowienia/ZAM-1038
        - cell "2026-11-18 10:09"
        - cell "Balsam do ciała"
        - cell "2"
        - cell "37,98 zł"
        - cell "Nowe"
      - row "ZAM-1036 2026-11-18 10:09 Balsam do ciała 1 18,99 zł Nowe":
        - cell "ZAM-1036":
          - link "ZAM-1036":
            - /url: /zamowienia/ZAM-1036
        - cell "2026-11-18 10:09"
        - cell "Balsam do ciała"
        - cell "1"
        - cell "18,99 zł"
        - cell "Nowe"
      - row "ZAM-1031 2026-11-18 10:08 Balsam do ciała 1 18,99 zł Nowe":
        - cell "ZAM-1031":
          - link "ZAM-1031":
            - /url: /zamowienia/ZAM-1031
        - cell "2026-11-18 10:08"
        - cell "Balsam do ciała"
        - cell "1"
        - cell "18,99 zł"
        - cell "Nowe"
      - row "ZAM-1009 2026-11-18 09:58 Balsam do ciała 1 18,99 zł Nowe":
        - cell "ZAM-1009":
          - link "ZAM-1009":
            - /url: /zamowienia/ZAM-1009
        - cell "2026-11-18 09:58"
        - cell "Balsam do ciała"
        - cell "1"
        - cell "18,99 zł"
        - cell "Nowe"
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
  4  | // Dodatkowy test (spoza P1–P16): cena promocyjna w złożonym zamówieniu.
  5  | // P9 sprawdza cenę promocyjną kremu w koszyku; ten test sprawdza, że do zamówienia trafia
  6  | // cena promocyjna innego produktu, a nie cena obniżona drugi raz.
  7  | // Zamówienia nie da się usunąć, więc każde uruchomienie zostawia jedno zamówienie odżywki.
  8  | 
  9  | test('zamówienie Odżywki do włosów w promocji ma wartość 11,99 zł na liście zamówień i w API', async ({ page }) => {
  10 |   await zaloguj(page);
  11 |   await page.goto('/');
  12 | 
  13 |   // Punkt odniesienia: cena regularna 14,99 zł, promocyjna 11,99 zł (-20%).
  14 |   const odzywka = page.getByRole('row').filter({ hasText: 'Odżywka do włosów' });
  15 |   await expect(odzywka.getByRole('cell', { name: '14,99 zł 11,99 zł', exact: true })).toBeVisible();
  16 |   await odzywka.getByRole('button', { name: 'Dodaj do koszyka' }).click();
  17 |   await expect(page.getByText('Dodano do koszyka: Odżywka do włosów')).toBeVisible();
  18 | 
  19 |   // W koszyku ma być tylko odżywka, żeby zamówienie zawierało jedną pozycję.
  20 |   await page.goto('/koszyk');
  21 |   await expect(page.getByText(/^Pozycji: 1,/)).toBeVisible();
  22 |   await page.getByRole('button', { name: 'Złóż zamówienie (płatność przy odbiorze)' }).click();
  23 | 
  24 |   // Numer nowego zamówienia aplikacja podaje w adresie strony.
  25 |   await expect(page).toHaveURL(/\/zamowienia\?zlozono=ZAM-\d+$/);
  26 |   const numer = new URL(page.url()).searchParams.get('zlozono') ?? '';
  27 | 
  28 |   // Lista „Moje zamówienia”: wartość zamówienia to cena promocyjna.
  29 |   const zamowienie = page.getByRole('row').filter({ hasText: numer });
  30 |   await expect(zamowienie.getByRole('cell', { name: 'Odżywka do włosów', exact: true })).toBeVisible();
> 31 |   await expect(zamowienie.getByRole('cell', { name: '11,99 zł', exact: true })).toBeVisible();
     |                                                                                 ^ Error: expect(locator).toBeVisible() failed
  32 | 
  33 |   // To samo zamówienie w API: 11,99 zł to 1199 groszy.
  34 |   const odpowiedz = await page.request.get(`/api/orders/${numer}`);
  35 |   expect(odpowiedz.status()).toBe(200);
  36 |   expect((await odpowiedz.json()).total_cents).toBe(1199);
  37 | });
  38 | 
```