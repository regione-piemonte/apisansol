<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title>Modifica richiesta #{{requestNumber}}</lms-page-title>
    <div class="text-h3 q-mt-lg">Servizio: <strong>{{ requestAppName }}</strong></div>
    <div class="text-h6 q-mb-lg">{{request.tipologia}}</div>
    <template v-if="!isNewMessageSent">
      <q-card class="q-mt-lg" >
        <q-card-section>
          <div class="q-gutter-y-md column">
            <q-form greedy ref="formEdit">
              <q-input
                v-model="text"
                label="Descrizione del problema"
                type="textarea"
                :rules="[ruleRequired]"
                lazy-rules="ondemand"
                no-error-icon
                clearable
                required
              />

              <assistance-attachment-input
              v-model="attachment"
              :configuration="formConfiguration"
              ></assistance-attachment-input>
            </q-form>
          </div>
        </q-card-section>
        <q-card-actions class="q-pa-md" align="right">
          <lms-buttons>
            <lms-button @click="confirmDialog" >Invia</lms-button>
          </lms-buttons>
        </q-card-actions>



      </q-card>
      <!--RIEPILOGO-->
      <div class="q-mt-xl">
        <lms-page-title no-back>Riepilogo richiesta</lms-page-title>
        <q-card class="q-mt-lg">
          <q-card-section class="row">
            <div class="col-12 col-sm-6">
              <div>Email:</div>
              <div><strong>{{requestEmail}}</strong></div>
            </div>
            <div class="col-12 col-sm-6">
              <div>Telefono:</div>
              <div><strong>{{requestTelephone}}</strong></div>
            </div>
          </q-card-section>
          <q-card-section>
            <div>Servizio in cui è stato rilevato il problema:</div>
            <div>
              <strong>{{this.requestAppName}}</strong>
            </div>
          </q-card-section>
          <q-card-section v-if="requestLastMessage">

              <div>Descrizione del problema</div>
              <div style="width: 80%" class="q-mx-sm q-mt-md">
                <q-chat-message
                  :bg-color="chatColor"
                  :size="$q.screen.gt.md ? '10' : '12'"
                  :sent="requestLastMessage.tipologia_autore === MESSAGE_AUTHOR_MAP.CITIZEN"
                >
                  <div class="q-ma-sm">
                    <p class="no-margin">{{ requestLastMessage.testo }}</p>
                    <p class="q-mt-md q-mb-none" v-if="requestLastMessage.allegato">
                      Allegato:
                      <a
                        class="lms-link"
                        :href="requestLastMessage.allegato.nome_file"
                        @click.prevent="downloadAttachment(requestLastMessage.allegato)"
                      >
                        {{ requestLastMessage.allegato.nome_file }}
                      </a>
                    </p>
                  </div>
                </q-chat-message>
              </div>


          </q-card-section>
        </q-card>
      </div>
    </template>

    <div class="q-mt-lg " v-else>

          <q-banner class="q-pa-md h-banner h-banner--positive" v-if="newMessage">La richiesta di assistenza <strong>{{requestNumber}}</strong> è stata modificata con successo. </q-banner>
          <q-banner class="q-pa-md h-banner h-banner--warning" v-else>Non è stato possibile modificare la richiesta di assistenza.</q-banner>
          <lms-buttons class="q-mt-md">
            <lms-button outline @click="goToRequestsList" >
             RICHIESTE APERTE
            </lms-button>
            <!--          <lms-button outline @click="goToNewRequest" v-else>-->
            <!--            NUOVA RICHIESTA-->
            <!--          </lms-button>-->
          </lms-buttons>
        </div>

    <q-dialog v-model="isConfirmDialog">
      <q-card>
        <q-toolbar class="">
          <q-toolbar-title>Modifica richiesta</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup/>
        </q-toolbar>
          <q-card-section class="">
            Confermi l'invio della richiesta?<br>
          </q-card-section>
          <q-card-actions align="right">
            <lms-buttons padding>
              <lms-button :loading="isLoading" @click="changeRequest">Conferma</lms-button>
              <lms-button outline v-close-popup>Annulla</lms-button>
            </lms-buttons>
          </q-card-actions>
      </q-card>
    </q-dialog>



  </lms-page>
</template>

<script>
import LmsButton from "src/components/core/LmsButton.vue";
import LmsButtons from "src/components/core/LmsButtons.vue";
import { hasValidCin,hasValidLength,hasValidLengthTemporary } from 'src/services/tax-code';
import {changeRequest, getRequestAttachment, postRequests} from "../services/api"
import {apiErrorNotify, equalsIgnoreCase, isEmpty, toBase64} from "../services/utils"
import {REQUEST_DETAIL, REQUESTS_OPENED} from "src/router/routes";
import {APP_SERVICES_MAP, MESSAGE_AUTHOR_MAP} from "src/services/config";
import {requestAppName} from "src/services/business-logic";
import AssistanceAttachmentInput from "components/AssistanceAttachmentInput";

export default {
  components: {AssistanceAttachmentInput, LmsButton, LmsButtons },
  name: "PageEditRequestForm",
  data() {
    return {
      text: "",
      attachment: null,
      isConfirmDialog:false,
      isLoading:false,
      isEditSuccess:false,
      isNewMessageSent: false,
      request: null,
      requestNumber:null,
      newMessage: null,
      MESSAGE_AUTHOR_MAP
    };
  },
  computed: {
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    appList(){
      return this.$store.getters['getAssistanceAppList']
    },
    requestEmail(){
       return this.request?.email
    },
    requestTelephone(){
      return this.request?.telefono
    },
    requestLastMessage(){
      return this.request?.ultimo_messaggio
     },
    appServiceCode(){
      return this.request?.asset_id
    },
    requestId(){
      return this.request?.id
    },
    requestAppName(){
      return requestAppName(this.appServiceCode)
    },
    ruleRequired() {
      return (v) => !!v || "Campo obbligatorio"
    },
    formConfiguration(){
      return this.$store.getters["getAssistanceConfiguration"];
    },
    chatColor() {
      return this.requestLastMessage?.tipologia_autore === MESSAGE_AUTHOR_MAP.CITIZEN ? 'chat-blue' : 'chat-pink'
    },
  },
  created() {
    let {requestNr, request} = this.$route.params
    this.request = request
    this.requestNumber = requestNr

    if(!this.request) this.$router.replace(REQUESTS_OPENED)
  },
  methods: {
      async changeRequest() {
          this.isLoading =true
          try{
            let options = {
              testo: this.text,
              allegato: null
            }
            if(this.attachment){
              let base64 = await toBase64(this.attachment)
              // let type = !isEmpty(this.attachment.type) ? this.attachment.type : 'application/octet-stream';
              // let dataTypeString =  `data:${type};base64,`;
              // base64 = base64.replace(dataTypeString, "");

              let filename =this.attachment.name

              options.allegato = {
                nome_file : filename,
                base64: base64
              }
            }

            let response = await changeRequest(this.taxCode, this.requestId, options);
            this.newMessage = response.data
          }catch (e) {
            let message = "Non è stato possibile inviare la richiesta";
            apiErrorNotify({ e, message });
          }finally{
            this.isLoading =false
            this.isNewMessageSent = true
            this.isConfirmDialog = false

          }

      },
    confirmDialog(){
      this.$refs.formEdit.validate().then(success => {
        if(success){
          this.isConfirmDialog =true
        }

      })

    },
    goToDetails(){
      this.isConfirmDialog = false
      this.$router.push({ name: REQUEST_DETAIL.name , params: { requestid: this.requestId  } })
    },
    goToRequestsList(){
      this.$router.replace(REQUESTS_OPENED)
    },
    async downloadAttachment(attachment){
      let attachmentId = attachment?.id
      try{
        let attachmentResponse = await getRequestAttachment( this.taxCode, this.requestId, attachmentId)
      }catch (e) {
        apiErrorNotify({
          error: e,
          message: "Impossibile reperire al'allegato."
        });
      }
    }
  }
};
</script>
