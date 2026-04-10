# Ankete App

Spletna aplikacija za ustvarjanje in reševanje anket.

---

## Opis projekta

Aplikacija omogoča uporabnikom:

* registracijo in prijavo
* ustvarjanje anket
* glasovanje v anketah
* ogled rezultatov
* nalaganje profilne slike (avatar)

Sistem vključuje:

* preprečevanje večkratnega glasovanja istega uporabnika
* časovno omejitev anket (glasovanje je možno samo v določenem časovnem obdobju)

---

## Tehnologije

### Frontend

* React (Vite)
* React Router

### Backend

* Node.js
* Express

### Baza podatkov

* PostgreSQL

### Ostalo

* JWT (avtentikacija in avtorizacija)
* Multer (nalaganje datotek)

---

## Namestitev in zagon

### 1. Kloniranje repozitorija

```bash
git clone https://github.com/fliqaaa/ankete-app.git
cd ankete-app
```

---
### Alternativa: GitHub Desktop

Če uporabljaš GitHub Desktop:

1. Odpri GitHub Desktop
2. Klikni **File → Clone repository**
3. Izberi repozitorij ali prilepi URL:
   https://github.com/fliqaaa/ankete-app.git
4. Izberi lokacijo na računalniku
5. Klikni **Clone**

Po kloniranju odpri projekt v Visual Studio Code.

## 🗄️ Nastavitev baze podatkov

### Povezava na bazo

Aplikacija se poveže na PostgreSQL bazo z uporabo zgornjih spremenljivk.

Prepričaj se, da:
- PostgreSQL strežnik deluje
- baza `ankete_app` obstaja
- uporabnik ima dostop do baze

### 1. Ustvari bazo

```sql
CREATE DATABASE ankete_app;
```

### 2. Ustvari tabele

Zaženi SQL skripto:

```text
backend/database.sql
```

Ta skripta ustvari vse potrebne tabele:

* users
* polls
* options
* votes


## Tesstni podatki(opcionalno)

INSERT INTO users (email, password)
VALUES ('test@test.com', 'hashed_password');

INSERT INTO polls (title, start_time, end_time, user_id)
VALUES (
    'Kateri je najboljši programski jezik?',
    '2026-04-07 08:00:00',
    '2026-04-10 20:00:00',
    1
);

INSERT INTO options (text, poll_id)
VALUES
('JavaScript', 1),
('Python', 1),
('Java', 1);

INSERT INTO votes (user_id, poll_id, option_id)
VALUES (1, 1, 2);
---

## ⚙️ Backend

```bash
cd backend
npm install
```

### Ustvari `.env` datoteko

V mapi `backend` ustvari datoteko `.env`:

```env naj izgledda nekako tako
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD= postgres
DB_NAME=ankete_app
JWT_SECRET=secret123
```
Opomba: prilagodi vrednosti glede na svojo PostgreSQL konfiguracijo.

### Zagon backenda

```bash
npm run dev
```

Backend teče na:

```
http://localhost:5000
```

---

## 💻 Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend teče na:

```
http://localhost:5173
```

---

## Funkcionalnosti

* Registracija in prijava uporabnika
* JWT avtentikacija
* Zaščitene poti (Protected routes)
* Ustvarjanje anket
* Glasovanje (1 glas na uporabnika)
* Preprečevanje večkratnega glasovanja
* Časovno omejene ankete
* Prikaz rezultatov
* Nalaganje profilne slike (avatar)
* Spreminjanje avatarja s klikom na profilno sliko

---

## Struktura projekta

```
ankete-app/
│
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── database.sql
│   ├── db.js
│   └── index.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.jsx
│
└── README.md
```

---

## Varnost

* JWT avtentikacija
* Zaščiteni API endpointi
* Validacija vhodnih podatkov na backendu
* Preprečeno večkratno glasovanje istega uporabnika

---

## Opombe

* `.env` datoteka ni vključena v repozitorij
* `node_modules` ni vključen (uporabi `npm install`)
* aplikacija deluje lokalno (localhost)

---

## Testni uporabnik (opcijsko)

Lahko ustvariš svoj račun ali uporabiš:

```
Email: test@test.com
Geslo: test123
```

---

## Avtor

Ime in priimek: Gal Bekavac
