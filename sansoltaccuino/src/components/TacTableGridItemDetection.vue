<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card flat bordered class="tac-table-grid-item">
    <q-card-section>
      <div class="tac-table-grid-item__field-label">
        Data
      </div>
      <div class="tac-table-grid-item__field-value">
        {{ date | datetime | empty }}
      </div>
    </q-card-section>

    <q-card-section>
      <div class="tac-table-grid-item__field-label">
        Modalità rilevazione
      </div>
      <div class="tac-table-grid-item__field-value-label">
        {{ detectionMode | empty }}
      </div>
    </q-card-section>

    <q-card-section>
      <div class="tac-table-grid-item__field-label">
        Misura
      </div>
      <div class="tac-table-grid-item__field-value">
        {{ value | number }}
      </div>
    </q-card-section>

    <q-card-section>
      <div class="tac-table-grid-item__field-label">
        Unità di misura
      </div>
      <div class="tac-table-grid-item__field-value">
        {{ measure | empty }}
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
export default {
  name: "TacTableGridItemDetection",
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
    date() {
      return this.row?.data;
    },
    detectionMode() {
      return this.row?.modalita?.descrizione_regionale;
    },
    value() {
      return this.row?.valore_numerico;
    },
    measure() {
      return this.row?.unita_misura?.codice;
    }
  },
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass"></style>
