import { test, expect } from '@playwright/test';

// Ćwiczenie 04b: ta sama cena promocyjna na kafelku, na karcie produktu i w koszyku.
// Karta: docs/cwiczenia/04-locatory-codegen.md (część 04b)
// Gdy test będzie gotowy, zamień `test.fixme` na `test`. Dopóki jest fixme, Playwright go pomija.
// Konto tester11 ma osobny koszyk: testy z ćwiczeń 02 i 04 dodają produkty do koszyka konta user.

test('cena promocyjna kremu jest taka sama na kafelku, karcie produktu i w koszyku', async ({ page }) => {
  // TODO 1: zaloguj się jako tester11 / czarny-piatek-2026.
  // TODO 2: na stronie „Produkty” znajdź kafelek „Krem do twarzy na dzień” (sekcja „Oferta na Czarny Piątek” pod tabelą).
  //         Sprawdź w kafelku: cena 26,39 zł, stara cena 32,99 zł, plakietka -20%.
  // TODO 3: kliknij nazwę produktu w kafelku. Sprawdź nagłówek karty produktu i te same trzy rzeczy.
  // TODO 4: kliknij „Dodaj do koszyka” i sprawdź komunikat „Dodano do koszyka: Krem do twarzy na dzień”.
  // TODO 5: przejdź do koszyka (link „Koszyk” w menu). Sprawdź, że wiersz kremu ma cenę 26,39 zł.
  // TODO 6: usuń krem z koszyka, żeby następne uruchomienie zaczynało od pustego koszyka.
  await page.goto('http://localhost:4100/');
  await page.getByRole('link', { name: 'Zaloguj' }).click();
  await page.getByRole('textbox', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Login' }).fill('tester11');
  await page.getByRole('textbox', { name: 'Hasło' }).click();
  await page.getByRole('textbox', { name: 'Hasło' }).fill('czarny-piatek-2026');
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await expect(page.getByRole('article', { name: 'Krem do twarzy na dzień' })).toBeVisible();
  await expect(page.locator('#kafelek-5')).toContainText('Krem do twarzy na dzień');
  await expect(page.getByTestId('product-tiles')).toContainText('32,99 zł');
  await expect(page.getByTestId('product-tiles')).toContainText('26,39 zł');
  await expect(page.getByTestId('product-tiles')).toContainText('-20%');
  await page.getByRole('link', { name: 'Krem do twarzy na dzień' }).click();
  await expect(page.getByTestId('product-old-price')).toContainText('32,99 zł');
  await expect(page.getByTestId('product-price')).toContainText('26,39 zł');
  await expect(page.getByTestId('product-badge')).toContainText('-20%');
  await page.getByRole('button', { name: 'Dodaj do koszyka' }).click();
  await expect(page.getByTestId('flash')).toContainText('Dodano do koszyka: Krem do twarzy na dzień');
  await page.getByRole('link', { name: 'Koszyk' }).click();
  await expect(page.getByTestId('cart-item-price')).toBeVisible();
  await expect(page.getByTestId('cart-item-price')).toContainText('32,99 zł 26,39 zł -20%');
  await page.getByRole('button', { name: 'Usuń: Krem do twarzy na dzień' }).click();
});
