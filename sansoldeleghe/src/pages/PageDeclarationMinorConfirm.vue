<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
<lms-page padding>
  <lms-page-title>Dichiarazione congiunta di responsabilità genitoriale</lms-page-title>

  <div v-if="!isLoading">
    <q-card>
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

    <q-card class="q-mt-md">
      <q-card-section>
        <lms-policy src="files/delegations-minors.html" />
        <div class="q-mt-md">
          <q-toggle
            v-model="isPolicyAccepted"
            label="Dichiaro di aver preso visione e dell'informativa e di accettare le condizioni d'uso"
            color="primary"
            />
        </div>
      </q-card-section>
    </q-card>

    <lms-buttons class="q-mt-md">
      <lms-button primary label="Conferma" :loading="isLoadingConfirm" @click="onConfirm" />
    </lms-buttons>
  </div>

  <lms-inner-loading :showing="isLoading"/>
</lms-page>
</template>

<script>
import LmsPolicy from "components/core/LmsPolicy";
import {getDeclaration, updateDeclaration} from "src/services/api";
import {apiErrorNotify} from "src/services/utils";
import {DECLARATION_MINOR_CONFIRM_SUCCESS} from "src/router/routes";
export default {
  name: "PageDeclarationMinorConfirm",
  components: {LmsPolicy},
  data() {
    return {
      declaration: null,
      isLoading: false,
      isPolicyAccepted: false,
      isLoadingConfirm: false,
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
    }
  },
  async created() {

    let {id, declaration} = this.$route.params

    if (!declaration) {
      this.isLoading = true
      let response = await getDeclaration(this.taxCode, id)
      declaration = response.data
      this.isLoading = false
    }

    this.declaration = declaration
  },
  methods: {
    // Aggiorna la dichiarazione impostando i nuovi stati
    async onUpdate(declaration, status, detailStatus) {
      let data = JSON.parse(JSON.stringify(declaration))
      data.stato.codice = status
      data.dettagli.forEach(d => d.stato.codice = detailStatus)
      let response = await updateDeclaration(this.taxCode, declaration.uuid, data)
      this.$emit('update', response.data)
      return response
    },
    async onConfirm() {
      if (!this.isPolicyAccepted) {
        let  message= "Devi accettare l'informativa per confermare la dichiarazione"
        apiErrorNotify({message})
        return
      }

      let status = 'ATTIVA'
      let detailStatus = 'VALIDA'
      let params;

      try {
        let response = await this.onUpdate(this.declaration, status, detailStatus)
        params ={
          parent: this.parents.find(parent => parent.codice_fiscale !== this.taxCode),
          minor: this.minor
        }
      } catch (e) {
        params ={error: true}
        // let message = `Non è stato possibile confermare revocare la dichiarazione`
        // apiErrorNotify({message})

      }finally{
        this.isLoadingConfirm = false
        let route = {
          name: DECLARATION_MINOR_CONFIRM_SUCCESS.name,
          params
        }
        this.$router.push(route)
      }

    },
  },
}
</script>

<style scoped>

</style>
