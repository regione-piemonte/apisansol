<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-btn flat round :icon="visibilityIcon">
    <q-menu style="min-width: 180px; max-width: 300px">
      <div class="q-pa-md">
        <q-toggle
          :value="isVisible"
          @input="showConfirmDialog"
          label="Consenti la consultazione dei tuoi documenti da parte degli operatori sanitari"
        />
      </div>
    </q-menu>

    <q-tooltip>Visibilità</q-tooltip>

    <!-- MODAL DI CONFERMA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-dialog
      minimized
      class="q-pb-xl transparent"
      v-model="isConfirmDialogOpen"
      :content-css="{ maxWidth: '800px' }"
    >
      <!--      <template v-if="isEnrolled">-->
      <q-card class="q-pa-md">
        <div>
          <template v-if="isVisible">
            Vuoi negare il consenso alla visualizzazione da parte degli
            operatori sanitari?
          </template>
          <template v-else>
            Confermi il consenso alla visualizzazione da parte degli operatori
            sanitari?
          </template>
        </div>

        <lms-buttons class="q-mt-md">
          <template v-if="isVisible">
            <lms-button
              label="Nega consenso"
              color="negative"
              outline
              :loading="isEnrollmentConsentUpdating"
              @click="onEnrollmentConsentUpdate"
            />
          </template>

          <template v-else>
            <lms-button
              label="Conferma"
              primary
              :loading="isEnrollmentConsentUpdating"
              @click="onEnrollmentConsentUpdate"
            />
          </template>

          <lms-button label="Annulla" outline @click="closeConfirmDialog" />
        </lms-buttons>
      </q-card>
      <!--      </template>-->

      <!--      <template v-else>-->
      <!--        <template v-if="user && isEnrollable">-->
      <!--          <lms-enrollment-banner-->
      <!--            :activable="isEnrollable"-->
      <!--            @click-activate="onActivate"-->
      <!--          />-->
      <!--        </template>-->

      <!--        <template v-else>-->
      <!--          <q-card class="q-pa-md">-->
      <!--            <template v-if="isEnrollable">-->
      <!--              <q-banner rounded class="bg-blue-2 q-pb-lg q-pt-sm">-->
      <!--                <div>-->
      <!--                  Apri il Fascicolo Sanitario Elettronico la consultazione da-->
      <!--                  parte degli Operatori Sanitari-->
      <!--                </div>-->
      <!--              </q-banner>-->

      <!--              <lms-buttons>-->
      <!--                <lms-button v-close-popup primary @click="onActivate">-->
      <!--                  Attiva il Fascicolo Sanitario-->
      <!--                </lms-button>-->
      <!--              </lms-buttons>-->
      <!--            </template>-->

      <!--            <template v-else>-->
      <!--              <q-banner class="bg-orange-2 q-pb-lg q-pt-sm">-->
      <!--                <div>-->
      <!--                  Per consentire la consultazione da parte degli Operatori-->
      <!--                  Sanitari, occorre avere aperto il Fascicolo Sanitario-->
      <!--                  Elettronico-->
      <!--                </div>-->
      <!--              </q-banner>-->

      <!--              <lms-buttons>-->
      <!--                <lms-button-->
      <!--                  v-close-popup-->
      <!--                  label="Ok"-->
      <!--                  secondary-->
      <!--                  @click="visibility = false"-->
      <!--                />-->
      <!--              </lms-buttons>-->
      <!--            </template>-->
      <!--          </q-card>-->
      <!--        </template>-->
      <!--      </template>-->
    </q-dialog>
  </q-btn>
</template>

<script>
import { extend } from "quasar";
import { updateEnrollmentConsent } from "../services/api";
import { apiErrorNotifyDialog, notifySuccess } from "../services/utils";

export default {
  name: "FseEnrollmentConsentChangeButton",
  props: {},
  data() {
    return {
      isEnrollmentConsentUpdating: false,
      isConfirmDialogOpen: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    // userInfo() {
    //   return this.$store.getters["getUserInfo"];
    // },
    enrollmentInfo() {
      return this.$store.getters["getEnrollmentInfo"];
    },
    enrollmentConsent() {
      return this.$store.getters["getEnrollmentConsent"];
    },
    delegatorSelected() {
      return this.$store.getters["getDelegatorSelected"];
    },
    isEnrolled() {
      return this.$store.getters["isEnrolled"];
    },
    isEnrollable() {
      return this.$store.getters["isEnrollable"];
    },
    isVisible() {
      return this.enrollmentConsent?.consenso_consultazione;
    },
    visibilityIcon() {
      return this.isVisible ? "far fa-eye" : "far fa-eye-slash";
    }
  },
  created() {},
  methods: {
    showConfirmDialog() {
      this.isConfirmDialogOpen = true;
    },
    closeConfirmDialog() {
      this.isConfirmDialogOpen = false;
    },
    async onEnrollmentConsentUpdate() {
      let taxCode = this.$store.getters["getTaxCode"];

      let params = { servizio: "FSEDOC" };

      let payload = extend(true, {}, this.enrollmentConsent);
      payload.consenso_consultazione = !this.isVisible;

      this.isEnrollmentConsentUpdating = true;

      try {
        let { data } = await updateEnrollmentConsent(taxCode, payload, {
          params
        });
        await this.$store.dispatch("setEnrollmentConsent", {
          enrollmentConsent: data
        });

        notifySuccess("Visibilità modificata");
        this.isConfirmDialogOpen = false;
      } catch (error) {
        let message = "Non è stato possibile modificare la visibilità";
        apiErrorNotifyDialog({ error, message });
      }

      this.isEnrollmentConsentUpdating = false;
    }
  }
};
</script>

<style scoped lang="sass"></style>
