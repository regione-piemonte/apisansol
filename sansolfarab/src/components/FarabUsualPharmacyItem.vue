<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <div class="farab-usual-pharmacy-item">
    <template v-if="isExpired">
      <lms-card-item-bar type="negative">
        <!-- @TODO: testo -->
        Scaduta
      </lms-card-item-bar>
    </template>
    <template v-if="isNotActive">
      <lms-card-item-bar type="neutral">
        <!-- @TODO: testo -->
        Non Attiva
      </lms-card-item-bar>
    </template>

    <div class="q-pa-md">
      <div class="row q-gutter-x-sm">
        <div class="col">
          <q-item class="q-px-none">
            <q-item-section side>
              <q-icon :name="PHARMACY_ICON_URL" size="md" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold">
                {{ pharmacyName | capitalize }}
              </q-item-label>

              <template v-if="pharmacyAddress">
                <q-item-label>
                  <a
                    :href="pharmacyAddressMapUrl"
                    class="lms-link"
                    target="_blank"
                  >
                    {{ pharmacyAddress | capitalize }}
                  </a>
                </q-item-label>
              </template>
            </q-item-section>
          </q-item>
        </div>

        <!-- AZIONI SECONDARIE -->
        <!-- ----------------- -->
        <div class="col-auto">
          <q-btn flat round dense icon="more_vert">
            <q-menu>
              <q-list separator>
                <q-item v-close-popup clickable @click="openValidityDialog">
                  <q-item-section>
                    <q-item-label>
                      Modifica validità
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item v-close-popup clickable @click="openDeleteDialog">
                  <q-item-section>
                    <q-item-label>
                      Rimuovi farmacia
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>

      <div class="q-mt-md">
        <div class="text-bold text-body1">Periodi di validità</div>

        <div>
          Dal {{ startValidity | date | empty }} al
          {{ endValidity | date | empty }}
        </div>
      </div>
    </div>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <!-- DIALOG PERIODO DI VALIDITA' -->
    <!-- --------------------------- -->
    <farab-usual-pharmacy-validity-dialog
      v-model="isOpenValidityDialog"
      :pharmacy="pharmacy"
      is-editing
      :is-expired="isExpired"
      @is-changed="closeValidityDialog"
    />

    <!-- DIALOG ELIMINA -->
    <!-- -------------- -->
    <q-dialog
      v-model="isOpenDeleteDialog"
      :maximized="$q.screen.lt.md"
      @hide="closeDeleteDialog"
    >
      <q-card style="width: 800px; max-width: 800px;">
        <q-card-section class="q-py-sm">
          <q-toolbar class="q-px-none">
            <q-toolbar-title>
              Rimuovi farmacia
            </q-toolbar-title>
          </q-toolbar>
        </q-card-section>

        <template v-if="!isDeleteSuccess">
          <q-card-section>
            Stai per rimuovere la farmacia <strong>{{ pharmacyName }}</strong
            >.
            <lms-buttons class="q-mt-lg">
              <lms-button
                label="Conferma"
                :loading="isDeleting"
                @click="deletePharmacy"
              />
              <lms-button outline label="Annulla" v-close-popup />
            </lms-buttons>
          </q-card-section>
        </template>

        <template v-else>
          <q-card-section>
            <q-banner class="q-my-lg q-banner--positive">
              <div class="text-body1">
                La farmacia <strong>{{ pharmacyName }}</strong> è rimossa con
                successo.
              </div>
            </q-banner>

            <lms-buttons>
              <lms-button outline v-close-popup>Chiudi</lms-button>
            </lms-buttons>
          </q-card-section>
        </template>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { date } from "quasar";
import { CHANGE_OPERATIONS_MAP, PHARMACY_ICON_URL } from "src/services/config";
import FarabUsualPharmacyValidityDialog from "components/FarabUsualPharmacyValidityDialog";
import { changeUsualPharmacy } from "src/services/api";
import {apiErrorNotify, apiErrorNotifyDialog} from "src/services/utils";
import LmsCardItemBar from "components/core/LmsCardItemBar";

let { isBetweenDates, getDateDiff } = date;

export default {
  name: "FarabUsualPharmacyItem",
  components: { LmsCardItemBar, FarabUsualPharmacyValidityDialog },
  props: {
    pharmacy: { type: Object, required: true, default: null }
  },
  data() {
    return {
      PHARMACY_ICON_URL,
      isOpenValidityDialog: false,
      isOpenDeleteDialog: false,
      isDeleteSuccess: false,
      isDeleting: false
    };
  },
  computed: {
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    pharmacyName() {
      return this.pharmacy?.farmacia?.descrizione ?? "";
    },
    pharmacyCode() {
      return this.pharmacy?.farmacia?.codice;
    },
    pharmacyAddress() {
      let city = this.pharmacy?.farmacia?.comune;
      let address = this.pharmacy?.farmacia?.indirizzo;
      if (!city || !address) return "";
      return `${address}, ${city}`;
    },
    pharmacyAddressMapUrl() {
      return `https://maps.google.com/?q=${this.pharmacyAddress}`;
    },
    startValidity() {
      let startdate = this.pharmacy?.data_validita_inizio ?? null;
      return startdate;
    },
    endValidity() {
      let endDate = this.pharmacy?.data_validita_fine ?? null;
      return endDate;
    },
    isExpired() {
      let now = new Date();
      return getDateDiff(now,  this.endValidity) >0;
    },
    isNotActive(){
      let now = new Date();
      return getDateDiff(now,  this.startValidity) <0;
    }
  },
  methods: {
    async deletePharmacy() {
      this.isDeleting = true;

      let params = {
        azione: CHANGE_OPERATIONS_MAP.REMOVE,
        farmacia_codice: this.pharmacyCode
      };

      try {
        let response = await changeUsualPharmacy(this.taxCode, params);
        this.isDeleteSuccess = true;
      } catch (error) {
        let message =
          "Non è stato possibile modificare il periodo di validità.";
        apiErrorNotifyDialog({ error, message });
        this.isDeleteSuccess = false;
      } finally {
        this.isDeleting = false;
      }
    },
    openValidityDialog() {
      this.isDeleteSuccess = false;
      this.isOpenValidityDialog = true;
    },
    closeValidityDialog(isSuccess) {
      this.$emit("is-changed", isSuccess);
      this.isOpenValidityDialog = false;
    },
    openDeleteDialog() {
      this.isOpenDeleteDialog = true;
    },
    closeDeleteDialog() {
      this.$emit("is-changed", this.isDeleteSuccess);
      this.isDeleteSuccess = false;
      this.isOpenDeleteDialog = false;
    },

  }
};
</script>

<style scoped></style>
