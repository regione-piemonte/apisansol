<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div
    v-if="messageListFiltered && messageListFiltered.length > 0"
    class="csi-config-dynamic-message-list csi-group-card"
  >
    <div
      v-for="(message, index) in messageListFiltered"
      :key="index"
    >
      <csi-config-dynamic-message-list-item :message="message"/>
    </div>
  </div>
</template>


<script>
  import CsiConfigDynamicMessageListItem from "components/global/common/CsiConfigDynamicMessageListItem";

  export default {
    name: 'CsiConfigDynamicMessageList',
    components: {CsiConfigDynamicMessageListItem},
    props: {
      home: {type: Boolean, required: false, default: false},
      serviceCode: {type: String, required: false, default: null},
    },
    data() {
      return {}
    },
    computed: {
      appConfig() {
        return this.$store.getters['global/appConfig'];
      },
      messageList() {
        return this.$store.getters['global/getMessageList'];
      },
      messageListFiltered() {
        let result = this.messageList;

        if (this.home) {
          result = this.messageList.filter(m => m.field_pubblica_in_home_page);
        }

        if (this.serviceCode) {
          result = this.messageList.filter(m => {
            let serviceList = m.field_servizi_collegati || [];
            return serviceList.some(s => s.codice_servizio === this.serviceCode);
          })
        }

        return result;
      },
    },
    created() {
    },
    methods: {},
  }
</script>


<style lang="stylus">
</style>
