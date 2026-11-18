# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: polowanie\p15-status-w-panelu.spec.ts >> administrator zmienia status zamówienia na „Opłacone”, potem „Wysłane”, a klient widzi w API status shipped
- Location: tests\polowanie\p15-status-w-panelu.spec.ts:7:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Zalogowano jako admin')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Zalogowano jako admin') with timeout 5000ms
  - waiting for getByText('Zalogowano jako admin')

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
  - link "Zaloguj":
    - /url: /logowanie
- main:
  - heading "Logowanie" [level=1]
  - alert: Nieprawidłowy login lub hasło
  - paragraph:
    - text: Login
    - textbox "Login"
  - paragraph:
    - text: Hasło
    - textbox "Hasło"
  - button "Zaloguj"
- contentinfo:
  - text: Namssor to fikcyjna drogeria do ćwiczeń z automatyzacji testów. Dane są przykładowe. Grzegorz Brzezinka, Prosit AS,
  - link "https://agentgreg.ai":
    - /url: https://agentgreg.ai
  - link "Regulamin":
    - /url: /regulamin
  - link "API":
    - /url: /api/docs
```

# Test source

```ts
  1  | import { expect, type APIRequestContext, type Page } from '@playwright/test';
  2  | 
  3  | // Logowanie wspólne dla wielu testów (ćwiczenie 11 i projekt).
  4  | // Bez parametrów loguje konto ze zmiennych APP_USER i APP_PASSWORD,
  5  | // a gdy ich nie ma, konto demo user / user123.
  6  | // Na wspólnym serwerze ustawiasz konto pary, np.:
  7  | //   $env:APP_USER="tester05"
  8  | //   $env:APP_PASSWORD="czarny-piatek-2026"
  9  | 
  10 | const domyslnyLogin = () => process.env.APP_USER || 'user';
  11 | const domyslneHaslo = () => process.env.APP_PASSWORD || 'user123';
  12 | 
  13 | // Logowanie przez formularz w przeglądarce.
  14 | // Wywołanie w teście: await zaloguj(page);
  15 | // Inne konto: await zaloguj(page, 'biuro', 'biuro123');
  16 | export async function zaloguj(page: Page, login = domyslnyLogin(), haslo = domyslneHaslo()) {
  17 |   await page.goto('/logowanie');
  18 |   await page.getByLabel('Login').fill(login);
  19 |   await page.getByLabel('Hasło').fill(haslo);
  20 |   await page.getByRole('button', { name: 'Zaloguj' }).click();
  21 |   // Bez tej asercji test szedłby dalej także po nieudanym logowaniu.
> 22 |   await expect(page.getByText(`Zalogowano jako ${login}`)).toBeVisible();
     |                                                            ^ Error: expect(locator).toBeVisible() failed
  23 | }
  24 | 
  25 | // Logowanie w testach API. Po nim `request` wysyła ciasteczko sesji w kolejnych żądaniach.
  26 | // Wywołanie w teście: await zalogujPrzezApi(request);
  27 | export async function zalogujPrzezApi(request: APIRequestContext, login = domyslnyLogin(), haslo = domyslneHaslo()) {
  28 |   const odpowiedz = await request.post('/api/login', { data: { login, password: haslo } });
  29 |   expect(odpowiedz.status(), `logowanie ${login} przez API`).toBe(200);
  30 | }
  31 | 
```