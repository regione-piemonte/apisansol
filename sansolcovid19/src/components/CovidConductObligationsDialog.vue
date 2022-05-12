<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    :maximized="$q.screen.lt.sm"
    :value="value"
    @input="$emit('input', $event)">
    <q-card id="covid-conduct-obligations-container" style="max-width: 800px">
      <q-toolbar color="transparent" text-color="black">
        <q-toolbar-title  class="q-px-none">{{ conductObligationsTitle | startCase }}</q-toolbar-title>
        <q-btn
          flat
          round
          color="primary"
          icon="print"
          :isLoading="isPrinting"
          class="covid-print-btn q-mx-sm"
          no-min-width
          @click="printInfo"

        > <q-tooltip>
          Stampa
        </q-tooltip>
        </q-btn>
        <q-btn v-close-popup aria-label="chiudi" dense flat icon="close" round><q-tooltip>
          Chiudi
        </q-tooltip></q-btn>
      </q-toolbar>


      <template v-if="isIsolation">
        <q-card-section>
          <p>
            Di seguito sono riportate le <strong>misure da rispettare da parte di coloro che sono risultati
            positivi</strong>
            a un tampone molecolare o antigenici, <strong>per ridurre il rischio di contagiare</strong> altre persone.
            Si ricorda che <strong>l’osservanza dell’isolamento è un obbligo di legge</strong>, indipendentemente dai
            provvedimenti di
            imposizione dell’autorità sanitaria.
          </p>

          <q-list class="q-mb-md">

            <q-expansion-item
              class="covid-conduct-obligation-expansion-item"
              expand-separator
              header-class="text-primary text-bold"
              label="Isolamento di 10 giorni"
            >
              <q-card>
                <q-card-section>
                  <p>I soggetti risultati positivi che si trovano in una delle seguenti condizioni:</p>
                  <ul>
                    <li>non sono vaccinati</li>
                    <li>non hanno ancora ricevuto la seconda dose</li>
                    <li>hanno concluso da più di 120 giorni il ciclo primario (con monodose/doppia dose)</li>
                    <li>sono guariti da più di 120 giorni</li>
                  </ul>
                  <p><strong>hanno l’obbligo di restare in isolamento per almeno 10 giorni.</strong></p>
                  <p>
                    <strong>Il periodo di isolamento può essere interrotto con il risultato negativo di
                      tampone</strong>, molecolare o antigenico effettuabile presso strutture pubbliche o private, a
                    distanza di <strong>10 giorni</strong> dall’inizio dei sintomi, a patto di risultare asintomatici da
                    almeno 3
                    giorni (sono esclusi dai sintomi la perdita di olfatto e gusto che possono persistere più a
                    lungo) o dal primo tampone positivo.
                    Se il tampone risultasse nuovamente positivo, sarà possibile sottoporsi a nuovo tampone a carico
                    del SSR dopo ulteriori 7 giorni.
                  </p>
                </q-card-section>
              </q-card>
            </q-expansion-item>
            <q-expansion-item
              class="covid-conduct-obligation-expansion-item"
              expand-separator
              header-class="text-primary text-bold"
              label="Isolamento di 7 giorni"
            >
              <q-card>
                <q-card-section>
                  <p>I soggetti risultati positivi che si trovano in una delle seguenti condizioni:</p>
                  <ul>
                    <li>hanno ricevuto la dose booster</li>
                    <li>hanno completato il ciclo vaccinale primario da meno di 120 giorni</li>
                    <li>sono guariti da meno di 120 giorni</li>
                  </ul>
                  <p><strong>hanno l’obbligo di restare in isolamento per 7 giorni.</strong></p>
                  <p>
                    <strong>Il periodo di isolamento può essere interrotto con il risultato negativo di
                      tampone</strong>, molecolare o antigenico effettuabile presso strutture pubbliche o private, a
                    distanza di <strong>7 giorni</strong> dall’inizio dei sintomi o dal primo tampone positivo, a patto
                    di risultare asintomatici da
                    almeno 3 giorni (sono esclusi dai sintomi la perdita di olfatto e gusto che possono persistere più a
                    lungo).
                    Se il tampone risultasse nuovamente positivo, sarà possibile sottoporsi a nuovo tampone a carico
                    del SSR dopo ulteriori 7 giorni.
                  </p>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <p class="q-mb-none">
            <strong>Il periodo di isolamento, se non precedentemente chiuso, decadrà automaticamente</strong> il 21°
            giorno per i coloro i quali si trovino in isolamento e siano asintomatici da almeno 7 giorni (sono esclusi
            dai sintomi la perdita di olfatto e gusto che possono persistere più a lungo).
          </p>

        </q-card-section>

      </template>

      <template v-if="isQuarantine">
        <q-card-section>
          <p>
            Di seguito sono riportate le <strong>misure da rispettare da parte di coloro che sono stati a stretto
            contatto con soggetti risultati positivi a un tampone (molecolare o antigenico), per ridurre il rischio di
            contagiare</strong> altre persone.
          </p>
          <p>
            L’osservanza della quarantena è un obbligo di legge, indipendentemente dai provvedimenti di imposizione
            dell’autorità sanitaria.
          </p>
          <p>Quali sono gli obblighi di comportamento:</p>

          <q-list class="q-mb-md">

            <q-expansion-item
              class="covid-conduct-obligation-expansion-item"
              expand-separator
              header-class="text-primary text-bold"
              label="Autosorveglianza"
            >
              <q-card>
                <q-card-section>
                  <p>I soggetti che hanno avuto un contatto ad alto rischio con un soggetto <strong>positivo ma sono
                    asintomatici</strong> e si trovano in una delle seguenti condizioni:</p>
                  <ul>
                    <li>hanno ricevuto la dose booster</li>
                    <li>hanno completato il ciclo vaccinale primario nei 120 giorni precedenti</li>
                    <li>sono guariti da infezione da SARS-CoV-2 nei 120 giorni precedenti</li>

                  </ul>
                  <p>possono essere sottoposti (in base alla valutazione dell’ASL, del medico di medicina generale o del
                    pediatra di libera scelta a un <strong>periodo di autosorveglianza della durata di 5 giorni, durante
                      il quale</strong> la persona in autosorveglianza ha l’obbligo di rispettare le seguenti
                    misure:
                  </p>
                  <ul>
                    <li>indossare dispositivi di protezione delle vie respiratorie di tipo FFP2 per almeno 10 giorni
                      dall’ultima esposizione al caso
                    </li>
                    <li>in caso di comparsa di sintomi, darne tempestiva comunicazione al proprio medico curante o
                      all’ASL per l’eventuale effettuazione di un test antigenico rapido o molecolare che, se ancora
                      sintomatici, è da ripetersi al quinto giorno successivo alla data dell’ultimo contatto stretto con
                      il soggetto confermato positivo al Covid 19.
                    </li>
                  </ul>
                </q-card-section>
              </q-card>
            </q-expansion-item>
            <q-expansion-item
              class="covid-conduct-obligation-expansion-item"
              expand-separator
              header-class="text-primary text-bold"
              label="Quarantena di 10 giorni"
            >
              <q-card>
                <q-card-section>
                  <p><strong>I soggetti non vaccinati o che non hanno completato il ciclo vaccinale primario</strong> o
                    che hanno
                    completato il ciclo vaccinale primario da meno di 14 giorni sono sottoposti a <strong>quarantena per
                      10
                      giorni</strong> dall’ultimo contatto con il caso: trascorso tale periodo, la quarantena può essere
                    interrotta
                    con risultato negativo di test molecolare o antigenico.</p>
                </q-card-section>
              </q-card>
            </q-expansion-item>
            <q-expansion-item
              class="covid-conduct-obligation-expansion-item"
              expand-separator
              header-class="text-primary text-bold"
              label="Quarantena di 5 giorni"
            >
              <q-card>
                <q-card-section>
                  <p>I soggetti che, avendo completato il ciclo vaccinale primario da più di 120 giorni, abbiano
                    tuttora in corso di validità il green pass, se risultano asintomatici sono sottoposti a quarantena
                    di <strong>5 giorni</strong>: trascorso tale periodo, la quarantena termina con il risultato
                    negativo di un tampone
                    molecolare o antigenico.</p>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>

          <p>
            <strong>Il periodo di quarantena, se non precedentemente chiuso, decadrà automaticamente</strong> il 14°
            giorno per coloro i
            quali si trovino in quarantena e siano sempre stati asintomatici.
          </p>
          <p class="q-mb-none">
            <strong>In caso di comparsa dei sintomi è obbligatoria</strong> la comunicazione al proprio medico curante o
            all’ASL per
            valutare la necessità di effettuare un test antigenico rapido o molecolare per la rilevazione dell’antigene
            Sars-Cov.
          </p>
        </q-card-section>
      </template>

      <q-card-section>
        <h3 class="text-h3 q-mt-none">Quali sono le sanzioni previste</h3>
        <p class="q-mb-none"><strong>Il mancato rispetto degli obblighi connessi al periodo di isolamento, quarantena
          precauzionale e
          autosorveglianza</strong>, , disciplinati rispettivamente dai commi 6, 7 e 7-bis dell’art. 1, Decreto Legge
          16 marzo 2020, n. 33, conv. con modificazioni dalla Legge 14 luglio 2020, n. 74, <strong>è punito con la
            sanzione
            amministrativa del pagamento di una somma da euro 400 a euro 1.000</strong>, ai sensi del combinato
          disposto dell’art
          4 del Decreto Legge 25 marzo 2020, n.19, conv. con modificazioni dalla Legge 22 maggio 2020, n. 35,
          dell’art. 2, comma 1, Decreto Legge 16 marzo 2020, n. 33, conv. con modificazioni dalla Legge 14 luglio
          2020, n. 74 e dell’art.4, comma 1, Decreto Legge 30 dicembre 2021, n. 229.</p>
      </q-card-section>
      <q-card-section>
        <h3 class="text-h3 q-mt-none">
          Le raccomandazioni igienico-sanitarie per le persone in isolamento domiciliare e per quelle in quarantena (ad
          esempio i familiari che li assistono)
        </h3>

        <ol>
          <li>La persona con sospetta o accertata infezione COVID-19 deve stare lontana dagli altri familiari, se
            possibile in una stanza singola ben ventilata avendo l’uso esclusivo di un bagno e non deve ricevere
            visite.
          </li>
          <li>Chi l’assiste deve essere in buona salute e non avere malattie che lo mettano a rischio se contagiato.
          </li>
          <li>I membri della famiglia devono soggiornare in altre stanze (aerate di frequente), qualora non sia
            possibile, gli stessi verranno posti in isolamento con il positivo fino a sua guarigione.
          </li>
          <li>Indossare la mascherina quando si esce dalla stanza e coprirsi la bocca quando si starnutisce o si
            tossisce con un fazzoletto monouso e lavarsi immediatamente le mani.
          </li>
          <li>
            Va sospesa la raccolta differenziata per evitare l’accumulo di materiali potenzialmente pericolosi che
            vanno invece eliminati nel bidone dell’indifferenziata.
          </li>
          <li>Il positivo deve mettere la biancheria utilizzata in un sacchetto dedicato alla biancheria sporca. Il
            familiare utilizzando i guanti, non deve agitare la biancheria sporca ed evitare il contatto diretto con
            pelle e indumenti. È necessario lavare vestiti, lenzuola, asciugamani, ecc. del malato in lavatrice a
            60-90°C usando un normale detersivo oppure a mano con un normale detersivo e acqua, e asciugarli
            accuratamente.
          </li>
          <li>Gli oggetti manipolati dal paziente, comprese le posate e le stoviglie devono essere lavate
            possibilmente in lavastoviglie, alla temperatura maggiore possibile, immediatamente dopo che siano uscite
            dalla camera del malato.
          </li>
          <li>Evitare di condividere con il malato i servizi igienici, laddove questo non sia possibile: separare gli
            spazzolini da denti, utilizzare asciugamani di carta usa e getta o asciugamani riservati che vanno
            sostituiti quando bagnati. Pulire e disinfettare ad ogni passaggio ai servizi del malato le superfici dei
            bagni con un normale disinfettante domestico, o con prodotti a base di cloro (candeggina) alla
            concentrazione di 0,5% di cloro attivo oppure con alcol 70%, indossando i guanti e indumenti protettivi
            (es. un grembiule di plastica).
          </li>
          <li>Se un membro della famiglia mostra i primi sintomi di infezione (febbre, tosse, mal di gola e difficoltà
            respiratorie) contattare il medico curante o la guardia medica.
          </li>
          <li>Evitare il trasporto pubblico per raggiungere la struttura sanitaria designata all’esecuzione dei
            tamponi. La persona malata dovrebbe indossare una mascherina FFP2/chirurgica per recarsi nella struttura
            sanitaria e mantenere la distanza di almeno 1 metro dalle altre persone.
          </li>
          <li>Qualsiasi superficie contaminata da secrezioni respiratorie o fluidi corporei durante il trasporto deve
            essere pulita e disinfettata usando un normale disinfettante domestico con prodotti a base di cloro
            (candeggina) alla concentrazione di 0,5% di cloro attivo oppure con alcol 70%.
          </li>
        </ol>

      </q-card-section>

      <div class="q-px-md q-mb-md row items-center">
        <q-btn
          flat
          color="primary"
          icon="print"
          :isLoading="isPrinting"
          class="covid-print-btn"
          no-min-width
          @click="printInfo"
          label="stampa"
        />

      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import {EVENT_TYPE_CODE_MAP} from "src/services/config";


export default {
  name: "CovidConductObligationsDialog",
  components: {},
  props: {
    value: {type: Boolean, required: false, default: false},
    eventCode: {type: [String, Number], required: true, default: null}
  },
  data() {
    return {
      isPrinting: false
    }
  },
  computed: {
    isIsolation() {
      let codes = [
        EVENT_TYPE_CODE_MAP.HOME_ISOLATION_DISPOSED,
        EVENT_TYPE_CODE_MAP.HOME_ASSIGNMENT_DISPOSED,
        EVENT_TYPE_CODE_MAP.ISOLATION_TO_BE_EXPLORED
      ]

      return codes.includes(this.eventCode)
    },
    isQuarantine() {
      let codes = [
        EVENT_TYPE_CODE_MAP.QUARANTINE_VACCINATION_NONE,
        EVENT_TYPE_CODE_MAP.QUARANTINE_VACCINATION_AFTER_120_DAYS,
        EVENT_TYPE_CODE_MAP.QUARANTINE_TO_BE_EXPLORED,
        EVENT_TYPE_CODE_MAP.ISOLATION
      ]

      return codes.includes(this.eventCode)
    },
    conductObligationsTitle(){
      let title = ''
      if(this.isIsolation)
        title = "isolamento"
      if(this.isQuarantine)
        title = "quarantena"

      return title
    }
  },
  methods: {
    openPrintDialog() {


    },
    printInfo() {
      this.isPrinting = true
      const prtHtml = document.getElementById('covid-conduct-obligations-container').innerHTML;
      let fileName = this
      let stylesHtml = "";
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"], style')
      ]) {
        stylesHtml += node.outerHTML;
      }
      // Open the print window
      const WinPrint = window.open(
        "",
        "_blank"
      );
      WinPrint.document.write(`<!DOCTYPE html>
                  <html>
                    <head>
                      ${stylesHtml}
                    </head>
                    <title>${this.conductObligationsTitle}-istruzioni-e-linee-guida</title>
                    <body class="print-page">
                      ${prtHtml}
                    </body>
                  </html>`);
      setTimeout(()=>{
        WinPrint.focus();
        WinPrint.print();
      }, 100)
      // WinPrint.focus();
      // WinPrint.print();

      this.isPrinting = false
    }
  }
}
</script>

<style lang="sass">
.covid-conduct-obligation-expansion-item
  .q-expansion-item__toggle-icon
    color: $primary

.print-page
  .covid-conduct-obligation-expansion-item
    .q-expansion-item__content
      display: block !important

  .covid-print-btn
    display: none !important
</style>
