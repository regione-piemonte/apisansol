<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog v-bind="attrs" v-on="listeners" :maximized="$q.screen.lt.md">
    <q-card style="width: 800px; max-width: 800px;">
      <q-card-section class="q-py-sm q-pr-none">
        <q-toolbar>
          <q-toolbar-title>
            Inserisci email
          </q-toolbar-title>
          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>
      </q-card-section>

      <q-card-section class="no-padding">
        <lms-stepper v-model="step" flat alternative-labels animated vertical>
          <!-- STEP EMAIL -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <q-step
            :name="STEP_MAP.EMAIL"
            title="Email"
            :done="step > STEP_MAP.EMAIL"
            done-color="green-8"
            :prefix="STEP_MAP.EMAIL"
          >
            <q-form ref="formEmail" greedy novalidate @submit="onStepEmailNext">
              <q-banner  class="q-banner--info q-mt-md">
                <div class="text-body1">
                  Riceverai una email per confermare l'indirizzo che hai
                  inserito.
                </div>
              </q-banner>

              <q-slide-transition v-if="hasOtpCreationError">
                <q-banner  class="q-banner--negative q-mt-md">
                  <div class="text-body1">
                    Si è verificato un errore durante la creazione del codice
                    OTP, riprova.
                  </div>
                </q-banner>
              </q-slide-transition>

                <q-input
                  v-model="email"
                  type="email"
                  label="Email"
                  required
                  no-error-icon
                  bottom-slots
                  :rules="[ruleRequired, ruleMail]"
                  name="email"
                  autocomplete="email"
                  class="q-mt-md"
                />

                <q-input
                  v-model="verifyEmail"
                  type="email"
                  label="Ripeti Email"
                  required
                  no-error-icon
                  :rules="[ruleRequired,ruleMail, ruleMailEquals]"
                  reactive-rules
                  name="email"
                  autocomplete="email"
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
            :prefix="STEP_MAP.OTP"
          >
            <q-form ref="formOtp" greedy novalidate @submit="onStepOtpNext">
              <q-banner  class="q-banner--info q-mt-sm">
                <div class="text-body1">
                  <p>
                    Abbiamo inviato il codice di verifica all'indirizzo
                    <strong>{{ email }}</strong>
                    .
                  </p>

                  <p class="q-mb-none">
                    Inseriscilo qui sotto per terminare la procedura.
                  </p>
                </div>
              </q-banner>

              <q-slide-transition v-if="hasVerificationError">
                <q-banner class="q-banner--negative q-mt-md">
                  <div class="text-body1">
                    Codice errato, assicurati di aver copiato bene oppure prova
                    a far generare un nuovo codice
                  </div>
                </q-banner>
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
                :rules="[rulesNotExpired, ruleRequired, ruleLength5]"
                reactive-rules
                class="q-mt-md"
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
            :prefix="STEP_MAP.FEEDBACK"
          >
            <q-banner class="q-banner--positive q-mt-sm">
              <div class="text-body1">
                <p class="text-bold">
                  Verifica completata!
                </p>

                <p class="q-mb-none">
                  Il tuo indirizzo <strong>{{ email }}</strong> è stato
                  verificato!
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
import { sendOtp, verifyOtp } from "../services/api";
import LmsStepper from "./core/LmsStepper";
import Countdown from "@chenfengyuan/vue-countdown";

const EMAIL_REGEX = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/;

const STEP_MAP = {
  EMAIL: 1,
  OTP: 2,
  FEEDBACK: 3
};

export default {
  name: "VacEmailDialog",
  inheritAttrs: false,
  components: { LmsStepper, Countdown },
  data() {
    return {
      STEP_MAP,
      step: STEP_MAP.EMAIL,
      isSendingOtp: false,
      isVerifyingOtp: false,
      hasOtpCreationError: false,
      hasVerificationError: false,
      email: "",
      verifyEmail: "",
      waitingConfirmCode: false,
      confirmCode: "",
      otpData: {},
      isOtpExpired: false,
      verifyError: false,
      isCountdownVisible: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    cf() {
      return this.$store.getters["getTaxCode"];
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
    ruleMail() {
      return v => EMAIL_REGEX.test(v) || "Deve essere un'email";
    },
    ruleMailEquals() {
      return v =>
        this.email === this.verifyEmail || "Deve essere uguale all'email";
    },
    ruleNumeric() {
      let regex = /^[0-9]*$/;
      return v => regex.test(v) || "Deve contenere solo numeri";
    },
    ruleLength5() {
      return v => v.length === 5 || "Deve avere esattamente 5 cifre";
    },
    rulesNotExpired() {
      return v => {
        return !this.isOtpExpired || "Codice scaduto";
      };
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
    async onStepEmailNext() {
      let isValid = await this.$refs.formEmail.validate();
      if (!isValid) return;

      let payload = {
        cf: this.cf,
        canale: "email",
        contatto: this.email
      };

      this.isSendingOtp = true;
      this.hasOtpCreationError = false;
      this.isCountdownVisible = false;

      try {
        let { data } = await sendOtp(payload);
        this.otpData = data;
        this.isOtpExpired = false;
        this.isCountdownVisible = true;
        this.onStepNext();
      } catch (error) {
        this.hasOtpCreationError = true;
      }

      this.isSendingOtp = false;
    },
    async onStepOtpNext() {
      let isValid = await this.$refs.formOtp.validate();
      if (!isValid) return;

      let params = {
        cf: this.cf,
        canale: "email",
        codice: this.confirmCode
      };

      this.isVerifyingOtp = true;
      this.hasVerificationError = false;

      try {
        let { data } = await verifyOtp({ params });

        if (data === null) {
          // Codice non verificato
          this.hasVerificationError = true;
          return;
        }

        this.$emit("email-verified", this.email);
        this.onStepNext();
      } catch (error) {
        this.hasVerificationError = true;
      }

      this.isVerifyingOtp = false;
    }
  }
};
</script>

<style lang="sass"></style>
