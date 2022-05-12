<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-modal-layout footer-class="shadow-0">
    <q-toolbar slot="header">
      <q-toolbar-title>Inserisci numero di telefono mobile</q-toolbar-title>
      <q-btn flat round icon="close" v-close-overlay></q-btn>
    </q-toolbar>

    <div class="q-pa-md">

      <csi-stepper ref="contactMobilePhoneStepper" vertical class="shadow-0">

        <!-- STEP 1 - Inserimento email -->
        <q-step default title="Numero">

          <q-alert color="info" class="q-mt-md">
            <div class="q-body-1">
              <p>
                Riceverai un codice via SMS per confermare il numero di telefono mobile che hai inserito.
              </p>
              <p v-if="attemptsLeft !== undefined" class="q-caption">
                Hai a disposizione
                <strong>{{attemptsLeft === 1 ? `1 tentatitvo` : `${attemptsLeft} tentativi`}}</strong>
              </p>
            </div>
          </q-alert>

          <q-slide-transition v-if="attemptsLeft !== undefined && attemptsLeft <= 0">
            <q-alert color="negative" class="q-mt-md">
              <div class="q-body-1">
                Per oggi non puoi più ricevre il codice via SMS, puoi riprovare domani.
              </div>
            </q-alert>
          </q-slide-transition>

          <q-slide-transition v-if="hasOtpGenerationError">
            <q-alert color="negative" class="q-mt-md">
              <div class="q-body-1">
                Si è verificato un errore durante la generazione del codice OTP, riprova.
              </div>
            </q-alert>
          </q-slide-transition>

          <csi-input-mobile-phone
            required
            v-model="mobilePhone"
            :error="$v.mobilePhone.$error"
            class="q-mt-md">

            <div slot="error-label">
              <div v-if="!$v.mobilePhone.required">Il campo è obbligatorio</div>
              <div v-if="!$v.mobilePhone.integer">Non sono ammesse lettere</div>
              <div v-if="!$v.mobilePhone.minLength">Deve essere composto da almeno 9 cifre</div>
              <div v-if="!$v.mobilePhone.maxLength">Deve essere composto da massimo 10 cifre</div>
            </div>
          </csi-input-mobile-phone>

          <csi-buttons class="q-mt-md">
            <csi-button primary label="Avanti" :loading="isSendingOtp" @click="checkStep1() && sendOtp()" />
          </csi-buttons>
        </q-step>

        <!-- Step 2 - Verifica OTP -->
        <q-step title="Verifica">

          <q-alert color="info" class="q-mt-sm">
            <div class="q-body-1">
              <p>
                Abbiamo inviato il codice di verifica al numero <strong>{{mobilePhone |
                mobilePhoneStripPrefix}}</strong>.
              </p>
              Inseriscilo qui sotto per terminare la procedura.
            </div>
          </q-alert>

          <q-slide-transition v-if="hasOtpVerificationError">
            <q-alert color="negative" class="q-mt-md">
              <div class="q-body-1">
                Codice errato, assicurati di aver copiato bene oppure prova a far generare un nuovo codice
              </div>
            </q-alert>
          </q-slide-transition>

          <csi-input-otp
            required
            v-model="confirmCode"
            :expiration-date="otpData.data_scadenza"
            :error="$v.confirmCode.$error || isOtpExpired"
            @expired="isOtpExpired = true"
            @unexpired="isOtpExpired = false">

            <div slot="error-label">
              <div v-if="!$v.confirmCode.required">Il campo è obbligatorio</div>
              <div v-if="!$v.confirmCode.minLength || !$v.confirmCode.maxLength">
                Il codice OTP deve avere esattamente 5 cifre
              </div>
              <div v-if="isOtpExpired">Codice scaduto</div>
            </div>
          </csi-input-otp>

          <csi-buttons class="q-mt-md">
            <csi-button primary label="Conferma" :loading="isVerifyingOtp" @click="checkStep2() && verifyOtp()" />
            <csi-button secondary label="Indietro" @click="$refs.contactMobilePhoneStepper.previous()" />
          </csi-buttons>
        </q-step>

        <!-- STEP 3 - Feedback -->
        <q-step title="Fine">

          <q-alert color="positive" class="q-mt-sm">
            <p class="q-title">
              Verifica completata!
            </p>
            <p>
              Il tuo numero di telefono <strong>{{mobilePhone | mobilePhoneStripPrefix}}</strong> è stato verificato!
            </p>
          </q-alert>

          <csi-buttons class="q-mt-md">
            <csi-button primary label="Fine" v-close-overlay />
          </csi-buttons>
        </q-step>

      </csi-stepper>
    </div>

  </q-modal-layout>
</template>

<script>
  import {required, integer, maxLength, minLength} from 'vuelidate/lib/validators';
  import {sendOtp, verifyOtp, getOtpSmsAttemptsLeft} from "@services/api/bff";
  import CsiInputOtp from "../forms/CsiInputOtp";
  import CsiInputMobilePhone from "../forms/CsiInputMobilePhone";

  export default {
    name: 'CsiContactMobilePhoneModal',
    components: {CsiInputMobilePhone, CsiInputOtp},
    data() {
      return {
        isSendingOtp: false,
        isVerifyingOtp: false,
        mobilePhone: '',
        waitingConfirmCode: false,
        confirmCode: '',
        hasOtpGenerationError: false,
        hasOtpVerificationError: false,
        otpData: {},
        attemptsLeft: undefined,
        isOtpExpired: false,
      }
    },
    validations: {
      // 4 + perché consideriamo anche il prefisso
      mobilePhone: {integer, required, minLength: minLength(4 + 9), maxLength: maxLength(4 + 10)},
      confirmCode: {required, maxLength: maxLength(5), minLength: minLength(5)},
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      }
    },
    methods: {
      checkStep1() {
        this.$v.mobilePhone.$touch();
        return !this.$v.mobilePhone.$error;
      },
      checkStep2() {
        this.$v.confirmCode.$touch();
        return !this.$v.confirmCode.$error;
      },
      async sendOtp() {
        let data = {cf: this.user.cf, canale: 'sms', contatto: this.mobilePhone};
        this.isSendingOtp = true;
        try {
          this.hasOtpGenerationError = false;
          let response = await sendOtp(data);
          this.otpData = response.data;
          this.attemptsLeft = this.otpData.attempts_left;
          this.$refs.contactMobilePhoneStepper.next();
        } catch (e) {
          this.hasOtpGenerationError = true;
        } finally {
          this.isSendingOtp = false;
        }
      },
      async verifyOtp() {
        let params = {cf: this.user.cf, canale: 'sms', codice: this.confirmCode};
        this.isVerifyingOtp = true;
        try {
          this.hasOtpVerificationError = false;
          let response = await verifyOtp({params: params});

          if (response.data === null) {
            // Codice non verificato
            this.hasOtpVerificationError = true;
            return;
          }

          this.$emit('mobile-phone-verified', this.mobilePhone);
          this.$refs.contactMobilePhoneStepper.next();
        } catch (e) {
          this.hasOtpVerificationError = true;
        } finally {
          this.isVerifyingOtp = false;
        }
      }
    },
    async created() {
      let params = {cf: this.user.cf};
      let response = await getOtpSmsAttemptsLeft({params});
      this.attemptsLeft = response.data.attempts_left;
    }
  }
</script>

<style>
</style>
