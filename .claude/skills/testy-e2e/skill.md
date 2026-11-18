---
name: test-e2e
description: Pisze test E2E Playwright według zasad z CLAUDE.md. Użyj, gdy użytkownik prosi o nowy test, automatyzację przypadku testowego albo scenariusza.
---
Przeczytaj przypadek testowy.
Przejdź scenariusz w aplikacji.
Pokaż plan i poczekaj na akceptację.
Napisz test.
Uruchom go dwa razy.
Pokaż, że test potrafi paść.
Przejdź listę kontrolną.

## Logowanie

Do logowania używaj helpera `tests/pomocnicze/logowanie.ts`. Nie wpisuj w teście loginu
ani hasła ręcznie (bez `getByLabel('Login').fill(...)` w teście). To wyjątek od zasady
z CLAUDE.md o imporcie tylko z `@playwright/test`.

- Test w przeglądarce: `await zaloguj(page);`
- Test API: `await zalogujPrzezApi(request);`
- Import (ścieżkę dopasuj do folderu testu), np. z `tests/czytanie/`:
  `import { zaloguj } from '../pomocnicze/logowanie';`
- Wywołuj bez loginu i hasła. Helper bierze konto ze zmiennych `APP_USER` i `APP_PASSWORD`.
  Nie zapisuj danych konta w pliku testu.
- Inne konto (np. `admin`) podawaj jawnie tylko, gdy scenariusz go wymaga:
  `await zaloguj(page, 'admin', 'admin123');`

Konto do uruchamiania testów: login `tester11`, hasło `czarny-piatek-2026`.
Przed uruchomieniem ustaw je w PowerShell:

```powershell
$env:APP_USER="tester11"
$env:APP_PASSWORD="czarny-piatek-2026"
npx playwright test <plik>
```
