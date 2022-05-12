<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <csi-page-title title="Cookie policy" no-back class="q-mb-md"/>

    <p>
      I cookie sono piccoli file di testo che il server web deposita sul dispositivo con cui l'utente naviga, senza
      identificarlo. Un cookie non può leggere dati personali salvati sul disco fisso o file di cookie creati da altri
      siti, poiché le sole informazioni che può contenere sono quelle fornite dall'utente stesso. Su SalutePiemonte non
      viene fatto uso di cookie per la trasmissione di informazioni di carattere personale, né vengono utilizzati
      cosiddetti cookie per il tracciamento degli utenti.
    </p>

    <p>
      SalutePiemonte fa uso di <strong>cookie tecnici</strong>, che non vengono memorizzati in modo persistente sul
      computer dell'utente e sono necessari per consentire l'esplorazione sicura ed efficiente del sito. Tale uso è
      limitato a cookie di sessione (trasmissione di identificativi di sessione costituiti da numeri casuali generati
      dal server) e in generale a cookie di dominio e cookie di monitoraggio. <br>
      L'utilizzo di questi cookie viene fatto in modo da evitare il ricorso ad altre tecniche informatiche
      potenzialmente pregiudizievoli per la riservatezza della navigazione degli utenti, non consentendo l'acquisizione
      di dati personali identificativi dell'utente.
    </p>

    <p>
      Al fine di facilitare la navigazione nel sito e il modo in cui i visitatori ci arrivano, il sito utilizza <strong>Matomo</strong>,
      un software open source di analisi web che garantisce piena compatibilità con le leggi europee relative alla
      protezione dei dati. Per analizzare i punti di maggiore interesse dei siti visitati dall’utente, Matomo utilizza i
      cookie a scopi statistici e raccoglie informazioni in sola forma aggregata, senza associare l'indirizzo IP di
      navigazione dell'utente a nessun altro dato raccolto precedentemente.
    </p>

    <p>
      La navigazione su SalutePiemonte comporta l’accettazione delle condizioni d’uso, comprese le funzionalità legate
      ai cookie che possono essere disabilitati utilizzando le opzioni specifiche presenti nei vari tipi di browser.
      Salvo quanto sopra indicato, il sito web dell’Ente non fa uso di altri cookie per la trasmissione di informazioni
      di carattere personale e non utilizza altri sistemi per il tracciamento degli utenti.
    </p>
  </q-page>
</template>

<script>
  import CsiPageTitle from "components/global/common/CsiPageTitle";

  export default {
    name: 'PageCookiePolicy',
    components: {CsiPageTitle},
    data() {
      return {}
    },
    computed: {},
    methods: {}
  }
</script>


<style scoped lang="stylus"></style>
