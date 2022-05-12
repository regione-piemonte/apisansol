<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding class="csi-page-online-reports-faq">
    <q-card class="q-mt-md">
      <q-list no-border separator class="no-padding">
        <q-collapsible
          sparse
          label="1. Quali ricette posso visualizzare?">
          <div>
            Puoi visualizzare e stampare il promemoria delle ricette dematerializzate per visite specialistiche, esami
            e farmaci prescritte dai medici del Servizio Sanitario Nazionale, a nome tuo o per conto di terzi attraverso
            l’abilitazione del servizio di delega.
            Le ricette dematerializzate per visite specialistiche ed esami sono visibili in tempo reale, ovvero
            all’atto della prescrizione da parte del medico.
            Le ricette farmaceutiche dematerializzate sono visibili dal giorno successivo alla prescrizione da parte
            del medico.

            Le ricette dematerializzate
            già utilizzate o scadute non sono consultabili nel servizio “Ricette dematerializzate”, ma possono
            essere consultate attraverso la sezione “I documenti del fascicolo” del servizio “Fascicolo Sanitario
            Elettronico”.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="2. Posso vedere le ricette dei miei figli minorenni?">
          <div>
            <p>Si, per farlo devi aver dichiarato la responsabilità genitoriale mediante il servizio “Deleghe”.</p>

            <p>
              Successivamente, all'interno del servizio ‘Ricette dematerializzate’ dopo aver selezionato il nominativo
              del figlio/delegante (cliccando in alto a destra-due faccine affiancate) ti verrà chiesto di attivare il
              Fascicolo Sanitario Elettronico di tuo figlio.
            </p>

            <p>
              Ti verrà chiesto l'inserimento del suo numero della tessera sanitaria.
            </p>
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="3. Qual è la scadenza delle ricette?">
          <div>
            1 mese per le ricette farmaceutiche, 6 mesi per le ricette di esami o visite specialistiche.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="4. Cosa vuol dire stato “prenotato”?">
          <div>
            Le ricette di esami o visite specialistiche riportano lo stato “prenotato” quando è stata effettuata una
            prenotazione presso il CUP delle aziende sanitarie pubbliche o private convenzionate, con il Servizio
            Sanitario Nazionale, della Regione Piemonte. Lo stato “prenotato” è visibile solo se le ricette sono state
            prescritte in Regione Piemonte.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="5. Cosa vuol dire stato “prescritto”?">
          <div>
            Le ricette prescritte da un medico della Regione Piemonte sono in stato “prescritto” quando sono state
            emesse dal medico e non sono ancora state utilizzate o non sono state prenotate.
            Le ricette prescritte da un medico di altra regione sono in stato “prescritto” quando sono state emesse
            dal medico e non sono ancora state utilizzate.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="6. Cosa vedo nel dettaglio?">
          <div>
            Nel dettaglio sono visualizzate le informazioni principali della ricetta, quali: elenco delle
            prestazioni/farmaci, la priorità, il tipo accesso, la quantità, il medico prescrittore, l’esenzione, il
            quesito diagnostico.
            Il dettaglio è visibile solo se le ricette sono state prescritte da un medico della Regione Piemonte.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="7. Cosa significa “nascondi”?">
          <div>
            Puoi nascondere temporaneamente le ricette che per te sono meno prioritarie. In qualsiasi momento puoi
            ripristinare l’elenco completo.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="8. Cosa vedo se clicco su “Nascoste”?">
          <div>
            Vedi le ricette per te meno prioritarie e che hai nascosto.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="9. Come faccio a ripristinare l’elenco completo?">
          <div>
            Accedi alla lista delle ricette nascoste e seleziona “ripristina” su quella che desideri riportare
            in evidenza.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="10. Perchè visualizzo una ricetta che ho già utilizzato presso una struttura?">
          <div>
            Perché, potrebbero rilevarsi dei ritardi di rendicontazione delle attività da parte della struttura
            o della farmacia; puoi sempre nasconderla utilizzando l’apposita funzione “Nascondi”.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="11. Come visualizzo le ricette prescritte dai medici della Regione Piemonte?">
          <div>
            Selezioni “in Piemonte” nell’apposito filtro “Prescritto”.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="12. Come visualizzo le ricette prescritte dai medici di altre regioni?">
          <div>
            Selezioni “fuori Piemonte” nell’apposito filtro “Prescritto”.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="13. La visualizzazione delle ricette avviene in tempo reale?">
          <div>
            <ul>
              <li>
                Le ricette specialistiche prodotte in Piemonte vengono visualizzate in tempo reale
              </li>
              <li>
                Per tutte le ricette farmaceutiche e per le ricette specialistiche prodotte fuori Piemonte occorre
                attendere, dalla prescrizione del medico, almeno 24 ore (per i necessari tempi tecnici di allineamento
                tra Ministero e Regione Piemonte)
              </li>
            </ul>
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="14. Cosa vedo nel “tab” bar code?">
          <div>
            Vedi il codice a barre del numero della ricetta dematerializzata e del codice fiscale della persona a cui è
            intestata la ricetta. Quando non sarà più obbligatorio presentare la stampa del promemoria per ottenere le
            prestazioni e/o i farmaci prescritti, sarà sufficiente mostrare i codici a barre.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="15. Come stampo il promemoria?">
          <div>
            Cliccando sul pulsante “stampa” viene scaricato il promemoria nel formato pdf, che dovrà essere stampato per
            il suo utilizzo.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="16. Dove posso vedere da chi sono stato delegato?">
          <div>
            Dall'apposito menu posto in alto a destra, sotto il profilo utente (due faccine affiancate) sono
            visualizzati
            i nomi di chi ti ha delegato.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="17. Come posso vedere le ricette di chi mi ha delegato?">
          <div>
            Dall'apposito menu, posto in alto a destra sotto il profilo utente (due faccine affiancate), selezioni
            la persona che ti ha delegato. Potrai vedere le ricette della persona che ti ha delegato solo se questa
            ha aperto il Fascicolo Sanitario Elettronico.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="18. Come posso inserire una delega per il servizio “Ricette dematerializzate”?">
          <div>
            Dall'apposito menu “Gestisci deleghe”, posto in alto a destra sotto il profilo utente (due faccine
            affiancate), accedi al servizio “Gestione deleghe”. Se la persona che vuoi delegare è già presente tra
            i tuoi delegati, è sufficiente abilitarla al servizio “Ricette dematerializzate”. Se la persona che vuoi
            delegare al servizio non è presente tra i tuoi delegati, devi procedere all’inserimento di una nuova delega
            indicando i suoi dati identificativi obbligatori (cognome, nome, data di nascita, comune di nascita, codice
            fiscale, sesso) e procedere alla sua abilitazione al servizio “Ricette dematerializzate”.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="19. Come posso revocare una delega per il servizio “Ricette dematerializzate”?">
          <div>
            Dall'apposito menu “Gestisci deleghe”, posto in alto a destra sotto il profilo utente (due faccine
            affiancate),
            accedi al servizio “Gestione deleghe”, selezioni tra i tuoi delegati la persona che vuoi revocare e procedi
            con la revoca per il servizio “Ricette dematerializzate”.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="20. Come posso rinunciare ad una delega ricevuta per il servizio “Ricette dematerializzate”?">
          <div>
            Dall'apposito menu “Gestisci deleghe”, posto in alto a destra sotto il profilo utente (due faccine
            affiancate),
            accedi al servizio “Gestione deleghe”, selezioni dall’elenco delle persone che ti hanno delegato, la persona
            per cui vuoi rinunciare alla delega per il servizio “Ricette dematerializzate” e selezioni l’apposita
            funzione di “Rinuncia”.
          </div>
        </q-collapsible>

        <q-collapsible
          sparse
          label="21. Come posso oscurare le mie ricette dematerializzate alla consultazione da parte degli operatori sanitari nel FSE?">
          <div>
            Per attivare la funzione di oscuramento alla consultazione dei dati e documenti (ad esempio le ricette
            dematerializzate)
            da parte degli operatori sanitari attraverso la piattaforma del FSE, puoi accedere al servizio "Fascicolo
            Sanitario Elettronico" e procedere mediante l'apposita funzione.
          </div>
        </q-collapsible>

      </q-list>
    </q-card>
  </q-page>
</template>


<script>

  export default {
    name: 'PageHelpFaq',
    data() {
      return {
        selectedTab: 'FAQ'
      }
    },
  }
</script>

<style lang="stylus">
  @require '~variables'

  .csi-page-online-reports-faq
    .csi-text-underline
      text-decoration underline

    .q-collapsible-sub-item
      background-color $grey-1

</style>
