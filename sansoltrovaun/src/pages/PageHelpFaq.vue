<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="q-mt-lg q-gutter-y-md">
    <lms-faq-list-item
      v-for="(faq, index) in faqList"
      :key="faq.title"
      :title="faq.title"
      :number="index + 1"
    >
      <div class="text-body1" v-html="faq.text"></div>
    </lms-faq-list-item>


  </div>
</template>

<script>
  import LmsFaqListItem from "src/components/core/LmsFaqListItem";

  const FAQ_LIST = [
    {
      title: `A chi è rivolto il servizio on line?`,
      text: '<p>È rivolto a tutti gli utenti che accedono al portale Salute Piemonte.</p>'
    },
    {
      title: `Come accedo?`,
      text: `<p>Il servizio è ad accesso libero per tutti coloro che usufruiscono di Salute Piemonte, pertanto non è necessario avere delle credenziali per poterlo utilizzare.</p>`
    },
    {
      title: `Quali strutture posso trovare?`,
      text: `<p>All'interno del servizio è possibile trovare le seguenti tipologie di strutture:</p>
            <ul>
            <li>Ospedali;</li>
            <li>Case di cura pubbliche e private accreditate;</li>
            <li>Ambulatori di medici di medicina generale e di pediatri di libera scelta;</li>
            <li>Farmacie;</li>
            <li>Strutture sanitarie pubbliche e private accreditate (es. Ser.D, consultori materno infantili, centri dialisi, ecc.…);</li>
            <li>Punti vendita accreditati per i prodotti per celiaci (grande distribuzione, negozi specializzati/parafarmacie e farmacie).</li>
            </ul>`
    },
    {
      title: `Perché il servizio richiede di conoscere la mia posizione geografica?`,
      text: `<p>Il servizio si avvale di un sistema di geolocalizzazione che aiuta gli utenti a trovare le strutture più vicine alla posizione in cui si trovano in quel momento.</p>
             <p>Non è obbligatorio fornire l'esatta posizione per poter usufruire del servizio.</p>`
    },
    {
      title: `Posso impostare un indirizzo specifico da cui partire per una ricerca?`,
      text: `<p>Sì, è possibile indicare un indirizzo diverso dalla posizione in cui ci si trova; è sufficiente indicare il comune oppure si può digitare un indirizzo più preciso.</p>
             <p>Il sistema fornirà una serie di suggerimenti per agevolare l'inserimento del punto geografico.</p>`},
    {
      title: `Come posso sapere se una farmacia vende prodotti per celiaci?`,
      text: `<p>Bisogna cliccare sul riquadro "Punti vendita prodotti per celiaci" e scegliere Farmacia come
            tipo negozio. Il servizio mette a disposizione la possibilità di cercare le farmacie più vicine alla
            posizione di un utente o ad un indirizzo inputato dal cittadino;
            per alcune farmacie è opportuno verificare la reale disponibilità dei prodotti contattando direttamente la struttura.</p>`
    },
    {
      title: `Come funziona l'opzione "trasporto pubblico"?`,
      text: `<p>Il servizio fornisce, per i risultati di ricerca, la possibilità di visualizzare le fermate dei mezzi
            pubblici dislocate nei pressi della struttura selezionata; per ciascuna fermata, se messi a disposizione
            dalle aziende di trasporto, è possibile vedere gli orari dei passaggi programmati dei mezzi che vi transitano.</p>
            <p>Per la sola città di Torino, è disponibile un link che rimanda al sito di GTT in cui visualizzare gli
            orari in tempo reale dei mezzi che passano in quelle fermate.</p>`
    },
    {
      title: `Come funziona l'opzione "indicazioni stradali"?`,
      text: `<p>Il servizio si avvale di Google Maps per calcolare il percorso ottimale per raggiungere la struttura
            selezionata fornendo in automatico l'indirizzo del punto d'arrivo e consentendo all'utente di utilizzare
            la propria posizione geolocalizzata o un indirizzo specifico come punto di partenza.</p>
            <p>Il servizio "Trova un" non è responsabile per eventuali errori nel calcolo del percorso.</p>`
    },
    {
      title: `Cosa si intende per "assistenza temporanea" e "assistenza illimitata"?`,
      text: `<p><strong>Assistenza temporanea: </strong>ne beneficiano i cittadini che per differenti motivi si trovano a
 vivere in una località diversa dalla propria residenza.
 In tali casi i soggetti hanno diritto a scegliere un Medico di Medicina Generale o un Pediatra di Libera Scelta
 nel luogo in cui si spostano momentaneamente. È necessario che il trasferimento sia stato dovuto a ragioni di:
 lavoro, studio o per ricongiungimento familiare. I soggetti che possono richiedere un'assistenza sanitaria temporanea sono:</p>
<ul>
<li>i lavoratori fuori sede;</li>
<li>gli studenti, i seminaristi, i convittori e similari assenti dalle loro famiglie per motivi di studio;</li>
<li>le persone costrette al trasferimento provvisorio per motivi di salute.</li>
</ul>
<p>Rientrano in questa categoria coloro che devono sottoporsi a determinate cure mediche presso centri specializzati o
ospedali lontani da casa nonché coloro che soggiornano in date località climatiche per comprovati motivi medici.</p>
<p>La permanenza nel nuovo domicilio deve essere compresa in un periodo di tempo che va dai 3 mesi ad 1 anno;</p>
<p><strong>Assistenza illimitata (o permanente): </strong>ne beneficiano i cittadini che indicano di avere residenza,
domicilio e il medico scelto all'interno della stessa ASL.
Il Medico di Medicina Generale o il Pediatra di Libera Scelta selezionato ha validità
fino a quando non viene revocato dal cittadino o quando lo stesso medico non esercita più la sua professione.</p>`
    },
    {
      title: `Cosa significa che un medico è disponibile solo per ricongiungimento familiare?`,
      text: `<p>Significa che il Medico di Medicina Generale o il Pediatra di Libera Scelta può accettare esclusivamente
            familiari dei propri assistiti che fanno parte dello stesso nucleo familiare e presenti nello stato di famiglia.</p>
            <p>In questo caso viene richiesta la compilazione dei dati del familiare già in cura presso il medico scelto
             e il grado di parentela.</p>
            <p>La richiesta verrà esaminata da un operatore di sportello che valuterà i dati inseriti nelle "Informazioni supplementari"
            e fornirà un esito di:</p>
            <ul>
                <li>accettazione richiesta;</li>
                <li>oppure di non accettazione richiesta.</li>
            </ul>`
    },
  ];

  export default {
    name: "PageHelpFaq",
    components: {LmsFaqListItem},
    props: {},
    data() {
      return {
        faqList: FAQ_LIST
      };
    },
    computed: {},
    created() {
    },
    methods: {}
  };
</script>

<style scoped lang="sass"></style>
