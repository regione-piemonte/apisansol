<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
<lms-page padding>
  <lms-page-title>Revoca dichiarazione figlio minore</lms-page-title>

  <div v-if="!isLoading">
    <q-card class="q-mt-lg">
      <q-card-section>
        <div>
          <div class="text-h5 q-mb-sm">Genitori</div>
          <template v-if="$q.screen.gt.xs">
            <div class="row q-my-xs">
              <div class="col"><strong>Nome</strong></div>
              <div class="col"><strong>Cognome</strong></div>
              <div class="col"><strong>Codice fiscale</strong></div>
            </div>

            <div v-for="(parent,index) in parents" :key="index" class="row q-my-xs">
              <div class="col">{{parent.nome | startCase}}</div>
              <div class="col">{{parent.cognome | startCase}}</div>
              <div class="col">{{parent.codice_fiscale}}</div>
            </div>
          </template>
          <template v-else>
            <div v-for="(parent,index) in parents" :key="index" class="row q-mt-xs q-mb-md">
              <div class="col-12">
                <strong>Nome</strong>
                <div>{{parent.nome | startCase}}</div>
              </div>
              <div class="col-12">
                <strong>Cognome</strong>
                <div>{{parent.cognome | startCase}}</div>
              </div>
              <div class="col-12">
                <strong>Codice fiscale</strong>
                <div>{{parent.codice_fiscale}}</div>
              </div>
            </div>
          </template>

        </div>

        <div class="q-mt-md">
          <div class="text-h5 q-mb-sm">Minore</div>

          <div class="row q-my-xs">
            <div class="col-12 col-sm">
              <strong>Nome</strong>
              <div>{{minor.nome | capitalize}}</div>
            </div>
            <div class="col-12 col-sm">
              <strong>Cognome</strong>
              <div>{{minor.cognome | capitalize}}</div>
            </div>
            <div class="col-12 col-sm">
              <strong>Codice fiscale</strong>
              <div>{{minor.codice_fiscale}}</div>
            </div>
          </div>

        </div>
      </q-card-section>
    </q-card>


      <q-banner rounded class="q-mt-md h-banner h-banner--warning">
        <div class="text-body1">
          <p><strong>Attenzione</strong></p>
          <p v-if="isMulti">
            Confermando la revoca, verrà disabilita la delega per entrambi i genitori collegati al minore che non
            potranno più operare per conto del loro figlio.
          </p>
          <p v-if="isMono">
            Confermando la revoca, verrà disabilita la delega e non potrai
            più operare per conto del tuo figlio.
          </p>
          <p>
            Vuoi confermare la revoca della delega per
            <strong>{{minor.nome | capitalize }} {{minor.cognome |capitalize}}</strong>?
          </p>
        </div>
      </q-banner>




    <lms-buttons class="q-mt-lg q-mb-md">
      <lms-button label="Conferma la revoca" :loading="isLoadingRevoke" @click="onRevoke"/>
    </lms-buttons>
  </div>

  <lms-inner-loading :showing="isLoading"/>
</lms-page>
</template>

<script>
import {DECLARATION_DETAILS_STATUS_CODES, DECLARATION_STATUS_CODES, DECLARATION_TYPES_CODES} from "src/services/config";
import {getDeclaration, updateDeclaration} from "src/services/api";
import {apiErrorNotify} from "src/services/utils";
import {DECLARATION_MINOR_LIST, DECLARATION_MINOR_REVOKE_SUCCESS} from "src/router/routes";

export default {
  name: "PageDeclarationMinorRevoke",
  data() {
    return {
      declaration: null,
      isLoading: false,
      isLoadingRevoke: false,
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
    minor() {
      if (!this.declaration) return {}
      return this.declaration.dettagli[0].figlio_tutelato_curato
    },
    declarationTypeCode() {
      return this.declaration?.tipo?.codice
    },
    isMono() {
      return this.declarationTypeCode === DECLARATION_TYPES_CODES.PARENTS_MONO
    },
    isMulti() {
      return this.declarationTypeCode === DECLARATION_TYPES_CODES.PARENTS_MULTI
    },
  },
  async created() {
    let {id, declaration} = this.$route.params;
    this.declarationId = id;
    this.isLoading = true;

    // Se la dichiarazione non ci arriva durante la navigazione
    // => la richiediamo alle API
    if (!declaration) {
      try {
        let response = await getDeclaration(this.taxCode, this.declarationId, );
        declaration = response.data
      } catch (err) {
        let message= "Non è stato possibile caricare la dichiarazione da revocare"
        apiErrorNotify({message})
      }
    }

    this.declaration = declaration;
    this.isLoading = false
  },
  methods: {

    // Aggiorna la dichiarazione impostando i nuovi stati
    async onUpdate(declaration, status, detailStatus) {
      let data = JSON.parse(JSON.stringify(declaration))
      data.stato.codice = status
      data.dettagli.forEach(d => d.stato.codice = detailStatus)
      let response = await updateDeclaration(this.taxCode, declaration.uuid, data)
      return response
    },
    async onRevoke() {
      this.isLoadingRevoke = true
      let status = DECLARATION_STATUS_CODES.REVOKED;
      let detailStatus = DECLARATION_DETAILS_STATUS_CODES.REVOKED;

      try {
        let response = await this.onUpdate(this.declaration, status, detailStatus)
        let name = DECLARATION_MINOR_REVOKE_SUCCESS.name
        let params = {id: this.declarationId, declaration: this.declaration}
        this.$router.push({name, params})
      } catch (err) {
        let message= "Non è stato possibile revocare la dichiarazione"
        apiErrorNotify({message})
      }

      this.isLoadingRevoke = false
    },
  },
}
</script>

<style scoped>

</style>
