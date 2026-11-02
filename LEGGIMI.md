# ContoInCasa: come metterla online

Ci vogliono circa 20 minuti, e si fa una volta sola.

## 1. Il database (Supabase)

1. Vai su https://supabase.com e accedi con **Continue with GitHub**.
2. Crea un progetto con **New project**: nome `contoincasa`, una password per il database (segnatela) e come regione **Central EU (Frankfurt)**. Aspetta un paio di minuti.
3. Nel menu a sinistra apri **SQL Editor**, poi **New query**. Incolla tutto il contenuto del file `supabase.sql` e premi **Run**. Deve comparire "Success".
4. Apri **Authentication**, poi **Sign In / Providers**, e disattiva **Allow new users to sign up**. Così nessun estraneo può registrarsi.
5. Apri **Authentication**, poi **Users**, poi **Add user** e infine **Create new user**. Crea l'utente per te: email, password e spunta **Auto Confirm User**. Ripeti per tua moglie.
6. Apri **Project Settings**, poi **API** (o **Data API**), e copia:
   - **Project URL**
   - **anon public key**

   Incollali nel file `config.js`, al posto delle due scritte INCOLLA-QUI.

## 2. L'app su GitHub Pages

1. Su https://github.com crea un repository nuovo con **New**: nome `contoincasa`, tipo **Public**.
2. Nella pagina del repository scegli **uploading an existing file**. Trascina **tutto il contenuto** di questa cartella, compresa la cartella `icons`, poi premi **Commit changes**.
3. Apri **Settings** e poi **Pages**. Come Source scegli **Deploy from a branch**, come Branch `main` e `/ (root)`, poi premi **Save**.
4. Dopo uno o due minuti l'app è online all'indirizzo
   `https://TUO-NOME-UTENTE.github.io/contoincasa/`

Il codice è pubblico, ma i vostri dati no. Stanno su Supabase e li vede solo chi entra con email e password.

## 3. Sul telefono

- **iPhone:** apri l'indirizzo in **Safari**, fai l'accesso, poi tocca Condividi e scegli **Aggiungi alla schermata Home**.
- **Android:** apri l'indirizzo in **Chrome**, fai l'accesso, poi tocca ⋮ e scegli **Installa app** (o **Aggiungi a schermata Home**).

L'icona sarà il vostro logo, con il nome ContoInCasa sotto.

## Aggiornare l'app in futuro

Carica su GitHub i file nuovi al posto dei vecchi. Poi in `sw.js` aumenta il numero di versione (`contoincasa-v1` diventa `contoincasa-v2`), così i telefoni scaricano la versione nuova.


Pasword DB Squalo_2026

Ramaglia.giovanni@virgilio.it
Squalo_33

Simona.brosca@libero.it
1234biscotto