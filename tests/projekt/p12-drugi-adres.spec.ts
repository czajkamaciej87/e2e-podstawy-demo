import { test, expect } from '@playwright/test';
import { zaloguj } from '../pomocnicze/logowanie';

// P12. Drugi adres w profilu (E2E).

test('nowy adres ustawiony jako domyślny ma jedyną plakietkę „Domyślny”, a adresu głównego nie da się usunąć', async ({ page }) => {
  // Unikalna nazwa, żeby test nie pomylił swojego adresu z adresem z innego uruchomienia.
  const nazwa = `Praca ${Date.now()}`;

  await zaloguj(page);
  await page.goto('/konto/adresy');

  await page.getByLabel('Nazwa adresu').fill(nazwa);
  await page.getByLabel('Ulica i numer').fill('ul. Biurowa 7');
  await page.getByLabel('Kod pocztowy').fill('00-950');
  await page.getByLabel('Miasto').fill('Warszawa');
  await page.getByLabel('Telefon').fill('600 700 800');
  await page.getByRole('button', { name: 'Dodaj adres' }).click();

  await expect(page.getByText(`Dodano adres: ${nazwa}`)).toBeVisible();
  const nowy = page.getByRole('article').filter({ hasText: nazwa });
  await expect(nowy).toContainText('ul. Biurowa 7');
  await expect(nowy).toContainText('00-950 Warszawa');
  await expect(nowy).toContainText('600 700 800');

  // Nowy adres jako domyślny: plakietka tylko przy nim.
  await nowy.getByRole('button', { name: `Ustaw jako domyślny: ${nazwa}` }).click();
  await expect(nowy.getByText('Domyślny', { exact: true })).toBeVisible();
  await expect(page.getByText('Domyślny', { exact: true })).toHaveCount(1);

  // „Adres główny” nie ma przycisku „Usuń”.
  const glowny = page.getByRole('article', { name: /^Adres główny/ });
  await expect(glowny).toBeVisible();
  await expect(glowny.getByRole('button', { name: /Usuń/ })).toHaveCount(0);

  // Sprzątanie: usuwamy swój adres, a „Domyślny” wraca do „Adres główny”.
  await nowy.getByRole('button', { name: `Usuń adres: ${nazwa}` }).click();
  await expect(page.getByText(`Usunięto adres: ${nazwa}`)).toBeVisible();
  await expect(nowy).toHaveCount(0);
  await expect(glowny.getByText('Domyślny', { exact: true })).toBeVisible();
});
