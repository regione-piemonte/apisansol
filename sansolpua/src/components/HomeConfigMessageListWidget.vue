<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div
    v-if="messagesList && messagesList.length > 0"
    class="hopme-config-message-list-widget"
  >
    <div
      v-for="(message, index) in messagesList"
      :key="index"
      class="q-pb-md"
    >
      <home-config-message-item :message="message"/>
    </div>
  </div>
</template>

<script>
import {date} from "quasar";
import HomeConfigMessageItem from "components/HomeConfigMessageItem";

export default {
  name: "HomeConfigMessageListWidget",
  components: {HomeConfigMessageItem},
  props:{

  },
  computed:{
    messagesList(){
      return this.$store.getters["getConfigMessagesActive"];
    },

  }
}
</script>

<style scoped>

</style>
