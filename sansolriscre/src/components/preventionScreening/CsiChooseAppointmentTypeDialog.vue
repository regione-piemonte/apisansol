<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card :class="{ minWidthCard: $q.screen.gt.sm }" class="q-pa-md">
    <div align="right">
      <q-btn flat round dense icon="close" v-close-popup />
    </div>
    <q-card-section class="q-pt-none">
      <div><strong>Seleziona tipologia di appuntamento:</strong></div>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-lg">
        <csi-booking-card :appointment-type="APPOINTMENT_TYPES.CV" :is-bookable="isCytological"/>
        <csi-booking-card :appointment-type="APPOINTMENT_TYPES.MX" :is-bookable="isMammographic"/>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>

import { NEW_APPOINTMENT_PLACE } from "src/router/routes";
import {APPOINTMENT_TYPES, APPOINTMENT_TYPES_LABEL, APPOINTMENT_TYPES_NAME} from "src/services/config";
import CsiBookingCard from "components/preventionScreening/CsiBookingCard";
export default {
  name: "CsiChooseAppointmentTypeDialog",
  components: {CsiBookingCard},
  props: {
    isCytological: { type: Boolean, required:false, default: null },
    isMammographic: { type: Boolean, required:false, default: null },
  },
  data() {
    return {
      NEW_APPOINTMENT_PLACE,
      APPOINTMENT_TYPES,
      APPOINTMENT_TYPES_LABEL,
    };
  },
  computed:{

  },
  methods: {
  }
};
</script>
<style scoped></style>
