<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title v-if="!isEnrollmentCodeBlocker" class="q-mb-lg" @back="onBack">Conversazione</lms-page-title>
    <div class="q-my-md">
      <the-guard-enrollment2/>
    </div>

    <template v-if="!isEnrollmentCodeBlocker">
      <template v-if="isLoading">
        <cod-conversation-detail-skeleton/>
      </template>
      <template v-else-if="conversation">
        <lms-banner class="q-mb-lg" type="info">
          Le conversazioni che avvengono attraverso questo servizio non sostituiscono in alcun modo il colloquio o la
          visita medica, pertanto non hanno valore né di prescrizione né di consulto medico
        </lms-banner>

        <lms-banner v-if="blocked" class="q-mb-lg" type="info">
          <strong>Conversazione in sola lettura</strong><br>
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


        <q-card class="q-my-md ">
          <q-card-section class="bg-grey-3">
            <div class="q-mb-md row items-start">
              <div v-if="doctor" class="col">
                <q-item class="q-mb-md">
                  <q-item-section avatar>
                    <q-icon :name="doctorIcon" size="lg"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-caption">Destinatario</q-item-label>
                    <q-item-label><strong>{{ doctorName }}</strong></q-item-label>

                  </q-item-section>
                </q-item>
              </div>

              <div v-if="conversation.ultimo_messaggio" class="col-auto  row items-start">
                <q-item class="q-pr-xs gt-xs">
                  <!--                <q-item-section avatar>-->
                  <!--                  <q-icon name="img:icone/icon_alert.svg" size="lg"/>-->
                  <!--                </q-item-section>-->
                  <q-item-section class="items-start">
                    <q-item-label class="text-caption">
                      Data eliminazione
                    </q-item-label>
                    <q-item-label><strong>{{ conversationEndDate | date }}</strong></q-item-label>
                  </q-item-section>
                </q-item>
                <q-btn
                  :size="$q.screen.gt.xs ? 'sm' : 'md'"
                  aria-label="Maggiori informazioni"
                  class="q-mt-xs"
                  color="secondary"
                  dense
                  flat
                  icon="o_info"
                  round
                  @click="showEndDateInfo =true"
                />
              </div>

            </div>

            <div class="row items-center justify-between">

              <q-item class="col-12 col-md">
                <q-item-section avatar>
                  <q-icon name="img:/statics/la-mia-salute/icone/argomento.svg" size="lg"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-caption">Argomento</q-item-label>
                  <q-item-label><strong>{{ argument | empty }}</strong></q-item-label>
                </q-item-section>
              </q-item>

              <div v-if="messagesListLength>0" class="col-12 col-md-6 text-right">

                <div :class="{'q-mt-md': $q.screen.lt.md}" class="row items-center reverse">
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
          <!-- ---------   LISTA MESSAGGI ------------------------>
          <!------------------------------------------------------------------------------------------------------------>
          <q-slide-transition>

            <q-card-section class="no-padding">

              <template
              >
                <q-splitter
                  id="message-splitter"
                  v-model="splitterModel"
                  :limits="[0, 100]"
                  disable
                  style="height: 350px"
                >
                  <template v-slot:before>
                    <!-- ---------   LISTA MESSAGGI ------------------------>
                    <!------------------------------------------------------------------------------------------------------------>

                    <q-scroll-area
                      v-show="messagesListLength>0"
                      id="message-scroll-area"
                      ref="messageScrollArea"
                      class="q-mr-sm"
                      style="height: 350px;"
                      visible
                    >

                      <q-infinite-scroll ref="messagesInfiniteScroll" :debounce="100"
                                         :offset="10"
                                         reverse scroll-target="#message-scroll-area .q-scrollarea__container"
                                         style="height: 350px;" @load="onLoadMessages">
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
                    <template v-if="!isSearchingMessages && messagesListLength<=0">
                      <lms-banner class="q-mx-md" type="info">
                        Nessun messaggio
                      </lms-banner>
                    </template>
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
                <!-- ---------   RICERCA MESSAGGI (MOBILE) ------------------------>
                <!------------------------------------------------------------------------------------------------------------>
                <template v-if="$q.screen.lt.md && showFilteredMsg">
                  <div class="bg-secondary" style="margin-bottom: -16px">
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

                          <template v-if="!areAllMessagesLoaded && messageFocusedIndex>=filteredMessageList.length-1">
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
                </template>
              </template>


            </q-card-section>
          </q-slide-transition>
        </q-card>
        <!--     NUOVO MESSAGGIO-->
        <q-card v-if="!blocked">
          <q-card-section v-if="isEditingMsg" class="q-pb-none">
            <q-item class="q-px-none " dense>
              <q-item-section side>
                <q-icon color="primary" name="edit"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold text-primary">Modifica messaggio</q-item-label>
                <q-item-label v-if="editableMessage" caption lines="1">{{ editableMessage.testo }}</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-btn color="primary" dense flat icon="close" outline rounded @click="closeEditing"></q-btn>
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-section>
            <q-input v-model="messageText"
                     bg-color="white"
                     no-error-icon
                     outlined
                     placeholder="Scrivi messaggio"
                     type="textarea"
            />

            <div v-if="attachments && attachments.length >0" class="q-mt-lg">
              <q-chip v-for="attachment in attachments" :key="attachment.id_documento_ilec" class="attachment-chip"
                      color="grey-3" removable
                      square @remove="removeAttachment(attachment.id_documento_ilec)">
                <strong class="q-pr-sm">{{ attachmentName(attachment) }}</strong>
              </q-chip>
            </div>

            <div class="q-pt-md">
              <a class="lms-link " href="#" @click.prevent="showDocumentListDialog = true">
                <q-icon name="attach_file" size="xs"></q-icon>

                Condividi documento del Fascicolo Sanitario</a>
            </div>

            <lms-buttons class="q-mt-md">
              <lms-button :disabled="isEmptyMessage" :loading="isSendingMessage" @click="sendMessage">Invia</lms-button>
            </lms-buttons>


          </q-card-section>
        </q-card>
      </template>

      <!--DIALOGS-->

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
      </template>

    </template>

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


const MAX_SPLITTER = 110
const LIMIT = 20
export default {
  name: "PageConversationDetailOld",
  components: {
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
      documentList: []
    }
  },
  computed: {
    isEnrollmentCodeBlocker() {
      return hasEnrollmentBlock()
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
      return `${this.doctor?.nome} ${this.doctor?.cognome}`
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
      let emptyMessage = !this.messageText?.replace(/\s/g, '')?.length
      return emptyMessage && this.attachments?.length <= 0
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
    }
  }
}
</script>

<style lang="sass">
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


</style>
