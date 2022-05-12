<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card flat bordered class="tac-table-grid-item">
    <q-card-section>
      <div class="tac-table-grid-item__field-label">
        Data inizio
      </div>
      <div class="tac-table-grid-item__field-value">
        {{ startDate | datetime }}
      </div>
    </q-card-section>

    <q-card-section>
      <div class="tac-table-grid-item__field-label">
        Data fine
      </div>
      <div class="tac-table-grid-item__field-value">
        {{ endDate | datetime }}
      </div>
    </q-card-section>

    <q-card-section>
      <div class="tac-table-grid-item__field-label">
        Nome struttura
      </div>
      <div class="tac-table-grid-item__field-value-label">
        {{ description }}
      </div>
    </q-card-section>

    <q-card-section>
      <div class="tac-table-grid-item__field-label">
        Tipo di struttura
      </div>
      <div class="tac-table-grid-item__field-value-label">
        {{ structureTypeLabel }}
      </div>
    </q-card-section>

    <q-card-section>
      <div class="tac-table-grid-item__field-label">
        Motivazione
      </div>
      <div class="tac-table-grid-item__field-value-label">
        {{ motivation }}
      </div>
    </q-card-section>

    <q-card-section>
      <div class="tac-table-grid-item__field-label">
        Tipo di contatto
      </div>
      <div class="tac-table-grid-item__field-value-label">
        {{ contactTypeLabel }}
      </div>
    </q-card-section>

    <template v-if="!isDelegationTacWeak">
      <q-btn
        flat
        dense
        round
        icon="more_vert"
        class="absolute-top-right q-mt-sm q-mr-sm"
      >
        <q-menu>
          <q-list>
            <q-item clickable @click="$emit('delete')">
              <q-item-section side>
                <q-icon name="delete" color="negative" />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  Rimuovi
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </template>
  </q-card>
</template>

<script>
import { STRUCTURE_TYPE_CODE_MAP } from "../services/config";

export default {
  name: "TacTableGridItemStructureContact",
  props: {
    row: { type: Object, required: false, default: null }
  },
  data() {
    return {};
  },
  computed: {
    isDelegationTacWeak() {
      return this.$store.getters["isDelegationTacWeak"];
    },
    startDate() {
      return this.row?.data_contatto_inizio;
    },
    endDate() {
      return this.row?.data_contatto_fine;
    },
    structureTypeLabel() {
      return this.row?.struttura_tipo?.descrizione;
    },
    contactTypeLabel() {
      let typeCode = this.row?.struttura_tipo_codice;
      if (typeCode === STRUCTURE_TYPE_CODE_MAP.NO_CONVENTIONAL) {
        return this.row?.medicina_non_convenzionale_tipo_contatto;
      }

      return this.row?.tipo_contatto?.descrizione;
    },
    description() {
      return this.row?.denominazione;
    },
    motivation() {
      return this.row?.motivazione;
    }
  },
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass"></style>
