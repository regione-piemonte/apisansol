<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card class="q-my-md">
    <lms-card-item-bar type="info">{{declarationTypeLabel}}</lms-card-item-bar>
    <q-card-section>
      <q-item class="q-px-none">
        <q-item-section avatar>
          <q-icon size="lg" :name="protectedAvatar" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-bold">{{protectedFullName | startCase}}</q-item-label>
          <q-item-label caption>{{protectedPerson.codice_fiscale}}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <lms-declaration-list-item-status :status="status" />
        </q-item-section>
      </q-item>
      <!-- DATE INIZIO E FINE TUTELA -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <div class="row q-col-gutter-md q-py-md">
        <div class="col-12 col-md">
          <div class="row items-center q-col-gutter-x-sm">
            <div class="col-auto">
              <q-icon  size="lg" name="img:/statics/la-mia-salute/icone/calendario.svg" />
            </div>

            <div class="col">
              <div>Attiva dal</div>
              <div><strong>{{declaration.data_inizio_tutela | date}}</strong></div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md">
          <div class="row items-center q-col-gutter-x-sm">
            <div class="col-auto">
              <q-icon  size="lg" name="img:/statics/la-mia-salute/icone/calendario.svg" />
            </div>

            <div class="col">
              <div>Attiva fino al</div>
              <div><strong>{{declaration.data_fine_tutela | date}}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <lms-buttons class="q-pa-md">
        <lms-button
          label="Dettagli"
          @click="$emit('detail')"
        />

        <template v-if="canRevoke">
          <lms-button
            secondary
            color="negative"
            label="Revoca tutela"
            @click="$emit('revoke')"
          />
        </template>
      </lms-buttons>
    </q-card-actions>








  </q-card>
</template>

<script>
import {
  getAvatarIcon,
  getDeclarationMinor,
  isDeclarationProtectionRevocable,
  isMinor
} from "src/services/business-logic";
import LmsDeclarationListItemStatus from "components/LmsDeclarationListItemStatus";
import LmsCardItemBar from "components/core/LmsCardItemBar";


export default {
  name: "LmsDeclarationProtectionListItem",
  components: { LmsCardItemBar, LmsDeclarationListItemStatus},
  props: {
    declaration: {type: Object, required: true}
  },
  data() {
    return {
      isLoadingRevoke: false,
    }
  },
  computed: {
    taxCode() {
      return this.$store.getters['getTaxCode']
    },
    declarationTypeLabel() {
      return  this.declaration?.tipo?.descrizione
    },
    protectedPerson() {
      return getDeclarationMinor(this.declaration)
    },
    protectedFullName() {
      return `${this.protectedPerson?.nome} ${this.protectedPerson?.cognome}`
    },
    protectedAvatar(){
      return getAvatarIcon(this.protectedPerson.sesso, this.isProtectedMinor)
    },
    isProtectedMinor() {
      return this.protectedPerson? isMinor(this.protectedPerson.data_nascita) : false
    },
    status() {
      return this.declaration?.stato?.codice
    },
    canRevoke() {
      let isRevocable = isDeclarationProtectionRevocable(this.declaration, this.taxCode)
      return isRevocable
    },
  },
}
</script>

<style scoped>

</style>
