# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: polowanie\p7-cudze-zamowienia-api.spec.ts >> Dostęp do zamówień w API >> administrator widzi zamówienie klienta ZAM-1001
- Location: tests\polowanie\p7-cudze-zamowienia-api.spec.ts:21:7

# Error details

```
Error: logowanie admin przez API

expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401
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
  22 |   await expect(page.getByText(`Zalogowano jako ${login}`)).toBeVisible();
  23 | }
  24 | 
  25 | // Logowanie w testach API. Po nim `request` wysyła ciasteczko sesji w kolejnych żądaniach.
  26 | // Wywołanie w teście: await zalogujPrzezApi(request);
  27 | export async function zalogujPrzezApi(request: APIRequestContext, login = domyslnyLogin(), haslo = domyslneHaslo()) {
  28 |   const odpowiedz = await request.post('/api/login', { data: { login, password: haslo } });
> 29 |   expect(odpowiedz.status(), `logowanie ${login} przez API`).toBe(200);
     |                                                              ^ Error: logowanie admin przez API
  30 | }
  31 | 
```