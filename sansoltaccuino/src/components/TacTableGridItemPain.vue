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
        Descrizione
      </div>
      <div class="tac-table-grid-item__field-value-label">
        {{ description }}
      </div>
    </q-card-section>

    <q-card-section>
      <div class="tac-table-grid-item__field-label">
        Area interessata
      </div>
      <div class="tac-table-grid-item__field-value-label">
        {{ area }}
      </div>
    </q-card-section>

    <q-card-section>
      <div class="tac-table-grid-item__field-label">
        Intensità
      </div>
      <div class="tac-table-grid-item__field-value-label">
        {{ intensity }}
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
  name: "TacTableGridItemPain",
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
      return this.row?.data_inizio;
    },
    endDate() {
      return this.row?.data_fine;
    },
    description() {
      return this.row?.descrizione;
    },
    area() {
      return this.row?.area_interessata;
    },
    intensity() {
      return this.row?.intensita?.descrizione;
    }
  },
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass"></style>
