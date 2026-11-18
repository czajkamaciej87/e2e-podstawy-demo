import { test, expect } from '@playwright/test';

// P13. Odliczanie do Czarnego Piątku (API).
// Nagłówek X-Namssor-Teraz ustawia „dzisiejszą” datę, dzięki czemu wynik nie zależy od dnia uruchomienia.

test.describe('Odliczanie do Czarnego Piątku w API', () => {
  test('20.11.2026 do Czarnego Piątku zostaje 7 dni', async ({ request }) => {
    const odpowiedz = await request.get('/api/promocja', { headers: { 'X-Namssor-Teraz': '2026-11-20' } });

    expect(odpowiedz.status()).toBe(200);
    const tresc = await odpowiedz.json();
    expect(tresc.days_left).toBe(7);
    expect(tresc.message).toBe('Czarny Piątek w Namssorze startuje 27.11.2026. Do startu promocji zostało 7 dni.');
  });

  test('data „jutro” w nagłówku X-Namssor-Teraz daje status 400', async ({ request }) => {
    const odpowiedz = await request.get('/api/promocja', { headers: { 'X-Namssor-Teraz': 'jutro' } });

    expect(odpowiedz.status()).toBe(400);
  });
});
