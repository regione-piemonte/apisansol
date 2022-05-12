<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="covid-reservation-list-item">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md">
        <q-item class="q-body-1 items-start">
          <q-item-section side>
            <q-icon
              name="img:/statics/la-mia-salute/icone/calendario.svg"
              size="lg"
            />
          </q-item-section>

          <q-item-section>
            <span class="text-bold">
              {{ typeDescription }}
            </span>
          </q-item-section>
        </q-item>
      </div>

      <div class="col-12 col-md">
        <q-item class="q-body-1">
          <q-item-section>
            <div>Data appuntamento</div>

            <div class="text-bold">{{ date | date }} - {{ hotspotTime }}</div>
          </q-item-section>
        </q-item>
      </div>

      <div class="col-12 col-md">
        <q-item class="q-body-1">
          <q-item-section>
            <div>Luogo appuntamento</div>

            <div class="text-bold">
              {{ hotspotDescription }}
            </div>
          </q-item-section>
        </q-item>
      </div>

      <div class="col-12 col-md"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CovidReservationListItem",
  components: {},
  props: {
    reservation: { type: Object, required: false, default: () => null },
  },
  data() {
    return {};
  },
  computed: {
    id() {
      return this.reservation?.prenotazioneTamponeId;
    },
    date() {
      return this.reservation?.hotspotDispeffFasciaDa;
    },
    hotspotDescription() {
      return this.reservation?.hotspot?.hotspotDesc;
    },
    hotspotTime() {
      return this.reservation?.hotspotDispeffFascia;
    },
    typeCode() {
      return this.reservation?.testTipo?.testTipoCod;
    },
    typeDescription() {
      return this.reservation?.testTipo?.testTipoDesc;
    },
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="scss"></style>
