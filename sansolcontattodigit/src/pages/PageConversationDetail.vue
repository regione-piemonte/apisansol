<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page class="q-px-md page-conversation-detail">

    <div :style="pageHeightStyle" class="column ">
      <div class="q-pt-md col-auto row items-center justify-between">
        <div class="col">
          <lms-page-title @back="onBack">
            Conversazione <span v-if="doctorName">con {{ doctorName | empty }}</span>
          </lms-page-title>
        </div>

        <div class="col-md-auto">
          <div class="row items-center q-col-gutter-x-md">
            <div v-if="blocked" class="col-md-auto">
              <div v-if="$q.screen.gt.md" class="">
                <q-btn :class="{'readonly': !blockDoctorMotivation}" class="q-px-xs block-btn" dense no-caps outline
                       rounded
                       @click="onClickBlockBtn">
                  <q-icon class="q-mr-xs" name="lock" size="xs"/>
                  <div class="text-caption text-bold">
                    Conversazione in sola lettura
                  </div>
                </q-btn>
              </div>
              <template v-else>
                <q-btn :class="{'readonly': !blockDoctorMotivation}" class="block-btn" flat icon="lock" round
                       @click="onClickBlockBtn">
                  <q-tooltip>
                    Conversazione in sola lettura
                  </q-tooltip>
                </q-btn>
              </template>

            </div>

            <div v-if="conversationEndDate" class="col-md-auto ">

              <div class="text-caption ">
                <span class="gt-md"> Data eliminazione:  <strong>{{ conversationEndDate | date }}</strong></span>
                <span class="q-pl-xs"><q-btn
                  :size="$q.screen.gt.md ? 'sm' : 'md'"
                  aria-label="Maggiori informazioni"
                  class=""
                  color="secondary"
                  dense
                  flat
                  icon="o_info"
                  round
                  @click="showEndDateInfo =true"
                /></span>
              </div>

            </div>
          </div>

        </div>


      </div>

      <div class="col-auto">
        <div class="q-my-md ">
          <q-slide-transition>
            <the-guard-enrollment2 v-show="isEnrollmentGuardVisible" @hide-banner="onHideEnrollmentGuard"/>
          </q-slide-transition>
        </div>

      </div>

      <template v-if="!isEnrollmentCodeBlocker">
        <div class="col">

          <template v-if="isLoading">
            <cod-conversation-detail-skeleton/>
          </template>
          <template v-else-if="conversation">

            <div :class="{'q-pb-lg': blocked}" class="full-height">
              <q-card class="fit column" square>
                <div class="col-auto">
                  <lms-card-item-bar type="info">
                    <span>{{ infoConversationMsg }}</span>
                    <span class="q-pl-xs">
                      <a class="lms-link--black" href="#" @click.prevent="toggleMoreInfo">
                        {{isShowingMoreInfo ? 'Nascondi': 'Leggi altro'  }}
                      </a>
                    </span>

                  </lms-card-item-bar>
                  <q-card-section class="bg-grey-3 q-py-sm">


                    <div class="row items-center justify-between">

                      <q-item class="col">
                        <q-item-section avatar>
                          <q-icon name="img:/statics/la-mia-salute/icone/argomento.svg" size="lg"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label class="text-caption">Argomento</q-item-label>
                          <q-item-label><strong>{{ argument | empty }}</strong></q-item-label>
                        </q-item-section>
                      </q-item>

                      <div v-if="messagesListLength>0" class="col-auto text-right">


                        <div class="row items-center reverse">
                          <div class="col-auto q-pl-xs">
                            <q-fab
                              active-icon="close"
                              color="primary"
                              icon="search"
                              padding="sm"
                              unelevated
                              @input="onInputSearchFab"
                            >
                            </q-fab>
                          </div>

                          <div :class="{'active': showSearchInput}" class="col search-input">
                            <div class="full-width">
                              <q-input
                                key="input"
                                v-model="searchInput"
                                bg-color="white"
                                class="search-input__field"
                                dense
                                filled
                                label="Cerca nei messaggi"
                                @input="filterMessages"
                                @keyup.enter="showFilteredMessages"
                              />
                            </div>

                          </div>

                        </div>

                      </div>
                    </div>

                  </q-card-section>
                  <q-separator/>
                </div>

                <!-- ---------   LISTA MESSAGGI ------------------------>
                <!------------------------------------------------------------------------------------------------------------>
                <q-slide-transition>
                  <q-splitter
                    id="message-splitter"
                    v-model="splitterModel"
                    :limits="[0, 100]"
                    class="col"
                    disable
                  >
                    <template v-slot:before>
                      <!-- ---------   LISTA MESSAGGI ------------------------>
                      <!------------------------------------------------------------------------------------------------------------>


                      <q-scroll-area
                        v-show="messagesListLength>0"
                        id="message-scroll-area"
                        ref="messageScrollArea"
                        style="height: 100%"
                        visible
                      >

                        <q-infinite-scroll ref="messagesInfiniteScroll" :debounce="100"
                                           :offset="10"
                                           reverse scroll-target="#message-scroll-area .q-scrollarea__container"
                                           style="height: 100%" @load="onLoadMessages">
                          <template v-slot:loading>
                            <div class="row justify-center q-my-md">
                              <q-spinner-dots :size="isSearchingMessages ? '40px': '0px'" color="primary"/>
                            </div>
                          </template>

                          <div v-for="(message) in orderedMessageList" :id="'messageItem'+ message.id"
                               :key="`${message.id}-${reloadCount}`"
                               :ref="'messageItem'+ message.id" class="q-pa-md">
                            <div ref="messageItemScroll"
                                 v-scroll="(el) => scrollFire(el, message)" class="messageItemScroll"></div>


                            <cod-message-item
                              :focused="messageFocused && messageFocused.id === message.id"
                              :message="message"
                              :read-notification="canShowReadNotification"
                              :searched-text="searchedString"
                              @edit-message="onEditMessage"
                              @show-document="showDocument"
                            />
                          </div>

                        </q-infinite-scroll>


                      </q-scroll-area>
                      <div v-if="!isSearchingMessages && messagesListLength<=0" class="q-py-md">
                        <lms-banner class="q-mx-md" type="info">
                          Nessun messaggio
                        </lms-banner>
                      </div>
                    </template>
                    <template v-slot:after>
                      <!-- ---------   RICERCA MESSAGGI (DESKTOP) ------------------------>
                      <!------------------------------------------------------------------------------------------------------------>
                      <template v-if="showFilteredMsg">
                        <div v-if="$q.screen.gt.sm" ref="searchContainer"
                             class="relative-position filtered-messages-container full-height">

                          <template v-if="filteredMessageList.length<=0">
                            <q-bar class="text-body1 bg-orange-2">
                              Nessun risultato
                            </q-bar>

                            <div v-if="!areAllMessagesLoaded" class=" column items-center  q-pt-md" style="">
                              <q-btn
                                :loading="isSearchingMessages"
                                class="col q-px-sm"
                                dense
                                outline

                                @click="loadMessageList"
                              >
                                Espandi ricerca
                              </q-btn>
                            </div>

                          </template>
                          <template v-else>
                            <template v-if="filteredMessageList.length===1">
                              <q-bar class="text-body1 bg-grey-3">{{ filteredMessageList.length }} messaggio trovato
                              </q-bar>
                            </template>
                            <template v-else>
                              <q-bar class="text-body1 bg-grey-3">{{ filteredMessageList.length }} messaggi trovati
                              </q-bar>
                            </template>

                            <q-scroll-area
                              class="position-relative"
                              style="height: 300px; "
                            >
                              <div>
                                <q-list separator>
                                  <cod-message-filtered-item
                                    v-for="(message) in filteredMessageList"
                                    :key="message.id"
                                    ref="filteredMessage"
                                    :conversation="conversation"
                                    :focused="messageFocused === message"
                                    :message="message"
                                    @click="onSearchMessage"
                                  />
                                </q-list>
                              </div>
                              <div v-if="!areAllMessagesLoaded" class=" column items-center  q-pt-md" style="">
                                <q-btn
                                  :loading="isSearchingMessages"
                                  class="col q-px-sm"
                                  dense
                                  outline

                                  @click="loadMessageList"
                                >
                                  Espandi ricerca
                                </q-btn>
                              </div>

                            </q-scroll-area>


                          </template>


                        </div>
                      </template>

                    </template>
                  </q-splitter>

                </q-slide-transition>

                <!-- ---------   RICERCA MESSAGGI ------------------------>
                <!------------------------------------------------------------------------------------------------------------>
                <q-slide-transition>
                  <!-- ---------   RICERCA MESSAGGI (MOBILE) ------------------------>
                  <!------------------------------------------------------------------------------------------------------------>
                  <div v-show="$q.screen.lt.md && showFilteredMsg" class="bg-secondary col-auto">
                    <q-item>
                      <q-item-section side>
                        <q-icon color="white" name="pageview"></q-icon>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-white text-h6">
                          <div v-if="filteredMessageList.length<=0" class="row items-center justify-between">
                            Nessun risultato
                            <div v-if="!areAllMessagesLoaded" class="col-auto q-pl-sm ">
                              <q-btn
                                :loading="isSearchingMessages"
                                class="q-px-xs"
                                dense
                                outline
                                @click="loadMessageList"
                              >
                                Espandi ricerca
                              </q-btn>
                            </div>

                          </div>
                          <div v-else>
                            {{ messageFocusedIndex + 1 }} di {{ filteredMessageList.length }}
                          </div>
                        </q-item-label>
                      </q-item-section>
                      <q-item-section v-if="filteredMessageList.length>0" side>
                        <div class="row items-center">

                          <template
                            v-if="!areAllMessagesLoaded && messageFocusedIndex>=filteredMessageList.length-1">
                            <q-btn
                              :loading="isSearchingMessages"
                              class="q-px-xs"
                              color="white"
                              dense
                              flat
                              @click="loadMessageList"
                            >
                              Espandi ricerca
                            </q-btn>
                          </template>
                          <template v-else>
                            <q-btn
                              :disable="messageFocusedIndex>=filteredMessageList.length-1"
                              color="white"
                              flat
                              icon="keyboard_arrow_up"
                              round
                              @click="onFocusMessage(messageFocusedIndex+1)"/>
                          </template>

                          <q-btn
                            :disable="messageFocusedIndex<=0"

                            color="white"
                            flat
                            icon="keyboard_arrow_down"
                            round
                            @click="onFocusMessage(messageFocusedIndex-1)"/>
                        </div>
                      </q-item-section>
                    </q-item>
                    <!--                  <div  v-if="!areAllMessagesLoaded">-->
                    <!--                    <q-btn-->
                    <!--                      class="q-px-xs"-->
                    <!--                      :loading="isSearchingMessages"-->
                    <!--                      dense-->
                    <!--                      color="white"-->
                    <!--                      outline-->
                    <!--                      @click="loadMessageList"-->
                    <!--                    >-->
                    <!--                      Espandi ricerca-->
                    <!--                    </q-btn>-->
                    <!--                  </div>-->
                  </div>
                </q-slide-transition>

                <!-- ---------   NUOVO MESSAGGIO ------------------------>
                <!------------------------------------------------------------------------------------------------------------>
                <div v-if="!blocked" class="col-auto">
                  <q-card-section v-if="isEditingMsg" class="q-pb-none">
                    <q-item class="q-px-none " dense>
                      <q-item-section side>
                        <q-icon color="primary" name="edit"></q-icon>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-bold text-primary">Modifica messaggio</q-item-label>
                        <q-item-label v-if="editableMessage" caption lines="1">{{
                            editableMessage.testo
                          }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section avatar>
                        <q-btn color="primary" dense flat icon="close" outline rounded @click="closeEditing"></q-btn>
                      </q-item-section>
                    </q-item>
                  </q-card-section>
                  <q-card-section id="new-message-input" :class="{'q-px-sm': $q.screen.lt.md}">
                    <q-input
                      v-model="messageText"
                      autogrow
                      bg-color="white"
                      dense
                      no-error-icon
                      outlined
                      placeholder="Scrivi messaggio"
                    >
                      <template v-slot:before>
                        <div class="lt-md">
                          <q-btn color="primary" dense flat icon="attach_file" @click="showDocumentListDialog = true">
                            <q-tooltip>
                              Condividi documento del Fascicolo Sanitario
                            </q-tooltip>
                          </q-btn>
                        </div>

                      </template>

                      <template v-slot:after>
                        <div class="lt-md">
                          <q-btn :disabled="isEmptyMessage" :loading="isSendingMessage" color="primary" dense flat
                                 icon="send" @click="sendMessage">
                            <q-tooltip>
                              Invia
                            </q-tooltip>
                          </q-btn>
                        </div>

                      </template>

                    </q-input>

                    <div v-if="attachments && attachments.length >0" class="q-mt-lg">
                      <q-chip v-for="attachment in attachments" :key="attachment.id_documento_ilec"
                              class="attachment-chip"
                              color="grey-3" removable
                              square @remove="removeAttachment(attachment.id_documento_ilec)">
                        <strong class="q-pr-sm">{{ attachmentName(attachment) }}</strong>
                      </q-chip>
                    </div>

                    <div class="q-pt-md row items-center q-col-gutter-md gt-sm">
                      <div class="col-12 col-md">
                        <a class="lms-link " href="#" @click.prevent="showDocumentListDialog = true">
                          <q-icon name="attach_file" size="xs"></q-icon>
                          Condividi documento del Fascicolo Sanitario
                        </a>
                      </div>
                      <div class="col-12 col-md-auto">
                        <lms-buttons class="">
                          <lms-button :disabled="isEmptyMessage" :loading="isSendingMessage" @click="sendMessage">Invia
                          </lms-button>
                        </lms-buttons>
                      </div>

                    </div>


                  </q-card-section>


                </div>
              </q-card>
            </div>

          </template>
        </div>
        <!--DIALOGS -->
        <template v-if="!isLoading">
          <cod-document-list-dialog v-model="showDocumentListDialog" :attachment-list="attachments"
                                    @on-attachment="onAttachment" @remove-attachment="removeAttachment"/>


          <q-dialog v-model="showDocumentDetail" :maximized="$q.screen.lt.sm">
            <q-card>
              <q-toolbar>
                <q-toolbar-title>
                  Dettaglio allegato
                </q-toolbar-title>

                <q-btn v-close-popup aria-label="chiudi finestra" flat icon="close" round/>
              </q-toolbar>

              <q-card-section class="no-padding">
                <template v-if="isLoadingDocumentDetail">
                  <lms-inner-loading :showing="isLoadingDocumentDetail" block/>
                </template>

                <template v-else-if="selectedDocument">
                  <cod-document-item-detail :document="selectedDocument"/>
                </template>
              </q-card-section>
            </q-card>
          </q-dialog>

          <q-dialog v-model="showEndDateInfo">
            <q-card>
              <q-toolbar>
                <q-toolbar-title>
                  Data eliminazione conversazione
                </q-toolbar-title>

                <q-btn v-close-popup aria-label="chiudi finestra" flat icon="close" round/>
              </q-toolbar>

              <q-card-section>
                <div class="q-mb-md">
                  Se non vengono inseriti nuovi messaggi questa conversazione sarà eliminata il
                  {{ conversationEndDate | date }}.
                </div>

              </q-card-section>
            </q-card>
          </q-dialog>

          <q-dialog v-model="showBlockMotivationDialog">
            <q-card style="">
              <q-toolbar>
                <q-toolbar-title>
                  Conversazione in sola lettura
                </q-toolbar-title>

                <q-btn v-close-popup aria-label="chiudi finestra" flat icon="close" round/>
              </q-toolbar>

              <q-card-section>
                <lms-banner class="q-mb-lg" type="info">

                  <template v-if="blockDoctorMotivation === BLOCK_REASONS_MAP.DOCTOR_CHANGE">
                    Attenzione! Non puoi proseguire questa conversazione perché {{ doctorName }} non è più il tuo medico
                    di base. I messaggi precedenti saranno visibili per tre mesi, poi saranno automaticamente
                    cancellati.
                  </template>
                  <template v-else-if="blockDoctorMotivation === BLOCK_REASONS_MAP.DOCTOR_CHOICE">
                    Attenzione! Non puoi proseguire questa conversazione perchè il tuo medico {{ doctorName }} ti ha
                    disabilitato all'uso di questo servizio {{
                      blockDoctorMotivationLabel ? ' con la seguente motivazione: ' + blockDoctorMotivationLabel : ''
                    }}.Eventuali messaggi precedenti resteranno visibili per tre mesi, dopo saranno automaticamente
                    cancellati.

                  </template>
                  <template v-else-if="blockDoctorMotivation === BLOCK_REASONS_MAP.DOCTOR_REVOKE">
                    Attenzione! Non puoi proseguire questa conversazione in quanto il medico {{ doctorName }} ha
                    revocato l'adesione al servizio. Eventuali messaggi precedenti rimarranno visibili per tre mesi, poi
                    saranno automaticamente cancellati.
                  </template>

                </lms-banner>
              </q-card-section>

            </q-card>
          </q-dialog>
        </template>

      </template>

    </div>


  </lms-page>
</template>

<script>

import {BLOCK_REASONS_MAP, CONVERSATION_READ_STATUS, MSG_AUTHOR_MAP, USER_ENABLING_MAP} from "src/services/config";

import {apiErrorNotify, isEmpty, orderBy} from "src/services/utils";
import CodDocumentListDialog from "components/CodDocumentListDialog";
import LmsBanner from "components/core/LmsBanner";
import {
  attachmentName,
  doctorIcon, hasEnrollmentBlock,
  isUserEnabled,
  scrollToElement,
  searchMessageRegex
} from "src/services/business-logic";
import CodMessageItem from "components/CodMessageItem";
import CodMessageFilteredItem from "components/CodMessageFilteredItem";
import {
  editMessage,
  getConversationList,
  getDocumentDetail,
  getMessageList, newMessage,
  setMessageAsRead
} from "src/services/api";
import CodConversationDetailSkeleton from "components/loaders/CodConversationDetailSkeleton";
import {Screen} from 'quasar'
import CodDocumentItemDetail from "components/CodDocumentItemDetail";
import store from "src/store";
import TheGuardEnrollment2 from "components/TheGuardEnrollment2";
import LmsCardItemBar from "components/core/LmsCardItemBar";
import {truncate} from "boot/filters";
import {CONVERSATION_LIST} from "src/router/routes";


const MAX_SPLITTER = 110
const LIMIT = 20
export default {
  name: "PageConversationDetail",
  components: {
    LmsCardItemBar,
    TheGuardEnrollment2,
    CodDocumentItemDetail,
    CodConversationDetailSkeleton, CodMessageFilteredItem, CodMessageItem, LmsBanner, CodDocumentListDialog
  },
  data() {
    return {
      Screen,
      BLOCK_REASONS_MAP,
      id: null,
      conversation: null,
      isLoading: false,
      messagesList: [],
      attachments: [],
      messageText: '',
      showDocumentListDialog: false,
      showBlockMotivationDialog: false,
      showSearchInput: false,
      searchInput: '',
      splitterModel: 0,
      messageFocused: null,
      messageFocusedIndex: 0,
      isEditingMsg: false,
      editableMessage: null,
      isSearchingMessages: false,
      totalMessagesCount: Number.MAX_SAFE_INTEGER,
      isSendingMessage: false,
      showFilteredMsg: false,
      sentMessage: false,
      showDocumentDetail: false,
      selectedDocument: null,
      isLoadingDocumentDetail: false,
      offset: 0,
      reloadCount: 0,
      showEndDateInfo: false,
      fromHome: false,
      isEnrollmentGuardVisible: true,
      documentList: [],
      isShowingMoreInfo: false
    }
  },
  computed: {
    isEnrollmentCodeBlocker() {
      return hasEnrollmentBlock()
    },
    infoConversationMsg() {
      let maxLetters = 90

      if (this.$q.screen.width > 991)
        maxLetters = 121
      else if (this.$q.screen.lt.md)
        maxLetters = 84
      if (this.$q.screen.width < 400)
        maxLetters = 75
      let msg = "Le conversazioni che avvengono attraverso questo servizio non sostituiscono in alcun modo il colloquio o la visita medica, pertanto non hanno valore né di prescrizione né di consulto medico"

      return this.isShowingMoreInfo ? msg : truncate(msg, maxLetters)

    },
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    userDoctor() {
      return this.$store.getters["getUserDoctor"];
    },
    argument() {
      return this.conversation?.argomento ?? ''
    },
    doctor() {
      return this.conversation?.medico

    },
    doctorName() {
      let lastName = this.doctor?.cognome ?? "";
      let firstName = this.doctor?.nome ?? "";
      return [firstName, lastName]
        .map(el => el.trim())
        .filter(el => !!el)
        .join(" ");
    },
    canShowReadNotification() {
      return this.userDoctor?.notifica_lettura_messaggi
    },
    isUserEnabled() {
      return isUserEnabled()
    },
    blocked() {
      return this.conversation?.sola_lettura || !this.isUserEnabled
    },
    doctorIcon() {
      return doctorIcon(this.doctor?.codice_fiscale)
    },
    areAllMessagesLoaded() {
      return this.messagesListLength >= this.totalMessagesCount
    },
    messagesListLength() {
      return this.messagesList?.length ?? 0
    },
    noMessages() {
      return this.totalMessagesCount <= 0;
    },
    conversationEndDate() {
      return this.conversation?.data_eliminazione
    },
    blockDoctorMotivation() {
      return this.conversation?.motivo_blocco?.codice
    },
    blockDoctorMotivationLabel() {
      return this.conversation?.motivazione_medico
    },
    orderedMessageList() {
      return orderBy(this.messagesList, ['data_creazione'], ['asc']) ?? []
    },
    filteredMessageList() {
      let list = []
      if (this.searchInput.length > 0) {
        let regex = searchMessageRegex(this.searchInput)
        list = this.orderedMessageList?.filter(msg => msg.testo.match(regex)) ?? []
        list = orderBy(list, ['data_creazione'], ['desc'])

      }
      return list
    },
    searchedString() {
      return this.showFilteredMsg ? this.searchInput : ''
    },
    isEmptyMessage() {
      // verifico che il messaggio non sia vuoto
      let emptyMessage = !this.messageText.replace(/\s/g, '').length
      return emptyMessage && this.attachments?.length <= 0
    },
    pageHeightStyle() {
      let height = this.isUserEnabled ? '100vh' : '900px'
      return `height: ${height}`
    }
  },
  watch: {
    Screen: {
      immediate: true,
      deep: true,
      handler(val, oldVal) {
        if (this.showFilteredMsg) {
          if (val.gt.sm) {
            this.splitterModel = 60
          } else {
            this.splitterModel = MAX_SPLITTER
          }
        }
      }

    }
  },
  async created() {

    if (this.isEnrollmentCodeBlocker) return
    this.$store.dispatch('setDocumentList', {documents: []})
    let {id, conversation} = this.$route.params

    if(!id){
      this.$router.replace(CONVERSATION_LIST)
      return
    }

    this.fromHome = !!this.$route.query?.home
    this.id = id
    this.splitterModel = MAX_SPLITTER
    this.isLoading = true


    if (!conversation) {
      let params = {
        sola_lettura: CONVERSATION_READ_STATUS.ALL,
        id_conversazione: id,
        limit: 10,
        offset: 0
      }
      try {
        let response = await getConversationList(this.taxCode, {params})
        conversation = response?.data[0]
      } catch (error) {
        let message = "Non è stato possibile recuperare la conversazione."
        apiErrorNotify({error, message})
      }
    }

    this.conversation = conversation

    // Lista dei messaggi
    let params = {
      limit: LIMIT,
      offset: 0
    }
    let promiseMessageList = getMessageList(this.taxCode, id, {params});
    let promiseAttachment = null

    // Gestione allegato da Ritiro e consultazione documenti
    let {idDoc, cat, cl} = this.$route.query
    if (idDoc && cat && cl) {
      let params = {
        categoria: cat,
        componente_locale: cl,

      };

      console.log('attachment,', params)
      promiseAttachment = getDocumentDetail(this.taxCode, idDoc, {params});
    }


    try {
      let response = await promiseMessageList;
      this.messagesList = response.data ?? []
      this.totalMessagesCount = parseInt(response.headers['x-total-elements']) ?? this.messagesList?.length
    } catch (error) {
      let message = "Non è stato possibile recuperare la lista dei messaggi."
      apiErrorNotify({error, message})
      this.totalMessagesCount = this.messagesList?.length ?? 0
    }

    if (promiseAttachment) {
      try {
        let {data} = await promiseAttachment
        let document = data?.documento;
        if (document) {

          let accessionNumbers = document.accession_numbers?.map(an => {
            return an.accession_number
          })

          let attachment = {
            id_documento_ilec: document.id_documento_ilec,
            codice_cl: document.codice_cl,
            azienda: document.metadati?.azienda,
            descrizione_struttura: document.metadati?.descrizione_struttura,
            data_validazione: document.metadati?.data_validazione,
            tipo_documento: document.metadati?.tipo_documento,
            tipo_contributo: document.metadati?.tipo_contributo,
            id_episodio: document.episodio?.id_episodio,
            codice_documento_dipartimentale: document.metadati?.codice_documento_dipartimentale,
            id_repository_cl: document.metadati?.id_repository_cl,
            categoria_tipologia: document.categoria,
            accession_numbers: accessionNumbers
          }

          this.attachments.push(attachment)
        }


      } catch (error) {
        let message = "Non è stato possibile caricare l'allegato";
        apiErrorNotify({error, message});
      }

    }

    this.isLoading = false

  },
  methods: {
    attachmentName,
    onBack() {
      if (this.fromHome) {
        let goTo = "/la-mia-salute/";
        window.location.assign(goTo);
      } else {
        this.$router.back();
      }

    },
    onAttachment(attachment) {
      this.showDocumentListDialog = false
      this.attachments.push(attachment)
    },

    removeAttachment(id) {
      this.attachments = this.attachments.filter(a => a.id_documento_ilec !== id)
    },

    async loadMessageList() {
      this.isSearchingMessages = true

      let params = {
        limit: LIMIT,
        offset: this.offset
      }

      try {
        let response = await getMessageList(this.taxCode, this.id, {params});
        if (this.offset === 0) {
          this.reloadCount++
          this.messagesList = response.data ?? []
          console.log(' this.messagesList', this.messagesList)
        } else {
          this.messagesList = [...this.messagesList, ...response.data] ?? [];
        }
        this.offset = this.messagesListLength
        this.totalMessagesCount = parseInt(response.headers['x-total-elements']) ?? this.messagesListLength
        if (this.showFilteredMsg)
          this.onFocusMessage(0)
      } catch (error) {
        let message = "Non è stato possibile recuperare la lista dei messaggi."
        apiErrorNotify({error, message})
        this.totalMessagesCount = this.messagesListLength ?? 0
      }
      this.isSearchingMessages = false
    },
    async onLoadMessages(index, done) {


      if (this.areAllMessagesLoaded || this.noMessages) {
        //this.$refs.messagesInfiniteScroll.stop()
        done();
        return

      }

      await this.loadMessageList()
      done();
      this.isLoading = false

    },
    async setEditMessage() {
      let payload = {
        testo: this.messageText,
        allegati: this.attachments ?? []
      }
      try {
        let {data: message} = await editMessage(this.taxCode, this.id, this.editableMessage?.id, payload)

        this.sentMessage = true
        let newMessageList = this.messagesList?.map(msg => {
          msg.modificabile = false
          if (msg.id !== message?.id) {
            return msg
          } else {
            return message
          }
        })

        console.log(newMessageList)
        // newMessageList.push(message)
        this.messagesList = newMessageList
        this.messageText = ''
        this.attachments = []
        this.editableMessage = null

        return message
      } catch (error) {
        let message = 'Non è stato possibile modificare il messaggio'
        apiErrorNotify({error, message})
      }
    },
    async sendMessage() {
      if (this.isEmptyMessage) return


      this.isSendingMessage = true

      let message = null
      if (this.isEditingMsg) {
        message = await this.setEditMessage()
      } else {
        message = await this.sendNewMessage()
      }
      this.reloadCount++
      this.isEditingMsg = false
      this.isSendingMessage = false
      // this.offset=0
      // await this.loadMessageList()

      let lastMessageItem = this.getMessageRef(message?.id)
      this.$refs.messageScrollArea.setScrollPosition('vertical', lastMessageItem.offsetTop, 300)

    },
    async sendNewMessage() {

      let payload = {
        testo: this.messageText,
        allegati: this.attachments
      }
      try {
        let {data: message} = await newMessage(this.taxCode, this.id, payload)

        let newMessageList = this.messagesList?.map(msg => {
          msg.modificabile = false
          return msg
        })
        newMessageList.push(message)
        this.messagesList = newMessageList
        this.sentMessage = true
        this.messageText = ''
        this.attachments = []
        this.editableMessage = null
        return message
      } catch (error) {
        let message = 'Non è stato possibile inviare il messaggio'
        apiErrorNotify({error, message})
      }


    },
    filterMessages(val) {
      if (val?.length === 0) {
        this.cleanSearch(false)
      }


    },

    onInputSearchFab(val) {
      this.showSearchInput = val
      this.splitterModel = MAX_SPLITTER
      this.cleanSearch()
    },
    cleanSearch(cleanInput = true) {
      if (cleanInput) {
        this.searchInput = ''
      }

      this.showFilteredMsg = false
      this.messageFocused = null
      this.splitterModel = MAX_SPLITTER
    },
    showFilteredMessages() {
      if (this.searchInput?.length === 0) return

      if (this.$q.screen.gt.sm) {
        this.splitterModel = 60
      } else {
        this.splitterModel = MAX_SPLITTER
        let length = this.filteredMessageList.length
        if (length > 0) {

          this.messageFocused = this.filteredMessageList[0]
          this.messageFocusedIndex = 0
          this.onSearchMessage(this.messageFocused)
        }
      }
      this.showFilteredMsg = true
    },
    onSearchMessage(message) {
      this.messageFocused = message
      let index = this.orderedMessageList.indexOf(message)
      console.log('onSearchMessage', index)

      this.$nextTick(() => {
        let messageItem = this.getMessageRef(message.id)
        if (messageItem) scrollToElement(messageItem);
      });

    },
    onEditMessage(message) {
      console.log('onEditMessage')
      this.isEditingMsg = true
      this.editableMessage = message
      this.messageText = message.testo ?? ''
      this.attachments = message.allegati ?? []
    },
    closeEditing() {
      this.isEditingMsg = false
      this.editableMessage = null
      this.messageText = ''
      this.attachments = []
    },
    onFocusMessage(index) {
      console.log('onFocusMessage', index)
      this.messageFocused = this.filteredMessageList[index]
      console.log([this.messageFocused, index])
      this.messageFocusedIndex = index
      this.onSearchMessage(this.messageFocused)
    },


    async showDocument(attachment) {
      console.log('attachment', attachment)
      this.showDocumentDetail = true
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = attachment.id_documento_ilec;
      let category = attachment.categoria_tipologia
      let cl = attachment.codice_cl
      let params = {
        categoria: category,
        componente_locale: cl,

      };
      this.selectedDocument = null
      this.isLoadingDocumentDetail = true;
      try {
        let {data} = await getDocumentDetail(taxCode, documentId, {params});
        this.selectedDocument = data?.documento;

      } catch (error) {
        let message = "Non è stato possibile caricare il documento";
        apiErrorNotify({error, message});
        this.showDocumentDetail = false
      }

      this.isLoadingDocumentDetail = false;

    },

    scrollFire(position, message) {
      if (message.letto || message.autore?.tipo !== MSG_AUTHOR_MAP?.DOCTOR) {
        return
      }
      let messageItem = this.getMessageRef(message.id)
      let offset = messageItem.offsetTop
      let scrollArea = this.$refs.messageScrollArea.getScroll()
      let scrollAreaHeight = scrollArea.verticalContainerSize
      if (offset - position <= scrollAreaHeight && offset > position) {
        this.setByRead(message)
      }


    },
    async setByRead(message) {

      //Evitiamo di chiamare diverse volte il servizio prima della risposta
      // this.messagesList = this.messagesList.map(m => {
      //   if (m.id === message.id)
      //     m.letto = true
      //
      //   return m
      // })

      //Evitiamo di chiamare diverse volte il servizio prima della risposta
      let index = this.messagesList.indexOf(message)
      this.messagesList[index].letto = true

      try {
        let response = await setMessageAsRead(this.taxCode, this.id, message.id)
      } catch (e) {
      }


    },
    getMessageRef(id) {
      return this.$refs['messageItem' + id][0]
    },
    onClickBlockBtn() {
      if (this.blockDoctorMotivation)
        this.showBlockMotivationDialog = true
    },
    onHideEnrollmentGuard() {
      this.isEnrollmentGuardVisible = false
    },
    toggleMoreInfo() {
      this.isShowingMoreInfo = !this.isShowingMoreInfo
    }
  }
}
</script>

<style lang="sass">
.block-btn
  &.readonly
    cursor: default

    &:hover, &:active, &:focus
      .q-focus-helper
        background: transparent !important


.search-input
  margin-right: 60px
  position: absolute
  width: 0px !important
  right: 0px
  transition: width 0.5s ease-out 0s

  .search-input__field
    opacity: 0
    transition: 0.5s

  &.active
    width: 300px !important
    transition: width 0.5s ease-out 0s

    .search-input__field
      opacity: 1
      transition: 0.5s

@media (max-width: $breakpoint-md-min)
  .search-input
    &.active
      width: 250px !important

#message-splitter
  .q-splitter__panel.q-splitter__before
    transition: width 0.2s linear 0s

.attachment-chip
  height: auto !important
  min-height: 2em

  .q-chip__content
    white-space: normal

#new-message-input
  textarea
    max-height: 85px


</style>
