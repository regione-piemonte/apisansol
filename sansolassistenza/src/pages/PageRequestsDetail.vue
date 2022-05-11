<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title @back="goToRequestsList" >Richiesta di assistenza #{{requestNumber}}</lms-page-title>


    <template v-if="loading">
      <div class="row">
        <q-skeleton  height="20px" class="bg-grey-5 q-mt-lg col-12 col-sm-6" />
        <q-skeleton  type="text" class="bg-grey-5 q-mt-xs col-12 col-sm-8" />
      </div>
      <q-card flat class="q-mt-lg">
        <q-card-section class="q-px-lg ">
          <q-timeline color="secondary" class="request__event-timeline">
            <q-timeline-entry
              v-for="i in 2"
              :key="i"
            >
              <template v-slot:title>
                <q-skeleton  type="text" class="bg-grey-5 " style="max-width: 300px"/>
              </template>

              <template>
                <q-chat-message
                  :bg-color="isOddNumber(i) ? 'chat-blue' : 'chat-pink'"
                  :size="$q.screen.gt.md ? '6' : '11'"
                  :sent="isOddNumber(i)"
                  class="q-px-md"
                >
                  <template v-slot:name>
                    <q-skeleton type="text"  width="30px" />
                  </template>


                  <template v-slot:avatar>
                    <q-icon :style="isOddNumber(i) ? 'left:16px' : 'right:16px'" size="sm" >
                      <q-skeleton type="circle" class="bg-grey-5"  size="24px"/>
                    </q-icon>
                  </template>

                  <div class="q-ma-sm">
                    <q-skeleton type="text" class="bg-grey-5" />
                    <q-skeleton type="text" class="bg-grey-5" />
                    <q-skeleton type="text" class="" width="50%"/>
                  </div>
                </q-chat-message>
              </template>
            </q-timeline-entry>
          </q-timeline>
        </q-card-section>


      </q-card>

    </template>
    <template v-else>

      <div class="text-h3 q-mt-lg">Servizio: <strong>{{ requestAppName }}</strong></div>
      <div class="text-h6 q-mb-lg">{{requestTypeTitle}}</div>

      <div v-if="noRequestMessages">
        <q-banner class="h-banner--warning h-banner">
        Al momento non è possibile visualizzare l'avanzamento della pratica.
        </q-banner>
      </div>
      <template v-else>
        <div class="q-mb-lg" v-if="isRequestSolved && (IS_DEV || IS_TEST)">
          <q-banner class="h-banner--info h-banner">
            Le attività relative alla tua segnalazione sono state completate. Ti invitiamo a verificare ed eventualmente a risponderci.
          </q-banner>
          <lms-buttons class="q-mt-sm" v-if="isRequestSolvedEditable">
            <lms-button outline  @click="changeRequest()">Rispondi</lms-button>
          </lms-buttons>
        </div>

        <q-card flat >
          <q-card-section class="q-pb-none">
            <div class="col-auto col-sm row reverse text-center justify-between">

              <q-icon
                color="grey-7"
                size="sm"
                name="more_vert"
                class="cursor-pointer"
                v-if="!isRequestSolved && !isRequestClose"
              >
                <q-menu auto-close>
                  <q-list>
                    <q-item v-if="isEditable" clickable @click="changeRequest()">
                      <q-item-section >Modifica richiesta</q-item-section>
                    </q-item>
                    <q-item  clickable @click="cancelRequestDialog()">
                      <q-item-section>Annulla richiesta</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>

                <!--              <q-menu auto-close v-if="!isRequestClose">-->
                <!--                <q-list>-->
                <!--                  <q-item v-if="isEditable" clickable @click="changeRequest()">-->
                <!--                    <q-item-section v-if="isRequestSolved">Rispondi e reinvia</q-item-section>-->
                <!--                    <q-item-section v-else>Modifica richiesta</q-item-section>-->
                <!--                  </q-item>-->
                <!--                  <q-item v-if="!isRequestSolved" clickable @click="cancelRequestDialog()">-->
                <!--                    <q-item-section>Annulla richiesta</q-item-section>-->
                <!--                  </q-item>-->
                <!--                </q-list>-->
                <!--              </q-menu>-->
              </q-icon>
              <div v-else></div>

<!--              <q-badge multi-line color="primary-light" text-color="black"  class="text-overline text-left assistance-badge" square v-if="requestAssigned">-->
<!--                 Assegnato a {{requestAssigned}}-->
<!--              </q-badge>-->
            </div>
          </q-card-section>
          <q-card-section class="q-px-lg ">
            <q-timeline color="secondary" class="request__event-timeline">
              <q-timeline-entry
                v-for="(event,index) in requestEventMessages"
                :key="event.id"
                :title="getEventStatus(event)"
                :prefix="index"
              >
                <template v-if="event.messages">
                  <div v-for="message in event.messages"
                       :key = "message.id">

                    <template v-if="message.tipologia_autore === MESSAGE_AUTHOR_MAP.ASSIGNMENT">
<!--                      <div class="text-body2  request__event-assignment">{{ getAssignmentLabel(message) }}</div>-->

                      <q-badge color="primary-light" text-color="black" class="assistance-badge text-subtitle2 text-left q-my-lg">{{ getAssignmentLabel(message) }}</q-badge>
<!--                      <q-badge color="grey-13" text-color="black" class="assistance-badge text-subtitle2 text-left q-my-lg">{{ getAssignmentLabel(message) }}</q-badge>-->
                    </template>
                    <template v-else>
                      <q-chat-message
                        :bg-color="chatColor(message)"
                        :size="$q.screen.gt.md ? '6' : '11'"
                        :name="messageAuthorName(message)"
                        :sent="isMsgFromCitizen(message)"
                        :stamp="messageDate(message)"
                        class="q-px-md"
                      >
                        <template v-slot:avatar>
                          <q-icon
                            :style="isMsgFromCitizen(message) ? 'left:16px' : 'right:16px'"
                            size="sm" :name="chatAvatar(message)"
                          />

                        </template>
                        <template v-slot:stamp>
                          <div class="text-caption">{{message.data_creazione || datetime}}</div>
                        </template>
                        <p  style="white-space: pre-wrap;" v-html="filteredMsgText(message.testo)"></p>
                        <p  class="q-mt-md" v-if="message.allegato">
                          Allegato:
                          <a
                            class="lms-link"
                            :href="message.allegato.nome_file"
                            @click.prevent="downloadAttachment(message.allegato)"
                          >
                            {{message.allegato.nome_file}}
                          </a>
                        </p>

                      </q-chat-message>
                    </template>

                  </div>

                </template>
              </q-timeline-entry>
            </q-timeline>
          </q-card-section>

        </q-card>
      </template>


    </template>

    <assistance-archive-dialog :request="request" v-model="isArchivingDialog" @request-archived="getRequestInfo"/>
  </lms-page>
</template>

<script>

import {archiveRequest, getRequestAttachment, getSingleRequest} from "../services/api"
import {
  apiErrorNotify,
  DEFAULT_FORMAT_DATETIME,
  equalsIgnoreCase,
  isEmpty,
  orderBy,
  sortBy,
  startCase
} from "../services/utils"
import { date } from 'quasar'
import {EDIT_REQUEST, REQUESTS_ARCHIVED, REQUESTS_OPENED} from "src/router/routes";
import {
  ADDITIONAL_INFO_LABEL,
  APP_SERVICES_MAP,
  CSI_GROUP, IS_DEV, IS_PROD, IS_TEST,
  MESSAGE_AUTHOR_MAP,
  REQUEST_STATUS_MAP
} from "src/services/config";
import {hideAssistanceTreeInformation, requestAppName} from "src/services/business-logic";
import AssistanceArchiveDialog from "components/AssistanceArchiveDialog";

export default {
  components: {AssistanceArchiveDialog},
  name: "PageRequestsDetail",
  data() {
    return {
      loading: true,
      request: null,
      requestId:null,
      MESSAGE_AUTHOR_MAP,
      isLoadingArchive:false,
      isArchivingDialog: false,
      isRequestCancelled: false,
      requestNumber:'',
      IS_DEV,
      IS_TEST
    };
  },
  computed: {
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    appList(){
      return this.$store.getters['getAssistanceAppList']
    },
    aslList(){
      return this.$store.getters['getAsrList']
    },
    appServiceCode(){
      return this.request?.asset_id
    },
    requestEventMessages() {
      let messagesList = this.request?.messaggi
      messagesList = messagesList.map(msg => {
        msg.evento = msg.tipologia_autore===MESSAGE_AUTHOR_MAP.STATUS ? 1 : 0
        return msg
      })
      let results = orderBy(messagesList,["data_creazione", "evento"], ['asc', 'desc']);

      let eventsGroup = this.groupByHistorical(results)

      return eventsGroup;
    },
    lastStatusUpdate(){
      let statusDate = null
      if(!isEmpty(this.requestEventMessages)) {
        let event = this.requestEventMessages[this.requestEventMessages.length-1]
        statusDate= event?.data_creazione ?? null
      }
      return statusDate

    },
    isRequestSolvedEditable(){
      // LA pratica è modificabile solo nei successivi due giorni
      if(this.lastStatusUpdate){
        return  date.getDateDiff(new Date(), this.lastStatusUpdate ) <=2
      }
      return false
    },
    isEditable() {
      return this.request?.modificabile
    },
    requestAppName(){
      return requestAppName(this.appServiceCode)
    },
    noRequestMessages(){
      return isEmpty(this.requestEventMessages)
    },
    requestTypeTitle(){
      return this.request?.tipologia
    },
    userInfoData() {
      return this.$store.getters["getActiveUserName"];
    },
    isRequestSolved(){
      return this.request?.stato?.codice === REQUEST_STATUS_MAP.SOLVED
    },
    isRequestClose(){
      return this.request?.stato?.codice === REQUEST_STATUS_MAP.CLOSE
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
  },
  created() {
    this.loading=true
    this.requestId = this.$route.query.codice;
    this.requestNumber = this.$route.params.requestNr;
    this.getRequestInfo()

  },
  methods: {
    async getRequestInfo(){
      try {
        let response = await getSingleRequest(this.taxCode,this.requestId);
        this.request = response.data;

      } catch (e) {
        console.log(e);
        let message = "Non è stato possibile ottenere la richiesta";
        apiErrorNotify({ e, message });
      }

      this.loading = false;
    },
    groupByHistorical(messagesList){
      let events = []
      if(messagesList){
        messagesList.forEach(msg => {
          if(msg.tipologia_autore===MESSAGE_AUTHOR_MAP.STATUS){
            msg.messages = []
            let index = messagesList.indexOf(msg)
            for(let i=index+1; i<messagesList.length; i++){
              if(messagesList[i].tipologia_autore !== MESSAGE_AUTHOR_MAP.STATUS){
                msg.messages.push(messagesList[i])
              }else break;
            }
            events.push(msg)
          }
        })
      }
      return events
    },
    getEventStatus(event){
      console.log(event)
      let status = event?.testo ?? ''

      let eventDate = ''

      if(event?.data_creazione){
        let data =date.formatDate(event?.data_creazione, 'DD MMM YYYY')
        let hour = date.formatDate(event?.data_creazione, 'HH:mm')
        eventDate = `alle ${hour} del ${data}`
      }


      return `${status} ${eventDate}`
    },
    getAssignmentLabel(event){
      let assigment = event?.testo ?? ''

      let eventDate = ''

      if(event?.data_creazione){
        let data =date.formatDate(event?.data_creazione, 'DD MMM YYYY')
        let hour = date.formatDate(event?.data_creazione, 'HH:mm')
        eventDate = `alle ${hour} del ${data}`
      }


      return `Assegnato a ${assigment} ${eventDate}`
    },
   async downloadAttachment(attachment){
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
    goToRequestsList(){
      if(this.request?.archiviata){
        this.$router.push(REQUESTS_ARCHIVED);
      }else {
        this.$router.push(REQUESTS_OPENED);
      }
    },
    isMsgFromCitizen(message){
      return message.tipologia_autore === MESSAGE_AUTHOR_MAP.CITIZEN
    },
    chatColor(message){
      return  this.isMsgFromCitizen(message) ? 'chat-blue' : 'chat-pink'
    },
    chatAvatar(message) {
      let img = this.isMsgFromCitizen(message) ? 'avatar-user' : 'avatar-operator'
      return `img:images/${img}.svg`
    },
    messageAuthorName(message){
      let isCitizen = this.isMsgFromCitizen(message)
      if(isCitizen){
        let name = startCase(this.userInfoData?.nome)
        let surname = startCase(this.userInfoData?.cognome)
        return `${name} ${surname}`
      }else{
        return message.autore
      }
    },
    messageDate(message){
      let msgDate = message?.data_creazione
      return msgDate ? date.formatDate(msgDate, DEFAULT_FORMAT_DATETIME) : ''
    },
    changeRequest() {
      this.$router.push({name: EDIT_REQUEST.name, params: {requestid: this.requestId, request: this.request}})
    },
    cancelRequestDialog() {
      this.isArchivingDialog = true
    },
    async archiveRequest() {
      this.isLoadingArchive = true
      try {
        let httpConfig = {archiviata: true}
        let archivingPromise = await archiveRequest(this.taxCode, this.requestId, httpConfig)
        let response = archivingPromise.data
        this.isRequestCancelled = true
      } catch (e) {
        let message = "Non è stato possibile archiviare la richiesta";
        apiErrorNotify({e, message});
      } finally {
        this.isLoadingArchive = false
      }
    },
    isOddNumber(index){
      return index % 2 !== 0
    },
    filteredMsgText(text){
      let filteredText =  hideAssistanceTreeInformation(text)
      return filteredText?.replace(ADDITIONAL_INFO_LABEL, '') ?? ''
    }

  },

};
</script>
<style lang="sass">
.request__event-timeline
  li::before
    content: ''
  .q-timeline__subtitle
    margin: 0
  .request__message
    padding: 0px 60px
.request__event-assignment
  position: relative
  //opacity: 0.4
  color: $grey
  text-transform: uppercase
  letter-spacing: 1px
  font-weight: 700
  margin: 32px 0px
  &:before
    content: ""
    position: absolute
    top: -2px
    //bottom: 50%
    //width: 24px
    top: calc(50% - 4px)
    //left: -31px
    left: -16px
    width: 8px
    height: 8px
    background-color: $secondary
    border-radius: 50%
    //border-bottom: 3px solid $primary
    opacity: 2


</style>
