<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title>Tutela revocata</lms-page-title>
    <template v-if="!isLoading">
      <q-banner class="h-banner h-banner--positive">
        <div class="text-body1">
          <p>
            Hai confermato revoca della tutela e la conseguente delega ad
            operare per i seguenti tutelati:
          </p>

          <q-list no-border>
            <q-item>
              <q-item-section>
                <q-item-label>
                  {{ protectedPerson.nome |startCase }} {{ protectedPerson.cognome | startCase }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

        </div>


      </q-banner>

      <lms-buttons class="q-mt-lg q-mb-md">
        <lms-button
          outline
          label="Torna ai tutelati"
          @click="$router.push(DECLARATION_PROTECTED_LIST)"
        />
      </lms-buttons>
    </template>
    <lms-inner-loading :showing="isLoading"/>
  </lms-page>
</template>

<script>
import {getDeclarationProtected} from "src/services/business-logic";
import {getDeclaration} from "src/services/api";
import {apiErrorNotify} from "src/services/utils";
import {DECLARATION_PROTECTED_LIST} from "src/router/routes";

export default {
  name: "PageDeclarationProtectedRevokeSuccess",
  data() {
    return {
      DECLARATION_PROTECTED_LIST,
      isLoading: false,
      declarationId: null,
      declaration: null,
    }
  },
  computed: {
    taxCode() {
      return this.$store.getters['getTaxCode']
    },
    protectedPerson() {
      if (!this.declaration) return null
      return getDeclarationProtected(this.declaration)
    },
  },
  async created() {
    let {id, declaration} = this.$route.params
    this.declarationId = id;

    this.isLoading = true;

    // Se la dichiarazione non ci arriva durante la navigazione
    // => la richiediamo alle API
    if (!declaration) {
      try {
        let response = await getDeclaration(this.taxCode, this.declarationId, {_no5XXRedirect: true})
        declaration = response.data
      } catch (err) {
        let message = "Non è stato possibile caricare le informazioni sulla tutela"
        apiErrorNotify({err, message})
      }
    }

    this.declaration = declaration;
    this.isLoading = false;
  },
}
</script>

<style scoped>

</style>
