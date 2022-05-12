<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>

  <q-modal-layout footer-class="shadow-0">
    <q-toolbar slot="header">
      <q-toolbar-title>Inserisci email</q-toolbar-title>
      <q-btn flat round icon="close" v-close-overlay></q-btn>
    </q-toolbar>

    <div class="q-pa-md">

      <csi-stepper ref="contactEmailStepper" vertical class="shadow-0">

        <!-- STEP 1 - Inserimento email -->
        <q-step default title="Email">

          <q-alert color="info" class="q-mt-md">
            <div class="q-body-1">
              Riceverai una email per confermare l'indirizzo che hai inserito.
            </div>
          </q-alert>

          <q-slide-transition v-if="hasOtpCreationError">
            <q-alert color="negative" class="q-mt-md">
              <div class="q-body-1">
                Si è verificato un errore durante la creazione del codice OTP, riprova.
              </div>
            </q-alert>
          </q-slide-transition>

          <q-field
            required
            class="q-mt-md"
            :error="$v.email.$error"
            error-label="Inserisci un'email valida">
            <q-input
              v-model="email"
              type="email"
              float-label="Email">
            </q-input>
          </q-field>

          <q-field
            required
            class="q-mt-md"
            :error="verifyError"
            error-label="Deve essere uguale all'email">
            <q-input
              v-model="verifyEmail"
              type="email"
              float-label=" Ripeti Email">
            </q-input>
          </q-field>

          <csi-buttons class="q-mt-md">
            <csi-button primary label="Avanti" :loading="isSendingOtp" @click="checkEmail() && sendOtp()" />
          </csi-buttons>
        </q-step>

        <!-- Step 2 - Verifica OTP -->
        <q-step title="Verifica">

          <q-alert color="info" class="q-mt-sm">
            <div class="q-body-1">
              <p>
                Abbiamo inviato il codice di verifica all'indirizzo <strong>{{email}}</strong>.
              </p>
              Inseriscilo qui sotto per terminare la procedura.
            </div>
          </q-alert>

          <q-slide-transition v-if="hasVerificationError">
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
            @unexpired="isOtpExpired = false"
            class="q-mt-md">

            <div slot="error-label">
              <div v-if="!$v.confirmCode.required">Il campo è obbligatorio</div>
              <div v-if="!$v.confirmCode.minLength || !$v.confirmCode.maxLength">
                Il codice OTP deve avere esattamente 5 cifre
              </div>
              <div v-if="isOtpExpired">Codice scaduto</div>
            </div>
          </csi-input-otp>

          <csi-buttons class="q-mt-md">
            <csi-button primary label="Conferma" :loading="isVerifyingOtp" @click="checkOtp() && verifyOtp()" />
            <csi-button secondary label="Indietro" @click="$refs.contactEmailStepper.previous()" />
          </csi-buttons>
        </q-step>


        <!-- STEP 3 - Feedback -->
        <q-step title="Fine">

          <q-alert color="positive" class="q-mt-sm">
            <p class="q-title">
              Verifica completata!
            </p>
            <p>
              Il tuo indirizzo <strong>{{email}}</strong> è stato verificato!
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
  import {required, email, maxLength, minLength} from 'vuelidate/lib/validators';
  import {sendOtp, verifyOtp} from "@services/api/bff";
  import CsiInputOtp from "../forms/CsiInputOtp";

  export default {
    name: 'CsiContactEmailModal',
    components: {CsiInputOtp},
    data() {
      return {
        isSendingOtp: false,
        isVerifyingOtp: false,
        hasOtpCreationError: false,
        hasVerificationError: false,
        email: '',
        verifyEmail: '',
        waitingConfirmCode: false,
        confirmCode: '',
        otpData: {},
        isOtpExpired: false,
        verifyError: false
      }
    },
    validations: {
      email: {required, email},
      confirmCode: {required, maxLength: maxLength(5), minLength: minLength(5)},
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
    },
    methods: {
      checkEmail() {
        this.$v.email.$touch();
        if (this.email === this.verifyEmail)
          return !this.$v.email.$error;
        else
          this.verifyError = true;
      },
      checkOtp() {
        this.$v.confirmCode.$touch();
        return !this.$v.confirmCode.$error;
      },
      async sendOtp() {
        this.verifyError = false
        let data = {cf: this.user.cf, canale: 'email', contatto: this.email};
          console.log(data)
        this.isSendingOtp = true;
        try {
          this.hasOtpCreationError = false;
          let response = await sendOtp(data);
          this.otpData = response.data;
          this.$refs.contactEmailStepper.next();
        } catch (e) {
          this.hasOtpCreationError = true;
        } finally {
          this.isSendingOtp = false;
        }
      },
      async verifyOtp() {

        let params = {cf: this.user.cf, canale: 'email', codice: this.confirmCode};
        this.hasVerificationError = false;
        this.isVerifyingOtp = true;

        try {
          this.hasVerificationError = false;
          let response = await verifyOtp({params: params});

          if (response.data === null) {
            // Codice non verificato
            this.hasVerificationError = true;
            return;
          }

          this.$emit('email-verified', this.email);
          this.$refs.contactEmailStepper.next();
        } catch (e) {
          this.hasVerificationError = true;
        } finally {
          this.isVerifyingOtp = false;
        }
      }
    }
  }
</script>

<style>
</style>
