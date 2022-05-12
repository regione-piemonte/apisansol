<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    :maximized="$q.screen.lt.sm"
    class="tac-notebook-visiblity-change-dialog"
  >
    <q-card>
      <q-toolbar>
        <q-toolbar-title>
          <template v-if="isNotebookVisible">
            Oscuramento taccuino
          </template>
          <template v-else>
            Deoscuramento taccuino
          </template>
        </q-toolbar-title>

        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <q-card-section>
        <!-- OSCURATO: NO & CONSULTAZIONE: SI -->
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <template v-if="isNotebookVisible && isConsentFseEnabled">
          <p>
            Procedendo con l'oscuramento del taccuino i professionisti sanitari
            e i tuoi delegati non potranno visualizzare i dati inseriti.
          </p>

          <p>
            Inoltre, i professionisti sanitari non potranno visualizzare le tue
            informazioni del taccuino pur avendo fornito il consenso alla
            consultazione
            <a href="#" class="lms-link" @click.prevent="showPolicyFseDialog">
              (informativa completa)
            </a>
          </p>

          <p>
            Si vuole procedere con l’oscuramento?
          </p>
        </template>

        <!-- OSCURATO: NO & CONSULTAZIONE: NO -->
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <template v-else-if="isNotebookVisible && !isConsentFseEnabled">
          <p>
            Procedendo con l'oscuramento del taccuino i professionisti sanitari
            e i tuoi delegati non potranno visualizzare i dati inseriti.
          </p>

          <p>
            I professionisti sanitari non potranno comunque visualizzare le tue
            informazioni in quanto non hai fornito il consenso alla
            consultazione
            <a href="#" class="lms-link" @click.prevent="showPolicyFseDialog">
              (informativa completa)
            </a>
          </p>

          <p>
            Si vuole procedere con l’oscuramento?
          </p>
        </template>

        <!-- OSCURATO: SI & CONSULTAZIONE: SI -->
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <template v-else-if="!isNotebookVisible && isConsentFseEnabled">
          <p>
            Procedendo con la rimozione dell'oscuramento del taccuino tutti i
            tuoi delegati potranno visualizzare i dati inseriti.
          </p>

          <p>
            Inoltre, anche i professionisti sanitari potranno visualizzare le
            tue informazioni avendo fornito il consenso alla consultazione
            <a href="#" class="lms-link" @click.prevent="showPolicyFseDialog">
              (informativa completa)
            </a>
          </p>

          <p>
            Si vuole procedere con la rimozione dell’oscuramento?
          </p>
        </template>

        <!-- OSCURATO: NO & CONSULTAZIONE: NO -->
        <!-- ----------------------------------------------------------------------------------------------------- -->
        <template v-else>
          <p>
            Procedendo con la rimozione dell'oscuramento del taccuino tutti i
            tuoi delegati potranno visualizzare i dati inseriti.
          </p>

          <p>
            Invece, i professionisti sanitari non potranno visualizzare le tue
            informazioni in quanto non hai fornito il consenso alla
            consultazione
            <a href="#" class="lms-link" @click.prevent="showPolicyFseDialog">
              (informativa completa)
            </a>
          </p>

          <p>
            Si vuole procedere con la rimozione dell’oscuramento?
          </p>
        </template>
      </q-card-section>

      <q-space />

      <q-card-section>
        <lms-buttons>
          <lms-button :loading="isSaving" @click="onSave">
            Salva
          </lms-button>
        </lms-buttons>
      </q-card-section>
    </q-card>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <tac-policy-fse-dialog v-model="isPolicyFseDialogVisible" />
  </q-dialog>
</template>

<script>
import { updateNotebookVisibility } from "../services/api";
import { apiErrorNotifyDialog, notifySuccess } from "../services/utils";
import TacPolicyFseDialog from "./TacPolicyFseDialog";

export default {
  name: "TacNotebookVisibilityChangeDialog",
  components: { TacPolicyFseDialog },
  inheritAttrs: false,
  props: {
    isNotebookVisible: { type: Boolean, required: false, default: false },
    isConsentFseEnabled: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      isPolicyFseDialogVisible: false,
      isSaving: false
    };
  },
  computed: {
    listeners() {
      const { transition, ...listeners } = this.$listeners;
      return listeners;
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    user() {
      return this.$store.getters["getUser"];
    },
    notebook() {
      return this.$store.getters["getNotebook"];
    },
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    workingAppDelegatorList() {
      return this.$store.getters["getWorkingAppDelegatorList"];
    },
    workingAppDelegatorListWeak() {
      return this.workingAppDelegatorList.filter(delegator => {
        return delegator.deleghe.some(delegation => {
          return (
            delegation.codice_servizio === this.workingApp?.codice_servizio &&
            delegation.grado_delega === "DEBOLE"
          );
        });
      });
    }
  },
  created() {},
  methods: {
    showPolicyFseDialog() {
      this.isPolicyFseDialogVisible = true;
    },
    close() {
      this.$emit("input", false);
    },
    async onSave() {
      let taxCode = this.$store.getters["getTaxCode"];
      let notebookId = this.notebook?.id;
      let payload = { oscurato: this.isNotebookVisible };

      this.isSaving = true;

      try {
        await updateNotebookVisibility(taxCode, notebookId, payload);
        // Aggiorniamo le informazioni del taccuino nello store globale
        let notebook = { ...this.notebook, oscurato: payload.oscurato };
        this.$store.dispatch("setNotebook", { notebook });

        let message = payload.oscurato
          ? "Taccuino oscurato"
          : "Taccuino deoscurato";
        notifySuccess(message);
        this.close();
      } catch (error) {
        let message =
          "Non è stato possibile aggiornare lo stato di visibilità del taccuino";
        apiErrorNotifyDialog({ error, message });
      }

      this.isSaving = false;
    }
  }
};
</script>

<style lang="scss"></style>
