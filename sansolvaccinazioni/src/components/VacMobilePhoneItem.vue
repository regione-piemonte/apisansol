<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-item clickable @click="isSmsModalOpen = true">
    <q-item-section side>
      <q-icon name="phone" color="secondary" />
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1" class="text-subtitle1">{{ label }}</q-item-label>
      <q-item-label  class="text-grey-7">
        {{
          mobilePhone_ | trimLeft(MOBILE_PHONE_PREFIX_ITALY) | empty("Aggiungi")
        }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-icon
        :name="mobilePhone_ ? 'edit' : 'faded'"
        :color="mobilePhone_ ? 'keyboard_arrow_right' : 'primary'"
      />
    </q-item-section>

    <!-- DIALOG -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isSmsModalOpen">
      <vac-mobile-phone-dialog
        v-model="isSmsModalOpen"
        @mobile-phone-verified="onMobilePhoneVerified"
      />
    </template>
  </q-item>
</template>

<script>
import { MOBILE_PHONE_PREFIX_ITALY } from "../services/utils";
import VacMobilePhoneDialog from "components/VacMobilePhoneDialog";

export default {
  name: "VacMobilePhoneItem",
  components: {VacMobilePhoneDialog },
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
