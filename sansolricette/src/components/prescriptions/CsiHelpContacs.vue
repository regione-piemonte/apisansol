<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus"></style>

<template>
  <q-page padding>
    <q-card>
      <q-card-main class="no-padding">
        <div class="row q-ma-md">
          <div class="col-md-6 col-sm-12 q-mt-md">
            <p>Hai bisogno di aiuto?</p>
            <p>Scrivi a <a href="mailto:">mail</a> specificando:</p>
            <ul>
              <li>Nome e cognome  </li>

              <li>Recapito telefonico</li>

              <li>Codice Fiscale</li>

              <li>Struttura presso la quale hai eseguito la visita o l'esame</li>

              <li>Data in cui hai effettuato la visita o l'esame</li>

              <li>Il problema che hai rilevato</li>
            </ul>
          </div>
          <div class="col-md-6 col-sm-12 ">
            <img src="statics/images/banners/img_assistenza.svg" alt="Assistenza" class="responsive">
          </div>
        </div>
      </q-card-main>
    </q-card>

  </q-page>
</template>


<script>
  import CsiPageTitle from "components/global/common/CsiPageTitle";
  import {config} from "@plugins/config";

  export default {
    name: 'PageContactsHelp',
    components: {CsiPageTitle},
    data(){
      return {
      }
    },
    computed: {
    },
    methods: {
      onBack(){
        this.$router.go(-1)
      }
    }
  }
</script>
