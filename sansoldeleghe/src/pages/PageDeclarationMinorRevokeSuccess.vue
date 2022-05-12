<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
<lms-page padding>
  <lms-page-title>Revoca dichiarazione figlio minore</lms-page-title>
  <template v-if="!isLoading">

    <q-banner v-if="error" class="q-mt-lg h-banner h-banner--negative">
      <div class="text-body1">
        <p>
          Non è stato possibile revocare la dichiarazione per i seguenti figli:
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
          Hai confermato revoca della dichiarazione congiunta di responsabilità genitoriale e la conseguente delega ad
          operare per i seguenti figli:
        </p>

        <template v-if="minor">
          <ul>
            <li>
              <strong> {{minor.nome | startCase }} {{minor.cognome | startCase }}</strong>
            </li>
          </ul>
        </template>

        <template v-if="isMulti && otherParent">
          <p>
            Una notifica è stata inoltrata a
            <strong>{{otherParent.nome | startCase }} {{otherParent.cognome | startCase }}</strong>
          </p>
        </template>
      </div>

    </q-banner>

    <lms-buttons class="q-mt-lg q-mb-md">
      <lms-button
        outline
        label="Torna ai tuoi figli minori"
        :to="DECLARATION_MINOR_LIST"
      />
    </lms-buttons>
  </template>

  <lms-inner-loading :showing="isLoading"/>
</lms-page>
</template>

<script>
import {DECLARATION_MINOR_LIST} from "src/router/routes";
import {getDeclarationMinor, getDeclarationOtherParent, getDeclarationParent} from "src/services/business-logic";
import {DECLARATION_TYPES_CODES} from "src/services/config";
import {getDeclaration} from "src/services/api";
import {apiErrorNotify} from "src/services/utils";

export default {
  name: "PageDeclarationMinorRevokeSuccess",
  data() {
    return {
      DECLARATION_MINOR_LIST,
      isLoading: false,
      declarationId: null,
      declaration: null,
      error:false
    }
  },
  computed: {
    taxCode() {
      return this.$store.getters['getTaxCode']
    },
    parents() {
      if (!this.declaration) return []
      return this.declaration.dettagli.map(d => d.genitore_tutore_curatore)
    },
    parent() {
      if (!this.declaration) return {}
      return getDeclarationParent(this.declaration, this.taxCode)
    },
    otherParent() {
      if (!this.declaration) return {}
      return getDeclarationOtherParent(this.declaration, this.taxCode)
    },
    minor() {
      if (!this.declaration) return {}
      return getDeclarationMinor(this.declaration)
    },
    declarationTypeCode() {
      return  this.declaration?.tipo?.codice
    },
    isMono() {
      return this.declarationTypeCode === DECLARATION_TYPES_CODES.PARENTS_MONO
    },
    isMulti() {
      return this.declarationTypeCode === DECLARATION_TYPES_CODES.PARENTS_MULTI
    },
  },
  async created() {
    let {id, declaration, error} = this.$route.params;
    this.error= error
    this.declarationId = id;
    this.isLoading = true;



    // Se la dichiarazione non ci arriva durante la navigazione
    // => la richiediamo alle API
    if (!declaration && !this.error) {
      try {
        let response = await getDeclaration(this.taxCode, this.declarationId);
        declaration = response.data
      } catch (err) {
        let message= "Non è stato possibile caricare la dichiarazione da revocare"
        apiErrorNotify({message})
      }
    }

    this.declaration = declaration;
    this.isLoading = false
  },
}
</script>

<style scoped>

</style>
