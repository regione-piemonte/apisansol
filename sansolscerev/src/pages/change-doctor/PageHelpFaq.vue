<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding class="csi-page-changeDoctor-faq">
    <q-card class="q-mt-md">
      <q-list no-border="" separator="" class="no-padding">
        <q-collapsible sparse="" label="1.  A chi è rivolto il servizio on line?">
          <div>
           <p>
             È rivolto a tutti i cittadini domiciliati in Piemonte sia minorenni che maggiorenni, sia italiani
             che stranieri (comunitari oppure non comunitari). Il servizio permette di scegliere sia il
             Medico di Medicina Generale che il Pediatra di Libera Scelta.
           </p>
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="2.  Come accedo?">
          <div>
           <p>
             Per accedere al servizio devi essere in possesso di uno dei seguenti sistemi di autenticazione:
           </p>
            <ul>
              <li>
                credenziali <a href="url">SPID</a>
              </li>
              <li>
                credenziali <a href="url">credenziali "imputabili"</a> rilasciate
                sulla base di riconoscimento certo della tua identità
                da parte di un operatore di sportello delle Aziende Sanitarie (ospedali o uffici ASL)
              </li>
              <li>
                smart card o Business Key emesse da un certificatore accreditato da <a href="url">AgID</a>.
              </li>
            </ul>
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="3.  Quando posso utilizzare il servizio?">
          <div>
           <p>
             È possibile utilizzare il servizio in ogni momento dell'anno 24 ore su 24, salvo
             un'interruzione dalle ore 23,00 del giorno 15 alle 02,00 del giorno 16 di ogni mese, per
             attività di manutenzione ed operazioni di sistema a scopo contabile.
             <br>
              Se viene fatta la scelta di un medico attraverso il sistema on line, è necessario attendere
              almeno un giorno per poter fare un'altra scelta per lo stesso assistito.
            </p>
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="4.  Quali medici o pediatri posso scegliere?">
          <div>
           <p>
             La scelta del medico o pediatra è possibile all'interno di tutto il territorio piemontese.
             L'applicativo permette di effettuare la scelta in base ai dati dichiarati, agli indirizzi di residenza, di domicilio, e al medico scelto.
           </p>
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="5.  Dopo quanto tempo la scelta del mio medico viene registrata dal sistema?">
          <div>
           <p>
             Il tempo è variabile in base alle condizioni per cui si effettua la scelta, in particolare:
           </p>
            <ul>
              <li>
                alcune scelte vengono registrate in tempo reale;
              </li>
              <li>
                alcune scelte necessitano di verifiche da parte di un operatore, che tramite il sistema,
                darà un riscontro all'assistito in base ai canali impostati (email, push, portale "Salute
                Piemonte"). Un esempio di richieste di questo tipo è la scelta di un medico per
                assistenze temporanee dovute a motivi di studio, a motivi di lavoro o per
                ricongiungimenti familiari. Appartengono a questa categoria anche richieste di
                assistenze temporanee, per assistiti stranieri o deroghe (per associazione, per ambito
                territoriale, per fascia di età);
              </li>
              <li>
                per altre scelte il sistema indica di contattare la ASL di riferimento;
              </li>
            </ul>
            <span>Inoltre:</span>
            <ul>
              <li>
                per sapere cosa si intende per "<u>assistenza temporanea</u>" e "<u>assistenza illimitata</u>"
                consulta la FAQ numero 18;
              </li>
              <li>
                per sapere cosa si intende per "<u>deroga di ambito territoriale</u>" consulta la FAQ numero
                19;
              </li>
              <li>
                per sapere cosa si intende per "<u>deroga per fascia d'età</u>" consulta la FAQ numero 21;
              </li>
              <li>
                per sapere cosa si intende per "<u>deroga per associazione</u>" consulta la FAQ numero 22;
              </li>
              <li>
                per sapere cosa si intende per "<u>ricongiungimento familiare</u>" consulta la FAQ numero
                23;
              </li>
              <li>
                per sapere cosa si intende per "<u>residenza</u>" consulta la FAQ numero
                24;
              </li>
              <li>
                per sapere cosa si intende per "<u>domicilio</u>" consulta la FAQ numero
                25.
              </li>
            </ul>
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="6.	In quali casi devo contattare la ASL di riferimento?">
          <div>
            <p>
              Il sistema fornisce uno specifico messaggio nei casi per i quali è necessario contattare la ASL
              di riferimento. Di seguito l'elenco con le principali situazioni:
            </p>
            <ul>
              <li>
                il motivo del tuo domicilio in Piemonte non è tra quelli proposti nell'elenco (lavoro,
                studio, ricongiungimento familiare);
              </li>
              <li>
                il motivo del tuo soggiorno in Italia (nei casi di assistiti stranieri comunitari e non
                comunitari) non è tra quelli proposti nell'elenco secondo la normativa relativa
                all'iscrizione obbligatoria (Deliberazione della Giunta Regionale 2 luglio 2012, n. 24-
                408);
              </li>
              <li>
                gli indirizzi di residenza e di domicilio non sono compatibili con la ASL di iscrizione del
                medico scelto (ad esempio residenza a Cuneo, domicilio a Torino e richiesta di un
                medico a Novara);
              </li>
              <li>
                viene indicato un indirizzo di domicilio al di fuori del territorio piemontese;
              </li>
            </ul>
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="7.  Posso scegliere il pediatra di libera scelta?">
          <div>
            <p>
              Sì, è possibile scegliere il Pediatra di Libera Scelta per i tuoi figli, per farlo occorre che entrambi
              i genitori abbiano provveduto alla compilazione della dichiarazione congiunta di responsabilità
              genitoriale collegandosi al seguente link: <br>
              <a href="url">url</a>
            </p>
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="8.	Posso scegliere un pediatra anche per un ragazzo?">
          <div>
            <p>
              È possibile richiedere l'assistenza di un pediatra per un minore fino al compimento dei 16
              anni. Se il pediatra ha disponibilità di assistenza la richiesta viene accettata. Nel momento in
              cui il minore compie 16 anni è obbligatoria la selezione di un Medico di Medicina Generale.
            </p>
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="9.	Posso compilare la domanda come delegato di una altra persona maggiorenne?">
          <div>
            <p>
              Sì, è necessario essere stati delegati da un delegante mediante il servizio "Gestione deleghe"
              puoi vedere tutte le informazioni necessarie a questo indirizzo: <br>
              <a href="url">url</a>
              <br>
              Nel momento in cui si è in possesso di una delega è possibile, dopo l'autenticazione a "Il mio
              medico", scegliere se compilare una richiesta per se stessi o per il delegante che compare
              nell'elenco specifico. <br>
              Nella richiesta è necessario allegare la specifica documentazione ossia il modulo di delega
              firmato e la carta di identità del delegante ossia dall'intestatario della richiesta.
            </p>
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="10.	Vorrei scegliere un medico che non fa parte del mio ambito territoriale, come devo comportarmi?">
          <div>
            <p>
              I cittadini che hanno bisogno di scegliere un medico che non fa parte del loro ambito di
              appartenenza possono compilare tutti i dati richiesti dall'applicativo e allegare la
              documentazione specificata. La richiesta verrà esaminata da un operatore di sportello che
              valuterà i dati inseriti e gli allegati inviati e fornirà un esito di:
            </p>
            <ul>
              <li>
                accettazione richiesta;
              </li>
              <li>
                <i>oppure di</i> non accettazione richiesta;
              </li>
              <li>
                <i>oppure di</i> revisione della richiesta per integrazioni o rettifiche della documentazione
                inviata per essere nuovamente presa in carico.
              </li>
            </ul>
            <p>
              Per gli assistiti che fanno riferimento alla ASL di Torino non ci sono limitazioni di ambito
              all’interno del territorio della città. <br>
              Per sapere cosa si intende per <u>ambito territoriale</u> consulta la <u>FAQ numero 19</u>.
            </p>
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="11.	Sono domiciliato temporaneamente in una città diversa da quella della mia residenza, posso richidere un medico?">
          <div>
            <p>
              È possibile richiedere l'assistenza temporanea nel territorio piemontese nei casi di
              spostamento del domicilio in una città diversa da quella di residenza. È sufficiente compilare
              le informazioni supplementari richieste: il motivo di lavoro o di studio o di ricongiungimento
              familiare in Piemonte.<br>
              In particolare nel caso di domicilio temporaneo per ricongiungimento familiare si ricorda che l'iscrizione
              è possibile solo nei casi di:
            </p>
            <ul>
             <li>
               ricongiungimento del nucleo familiare con un familiare lavoratore già domiciliato e non residente;
             </li>
              <li>
                familiare che necessita di assistenza sanitaria;
              </li>
            </ul>
            <p>
              La richiesta verrà esaminata da un operatore di sportello che valuterà i dati inseriti nelle
              'Informazioni supplementari' e fornirà un esito di:
            </p>
            <ul>
              <li>
                accettazione richiesta;
              </li>
              <li>
                <i>oppure di</i> non accettazione richiesta.
              </li>
            </ul>
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="12.	Sono un cittadino italiano che proviene da un'altra regione italiana, posso richiedere un medico?">
          <div>
            <p>
              È possibile richiedere l'assistenza per tutti i cittadini provenienti dalle regioni italiane sia per
              periodi brevi sia per il periodo illimitato. È sufficiente compilare le informazioni
              supplementari richieste, indicare se il medico precedente (extra regione) è stato revocato e
              allegare la documentazione indicata. La richiesta verrà esaminata da un operatore di
              sportello che valuterà i dati inseriti e gli allegati inviati e fornirà un esito di:
            </p>
            <ul>
              <li>
                accettazione richiesta;
              </li>
              <li>
                <i>oppure di</i> non accettazione richiesta;
              </li>
              <li>
                <i>oppure di</i> revisione della richiesta per integrazioni o rettifiche della documentazione
                inviata per essere nuovamente presa in carico.
              </li>
            </ul>
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="13.	Sono un cittadino straniero domiciliato in Piemonte, posso richiedere un medico?">
          <div>
            <p>
              È possibile richiedere l'assistenza per tutti i cittadini comunitari e non comunitari. È
              sufficiente compilare le informazioni supplementari richieste (il motivo di soggiorno in Italia
              e il motivo di domicilio in Piemonte) e allegare la documentazione indicata. La richiesta verrà
              esaminata da un operatore di sportello che valuterà i dati inseriti e gli allegati inviati e fornirà
              un esito di:
            </p>
            <ul>
              <li>
                accettazione richiesta;
              </li>
              <li>
                <i>oppure di</i> non accettazione richiesta;
              </li>
              <li>
                <i>oppure di</i> revisione della richiesta per integrazioni o rettifiche della documentazione
                inviata per essere nuovamente presa in carico.
              </li>
            </ul>
            <p>
              Il sistema gestisce esclusivamente i casi per i quali è richiesta l'iscrizione obbligatoria
              secondo quanto indicato nella Deliberazione della Giunta Regionale 2 luglio 2012, n. 24- 4081 –
              "Indicazioni per la corretta applicazione della normativa per l'assistenza sanitaria
              alla popolazione straniera da parte delle Regioni e Province Autonome italiane -
              Recepimento Regione Piemonte" <br>
              <a href="www.regione.piemonte.it/governo/bollettino/abbonati/2012/30/attach/dgr_04081_830_0
              2072012.pdf">www.regione.piemonte.it/governo/bollettino/abbonati/2012/30/attach/dgr_04081_830_0
                2072012.pdf</a> <br>
              e indica quale è la documentazione necessaria da allegare per ogni specifico caso. <br>
              Qualora il motivo di soggiorno in Italia non compaia tra quelli proposti è necessario
              contattare la ASL di riferimento.
            </p>
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="14.	C'è un errore nei miei dati anagrafici, come posso correggerlo?">
          <div>
              <p>È possibile modificare i dati di residenza, di domicilio e il recapito telefonico contestualmente
                all'operazione di scelta o cambio del medico. Per il solo aggiornamento di questi dati occorre contattare
                la ASL di riferimento.
                <br>
                Non è mai possibile modificare la propria data di nascita, il nome, il cognome, il codice fiscale e la
                cittadinanza. Qualora questi dati debbano essere variati occorre contattare la ASL di riferimento.
              </p>
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="15.	In quale caso serve effettuare la sola revoca del medico?">
          <div>
            <p>
              Può essere utile nel caso in cui il paziente debba trasferirsi temporaneamente fuori regione
              o all'estero. Per effettuare la richiesta di iscrizione presso un'altra ASL fuori dalla regione
              Piemonte occorre aver revocato il proprio medico.
            </p>
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="16.	Posso rinnovare l'assistenza temporanea?">
          <div>
            <p>Attraverso la procedura "Il mio medico", è possibile effettuare il cambio del medico all'interno del
              periodo di assistenza temporanea. Non è possibile invece effettuare il rinnovo dell'assistenza temporanea,
              per il quale occorre  rivolgersi alla ASL per conoscere le modalità di espletamento della pratica.</p>
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="17.	Posso scegliere un medico che fa parte della stessa associazione del mio medico attuale?">
          <div>
            <p>
              È possibile richiedere l'assistenza di un medico che fa parte della stessa associazione del
              medico che si vuole revocare. È sufficiente compilare le informazioni richieste e allegare il
              consenso del medico come indicato da procedura. La richiesta verrà esaminata da un
              operatore di sportello che valuterà i dati inseriti e l'allegato inviato e fornirà un esito di:
            </p>
            <ul>
              <li>
                accettazione richiesta;
              </li>
              <li>
                <i>oppure di</i> non accettazione richiesta;
              </li>
              <li>
                <i>oppure di</i> revisione della richiesta per integrazioni o rettifiche della documentazione
                inviata per essere nuovamente presa in carico.
              </li>
            </ul>
            <p>
              Per sapere cosa si intende per "<u>deroga per associazione</u>" consulta la FAQ numero 22;
            </p>
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="18.	Cosa si intende per 'assistenza temporanea' e 'assistenza illimitata'?">
          <div>
            <ul>
              <li>
                <u><i>Assistenza temporanea</i></u>: ne beneficiano i cittadini che per differenti motivi si trovano
                a vivere in una località diversa dalla propria residenza. In tali casi i soggetti hanno
                diritto a scegliere un Medico di Medicina Generale o un Pediatra di Libera Scelta nel
                luogo in cui si spostano momentaneamente.
                È necessario che il trasferimento sia stato dovuto a ragioni di: lavoro, studio o per
                ricongiungimento familiare.
                I soggetti che possono richiedere un’assistenza sanitaria temporanea sono:
                <ul>
                  <li>
                    i lavoratori fuori sede;
                  </li>
                  <li>
                    gli studenti, i seminaristi, i convittori e similari assenti dalle loro famiglie per
                    motivi di studio;
                  </li>
                  <li>
                    le persone costrette al trasferimento provvisorio per motivi di salute.
                  </li>
                </ul>
                Rientrano in questa categoria coloro che devono sottoporsi a determinate cure
                mediche presso centri specializzati o ospedali lontani da casa nonché coloro che
                soggiornano in date località climatiche per comprovati motivi medici. <br>
                La permanenza nel nuovo domicilio deve essere compresa in un periodo di tempo
                che va dai 3 mesi ad 1 anno;
              </li>
              <li>
                <u><i>Assistenza illimitata (o permanente)</i></u>: ne beneficiano i cittadini che indicano di avere
                residenza, domicilio e il medico scelto all'interno della stessa ASL. Il Medico di
                Medicina Generale o il Pediatra di Libera Scelta selezionato ha validità fino a quando
                non viene revocato dal cittadino o quando lo stesso medico non esercita più la sua
                professione.
              </li>
            </ul>
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="19.	Cosa si intende per ambito territoriale?">
          <div>
              <p>
                La ASL si può comporre di X distretti i quali a loro volta si possono comporre di Y ambiti
                territoriali. Di seguito le definizioni:
              </p>
             <ul>
               <li>
                 <u><i>Distretto</i></u>: è la struttura dell' unità sanitaria locale che in modo coordinato e
                 integrato svolge le attività ed eroga le prestazioni di primo livello e di pronto
                 intervento;
               </li>
               <li>
                 <u><i>Ambito</i></u>: è l'aggregazione di comuni che fanno riferimento al distretto.
               </li>
             </ul>
            <p>
              Ad esempio per l'ASL Novara sono presenti i distretti denominati "distretto nord", "distretto
              sud", "distretto urbano Novara" i quali al loro interno hanno degli ambiti. <br>
              Ad esempio il "distretto nord" per l’ASL Novara, contiene 6 ambiti diversi di riferimento per
              i Medici di Medicina Generale, e 6 ambiti diversi di riferimento per i Pediatri di Libera Scelta.
            </p>
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="20.	Cosa si intende per deroga in ambito territoriale?">
          <div>
            <p>
              Succede quando l'ambito territoriale del medico o del pediatra scelto è diverso dall'ambito
              territoriale del domicilio dell'assistito. In questo caso è necessario allegare alla richiesta, che
              verrà valutata da uno operatore di sportello, un documento attestante il "Consenso del
              medico" e verrà successivamente fornito un riscontro. <br>
              Il controllo non viene applicato solamente per la ASL di Città di Torino.
            </p>
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="21.	Cosa si intende per deroga in fascia d'età?">
          <div>
              <p>
                Succede quando per un assistito minorenne che ha un'età compresa tra i 14 e i 16 anni viene
                scelto un Pediatra di Libera Scelta. In questo caso è necessario allegare alla richiesta, che
                verrà valutata da uno operatore, un documento attestante il "Consenso del medico" e verrà
                successivamente fornito un riscontro. <br>
                Al compimento dei 16 anni è obbligatorio scegliere un Medico di Medicina Generale.
              </p>
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="22.	Cosa si intende per deroga per associazione?">
          <div>
            <p>
              Succede quando un assistito sceglie un Medico di Medicina Generale o un Pediatra di Libera
              Scelta che appartiene alla stessa associazione del medico precedente. In questo caso è necessario allegare
              alla richiesta, che verrà valutata da uno operatore di sportello, un documento attestante il
              "Consenso del medico" e verrà successivamente fornito un riscontro.
            </p>
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="23.	Cosa significa che un medico è disponibile solo per ricongiungimento familiare?">
          <div>
            <p>
              Significa che il Medico di Medicina Generale o il Pediatra di Libera Scelta può accettare esclusivamente
              familiari dei propri assistiti che fanno parte dello stesso nucleo familiare e presenti nello stato di famiglia.<br>
              In questo caso viene richiesta la compilazione dei dati del familiare già in cura presso il medico scelto e il grado di parentela.<br>
              La richiesta verrà esaminata da un operatore di sportello che valuterà i dati inseriti nelle 'Informazioni supplementari' e  fornirà un esito di:
            </p>
            <ul>
              <li>
                accettazione richiesta;
              </li>
              <li>
                <i>oppure di</i> non accettazione richiesta.
              </li>
            </ul>
          </div>
        </q-collapsible>

        <q-collapsible
          sparse=""
          label="24.	Cosa si intende per residenza?">
          <div>
            <p>
              La residenza è definita giuridicamente come il luogo in cui la persona ha la dimora abituale.
              La residenza risulta dai registri anagrafici ed è quindi conoscibile in modo preciso e verificabile in ogni momento.
              (Fonte: <a href="url">url</a>)
            </p>
          </div>
        </q-collapsible>
        <q-collapsible
          sparse=""
          label="25.	Cosa si intende per domicilio?">
          <div>
            <p>
              Il domicilio è definito giuridicamente come il luogo in cui una persona ha stabilito la sede principale
              dei suoi affari e interessi. Il domicilio può essere diverso dalla propria residenza.
              (Fonte: <a href="url">url</a>)
            </p>
          </div>
        </q-collapsible>
        <q-collapsible
          sparse=""
          label="26.	Il medico che ho scelto in questo momento non ha la disponibilità e vorrei sapere quando si libera un posto, cosa posso fare?">
          <div>
            <p>
              Selezionando il pulsante "Monitora" nella scheda del medico viene attivato un meccanismo automatico
              che ti informa in base ai canali impostati (email, push, portale "Salute Piemonte") quando si libera un posto:
              per questo è necessario che un altro cittadino effettui la revoca di tale medico.<br>
              Può succedere che un medico risulti sempre occupato per molto tempo, a questo proposito ti indichiamo
              che è possibile monitorare più medici contemporaneamente: in questo modo hai più scelte a disposizione
              per selezionare il medico più adatto alla tua situazione.
            </p>
          </div>
        </q-collapsible>
        <q-collapsible
          sparse=""
          label="27.	Ho effettuato l'operazione 'Revoca medico' posso stampare il modulo che attesta che al momento non ho l'assistenza?">
          <div>
            <p>
              L'operazione eseguita aggiorna in tempo reale i dati pertanto, quando si verifica la propria situazione,
              compare un messaggio che indica che non è presente l'assistenza  da parte di un Medico di Medicina Generale
              (o di un Pediatra di Libera Scelta) nel territorio piemontese.
              Al momento non è possibile visualizzare o stampare un modulo che attesta l'avvenuta revoca, per eventuali
              informazioni si consiglia di rivolgersi alla ASL di riferimento.
            </p>
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
