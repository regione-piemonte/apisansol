<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus"></style>


<template>

  <q-item @click.native="isEmailModalOpen = true">
    <q-item-side icon="email" color="secondary"></q-item-side>
    <q-item-main>
      <q-item-tile label>
        Email
        <span v-if="required">*</span>
      </q-item-tile>
      <q-item-tile v-if="isEmpty(email_)" sublabel>Aggiungi</q-item-tile>
      <q-item-tile v-else sublabel>{{email_}}</q-item-tile>
    </q-item-main>
    <q-item-side v-if="isEmpty(email_)" right icon="keyboard_arrow_right" color="primary"></q-item-side>
    <q-item-side v-else right icon="edit" color="faded"></q-item-side>





    <!-- MODAL EMAIL -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-modal
      v-model="isEmailModalOpen"
      :content-css="{minWidth: '60vw', minHeight: '90vh'}">
      <!-- @note: `v-if` permette di resettare il contenuto della modal alla chiusura -->
      <csi-contact-email-modal v-if="isEmailModalOpen" @email-verified="onEmailVerified"></csi-contact-email-modal>
    </q-modal>
  </q-item>
</template>


<script>
  import CsiContactEmailModal from "components/global/user-profile/CsiContactEmailModal";
  import {isEmpty} from "@services/global/utils";

  export default {
    name: 'CsiContactEmailItem',
    components: {CsiContactEmailModal},
    props: {
      email: {required: true},
      required: {type: Boolean, required: false, default: false}
    },
    data() {
      return {
        isEmailModalOpen: false,
        email_: this.email
      }
    },
    methods: {
      isEmpty,
      onEmailVerified(newEmail) {
        this.email_ = newEmail;
        this.$emit('email-verified', ...arguments);
      }
    }
  }
</script>
