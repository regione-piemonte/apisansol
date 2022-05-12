# Nome progetto | La mia salute (lms-nome-progetto-fe)

Descrizione progetto

## Getting started
### Installa le dipendenza
```bash
npm install
```

### Avvia il progetto in modalità sviluppo (hot-code reloading, error reporting, etc.)
```bash
npm run dev
```

### Builda l'app per test
```bash
npm run build:test
```

### Builda l'app per produzione
```bash
npm run build:prod
```

### Controlli prima di partire con lo sviluppo

1. Nel `package.json` modificare `name`, `description`, `productName` ed `author` in base al progetto.

2. Modificare `APP_CODE` in tutti gli ambienti (cartella `envs`) in base al codice applicativo dell'app che si sta sviluppando.
Questo codice va preso dalla configurazione del portale "La mia salute" (API /lms/api/v1/configurazione)

3. Modifica eventualmente il componente `src/components/TheGuardBootstrap` per caricare i dati necessari all'avvio dell'app

4. Modifica eventualmente il componente `src/App` per aggiungere/rimuovere guardie

5. Modifica eventualmente il file `src/index.template.html` per aggiornare le versioni dei browser supportati


## Cosa offre lo scheletro

### Index preconfigurata

Il file `src/index.template.html` è già stato preconfigurato per permettere all'applicazione di far parte della PWA
del portale.

Inoltre nell'index è presente anche la gestione dei browser obsoleti.

### Stili preconfigurati

Le variabili di Quasar sono sovrascritte per avere un look & feel coerente tra tutti i verticali.


### Più componenti

Sono stati aggiunti dei componenti in più rispetto a quelli offerti da quasar che permettono di uniformare
l'aspetto tra le varie app del portale "La mia salute".

Alcuni componenti sono stati costruiti ex-novo per offrire maggiori funzionalità permettendo agli sviluppatori di
lavorare più rapidamente

### Distinzione tra ambianti

Sono stati configurati 3 ambienti

1. Sviluppo
2. Test
3. Produzione

E' possibile customizzare il comportamento di ogni ambiente tramite le variabili d'ambiente presenti nella
cartella `envs`.

Per sapere su quale ambiente sta girando la nostra applicazioni sono presenti dei flag ad hoc:
```js
process.env.APP_ENV // 'dev', 'test', 'prod'
process.env.APP_IS_DEV
process.env.APP_IS_TEST
process.env.APP_IS_PROD
```

### Layout predefinito

Il layout è già stato implementato e nella maggior parte dei casi non dovrebbe richiedere modifiche.
Tuttavia, se necessario, è possibile modificarlo per adeguarlo all'applicazione che si sta sviluppando.

### Bootstrap e guardie predefinite

Sono stati predefiniti anche una serie di componenti "guardie" che effettuano chiamate alle API e/o controlli prima
di avviare l'applicazione

1. __TheGuardBootrstap__

    Ha il compito di effettuare le chiamate alle API per caricare nello store tutti i dati necessari all'avvio dell'applicazione
    In particolare vengono caricati:

    1. La configurazione del portale
    2. Le informazioni base dell'utente loggato
    3. Se l'utente è loggato, le informazioni di dettaglio
    4. Se l'utente è loggato, le informazioni del profilo sul notificatore
    5. Se l'utente è loggato, le informazioni riguardo l'apertura del FSE
    6. Se l'utente è loggato e l'app su cui stiamo lavorando è delegabile, l'elenco dei deleganti


2. __TheGuardAuthValid__

    Ha il compito di verificare che le credenziali dell'utente loggato siano abbastanza forti.
    In particolare controlla che queste credenziali siano state riscontrate da un operatore.

3. __TheGuardEnrollment__

    Ha il compito di controllare se l'app su cui stiamo lavorando consiglia o necessita dell'apertura del FSE e
    mostra all'utente un messaggio.

4. __TheGuardFcm__

    Ha il compito di interagire con Firebase e con il browser per chiedere all'utente di abilitare le notifiche push,
    ottenere il token FCM da Firebase ed inviarlo al notificatore.

### Store predefinito

Nello store Vuex è già presente la gestione delle informazioni principali di cui tutta l'app ha bisogno per lavorare:

1. __config__

    Contiene la configurazione del portale ottenuta tramite una chiamata alle API

2. __user__

    Contiene le informazioni di base relative all'utente loggato.
    Se questo dato è popolato significa che l'utente è loggato, altrimenti vale `null` e significa che l'utente non è loggato

3. __userInfo__

    Contiene informazioni di dettaglio dell'utente loggato.
    Se l'utente è loggato e questo campo vale `null` significa che l'utente non ha assistenza sanitaria piemontese

4. __notifyContacts__

    Contiene le informazioni relative al profilo che l'utente loggato ha sul notificatore.
    Se l'utente è loggato e questo campo vale `null` significa che l'utente non ha ancora impostato il suo
    profilo sul notificatore

5. __fcmToken__

    Contiene il token FCM ottenuto da Firebase

6. __enrollmentInfo__

    Contiene informazioni relative al FSE dell'utente loggato.
    In particolare ci permette di sapere se l'utente ha già aperto il FSE oppure se può aprirlo o meno

7. __delegatorList__

    Contiene l'elenco dei deleganti dell'utente loggato

8. __delegtorSelected__

    Contiene il delegante per cui l'utente loggato vuole operare


### Routes predefinite

La struttua di base delle routes è già stata definita.
Questo permette di iniziare subito a lavorare sulla homepage o comunque di configurare solo le nuove pagine
necessarie all'applicazione da sviluppare.

### API predefinite

Il client HTTP (axios) è già preconfigurato nel file `src/boot/http` mentre le chiamate alle API necessarie sono
presenti nel file `src/services/api`
