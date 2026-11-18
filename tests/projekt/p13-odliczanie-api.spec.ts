import { test, expect } from '@playwright/test';

// P13. Odliczanie do Czarnego Piątku (API).
// Nagłówek X-Namssor-Teraz ustawia „dzisiejszą” datę, dzięki czemu wynik nie zależy od dnia uruchomienia.
// Zmiana wymagań Bożeny z 13:00: zarząd patrzy na dzień przed startem i na sam start.

const daty = [
  {
    data: '2026-11-26',
    opis: 'dzień przed startem zostaje 1 dzień',
    dni: 1,
    komunikat: 'Czarny Piątek w Namssorze startuje 27.11.2026. Do startu promocji został 1 dzień.',
  },
  {
    data: '2026-11-27',
    opis: 'w dniu startu promocja trwa',
    dni: 0,
    komunikat: 'Czarny Piątek w Namssorze trwa! Tylko dziś najniższe ceny.',
  },
];

test.describe('Odliczanie do Czarnego Piątku w API', () => {
  // Osobny test dla każdej daty, żeby w raporcie był osobny wynik. Nazwa zawiera datę.
  for (const { data, opis, dni, komunikat } of daty) {
    test(`${data}: ${opis}`, async ({ request }) => {
      const odpowiedz = await request.get('/api/promocja', { headers: { 'X-Namssor-Teraz': data } });

      expect(odpowiedz.status()).toBe(200);
      const tresc = await odpowiedz.json();
      expect(tresc.days_left).toBe(dni);
      expect(tresc.message).toBe(komunikat);
    });
  }

  test('data „jutro” w nagłówku X-Namssor-Teraz daje status 400', async ({ request }) => {
    const odpowiedz = await request.get('/api/promocja', { headers: { 'X-Namssor-Teraz': 'jutro' } });

    expect(odpowiedz.status()).toBe(400);
  });
});
