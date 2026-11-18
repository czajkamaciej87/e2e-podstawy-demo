# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: polowanie\p12-drugi-adres.spec.ts >> nowy adres ustawiony jako domyślny ma jedyną plakietkę „Domyślny”, a adresu głównego nie da się usunąć
- Location: tests\polowanie\p12-drugi-adres.spec.ts:6:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('article').filter({ hasText: 'Praca 1794998359206' }).getByRole('button', { name: 'Ustaw jako domyślny: Praca 1794998359206' })

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
    - heading "Moje adresy" [level=1] [ref=f3e19]
    - paragraph [ref=f3e20]: Zamówienie wysyłamy na adres domyślny.
    - generic [ref=f3e21]:
      - article [ref=f3e22]:
        - heading "Adres główny" [level=2] [ref=f3e23]
        - paragraph [ref=f3e24]: ul. Testowa 100-001 Warszawatel. 500 100 200
        - paragraph [ref=f3e25]:
          - link "Zmień adres główny" [ref=f3e26] [cursor=pointer]:
            - /url: /konto/adres
        - 'button "Ustaw jako domyślny: Adres główny" [ref=f3e28] [cursor=pointer]': Ustaw jako domyślny
      - article [ref=f3e29]:
        - heading "Praca 1794998359206 Domyślny" [level=2] [ref=f3e30]:
          - text: Praca 1794998359206
          - generic [ref=f3e31]: Domyślny
        - paragraph [ref=f3e32]: ul. Biurowa 700-950 Warszawatel. 600 700 800
        - 'button "Usuń adres: Praca 1794998359206" [ref=f3e34] [cursor=pointer]': Usuń
    - heading "Dodaj adres" [level=2] [ref=f3e35]
    - generic [ref=f3e36]:
      - paragraph [ref=f3e37]:
        - generic [ref=f3e38]: Nazwa adresu
        - generic [ref=f3e39]: np. Praca, Rodzice
        - textbox "Nazwa adresu" [ref=f3e40]
      - paragraph [ref=f3e41]:
        - generic [ref=f3e42]: Ulica i numer
        - generic [ref=f3e43]: np. ul. Kwiatowa 5/2
        - textbox "Ulica i numer" [ref=f3e44]
      - paragraph [ref=f3e45]:
        - generic [ref=f3e46]: Kod pocztowy
        - generic [ref=f3e47]: "Format: 00-000"
        - textbox "Kod pocztowy" [ref=f3e48]
      - paragraph [ref=f3e49]:
        - generic [ref=f3e50]: Miasto
        - textbox "Miasto" [ref=f3e51]
      - paragraph [ref=f3e52]:
        - generic [ref=f3e53]: Telefon
        - generic [ref=f3e54]: 9 cyfr, np. 500 100 200
        - textbox "Telefon" [ref=f3e55]
      - button "Dodaj adres" [ref=f3e56] [cursor=pointer]
  - contentinfo [ref=f3e57]:
    - generic [ref=f3e58]: Namssor to fikcyjna drogeria do ćwiczeń z automatyzacji testów. Dane są przykładowe.
    - generic [ref=f3e59]:
      - text: Grzegorz Brzezinka, Prosit AS,
      - link "https://agentgreg.ai" [ref=f3e60] [cursor=pointer]:
        - /url: https://agentgreg.ai
    - link "Regulamin" [ref=f3e61] [cursor=pointer]:
      - /url: /regulamin
    - link "API" [ref=f3e62] [cursor=pointer]:
      - /url: /api/docs
    - generic [ref=f3e63]: "Wersja: rc"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { zaloguj } from '../pomocnicze/logowanie';
  3  | 
  4  | // P12. Drugi adres w profilu (E2E).
  5  | 
  6  | test('nowy adres ustawiony jako domyślny ma jedyną plakietkę „Domyślny”, a adresu głównego nie da się usunąć', async ({ page }) => {
  7  |   // Unikalna nazwa, żeby test nie pomylił swojego adresu z adresem z innego uruchomienia.
  8  |   const nazwa = `Praca ${Date.now()}`;
  9  | 
  10 |   await zaloguj(page);
  11 |   await page.goto('/konto/adresy');
  12 | 
  13 |   // Stan przed testem: na liście jest tylko „Adres główny” i to on jest domyślny.
  14 |   // Adres zostawiony przez przerwany test zmieniłby wynik sprawdzania plakietki „Domyślny”.
  15 |   const adresy = page.getByRole('main').getByRole('article');
  16 |   const glowny = page.getByRole('article', { name: /^Adres główny/ });
  17 |   await expect(glowny.getByText('Domyślny', { exact: true })).toBeVisible();
  18 |   await expect(adresy, 'przed testem konto ma tylko „Adres główny”').toHaveCount(1);
  19 | 
  20 |   await page.getByLabel('Nazwa adresu').fill(nazwa);
  21 |   await page.getByLabel('Ulica i numer').fill('ul. Biurowa 7');
  22 |   await page.getByLabel('Kod pocztowy').fill('00-950');
  23 |   await page.getByLabel('Miasto').fill('Warszawa');
  24 |   await page.getByLabel('Telefon').fill('600 700 800');
  25 |   await page.getByRole('button', { name: 'Dodaj adres' }).click();
  26 | 
  27 |   await expect(page.getByText(`Dodano adres: ${nazwa}`)).toBeVisible();
  28 |   const nowy = page.getByRole('article').filter({ hasText: nazwa });
  29 |   await expect(nowy).toContainText('ul. Biurowa 7');
  30 |   await expect(nowy).toContainText('00-950 Warszawa');
  31 |   await expect(nowy).toContainText('600 700 800');
  32 | 
  33 |   // Nowy adres jako domyślny: plakietka tylko przy nim.
> 34 |   await nowy.getByRole('button', { name: `Ustaw jako domyślny: ${nazwa}` }).click();
     |                                                                             ^ Error: locator.click: Test timeout of 30000ms exceeded.
  35 |   await expect(nowy.getByText('Domyślny', { exact: true })).toBeVisible();
  36 |   await expect(page.getByText('Domyślny', { exact: true })).toHaveCount(1);
  37 | 
  38 |   // „Adres główny” nie ma przycisku „Usuń”.
  39 |   await expect(glowny).toBeVisible();
  40 |   await expect(glowny.getByRole('button', { name: /Usuń/ })).toHaveCount(0);
  41 | 
  42 |   // Sprzątanie: usuwamy swój adres, a „Domyślny” wraca do „Adres główny”.
  43 |   await nowy.getByRole('button', { name: `Usuń adres: ${nazwa}` }).click();
  44 |   await expect(page.getByText(`Usunięto adres: ${nazwa}`)).toBeVisible();
  45 |   await expect(nowy).toHaveCount(0);
  46 |   await expect(glowny.getByText('Domyślny', { exact: true })).toBeVisible();
  47 | });
  48 | 
```