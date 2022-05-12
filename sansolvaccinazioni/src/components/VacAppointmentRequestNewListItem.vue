<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card class="vac-appointment-request-new-list-item">
    <q-card-section class="no-padding">

      <!-- BARRA INFORMATIVA -->
      <!-- ------------------------------------------------------------------------------------------------------------>
      <template v-if="statusDescription">
        <lms-card-item-bar type="info">
          Stato: <strong>{{ statusDescription }}</strong>
        </lms-card-item-bar>
      </template>

      <!-- VACCINI -->
      <!-- ------------------------------------------------------------------------------------------------------------>
        <q-list padding>
          <q-item>
            <q-item-section class="gt-xs" side top>
              <q-icon
                name="img:/statics/la-mia-salute/icone/vaccino.svg"
                size="md"
                class="gt-xs"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label v-if="vaccineList.length > 0">
                <div>
                  <strong>{{ firstVaccine.descrizione | capitalCase }}</strong>

                  <template v-if="vaccineList.length > 1">
                    <a
                      class="lms-link cursor-pointer q-ml-xs"
                    >
                      <template v-if="vaccineList.length === 2"> e un altro vaccino</template>
                      <template v-else>e altri {{ vaccineList.length - 1 }} vaccini</template>
                      <q-popup-proxy>
                        <div class="q-pa-sm">
                          <q-list separator>
                            <q-item
                              v-for="(vaccine, index) in vaccineList"
                              :key="index"
                            >
                              <strong>{{ vaccine.descrizione | capitalCase }}</strong>
                            </q-item>
                          </q-list>
                        </div>
                      </q-popup-proxy>
                    </a>
                  </template>
                </div>
              </q-item-label>
              <q-item-label>
                L'appuntamento per le vaccinazioni indicate sarà fissato a breve. Riceverai una notifica
                appena possibile
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section side top  class="gt-xs">
              <q-icon
                size="md"
                name="img:/statics/la-mia-salute/icone/unita-operativa.svg"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>Centro vaccinale</q-item-label>
              <q-item-label><strong>{{vaccinationCenterDescription | capitalCase |empty}}</strong></q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section side top  class="gt-xs">
              <q-icon
                size="md"
                name="img:/statics/la-mia-salute/icone/calendario.svg"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>Appuntamento richiesto il </q-item-label>
              <q-item-label><strong>{{vaccineDate | date | empty }}</strong></q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import LmsCardItemBar from "./core/LmsCardItemBar";
import VacVaccineListPreview from "./VacVaccineListPreview";

export default {
  name: "VacAppointmentRequestNewListItem",
  components: {LmsCardItemBar},
  props: {
    appointmentRequest: {type: Object, required: false}
  },
  data() {
    return {};
  },
  computed: {
    vaccineList() {
       return this.appointmentRequest?.vaccini ?? [];

    },
    firstVaccine() {
      return this.vaccineList[0]
    },
    statusDescription() {
      return this.appointmentRequest?.descrizione_stato ?? null;
    },
    vaccinationCenterDescription() {
      return this.appointmentRequest?.centro_vaccinale_istanza_descrizione ?? ''
    },
    vaccineDate() {
      return this.appointmentRequest?.data_presentazione_istanza
    }
  },
  async created() {
  },
  methods: {}
};
</script>

<style lang="sass"></style>
