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
        {{ date | date }}
      </div>
    </q-card-section>

    <q-card-section>
      <div class="tac-table-grid-item__field-label">
        Colazione (calorie)
      </div>
      <div class="tac-table-grid-item__field-value-label">
        <template v-if="!breakfastKcal">-</template>
        <template v-else>
          {{ breakfastDescription }}
          ({{ breakfastKcal | number }})
        </template>
      </div>
    </q-card-section>

    <q-card-section>
      <div class="tac-table-grid-item__field-label">
        Pranzo (calorie)
      </div>
      <div class="tac-table-grid-item__field-value-label">
        <template v-if="!lunchKcal">-</template>
        <template v-else>
          {{ lunchDescription }}
          ({{ lunchKcal | number }})
        </template>
      </div>
    </q-card-section>

    <q-card-section>
      <div class="tac-table-grid-item__field-label">
        Cena (calorie)
      </div>
      <div class="tac-table-grid-item__field-value">
        <template v-if="!dinnerKcal">-</template>
        <template v-else>
          {{ dinnerDescription }}
          ({{ dinnerKcal | number }})
        </template>
      </div>
    </q-card-section>

    <q-card-section>
      <div class="tac-table-grid-item__field-label">
        Spuntini (calorie)
      </div>
      <div class="tac-table-grid-item__field-value">
        <template v-if="!snacksKcal">-</template>
        <template v-else>
          {{ snacksDescription }}
          ({{ snacksKcal | number }})
        </template>
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
  name: "TacTableGridItemDiet",
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
    breakfastDescription() {
      return this.row?.colazione_descrizione;
    },
    breakfastKcal() {
      return this.row?.colazione_calorie;
    },
    lunchDescription() {
      return this.row?.pranzo_descrizione;
    },
    lunchKcal() {
      return this.row?.pranzo_calorie;
    },
    dinnerDescription() {
      return this.row?.cena_descrizione;
    },
    dinnerKcal() {
      return this.row?.cena_calorie;
    },
    snacksDescription() {
      return this.row?.spuntini_descrizione;
    },
    snacksKcal() {
      return this.row?.spuntini_calorie;
    }
  },
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass"></style>
