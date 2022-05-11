<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title no-back>Nuova richiesta di assistenza</lms-page-title>

    <q-card class="q-pa-md q-mt-lg">

      <div class="q-gutter-y-md column">
        <q-form greedy @submit.prevent="" ref="form">
          <div class="text-h6">Seleziona il servizio per il quale desideri ricevere assistenza</div>
          <q-select v-model="choose" :options="options" label="Seleziona il Servizio"
                    :rules="[v => !!v || 'Devi selezionare un servizio']" lazy-rules="ondemand"
                    no-error-icon/>
          <lms-buttons class="q-mt-sm">
            <lms-button @click="goToForm">Vai</lms-button>
          </lms-buttons>
        </q-form>
      </div>
    </q-card>
  </lms-page>
</template>

<script>
import LmsButton from "src/components/core/LmsButton.vue";
import LmsButtons from "src/components/core/LmsButtons.vue";
import {hasValidCin, hasValidLength, hasValidLengthTemporary} from 'src/services/tax-code';
import {NEW_REQUEST_SPECIFIC} from "../router/routes"
import {postRequests} from "../services/api"
import {equalsIgnoreCase, orderBy} from "src/services/utils";
import {APP_SERVICES_MAP} from "src/services/config";

export default {
  components: {LmsButton, LmsButtons},
  name: "PageFormChoose",
  data() {
    return {
      choose: null
    };
  },
  computed: {
    appList() {
      return this.$store.getters['getAssistanceAppList'];
    },
    options() {
      let listApplications =[]
      let mapList = this.appList?.map(app => {
        let appCode = app.portale_codice ?? app.codice
        let appDescription= app.descrizione
        if(equalsIgnoreCase(appCode, APP_SERVICES_MAP.ACCESS)){
          appDescription = "Accesso ai servizi"
        }
        return {
          value: appCode,
          label: appDescription
        }
      });

      listApplications = orderBy(mapList, ['label'])
      return listApplications;
    }
  },
  methods: {
    async goToForm() {
      this.$refs.form.validate()
      if (this.choose == null) {
        return;
      }
      let serviceCode = this.choose.value;
      let route = {
        name: NEW_REQUEST_SPECIFIC.name,
        params: {serviceid: serviceCode}
      }
      this.$router.push(route)

    }
  }
};
</script>
