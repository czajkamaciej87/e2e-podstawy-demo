import { test, expect } from '@playwright/test';
import { zalogujPrzezApi } from '../pomocnicze/logowanie';

// P6. Zamówienie przez API i błędne dane (API).

test.describe('Zamówienie przez API', () => {
  test.beforeEach(async ({ request }) => {
    await zalogujPrzezApi(request);
  });

  test('zamówienie 2 sztuk Balsamu do ciała dostaje numer ZAM-… i status new, a GET zwraca to samo zamówienie', async ({ request }) => {
    const odpowiedz = await request.post('/api/orders', { data: { product_id: 10, qty: 2 } });

    expect(odpowiedz.status()).toBe(201);
    const zamowienie = await odpowiedz.json();
    expect(zamowienie.number).toMatch(/^ZAM-\d+$/);
    expect(zamowienie.qty).toBe(2);
    expect(zamowienie.status).toBe('new');
    expect(zamowienie.product).toBe('Balsam do ciała');

    // To samo zamówienie pobrane po numerze.
    const pobrane = await request.get(`/api/orders/${zamowienie.number}`);
    expect(pobrane.status()).toBe(200);
    expect(await pobrane.json()).toEqual(zamowienie);
  });

  test('zamówienie z ilością 0 zwraca 400 z błędem pola qty', async ({ request }) => {
    const odpowiedz = await request.post('/api/orders', { data: { product_id: 10, qty: 0 } });

    expect(odpowiedz.status()).toBe(400);
    const tresc = await odpowiedz.json();
    expect(tresc.errors).toContainEqual(expect.objectContaining({ field: 'qty' }));
  });

  test('zamówienie niedostępnego produktu zwraca 409 „Brak towaru na stanie”', async ({ request }) => {
    const odpowiedz = await request.post('/api/orders', { data: { product_id: 3, qty: 1 } });

    expect(odpowiedz.status()).toBe(409);
    expect(await odpowiedz.json()).toEqual({ error: 'Brak towaru na stanie' });
  });
});
