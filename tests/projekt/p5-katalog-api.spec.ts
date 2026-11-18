import { test, expect } from '@playwright/test';

// P5. Katalog produktów w API. Katalog jest publiczny, więc testy się nie logują.

test.describe('Katalog produktów w API', () => {
  test('GET /api/products?category=Dziecko zwraca 3 produkty z kategorii Dziecko', async ({ request }) => {
    const odpowiedz = await request.get('/api/products?category=Dziecko');

    expect(odpowiedz.status()).toBe(200);
    const produkty = await odpowiedz.json();
    expect(produkty).toHaveLength(3);
    // Każdy produkt na liście należy do kategorii Dziecko.
    for (const produkt of produkty) {
      expect(produkt.category).toBe('Dziecko');
    }
  });

  test('GET /api/products/999 zwraca 404 i komunikat „Nie ma takiego produktu”', async ({ request }) => {
    const odpowiedz = await request.get('/api/products/999');

    expect(odpowiedz.status()).toBe(404);
    expect(await odpowiedz.json()).toEqual({ error: 'Nie ma takiego produktu' });
  });
});
