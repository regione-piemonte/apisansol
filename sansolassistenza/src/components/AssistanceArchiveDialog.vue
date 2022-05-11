<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    :maximized="$q.screen.lt.sm"
    v-bind="attrs"
    v-on="listeners">
    <q-card>
      <q-toolbar class="">
        <q-toolbar-title>Annulla richiesta di assistenza</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup/>
      </q-toolbar>
      <q-card-section class="" v-if="isRequestCancelled">
        <q-banner class="h-banner h-banner--positive"> Richiesta numero {{ requestNumber }} archiviata con successo
        </q-banner>
      </q-card-section>
      <q-card-section class="" v-else>
        La richiesta numero {{ requestNumber }} sarà archiviata.<br>
      </q-card-section>
      <q-card-actions align="right">
        <lms-buttons padding v-if="isRequestCancelled">
          <lms-button v-close-popup @click="resetSettings">OK</lms-button>
        </lms-buttons>
        <lms-buttons padding v-else>
          <lms-button outline color="negative" :loading="isLoading" @click="archiveRequest">Archivia</lms-button>
          <lms-button outline v-close-popup>Annulla</lms-button>
        </lms-buttons>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {archiveRequest} from "src/services/api";
import {apiErrorNotify} from "src/services/utils";

export default {
  name: "AssistanceArchiveDialog",
  props:{
    request : {type:Object, default: null},

  },
  data(){
    return {
      isLoading:false,
      isRequestCancelled:false
    }
  },
  computed: {
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    attrs() {
      const {...attrs} = this.$attrs;
      return attrs;
    },
    listeners() {
      const {...listeners} = this.$listeners;
      return listeners;
    },
    requestNumber(){
      return this.request?.richiesta_numero
    },
    requestId(){
      return this.request?.id
    }
  },
  methods:{
    async archiveRequest() {
      this.isLoading = true
      try {
        let httpConfig = {archiviata: true}
        let archivingPromise = await archiveRequest(this.taxCode, this.requestId, httpConfig)
        let response = archivingPromise.data
        this.isRequestCancelled = true
      } catch (e) {
        let message = "Non è stato possibile archiviare la richiesta";
        apiErrorNotify({e, message});
      } finally {
        this.isLoading = false
      }
    },
    resetSettings() {
      this.$emit('request-archived')
    },
  }
}
</script>

<style scoped>

</style>
