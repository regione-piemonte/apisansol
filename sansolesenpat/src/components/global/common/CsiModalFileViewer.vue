<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style>
  .csi-modal-file-viewer{
    width: 80%;
    height: 90%;
    min-width: 80%;
    min-height: 90%;
  }

  .csi-modal-file-viewer__layout-content{
    overflow-y: hidden;
  }

  .csi-modal-file-viewer__file{
    width: 100%;
    height: 100%;
  }
</style>


<template>
  <q-modal :value="value" @input="onInput" content-classes="csi-modal-file-viewer">
    <q-modal-layout content-class="csi-modal-file-viewer__layout-content">

      <q-toolbar slot="header">
        <q-toolbar-title>{{name}}</q-toolbar-title>
        <q-btn v-close-overlay flat round dense icon="close"></q-btn>
      </q-toolbar>

      <object v-if="blob" :data="blobUrl" class="csi-modal-file-viewer__file" :type="blob.type"></object>
      <div v-else>
        loading
      </div>
    </q-modal-layout>
  </q-modal>
</template>


<script>
  export default {
    name: "CsiModalFileViewer",
    props: {
      value: {type: Boolean, required: true},
      blob: {type: Blob, required: false, default: null},
      name: {type: String, required: false, default: ''}
    },
    computed: {
      blobUrl(){
        return URL.createObjectURL(this.blob);
      }
    },
    methods: {
      onInput(newValue) {
        this.$emit('input', newValue);
      }
    }
  }
</script>
