<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card class="vac-immunized-list-item">
    <q-card-section class="row items-start justify-between">
      <q-item class="q-px-none col">
        <q-item-section side top class="gt-xs">
          <q-icon
            name="img:/statics/la-mia-salute/icone/vaccino.svg"
            size="xl"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <strong> {{ immunized.vaccinazione | capitalCase }}</strong>
            ( Dose {{ immunized.dose }} )
          </q-item-label>
          <q-item-label>
            Immunizzato il
            {{ immunized.data_appuntamento | date }} per
            {{ immunized.motivazione_descrizione }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-space/>
      <!-- AZIONI SECONDARIE -->
      <!-- ------------------------------------------------------------------------------------------------------- -->
      <q-icon
        name="more_vert"
        class="col-auto cursor-pointer"
        color="grey-7"
        size="sm"
      >
        <q-menu class="cursor-pointer">
          <q-list separator>
            <q-item v-close-popup clickable @click="download">
              <q-item-section>
                <q-item-label>
                  Stampa scheda
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-icon>
    </q-card-section>
  </q-card>
</template>

<script>
import { downloadDocumentPdf } from "../services/api";

export default {
  name: "VacImmunizedListItem",
  props: {
    immunized: { type: Object, required: true }
  },
  data() {
    return {
      isDownloading: false
    };
  },
  computed: {
    cf() {
      return this.$store.getters["getTaxCode"];
    }
  },
  created() {},
  methods: {
    async download() {
      let taxCode = this.cf;
      let id = this.immunized.data_appuntamento;

      this.isDownloading = true;
      downloadDocumentPdf(taxCode, id);
      setTimeout(() => (this.isDownloading = false), 2000);
    }
  }
};
</script>

<style lang="sass"></style>
