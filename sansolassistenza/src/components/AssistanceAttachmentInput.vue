<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-file
    v-bind="attrs"
    v-on="listeners"
    label="Allegato"
    lazy-rules
    no-error-icon
    clearable
    :accept="fileExtensions"
    :rules="[ruleValidFileSize]"
    @rejected="rejectedFiles"
    @focus="onfocusFiles"
    @input="onInput"
  >
    <template v-slot:append>
      <q-icon name="add" @click.stop class="cursor-pointer"/>
    </template>
    <template v-slot:hint>
      <div :class="{'text-negative': hasFileErrors}">
        <div>Estensioni accettate: {{ fileExtensions }}</div>
        <div>Dimensione massima {{ maxFileSizeLabel }}</div>
      </div>

    </template>
  </q-file>
</template>

<script>
import {isEmpty} from "src/services/utils";
import {TEAM_LENGTH, TEAM_MASK} from "src/services/tax-code";

export default {
  name: "AssistanceAttachmentInput",
  props: {
    configuration: {type: Object, default: null}
  },
  data(){
    return{
      hasFileErrors:false,
    }
  },
  computed:{
    fileExtensions(){
      let documentsFormat= this.configuration?.documento_formati_supportati ?? []
      if(!isEmpty(documentsFormat)){
        documentsFormat = documentsFormat.map(docFormat => '.' + docFormat)
      }
      return documentsFormat.join(', ')
    },

    maxFileSize(){
      return this.configuration?.documento_dimensione_massima
    },
    maxFileSizeLabel(){
      let sizeKb = this.maxFileSize ? (this.maxFileSize / 1024) : 0
      return sizeKb + ' KB'
    },
    ruleValidFileSize(){
      let msg = `La dimensione massima dell'allegato è di ${this.maxFileSizeLabel}`
      return (v) =>  (!v || v?.size <= this.maxFileSize) || msg
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    }
  },
  methods:{
    rejectedFiles(rejectedEntries){
      this.hasFileErrors=true
    },
    onfocusFiles(evt){
      this.hasFileErrors=false
    },
    onInput(val){
      this.$emit('input', val)
    }
  }
}
</script>

<style scoped>

</style>
