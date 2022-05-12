<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
<lms-page padding>
  <lms-page-title>Conferma dichiarazione</lms-page-title>
  <template v-if="!isLoading">
    <q-banner v-if="error"  class="q-mt-lg h-banner  h-banner--negative">
      <div class="text-body1">
        <p>
          Non è stato possibile confermare revocare la dichiarazione per i seguenti figli:
        </p>

        <template v-if="minor">
          <ul>
            <li>
              <strong> {{minor.nome | startCase }} {{minor.cognome | startCase }}</strong>
            </li>
          </ul>
        </template>

      </div>

    </q-banner>

    <q-banner v-else class="q-mt-lg h-banner h-banner--positive">
      <div class="text-body1">
        <p>
          Hai confermato la dichiarazione congiunta di responsabilità genitoriale e la conseguente delega ad operare per i seguenti figli:
        </p>

        <template v-if="minor">
          <ul>
            <li>
              <strong> {{minor.nome | startCase }} {{minor.cognome | startCase }}</strong>
            </li>
          </ul>
        </template>

        <p v-if="parent">Una notifica è stata inoltrata a <strong>{{parent.nome | startCase }} {{parent.cognome | startCase }}</strong></p>

      </div>

    </q-banner>

    <lms-buttons class="q-mt-lg q-mb-md">
      <lms-button  label="Nuova dichiarazione" :to="DECLARATION_MINOR_NEW" />
      <lms-button outline label="Torna ai tuoi figli minori" :to="DECLARATION_MINOR_LIST" />
    </lms-buttons>
  </template>

  <lms-inner-loading :showing="isLoading"/>
</lms-page>
</template>

<script>
import {DECLARATION_MINOR_LIST, DECLARATION_MINOR_NEW} from "src/router/routes";
import {getDeclarationMinor, getDeclarationOtherParent, getDeclarationParent} from "src/services/business-logic";
import {DECLARATION_TYPES_CODES} from "src/services/config";
import {getDeclaration} from "src/services/api";
import {apiErrorNotify} from "src/services/utils";

export default {
  name: "PageDeclarationMinorConfirmSuccess",
  data() {
    return {
      isLoading: false,
      DECLARATION_MINOR_NEW,
      DECLARATION_MINOR_LIST,
      minor: null,
      parent: null,
      error:false
    }
  },
  created() {
    let {parent, minor, error} = this.$route.params
    this.parent = parent
    this.minor = minor
    this.error = error
  }
}
</script>

<style scoped>

</style>
