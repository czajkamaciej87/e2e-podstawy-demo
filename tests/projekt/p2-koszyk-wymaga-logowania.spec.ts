import { test, expect } from '@playwright/test';

// P2. Koszyk wymaga logowania (E2E).

test('niezalogowany klient trafia z koszyka na logowanie, a po zalogowaniu wraca do koszyka', async ({ page }) => {
  await page.goto('/koszyk');

  // Bez logowania aplikacja przenosi na logowanie i zapamiętuje adres koszyka w parametrze next.
  await expect(page.getByRole('heading', { name: 'Logowanie' })).toBeVisible();
  await expect(page).toHaveURL(/next=%2Fkoszyk/);

  // Nie używamy zaloguj(): helper otwiera /logowanie od nowa i gubi parametr next,
  // a właśnie powrót do koszyka sprawdza ten scenariusz. Konto bierzemy z tych samych
  // zmiennych APP_USER i APP_PASSWORD co helper.
  await page.getByLabel('Login').fill(process.env.APP_USER || 'user');
  await page.getByLabel('Hasło').fill(process.env.APP_PASSWORD || 'user123');
  await page.getByRole('button', { name: 'Zaloguj' }).click();

  // Po zalogowaniu klient jest w koszyku, a nie na stronie głównej.
  await expect(page).toHaveURL(/\/koszyk$/);
  await expect(page.getByRole('heading', { name: 'Koszyk' })).toBeVisible();
});
