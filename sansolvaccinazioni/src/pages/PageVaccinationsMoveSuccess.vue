<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div v-if="!isLoading">
      <lms-page-title no-back class="q-mb-md"
        >Sposta appuntamento</lms-page-title
      >
      <q-banner class="q-mb-md q-banner--positive">
        <div v-if="!agenda" class="text-body1 ">
          La richiesta di spostamento è stata inoltrata con successo
        </div>

        <!--        recap con agenda-->
        <div v-else class="text-body1 ">
          <div>L'appuntamento è stato spostato correttamente.</div>
          <div class="q-pt-md">
            Vaccinazione: <strong>{{ vaccinationsName }}</strong>
          </div>
          <div class="q-pt-sm">
            Luogo:
            <strong
              >{{ vaccinationCenter.descrizione }},
              {{ vaccinationCenter.comune }} {{ vaccinationCenter.indirizzo }}
            </strong>
          </div>
          <div class="q-pt-sm">
            Data: <strong>{{ newDate | date }} </strong>
          </div>
          <div class="q-pt-sm">
            Ora: <strong>{{ newDate | time }} </strong>
          </div>
        </div>
      </q-banner>

      <div class="q-pt-md q-pr-sm">
        <lms-buttons>
          <lms-button @click="goHome" outline>
            Torna alla home
          </lms-button>
        </lms-buttons>
      </div>
    </div>

    <lms-inner-loading :showing="isLoading" block />
  </lms-page>
</template>

<script>
import { HOME } from "../router/routes";
import { capitalCase } from "change-case";

export default {
  name: "PageVaccinationsMoveSuccess",
  components: {},
  props: {
    id: { required: false },
    exemption: { type: Object, required: false, default: () => undefined }
  },
  data() {
    return {
      //vaccinazione di prova da visualizzare quando la pagina viene ricaricata
      isLoading: false,
      appointment: null,
      agenda: null,
      vaccinationCenter: null,
      vaccinationsName: null,
      newDate: null
    };
  },
  computed: {},
  methods: {
    goHome() {
      let name = HOME.name;
      this.$router.push({ name });
    }
  },
  async created() {
    this.isLoading = true;

    if (this.$route.params.centroVaccinale)
      this.vaccinationCenter = this.$route.params.centroVaccinale;

    if (this.$route.params.appuntamento)
      this.appointment = this.$route.params.appuntamento;

    if (this.$route.params.nuovaData)
      this.newDate = this.$route.params.nuovaData.data_appuntamento;

    let vaccinationsName = "";
    for (let i = 0; i < this.appointment.vaccini.length; i++) {
      let vaccino = capitalCase(this.appointment.vaccini[i].descrizione);
      if (i === 0) {
        vaccinationsName = vaccino;
      } else {
        vaccinationsName = vaccinationsName + ", " + vaccino;
      }
    }
    this.vaccinationsName = vaccinationsName;

    if (this.$route.params.agenda) this.agenda = this.$route.params.agenda;

    this.isLoading = false;
  }
};
</script>

<style></style>
