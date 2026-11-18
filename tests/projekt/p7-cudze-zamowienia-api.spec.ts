import { test, expect } from '@playwright/test';
import { zalogujPrzezApi } from '../pomocnicze/logowanie';

// P7. Klient nie widzi cudzych zamówień (API).
// ZAM-1001 należy do konta user, ZAM-1005 do konta admin, dlatego logujemy te konta jawnie.
// Test z kontem admin uruchamiamy tylko lokalnie.

test.describe('Dostęp do zamówień w API', () => {
  test('klient user widzi swoje zamówienie ZAM-1001, a cudze ZAM-1005 dostaje 404', async ({ request }) => {
    await zalogujPrzezApi(request, 'user', 'user123');

    const swoje = await request.get('/api/orders/ZAM-1001');
    expect(swoje.status()).toBe(200);
    expect((await swoje.json()).number).toBe('ZAM-1001');

    const cudze = await request.get('/api/orders/ZAM-1005');
    expect(cudze.status()).toBe(404);
    expect(await cudze.json()).toEqual({ error: 'Nie ma takiego zamówienia' });
  });

  test('administrator widzi zamówienie klienta ZAM-1001', async ({ request }) => {
    await zalogujPrzezApi(request, 'admin', 'admin123');

    const odpowiedz = await request.get('/api/orders/ZAM-1001');
    expect(odpowiedz.status()).toBe(200);
    expect((await odpowiedz.json()).number).toBe('ZAM-1001');
  });

  test('bez logowania API zamówień zwraca 401 „Wymagane logowanie”', async ({ request }) => {
    const odpowiedz = await request.get('/api/orders/ZAM-1001');

    expect(odpowiedz.status()).toBe(401);
    expect(await odpowiedz.json()).toEqual({ error: 'Wymagane logowanie' });
  });
});
