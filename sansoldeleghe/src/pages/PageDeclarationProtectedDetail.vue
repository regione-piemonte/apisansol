<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title>Dettaglio tutela</lms-page-title>
    <template v-if="!isLoading">
      <div class="q-mt-md">
        <div class="q-body2">
          {{ protectionTypeLabel }}
        </div>
      </div>

      <q-card class="q-mt-md">

          <q-item>
            <q-item-section avatar>
              <q-icon size="lg" :name="protectorAvatar"/>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-bold">Dati del tutore</q-item-label>
            </q-item-section>
          </q-item>


        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <div><strong>Nome</strong></div>
              <div>{{ protector.nome }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div><strong>Cognome</strong></div>
              <div>{{ protector.cognome }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div><strong>Data di nascita</strong></div>
              <div>{{ protector.data_nascita | date }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div><strong>Comune di nascita</strong></div>
              <div>{{ protector.comune_nascita }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div><strong>Sesso</strong></div>
              <div>{{ protector.sesso }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div><strong>Codice fiscale</strong></div>
              <div>{{ protector.codice_fiscale}}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mt-md">

          <q-item >
            <q-item-section avatar>
              <q-icon size="lg" :name="protectedAvatar"/>
            </q-item-section>
            <q-item-section>
              <q-item-label><strong>Dati del soggetto tutelato</strong></q-item-label>
            </q-item-section>
          </q-item>

        <q-card-section>
          <div class="row  q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <div><strong>Nome</strong></div>
              <div>{{ protectedPerson.nome }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div><strong>Cognome</strong></div>
              <div>{{ protectedPerson.cognome }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div><strong>Data di nascita</strong></div>
              <div>{{ protectedPerson.data_nascita | date }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div><strong>Comune di nascita</strong></div>
              <div>{{ protectedPerson.comune_nascita }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div><strong>Sesso</strong></div>
              <div>{{ protectedPerson.sesso }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div><strong>Codice fiscale</strong></div>
              <div>{{ protectedPerson.codice_fiscale}}></div>
            </div>

          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mt-md">
        <q-item>
          <q-item-section>
            <q-item-label>
              <strong>Atto formale di nomina</strong>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-card-section>
          <div class="row  q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <div><strong>Numero Atto</strong></div>
              <div>{{ declaration.numero_documento }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div><strong>Autorità rilasciante</strong></div>
              <div>{{ declaration.autorita }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div><strong>Valido dal</strong></div>
              <div>{{ declaration.data_inizio_tutela | date }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div ><strong>Valido fino al</strong></div>
              <div>{{ declaration.data_fine_tutela | date }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <lms-buttons class="q-mt-md">
        <template v-if="canRevoke">
          <lms-button
            secondary
            color="negative"
            label="Revoca tutela"
            @click="onRevoke"
          />
        </template>
      </lms-buttons>
    </template>
    <lms-inner-loading :showing="isLoading"/>
  </lms-page>
</template>

<script>
import {
  getAvatarIcon,
  getDeclarationProtected,
  getDeclarationProtector,
  isDeclarationProtectionRevocable,
  isMinor
} from "src/services/business-logic";
import {getDeclaration} from "src/services/api";
import {apiErrorNotify} from "src/services/utils";
import {DECLARATION_PROTECTED_REVOKE} from "src/router/routes";

export default {
  name: "PageDeclarationProtectedDetail",
  data() {
    return {
      isLoading: false,
      declarationId: null,
      declaration: null,
    }
  },
  computed: {
    taxCode() {
      return this.$store.getters['getTaxCode']
    },
    protectionTypeLabel() {
      return  this.declaration?.tipo?.descrizione
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
    status() {
      return this.declaration?.stato?.codice
    },
    canRevoke() {
      let isRevocable = isDeclarationProtectionRevocable(this.declaration, this.taxCode);
      return isRevocable
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
        let response = await getDeclaration(this.taxCode, this.declarationId)
        declaration = response.data
      } catch (err) {
        let message="Non è stato possibile caricare le informazioni sulla tutela"
        apiErrorNotify({message})

      }
    }

    this.declaration = declaration;
    this.isLoading = false;
  },
  methods: {
    onRevoke() {
      let declaration = this.declaration
      let name = DECLARATION_PROTECTED_REVOKE.name
      let params = {id: declaration.uuid, declaration}
      this.$router.push({name, params})
    },
  }
}
</script>

<style scoped>

</style>
