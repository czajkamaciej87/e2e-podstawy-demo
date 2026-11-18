# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: polowanie\dod-niedostepny-produkt.spec.ts >> na karcie niedostępnego Dezodorantu w sprayu przycisk „Dodaj do koszyka” jest wyłączony
- Location: tests\polowanie\dod-niedostepny-produkt.spec.ts:8:5

# Error details

```
Error: expect(locator).toBeDisabled() failed

Locator:  getByRole('button', { name: 'Dodaj do koszyka' })
Expected: disabled
Received: enabled
Timeout:  5000ms

Call log:
  - Expect "toBeDisabled" getByRole('button', { name: 'Dodaj do koszyka' }) with timeout 5000ms
  - waiting for getByRole('button', { name: 'Dodaj do koszyka' })
    14 × locator resolved to <button type="submit">Dodaj do koszyka</button>
       - unexpected value "enabled"

```

```yaml
- button "Dodaj do koszyka"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { zaloguj } from '../pomocnicze/logowanie';
  3  | 
  4  | // Dodatkowy test (spoza P1–P16): karta produktu, którego nie ma na stanie.
  5  | // W tabeli na stronie „Produkty” przycisk „Dodaj do koszyka” takiego produktu jest wyłączony;
  6  | // karta produktu ma działać tak samo.
  7  | 
  8  | test('na karcie niedostępnego Dezodorantu w sprayu przycisk „Dodaj do koszyka” jest wyłączony', async ({ page }) => {
  9  |   await zaloguj(page);
  10 |   await page.goto('/');
  11 | 
  12 |   // Punkt odniesienia: w tabeli produkt jest niedostępny, a przycisk wyłączony.
  13 |   const wiersz = page.getByRole('row').filter({ hasText: 'Dezodorant w sprayu' });
  14 |   await expect(wiersz.getByRole('cell', { name: 'Niedostępny', exact: true })).toBeVisible();
  15 |   await expect(wiersz.getByRole('button', { name: 'Dodaj do koszyka' })).toBeDisabled();
  16 | 
  17 |   // Karta produktu otwierana z kafelka.
  18 |   await page.getByRole('article', { name: 'Dezodorant w sprayu', exact: true }).getByRole('link', { name: 'Dezodorant w sprayu' }).click();
  19 |   await expect(page.getByRole('heading', { level: 1, name: 'Dezodorant w sprayu' })).toBeVisible();
  20 |   await expect(page.getByText('Niedostępny', { exact: true })).toBeVisible();
> 21 |   await expect(page.getByRole('button', { name: 'Dodaj do koszyka' })).toBeDisabled();
     |                                                                        ^ Error: expect(locator).toBeDisabled() failed
  22 | });
  23 | 
```