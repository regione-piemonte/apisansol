<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-alert class="csi-config-dynamic-message-list-item" :color="color">
<!--    <template v-if="title">-->
<!--      <div class="csi-config-dynamic-message-list-item__title">-->
<!--        {{title}}-->
<!--      </div>-->
<!--    </template>-->

    <div v-html="body" class="csi-config-dynamic-message-list-item__body"></div>
  </q-alert>
</template>


<script>

  const COLOR_FALLBACK = 'info';
  const COLOR_MAP = {
    18: 'warning',
    19: 'info'
  };

  export default {
    name: 'CsiConfigDynamicMessageListItem',
    components: {},
    props: {
      message: {type: Object, required: false, default: null}
    },
    data() {
      return {
        messageList: []
      }
    },
    computed: {
      title() {
        return this.message && this.message.title
      },
      body() {
        return this.message && this.message.body
      },
      typeId() {
        return this.message && this.message.tipo_di_messaggio && this.message.tipo_di_messaggio.id
      },
      color(){
        let result = COLOR_MAP[this.typeId]
        return result || COLOR_FALLBACK
      },
    },
    created() {
    },
    methods: {},
  }
</script>


<style lang="stylus">
  .csi-config-dynamic-message-list-item__title
    font-weight: bold
    font-size: 16px
    margin-bottom: 16px

  .csi-config-dynamic-message-list-item__body
    font-size: 16px

  .csi-config-dynamic-message-list-item__body p:last-of-type
    margin-bottom: 0
</style>
