Środowisko działa, npm test bez błędów.

## Ćwiczenie 03: testy w tests/czytanie/ (pliki 01–03)

| Test | Co robi użytkownik | Co test sprawdza | Czego test nie sprawdza | Kiedy zrobi się czerwony |
|---|---|---|---|---|
| 01 › wyszukiwanie „zębów” znajduje dwa produkty | otwiera stronę główną, wpisuje „zębów” w pole „Szukaj produktu”, klika „Filtruj” | licznik produktów ma dokładnie `2`; w tabeli są komórki „Pasta do zębów” i „Szczoteczka do zębów” (`exact: true`, żeby nie złapać przycisku „Dodaj do koszyka: …”) | że inne produkty zniknęły z tabeli (pilnuje tego pośrednio tylko licznik); ceny i dostępność znalezionych produktów | wyszukiwarka zwróci inną liczbę wyników; zmieni się nazwa któregoś produktu albo etykieta pola / przycisku |
| 01 › wyszukiwanie bez wyników pokazuje komunikat | otwiera stronę główną, wpisuje „rower”, klika „Filtruj” | widać napis „Brak produktów spełniających kryteria.” | że licznik pokazuje `0`; że tabela produktów jest pusta | zmieni się treść komunikatu; w bazie pojawi się produkt pasujący do „rower” |
| 02 › Moje zamówienia › lista pokazuje zamówienia klienta z ich statusem | wchodzi na `/zamowienia` bez logowania, dostaje formularz logowania, loguje się jako `user` / `user123` | po logowaniu adres kończy się na `/zamowienia`; jest nagłówek „Moje zamówienia”; wiersz ZAM-1001 zawiera „Szampon nawilżający”; wiersz ZAM-1002 zawiera „Pasta do zębów” i „Anulowane”; napis „Ładowanie…” zniknął | statusu ZAM-1001 (nazwa obiecuje statusy); kwot i dat zamówień; ile zamówień jest na liście | logowanie nie wróci na `/zamowienia`; lista nie załaduje się w 5 s; zmienią się dane demo (produkt lub status zamówień 1001/1002) |
| 02 › Moje zamówienia › klient nie widzi zamówienia innej osoby | jak wyżej: wchodzi na `/zamowienia` i loguje się jako `user` | najpierw czeka na wiersz ZAM-1001 (lista się załadowała), potem sprawdza, że wierszy ZAM-1005 jest 0 | że cudze zamówienie nie otworzy się z bezpośredniego adresu albo przez API; innych cudzych zamówień niż ZAM-1005 | ZAM-1005 pojawi się na liście klienta; ZAM-1001 nie pojawi się w 5 s (np. wolne ładowanie, zmiana danych) |
| 03 › produktu niedostępnego nie da się dodać do koszyka | otwiera stronę główną z tabelą produktów | wiersz „Serum z witaminą C” jest widoczny i ma napis „Niedostępny” | tego, co obiecuje nazwa: że przycisk „Dodaj do koszyka” jest wyłączony (brakuje np. `await expect(wiersz.getByRole('button', { name: /Dodaj do koszyka/ })).toBeDisabled();`); że po kliknięciu produkt nie trafia do koszyka | serum znów będzie na stanie albo zmieni się napis „Niedostępny”; produkt zniknie z tabeli; zielony zostanie nawet wtedy, gdy przycisk przestanie być wyłączony |

### Wyniki po uruchomieniu (krok 6)

`npx playwright test tests/czytanie/01 tests/czytanie/02 tests/czytanie/03` → `5 passed`

| Test | Wynik | Czy zielony wynik potwierdza nazwę testu? |
|---|---|---|
| 01 › wyszukiwanie „zębów” znajduje dwa produkty | ✅ passed | **Tak.** Licznik `2` i obie nazwy produktów to dokładnie to, co obiecuje nazwa. |
| 01 › wyszukiwanie bez wyników pokazuje komunikat | ✅ passed | **Tak**, nazwa obiecuje tylko komunikat. Licznik `0` i pusta tabela nadal niesprawdzone, ale nazwa tego nie obiecuje. |
| 02 › Moje zamówienia › lista pokazuje zamówienia klienta z ich statusem | ✅ passed | **Częściowo.** Status sprawdzony tylko dla ZAM-1002 („Anulowane”). ZAM-1001 ma w danych status `new`, ale żadna asercja tego nie sprawdza. |
| 02 › Moje zamówienia › klient nie widzi zamówienia innej osoby | ✅ passed | **Częściowo.** Potwierdza tylko, że ZAM-1005 (zamówienie innego użytkownika) nie ma na liście. Nie wiadomo, czy klient otworzy je z bezpośredniego adresu albo przez API. |
| 03 › produktu niedostępnego nie da się dodać do koszyka | ✅ passed | **Nie.** Sprawdza tylko napis „Niedostępny”. Przycisk „Dodaj do koszyka” jest dziś wyłączony (stan serum = 0), ale test tego nie sprawdza: zostałby zielony, gdyby przycisk znów działał. |

Wniosek: kolumna „Czego test nie sprawdza” zgadza się z wynikiem uruchomienia, w tabeli nie trzeba nic poprawiać.
