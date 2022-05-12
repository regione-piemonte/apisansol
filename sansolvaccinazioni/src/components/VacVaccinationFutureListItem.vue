<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card>
    <q-card-section>
      <q-item class="q-px-none">
        <q-item-section side top class="gt-xs">
          <q-icon
            name="img:/statics/la-mia-salute/icone/vaccino.svg"
            size="xl"
          />
        </q-item-section>
        <q-item-section>
          <vac-vaccine-list-preview :vaccine-list="vaccineList"/>
          <div>
            <template v-if="vaccination.unita">
              Vaccinazione solitamente eseguita entro il
              {{ vaccination.eta }}° {{ vaccination.unita }} di età.
            </template>
            <template v-else>
              Vaccinazione solitamente eseguita entro il
              {{ vaccination.eta }}° giorno di età.
            </template>
          </div>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>

<script>
import VacVaccineListPreview from "./VacVaccineListPreview";
export default {
  name: "VacVaccinationFutureListItem",
  components: { VacVaccineListPreview },
  props: {
    vaccination: { type: Object, required: true }
  },
  data() {
    return {};
  },
  computed: {
    vaccineList() {
      return this.vaccination.vaccini ?? [];
    }
  },
  methods: {}
};
</script>

<style lang="sass"></style>
