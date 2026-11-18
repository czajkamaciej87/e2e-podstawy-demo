# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: polowanie\p14-zamowienie-firmowe-api.spec.ts >> Zamówienie firmowe przez API >> zamówienie firmowe 10 sztuk ma wartość 399,90 zł i fakturę FV/2026/<numer> na Biuro Mikołaja z NIP 1012023036
- Location: tests\polowanie\p14-zamowienie-firmowe-api.spec.ts:12:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "1012023036"
Received: "1234563218"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { zalogujPrzezApi } from '../pomocnicze/logowanie';
  3  | 
  4  | // P14. Zamówienie firmowe przez API (API).
  5  | // Zamówienie firmowe składa Biuro Mikołaja, dlatego logujemy konto biuro jawnie.
  6  | 
  7  | test.describe('Zamówienie firmowe przez API', () => {
  8  |   test.beforeEach(async ({ request }) => {
  9  |     await zalogujPrzezApi(request, 'biuro', 'biuro123');
  10 |   });
  11 | 
  12 |   test('zamówienie firmowe 10 sztuk ma wartość 399,90 zł i fakturę FV/2026/<numer> na Biuro Mikołaja z NIP 1012023036', async ({ request }) => {
  13 |     const odpowiedz = await request.post('/api/business-orders', {
  14 |       data: { product_id: 21, qty: 10, nip: '101-202-30-36', company: 'Biuro Mikołaja' },
  15 |     });
  16 | 
  17 |     expect(odpowiedz.status()).toBe(201);
  18 |     const zamowienie = await odpowiedz.json();
  19 |     expect(zamowienie.status).toBe('new');
  20 |     expect(zamowienie.qty).toBe(10);
  21 |     expect(zamowienie.total_cents).toBe(39990);
  22 |     expect(zamowienie.invoice.company).toBe('Biuro Mikołaja');
  23 | 
  24 |     const faktura = await request.get(`/api/orders/${zamowienie.number}/invoice`);
  25 |     expect(faktura.status()).toBe(200);
  26 |     const daneFaktury = await faktura.json();
  27 |     expect(daneFaktury.invoice_number).toBe(`FV/2026/${zamowienie.number}`);
  28 |     // Nabywca to firma z żądania: NIP 101-202-30-36 zapisany bez kresek, a nie NIP sprzedawcy.
  29 |     expect(daneFaktury.buyer.name).toBe('Biuro Mikołaja');
> 30 |     expect(daneFaktury.buyer.nip).toBe('1012023036');
     |                                   ^ Error: expect(received).toBe(expected) // Object.is equality
  31 |   });
  32 | 
  33 |   test('zamówienie firmowe na 1001 sztuk zwraca 400 z błędem pola qty', async ({ request }) => {
  34 |     const odpowiedz = await request.post('/api/business-orders', {
  35 |       data: { product_id: 21, qty: 1001, nip: '101-202-30-36', company: 'Biuro Mikołaja' },
  36 |     });
  37 | 
  38 |     expect(odpowiedz.status()).toBe(400);
  39 |     const tresc = await odpowiedz.json();
  40 |     expect(tresc.errors).toContainEqual(expect.objectContaining({ field: 'qty' }));
  41 |   });
  42 | });
  43 | 
```