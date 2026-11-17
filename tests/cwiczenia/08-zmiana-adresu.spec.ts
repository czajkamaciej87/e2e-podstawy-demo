import { test, expect } from '@playwright/test';

// Zmiana adresu dostawy: TC-ADR-01 i TC-ADR-02.
// Scenariusze: docs/scenariusze/zmiana-adresu.md i docs/scenariusze/zmiana-adresu.feature
// Adres startowy konta user: ul. Przykładowa 12/3, 00-001 Warszawa, telefon 500 100 200.

// Wszystkie testy zmieniają adres tego samego konta, więc biegną po kolei.
test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }) => {
  await page.goto('/logowanie');
  await page.getByLabel('Login').fill('user');
  await page.getByLabel('Hasło').fill('user123');
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await expect(page.getByText('Zalogowano jako user')).toBeVisible();

  await page.getByRole('link', { name: 'Adres dostawy' }).click();
  await expect(page.getByRole('heading', { name: 'Zmiana adresu dostawy' })).toBeVisible();
});

test.afterEach(async ({ request }) => {
  // Sprzątanie: przywracamy adres startowy przez API, żeby inne testy widziały ten sam stan.
  const logowanie = await request.post('/api/login', { data: { login: 'user', password: 'user123' } });
  const { token } = await logowanie.json();
  const odpowiedz = await request.post('/api/account/address', {
    headers: { Authorization: `Bearer ${token}` },
    data: { street: 'ul. Przykładowa 12/3', postal_code: '00-001', city: 'Warszawa', phone: '500 100 200' },
  });
  expect(odpowiedz.status()).toBe(200);
});

test('zapisany adres dostawy zostaje po odświeżeniu strony', async ({ page }) => {
  // Test startuje od adresu startowego.
  await expect(page.getByLabel('Ulica i numer')).toHaveValue('ul. Przykładowa 12/3');
  await expect(page.getByLabel('Kod pocztowy')).toHaveValue('00-001');
  await expect(page.getByLabel('Miasto')).toHaveValue('Warszawa');
  await expect(page.getByLabel('Telefon')).toHaveValue('500 100 200');

  // Krok 1: wpisujemy nowy adres.
  await page.getByLabel('Ulica i numer').fill('ul. Lipowa 7');
  await page.getByLabel('Kod pocztowy').fill('31-001');
  await page.getByLabel('Miasto').fill('Kraków');
  await page.getByLabel('Telefon').fill('600 200 300');

  // Krok 2: zapisujemy i sprawdzamy komunikat.
  await page.getByRole('button', { name: 'Zapisz adres' }).click();
  await expect(page.getByRole('status')).toHaveText('Zapisano adres dostawy.');

  // Krok 3: po odświeżeniu pola nadal mają nowy adres.
  await page.reload();
  await expect(page.getByLabel('Ulica i numer')).toHaveValue('ul. Lipowa 7');
  await expect(page.getByLabel('Kod pocztowy')).toHaveValue('31-001');
  await expect(page.getByLabel('Miasto')).toHaveValue('Kraków');
  await expect(page.getByLabel('Telefon')).toHaveValue('600 200 300');
});

test('błędny kod pocztowy blokuje zapis adresu', async ({ page }) => {
  // Krok 1: kod bez myślnika, reszta adresu bez zmian.
  await page.getByLabel('Kod pocztowy').fill('31001');
  await page.getByRole('button', { name: 'Zapisz adres' }).click();

  // Krok 2: komunikat ogólny i błąd przy polu. Opis pola zawiera też podpowiedź, więc szukamy fragmentu.
  await expect(page.getByRole('alert')).toHaveText('Popraw błędy w formularzu (1).');
  await expect(page.getByLabel('Kod pocztowy')).toHaveAccessibleDescription(/Kod pocztowy musi mieć format 00-000/);
  await expect(page.getByText('Zapisano adres dostawy.')).toBeHidden();

  // Krok 3: po ponownym otwarciu strony kod jest stary, czyli błędny adres się nie zapisał.
  await page.goto('/konto/adres');
  await expect(page.getByLabel('Kod pocztowy')).toHaveValue('00-001');
});

test('błędny telefon blokuje zapis adresu', async ({ page }) => {
  // Krok 1: za krótki numer telefonu, reszta adresu bez zmian.
  await page.getByLabel('Telefon').fill('12345');
  await page.getByRole('button', { name: 'Zapisz adres' }).click();

  // Krok 2: komunikat ogólny i błąd przy polu Telefon.
  await expect(page.getByRole('alert')).toHaveText('Popraw błędy w formularzu (1).');
  await expect(page.getByLabel('Telefon')).toHaveAccessibleDescription(/Telefon musi mieć 9 cyfr \(opcjonalnie z \+48\)/);
  await expect(page.getByText('Zapisano adres dostawy.')).toBeHidden();

  // Krok 3: telefon na koncie się nie zmienił.
  await page.goto('/konto/adres');
  await expect(page.getByLabel('Telefon')).toHaveValue('500 100 200');
});

test('puste miasto blokuje zapis adresu', async ({ page }) => {
  // Krok 1: czyścimy pole Miasto, reszta adresu bez zmian.
  await page.getByLabel('Miasto').fill('');
  await page.getByRole('button', { name: 'Zapisz adres' }).click();

  // Krok 2: komunikat ogólny i błąd przy polu. Miasto nie ma podpowiedzi, więc opis to dokładnie błąd.
  await expect(page.getByRole('alert')).toHaveText('Popraw błędy w formularzu (1).');
  await expect(page.getByLabel('Miasto')).toHaveAccessibleDescription('Podaj miasto');
  await expect(page.getByText('Zapisano adres dostawy.')).toBeHidden();

  // Krok 3: miasto na koncie się nie zmieniło.
  await page.goto('/konto/adres');
  await expect(page.getByLabel('Miasto')).toHaveValue('Warszawa');
});
