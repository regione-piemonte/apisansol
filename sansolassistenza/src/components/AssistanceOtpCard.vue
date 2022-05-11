<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <q-card class="q-mt-lg q-mx-auto" style="max-width: 800px" v-if="!emailVerified">
        <q-card-section>
          <q-banner class="h-banner h-banner--info q-pa-md">
            <div class="text-body1  ">
              Abbiamo inviato il codice di verifica all'indirizzo <strong>{{ email }}</strong>. <br>
              Inseriscilo qui sotto per terminare la procedura.
            </div>
          </q-banner>


        </q-card-section>
        <q-form greedy ref="otpForm"  @submit="checkOtp">
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
                  Il codice scadrà tra {{countdownMixin_minutesLeft}}:{{countdownMixin_secondsLeft}}
                </div>

              </template>
            </q-input>
          </q-card-section>
          <q-card-section>
            <q-card-actions align="right">
              <lms-buttons>
                <lms-button label="Conferma" :loading="isVerifyingOtp" type="submit"/>

                <lms-button label="Annulla" outline @click="resetRequest"/>
              </lms-buttons>
            </q-card-actions>
          </q-card-section>
        </q-form>
        <q-card-section>
          <q-slide-transition v-if="hasVerificationError">
            <q-banner class="h-banner--negative h-banner q-mt-md">
              <div class="q-body-1">
                Codice errato, assicurati di aver copiato bene oppure prova a far generare un nuovo codice
              </div>
            </q-banner>
          </q-slide-transition>
        </q-card-section>
    </q-card>
    <div class="" v-else>
        <q-banner class="h-banner h-banner--positive q-pa-md q-my-lg">
          <p class="text-h2  ">
            Verifica completata!
          </p>
          <p>
            Il tuo indirizzo <strong>{{email}}</strong> è stato verificato!
          </p>
        </q-banner>
        <lms-buttons>
          <lms-button label="Invia richiesta" :loading="isLoadingRequest" @click="sendRequest"/>
        </lms-buttons>

    </div>
  </div>

</template>

<script>
import {sendOtp, verifyOtp} from "src/services/api";
import {countdownMixin} from "src/services/countdownMixin";

export default {
  name: "AssistanceOtpCard",
  mixins: [countdownMixin],
  props: {
    email: {type: String, required:true, default: ''},
    otpData: {type: Object, required:false, default: null},
    taxCode:{type: String, required:true, default: ''},
    requestErr:{type:Boolean, default:false},

  },
  data() {
    return {
      confirmCode: '',
      emailVerified:false,
      isVerifyingOtp:false,
      hasVerificationError:false,
      isLoadingRequest:false
    }
  },
  mounted() {
      if(this.expirationOtpDate)
        this.countdownMixin_start(this.expirationOtpDate);
  },
  computed:{
    expirationOtpDate(){
      return this.otpData?.data_scadenza
    },
    isOtpExpired() {
      return this.countdownMixin_isStarted && this.countdownMixin_isExpired;
    },
    ruleRequired() {
      return v => this.$rules.required(v)  || "Campo obbligatorio";
    },
    rulesLength(){
      return v => this.$rules.length(v, 5)  || "  Il codice OTP deve avere esattamente 5 cifre";
    },
    ruleExpired(){
      return v =>  !this.isOtpExpired || "il codice OTP è scaduto";
    },
    isExpired(){
      return this.ruleExpired
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
        this.emailVerified=true

      } catch (e) {
        this.hasVerificationError = true;
      } finally {
        this.isVerifyingOtp = false;
      }
    },
    resetRequest(){
      this.$emit('reset-request', true)
    },
    sendRequest(){
      this.isLoadingRequest = true
      this.$emit('send-request', true);
    }
  },
}
</script>

<style lang="sass">
.assistance-opt-input
  .q-field__bottom--animated

</style>
