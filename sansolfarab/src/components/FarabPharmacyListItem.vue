<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <q-card
    ref="pharmacyCard"
    class="farab-pharmacy-card"
    :class="classes"
    @click="showMarker"
  >
    <q-card-section>
      <q-item class="items-start no-padding">
        <q-item-section side>
          <q-icon :name="PHARMACY_ICON_URL" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-subtitle1">
            <strong>{{ pharmacyName | empty | capitalize }} </strong>
          </q-item-label>
          <q-item-label>
            {{ pharmacyAddress | empty | capitalize }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>

    <!--  RECAPITI-->
    <!--    <template v-if="isPartecipant">-->
    <template v-if="isMobile">
      <q-expansion-item
        dense
        dense-toggle
        :label="infoExpanded ? 'Mostra meno' : 'Mostra altro'"
        @input="
          val => {
            infoExpanded = val;
          }
        "
        header-class="text-primary text-weight-bold q-mx-sm"
      >
        <q-card-section class="card-link">
          <div>
            <strong>Telefono: </strong>
            <template v-if="telephone">
              <a :href="telephoneLink">{{ telephone }}</a>
            </template>
            <template v-else>
              <span>-</span>
            </template>
          </div>
          <div>
            <strong>Email: </strong>
            <template v-if="email">
              <a :href="emailLink">{{ email }}</a>
            </template>
            <template v-else>
              <span>-</span>
            </template>
          </div>
          <div>
            <strong>Sito-web: </strong>
            <template v-if="webSite">
              <a :href="webSiteLink">{{ webSite }}</a>
            </template>
            <template v-else>
              <span>-</span>
            </template>
          </div>
        </q-card-section>
      </q-expansion-item>
    </template>

    <template v-else>
      <q-card-section class="card-link q-py-none">
        <div>
          <strong>Telefono: </strong>
          <template v-if="telephone">
            <a :href="telephoneLink">{{ telephone }}</a>
          </template>
          <template v-else>
            <span>-</span>
          </template>
        </div>
        <div>
          <strong>Email: </strong>
          <template v-if="email">
            <a :href="emailLink">{{ email }}</a>
          </template>
          <template v-else>
            <span>-</span>
          </template>
        </div>
        <div>
          <strong>Sito web: </strong>
          <template v-if="webSite">
            <a :href="webSiteLink">{{ webSite }}</a>
          </template>
          <template v-else>
            <span>-</span>
          </template>
        </div>
      </q-card-section>
    </template>
    <!--    </template>-->

    <!--  AZIONI-->
    <q-card-section>
      <template v-if="isPharmacyAdded">
        <div class="text-center">
          Farmacia già selezionata
        </div>
      </template>

      <template v-else-if="!isPartecipant">
        <div class="text-center">
          Farmacia non aderente
        </div>
      </template>

      <template v-else>
        <q-btn color="primary" class="full-width" @click="openDialog">
          Scegli
        </q-btn>
      </template>
    </q-card-section>

    <!--DIALOG PERIODO DI VALIDITA'-->
    <farab-usual-pharmacy-validity-dialog
      v-model="isOpenValidityDialog"
      :pharmacy="pharmacy"
      @is-changed="selectPharmacy"
    />
  </q-card>
</template>

<script>
import { PHARMACY_ICON_URL } from "src/services/config";
import FarabUsualPharmacyValidityDialog from "components/FarabUsualPharmacyValidityDialog";
import { HOME } from "src/router/routes";
import {changeUsualPharmacy} from "src/services/api";
import {apiErrorNotifyDialog} from "src/services/utils";

export default {
  name: "FarabPharmacyListItem",
  components: { FarabUsualPharmacyValidityDialog },
  data() {
    return {
      infoExpanded: false,
      PHARMACY_ICON_URL,
      isOpenValidityDialog: false
    };
  },
  props: {
    focused: { type: Boolean, default: false },
    onMap: { type: Boolean, default: false },
    pharmacy: { type: Object, default: null }
  },
  computed: {
    usualPharmacyList() {
      return this.$store.getters["getUsualPharmacyList"];
    },
    isPharmacyAdded() {
      return this.usualPharmacyList.some(
        p => p.farmacia?.codice === this.pharmacy?.codice
      );
    },
    isMobile() {
      return this.onMap || this.$q.screen.lt.sm;
    },
    pharmacyName() {
      return this.pharmacy?.descrizione;
    },
    pharmacyAddress() {
      return `${this.pharmacy?.indirizzo} - ${this.pharmacy?.comune}`;
    },
    telephoneLink() {
      return `tel:+39${this.pharmacy?.telefono}`;
    },
    telephone() {
      return this.pharmacy?.telefono;
    },
    emailLink() {
      return `mailto:${this.pharmacy?.email}`;
    },
    email() {
      return this.pharmacy?.email;
    },
    webSiteLink() {
      if (this.webSite && this.webSite.substring(0, 4) === "http")
        return this.webSite;
      else return "//" + this.webSite;
    },
    webSite() {
      return this.pharmacy?.sito_web;
    },
    isPartecipant() {
      return this.pharmacy?.aderente;
    },
    classes() {
      let result = [];

      if (this.focused) result.push("farab-pharmacy-card--active");
      if (this.isPartecipant) result.push("farab-pharmacy-card--partecipant");

      return result;
    }
  },
  methods: {
    showMarker() {
      this.$emit("show-marker");
    },
    openDialog() {
      this.isOpenValidityDialog = true;
    },
    selectPharmacy(newPharmacy) {
      if (newPharmacy) {
        this.$router.push(HOME);
      }
      this.isOpenValidityDialog = false;
    },
  }
};
</script>

<style lang="scss">
.farab-pharmacy-card {
  $bg-color: $blue-1;
  $bg-color-partecipant: $green-1;
  $bg-color-active: $pink-2;

  background-color: $bg-color;
  color: #000;
  cursor: pointer;
  transition: all ease 0.4s;

  &:hover {
    background-color: darken($bg-color, 10%);
  }

  &--partecipant {
    background-color: $bg-color-partecipant;

    &:hover {
      background-color: darken($bg-color-partecipant, 10%);
    }
  }

  &--active{
    background-color: $bg-color-active;

    &:hover {
      background-color: darken($bg-color-active, 10%);
    }
  }

  .card-link {
    a {
      color: #000;
      text-decoration: none;
      overflow-wrap: break-word;
    }
  }
}
</style>
