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
import LmsFaqListItem from "../components/core/LmsFaqListItem";

const FAQ_LIST = [
  {
    title: `Che cosa significa il messaggio "La mia salute vorrebbe mandarti delle notifiche in caso di eventi importanti"?`,
    text: `
      È un messaggio che compare la prima volta che ti colleghi al portale La mia salute.
      Puoi scegliere se farti inviare le notifiche oppure no selezionando gli appositi bottoni.
    `
  },
  {
    title: `Che cosa significa il messaggio "Per utilizzare i servizi on line della sanità piemontese è necessario aver aperto il Fascicolo Sanitario Elettronico"?`,
    text: `
      Il sistema ti invita, qualora non lo avessi già fatto, ad attivare il fascicolo sanitario elettronico in cui
      sono resi disponibili i documenti e le informazioni relative alla tua storia clinica.
    `
  },
  {
    title: `Il mio referto non è presente nel sistema per effettuare lo scarico`,
    text: `
      Il referto non è presente in questi casi:
      <ul>
        <li>
          il referto non è stato inviato dalla Azienda Sanitaria al sistema centrale per lo scarico, o
          diversamente è scaduto il tempo previsto per il ritiro on line (30 o 45 gg secondo quanto indicato dalla
          singola Azienda Sanitaria)
        </li>
        <li>
          il referto non è stato inviato dall’Azienda Sanitaria al sistema centrale perchè non è stato registrato
          il Tuo consenso al servizio
        </li>
        <li>
          ci sono stati dei problemi tecnici
        </li>
      </ul>

      Scrivi al servizio di assistenza alla casella email
      <a href="mailto" class="lms-link">
        mail
      </a>
      per verificare il tuo caso.
      Indica il tuo codice fiscale, il tuo recapito telefonico e il problema rilevato. Verrai ricontattato.
    `
  },
  {
    title: `Quali referti posso ritirare on line?`,
    text: `
      Con il servizio Referti on line puoi ritirare i tuoi referti di laboratorio, i referti e le immagini di
      radiologia per le Aziende Sanitarie che hanno attivato il servizio.
      Vedi al link
      <a
        href="url"
        target="_blank"
        class="lms-link"
      >
        url
      </a>
    `
  },
  {
    title: `Come posso scaricare le immagini?`,
    text: `
      Dopo aver aver selezionato il bottone Scarica, Il sistema ti farà
      scaricare un file <code>.zip</code> che dovrai salvare sul tuo pc selezionando <code>“Estrai in"</code>.
      Scegli la cartella con lo
      stesso nome del file <code>.zip</code> e fai doppio clic sul file <code>RWS.bat</code>.
    `
  },
  {
    title: `Quando posso ritirare on line il mio referto?`,
    text: `
      Il referto è disponibile al ritiro solo dopo aver effettuato il pagamento. Se effettui il pagamento on line
      contestualmente al ritiro, le tempistiche di registrazione del pagamento non sono immediate, potranno
      variare da pochi minuti a 24 ore.
    `
  },
  {
    title: `Cos'è il referto firmato digitalmente?`,
    text: `
      Il referto digitale reso disponibile nel formato “p7m” o "PDF" è un documento informatico originale
      sottoscritto con firma digitale dal medico competente ai sensi del Decreto Legislativo n. 82/2005 e s.m.i. -
      Codice dell'Amministrazione Digitale. <br>
      Il referto firmato digitalmente costituisce documento originale valido a tutti gli effetti di legge; la
      firma digitale ne garantisce l’identificabilità dell'autore, l’integrità e l'immodificabilità. Per
      visualizzare il referto firmato digitalmente e verificare la firma applicata, è sufficiente disporre di una
      versione aggiornata di Adobe Acrobat Reader o in alternativa è necessario installare sul proprio pc
      l’apposito software gratuito DiKe di Inforcert (Infocert è un Ente Certificatore per la firma digitale
      accreditato presso l’Agenzia dell’Italia Digitale della Presidenza del Consigli dei Ministri).
    `
  },
  {
    title: `Quali sono gli usi del referto firmato digitalmente e di quello non firmato?`,
    text: `
      <p>
        Il referto firmato digitalmente, per il quale è assicurato il valore legale dall’azienda sanitaria che ha
        prodotto il documento nel rispetto del CAD (Codice di Amministrazione Digitale), costituisce un documento
        originale valido a tutti gli effetti di legge; il documento garantisce l'identificabiliatà dell'autore,
        l'integrità e l'immodificabilità.
      </p>
      <p>
        Il documento non firmato digitalmente è una copia informatica che ha la stessa efficacia delle
        riproduzioni meccaniche ex art. 2712 cc, ed è utilizzabile esclusivamente a fini personali (detta copia
        non ha infatti il medesimo valore legale e probatorio del referto originale).
      </p>
      <p>
        Per visualizzare la copia del referto, è sufficiente disporre di una versione aggiornata di Adobe Acrobat
        Reader.
      </p>
    `
  },
  {
    title: `In quale momento il referto è disponibile al mio Fascicolo Sanitario Elettronico?`,
    text: `
      A seguito dell’attivazione del fascicolo sanitario elettronico, consenso all'alimentazione, il referto è
      reso disponibile immediatamente dopo il download per la consultazione.
    `
  },
  {
    title: `Come posso condividere i referti con il mio medico curante?`,
    text: `
      Il Tuo medico può consultare i Tuoi referti dal momento in cui fornisci il consenso alla consultazione nel
      tuo Fascicolo Sanitario Elettronico.
    `
  },
  {
    title: `Che cosa sono le "Preferenze notifiche"?`,
    text: `
      Nella pagina di preferenze notifiche puoi indicare, selezionando uno o più box, le modalità con cui
      preferisci avere le notifiche e gli aggiornamenti dal sistema (es. la scadenza del ritiro referto, un tuo
      delegato ha eseguito l'accesso al tuo referto ecc..). <br>
      Le notifiche, a seconda dei box selezionati, ti giungeranno via email e/o direttamente sul browser sul
      simbolo del campanello (notifica push).
    `
  },
  {
    title: `Cos'è la Notifica PUSH?`,
    text: `
      La notifica push è una tipologia di messaggistica istantanea con la quale il messaggio perviene al
      destinatario senza che questo debba effettuare un accesso al servizio.
    `
  },
  {
    title: `Dove posso vedere da chi sono stato delegato?`,
    text: `
      Dall'apposito menu posto in alto a destra, sotto il profilo utente (due faccine affiancate) vengono
      visualizzati i nomi di chi ti ha delegato
    `
  },
  {
    title: `Come posso inserire una delega?`,
    text: `
      Dall'apposito menu Gestisci deleghe, posto in alto a destra sotto il profilo utente (due faccine
      affiancate).
      <br>
      E' necessario selezionare il servizio di ritiro referti, inserire i dati identificativi obbligatori del
      delegato (cognome, nome, data di nascita, comune di nascita, codice fiscale, sesso), inserire la data inizio
      e la data fine della delega. Infine aggiornare.
      <br>
      E' possibile revocare una delega a terzi e/o rinunciare alle deleghe inserite per te attraverso le apposite
      funzioni.
    `
  },
  {
    title: `La modalità di pagamento on line consente la visualizzazione/scarico immediato del referto?`,
    text: `
      No, è necessario attendere i tempi tecnici di registrazione dei pagamenti e la relativa ricezione al sistema
      centrale.
    `
  },
  {
    title: `Ho ricevuto una mail che mi avvisa della disponibilità del referto ma non posso scaricarlo perché il ticket risulta non pagato sebbene io abbia provveduto al pagamento, cosa posso fare?`,
    text: `
      Generalmente questo avviene quando cerchi di scaricare il referto prima della data indicata dalla struttura
      sanitaria e il sistema centrale non ha ancora recepito tutti gli aggiornamenti necessari.
    `
  }
];

export default {
  name: "PageHelpFaq",
  components: { LmsFaqListItem },
  props: {},
  data() {
    return {
      faqList: FAQ_LIST
    };
  },
  computed: {},
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass"></style>
