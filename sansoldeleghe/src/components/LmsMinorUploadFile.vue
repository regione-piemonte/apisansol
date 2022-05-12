<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <q-banner class="h-banner--info h-banner q-my-md">
      <div class="text-body1">
        Inserisci atto di nascita o stato di famiglia.
        <strong>
          I documenti caricati devono essere firmati digitalmente. In caso contrario, è necessario recarsi
          allo sportello.
        </strong>
      </div>
    </q-banner>
    <q-file
      v-bind="attrs"
      v-on="listeners"
      required
      no-error-icon
      clearable
      bottom-slots
      multiple
      label="* Documenti"
      :value="documents"
      :max-total-size="MAX_FILE_SIZE"
      accept=".pdf"
      :max-files="MAX_FILE_COUNT"
      @input="onInput"
    >
      <template v-slot:append>
        <q-icon name="add" @click.stop class="cursor-pointer"/>
      </template>

      <template v-slot:hint>
        <div> Seleziona un PDF di massimo 5 MB</div>
      </template>

      <slot />
      <slot slot="prepend" name="prepend" />
      <slot slot="before" name="before" />
      <slot slot="after" name="after" />
      <slot slot="error" name="error" />
      <slot slot="counter" name="counter" />
      <slot slot="loading" name="loading" />

    </q-file>
  </div>
</template>

<script>
import {LENGTH} from "src/services/tax-code";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_COUNT = 1
export default {
  name: "LmsMinorUploadFile",
   props:{
     documents: {type: Array, required: false},
   },
  data(){
    return{
      MAX_FILE_SIZE,
      MAX_FILE_COUNT,
    }
  },
  computed:{
    listeners() {
      const { input, ...listeners } = this.$listeners;
      return listeners;
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    }
  },
  methods:{
    onInput(newValue) {
      this.$emit(`update:documents`, newValue);
    },
  }
}
</script>

<style lang="sass">
.q-file
  width: auto !important
</style>
