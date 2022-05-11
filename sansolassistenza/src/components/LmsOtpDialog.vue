<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog v-bind="attrs" v-on="listeners" :maximized="$q.screen.lt.sm">
    <q-card
      class="lms-otp-dialog"
      style="max-width: 800px"
    >
      <q-toolbar>
        <q-toolbar-title>
          Verifica email
        </q-toolbar-title>

        <q-btn v-close-popup flat round dense icon="close"/>
      </q-toolbar>
      <q-card-section>
        <template v-if="!emailVerified">
          <q-banner class="h-banner h-banner--info q-pa-md">
            <div class="text-body1  ">
              Abbiamo inviato il codice di verifica all'indirizzo <strong>{{ email }}</strong>. <br>
              Inseriscilo qui sotto per terminare la procedura.
            </div>
          </q-banner>
          <q-form greedy ref="otpForm" @submit="checkOtp">
            <q-card-section>
              <q-input
                class="assistance-opt-input"
                v-model="confirmCode"
                type="text"
                label="Codice di conferma"
                :maxlength="5"
                reactive-rules
                no-error-icon
                :rules="[ruleExpired, ruleRequired, rulesLength]"
              >
                <template v-slot:hint>
                  <div class="text-negative" v-if="isOtpExpired">
                    Il codice OTP è scaduto
                  </div>
                  <div v-else>
                   <span v-if="countdownMixin_difference"> Il codice scadrà tra {{ countdownMixin_minutesLeft }}:{{ countdownMixin_secondsLeft }}</span>
                  </div>

                </template>
              </q-input>
            </q-card-section>
            <q-card-section>
              <q-card-actions align="right">
                <lms-buttons>
                  <lms-button label="Conferma" :loading="isVerifyingOtp" type="submit"/>
<!--                  <lms-button label="Annulla" v-close-popup outline @click="resetRequest"/>-->
                  <lms-button label="Genera nuovo codice" :loading="isGeneratingOtp" type="reset" outline @click="generateNewCode"/>
                </lms-buttons>
              </q-card-actions>
              <template v-if="isNewCode">
                <q-banner class="h-banner h-banner--positive q-mt-md" v-if="otpData ">
                  <div class="text-body1">
                    Codice di verifica inviato con successo.
                  </div>
                </q-banner>
                <q-banner class="h-banner h-banner--negative q-mt-md" v-if="otpError">
                  <div class="text-body1">
                    Si è verificato un errore durante la creazione del codice OTP, riprova.
                  </div>
                </q-banner>
              </template>
            </q-card-section>
          </q-form>
          <q-slide-transition v-if="hasVerificationError">
            <q-banner class="h-banner--negative h-banner q-mt-md">
              <div class="q-body-1">
                Codice errato, assicurati di aver copiato bene oppure prova a far generare un nuovo codice
              </div>
            </q-banner>
          </q-slide-transition>
        </template>
        <template class="" v-else-if="requestFeedback && requestFeedback.error">

          <q-banner class="q-pa-md q-mb-lg h-banner h-banner--warning">
            A causa di un problema interno non è stato possibile inviare la richiesta. <br>
            Puoi effettuare un nuovo tentativo. Se il problema persiste riprova più tardi.
          </q-banner>

          <lms-buttons>
            <lms-button @click="resetRequest">OK</lms-button>
          </lms-buttons>

        </template>
        <template v-else>

          <q-banner class="h-banner h-banner--positive q-pa-md q-mb-lg">
            <p class="text-h2  ">
              Verifica completata!
            </p>
            <p>
              Il tuo indirizzo <strong>{{ email }}</strong> è stato verificato!
            </p>
            <p>Per completare la procedura premi <strong>INVIA RICHIESTA</strong></p>
          </q-banner>
          <lms-buttons>
            <lms-button label="Invia richiesta" :loading="isLoadingRequest" @click="sendRequest"/>
          </lms-buttons>

        </template>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script>
import {countdownMixin} from "src/services/countdownMixin";
import {verifyOtp} from "src/services/api";

export default {
  name: "LmsOtpDialog",
  mixins: [countdownMixin],
  props: {
    email: {type: String, default: ''},
    otpData: {type: Object, default: null},
    taxCode: {type: String, default: ''},
    otpError:{type:Boolean,default:false},
    requestFeedback: {type: Object, default: null},
  },
  data() {
    return {
      confirmCode: '',
      emailVerified: false,
      isVerifyingOtp: false,
      hasVerificationError: false,
      isLoadingRequest: false,
      isNewCode:false
    }
  },
  watch: {
    expirationOtpDate: {
      immediate: true,
      handler(val, oldVal) {
        if (val)
          this.countdownMixin_start(val);
      }
    },
    requestFeedback: {
      immediate: true,
      deep: true,
      handler(val, oldVal) {
        this.onSentRequest(val);
      }
    }
  },

  computed: {
    attrs() {
      const {...attrs} = this.$attrs;
      return attrs;
    },
    listeners() {
      const {...listeners} = this.$listeners;
      return listeners;
    },
    expirationOtpDate() {
      return this.otpData?.data_scadenza
    },
    isOtpExpired() {
      return this.countdownMixin_isStarted && this.countdownMixin_isExpired;
    },
    ruleRequired() {
      return v => this.$rules.required(v) || "Campo obbligatorio";
    },
    rulesLength() {
      return v => this.$rules.length(v, 5) || "  Il codice OTP deve avere esattamente 5 cifre";
    },
    ruleExpired() {
      return v => !this.isOtpExpired || "il codice OTP è scaduto";
    },
    isExpired() {
      return this.ruleExpired
    },
    isGeneratingOtp(){
      return !this.otpData && !this.otpError
    }
  },
  methods: {
    onInput(newValue) {
      this.confirmCode = newValue;
      this.$emit('input', newValue);
    },
    countdownMixin_start(to) {
      this.countdownMixin_startDate = new Date();
      this.countdownMixin_now = new Date();
      this.countdownMixin_endDate = to;
      this.countdownMixin_nowInterval = setInterval(() => {
        this.countdownMixin_now = new Date();
      }, 1000);
    },

    async checkOtp() {
      let params = {cf: this.taxCode, canale: 'email', codice: this.confirmCode};
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
        this.emailVerified = true

      } catch (e) {
        this.hasVerificationError = true;
      } finally {
        this.isVerifyingOtp = false;
      }
    },
    resetRequest() {
      this.$emit('reset-request')
    },
    sendRequest() {
      this.isLoadingRequest = true
      console.log('invio')
      this.$emit('send-request', true);
    },
    onSentRequest(val) {
      if (val?.success) {
        this.isLoadingRequest = false
      }

      if (val?.error)
        this.isLoadingRequest = false
    },
    generateNewCode(){
      this.isNewCode =false
      this.$emit('generate-otp', true);
      this.isNewCode=true
    }
  },
}
</script>

<style scoped>

</style>
