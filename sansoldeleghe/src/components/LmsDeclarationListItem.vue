<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card class="q-pb-md">

    <template v-if="mustConfirm">
      <div class="q-py-sm q-px-md bg-red-2 report-list-item__header-info">
        <span>Dichiarazione da confermare</span>
      </div>
    </template>

    <template v-if="isMulti && mustConfirmOtherParent">
      <div class="q-py-sm q-px-md bg-red-2 report-list-item__header-info">
        <span>Dichiarazione in attesa di conferma da parte di {{otherParentFullName}}</span>
      </div>
    </template>

    <div class="q-px-md q-py-xs bg-blue-2">
      <strong>Dichiarazione {{declarationTypeLabel | lowerCase}}</strong>
    </div>

    <q-item>
      <q-item-section avatar>
        <q-icon size="lg" :name="avatarMinorIcon" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-bold">{{minorFullName | startCase}}</q-item-label>
        <q-item-label caption>{{minor.codice_fiscale}}</q-item-label>
      </q-item-section>
      <q-item-section side v-if="!mustConfirm">
        <lms-declaration-list-item-status :status="status" />
      </q-item-section>
    </q-item>


    <!-- ALTRO GENITORE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isMulti">
      <div class="row gutter-md q-pt-md q-px-md">
        <div class="col-12 col-md">
          <div class="row items-center gutter-xs">
            <div class="col-auto">
              <q-icon size="lg" :name="avatarAdultIcon" />
            </div>

            <div class="col">
              <div>Altro genitore</div>
              <div><strong>{{otherParentFullName}}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <lms-buttons v-if="mustConfirm || canRevoke || canReactivate" class="q-mt-md q-px-sm">
      <template v-if="mustConfirm">
        <lms-button
          label="Conferma dichiarazione"
          @click="$emit('confirm')"
        />
      </template>

      <template v-if="canRevoke">
        <lms-button
          outline
          color="negative"
          label="Revoca delega"
          @click="$emit('revoke')"
        />
      </template>

      <template v-if="canReactivate">
        <lms-button
          outline
          label="Riattiva delega"
          @click="$emit('newDeclaration')"
        />
      </template>
    </lms-buttons>
  </q-card>
</template>

<script>
import {DECLARATION_TYPES_CODES, DELEGATION_STATUS_MAP} from "src/services/config";
import {
  getAvatarIcon,
  getDeclarationMinor,
  getDeclarationOtherParent,
  getParentDeclarationStatus, isDeclarationMinorRevocable,
  isDeclarationRequestingParent
} from "src/services/business-logic";
import LmsDeclarationListItemStatus from "components/LmsDeclarationListItemStatus";

export default {
  name: "LmsDeclarationListItem",
  components: {LmsDeclarationListItemStatus},
  props: {
    declaration: {type: Object, required: true},
    noNewDeclaration: {type: Boolean, required: false, default: false}
  },
  data() {
    return {
      isLoadingConfirm: false,
      isLoadingRevoke: false,
    }
  },
  computed: {
    taxCode(){
      return this.$store.getters["getTaxCode"];
    },
    avatarAdultIcon(){
      return getAvatarIcon(this.otherParent?.sesso_delega)
    },
    avatarMinorIcon(){
      return getAvatarIcon(this.minor?.sesso, true)
    },
    declarationTypeCode() {
      return this.declaration?.tipo?.codice
    },
    declarationTypeLabel() {
      return this.declaration?.tipo?.descrizione
    },
    isMono() {
      let codes = [DECLARATION_TYPES_CODES.PARENTS_MONO]
      return codes.includes(this.declarationTypeCode)
    },
    isMulti() {
      let codes = [DECLARATION_TYPES_CODES.PARENTS_MULTI]
      return codes.includes(this.declarationTypeCode)
    },
    minor() {
      return getDeclarationMinor(this.declaration)
    },
    minorFullName() {
      return `${this.minor?.nome} ${this.minor?.cognome}`
    },
    otherParent() {
      return getDeclarationOtherParent(this.declaration, this.taxCode)
    },

    otherParentFullName() {
      if (!this.otherParent) return '-';
      return `${this.otherParent.nome} ${this.otherParent.cognome}`
    },
    status() {
      return getParentDeclarationStatus(this.declaration, this.taxCode).codice
    },
    isRequestingParent() {
      return isDeclarationRequestingParent(this.declaration, this.taxCode)
    },
    mustConfirm() {
      return !this.isRequestingParent && this.status === 'DA_APPROVARE'
    },
    mustConfirmOtherParent() {
      return this.isRequestingParent && this.status === 'DA_APPROVARE'
    },
    canRevoke() {
      let isRevocable = isDeclarationMinorRevocable(this.declaration, this.taxCode);
      return !this.mustConfirm && isRevocable
    },
    canReactivate() {
      let statusCode = this.status;
      let statusCodes = [
        DELEGATION_STATUS_MAP.REVOKED,
        // DELEGATION_STATUS_MAP.EXPIRED,
      ];

      let isReactivable = statusCodes.includes(statusCode);
      return !this.noNewDeclaration && isReactivable;
    }
  },
}
</script>

<style scoped>

</style>
