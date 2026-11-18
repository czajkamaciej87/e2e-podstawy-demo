# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: polowanie\dod-kod-pocztowy.spec.ts >> kod pocztowy bez kreski „00950” jest odrzucany i adres nie zostaje zapisany
- Location: tests\polowanie\dod-kod-pocztowy.spec.ts:18:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Kod pocztowy musi mieć format 00-000')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Kod pocztowy musi mieć format 00-000') with timeout 5000ms
  - waiting for getByText('Kod pocztowy musi mieć format 00-000')

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
  - heading "Moje adresy" [level=1]
  - paragraph: Zamówienie wysyłamy na adres domyślny.
  - article "Adres główny":
    - heading "Adres główny" [level=2]
    - paragraph: ul. Testowa 1 00-001 Warszawa tel. 500 100 200
    - paragraph:
      - link "Zmień adres główny":
        - /url: /konto/adres
    - 'button "Ustaw jako domyślny: Adres główny"': Ustaw jako domyślny
  - article "Zły kod 1794998309941 Domyślny":
    - heading "Zły kod 1794998309941 Domyślny" [level=2]
    - paragraph: ul. Biurowa 7 00950 Warszawa tel. 600 700 800
    - 'button "Usuń adres: Zły kod 1794998309941"': Usuń
  - heading "Dodaj adres" [level=2]
  - paragraph:
    - text: Nazwa adresu np. Praca, Rodzice
    - textbox "Nazwa adresu"
  - paragraph:
    - text: Ulica i numer np. ul. Kwiatowa 5/2
    - textbox "Ulica i numer"
  - paragraph:
    - text: "Kod pocztowy Format: 00-000"
    - textbox "Kod pocztowy"
  - paragraph:
    - text: Miasto
    - textbox "Miasto"
  - paragraph:
    - text: Telefon 9 cyfr, np. 500 100 200
    - textbox "Telefon"
  - button "Dodaj adres"
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
  4  | // Dodatkowy test (spoza P1–P16): walidacja kodu pocztowego w formularzu „Moje adresy”.
  5  | // Wymagany format podaje sama aplikacja: podpowiedź „Format: 00-000” przy polu.
  6  | 
  7  | // Unikalna nazwa, żeby sprzątanie usunęło tylko adres z tego testu.
  8  | const nazwa = `Zły kod ${Date.now()}`;
  9  | 
  10 | test.afterEach(async ({ page }) => {
  11 |   // Sprzątanie na wypadek błędu: aplikacja mogła zapisać adres mimo złego kodu.
  12 |   const adresy = await (await page.request.get('/api/account/addresses')).json();
  13 |   for (const adres of adresy.filter((a: { name: string }) => a.name === nazwa)) {
  14 |     await page.request.delete(`/api/account/addresses/${adres.id}`);
  15 |   }
  16 | });
  17 | 
  18 | test('kod pocztowy bez kreski „00950” jest odrzucany i adres nie zostaje zapisany', async ({ page }) => {
  19 |   await zaloguj(page);
  20 |   await page.goto('/konto/adresy');
  21 | 
  22 |   await page.getByLabel('Nazwa adresu').fill(nazwa);
  23 |   await page.getByLabel('Ulica i numer').fill('ul. Biurowa 7');
  24 |   await page.getByLabel('Kod pocztowy').fill('00950');
  25 |   await page.getByLabel('Miasto').fill('Warszawa');
  26 |   await page.getByLabel('Telefon').fill('600 700 800');
  27 |   await page.getByRole('button', { name: 'Dodaj adres' }).click();
  28 | 
> 29 |   await expect(page.getByText('Kod pocztowy musi mieć format 00-000')).toBeVisible();
     |                                                                        ^ Error: expect(locator).toBeVisible() failed
  30 |   await expect(page.getByLabel('Kod pocztowy')).toHaveAttribute('aria-invalid', 'true');
  31 |   // Adres z błędnym kodem nie pojawia się na liście.
  32 |   await expect(page.getByRole('article').filter({ hasText: nazwa })).toHaveCount(0);
  33 | });
  34 | 
```