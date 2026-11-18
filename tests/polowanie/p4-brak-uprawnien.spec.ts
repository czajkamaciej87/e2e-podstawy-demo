import { test, expect } from '@playwright/test';
import { zaloguj } from '../pomocnicze/logowanie';

// P4. Klient nie wejdzie do panelu administratora (E2E).
// Test z kontem admin uruchamiamy tylko lokalnie.

test.describe('Panel administratora tylko dla administratora', () => {
  test('klient na /admin widzi „Brak uprawnień” i informację, że strona wymaga roli admin', async ({ page }) => {
    await zaloguj(page);
    await page.goto('/admin');

    await expect(page.getByRole('heading', { name: 'Brak uprawnień' })).toBeVisible();
    await expect(page.getByText('Ta strona wymaga roli admin.')).toBeVisible();
  });

  test('w menu klienta nie ma pozycji „Panel admina”', async ({ page }) => {
    await zaloguj(page);
    await page.goto('/');

    const menu = page.getByRole('navigation', { name: 'Menu główne' });
    // Najpierw upewniamy się, że menu się wyświetliło, inaczej brak pozycji niczego nie dowodzi.
    await expect(menu.getByRole('link', { name: 'Moje zamówienia' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Panel admina' })).toHaveCount(0);
  });

  test('w menu administratora jest pozycja „Panel admina”', async ({ page }) => {
    await zaloguj(page, 'admin', 'admin123');
    await page.goto('/');

    const menu = page.getByRole('navigation', { name: 'Menu główne' });
    await expect(menu.getByRole('link', { name: 'Panel admina' })).toBeVisible();
  });
});
