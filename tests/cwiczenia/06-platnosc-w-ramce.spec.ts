import { test, expect } from '@playwright/test';

// Ćwiczenie 06, część B: płatność w ramce (iframe).
// Karta: docs/cwiczenia/06-dynamiczne-id.md
//
// Formularz karty jest w ramce <iframe title="Bramka płatnicza">. Locatory strony głównej
// nie widzą jej wnętrza. Wejście do ramki:
//   const bramka = page.getByTitle('Bramka płatnicza').contentFrame();
//   await bramka.getByLabel('Numer karty').fill('...');

// Płatność zamawia cały koszyk klienta. Konto tester07 ma koszyk tylko dla tych testów,
// więc inne testy nie dokładają do niego produktów. Oba testy dzielą ten koszyk, więc biegną po kolei.
test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }) => {
  await page.goto('/logowanie');
  await page.getByLabel('Login').fill('tester07');
  await page.getByLabel('Hasło').fill('czarny-piatek-2026');
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await expect(page.getByText('Zalogowano jako tester07')).toBeVisible();

  // Płacić można tylko za niepusty koszyk.
  await page.getByRole('button', { name: 'Dodaj do koszyka: Maseczka glinkowa' }).click();
  await expect(page.getByText('Dodano do koszyka: Maseczka glinkowa')).toBeVisible();
});

test('karta odrzucona przez bank pokazuje komunikat w ramce', async ({ page }) => {
  // TODO 1: otwórz /koszyk/platnosc i wejdź do ramki „Bramka płatnicza”.
  // TODO 2: wpisz kartę 4000 0000 0000 0002 i kliknij „Zapłać” (oba elementy są w ramce).
  // TODO 3: sprawdź komunikat w ramce (rola alert): „Płatność odrzucona przez bank. Użyj innej karty.”
  // TODO 4: sprzątanie: w /koszyk kliknij „Usuń: Maseczka glinkowa” i sprawdź, że wiersza już nie ma.
// Krok 1: otwieramy płatność i wchodzimy do ramki bramki płatniczej.
await page.goto('/koszyk/platnosc');
const bramka = page.getByTitle('Bramka płatnicza').contentFrame();

// Krok 2: płacimy kartą, którą bank odrzuca.
await bramka.getByLabel('Numer karty').fill('4000 0000 0000 0002');
await bramka.getByRole('button', { name: 'Zapłać' }).click();

// Krok 3: komunikat o odrzuceniu pojawia się w ramce.
await expect(bramka.getByRole('alert')).toHaveText('Płatność odrzucona przez bank. Użyj innej karty.');

// Krok 4: sprzątanie. Płatność nie przeszła, więc maseczka została w koszyku. Usuwamy ją.
await page.goto('/koszyk');
await page.getByRole('button', { name: 'Usuń: Maseczka glinkowa' }).click();
await expect(page.getByRole('row').filter({ hasText: 'Maseczka glinkowa' })).toHaveCount(0);
});


test('przyjęta płatność daje numer zamówienia', async ({ page, request }) => {
  // TODO 1: otwórz /koszyk/platnosc, w ramce wpisz kartę 4111 1111 1111 1111 i kliknij „Zapłać”.
  // TODO 2: sprawdź nagłówek „Płatność przyjęta” w ramce.
  // TODO 3: sprawdź numer zamówienia (getByTestId('payment-order')) wyrażeniem /^ZAM-\d+(, ZAM-\d+)*$/.
  //   Jedno zamówienie na każdą pozycję koszyka, numery po przecinku.
  // TODO 4: sprzątanie: zaloguj się przez API jako admin i anuluj każde z tych zamówień:
  //   POST /api/admin/orders/<numer>/cancel, oczekiwany status 200.
  //   Tekst z locatora weźmiesz przez: await numery.innerText()
  // Krok 1: płacimy poprawną kartą w ramce bramki.
  await page.goto('/koszyk/platnosc');
  const bramka = page.getByTitle('Bramka płatnicza').contentFrame();
  await bramka.getByLabel('Numer karty').fill('4111 1111 1111 1111');
  await bramka.getByRole('button', { name: 'Zapłać' }).click();

  // Krok 2: bramka potwierdza płatność.
  await expect(bramka.getByRole('heading', { name: 'Płatność przyjęta' })).toBeVisible();

  // Krok 3: numery zamówień, po jednym na pozycję koszyka, rozdzielone przecinkami.
  const numery = bramka.getByTestId('payment-order');
  await expect(numery).toHaveText(/^ZAM-\d+(, ZAM-\d+)*$/);

  // Krok 4: sprzątanie. Admin anuluje przez API każde utworzone zamówienie.
  const logowanie = await request.post('/api/login', { data: { login: 'admin', password: 'admin123' } });
  const { token } = await logowanie.json();
  for (const numer of (await numery.innerText()).split(', ')) {
    const odpowiedz = await request.post(`/api/admin/orders/${numer}/cancel`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(odpowiedz.status()).toBe(200);
  }
});
