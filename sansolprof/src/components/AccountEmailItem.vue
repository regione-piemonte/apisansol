<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-item class="q-item-profile" clickable @click="isEmailModalOpen = true">
    <q-item-section side>
      <q-icon name="email" color="secondary" size="md"/>
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1" class="text-subtitle1">Email</q-item-label>
      <q-item-label>
        {{ email_ | empty("Aggiungi") }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-icon
        :name="email_ ? 'edit' : 'keyboard_arrow_right'"
        :color="email_ ? 'faded' : 'primary'"
      />
    </q-item-section>

    <!-- MODAL EMAIL -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isEmailModalOpen">
      <account-email-dialog
        v-model="isEmailModalOpen"
        @email-verified="onEmailVerified"
      />
    </template>
  </q-item>
</template>

<script>
import AccountEmailDialog from "./AccountEmailDialog";

export default {
  name: "AccountEmailItem",
  components: { AccountEmailDialog },
  props: {
    email: { required: true },
    required: { type: Boolean, required: false, default: false },
    label: { type: String, required: false, default: "Email" }
  },
  data() {
    return {
      isEmailModalOpen: false,
      email_: this.email
    };
  },
  methods: {
    onEmailVerified(newEmail) {
      this.email_ = newEmail;
      this.$emit("email-verified", ...arguments);
    }
  }
};
</script>

<style lang="sass"></style>
