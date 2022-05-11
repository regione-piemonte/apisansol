<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card-section class="assistance-request-item">
    <div class="row items-center">
    <div class="text-overline q-gutter-md col col-sm-10">
      <q-badge multi-line color="primary " class="text-overline text-left"  v-if="requestAppName">
          {{ requestAppName }}
      </q-badge>
      <q-badge multi-line color="primary-light" class=" text-overline text-left assistance-badge" text-color="black"  v-if="requestStatus">
        <div >
          <span>{{ requestStatusLabel | capitalize}}</span>
          <span v-if="requestAssigned"  > &nbsp;-&nbsp; Assegnato a {{ requestAssigned }}</span>
          <!--        <span v-if="requestAssigned">{{ requestAssigned }}</span>-->
          <!--        <span v-else>  {{ requestStatusLabel }}</span>-->
        </div>

      </q-badge>
    </div>
    <q-space/>
    <div class="col-auto col-sm row reverse text-center">
      <q-icon
        color="grey-7"
        size="sm"
        name="more_vert"
        class="cursor-pointer"
      >
        <q-menu auto-close v-if="isArchived">
          <q-list>
            <q-item clickable :to="routeDetailsPage">
              <q-item-section>Visualizza pratica</q-item-section>
            </q-item>

          </q-list>
        </q-menu>
        <q-menu auto-close v-else>
          <q-list>
            <q-item clickable :to="routeDetailsPage">
              <q-item-section>Visualizza avanzamento pratica</q-item-section>
            </q-item>
            <template v-if="!isRequestSolved">
              <q-item v-if="isEditable" clickable @click="changeRequest()">
                <q-item-section >Modifica richiesta</q-item-section>
              </q-item>
              <q-item clickable @click="cancelRequestDialog()">
                <q-item-section>Annulla richiesta</q-item-section>
              </q-item>
            </template>
<!--            <q-item v-if="isEditable" clickable @click="changeRequest()">-->

<!--             <q-item-section v-if="isRequestSolved">Rispondi e reinvia</q-item-section>-->
<!--              <q-item-section v-else>Modifica richiesta</q-item-section>-->
<!--            </q-item>-->
<!--            <q-item v-if="!isRequestSolved" clickable @click="cancelRequestDialog()">-->
<!--              <q-item-section>Annulla richiesta</q-item-section>-->
<!--            </q-item>-->
          </q-list>
        </q-menu>
      </q-icon>
    </div>
    </div>
    <div class="q-mt-md">
      <router-link :to="routeDetailsPage" class="text-h5 text-black request-item__title">Richiesta assistenza numero {{ requestNumber }}</router-link>
    </div>
    <h6 class="q-mt-sm q-mb-lg ">{{typeTitle}}</h6>
    <template v-if="requestMsg">
      <div class="q-mx-xl">
        <q-chat-message
          :bg-color="chatColor"
          size="12"
          :sent="isMsgFromCitizen"
        >
          <template v-slot:avatar>
            <q-icon
              :style="isMsgFromCitizen ? 'left:16px' : 'right:16px'"
              size="sm" :name="chatAvatar"
            />
          </template>

          <div class="q-ma-sm">
            <p class="no-margin" style="white-space: pre-wrap;" v-html="requestMsgText"></p>
            <p class="q-mt-md q-mb-none" v-if="requestMsg.allegato">
              Allegato:
              <a
                class="lms-link"
                :href="requestMsg.allegato.nome_file"
                @click.prevent="downloadAttachment(requestMsg.allegato)"
              >
                {{ requestMsg.allegato.nome_file }}
              </a>
            </p>
            <div class="q-mt-md text-italic text-caption" v-if="!isArchived">
              <span v-if="requestMsg && isMsgFromCitizen">
                Inviata il {{ requestDate }}
              </span>
              <span v-else>
                Ricevuta il {{ requestDate }}
              </span>
            </div>
          </div>
        </q-chat-message>

        <div v-if="isArchived" class="q-mt-md text-caption">
          <span v-if="isRequestClose">
                Conclusa il {{ requestDate }}
              </span>
<!--          <span v-if="requestStatus === REQUEST_STATUS_MAP.DE">-->
<!--                Annullata il {{ requestDate }}-->
<!--          </span>-->
        </div>
      </div>
    </template>


    <!--ARCHIVIAZIONE-->
    <assistance-archive-dialog :request="request" v-model="isArchivingDialog" @request-archived="resetSettings"/>

  </q-card-section>

</template>

<script>
import {REQUEST_DETAIL, EDIT_REQUEST} from "src/router/routes";
import {date} from "quasar";
import {archiveRequest, deleteRequest, getRequestAttachment} from "src/services/api";
import {apiErrorNotify} from "src/services/utils";
import {
  getAssistanceTreeTitle,
  hideAdditionalInformation,
  hideAssistanceTreeInformation,
  requestAppName
} from "src/services/business-logic";
import {CSI_GROUP, IS_PROD, MESSAGE_AUTHOR_MAP, REQUEST_STATUS_MAP} from "src/services/config";
import AssistanceArchiveDialog from "components/AssistanceArchiveDialog";


export default {
  name: "AssistanceRequestItem",
  components: {AssistanceArchiveDialog},
  props: {
    request: {type: Object, required: true, default: null}
  },
  data() {
    return {
      isArchivingDialog: false,

      isRequestCancelled: false,
      isLoading: false,
      MESSAGE_AUTHOR_MAP,
      REQUEST_STATUS_MAP
    }
  },
  computed: {
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    appList() {
      return this.$store.getters['getAssistanceAppList']
    },
    aslList(){
      return this.$store.getters['getAsrList']
    },
    requestMsg() {
      return this.request?.ultimo_messaggio
    },
    requestId() {
      return this.request?.id
    },
    requestNumber(){
      return this.request?.richiesta_numero
    },
    requestDate() {
      let requestDate = this.request?.data_creazione
      return date.formatDate(requestDate, 'DD MMM YYYY ore HH:mm')

    },
    requestStatus() {
      return this.request?.stato
    },
    requestStatusLabel() {
      return this.request?.stato?.descrizione ?? ''
    },
    requestAssigned() {
      let label = CSI_GROUP.description
      let assignedCode = this.request?.gruppo_id_esterno
      if(assignedCode) {
        let assignedAsl= this.aslList?.find(asl => asl.gruppo_id_esterno?.toString() === assignedCode )
        label =  assignedAsl?.descrizione ?? CSI_GROUP.description
      }

      if(IS_PROD)
        return null
      else
        return label
    },
    requestAppName() {
      return this.request?.applicazione_descrizione
    },
    isArchived() {
      return this.request?.archiviata
    },
    isEditable() {
      return this.request?.modificabile
    },
    isMsgFromCitizen(){
      return this.requestMsg?.tipologia_autore === MESSAGE_AUTHOR_MAP.CITIZEN
    },

    chatColor() {
      return this.isMsgFromCitizen ? 'chat-blue' : 'chat-pink'
    },
    chatAvatar(){
      let img = this.isMsgFromCitizen ? 'avatar-user' : 'avatar-operator'
      return `img:images/${img}.svg`
    },
    isRequestSolved(){
      return this.request?.stato?.codice === REQUEST_STATUS_MAP.SOLVED
    },
    isRequestClose(){
      return this.request?.stato?.codice === REQUEST_STATUS_MAP.CLOSE
    },
    routeDetailsPage(){
      let name = REQUEST_DETAIL.name;
      let params= {requestNr: this.requestNumber}
      let query={codice: this.requestId}
      return { name, params, query };
    },
    requestMsgText(){
     let filteredtext = hideAssistanceTreeInformation(this.requestMsg?.testo)
      return hideAdditionalInformation(filteredtext)
    },
    typeTitle(){
      return this.request?.tipologia
    }
  },
  methods: {
    goToDetails() {
      this.$router.push({name: REQUEST_DETAIL.name, params: {requestNr: this.requestNumber}, query:{codice: this.requestId}})
    },
    changeRequest() {
      this.$router.push({name: EDIT_REQUEST.name, params: {requestNr: this.requestNumber, request: this.request}})
    },
    async downloadAttachment(attachment) {
      let attachmentId = attachment?.id
      try {
        let attachmentResponse = await getRequestAttachment(this.taxCode, this.requestId, attachmentId)
      } catch (e) {
        apiErrorNotify({
          error: e,
          message: "Impossibile reperire al'allegato."
        });
      }
    },

    cancelRequestDialog() {
        this.isArchivingDialog = true
    },
    async archiveRequest() {
      this.isLoading = true
      try {
        let httpConfig = {archiviata: true}
        let archivingPromise = await archiveRequest(this.taxCode, this.requestId, httpConfig)
        let response = archivingPromise.data
        this.isRequestCancelled = true
      } catch (e) {
        let message = "Non è stato possibile archiviare la richiesta";
        apiErrorNotify({e, message});
      } finally {
        this.isLoading = false
      }
    },
    async deleteRequest() {
      this.isLoading = true
      try {
        let archivingPromise = await deleteRequest(this.taxCode, this.requestId)
        let response = archivingPromise.data
        this.isRequestCancelled = true
      } catch (e) {
        let message = "Non è stato possibile archiviare la richiesta";
        apiErrorNotify({e, message});
      } finally {
        this.isLoading = false
      }
    },
    resetSettings() {
      this.isArchivingDialog = false
      this.$emit('cancel-request', true)
    },
    statusUpdateMessage(requestMessage){

    }
  }
}
</script>

<style lang="sass">
.assistance-request-item
  .q-chip
    height: auto
    padding: 0.3em 0.9em
.request-item__title
  text-decoration: none
  &:hover, &:focus
    text-decoration: underline

</style>
