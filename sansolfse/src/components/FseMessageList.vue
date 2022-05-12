<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="fse-message-list">
    <template v-if="!isLoadingMessageList && messageList.length > 0">
      <div class="q-gutter-y-md">
        <fse-message-list-item
          v-for="message in messageList"
          :key="message.id"
          :message="message"
        />
      </div>
    </template>
  </div>
</template>

<script>
  import {apiErrorNotifyDialog} from "../services/utils";
import { getFseMessageList } from "../services/api";
import FseMessageListItem from "./FseMessageListItem";

export default {
  name: "FseMessageList",
  components: { FseMessageListItem },
  props: {},
  data() {
    return {
      isLoadingMessageList: false,
      messageList: []
    };
  },
  computed: {},
  created() {
    this.loadMessageList();
  },
  methods: {
    async loadMessageList() {
      this.isLoadingMessageList = true;

      try {
        let { data } = await getFseMessageList();
        this.messageList = data;
      } catch (error) {
        let message = "Non è stato possibile caricare l'elenco dei messaggi";
        apiErrorNotifyDialog({ error, message });
      }

      this.isLoadingMessageList = false;
    }
  }
};
</script>

<style scoped lang="sass"></style>
