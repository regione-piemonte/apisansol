<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    class="cod-conversation-new-dialog"
    :maximized="$q.screen.lt.sm"
  >
    <q-card style="min-width:500px">
      <q-toolbar>
        <q-toolbar-title>
         Nuova conversazione
        </q-toolbar-title>

        <q-btn v-close-popup flat round icon="close"   aria-label="chiudi finestra"/>
      </q-toolbar>

      <q-card-section>
        <q-item v-if="userDoctor" class="q-px-none q-mb-md">
          <q-item-section avatar>
            <q-icon name="img:/statics/la-mia-salute/icone/medico-uomo.svg" size="lg" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-caption">Conversazione con:</q-item-label>
            <q-item-label><strong>{{ userDoctor.nome }} {{ userDoctor.cognome }}</strong></q-item-label>
          </q-item-section>
        </q-item>

        <q-input
          v-model="argument"
          error-message="Inserire un argomento"
          :error="invalidArgument"
          no-error-icon
          label="Argomento"
          :maxlength="MAX_LENGTH"

          counter
        />

        <lms-buttons class="q-mt-lg">
          <lms-button @click="onCreate" :loading="isLoading">
            Crea
          </lms-button>
          <lms-button v-close-popup outline>
            Annulla
          </lms-button>
        </lms-buttons>
      </q-card-section>
    </q-card>
  </q-dialog>

</template>

<script>
import {CONVERSATION_DETAIL} from "src/router/routes";
import {createConversation} from "src/services/api";
import {apiErrorNotify} from "src/services/utils";

const MAX_LENGTH = 30
export default {
  name: "CodConversationNewDialog",
  data(){
    return{
      MAX_LENGTH,
      argument:'',
      invalidArgument:false,
      conversation:null,
      isLoading: false,
    }
  },
  computed:{
    user(){
      return this.$store.getters["getUser"];
    },
    taxCode(){
      return this.$store.getters["getTaxCode"];
    },
    userDoctor(){
      return this.$store.getters["getUserDoctor"];
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },

  },
  methods:{
   async  onCreate(){
        this.invalidArgument = false
        if(this.argument?.length===0 || this.argument?.length>MAX_LENGTH){
          this.invalidArgument = true
          return
        }


       this.isLoading = true
      let payload ={
          medico:{
            nome: this.userDoctor?.nome,
            cognome: this.userDoctor?.cognome,
            codice_fiscale: this.userDoctor?.codice_fiscale
          },
        argomento: this.argument,
        autore:{
            codice_fiscale: this.user?.cf
        }
      }
      try{
          let {data: conversation} = await createConversation(this.taxCode, payload)
        this.conversation = conversation

        this.goToDetail()
      }catch (error) {
        let message = "Non è stato possibile creare la conversazione."
        apiErrorNotify({error, message})
      }
     this.isLoading = false
    },
    goToDetail(){
      let route={
        name: CONVERSATION_DETAIL.name,
        params:{
          id: this.conversation.id,
          conversation: this.conversation
        }
      }

      this.$router.push(route)
    }
  }
}
</script>

<style scoped>

</style>
