<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-item class="q-item-profile">
    <q-item-section class="text-subtitle1">
      <slot name="name">
        <!--            {{ name | lowerCase | capitalize }}-->
        {{ name | capitalize}}
      </slot>
    </q-item-section>

    <template v-if="!value">
      <q-item-section side>
        <slot name="no-data">
          <q-spinner />
        </slot>
      </q-item-section>
    </template>

    <template v-else>
      <q-item-section side>
        <div>
          <lms-checkbox-button
            :value="value"
            :disable="disablePush"
            checked-value="push"
            checked-icon="notifications"
            checked-color="primary"
            unchecked-value=""
            unchecked-icon="notifications_none"
            unchecked-color="black"
            color="primary"
            class="q-pa-sm"
            @input="$emit('input', $event)"
          >
            <q-tooltip v-if="disablePush">
              Push non disponibile per questo servizio
            </q-tooltip>
          </lms-checkbox-button>

          <lms-checkbox-button
            :value="value"
            :disable="disableEmail"
            checked-value="email"
            checked-icon="email"
            checked-color="primary"
            unchecked-value=""
            unchecked-icon="mdi-email-outline"
            unchecked-color="black"
            class="q-pa-sm"
            @input="$emit('input', $event)"
          >
            <q-tooltip v-if="disableEmail">
              Email non disponibile per questo servizio
            </q-tooltip>
          </lms-checkbox-button>

          <lms-checkbox-button
            v-if="!noSms"
            :value="value"
            :disable="disableSms"
            checked-value="sms"
            checked-icon="message"
            checked-color="primary"
            unchecked-value=""
            unchecked-icon="mdi-message-text-outline"
            :unchecked-color="disableSms ? 'grey-7' : 'black'"
            class="q-pa-sm"
            @input="$emit('input', $event)"
          >
            <q-tooltip v-if="disableSms">
              SMS non disponibile per questo servizio
            </q-tooltip>
          </lms-checkbox-button>
        </div>
      </q-item-section>
    </template>
  </q-item>
</template>

<script>

import LmsCheckboxButton from "./core/LmsCheckboxButton";
export default {
  name: 'AccountNotificationPreferenceListItem',
  components: {LmsCheckboxButton},
  props: {
    // eslint-disable-next-line vue/require-prop-types,vue/require-default-prop
    value: { required: false },
    name: { type: String, required: false, default: '' },
    disablePush: { type: Boolean, required: false, default: false },
    disableEmail: { type: Boolean, required: false, default: false },
    disableSms: { type: Boolean, required: false, default: false },
    noSms: { type: Boolean, required: false, default: false },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {},
}
</script>

<style scoped lang="sass"></style>
