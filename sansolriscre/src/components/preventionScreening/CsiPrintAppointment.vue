<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div :id="idComponent">
    <div
      class="print-appointment-container q-pa-xl row justify-center"
    >
      <div
        class="column q-col-gutter-y-lg items-stretch fit print-page-container"
        style="width:auto; max-width:600px"
      >
        <div class="col-auto">
          <h1 class="text-h1">Prevenzione Serena</h1>
          <hr />
          <p class="q-my-lg text-h6 text-weight-regular">
            Promemoria appuntamento
          </p>
        </div>

        <div class="col q-mt-xl">
          <q-card class="appointment-card " flat bordered>
            <q-card-section class="q-pa-none" :horizontal="$q.screen.gt.xs">
              <q-card-section :class="{ 'with-border': $q.screen.gt.xs }">
                <div
                  class="no-margin"
                  :class="{
                    'row q-col-gutter-x-md items-center': $q.screen.lt.sm,
                    'full-height': $q.screen.gt.xs
                  }"
                >
                  <div
                    class="col-auto q-pa-sm"
                    :class="{ 'text-center': $q.screen.gt.xs }"
                  >
                    <q-icon size="lg" :name="appointmentIcon" />
                  </div>
                  <div class="col" :class="{ 'text-center': $q.screen.gt.xs }">
                    <div class="text-subtitle1 text-weight-bold q-pa-sm">
                      {{ appointmentName | capitalize }} <br />
                      {{ appointmentLevel }}
                    </div>
                  </div>
                </div>
              </q-card-section>
              <hr v-if="$q.screen.lt.sm" />
              <q-card-section>
                <q-list class="fit">
                  <q-item v-if="!isDummyAppointment">
                    <q-item-section class="text-body2">
                      <q-item-label>Data:</q-item-label>
                      <q-item-label
                        ><strong
                          >{{ appointmentDate | date }} ore
                          {{ appointmentHour }}</strong
                        ></q-item-label
                      >
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section class="text-body2">
                      <q-item-label>Luogo:</q-item-label>
                      <q-item-label>
                        <strong>
                          {{ appointmentPlace }}
                        </strong></q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-auto">
          <hr />
          <div class="logo-container q-my-md row">
            <div class="col-6 text-left">
              <img
                src="/statics/la-mia-salute/immagini/logo-regione-piemonte-positivo.svg"
                alt="Regione Piemonte"
                class="logo-regione q-pr-sm"
              />
            </div>

            <div class="col-6 text-right">
              <img
                src="/statics/la-mia-salute/immagini/logo-csi-positivo.svg"
                alt="Logo CSI"
                class="logo-csi q-pl-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CsiPrintAppointment",
  props: {
    appointment: { type: Object, default: null },
    isDummyAppointment:{type:Boolean, default:false}
  },
  computed: {
    appointmentIcon() {
      return this.appointment?.icon ?? "";
    },
    appointmentName() {
      return this.appointment?.name ?? "";
    },
    appointmentLevel() {
      return this.appointment?.level ?? "";
    },
    appointmentDate() {
      return this.appointment?.date ?? null;
    },
    appointmentHour() {
      return this.appointment?.hour ? this.appointment?.hour.slice(0, 5) : "";
    },
    appointmentPlace() {
      return this.appointment?.place ?? "";
    },
    idComponent(){
      return 'print-appointment-' + this.appointment?.label
    }
  }
};
</script>

<style lang="sass">
.print-appointment-container
  display: none
.print-page
  background-color: #ffffff !important
  .print-appointment-container
    display: block !important
    width: 100vw
    margin: 0 auto
    min-height: 100vh
    max-width: 800px
    .print-page-container
      min-height: 90vh
    hr
      background-color: $lms-accent
    .appointment-card
      border-color: $lms-accent
      .with-border
        border-right: 1px solid $lms-accent
    .logo-regione
      width: 100%
      max-width: 180px
      height: auto
    .logo-csi
      width: 100%
      max-width: 160px
      height: auto
</style>
