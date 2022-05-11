<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-item class="q-item-profile" clickable @click="isSmsModalOpen = true">
    <q-item-section side>
      <q-icon name="phone" color="secondary" size="md"/>
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-subtitle1">Numero telefono</q-item-label>
      <q-item-label >
        {{
          mobilePhone_ | trimLeft(MOBILE_PHONE_PREFIX_ITALY) | empty("Aggiungi")
        }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-icon
        :name="mobilePhone_ ? 'edit' : 'keyboard_arrow_right'"
        :color="mobilePhone_ ? 'faded' : 'primary'"
      />
    </q-item-section>

    <!-- DIALOG -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isSmsModalOpen">
      <account-mobile-phone-modal
        v-model="isSmsModalOpen"
        @mobile-phone-verified="onMobilePhoneVerified"
      />
    </template>
  </q-item>
</template>

<script>
import { MOBILE_PHONE_PREFIX_ITALY } from "../services/utils";
import AccountMobilePhoneModal from "./AccountMobilePhoneModal";

export default {
  name: "AccountMobilePhoneItem",
  components: { AccountMobilePhoneModal },
  props: {
    mobilePhone: { required: true },
    label: { type: String, required: false, default: "Numero telefono" }
  },
  data() {
    return {
      MOBILE_PHONE_PREFIX_ITALY,
      isSmsModalOpen: false,
      mobilePhone_: this.mobilePhone
    };
  },
  methods: {
    onMobilePhoneVerified(newMobilePhone) {
      this.mobilePhone_ = newMobilePhone;
      this.$emit("mobile-phone-verified", ...arguments);
    }
  }
};
</script>

<style lang="sass"></style>
