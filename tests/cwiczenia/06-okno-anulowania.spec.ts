import { test, expect } from '@playwright/test';

// Ćwiczenie 06, część B: okno potwierdzenia <dialog>.
// Karta: docs/cwiczenia/06-dynamiczne-id.md
// Strona: /admin/zamowienia/potwierdzenie. „Anuluj” otwiera okno z przyciskami „Wróć” i „Tak, anuluj”.

// Numer zamówienia utworzonego przed testem
let numer: string;

test.beforeEach(async ({ request, page }) => {
  // Dane przez API: nowe zamówienie klienta user.
  const logowanie = await request.post('/api/login', { data: { login: 'user', password: 'user123' } });
  const { token } = await logowanie.json();
  const odpowiedz = await request.post('/api/orders', {
    headers: { Authorization: `Bearer ${token}` },
    data: { product_id: 17, qty: 1 },
  });
  expect(odpowiedz.status()).toBe(201);
  numer = (await odpowiedz.json()).number;

  await page.goto('/logowanie');
  await page.getByLabel('Login').fill('admin');
  await page.getByLabel('Hasło').fill('admin123');
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await expect(page.getByText('Zalogowano jako admin')).toBeVisible();
  await page.goto('/admin/zamowienia/potwierdzenie');
});

test.afterEach(async ({ request }) => {
  // Sprzątanie: anuluj zamówienie. 409 oznacza, że test już je anulował.
  const logowanie = await request.post('/api/login', { data: { login: 'admin', password: 'admin123' } });
  const { token } = await logowanie.json();
  const odpowiedz = await request.post(`/api/admin/orders/${numer}/cancel`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect([200, 409]).toContain(odpowiedz.status());
});

test('„Wróć” zamyka okno i zamówienie zostaje nowe', async ({ page }) => {
  // TODO 1: w wierszu zamówienia `numer` kliknij „Anuluj”.
  // TODO 2: sprawdź, że okno (rola dialog) jest widoczne, a jego nagłówek to „Anulować zamówienie <numer>?”.
  // TODO 3: kliknij „Wróć” w oknie.
  // TODO 4: sprawdź, że okno jest ukryte, a wiersz nadal ma status „Nowe”.
  const wiersz = page.getByRole('row').filter({ hasText: numer });
  const okno = page.getByRole('dialog');

  // Krok 1: w wierszu naszego zamówienia klikamy „Anuluj”.
  await wiersz.getByRole('button', { name: 'Anuluj' }).click();

  // Krok 2: okno jest widoczne i pyta o właściwe zamówienie.
  await expect(okno).toBeVisible();
  await expect(okno.getByRole('heading')).toHaveText(`Anulować zamówienie ${numer}?`);

  // Krok 3: rezygnujemy przyciskiem „Wróć”.
  await okno.getByRole('button', { name: 'Wróć' }).click();

  // Krok 4: okno znika, a zamówienie nadal ma status „Nowe”.
  await expect(okno).toBeHidden();
  await expect(wiersz).toContainText('Nowe');
});

test('„Tak, anuluj” anuluje zamówienie', async ({ page }) => {
  // TODO 1: w wierszu zamówienia `numer` kliknij „Anuluj”, w oknie kliknij „Tak, anuluj”.
  // TODO 2: sprawdź komunikat „Anulowano zamówienie <numer>” i status „Anulowane” w wierszu.
  const wiersz = page.getByRole('row').filter({ hasText: numer });
  const okno = page.getByRole('dialog');

  // Krok 1: otwieramy okno i potwierdzamy anulowanie.
  await wiersz.getByRole('button', { name: 'Anuluj' }).click();
  await okno.getByRole('button', { name: 'Tak, anuluj' }).click();

  // Krok 2: strona pokazuje komunikat, a wiersz ma status „Anulowane”.
  await expect(page.getByText(`Anulowano zamówienie ${numer}`)).toBeVisible();
  await expect(wiersz).toContainText('Anulowane');

});
