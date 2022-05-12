<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <q-page padding>

    <q-alert color="info" class="q-mb-lg">
      Attenzione, questa modalità è da utilizzare solo per specifici casi indicati nel campo "Causale". <br>
      Se devi pagare un ticket sanitario, una prestazione effettuata in regime di libera professione o vaccinazioni,
      <router-link :to="$routes.HEALTH_PAYMENTS.AUTH_HEALTH_PAYMENTS" class="csi-link">
        vai all'apposita sezione
      </router-link>
      <br>
      Se usi impropriamente questa modalità, il pagamento non potrà essere accertato.
    </q-alert>

    <!-- DATI PAGAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-card class="bg-white" ref="paymentDataForm">
      <q-card-title>Dati del pagamento</q-card-title>
      <q-card-main>
        <csi-payment-data-form
          :asr-selected.sync="asrSelected"
          :reason-selected.sync="reasonSelected"
          :to-pay.sync="toPay"
          :$v="$v.paymentData"
          @update:reasonSelected="onReasonSelected"
        />
      </q-card-main>
    </q-card>


    <!-- DATI PAGANTE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-card class="bg-white q-mt-lg">
      <q-card-title>Dati di chi effettua il pagamento</q-card-title>
      <q-card-main>
        <csi-payment-person-form
          :surname.sync="payer.surname"
          :name.sync="payer.name"
          :tax-code.sync="payer.taxCode"
          :$v="$v.payer"
        />
      </q-card-main>
    </q-card>


    <!-- DATI INTESTATARIO PAGAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-field class="q-mt-lg">
      <q-toggle v-model="payForOthers" label="Paga per altri"/>
    </q-field>

    <q-slide-transition>
      <q-card v-if="payForOthers" class="bg-white q-mt-lg">
        <q-card-title>Dati dell'intestatario del pagamento</q-card-title>
        <q-card-main>
          <csi-payment-person-form
            :surname.sync="paymentHolder.surname"
            :name.sync="paymentHolder.name"
            :tax-code.sync="paymentHolder.taxCode"
            :$v="$v.paymentHolder"
          />
        </q-card-main>
      </q-card>
    </q-slide-transition>

    <!-- EMAIL PER LA RICEVUTA -->
    <q-card class="bg-white q-mt-lg" ref="receiptMailInput">
      <q-card-title>Ricevuta via mail</q-card-title>
      <q-card-main>
        <q-field
          class="q-mb-md"
          :helper="$t('HEALTH_PAYMENTS.PAYMENT_EMAIL_HELPER')"
          :error="$v.receiptMail.$error"
          error-label="L'indirizzo e-mail inserito non è corretto">
          <q-input
            type="email"
            v-model="receiptMail"
            float-label="Email"
            clearable
          />
        </q-field>
      </q-card-main>
    </q-card>

    <!-- NOTE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-card class="bg-white q-mt-lg">
      <q-card-title>Aggiungi delle note</q-card-title>
      <q-card-main>
        <q-field>
          <q-input
            v-model="notes"
            type="textarea"
            float-label="Note"
            :max-height="200"
            rows="4"
          />
        </q-field>
      </q-card-main>
    </q-card>


    <csi-buttons class="q-mt-lg">
      <csi-button primary label="Paga subito" :loading="isPaying" @click="onPay"/>
    </csi-buttons>
  </q-page>
</template>


<script>
  import CsiPaymentDataForm from "components/health-payments/CsiPaymentDataForm";
  import CsiPaymentPersonForm from "components/health-payments/CsiPaymentPersonForm";
  import {postHealthPaymentVoluntary} from "@services/api/health-payments";
  import {notifyError} from "@services/api/utils";
  import {required, alphaNum, email, numeric} from 'vuelidate/lib/validators';
  import {taxCodeCin, taxCodeLength, taxCodeName, taxCodeSurname, taxCodeTemporaryLength} from '@validators/taxCode'
  import {isEmpty, isObject, scrollToElement} from "@services/global/utils";

  export default {
    name: 'PageAuthOtherPayments',
    components: {CsiPaymentPersonForm, CsiPaymentDataForm},
    data: function () {

      let user = this.$store.getters['global/user'];

      return {
        asrSelected: null,
        reasonSelected: null,
        reasonSelectedModel: null,
        toPay: null,
        paymentHolder: {
          name: '',
          surname: '',
          taxCode: '',
        },
        payer: {
          name: user.nome,
          surname: user.cognome,
          taxCode: user.cf,
        },
        receiptMail: '',
        payForOthers: false,
        isPaying: false,
        notes: '',
      }
    },
    validations: {
      asrSelected: {required},
      reasonSelected: {required},
      toPay: {required},
      paymentData: ['asrSelected', 'reasonSelected', 'toPay'],
      paymentHolder: {
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
        }
      },
      payer: {
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
        }
      },
      receiptMail: {required, email},
    },
    computed: {
      userHasContactsEmail() {
        return isObject(this.$store.state.global.userContacts) &&
          !isEmpty(this.$store.state.global.userContacts.email)
      },
      userContactsEmail() {
        return this.$store.state.global.userContacts && this.$store.state.global.userContacts.email
      },
    },
    async mounted() {

      // Se l'utente ha impostato la mail nei contatti => la usiamo per popolare il campo di input per l'email
      if (this.userHasContactsEmail) this.copyContactMail()
    },
    methods: {
      copyContactMail() {
        this.receiptMail = this.userContactsEmail;
      },
      onReasonSelected(reasonId, reason) {
        this.reasonSelectedModel = reason;
      },
      async onPay() {

        // Validiamo prima le form
        this.$v.paymentData.$touch()
        this.$v.payer.$touch()
        let hasErrors = this.$v.paymentData.$error || this.$v.payer.$error;

        if (this.payForOthers) {
          this.$v.paymentHolder.$touch()
          hasErrors = hasErrors || this.$v.paymentHolder.$error
        }

        if (hasErrors) {
          scrollToElement(this.$refs.paymentDataForm.$el)
          return
        }

        // Controlliamo che l'email sia stata inserita correttamente
        this.$v.receiptMail.$touch()
        if (this.$v.receiptMail.$error) {
          scrollToElement(this.$refs.receiptMailInput.$el)
          return
        }

        let mex = `Sei sicuro di voler fare un pagamento spontaneo per la categoria ${this.reasonSelectedModel.descrizione}? Ricordiamo che se stai pagando una prestazione ambulatoriale questa non è la modalità giusta`;
        await this.$q.dialog({title: 'Attenzione', message: mex, ok: 'Ok', cancel: 'Annulla'});

        let payer = {
          nome: this.payer.name,
          cognome: this.payer.surname,
          codice_fiscale: this.payer.taxCode,
        }

        let paymentHolder = {
          nome: this.paymentHolder.name,
          cognome: this.paymentHolder.surname,
          codice_fiscale: this.paymentHolder.taxCode,
        }

        let data = {
          id_asr: this.asrSelected,
          causale_versamento: this.reasonSelected,
          versante: payer,
          pagatore: this.payForOthers ? paymentHolder : payer,
          pagato: {valore: this.toPay, valuta: 'EUR'},
          mail: this.receiptMail,
          note: this.notes
        };

        this.isPaying = true;

        try {
          let response = await postHealthPaymentVoluntary(data, {_no5XXRedirect: true});
          let url = response.data
          location.assign(url)
        } catch (e) {
          notifyError(e, 'Al momento non è possibile effettuare il pagamento. Ti invitiamo a riprovare più tardi')
        }

        this.isPaying = false;
      }
    }
  }
</script>
