<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    :value="value"
    no-esc-dismiss
    no-backdrop-dismiss
    :maximized="$q.screen.lt.sm"
    @input="$emit('input', $event)"
  >
    <q-card style="width: 800px">
      <q-toolbar>
        <q-toolbar-title class="q-px-none">Accedi</q-toolbar-title>
        <q-btn v-close-popup flat round icon="close" />
      </q-toolbar>

      <div>
        <q-stepper v-model="step" vertical class="shadow-0">
          <!-- STEP INSERIMENTO DATI -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <q-step :name="STEPS.DATA" title="Inserisci i dati">
            <q-form
              ref="formCredentials"
              greedy
              @submit.prevent="onStepDataNext"
            >
              <template v-if="hasOtpCreationError">
                <q-slide-transition>
                  <q-banner rounded class="bg-red-2 q-mt-md">
                    Si è verificato un errore. <br />
                    Si prega di riprovare.
                  </q-banner>
                </q-slide-transition>
              </template>

              <!-- CODICE FISCALE -->
              <!-- -------------- -->
              <lms-input-tax-code
                required
                v-model="taxCode"
                class="q-mt-md"
                no-error-icon
                lazy-rules="ondemand"
                :rules="[
                  (v) => $r.required(v) || 'Campo obbligatorio',
                  (v) =>
                    $r.lengthIn(v, [
                      TAX_CODE_LENGTH,
                      TAX_CODE_TEMPORARY_LENGTH,
                    ]) ||
                    `Deve avere esattamente ${TAX_CODE_TEMPORARY_LENGTH} o ${TAX_CODE_LENGTH} caratteri`,
                  (v) =>
                    !$r.length(v, TAX_CODE_TEMPORARY_LENGTH) ||
                    $r.numeric(v) ||
                    'Deve essere composto solo da numeri',
                  (v) =>
                    !$r.length(v, TAX_CODE_LENGTH) ||
                    $r.alphaNum(v) ||
                    'Deve essere composto solo da lettere e numeri',
                  (v) =>
                    !$r.length(v, TAX_CODE_LENGTH) ||
                    $r.taxCodeCin(v) ||
                    'Il codice di controllo non è corretto, potrebbero esserci degli errori di battitura',
                ]"
              />

              <!-- TEAM -->
              <!-- ---- -->
              <q-input
                type="text"
                v-model="team"
                label="Numero tessera sanitaria"
                name="team"
                autocomplete="team"
                :maxlength="teamLength"
                counter
                required
                no-error-icon
                lazy-rules="ondemand"
                :rules="[
                  (v) => $r.required(v) || 'Campo obbligatorio',
                  (v) => $r.numeric(v) || 'Deve essere formato solo da numeri',
                  (v) =>
                    $r.length(v, teamLength) ||
                    'Deve essere formato da 20 numeri',
                ]"
              >
                <template #hint>
                  <a
                    href="#"
                    class="lms-link"
                    @click.prevent="showTeamInfoModal"
                  >
                    Come trovo il numero della tessera sanitaria?
                  </a>
                </template>
              </q-input>

              <covid-recaptcha
                ref="recaptcha"
                class="q-mt-lg"
                @token-update="updateCaptchaToken"
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

          <!-- STEP VERIFICA OTP -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <q-step :name="STEPS.OTP" title="Verifica">
            <q-form ref="formOtp" greedy @submit.prevent="onOtpVerifyNext">
              <q-banner rounded class="bg-info q-mt-sm">
                Inserisci il codice ricevuto tramite sms. <br />
                Se non ricevi l’sms, si è verificata una delle seguenti
                condizioni: non sei un assistito della Regione Piemonte, non sei
                inserito nel percorso diagnostico per Covid-19, il tuo numero di
                cellulare non è stato precedentemente certificato, hai già
                effettuato i 3 accessi al giorno o la corrispondenza tra codice
                fiscale e tessera sanitaria inseriti non è corretta.
              </q-banner>

              <q-slide-transition v-if="hasVerificationError">
                <q-banner rounded class="bg-red-2 q-mt-md">
                  Codice non corretto
                </q-banner>
              </q-slide-transition>

              <!-- OTP -->
              <!-- --- -->
              <q-input
                type="text"
                v-model="otpCode"
                label="Codice di conferma"
                required
                no-error-icon
                lazy-rules="ondemand"
                :rules="[(v) => $r.required(v) || 'Campo obbligatorio']"
              />

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
          <q-step :name="STEPS.FEEDBACK" title="Fine">
            <q-banner rounded class="bg-green-2 q-mt-sm">
              Autenticazione avvenuta con successo, clicca su prosegui per
              accedere al servizio
            </q-banner>

            <lms-buttons class="q-mt-md">
              <lms-button primary label="Prosegui" @click="onSuccess" />
            </lms-buttons>
          </q-step>
        </q-stepper>
      </div>
    </q-card>

    <!-- DOVE TROVO CODICE TEAM -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-dialog
      v-model="isTeamInfoModalVisible"
      :content-css="{ maxWidth: '800px' }"
    >
      <q-card footer-class="shadow-0" header-class="no-shadow">
        <q-toolbar slot="header" color="transparent" text-color="black">
          <q-toolbar-title
            >Come trovo il numero della tessera sanitaria?</q-toolbar-title
          >
          <q-btn round flat icon="close" v-close-overlay />
        </q-toolbar>

        <div class="q-pa-md text-center">
          <img
            src="statics/la-mia-salute/immagini/dove-trovo-team.jpg"
            alt="Numero tessera sanitaria"
            class="responsive"
          />
        </div>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script>
import { LENGTH, TEMPORARY_LENGTH } from "../services/tax-code";
import LmsInputTaxCode from "./core/LmsInputTaxCode";
import CovidRecaptcha from "./CovidRecaptcha";
import { createOtp, verifyOtp } from "../services/api";

const STEPS = {
  DATA: 1,
  OTP: 2,
  FEEDBACK: 3,
};

export default {
  name: "CovidLoginOtpDialog",
  components: {
    CovidRecaptcha,
    LmsInputTaxCode,
  },
  props: {
    value: { type: Boolean, required: false, default: false },
  },
  data() {
    return {
      TAX_CODE_LENGTH: LENGTH,
      TAX_CODE_TEMPORARY_LENGTH: TEMPORARY_LENGTH,
      STEPS,
      step: STEPS.DATA,
      teamLength: 20,
      isSendingOtp: false,
      isVerifyingOtp: false,
      isTeamInfoModalVisible: false,
      taxCode: "",
      team: "",
      otpCode: "",
      isOtpExpired: false,
      hasOtpCreationError: null,
      hasVerificationError: null,
      captchaToken: null,
    };
  },
  computed: {
    teamWithPrefix() {
      return this.team;
    },
  },
  created() {},
  methods: {
    showTeamInfoModal() {
      this.isTeamInfoModalVisible = true;
    },
    updateCaptchaToken(token) {
      this.captchaToken = token;
    },
    onStepBack() {
      this.step -= 1;
    },
    async onStepDataNext() {
      let isValid = this.$refs.formCredentials.validate();
      if (!isValid) return;

      // controlliamo che l'utente non sia un robot
      if (!this.captchaToken) {
        this.$q.notify({
          color: "negative",
          message: "Dimostra di non essere un robot",
        });
        return;
      }

      let params = { captcha_token: this.captchaToken };
      let httpConfig = { params };

      let payload = {
        codiceFiscale: this.taxCode,
        codiceTesseraTeam: this.teamWithPrefix,
      };

      this.isSendingOtp = true;

      try {
        let { data } = await createOtp(payload, httpConfig);
        this.step += 1;
      } catch (err) {
        this.hasOtpCreationError = true;
      }

      // Al termine effettuiamo il reset del captcha
      // indipendentemente dall'esito della ricerca
      this.$refs.recaptcha.reset();

      this.isSendingOtp = false;
    },
    async onOtpVerifyNext() {
      let isValid = this.$refs.formOtp.validate();
      if (!isValid) return;

      let payload = {
        codiceFiscale: this.taxCode,
        codiceTesseraTeam: this.teamWithPrefix,
        codiceOtp: this.otpCode,
      };

      this.isVerifyingOtp = true;

      try {
        let { data } = await verifyOtp(payload);
        this.step += 1;
      } catch (err) {
        this.hasVerificationError = true;
      }

      this.isVerifyingOtp = false;
    },
    onSuccess() {
      this.$emit("success");
      // this.$emit("input", false);
    },
  },
};
</script>

<style scoped lang="scss"></style>
