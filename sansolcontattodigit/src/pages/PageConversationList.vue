<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div class="q-my-md">
      <the-guard-enrollment2/>
    </div>

    <template v-if="!isEnrollmentCodeBlocker">
      <the-guard-messages/>

      <!-- FILTRI -->
      <!-- ------ -->
      <div :class="{'reverse': $q.screen.gt.xs}" class="q-mb-sm row items-center justify-between q-col-gutter-lg">
        <div v-if="canCreateConversations" class="col-12 col-md">
          <lms-buttons>
            <lms-button @click="showNewConversationDialog=true">Nuova conversazione</lms-button>
          </lms-buttons>
        </div>
        <div v-if="firstSearch || conversationList.length>0" class="col-12 col-md">
          <div class="row items-center">
            <div class="col">
              <q-input
                v-model="argumentFilter"
                clearable
                dense
                label="Argomento"
                @clear="setFilter"
                @keyup.space.enter="setFilter"
              />
            </div>

            <div class="col-auto q-pl-xs">
              <q-btn color="primary" flat icon="search" round @click="setFilter"/>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="q-pt-xl column items-stretch justify-center">
        <div v-for="i in 5" :key="i" class="q-my-sm">
          <cod-conversation-item-skeleton/>
        </div>
      </div>

      <div v-else-if="conversationList.length>0" class="q-pt-xl column items-stretch justify-center">

        <div v-for="conversation in conversationList" :key="conversation.id" class="q-my-sm ">
          <cod-conversation-item :conversation="conversation"/>
        </div>

        <template v-if="hasMoreConversations">
          <div class="q-mt-md text-center">
            <q-btn
              :loading="isLoadingConversationsMore"
              color="primary"
              dense
              flat
              @click="loadConversationListMore"
            >
              Carica altre
            </q-btn>
          </div>
        </template>

      </div>
      <div v-else class="q-pt-lg">
        <lms-banner type="info">
          Non ci sono conversazioni
        </lms-banner>
      </div>

      <cod-conversation-new-dialog v-model="showNewConversationDialog"/>

    </template>

  </lms-page>
</template>

<script>
import LmsBanner from "components/core/LmsBanner";
import CodConversationItem from "components/CodConversationItem";
import CodConversationNewDialog from "components/CodConversationNewDialog";
import {getConversationList, getPatientBlockInfo} from "src/services/api";
import {CONVERSATION_READ_STATUS, USER_ENABLING_MAP} from "src/services/config";
import CodConversationItemSkeleton from "components/loaders/CodConversationItemSkeleton";
import {apiErrorNotify, isEmpty} from "src/services/utils";
import TheGuardEnrollment2 from "components/TheGuardEnrollment2";
import {hasEnrollmentBlock, hasEnrollmentWarning, isUserEnabled} from "src/services/business-logic";
import TheGuardMessages from "components/TheGuardMessages";

const LIMIT = 20

export default {
  name: "PageConversationList",
  components: {
    TheGuardMessages,
    TheGuardEnrollment2,
    CodConversationItemSkeleton, CodConversationNewDialog, CodConversationItem, LmsBanner
  },
  data() {
    return {
      isLoading: false,
      isLoadingConversationsMore: false,
      conversations: [],
      argumentFilter: '',
      showNewConversationDialog: false,
      offset: 0,
      firstSearch: false,
      conversationListTotalCount: Number.MAX_SAFE_INTEGER
    }
  },
  computed: {
    isEnrollmentCodeBlocker() {
      return hasEnrollmentBlock()
    },
    user() {
      return this.$store.getters["getUser"];
    },
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    canCreateConversations() {
      return isUserEnabled()
    },
    hasMoreConversations() {
      return (this.conversations.length < this.conversationListTotalCount) && this.conversationListTotalCount > 0
    },
    conversationList(){
      let conversations = this.conversations
      if (!this.canCreateConversations) {
        conversations =  conversations?.map(conversation => {
          conversation.sola_lettura = true
          return conversation
        })
      }

      return conversations
    }

  },
  async created() {
    if(this.isEnrollmentCodeBlocker) return
    this.isLoading = true
    await this.getConversationList()
    this.isLoading = false
  },
  methods: {
    async getConversationList() {
      let params = {
        limit: LIMIT,
        offset: this.offset,
        sola_lettura: CONVERSATION_READ_STATUS.ALL,
        argomento: !isEmpty(this.argumentFilter) ? this.argumentFilter : null
      }

      try {
        let response = await getConversationList(this.taxCode, {params})
        let conversations = response?.data
        let headers = response?.headers
        this.conversations = [...this.conversations, ...conversations]
        this.offset = this.conversations.length
        this.conversationListTotalCount = parseInt(headers['x-total-elements'])
        if(this.conversationList.length>0)
          this.firstSearch = true
      } catch (error) {
        let message = "Non è stato possibile recuperare la lista delle conversazioni."
        apiErrorNotify({error, message})
      }


    },
    async setFilter() {
      this.offset = 0
      this.conversations = []
      this.conversationListTotalCount = Number.MAX_SAFE_INTEGER
      this.isLoading = true
      await this.getConversationList()
      this.isLoading = false
    },
    async loadConversationListMore() {
      this.isLoadingConversationsMore = true
      await this.getConversationList()
      this.isLoadingConversationsMore = false
    }
  }
}
</script>

<style scoped>

</style>
