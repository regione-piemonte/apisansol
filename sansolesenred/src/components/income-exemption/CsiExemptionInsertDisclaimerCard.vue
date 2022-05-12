<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-exemption-insert-disclaimer-card">
    <q-card class="q-mt-md">
      <q-card-title>Informativa sul trattamento dei dati personali</q-card-title>
      <q-card-main>
        <q-field class="q-mt-md">
          <q-toggle
            :value="value"
            @input="$emit('input', $event)"
          >
            <div class="q-ml-md">
              Dichiaro di aver preso visione di quanto contenuto nelle
              <a href="#" @click.prevent.stop="openModalInformative">Condizioni del servizio</a> e
              <a href="#" @click.prevent.stop="openModalPrivacy">nell'Informativa sulla Privacy</a>
            </div>
          </q-toggle>
        </q-field>
      </q-card-main>
    </q-card>


    <!-- MODALS -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <q-modal v-model="isInformativeModalOpen" :content-css="{maxWidth: '800px'}">
      <q-modal-layout class="bg-grey-2">
        <q-toolbar slot="header">
          <q-toolbar-title>
            Condizioni del servizio
          </q-toolbar-title>
          <q-btn flat round icon="close" v-close-overlay />
        </q-toolbar>

        <div class="q-pa-md">
          <csi-policy :iframe-styles="{minHeight: '80vh'}">
            <template slot="text">
              <div v-html="informationDisclaimer"></div>
            </template>
          </csi-policy>
        </div>
      </q-modal-layout>
    </q-modal>

    <q-modal v-model="isPrivacyModalOpen" :content-css="{maxWidth: '800px'}">
      <q-modal-layout class="bg-grey-2">
        <q-toolbar slot="header">
          <q-toolbar-title>
            Informativa sulla Privacy
          </q-toolbar-title>
          <q-btn flat round icon="close" v-close-overlay />
        </q-toolbar>

        <div class="q-pa-md">
          <csi-policy :iframe-styles="{minHeight: '80vh'}">
            <template slot="text">
              <div v-html="privacyDisclaimer"></div>
            </template>
          </csi-policy>
        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>


<script>
    import {getDisclaimer} from "@services/api/income-exemption";
    import CsiPolicy from "components/global/common/CsiPolicy";

    export default {
        name: 'CsiExemptionInsertDisclaimerCard',
        components: {CsiPolicy},
        props: {
            value: {type: Boolean, required: false, default: false}
        },
        data() {
            return {
                isInformativeModalOpen: false,
                isPrivacyModalOpen: false,
                disclaimer: {},
            }
        },
        computed: {
            privacyDisclaimer() {
                return this.disclaimer.testo_privacy || ''
            },
            informationDisclaimer() {
                return this.disclaimer.testo_informativa || ''
            },
        },
        async created() {
            let disclaimerPromise = await getDisclaimer();
            this.disclaimer = disclaimerPromise.data;
        },
        methods: {
            openModalInformative() {
                this.isInformativeModalOpen = true
            },
            openModalPrivacy() {
                this.isPrivacyModalOpen = true
            }
        },
    }
</script>


<style scoped lang="stylus"></style>
