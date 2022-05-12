<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-modal
    :value="value"
    @input="$emit('input', $event)"
    :content-css="{maxWidth: '800px'}"
  >

    <q-modal-layout footer-class="shadow-0">

      <q-toolbar slot="header">
        <q-toolbar-title>Come trovo l'identificativo ticket/posizione debitoria?</q-toolbar-title>
        <q-btn round flat icon="close" v-close-overlay />
      </q-toolbar>

      <div>
        <template v-if="!hasAsrId">
          <div class="q-pa-md">
            <p>
              Seleziona prima l'azienda sanitaria
            </p>
          </div>
        </template>

        <template v-else-if="images.length <= 0 && !description">
          <p class="q-pa-md no-margin">
            Al momento per questa ASL non sono presenti suggerimenti.
          </p>
        </template>

        <template v-else>

          <p v-if="description" class="q-pa-md no-margin">
            {{description}}
          </p>

          <q-tabs>
            <q-tab
              v-for="(image, index) in images"
              :key="image.nome"
              slot="title"
              :name="image.nome"
              :label="image.nome"
              :default="index === 0"
            />

            <q-tab-pane v-for="(image, index) in images" :key="image.nome" :name="image.nome">
              <img :src="image.src" alt="image.nome" class="responsive">
            </q-tab-pane>
          </q-tabs>
        </template>
      </div>
    </q-modal-layout>
  </q-modal>
</template>


<script>
  export default {
    name: 'CsiHealthPaymentNumberHelperModal',
    components: {},
    props: {
      value: {type: Boolean, required: false, default: false},
      asrId: {type: Number, required: false, default: null}
    },
    data() {
      return {}
    },
    computed: {
      hasAsrId() {
        return this.asrId !== null
      },
      appConfig() {
        return this.$store.getters['global/appConfig']
      },
      asrConfig() {
        let serviceCode = 'PTW'
        if (!this.appConfig || !this.appConfig[serviceCode] || !this.appConfig[serviceCode].asr) return {}
        return this.appConfig[serviceCode].asr.find(a => a.id === this.asrId) || {}
      },
      images() {
        let images = this.asrConfig.immagini || []
        images = images.filter(i => i.tipologia === 'NUMERO_PRATICA')
        return images
      },
      description() {
        return this.asrConfig.immagini_descrizione || ''
      }
    },
    created() {
    },
    methods: {},
  }
</script>


<style scoped lang="stylus"></style>
