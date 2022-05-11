<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog v-bind="attrs" v-on="listeners" :maximized="$q.screen.lt.md">
    <q-card style="width: 800px; max-width: 800px;">
      <q-card-section class="no-padding">
        <q-toolbar>
          <q-toolbar-title>
            Inserisci numero di telefono mobile
          </q-toolbar-title>

          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>
      </q-card-section>

      <q-card-section class="no-padding">
        <lms-stepper v-model="step" flat alternative-labels animated vertical>
          <!-- STEP NUMERO TELEFONO -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <q-step
            :name="STEP_MAP.PHONE_NUMBER"
            title="Numero telefono"
            :done="step > STEP_MAP.PHONE_NUMBER"
            done-color="green-8"
          >
            <q-form
              ref="formPhoneNumber"
              greedy
              novalidate
              @submit="onStepPhoneNumberNext"
            >
              <q-banner  class="q-banner--info q-mt-md">
                <div class="text-body1">
                  <p class="q-mb-none">
                    Riceverai un codice via SMS per confermare il numero di
                    telefono mobile che hai inserito.
                  </p>

                  <template v-if="attemptsLeft !== undefined">
                    <p class="q-mt-md q-mb-none text-caption">
                      Hai a disposizione
                      <strong>
                        {{
                          attemptsLeft === 1
                            ? `1 tentatitvo`
                            : `${attemptsLeft} tentativi`
                        }}
                      </strong>
                    </p>
                  </template>
                </div>
              </q-banner>

              <q-slide-transition>
                <template
                  v-if="attemptsLeft !== undefined && attemptsLeft <= 0"
                >
                  <q-banner  class="q-banner--negative q-mt-md">
                    <div class="text-body1">
                      Per oggi non puoi più ricevre il codice via SMS, puoi
                      riprovare domani.
                    </div>
                  </q-banner>
                </template>
              </q-slide-transition>

              <q-slide-transition>
                <template v-if="hasOtpGenerationError">
                  <q-banner class="q-banner--negative q-mt-md">
                    <div class="text-body1">
                      Si è verificato un errore durante la generazione del
                      codice OTP, riprova.
                    </div>
                  </q-banner>
                </template>
              </q-slide-transition>

              <q-input
                v-model="mobilePhone"
                type="tel"
                label="Telefono mobile"
                required
                bottom-slots
                no-error-icon
                lazy-rules=""
                prefix="+39"
                :rules="[ruleRequired, ruleNumeric, ruleMinLength, ruleMaxLength]"
                class="q-mt-md"
              />

              <lms-buttons class="q-mt-md">
                <lms-button
                  type="submit"
                  label="Avanti"
                  :loading="isSendingOtp"
                />
              </lms-buttons>
            </q-form>
          </q-step>

          <!-- STEP OTP -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <q-step
            :name="STEP_MAP.OTP"
            title="Verifica"
            :done="step > STEP_MAP.OTP"
            done-color="green-8"
          >
            <q-form ref="formOtp" greedy novalidate @submit="onStepOtpNext">
              <q-banner class="q-banner--info q-mt-sm">
                <div class="text-body1">
                  <p>
                    Abbiamo inviato il codice di verifica al numero
                    <span class="text-bold">
                      {{ mobilePhone }}
                    </span>
                    .
                  </p>
                  Inseriscilo qui sotto per terminare la procedura.
                </div>
              </q-banner>

              <q-slide-transition>
                <template v-if="hasOtpVerificationError">
                  <q-banner class="q-banner--negative q-mt-md">
                    <div class="text-body1">
                      Codice errato, assicurati di aver copiato bene oppure
                      prova a far generare un nuovo codice
                    </div>
                  </q-banner>
                </template>
              </q-slide-transition>

              <q-input
                v-model="confirmCode"
                type="number"
                label="Codice di conferma"
                :maxlength="5"
                required
                mask="#####"
                unmasked-value
                no-error-icon
                :rules="[ruleRequired, ruleLength5, rulesNotExpired]"
                reactive-rules
              >
                <template v-if="isCountdownVisible" #hint>
                  <countdown
                    :time="30 * 60 * 1000"
                    class="text-warning text-bold"
                    @end="onOtpExpired"
                  >
                    <template #default="props">
                      Il codice scadrà tra
                      {{ props.minutes }}:{{ props.seconds | padLeft(2, "0") }}
                    </template>
                  </countdown>
                </template>
              </q-input>

              <lms-buttons class="q-mt-md">
                <lms-button
                  type="submit"
                  label="Conferma"
                  :loading="isVerifyingOtp"
                />

                <lms-button outline label="Indietro" @click="onStepBack" />
              </lms-buttons>
            </q-form>
          </q-step>

          <!-- STEP FEEDBACK -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <q-step
            :name="STEP_MAP.FEEDBACK"
            title="Fine"
            :done="step > STEP_MAP.FEEDBACK"
            done-color="green-8"
          >
            <q-banner  class="q-banner--positive q-mt-sm">
              <div class="text-body1">
                <p class="text-bold">
                  Verifica completata!
                </p>

                <p class="q-mb-none">
                  Il tuo numero di telefono
                  <strong>
                    {{ mobilePhone }}
                  </strong>
                  è stato verificato!
                </p>
              </div>
            </q-banner>

            <lms-buttons class="q-mt-md">
              <lms-button v-close-popup label="Fine" />
            </lms-buttons>
          </q-step>
        </lms-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { sendOtp, verifyOtp, getOtpSmsAttemptsLeft } from "../services/api";
import { apiErrorNotify, MOBILE_PHONE_PREFIX_ITALY } from "../services/utils";
import LmsStepper from "./core/LmsStepper";
import Countdown from "@chenfengyuan/vue-countdown";

const STEP_MAP = {
  PHONE_NUMBER: 1,
  OTP: 2,
  FEEDBACK: 3
};

const MIN_LENGTH= 9;
const MAX_LENGTH= 10;

export default {
  name: "AccountMobilePhoneModal",
  inheritAttrs: false,
  components: { LmsStepper, Countdown },
  data() {
    return {
      MOBILE_PHONE_PREFIX_ITALY,
      STEP_MAP,
      step: STEP_MAP.PHONE_NUMBER,
      isSendingOtp: false,
      isVerifyingOtp: false,
      mobilePhone: "",
      waitingConfirmCode: false,
      confirmCode: "",
      hasOtpGenerationError: false,
      hasOtpVerificationError: false,
      otpData: {},
      attemptsLeft: undefined,
      isOtpExpired: false,
      isCountdownVisible: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    },
    ruleNumeric() {
      let regex = /^[0-9]*$/;
      return v => regex.test(v) || "Deve contenere solo numeri";
    },
    ruleMinLength(){
        return v=> v?.length>= MIN_LENGTH || "Deve essere composto da almeno 9 cifre"
    },
    ruleMaxLength(){
      return v=> v?.length <= MAX_LENGTH || "Deve essere composto da massimo 10 cifre"
    },
    ruleLength5() {
      return v => v.length === 5 || "Deve avere esattamente 5 cifre";
    },
    rulesNotExpired() {
      return v => !this.isOtpExpired || "Codice scaduto";
    }
  },
  async created() {
    let params = { cf: this.user.cf };

    try {
      let { data } = await getOtpSmsAttemptsLeft({ params });
      this.attemptsLeft = data.attempts_left;
    } catch (error) {
      let message =
        "Non è stato possibile caricare il numero di SMS giornalieri disponibili";
      apiErrorNotify({ error, message });
    }
  },
  methods: {
    onStepNext() {
      this.step += 1;
    },
    onStepBack() {
      this.step -= 1;
    },
    onOtpExpired() {
      this.isOtpExpired = true;
      this.isCountdownVisible = false;
    },
    async onStepPhoneNumberNext() {
      let isValid = await this.$refs.formPhoneNumber.validate();
      if (!isValid) return;

      let payload = {
        cf: this.user.cf,
        canale: "sms",
        contatto: MOBILE_PHONE_PREFIX_ITALY + this.mobilePhone
      };

      this.isSendingOtp = true;
      this.hasOtpGenerationError = false;
      this.isCountdownVisible = false;

      try {
        let { data } = await sendOtp(payload);
        this.otpData = data;
        this.attemptsLeft = this.otpData.attempts_left;
        this.isOtpExpired = false;
        this.isCountdownVisible = true;
        this.onStepNext();
      } catch (error) {
        this.hasOtpGenerationError = true;
      }

      this.isSendingOtp = false;
    },
    async onStepOtpNext() {
      let isValid = await this.$refs.formOtp.validate();
      if (!isValid) return;

      let params = {
        cf: this.user.cf,
        canale: "sms",
        codice: this.confirmCode
      };

      this.isVerifyingOtp = true;
      this.hasOtpVerificationError = false;

      try {
        let { data } = await verifyOtp({ params });

        if (data === null) {
          // Codice non verificato
          this.hasOtpVerificationError = true;
          return;
        }

        this.$emit("mobile-phone-verified", MOBILE_PHONE_PREFIX_ITALY + this.mobilePhone);
        this.onStepNext();
      } catch (error) {
        this.hasOtpVerificationError = true;
      }

      this.isVerifyingOtp = false;
    }
  }
};
</script>

<style lang="sass"></style>
