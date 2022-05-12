<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="row flex-inline" :class="{'reverse': iconRight}">
    <div>
      <q-icon slot="icon" size="20px" :name="iconName" :color="iconColor"></q-icon>
    </div>
    <div class="separator"></div>
    <div>
      <span slot="label" class="q-caption">{{statusLabel}}</span>
    </div>
  </div>
</template>

<script>

import {DECLARATION_DETAILS_STATUS_CODES} from "src/services/config";

const ICON_MAP = {
  [DECLARATION_DETAILS_STATUS_CODES.VALIDATE_USER]: {name: 'check_circle', color: 'positive', label: 'Attiva'},
  [DECLARATION_DETAILS_STATUS_CODES.VALIDATE_OPERATOR]: {name: 'check_circle', color: 'positive', label: 'Attiva'},
  [DECLARATION_DETAILS_STATUS_CODES.TO_APPROVE]: {name: 'hourglass_empty', color: 'warning', label: 'In Attesa'},
  [DECLARATION_DETAILS_STATUS_CODES.REVOKED]: {name: 'cancel', color: 'warning', label: 'Revocata'},
  [DECLARATION_DETAILS_STATUS_CODES.REVOKED_WITH_BLOCK]: {name: 'cancel', color: 'negative', label: 'Revocata'},
  [DECLARATION_DETAILS_STATUS_CODES.EXPIRED]: {name: 'cancel', color: 'negative', label: 'Scaduta'},

};


export default {
  name: "LmsDeclarationListItemStatus",
  props: {
    status: {type: String, required: true},
    iconRight: {type: Boolean, required: false, default: false}
  },
  computed: {
    item(){
      return ICON_MAP[this.status]
    },
    statusLabel() {
      return this.item && this.item.label
    },
    iconName() {
      return this.item && this.item.name
    },
    iconColor() {
      return this.item && this.item.color
    }
  },
}
</script>

<style scoped>

</style>
