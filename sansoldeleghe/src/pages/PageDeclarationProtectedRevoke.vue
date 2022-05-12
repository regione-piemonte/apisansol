<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title>Revoca tutela</lms-page-title>
    <template v-if="!isLoading">
      <q-card class="q-mt-md">
        <q-item>
          <q-item-section avatar>
            <q-icon size="lg" :name="protectedAvatar"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-bold">Dati del soggetto tutelato</q-item-label>
          </q-item-section>
        </q-item>


        <q-card-section>
          <div class="row gutter-y-md">
            <div class="col-12 col-sm-6">
              <div class="q-body-2">Nome</div>
              <div class="q-body-1">{{ protectedPerson.nome }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="q-body-2">Cognome</div>
              <div class="q-body-1">{{ protectedPerson.cognome }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="q-body-2">Data di nascita</div>
              <div class="q-body-1">{{ protectedPerson.data_nascita | date }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="q-body-2">Comune di nascita</div>
              <div class="q-body-1">{{ protectedPerson.comune_nascita }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="q-body-2">Sesso</div>
              <div class="q-body-1">{{ protectedPerson.sesso }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="q-body-2">Codice fiscale</div>
              <div class="q-body-1">{{ protectedPerson.codice_fiscale }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-banner class="q-mt-md h-banner h-banner--warning">
        <div class="text-body1">
          <strong>Attenzione</strong>
          <p>
            TODO
          </p>
          <p>
            Vuoi confermare la revoca della tutela per
            <strong>{{ protectedPerson.nome | startCase}} {{protectedPerson.cognome | startCase }}</strong>?
          </p>
        </div>

      </q-banner>

      <lms-buttons class="q-mt-lg q-mb-md">
        <lms-button  label="Conferma la revoca" :loading="isLoadingRevoke" @click="onRevoke"/>
      </lms-buttons>
    </template>
    <lms-inner-loading :showing="isLoading"/>
  </lms-page>
</template>

<script>
import {getAvatarIcon, getDeclarationProtected, getDeclarationProtector, isMinor} from "src/services/business-logic";
import {getDeclaration, updateDeclaration} from "src/services/api";
import {apiErrorNotify} from "src/services/utils";
import {DECLARATION_DETAILS_STATUS_CODES, DECLARATION_STATUS_CODES} from "src/services/config";
import {DECLARATION_PROTECTED_REVOKE_SUCCESS} from "src/router/routes";

export default {
  name: "PageDeclarationProtectedRevoke",
  data() {
    return {
      isLoading: false,
      isLoadingRevoke: false,
      declarationId: null,
      declaration: null,
    }
  },
  computed: {
    taxCode() {
      return this.$store.getters['getTaxCode']
    },
    protector() {
      if (!this.declaration) return null
      return getDeclarationProtector(this.declaration)
    },

    protectorAvatar() {
      return getAvatarIcon(this.protector?.sesso)
    },
    protectedAvatar(){
      return getAvatarIcon(this.protectedPerson?.sesso, this.isProtectedMinor)
    },
    protectedPerson() {
      if (!this.declaration) return null
      return getDeclarationProtected(this.declaration)
    },
    isProtectedMinor() {
      if (!this.protectedPerson) return true
      return isMinor(this.protectedPerson?.data_nascita)
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
        apiErrorNotify({err,message })
      }
    }

    this.declaration = declaration;
    this.isLoading = false;
  },
  methods: {
    // Aggiorna la dichiarazione impostando i nuovi stati
    async onUpdate(declaration, status, detailStatus) {
      let data = JSON.parse(JSON.stringify(declaration))
      data.stato.codice = status
      data.dettagli.forEach(d => d.stato.codice = detailStatus)
      let response = await updateDeclaration(this.taxCode, declaration.uuid, data, {_no5XXRedirect: true})
      return response
    },
    async onRevoke() {
      this.isLoadingRevoke = true
      let status = DECLARATION_STATUS_CODES.REVOKED
      let detailStatus = DECLARATION_DETAILS_STATUS_CODES.REVOKED

      try {
        let response = await this.onUpdate(this.declaration, status, detailStatus)
        let name = DECLARATION_PROTECTED_REVOKE_SUCCESS.name
        let params = {id: this.declarationId, declaration: this.declaration}
        this.$router.push({name, params})
      } catch (err) {
        let message = "Non è stato possibile revocare la tutela"
        apiErrorNotify({err,message })
      }

      this.isLoadingRevoke = false
    },
  }
}
</script>

<style scoped>

</style>
