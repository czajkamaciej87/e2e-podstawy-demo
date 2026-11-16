import { test, expect } from '@playwright/test';

// Ćwiczenie 02: pierwszy test „produkt w promocji w koszyku”.
// Karta: docs/cwiczenia/02-pierwszy-test.md

test('produkt w promocji trafia do koszyka z ceną promocyjną', async ({ page }) => {
  // 1. Zaloguj się jako klient user / user123.
  await page.goto('/logowanie');
  await page.getByLabel('Login').fill('user');
  await page.getByLabel('Hasło').fill('user123');
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await expect(page.getByText('Zalogowano jako user')).toBeVisible();

  // 2. Na stronie „Produkty” dodaj krem do koszyka.
  // Przycisk ma pełną nazwę z produktem, więc nie pomylimy go z innymi wierszami ani kafelkami.
  await page.goto('/');
  await page.getByRole('button', { name: 'Dodaj do koszyka: Krem do twarzy na dzień' }).click();

  // 3. Sprawdź komunikat po dodaniu.
  await expect(page.getByText('Dodano do koszyka: Krem do twarzy na dzień')).toBeVisible();

  // 4. Przejdź do koszyka linkiem w menu.
  await page.getByRole('link', { name: 'Koszyk' }).click();
  await expect(page).toHaveURL(/koszyk/);

  // 5. W wierszu kremu sprawdź cenę promocyjną.
  const wierszKremu = page.getByRole('row').filter({ hasText: 'Krem do twarzy na dzień' });
  await expect(wierszKremu).toBeVisible();
  await expect(wierszKremu.getByTestId('cart-item-price')).toContainText('26,399 zł');
});
