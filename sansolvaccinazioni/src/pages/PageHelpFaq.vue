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
            title: `A chi è rivolto questo servizio?`, text: `A tutti i cittadini, piemontesi e non. Per i cittadini non
            piemontesi il servizio è limitato alle sole prestazioni fruite presso una delle ASL piemontesi.`
        },
        {
            title: `A cosa serve il servizio on line Vaccinazioni?`, text: `  A visualizzare:
            <ul>
              <li> gli appuntamenti attivi, con stampa del promemoria di prenotazione</li>
            <li> i prossimi vaccini, con indicazione della data a partire dalla quale si potrà ricevere un appuntamento
            dall’ASL</li>
              <li> i vaccini effettuati, con stampa della scheda vaccinale per ciascuno di essi</li>
              <li> l’Attestato Storico Vaccinale, con stampa dello stesso (servizio disponibile solo per i cittadini
              piemontesi che abbiano attivato il Fascicolo Sanitario Elettronico)</li>
            </ul>
            Il servizio consente, inoltre, di attivare il Fascicolo Sanitario Elettronico per avere accesso in
            visualizzazione e stampa al proprio Attestato Storico Vaccinale.`
        },
        {
            title: `È possibile attivare il Fascicolo Sanitario Elettronico anche per conto di un figlio minore?`,
            text: ` Sì,
            puoi attivare il Fascicolo Sanitario Elettronico per i tuoi figli minorenni utilizzando la loro tessera
            TS-CNS, avendone attivato il certificato, oppure recandoti presso qualsiasi Punto Assistito delle Aziende
            Sanitarie Pubbliche del Servizio Sanitario Nazionale.`
        },
        {
            title: `Che cosa indica la data presente nella sezione “Prossimi vaccini”`, text: `Questa data non rappresenta un
            appuntamento ma indica il periodo a partire dal quale si potrà ricevere la lettera di invito con l’appuntamento per
            il prossimo vaccino indicato nella sezione. È, quindi, indispensabile
            attendere la lettera della propria ASL per sapere quando e dove presentarsi per il prossimo vaccino.`
        },
        {   title: `È possibile utilizzare il servizio anche per conto di un figlio minore?`, text: ` Sì, a condizione che
            sia stata attivata la delega.`},
        {   title: `Come si può ottenere la delega per un figlio minore?`, text: `Accedendo al servizio "Gestione Deleghe"
            nella sezione “I tuoi figli minori” hai a disposizione la funzione
            “Nuova dichiarazione” con cui puoi inserire la dichiarazione di responsabilità genitoriale. Al momento il servizio
            telematico gestisce la “Dichiarazione congiunta di entrambi i genitori”, che permette a due genitori che congiuntamente
            si autenticano con SPID di inserire una dichiarazione di responsabilità genitoriale per lo stesso minore ed ottenere
            la delega del minore senza l’intervento dell'operatore dell’ASL. Il sistema richiede l’istanza di un genitore
            e la dichiarazione di conferma da parte dell’altro genitore (altre modalità, come per esempio la delega su
            dichiarazione fatta da un solo genitore, verranno abilitate in seguito).`},
        {   title: `Nella sezione “Vaccini effettuati” è presentato un numero di vaccini inferiore rispetto a quelli effettuati.`,
            text: `Per semplicità di visualizzazione sono presentati solo gli ultimi vaccini effettuati. Per visualizzare anche
            tutti i precedenti è sufficiente selezionare il bottone “mostra tutti`},
        {   title: `Ho effettuato un vaccino presso una ASL del Piemonte diversa da quella di appartenenza: sarà comunque
            riportato nell’Attestato Storico Vaccinale?`, text: ` Sì, l’Attestato Storico Vaccinale riporta tutti i vaccini
            effettuati sia presso la propria ASL, sia presso le altre ASL piemontesi.`},
        {   title: `Ho effettuato un vaccino presso una ASL di un’altra regione: sarà comunque riportato nell’Attestato
            Storico Vaccinale?`, text: `Sì, oltre ai vaccini effettuati presso la propria ASL e presso le altre ASL
            piemontesi, l’Attestato Storico Vaccinale riporta anche i vaccini effettuati presso le altre regioni.
            La comunicazione di tali vaccinazioni da parte delle altre regioni, però, non avviene in tempo reale, perciò
            l’aggiornamento del proprio Attestato Storico Vaccinale non è immediato.`}
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
