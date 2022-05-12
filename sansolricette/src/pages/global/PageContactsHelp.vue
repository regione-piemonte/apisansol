<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus"></style>

<template>
  <q-page padding>
    <csi-page-title title="Aiuto" @back="onBack" class="q-mt-md"/>

    <div class="q-pt-xl q-pb-md q-subheading text-weight-regular round-borders">
      Contatti
    </div>
    <csi-help-contacs></csi-help-contacs>
  </q-page>
</template>

<script>
  import CsiPageTitle from "components/global/common/CsiPageTitle";
  import {config} from "@plugins/config";
  import CsiHelpContacs from "components/global/common/CsiHelpContacs";

  export default {
    name: 'PageContactsHelp',
    components: {CsiPageTitle, CsiHelpContacs},
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
