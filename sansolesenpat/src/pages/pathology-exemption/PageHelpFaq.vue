<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding class="csi-page-HealthPayments-faq">


    <q-card class="q-mt-md">
      <q-list no-border="" separator="" class="no-padding">
        <q-collapsible sparse="" label="1.  A chi è rivolto questo servizio?">
          <div>
            A tutti i cittadini, piemontesi e non.
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="2.  A cosa serve il servizio di pagamento dei ticket via web?">
          <div>
            A permettere il pagamento on line delle posizioni debitorie (esempio il Ticket) nei confronti un'Azienda
            sanitaria piemontese.
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="3.  Cos'è una posizione debitoria?">
          <div>
            Una posizione debitoria è un debito che il cittadino/utente ha nei confronti di un'Azienda sanitaria.
            Esempio di posizioni debitorie sono:
            <ul>
              <li>
                Un ticket sanitario che è stato generato a valle di una prenotazione o di un accesso a una struttura per
                un esame di laboratorio (es. esame del sangue) o una visita specialistica o esame radiologico.
              </li>
              <li>
                Una tariffa che è stata generata a valle di una prenotazione a una struttura per una prestazione in
                regime di "Libera professione", anche conosciuta come "Intramoenia".
              </li>
            </ul>
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="4.  Come si accede ai servizi di pagamento?">
          <div>
            Le modalità sono due, entrambi raggiungibili dall'inirizzo
            <a href="https://sansol.isan.csi.it/la-mia-salute/">https://sansol.isan.csi.it/la-mia-salute/</a>
            <ul>
              <li>Con accesso in modalità libera, ovvero non autenticata.</li>
              <li>
                Con accesso in modalità autenticata di livello 2, tramite SPID o Carta d'Identità Elettronica o Tessera
                Sanitaria abilitata all'utilizzo come CNS.
              </li>
            </ul>
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="5.  Qual è la differenza tra le modalità di accesso al servizio">
          <div>
            Con l’accesso in modalità libera potrai pagare inserendo il codice fiscale e il numero della pratica
            consegnato dalla Azienda Sanitaria o il numero di ricetta elettronica dematerializzata che ha generato la
            posizione debitoria (cioè quello con cui ti sei prenotato o sei stato accettato in un'Azienda sanitaria).
            Con l’accesso in modalità autenticata invece il sistema ti riconoscerà in base al tuo codice fiscale e sarà
            in grado, anche, di proporti le tue posizioni debitorie da pagare.
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="6.	Di cosa ho bisogno per pagare?">
          <div>
            <p>
              Con l’accesso in modalità libera devi avere la cedola di pagamento che l'Azienda sanitaria - attraverso ad
              esempio il servizio CUP - ti ha consegnato, nel servizio troverai delle immagini che ti spiegheranno quali
              sono i dati da inserire.
            </p>

            <p>
              Con l’accesso in modalità autenticata invece troverai, anche, l'elenco delle posizioni con una indicazione
              dell'Azienda a cui si riferiscono e l'importo.
            </p>

            <p>
              Inoltre, dal punto di vista dello strumento, è necessario possedere una carta di credito o un conto on
              line su un istituto di credito convenzionato con AgID o, avere installata una app che consente il
              pagamento tramite smartphone.
            </p>
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="7.  Il sistema mi propone una cifra inferiore o superiore rispetto a quella che mi aspettavo, cosa devo fare?">
          <div>
            Il sistema funziona in tempo reale quindi la cifra che ti propone è quella vigente per l'Azienda Sanitaria.
            Se non ti senti sicuro però è opportuno che contatti l'Azienda sanitaria, per esempio tramite l'URP,
            fornendo i tuoi dati e, almeno, il riferimento della posizione debitoria (il numero della pratica e la data
            in cui è stata generata).
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="8.	Il sistema mi dice che la posizione debitoria che sto cercando non esiste oppure che non ci sono posizioni debitorie a mio carico ma io me le aspetto, cosa devo fare?">
          <div>
            E' opportuno che tu contatti l'Azienda sanitaria, per esempio tramite l'URP, fornendo i tuoi dati e, almeno,
            il riferimento della posizione debitoria (il numero della pratica e a data in cui è stata generata).
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="9.	Il sistema mi dice che la posizione debitoria che ho già pagato è invece ancora da pagare, cosa devo fare?">
          <div>
            Non procedere con un nuovo pagamento ma contatta l'assistenza del servizio ai riferimenti indicati nella
            pagina comunicando i tuoi dati anagrafici e almeno il numero della pratica e la data in cui è stato
            effettuato il pagamento.
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="10.	Come faccio a sapere se il pagamento è andato a buon fine?">
          <div>
            Alla fine del processo di pagamento il sistema ti invierà su una pagina in cui potrai scaricare un
            documento, non valido a fini fiscali, che ti conferma l'avvenuta presa in carico del tuo pagamento.

            A seguire riceverai nella casella e-mail che hai inserito all'atto del pagamento, una mail con la ricevuta
            definitiva. Analoga ricevuta rimarrà comunque sempre scaricabile, dopo autenticazione, nel portale "La mia
            salute", all'indirizzo
            <a href="https://sansol.isan.csi.it/la-mia-salute/">https://sansol.isan.csi.it/la-mia-salute/</a>.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="11.	Come faccio a dimostrare all'Azienda sanitaria che ho effettuato il pagamento?">
          <div>
            L'Azienda sanitaria riceve una segnalazione ogni volta che un cittadino effettua un pagamento e quindi marca
            la posizione debitoria come pagata. Si consiglia, tuttavia, di portare con sé la ricevuta di pagamento
            all'atto dell'accesso nella struttura qualora si paghi in anticipo rispetto alla fruizione della
            prestazione.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="12.	Pagando il ticket da casa posso poi scaricare il referto se ho scelto di farlo on line?">
          <div>
            Assolutamente sì.
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="13.	Posso pagare anche per conto di altre persone?">
          <div>
            Sì, puoi pagare inserendo i dati necessari (codice fiscale e numero pratica) oppure, appena sarà resa
            disponibile la funzione, attraverso l'utilizzo della delega.
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="14.	Il sistema permette il pagamento tramite pagoPA?">
          <div>
            Sì, per la maggior parte delle Aziende sanitarie è l'unico modo per pagare via web o app.
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="15.	Esistono dei costi di commissione per il pagamento on line?">
          <div>
            In alcuni casi sì, sono presenti su alcuni Prestatori di Servizi di Pagamento nel pagamento tramite pagoPA.
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="16.	Che cos'è un Prestatore di Servizi di Pagamento (PSP)?">
          <div>
            È un ente che si occupa di incassare l'importo in nome e per conto dell'Azienda sanitaria. Nel pagamento
            tramite pagoPA puoi scegliere tu, in base ad alcuni parametri, quale PSP scegliere.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="17.	Come scelgo il Prestatore di Servizi di Pagamento nel pagamento tramite pagoPA?">
          <div>
            Puoi sceglierlo in base alle tue esigenze (es. hai un conto su un istituto bancario che è convenzionato con
            AgID) oppure in base ai costi di commissione del PSP.

            Qualunque PSP tu scelga comunque l'Azienda sanitaria riceverà il tuo pagamento e la tua posizione debitoria
            sarà assolta.
          </div>
        </q-collapsible>

      </q-list>
    </q-card>

  </q-page>
</template>


<script>

  export default {
    name: 'PageHelpFaq',
    props: {},
    data() {
      return {
        selectedTab: 'FAQ'
      }
    }
  }
</script>


<style lang="stylus">

  @require '~variables'

  .csi-page-delegations-faq
    .csi-text-underline
      text-decoration underline

    .q-collapsible-sub-item
      background-color $grey-1

</style>
