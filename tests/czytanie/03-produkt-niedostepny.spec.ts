import { test, expect } from '@playwright/test';

// Ćwiczenie 03: przeczytaj ten plik i opisz słowami, co sprawdza.

test('produktu niedostępnego nie da się dodać do koszyka', async ({ page }) => {
  await page.goto('/');

  const wiersz = page.getByRole('row').filter({ hasText: 'Serum z witaminą C' });

  await expect(wiersz).toBeVisible();
  await expect(wiersz.getByText('Niedostępny')).toBeVisible();

  // Najważniejsze: przycisk dodawania do koszyka jest wyłączony, więc klient nie doda produktu.
  await expect(wiersz.getByRole('button', { name: 'Dodaj do koszyka: Serum z witaminą C' })).toBeDisabled();
});
