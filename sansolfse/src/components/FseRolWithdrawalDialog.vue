<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog v-bind="attrs" v-on="listeners" class="fse-rol-withdrawal-dialog">
    <q-card style="max-width: 800px">
      <q-card-section class="q-gutter-y-md">
        <q-banner class="q-mt-md bg-blue-2" rounded>
          <div class="row q-col-gutter-md">
            <div class="col-auto">
              <q-icon name="fas fa-info-circle" size="md" />
            </div>

            <div class="col text-body1">
              <p>
                Hai scelto di ritirare questo referto di persona, ricordarti di
                farlo <strong>per non pagare l'intera prestazione</strong>. Nel
                frattempo, puoi comunque visualizzare il referto
              </p>

              <q-checkbox
                v-model="isWithdrawn"
                label="Ho già ritirato il referto"
                dense
              />

              <p class="q-mt-md q-mb-none">
                Una volta che hai dichiarato di aver ritirato il referto o alla
                scadenza, lo troverai nella sezione "Altri documenti"
              </p>
            </div>
          </div>
        </q-banner>
      </q-card-section>

      <q-card-section>
        <lms-buttons>
          <lms-button
            color="red-7"
            :loading="isWithdrawing"
            @click="onPdfDownloadConfirmed"
          >
            Ritira referto
          </lms-button>

          <lms-button v-close-popup outline>
            Annulla
          </lms-button>
        </lms-buttons>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { openURL } from "quasar";
import {
  getDocumentPdfUrl,
  getDocumentRolOldPdfUrl,
  setRolAsWithdrawn
} from "../services/api";
import { apiErrorNotifyDialog } from "../services/utils";
import {APP_CODE_MAP} from "src/services/config";

export default {
  name: "FseRolWithdrawalDialog",
  props: {
    rolId: { type: [String, Number], required: false, default: null },
    rolCl: { type: [String, Number], required: false, default: null },
    episodeId: { type: [String, Number], required: false, default: null },
    isRolOld: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      isWithdrawn: false,
      isWithdrawing: false
    };
  },
  computed: {
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    user() {
      return this.$store.getters["getUser"];
    },
    pdfUrl() {
      let isRolOld = this.isRolOld;
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.rolId;

      if (isRolOld) {
        let params = {
          componente_locale: this.rolCl,
          id_documento_cl: documentId,
          firmato: "S"
        };

        return getDocumentRolOldPdfUrl(taxCode, { params });
      } else {

        let params = {
          componente_locale: this.rolCl,
          id_episodio: this.episodeId,
          firmato_digitalmente: "S",
          criptato: "S",
          pdf: true
        };

        // if(process.env.APP_IS_DEV || process.env.APP_IS_TEST)
          params.codice_app_verticale = APP_CODE_MAP.FSE

        return getDocumentPdfUrl(taxCode, documentId, { params });
      }
    }
  },
  created() {},
  methods: {
    onClose() {
      this.$emit("input", false);
    },
    async onPdfDownloadConfirmed() {
      if (this.isWithdrawn) {
        await this.onWithdrawal();
      }

      openURL(this.pdfUrl);
      this.onClose();
    },
    async onWithdrawal() {
      let taxCode = this.$store.getters["getTaxCode"];
      let rolId = this.rolId;
      let payload = { codice_cl: this.rolCl };

      this.isWithdrawing = true;

      try {
        let { data } = await setRolAsWithdrawn(taxCode, rolId, payload);
        this.$emit("withdrawn");
      } catch (error) {
        let message = "Non è stato possibile salvare il referto come ritirato";
        apiErrorNotifyDialog({ error, message });
      }

      this.isWithdrawing = false;
    }
  }
};
</script>

<style scoped lang="sass"></style>
