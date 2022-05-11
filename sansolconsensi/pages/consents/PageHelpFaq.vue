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
            Il servizio “Gestione Consensi” è rivolto a tutti gli assistiti della Regione Piemonte che intendano
            esprimere il proprio consenso a specifici servizi di sanità digitale nel rispetto del regolamento n.
            2016/679 (RGPD), come ad esempio il consenso permanente al ritiro referti on line.
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="2.  In che modo il cittadino può esprimere il consenso?">
          <div>
            Utilizzando le funzioni disponibili all’interno del servizio “Gestione Consensi” che permettono di scegliere
            quali consensi intendi concedere in ambito sanitario.
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="3.  Quali consensi sono disponibili?">
          <div>
            Al momento il consenso può essere espresso per il ritiro referti on line:
            <ul>
              <li>
                Consenso permanente al ROL

              </li>
            </ul>
            Il consenso permanente consente all’assistito di esprimere il ritiro dei referti on line presso ciascuna
            Azienda sanitaria che aderisce al servizio. Dalla data di attivazione del consenso gli esami di Laboratori
            analisi e/o di radiologia sono trasmessi al servizio di Ritiro referti on line.
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="4.  Il consenso è subito valido?">
          <div>
            Il sistema registra la volontà del cittadino e trasmette l’informazione alla/e azienda/e interessate le
            quali recepiscono tale scelta. È possibile verificare in qualsiasi momento sul sistema, lo stato di validità
            del consenso.
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="5.  Posso revocare il consenso espresso?">
          <div>
            Si, è possibile revocare in qualsiasi momento il consenso espresso.
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="6.  In che modo posso modificare il consenso espresso?">
          <div>
            Il consenso può essere modificato all’interno del servizio “Gestione Consensi” rimuovendo la spunta inserita
            in corrispondenza delle aziende sanitarie.
          </div>
        </q-collapsible>

        <q-collapsible sparse=""
                       label="7.  Per quanto tempo resta attivo il consenso una volta espresso?">
          <div>
            Il consenso resta attivo fino a quando l’assistito non effettua la revoca.
          </div>
        </q-collapsible>

        <q-collapsible sparse=""
                       label="8.  Posso verificare quali aziende hanno ricevuto il consenso da me espresso?">
          <div>
            Si: in qualsiasi momento è possibile collegarsi al servizio e verificare lo stato di trasmissione del
            consenso alle aziende aggiornato in tempo reale.
          </div>
        </q-collapsible>

        <q-collapsible sparse=""
                       label="9.  Cosa significano i triangolini verdi e/o gialli vicino al nome di ogni azienda ? ">
          <div>
            Se il triangolino è VERDE, significa che il consenso è stato inoltrato correttamente all’azienda; se il
            triangolino è GIALLO, vuol dire che non è stato completato il processo di notifica all’azienda. In entrambi
            i casi, cliccando sullo stesso, è possibile visualizzare il dettaglio.
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="10.	 Riceverò delle notifiche? ">
          <div>
            Se hai registrato il tuo profilo per ricevere le notifiche via mail e/o push, riceverai una notifica appena
            registri il tuo consenso e notifiche successive che ti comunicheranno lo stato di trasmissione alle aziende.
          </div>
        </q-collapsible>

        <q-collapsible sparse=""
                       label="11.  Se scade l’informativa, cosa devo fare per esprimere nuovamente il consenso?">
          <div>
            È possibile esprimerlo nuovamente, utilizzando il servizio on-line “Gestione Consensi”.
          </div>
        </q-collapsible>

        <q-collapsible sparse=""
                       label="12.  Un cittadino non assistito in Piemonte può inserire un consenso?">
          <div>
            No
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="13.  Dove posso visualizzare  i miei consensi?">
          <div>
            Attraverso la funzionalità presente sul servizio on-line “Gestione consensi”
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="14. È possibile effettuare una delega sul servizio “Gestione Consensi”?">
          <div>
            È possibile effettuare una delega, attraverso il servizio “Gestione Deleghe” dall'apposito menu posto in
            alto a destra sotto il profilo utente (due faccine affiancate).
          </div>
        </q-collapsible>

        <q-collapsible sparse="" label="15. Come posso sapere se un mio delegato sta operando a mio nome su Consensi?">
          <div>
            Il sistema traccia tutte le operazioni effettuate dalle persone che hai delegato e invia le notifiche di
            accesso ogni volta che qualcuno opera per nome e conto del delegante.
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
