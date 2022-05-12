<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus"></style>


<template>
  <q-item @click.native="isSmsModalOpen = true">
    <q-item-side icon="phone" color="secondary"></q-item-side>
    <q-item-main>
      <q-item-tile label>Numero telefono</q-item-tile>
      <q-item-tile v-if="isEmpty(mobilePhone_)" sublabel>Aggiungi</q-item-tile>
      <q-item-tile v-else sublabel>{{mobilePhone_ | mobilePhoneStripPrefix}}</q-item-tile>
    </q-item-main>
    <q-item-side v-if="isEmpty(mobilePhone_)" right icon="keyboard_arrow_right" color="primary"></q-item-side>
    <q-item-side v-else right icon="edit" color="faded"></q-item-side>



    <!-- MODAL SMS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-modal
      v-model="isSmsModalOpen"
      :content-css="{minWidth: '60vw', minHeight: '90vh'}">
      <!-- @note: `v-if` permette di resettare il contenuto della modal alla chiusura -->
      <csi-contact-mobile-phone-modal
        v-if="isSmsModalOpen"
        @mobile-phone-verified="onMobilePhoneVerified">
      </csi-contact-mobile-phone-modal>
    </q-modal>
  </q-item>
</template>


<script>
  import CsiContactMobilePhoneModal from "components/global/user-profile/CsiContactMobilePhoneModal";
  import {isEmpty} from "@services/global/utils";

  export default {
    name: 'CsiContactMobilePhoneItem',
    components: {CsiContactMobilePhoneModal},
    props: {
      mobilePhone: {required: true},
    },
    data() {
      return {
        isSmsModalOpen: false,
        mobilePhone_: this.mobilePhone,
      }
    },
    methods: {
      isEmpty,
      onMobilePhoneVerified(newMobilePhone){
        this.mobilePhone_ = newMobilePhone;
        this.$emit('mobile-phone-verified', ...arguments);
      }
    }
  }
</script>
