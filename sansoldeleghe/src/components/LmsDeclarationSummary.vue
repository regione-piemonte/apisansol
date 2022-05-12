<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="row q-col-gutter-y-sm">

    <div class="col-12 col-sm-6">
      <div ><strong>Nome</strong></div>
      <div>{{person.name}}</div>
    </div>
    <div class="col-12 col-sm-6">
      <div ><strong>Cognome</strong></div>
      <div>{{person.surname}}</div>
    </div>

    <div v-if="!minimal" class="col-12 col-sm-6">
      <div ><strong>Data di nascita</strong></div>
      <div>{{birthDate | date}}</div>
    </div>
    <div v-if="!minimal" class="col-12 col-sm-6">
      <div ><strong>Comune di nascita</strong></div>
      <div>{{person.birthPlace }}</div>
    </div>

    <div v-if="!minimal" class="col-12 col-sm-6">
      <div ><strong>Sesso</strong></div>
      <div>{{person.gender}}</div>
    </div>
    <div class="col-12 col-sm-6">
      <div ><strong>Codice Fiscale</strong></div>
      <div>{{person.taxCode}}</div>
    </div>
  </div>
</template>

<script>
import {date} from "quasar";
import {FORMAT_DATE} from "src/services/config";

export default {
name: "LmsDeclarationSummary",
  props: {
    person: Object,
    minimal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed:{
      birthDate(){
        if(this.person?.birthDate)
          return date.extractDate(this.person.birthDate, FORMAT_DATE)
        else
          return ''
      }
  }
}
</script>

<style scoped>

</style>
