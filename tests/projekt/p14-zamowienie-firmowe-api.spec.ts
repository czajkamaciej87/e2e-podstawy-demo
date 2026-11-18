import { test, expect } from '@playwright/test';
import { zalogujPrzezApi } from '../pomocnicze/logowanie';

// P14. Zamówienie firmowe przez API (API).
// Zamówienie firmowe składa Biuro Mikołaja, dlatego logujemy konto biuro jawnie.

test.describe('Zamówienie firmowe przez API', () => {
  test.beforeEach(async ({ request }) => {
    await zalogujPrzezApi(request, 'biuro', 'biuro123');
  });

  test('zamówienie firmowe 10 sztuk ma wartość 399,90 zł i fakturę FV/2026/<numer> na Biuro Mikołaja', async ({ request }) => {
    const odpowiedz = await request.post('/api/business-orders', {
      data: { product_id: 21, qty: 10, nip: '101-202-30-36', company: 'Biuro Mikołaja' },
    });

    expect(odpowiedz.status()).toBe(201);
    const zamowienie = await odpowiedz.json();
    expect(zamowienie.status).toBe('new');
    expect(zamowienie.qty).toBe(10);
    expect(zamowienie.total_cents).toBe(39990);
    expect(zamowienie.invoice.company).toBe('Biuro Mikołaja');

    const faktura = await request.get(`/api/orders/${zamowienie.number}/invoice`);
    expect(faktura.status()).toBe(200);
    expect((await faktura.json()).invoice_number).toBe(`FV/2026/${zamowienie.number}`);
  });

  test('zamówienie firmowe na 1001 sztuk zwraca 400 z błędem pola qty', async ({ request }) => {
    const odpowiedz = await request.post('/api/business-orders', {
      data: { product_id: 21, qty: 1001, nip: '101-202-30-36', company: 'Biuro Mikołaja' },
    });

    expect(odpowiedz.status()).toBe(400);
    const tresc = await odpowiedz.json();
    expect(tresc.errors).toContainEqual(expect.objectContaining({ field: 'qty' }));
  });
});
