<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus">
  @require '~variables'

  .frame
    background-color $grey-3
    width 100%
    height 50vh
    border 1px solid $grey-5
    border-radius 4px

    /*iframe*/
    /*  width 100%*/
    /*  height 100%*/

</style>


<template>
  <div>
    <div class="relative-position">

      <iframe
        v-if="useIframe"
        :src="src"
        frameborder="0"
        class="frame"
        :class="iframeClasses"
        :style="iframeStyles"
        @load="stopLoading">
      </iframe>

      <div
        v-else
        class="frame scroll q-px-md"
        :class="iframeClasses"
        :style="iframeStyles">
        <slot name="text" />
      </div>

      <!-- LOADING -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-inner-loading :visible="isLoading" class="bg-transparent">
        <q-spinner-mat size="50px" color="primary"></q-spinner-mat>
      </q-inner-loading>
    </div>

    <!-- DOWNLOAD PDF -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div v-if="pdfSrc" class="q-pa-sm row items-center justify-end gutter-x-xs">
      <div class="col-auto">
        <q-icon name="picture_as_pdf" />
      </div>
      <div class="col-auto">
        <a :href="pdfSrc" target="_blank">
          Scarica PDF
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CsiPolicy',
    props: {
      src: {type: String, required: false, default: ''},
      pdfSrc: {type: String, required: false},
      iframeClasses: {type: Object, required: false, default: () => ({})},
      iframeStyles: {type: Object, required: false, default: () => ({})},
    },
    data() {
      return {
        isLoading: false,
      }
    },
    computed: {
      useIframe(){
        return !this.$slots.text
      }
    },
    created() {
      if (this.useIframe) this.isLoading = true
    },
    methods: {
      stopLoading() {
        this.isLoading = false
      }
    }
  }
</script>
