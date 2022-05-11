<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    ref="modal"
    :value="value"
    :content-css="{ maxWidth: '800px' }"
    :no-esc-dismiss="showFeedback"
    :no-backdrop-dismiss="showFeedback"
    class="rol-report-image-request-dialog"
    @input="$emit('input', $event)"
  >
    <q-card>
      <q-card-section>
        <q-toolbar>
          <q-toolbar-title>Richiedi creazione immagine</q-toolbar-title>

          <template v-if="!showFeedback">
            <q-btn v-close-popup flat round icon="close" />
          </template>
        </q-toolbar>
      </q-card-section>

      <transition
        enter-active-class="animated fadeIn fast"
        leave-active-class="animated fadeOut faster"
        mode="out-in"
      >
        <!-- FORM -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <div v-if="!showFeedback" key="form" class="q-pa-md">
          <p>
            Le immagini saranno disponibili appena concluse le elaborazioni
            necessarie. I tempi di attesa potranno variare in base al numero di
            immagini e alla loro dimensione. <br />
            Se inserisci un’e-mail ti contatteremo quando saranno pronte.
          </p>

          <q-form @submit.prevent="onSubmit" class="q-gutter-md">
            <q-field required>
              <q-input
                float-label="Mail per la notifica"
                type="email"
                required
                v-model="email"
              />
            </q-field>

            <q-field>
              <q-select
                float-label="Sistema operativo"
                type="text"
                required
                v-model="os"
                :options="osOptions"
              />
            </q-field>

            <lms-buttons class="q-mt-md">
              <lms-button
                label="Richiedi creazione immagine"
                type="submit"
                :loading="isSubmitRequest"
              />
            </lms-buttons>
          </q-form>
        </div>

        <!-- FEEDBACK -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <div v-else key="feedback" class="q-pa-md">
          <q-banner color="positive">
            <p>
              La prenotazione delle immagini è stata presa in carico. <br />
              Riceverai un’email all'indirizzo
              <strong>{{ email }}</strong> quando saranno pronte.
            </p>
          </q-banner>

          <lms-buttons class="q-mt-md">
            <lms-button
              label="Vai al dettaglio del referto"
              @click="goToReportDetail"
            />
          </lms-buttons>
        </div>
      </transition>
    </q-card>
  </q-dialog>
</template>

<script>
import { getOsLabel } from "src/services/business-logic";
import { requestReportImage } from "src/services/api";
import { IMAGE_OS_MAP } from "src/services/config";
import { apiErrorNotify } from "src/services/utils";

export default {
  name: "RolReportImageRequestDialog",
  props: {
    value: { type: Boolean, required: false, default: false },
    reportId: { type: [Number, String], required: false }
  },
  data() {
    let defaultOs = IMAGE_OS_MAP.WINDOWS;
    let notifyContacts = this.$store.getters["getNotifyContacts"];
    let defaultEmail = notifyContacts?.email ?? "";

    return {
      email: defaultEmail,
      os: defaultOs,
      isSubmitRequest: false,
      showFeedback: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    delegatorSelected() {
      return this.$store.getters["getDelegatorSelected"];
    },
    taxCode() {
      if (this.delegatorSelected) {
        return this.delegatorSelected.codice_fiscale_delega;
      }

      return this.user?.cf;
    },
    osOptions() {
      let os = Object.values(IMAGE_OS_MAP);
      return os.map(o => ({ label: getOsLabel(o), value: o }));
    }
  },
  methods: {
    async onSubmit() {
      let id = this.reportId;

      let payload = {
        e_mail: this.email,
        sistema_operativo: this.os
      };

      this.isSubmitRequest = true;

      try {
        let response = await requestReportImage(this.taxCode, id, payload);
        this.$q.sessionStorage.set(`rol_report_image_requested_${id}`, true);
        this.showFeedback = true;
      } catch (error) {
        let message = "Non è stato possibile prenotare l'immagine";
        apiErrorNotify({ error, message });
      }

      this.isSubmitRequest = false;
    },
    goToReportDetail() {
      let name = this.$routes.ONLINE_REPORTS.REPORT_DETAIL.name;
      let params = { id: this.reportId };
      this.$router.push({ name, params });
    }
  }
};
</script>

<style lang="sass"></style>
