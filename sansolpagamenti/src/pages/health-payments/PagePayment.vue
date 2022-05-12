<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <csi-page-title title="Pagamento" @back="onBack"/>

    <template v-if="!isLoading">
      <csi-stepper
        ref="stepper"
        alternative-labels
        contractable
        class="csi-stepper-no-padding csi-stepper-no-shadow">

        <!-- STEP 1 -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <q-step :name="STEPS.RESUME" title="Riepilogo" default>
          <form @submit.prevent="onStep1Next">

            <div class="row justify-between">
              <div class="q-body-2">
                <span v-if="healthPaymentsCount === 1">1 Pagamento</span>
                <span v-if="healthPaymentsCount > 1">{{healthPaymentsCount}} Pagamenti</span>
              </div>
              <div class="q-body-2">
                Totale importo:

                <template v-if="refundUsedList.length > 0">
                <span class="q-ml-xs text-right">
                  {{amount | toFixed}}&euro;
                </span>
                </template>
                <span :class="{'csi-text-strike text-weight-regular block text-right': refundUsedList.length > 0}">
                {{healthPaymentsToPayTotal | toFixed}}&euro;
              </span>
              </div>
            </div>

            <!-- LISTA TICKETS -->
            <!-- ------------- -->
            <div
              v-for="ticket in healthPayments"
              :key="ticket.uuid"
              class="q-mt-sm"
            >
              <csi-ticket-list-item
                :ticket="ticket"
                :holder="ticket.paziente"
                no-more-actions
              >
                <csi-buttons slot="actions" class="q-pa-md">
                  <csi-button secondary label="Rimuovi" color="negative" @click="onRemove(ticket)"/>
                </csi-buttons>
              </csi-ticket-list-item>

              <q-card class="bg-green-2">
                <q-card-main>
                  <q-field>
                    <q-toggle
                      v-model="ticket.opposizione730"
                      :true-value="1"
                      :false-value="0"
                      :label="getLabel730(ticket)">
                    </q-toggle>
                  </q-field>
                </q-card-main>
              </q-card>
            </div>


            <!-- RIMBORSI -->
            <!-- -------------- ----------------------------------------------------------------------------------------->
            <!-- Se l'utente sta cercando di pagare dei ticket non suoi -->
            <!-- Gli diciamo che non potrà usufruire dei rimborsi di altre persone -->
            <!--            <template v-if="hasOtherHolders">-->
            <!--              <q-alert color="info" class="q-my-lg">-->
            <!--                Abbiamo notato che stai cercando di pagare ticket non intestati a te. <br>-->
            <!--                Volevamo avvisarti che al momento puoi utilizzare solo i tuoi rimborsi.-->
            <!--              </q-alert>-->
            <!--            </template>-->

            <template v-if="isLoadingRefundList || refundList.length > 0">
              <q-card class="q-my-lg">
                <template v-if="!isLoadingRefundList">
                  <q-card-title>Rimborsi</q-card-title>

                  <!-- NO RIMBORSI COMPATIBLI -->
                  <template v-if="refundList.length <= 0">
                    <q-card-main>
                      Al momento non possiedi rimborsi compatibili con i pagamenti sanitari che stai cercando di
                      pagare.
                    </q-card-main>
                  </template>

                  <!-- RIMBORSI COMPATIBLI -->
                  <template v-else>
                    <div class="row justify-between q-pa-md bg-grey-3">
                      <div class="q-body-2">
                        <span v-if="refundList.length === 1">1 Rimborso</span>
                        <span v-if="refundList.length > 1">{{refundList.length}} Rimborsi</span>
                      </div>
                      <div class="q-body-2">Totale rimborsi usati: {{refundUsedAmount | toFixed}}&euro;</div>
                    </div>

                    <q-card-main>
                      <q-list no-border separator>
                        <q-item
                          v-for="refund in refundList"
                          :key="refund.__id"
                          class="q-px-none q-py-md"
                        >
                          <q-item-main>
                            <q-item-tile class="q-body-1">
                              {{getRefundHolderFullName(refund)}}
                            </q-item-tile>
                            <q-item-tile class="q-caption">
                              {{getRefundAsrName(refund)}}
                            </q-item-tile>
                            <template
                              v-if="isRefundUsed(refund) && getRefundAmountUsed(refund) < getRefundAmount(refund)">
                              <q-item-tile class="q-body-2 q-mt-xs">
                                Di questo rimborso verranno usati solo {{getRefundAmountUsed(refund) | toFixed}} &euro;
                                <br>
                                I restanti {{getRefundAmount(refund) - getRefundAmountUsed(refund) | toFixed}} &euro;
                                saranno
                                disponibili per pagamenti successivi
                              </q-item-tile>
                            </template>

                            <template v-if="!isRefundUsable(refund)">
                              <div class="q-body-2 q-mt-xs">
                                L'importo del pagamento è già stato <br> pienamente soddisfatto da altri rimborsi
                              </div>
                            </template>
                          </q-item-main>

                          <!-- TOGGLE -->
                          <q-item-side class="self-start">
                            <q-item-tile>
                              <template v-if="isRefundUsable(refund)">
                                <q-toggle
                                  v-model="refundUsedList"
                                  :val="refund"
                                />
                              </template>
                            </q-item-tile>
                          </q-item-side>

                          <!-- IMPORTO -->
                          <q-item-side class="self-start">
                            <q-item-tile class="q-subheading text-weight-bold text-black text-right">
                              {{getRefundAmount(refund) | toFixed}} &euro;
                            </q-item-tile>
                          </q-item-side>
                        </q-item>
                      </q-list>
                    </q-card-main>
                  </template>
                </template>

                <csi-inner-loading :visible="isLoadingRefundList" block/>
              </q-card>
            </template>


            <!-- EMAIL PER LA RICEVUTA -->
            <!-- --------------------- -->
            <q-card class="bg-white q-mt-lg" ref="receiptMailInput">
              <q-card-title>Ricevuta via mail</q-card-title>
              <q-card-main>
                <q-field
                  class="q-mb-md"
                  :helper="$t('HEALTH_PAYMENTS.PAYMENT_EMAIL_HELPER')"
                  :error="$v.receiptMail.$error"
                  error-label="L'indirizzo e-mail inserito non è corretto"
                  required
                >
                  <q-input
                    type="email"
                    v-model="receiptMail"
                    float-label="Email"
                    clearable
                    name="email"
                    autocomplete="email"
                  />
                </q-field>
              </q-card-main>
            </q-card>

            <!-- MODALITA' DI PAGAMENTO -->
            <!-- ---------------------- -->
            <q-card class="bg-white q-mt-lg">
              <q-card-title>Modalità di pagamento</q-card-title>

              <q-card-main v-if="!isLoadingAsr">

                <div v-if="!paymentMethods || !paymentMethods.length">
                  Al momento non è possibile effettuare il pagamento. Prova più tardi. <br>
                  Ci scusiamo per il disagio.
                </div>


                <div v-else class="row wrap gutter-md">
                  <div v-for="paymentMethod in paymentMethods"
                       :key="paymentMethod.id"
                       class="col-12 col-md">

                    <div class="row wrap items-center gutter-sm">
                      <div class="col-12">
                        <img
                          :src="paymentMethod.tesoriere.url_logo"
                          :alt="paymentMethod.tesoriere.url_logo"
                          class="responsive"
                        >
                      </div>

                      <div class="col-12">
                        <div>
                          <q-radio
                            v-model="selectedPaymentMethod"
                            :val="paymentMethod.id"
                            :label="paymentMethod.tesoriere.descrizione"
                            class="q-body-2"
                          />
                        </div>


                        <div v-if="isPspPaymentMethod(paymentMethod)" class="q-mt-sm">
                          <div v-html="$t('HEALTH_PAYMENTS.PSP_DESCRIPTION')"></div>
                        </div>

                        <div v-if="paymentMethod.carte_commissioni && paymentMethod.carte_commissioni.length"
                             class="q-mt-sm">
                          <div>Sono accettate le carte:</div>
                          <ul>
                            <li v-for="commissionCard in paymentMethod.carte_commissioni">
                              {{commissionCard.descrizione}}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-main>

              <csi-inner-loading :visible="isLoadingAsr" block/>
            </q-card>


            <!-- INFORMATIVA -->
            <q-card class="q-mt-lg">
              <q-card-title>Informativa sul trattamento dei dati personali</q-card-title>
              <q-card-main>
                <q-field>
                  <q-toggle v-model="hasAcceptedPolicy">
                  <span class="q-ml-sm">
                    Dichiaro di aver preso visione di quanto contenuto nelle
                    <a href="" @click.prevent.stop="showPolicyModal">condizioni di servizio</a>
                  </span>
                  </q-toggle>
                </q-field>
              </q-card-main>
            </q-card>


            <csi-buttons class="q-mt-md">
              <csi-button primary type="submit" label="Prosegui" :loading="isPaying"/>
            </csi-buttons>
          </form>
        </q-step>


        <!-- STEP 2 -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <q-step :name="STEPS.PAYMENT" title="Versante">

          <form @submit.prevent="onStep2Next">
            <!-- DATI PAGANTE -->
            <!-- ----------------------------------------------------------------------------------------------------------- -->
            <q-card class="bg-white q-mt-lg">
              <q-card-title>Dati di chi effettua il pagamento</q-card-title>
              <q-card-main>

                <csi-payment-person-form
                  :surname.sync="surname"
                  :name.sync="name"
                  :tax-code.sync="taxCode"
                  :$v="$v"
                />

              </q-card-main>
            </q-card>


            <csi-buttons class="q-mt-md">
              <csi-button primary type="submit" label="Paga" :loading="isPaying"/>
              <csi-button secondary label="Indietro" @click="$refs.stepper.previous()"/>
            </csi-buttons>
          </form>
        </q-step>


        <!-- STEP 3 -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <!--        <q-step :name="STEPS.RECEIPT" title="Ricevuta">-->

        <!--          <q-alert type="positive" icon="check">-->
        <!--            <div class="q-body-2">La procedura di pagamento si è conclusa correttamente!</div>-->
        <!--            <div class="q-body-1 q-mt-sm">-->
        <!--              Riceverai una copia della ricevuta nella casella di posta che hai indicato:-->
        <!--              &lt;!&ndash; @TODO: non è possibile riottenere la mail inserita &ndash;&gt;-->
        <!--              <span class="text-italic">{{receiptMail}}</span>. <br/>-->
        <!--              La ricevuta sarà anche disponibile nell'area pagamenti effettuati-->
        <!--            </div>-->
        <!--            <div class="q-body-1 q-mt-md">Importo pagato <span-->
        <!--              class="q-body-2">{{healthPaymentsPayedTotal}} &euro;</span>-->
        <!--            </div>-->
        <!--          </q-alert>-->

        <!--          <div class="q-mt-lg">-->
        <!--            <csi-ticket-list-item-->
        <!--              v-for="ticket in healthPayments"-->
        <!--              :key="ticket.uuid"-->
        <!--              :ticket="ticket"-->
        <!--              :holder="ticket.paziente"-->
        <!--            />-->
        <!--          </div>-->

        <!--          <csi-buttons class="q-mt-md">-->
        <!--            <csi-button primary label="Torna alla Home" @click="goToHome"/>-->
        <!--          </csi-buttons>-->
        <!--        </q-step>-->
      </csi-stepper>


      <!-- MODALS -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <csi-modal-policy
        v-model="isPolicyModalVisible"
        policy="statics/terms-and-conditions/health-payments.html"
        :content-css="{width: '100%', maxWidth: '800px', minHeight: '95vh'}"
      />

      <q-modal
        v-model="isRemoveModalVisible"
        :content-css="{maxWidth: '800px'}">

        <q-modal-layout v-if="ticketToRemove">
          <!-- MODAL BODY -->
          <!-- --------------------------------------------------------------------------------------------------------- -->
          <div class="q-pa-md">
            <h1 class="csi-h2 q-mb-md">Rimuovi pagamento</h1>
            <p>Vuoi rimuovere questo pagamento?</p>
            <csi-ticket-list-item :ticket="ticketToRemove" :holder="ticketToRemove.paziente" no-actions
                                  no-more-actions/>

            <csi-buttons class="q-mt-lg">
              <csi-button v-close-overlay primary label="Sì, rimuovi" color="negative"
                          @click="remove(ticketToRemove)"/>
              <csi-button v-close-overlay secondary label="No, annulla"/>
            </csi-buttons>
          </div>
        </q-modal-layout>
      </q-modal>
    </template>


    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-inner-loading :visible="isLoading"/>
  </q-page>
</template>


<script>
  import {required, email, alphaNum, numeric} from 'vuelidate/lib/validators'
  import CsiTicketListItem from 'components/health-payments/CsiTicketListItem'
  import {isEmpty, isNil, isObject, scrollToElement, sumBy, uniqueElements} from '@services/global/utils'
  import {
    getAsr,
    getHealthPayment,
    getRefundList,
    getRefundRefundableList,
    postHealthPayments
  } from '@services/api/health-payments'
  import CsiPageTitle from 'components/global/common/CsiPageTitle'
  import {
    getCompatibleHealthPayments,
    getCompatibleRefunds,
    isPspPaymentMethod, isRefundCompatible
  } from '@services/health-payments/business-logic'
  import CsiModalPolicy from 'components/global/common/CsiModalPolicy'
  import {notifyError} from '@services/api/utils'
  import CsiPaymentPersonForm from 'components/health-payments/CsiPaymentPersonForm'
  import {taxCodeCin, taxCodeLength, taxCodeName, taxCodeSurname, taxCodeTemporaryLength} from '@validators/taxCode'
  import CsiRefundListItem from "components/health-payments/CsiRefundListItem";
  import CsiBar from "components/global/common/CsiBar";


  export default {
    name: 'PagePayment',
    components: {CsiBar, CsiRefundListItem, CsiPaymentPersonForm, CsiModalPolicy, CsiPageTitle, CsiTicketListItem},
    data() {

      let user = this.$store.getters['global/user']

      return {
        STEPS: {
          'RESUME': 'resume',
          'PAYMENT': 'payment',
          // 'RECEIPT': 'receipt',
        },
        healthPayments: [],
        auth730: true,
        receiptMail: '',
        paymentMethods: [],
        selectedPaymentMethod: undefined,
        name: user.nome,
        surname: user.cognome,
        taxCode: user.cf,
        isLoading: false,
        isPaying: false,
        isRemoveModalVisible: false,
        ticketToRemove: null,
        hasAcceptedPolicy: false,
        isPolicyModalVisible: false,
        isLoadingAsr: false,
        asrList: [],
        isLoadingRefundList: false,
        refundList: [],
        refundUsedList: [],
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      isUserLogged(){
        return this.$store.getters['global/isUserLogged']
      },
      userHasContactsEmail() {
        return isObject(this.$store.state.global.userContacts) &&
          !isEmpty(this.$store.state.global.userContacts.email)
      },
      userContactsEmail() {
        return this.$store.state.global.userContacts.email
      },
      healthPaymentsCount() {
        return this.healthPayments.length
      },
      healthPaymentsToPayTotal() {
        return this.healthPayments.reduce((acc, val, index) => {
          return val.da_pagare ? acc + val.da_pagare.valore : acc
        }, 0)
      },
      healthPaymentsPayedTotal() {
        return this.healthPayments.reduce((acc, val, index) => {
          return val.pagato ? acc + val.pagato.valore : acc
        }, 0)
      },
      healthPaymentHolderList() {
        let taxCodeList = this.healthPayments.map(hp => hp.paziente.codice_fiscale);
        return uniqueElements(taxCodeList);
      },
      hasOtherHolders() {
        // Se l'utente è anonimo allora ignoriamo tutto
        // perché i rimborsi non vengono gestiti
        if (!this.user) return false;
        return this.healthPayments.some(hp => hp.paziente.codice_fiscale !== this.user.cf);
      },
      isCartPayment() {
        return this.healthPaymentsCount > 1
      },
      refundUsedAmount() {
        // return sumBy(this.refundUsedList, el => {
        //   return el && el.prenotazione && el.prenotazione.importo_da_rimborsare && el.prenotazione.importo_da_rimborsare.valore || 0
        // })

        return this.refundUsedList.reduce((sum, r) => {
          let amount = this.getRefundAmountUsed(r)
          return sum + amount
        }, 0);
      },
      amount() {
        // let total = this.healthPaymentsToPayTotal
        // let subtract = this.refundUsedList.reduce((sum, r) => {
        //   let amount = this.getRefundAmountUsed(r)
        //   return sum + amount
        // }, 0);
        //
        // let result = total - subtract
        // return Math.max(result, 0)

        let result = this.healthPaymentsToPayTotal - this.refundUsedAmount
        return Math.max(result, 0)
      }
    },
    validations: {
      receiptMail: {required, email},
      name: {required},
      surname: {required},
      taxCode: {
        required,
        // Deve fallire solo se la lunghezza è quella di un CF provvisorio e tutti i caratteri non sono numerici
        numeric: (taxCode = '') => !taxCodeTemporaryLength(taxCode) || numeric(taxCode),
        // Deve fallire solo se la lunghezza è quella di un CF normale ed i caratteri non sono alfanumerici
        alphaNum: (taxCode = '') => !taxCodeLength(taxCode) || alphaNum(taxCode),
        taxCodeLength: (taxCode = '') => taxCodeLength(taxCode) || taxCodeTemporaryLength(taxCode),
        // Deve fallire solo se la lunghezza è quella di un CF normale ed i CIN non corretto
        taxCodeCin: (taxCode = '') => !taxCodeLength(taxCode) || taxCodeCin(taxCode),
        taxCodeName: (taxCode, person) => !taxCodeLength(taxCode) || taxCodeName(person.name)(taxCode),
        taxCodeSurname: (taxCode, person) => !taxCodeLength(taxCode) || taxCodeSurname(person.surname)(taxCode),
      },
      paymentPerson: ['name', 'surname', 'taxCode']
    },
    async mounted() {

      // Se l'utente ha impostato la mail nei contatti => la usiamo per popolare il campo di input per l'email
      if (this.userHasContactsEmail) this.copyContactMail();

      let {ticketId} = this.$route.query;
      let {ticket} = this.$route.params;

      // Ottimizziamo le chiamate alle API, facciamole tutte contemporaneamente :)
      let asrListPromise = null;
      let healthPaymentPromise = null;
      let refundListPromiseList = null;

      // Analizziamo in anticipo cosa dobbiamo fare
      let isCartPayment = isNil(ticketId);
      let mustLoadHealthPayment = !isCartPayment && isNil(ticket);
      let mustLoadAsr = true;
      // Al momento possono essere usati i rimborsi solo per l'utente loggato
      let mustLoadRefundList = this.isUserLogged;

      // Avviamo tutte le chiamate necessarie insieme!
      if (mustLoadAsr) {
        this.isLoadingAsr = true;
        asrListPromise = getAsr();
      }

      if (mustLoadHealthPayment) {
        this.isLoading = true;
        let cf = this.$store.getters['healthPayments/getTaxCode'];
        healthPaymentPromise = getHealthPayment(cf, ticketId);
      }

      if (mustLoadRefundList) {
        this.isLoadingRefundList = true;
        let taxCode = this.user && this.user.cf;

        // Per adesso commentiamo questa funzionalità. In futuro, se si decide che possono essere usati
        // i rimborsi di tutti i titolari dei ticket da pagare, basterà decommentare questo pezzo di codice
        //
        // Carichiamo i rimborsi di tutti i pazienti coinvolti nel carrello
        // let taxCodeList = this.healthPayments.map(hp => hp.paziente.codice_fiscale)
        // taxCodeList = uniqueElements(taxCodeList)

        // Il codice lo impostiamo per gestire rimborsi di più utenti (in caso di evolutive future)
        let taxCodeList = [taxCode];
        refundListPromiseList = taxCodeList.map(taxCode => getRefundRefundableList(taxCode, {_no5XXRedirect: true}));
      }

      // Infine aspettiamo il risultato delle chiamate
      // ed applichiamo la logica necessaria
      if (isCartPayment) {
        this.healthPayments = this.$store.getters['healthPayments/cartItems']
      } else if (ticket) {
        this.healthPayments = [ticket]
      } else if (mustLoadHealthPayment) {
        try {
          let response = await healthPaymentPromise;
          ticket = response.data;
          this.healthPayments = [ticket]
        } catch (err) {
          notifyError(err, "Non è stato possibile caricare il pagamento sanitario")
        }
      }

      // Ci è stato chiesto di mettere sempre ad "autorizzo", perciò ignoriamo ciò che ci dicono le API
      this.healthPayments = this.healthPayments.map(hp => ({...hp, opposizione730: 1}));
      // normalizziamo il dato opposizione730
      // cioè, se è 0 (false) lo lasciamo a 0, altrimenti lo impostiamo ad 1 (true)
      // this.healthPayments = this.healthPayments.map(hp => hp.opposizione730 === 0 ? hp : {...hp, opposizione730: 1})


      // Aspettiamo il caricamento delle ASR perché ci serve per calcolare i metodi di pagamento disponibili
      try {
        let response = await asrListPromise;
        this.asrList = response.data;
      } catch (err) {
        notifyError(err, 'Al momento non è possibile effettuare il pagamento. Ti invitiamo a riprovare più tardi')
      }

      // otteniamo l'elenco dei metodi di pagamento disponibili per tutti i ticket che
      // l'utente sta cercando di pagare
      this.paymentMethods = this.getPaymentMethods(this.healthPayments);
      this.selectedPaymentMethod = this.paymentMethods[0] ? this.paymentMethods[0].id : undefined;

      if (mustLoadRefundList) {
        try {
          let responseList = await Promise.all(refundListPromiseList);

          // Mettiamo insieme i rimborsi di tutti i titolari dei ticket che si vogliono pagare
          this.refundList = responseList.reduce((out, r) => {
            out = [...out, ...r.data];
            return out
          }, []);

          // Di tutti i rimborsi teniamo solo quelli compatibili con i ticket
          // che l'utente sta cercando di pagare
          this.refundList = this.refundList.filter(r => {
            let payments = getCompatibleHealthPayments(r, this.healthPayments)
            return payments.length > 0
          })
        } catch (err) {
          // Commentiamo il messaggio di errore poiché si vuole che i rimborsi siano solo un "plus"
          // Quindi anche se non funzionano, non fa nulla.
          // Anche perché i casi di rimborsi sono molto rari
          //
          // notifyError(err, "Non è stato possibile caricare l'elenco dei rimborsi")
        }
      }

      this.isLoading = false;
      this.isLoadingAsr = false;
      this.isLoadingRefundList = false;
    },
    methods: {
      isPspPaymentMethod,
      getLabel730(ticket) {
        return ticket.opposizione730
          ? `Autorizzo l'invio dei dati all'Agenzia delle Entrate per la precompilazione del 730`
          : `Non autorizzo l'invio dei dati all'Agenzia delle Entrate per la precompilazione del 730`
      },
      onBack() {
        this.$router.back()
      },
      showPolicyModal() {
        this.isPolicyModalVisible = true
      },
      onStep1Next() {

        // Controlliamo che l'informativa sia stata accettata
        if (!this.hasAcceptedPolicy) {
          this.$q.notify({color: 'negative', message: `Non puoi andare avanti senza accettare l'informativa`})
          return
        }

        // Controlliamo che l'email sia stata inserita correttamente
        this.$v.receiptMail.$touch()
        if (this.$v.receiptMail.$error) {
          scrollToElement(this.$refs.receiptMailInput.$el)
          return
        }

        // Se il metodo di pagamento non è stato selzionato => non facciamo nulla
        if (!this.selectedPaymentMethod) return

        // Se è stato selezionato il pagamento psp => facciamo proseguire l'utente allo step che permette di inserire
        // i dati del versante
        // Altrimenti passiamo subito al pagamento
        let selectedPaymentMethod = this.getPaymentMethods(this.healthPayments).find(h => h.id === this.selectedPaymentMethod)
        isPspPaymentMethod(selectedPaymentMethod) ? this.$refs.stepper.next() : this.onPay()
      },
      onStep2Next() {

        this.$v.paymentPerson.$touch()
        if (this.$v.paymentPerson.$error) return

        this.onPay()
      },
      goToHome() {
        let isLogged = this.$store.getters['global/isUserLogged']
        let route = isLogged ? this.$routes.HEALTH_PAYMENTS.AUTH_HOME : this.$routes.HEALTH_PAYMENTS.ANONYMOUS_HOME
        this.$router.push(route)
      },
      copyContactMail() {
        this.receiptMail = this.userContactsEmail
      },
      getPaymentMethods(healthPayments) {
        let result = []
        let ticket = healthPayments[0]
        let asr = this.asrList.find(a => a.id === ticket.asr.id)

        // Se non riusciamo a trovare l'asr => non facciamo nulla
        if (!asr) return result

        // Se il ticket supporta pagoPA => lo aggiungo come metodo di pagamento
        // @NOTE: tutti i ticket del carrello devono supportare pagoPA
        if (this.isCartPayment || asr.canale_psp) {
          result = [...result, this.$config.healthPayments.pspPaymentMethod]
        }

        // Se non si tratta del pagamento da carrello (quindi è un pagamento singolo)
        // => se esiste il canale POS lo aggiungo
        if (!this.isCartPayment && asr.canale_pos) {
          result = [...result, asr.canale_pos]
        }

        return result
      },
      async onPay() {

        let data = {
          mail: this.receiptMail,
          pratiche_da_pagare: this.healthPayments.map(h => ({
            codice_fiscale: h.paziente.codice_fiscale,
            numero_pratica_regionale: h.numero_pratica_regionale,
            opposizione730: h.opposizione730 || 0,
          })),
          pratiche_da_rimborsare: this.refundUsedList.map(r => ({
            codice_fiscale: r && r.paziente && r.paziente.codice_fiscale,
            numero_pratica_regionale: r && r.prenotazione && r.prenotazione.numero_pratica
          }))
        }

        let selectedPaymentMethod = this.getPaymentMethods(this.healthPayments).find(h => h.id === this.selectedPaymentMethod)
        let isPspPayment = isPspPaymentMethod(selectedPaymentMethod)

        if (isPspPayment) {
          // Se il pagamento è di tipo PSP (cioè con PagoPA) => l'utente è passato dallo step
          // per l'inserimento del versante e dobbiamo inserirne i dati
          data.psp = true
          data.versante = {
            nome: this.name,
            cognome: this.surname,
            codice_fiscale: this.taxCode,
          }
        } else {
          // Se il pagamento è di tipo POS => l'utente non è passato dallo step per l'inserimento del versante
          // perciò non lo inseriamo. Inoltre dobbiamo dire esplicitamente che non si tratta di un pagamento psp
          // impostando il flag a false e dobbiamo dire con quale carta commissione l'utente ha scelto di pagare
          data.psp = false
          // @TODO: per ora forziamo come carta selezionata la prima. In futuro decidere come fare (cambiare UI, cambiare servizio ecc)
          data.pos = selectedPaymentMethod.carte_commissioni[0]
          // data.versante = null
        }


        this.isPaying = true

        try {
          let response = await postHealthPayments(data, {_no5XXRedirect: true})

          // Dal momento che le API non sono in grado di dirci si il pagamento appena effettuato è stato fatto con
          // psp o pos, siamo costretti a salvarlo nel local storage per poter discriminare
          this.$q.sessionStorage.set('healthPayments.isPspPayment', isPspPayment)

          this.redirectToPayment(response.data)
        } catch (e) {
          notifyError(e, 'Al momento non è possibile effettuare il pagamento. Ti invitiamo a riprovare più tardi')
        }

        this.isPaying = false

      },
      redirectToPayment(url) {
        location.assign(url)
      },
      isCartItem(ticket) {
        return this.$store.getters['healthPayments/isCartItem'](ticket)
      },
      onRemove(ticket) {
        this.isRemoveModalVisible = true
        this.ticketToRemove = ticket
      },
      remove(ticket) {
        this.ticketToRemove = null
        let isCartItem = this.isCartItem(ticket)
        if (isCartItem) this.$store.commit('healthPayments/removeFromCart', ticket)

        // Se il pagamento è singolo => effettuiamo il redirect alla pagina con la lista dei ticket
        if (this.healthPayments.length <= 1) {
          this.goToHome()
          return
        }

        // Se siamo qui ci sono più pagamenti => aggiorniamo l'array dei pagamenti da effettuare
        this.healthPayments = this.healthPayments.filter(hp => hp.numero_pratica_regionale !== ticket.numero_pratica_regionale)
      },
      getRefundUsableList(healthPayment) {
        let compatibleList = getCompatibleRefunds(healthPayment, this.refundList);
        let usable = compatibleList.filter(r => this.refundUsedList.every(el => el.__id !== r.__id))
        return usable
      },
      canUseRefunds(healthPayment) {
        let usable = this.getRefundUsableList(healthPayment)

        let paymentAmount = healthPayment.da_pagare || 0
        let refundAmount = sumBy(usable, el => {
          return el && el.prenotazione && el.prenotazione.importo_da_rimborsare && el.prenotazione.importo_da_rimborsare.valore || 0
        })

        return usable.length > 0 && paymentAmount > refundAmount
      },
      onRefundUse(refund) {
        this.refundUsedList = [...this.refundUsedList, refund]
      },
      getRefundAsr(refund) {
        let asrCode = refund && refund.prenotazione && refund.prenotazione.asr_beneficiaria
        return this.asrList.find(a => "" + a.id === "" + asrCode);
      },
      getRefundAsrName(refund) {
        let asr = this.getRefundAsr(refund)
        return asr && asr.descrizione
      },
      getRefundHolderFullName(refund) {
        let firstName = refund && refund.paziente && refund.paziente.nome
        let lastName = refund && refund.paziente && refund.paziente.cognome
        return [firstName, lastName].filter(s => !!s).join(' ')
      },
      getRefundAmount(refund) {
        let result = refund && refund.prenotazione && refund.prenotazione.importo_da_rimborsare && refund.prenotazione.importo_da_rimborsare.valore
        return result || 0
      },
      // L'ammontare usato del singolo rimborso dipende
      // dal totale da pagare - il totale già rimborsato
      getRefundAmountUsed(refund) {
        let payments = getCompatibleHealthPayments(refund, this.healthPayments);
        let toPay = sumBy(payments, el => el.da_pagare.valore)

        // Calcoliamo l'ammontare dei rimborsi già usati su questi ticket
        let refundUsedForPayments = this.refundUsedList.filter(r => payments.some(hp => isRefundCompatible(hp, r)));
        let index = refundUsedForPayments.findIndex(el => el.__id === refund.__id)
        if (index === -1) index = refundUsedForPayments.length
        let usedRefund = refundUsedForPayments.slice(0, index);
        let refunded = sumBy(usedRefund, el => this.getRefundAmount(el))


        // calcoliamo quanto resta da pagare dei ticket coinvolti e con i rimborsi usati
        toPay = toPay - refunded
        toPay = Math.max(toPay, 0);

        // A questo punto l'ammontare che possiamo usare per questo rimborso è il minimo tra l'ammontare restante
        // ed il valore del rimborso
        let refundAmount = this.getRefundAmount(refund)
        return Math.min(toPay, refundAmount)
      },
      // Un rimborso è considerato "usabile" se:
      //    1. non è già stato usato
      //    2. è compatibile con i ticket su cui si vuole poterlo usare
      //    3. i ticket su cui si può usare non sono già stati pienamente soddisfatti da altri rimborsi
      //
      // @INFO:
      //    La complessità temporale di questa funzione é NxM dove N è il numero di ticket ed M il numero di rimborsi.
      //    Fortunatamete lavoriamo con numeri bassissimi (<10), quindi al momento va bene così
      isRefundUsable(refund) {
        let isUsed = this.isRefundUsed(refund)
        if (isUsed) return true

        let payments = getCompatibleHealthPayments(refund, this.healthPayments)
        if (payments.length <= 0) return

        let refundUsedForPaymentsList = this.refundUsedList.filter(r => {
          return payments.some(p => isRefundCompatible(p, r))
        })

        let refundUsedForPaymentsAmount = sumBy(refundUsedForPaymentsList, r => {
          return this.getRefundAmount(r)
        })

        let paymentsAmount = sumBy(payments, p => {
          return p.da_pagare ? p.da_pagare.valore : 0
        })

        return paymentsAmount > refundUsedForPaymentsAmount
      },
      isRefundUsed(refund) {
        return this.refundUsedList.some(el => el.__id === refund.__id)
      }
    },
  }
</script>

<style scoped></style>
