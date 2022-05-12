<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-modal :value="value"
           @input="$emit('input', $event)"
           :content-css="{minWidth: '60vw', minHeight: '60vh'}">

    <q-modal-layout footer-class="shadow-0">
      <!--<q-toolbar slot="header">-->
        <!--<q-toolbar-title>Contatti e notifiche</q-toolbar-title>-->
        <!--<q-btn flat round icon="close" v-close-overlay></q-btn>-->
      <!--</q-toolbar>-->


      <div class="q-pa-md">
        <div class="q-title">
          <p>
            Attiva le notifiche via email, SMS e push
          </p>
        </div>

        <div class="q-body-1">
          <p>
            Da oggi potrai ricevere notifiche via mail, SMS e push dai servizi di <i>Salute Piemonte</i>
            per ricordare più facilmente tutte le tue scadenze
          </p>
          <p>
            Attivale in pochi secondi per risparmiare tempo in futuro. Potrai comunque modificare le tue
            preferenze in qualsiasi momento dal tuo profilo personale
          </p>
        </div>
      </div>


      <div slot="footer" class="q-pa-md">
        <csi-buttons>
          <csi-button primary label="Continua" @click="$router.push($routes.GLOBAL.USER_CONTACTS_FLOW)" />
          <csi-button secondary label="Abbandona" v-close-overlay />
        </csi-buttons>
      </div>
    </q-modal-layout>

  </q-modal>
</template>

<script>

  export default {
    name: 'CsiNotificationActivationModal',
    props: {
      value: {type: Boolean, required: true}
    },
    data() {
      return {
      }
    }
  }
</script>

<style>
</style>
