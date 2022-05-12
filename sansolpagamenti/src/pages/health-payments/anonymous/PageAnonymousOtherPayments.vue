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
      <router-link :to="$routes.HEALTH_PAYMENTS.ANONYMOUS_HEALTH_PAYMENTS" class="csi-link">
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


    <!-- DATI INTESTATARIO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-card class="bg-white q-mt-lg">
      <q-card-title>Dati intestatario del pagamento</q-card-title>
      <q-card-main>
        <csi-payment-person-form
          :surname.sync="paymentHolder.surname"
          :name.sync="paymentHolder.name"
          :tax-code.sync="paymentHolder.taxCode"
          :$v="$v.paymentHolder"
        />
      </q-card-main>
    </q-card>

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
  import {scrollToElement} from "@services/global/utils";

  export default {
    name: 'PageAnonymousOtherPayments',
    components: {CsiPaymentPersonForm, CsiPaymentDataForm},
    data: function () {
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
          name: '',
          surname: '',
          taxCode: '',
        },
        receiptMail: '',
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
    methods: {
      onReasonSelected(reasonId, reason) {
        this.reasonSelectedModel = reason;
      },
      async onPay() {

        // Controlliamo che l'email sia stata inserita correttamente
        this.$v.receiptMail.$touch();
        if (this.$v.receiptMail.$error) {
          scrollToElement(this.$refs.receiptMailInput.$el);
          return
        }

        this.$v.$touch();
        if (this.$v.$error) {
          scrollToElement(this.$refs.paymentDataForm.$el);
          return
        }

        let mex = `Sei sicuro di voler fare un pagamento spontaneo per la categoria ${this.reasonSelectedModel.descrizione}? Ricordiamo che se stai pagando una prestazione ambulatoriale questa non è la modalità giusta`;
        await this.$q.dialog({title: 'Attenzione', message: mex, ok: 'Ok', cancel: 'Annulla'});

        let payload = {
          id_asr: this.asrSelected,
          causale_versamento: this.reasonSelected,
          pagato: {
            valore: this.toPay,
            valuta: 'EUR'
          },
          versante: {
            nome: this.payer.name,
            cognome: this.payer.surname,
            codice_fiscale: this.payer.taxCode,
          },
          pagatore: {
            nome: this.paymentHolder.name,
            cognome: this.paymentHolder.surname,
            codice_fiscale: this.paymentHolder.taxCode,
          },
          mail: this.receiptMail,
          note: this.notes,
        };


        this.isPaying = true;

        // Otteniamo la URL del pagamento ed effettuiamo il redirect
        try {
          let response = await postHealthPaymentVoluntary(payload, {_no5XXRedirect: true});
          let url = response.data;
          location.assign(url)
        } catch (e) {
          notifyError(e, 'Al momento non è possibile effettuare il pagamento. Ti invitiamo a riprovare più tardi')
        }

        this.isPaying = false
      }
    }
  }
</script>
