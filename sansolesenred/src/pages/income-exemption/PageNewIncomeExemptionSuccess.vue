<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>

    <p class="q-title">Nuova Esenzione</p>
<!--v-if="exemption_"-->
    <div>
      <q-alert type="positive">
        <p>La richiesta di esenzione è stata compilata correttamente.</p>
<!--
        <p>
          Numero Protocollo: <strong>{{exemption_.protocollo}}</strong> <br>
          Scadenza: <strong>{{exemption_.data_scadenza | format}}</strong>
        </p>
-->
        <p>
          Ricordati di stampare l'esenzione e portarla con te durante le visite e gli esami
        </p>
      </q-alert>
      <div class="q-pt-md">
        <csi-buttons>
          <csi-button @click="onPrint"
            primary>
            Stampa
          </csi-button>
          <csi-button @click="$router.push($routes.INCOME_EXEMPTION.NEW)"
            secondary>
            Nuova esenzione
          </csi-button>
          <csi-button @click="$router.push($routes.INCOME_EXEMPTION.EXEMPTION_LIST)"
            secondary>
            Torna alla home
          </csi-button>
        </csi-buttons>
      </div>
    </div>


    <!-- MODAL PDF -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-modal-file-viewer
      v-model="isPdfModalOpen"
      :blob="blob">
    </csi-modal-file-viewer>

  </q-page>
</template>

<script>
  import {downloadExemption} from "@services/api/income-exemption";
  import CsiModalFileViewer from "components/global/common/CsiModalFileViewer";

  export default {
    name: 'PageNewIncomeExemptionSuccess',
    components: {CsiModalFileViewer},
    props: {
      id: {required: false},
      exemption: {type: Object, required: false, default: () => undefined}
    },
    data() {
      return {
        exemption_: this.exemption,
        isPdfModalOpen: false,
        blob: null,
      };
    },
    methods: {
      async onPrint() {
        let user = this.$store.getters['global/user'];
        let id = this.id
        let response = await downloadExemption(user.cf, id);
        this.blob = response.data;
        this.isPdfModalOpen = true;
      }
    },
  }
</script>

<style>
</style>
