<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-item clickable @click="isEmailModalOpen = true">
    <q-item-section side>
      <q-icon name="email" color="secondary" size="md" />
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1" class="text-subtitle1">
        <span v-if="required">*</span>
        {{ label }}
      </q-item-label>
      <q-item-label class="text-grey-7">
        {{ email_ | empty("Aggiungi") }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-icon
        :name="email_ ? 'edit' : 'faded'"
        :color="email_ ? 'keyboard_arrow_right' : 'primary'"
      />
    </q-item-section>

    <!-- MODAL EMAIL -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isEmailModalOpen">
      <vac-email-dialog
        v-model="isEmailModalOpen"
        @email-verified="onEmailVerified"
      />
    </template>
  </q-item>
</template>

<script>
import VacEmailDialog from "./VacEmailDialog";

export default {
  name: "VacEmailItem",
  components: { VacEmailDialog },
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
