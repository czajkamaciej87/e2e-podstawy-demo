import { test, expect } from '@playwright/test';
import { zaloguj } from '../pomocnicze/logowanie';

// P11. Kod rabatowy w koszyku (E2E).

test.describe('Kod rabatowy w koszyku', () => {
  // Wszystkie testy używają koszyka tego samego konta, więc nie mogą biec równolegle.
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await zaloguj(page);
    await page.goto('/');
    await page.getByRole('row').filter({ hasText: 'Mydło w kostce' }).getByRole('button', { name: 'Dodaj do koszyka' }).click();
    await expect(page.getByText('Dodano do koszyka: Mydło w kostce')).toBeVisible();

    // W koszyku ma być tylko mydło za 4,99 zł, inaczej kwoty w testach się nie zgodzą.
    await page.goto('/koszyk');
    await expect(page.getByText('Pozycji: 1, razem: 4,99 zł')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    // Sprzątanie: usuń kod przez API (działa także, gdy kodu nie ma) i mydło z koszyka.
    const usuniecieKodu = await page.request.delete('/api/cart/discount');
    expect(usuniecieKodu.ok()).toBe(true);
    await page.goto('/koszyk');
    const mydlo = page.getByRole('row').filter({ hasText: 'Mydło w kostce' });
    await mydlo.getByRole('button', { name: 'Usuń: Mydło w kostce' }).click();
    await expect(mydlo).toHaveCount(0);
  });

  test('kod CZARNY20 daje rabat 20% na całe zamówienie', async ({ page }) => {
    await page.getByLabel('Kod rabatowy').fill('CZARNY20');
    await page.getByRole('button', { name: 'Zastosuj kod' }).click();

    await expect(page.getByText('Kod CZARNY20 przyjęty: -20% na całe zamówienie.')).toBeVisible();
    // 20% z 4,99 zł to 1,00 zł (po zaokrągleniu), więc do zapłaty zostaje 3,99 zł.
    await expect(page.getByText('Przed rabatem: 4,99 zł, rabat (CZARNY20): -1,00 zł')).toBeVisible();
    await expect(page.getByText('Pozycji: 1, razem: 3,99 zł')).toBeVisible();
  });

  test('nieistniejący kod NIEMA daje komunikat o braku kodu i nie obniża ceny', async ({ page }) => {
    await page.getByLabel('Kod rabatowy').fill('NIEMA');
    await page.getByRole('button', { name: 'Zastosuj kod' }).click();

    await expect(page.getByText('Nie ma takiego kodu rabatowego: NIEMA')).toBeVisible();
    // Linia „Przed rabatem” pojawia się tylko przy przyjętym kodzie (sprawdza to test CZARNY20).
    await expect(page.getByText(/Przed rabatem/)).toHaveCount(0);
    await expect(page.getByText('Pozycji: 1, razem: 4,99 zł')).toBeVisible();
  });

  test('kod WLOSY15 bez produktów z kategorii Włosy w koszyku daje komunikat o braku takich produktów', async ({ page }) => {
    await page.getByLabel('Kod rabatowy').fill('WLOSY15');
    await page.getByRole('button', { name: 'Zastosuj kod' }).click();

    await expect(
      page.getByText('Kod WLOSY15 działa tylko na produkty z kategorii Włosy. W koszyku nie ma takich produktów.'),
    ).toBeVisible();
  });
});
