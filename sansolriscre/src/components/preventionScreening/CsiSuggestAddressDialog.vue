<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card :class="{ minWidthCard: $q.screen.gt.sm }">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>Modifica indirizzo</q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section class="q-mt-md">
      <div class="row items-center">
        <div class="col-12">
          <q-select
            v-if="!isGeolocation"
            ref="addressSelect"
            v-model="newAddress"
            clearable
            :loading="onSearchingAddress"
            use-input
            hide-selected
            fill-input
            no-error-icon
            hide-dropdown-icon
            bottom-slots
            input-debounce="0"
            label="Inserisci indirizzo o località"
            :options="suggestedAddressOptions"
            @filter="filterByAddress"
            @filter-abort="abortFilteredAddress"
            :error="$v.newAddress.$error"
            error-message="Indirizzo non valido. Selezionane uno tra quelli suggeriti"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Nessun indirizzo trovato
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-field
            v-else
            bottom-slots
            :value="geoPositionLabel"
            label="Inserisci indirizzo o località"
            stack-label
            clearable
            @clear="cleanGeoPosition"
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ geoPositionLabel }}
              </div>
            </template>
          </q-field>
        </div>
        <div
          class="col-12 row items-center cursor-pointer text-primary q-mt-sm"
          v-close-popup="hideDialog"
          @click="locateUser"
        >
          <div class="col-auto q-mr-xs">
            <q-icon name="gps_fixed" size="sm" />
          </div>
          <div class="col-auto"><strong>Posizione attuale </strong></div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right" class="q-pa-md q-mb-md">
      <lms-button
        :loading="gettingLocation"
        :block="$q.screen.lt.md"
        @click="changeLocation()"
        v-close-popup="hideDialog"
        >Conferma</lms-button
      >
    </q-card-actions>
  </q-card>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import {normalizeLoccsiRoads, orderBy} from "src/services/business-logic";
import { geocoding } from "src/services/api";
import {apiErrorNotify, isEmpty} from "src/services/utils";
import {normalizeLoccsiPlaces} from "../../services/business-logic";
import {deepClone} from "../../services/utils";
const GEOPOSITION_LABEL = "LA TUA POSIZIONE";
export default {
  name: "CsiSuggestAddressDialog",
  data() {
    return {
      geoPositionLabel: GEOPOSITION_LABEL,
      newAddress: "",
      onSearchingAddress: false,
      suggestedAddress: [],
      isNotLocation: false,
      userLocation: null,
      gettingLocation: false,
      hideDialog: false,
      isGeolocation: false
    };
  },

  validations: {
    newAddress: { required }
  },
  computed: {
    suggestedAddressOptions() {
      let orderedAddresses = [];
      if (!isEmpty(this.suggestedAddress)) {
        let addressList = deepClone(this.suggestedAddress);
        let addresses = addressList.map(address=> {
          return {
            label: address.indirizzo,
            value: address.id,
            coords : {
              lat : address.coordinate.coordinates[1],
              lon: address.coordinate.coordinates[0]
            }
          }
        });
        orderedAddresses = orderBy(addresses, ["label"]);
      }

      return Object.freeze(orderedAddresses);
    }
  },

  methods: {
   async filterByAddress(val, update, abort) {
     if (val.length < 2 || isEmpty(val)) {
       this.suggestedAddress = []
       abort();
       return
     }
    console.log('filterByAddress', val)
     this.onSearchingAddress = true
     update()
     let options = []
     try{
       let params = {indirizzo: val};
       let addressResponse = await geocoding({_no5XXRedirect: true, params: params});
       options = normalizeLoccsiPlaces(addressResponse.data)

     }catch (e) {

     }finally {
       update(() => {
         this.suggestedAddress = options
         console.log('update')
         console.log('this.suggestedAddress', this.suggestedAddress)
         this.onSearchingAddress = false
       })

     }

    },

    abortFilteredAddress() {},
    changeLocation() {
      this.$v.$touch();
      if (this.$v.$error) {
        return;
      }
      let newLocation = {};
        newLocation = {
          address: this.newAddress.label,
          coords: {
            lat: this.newAddress.coords.lat,
            lon: this.newAddress.coords.lon
          }
        };

      this.$emit("new-address", newLocation);
    },
    async locateUser() {
      this.gettingLocation = true;
      try {
        const coords = await this.$getLocation({
          enableHighAccuracy: true
        });

        this.isGeolocation = true;
        this.newAddress = {
          label: GEOPOSITION_LABEL,
          coords: {
            lat: this.roundFloatCoords(coords.lat),
            lon: this.roundFloatCoords(coords.lng)
          }
        };

      } catch (e) {
        console.log(e);
        apiErrorNotify({
          error: e,
          message: "Non è stato possibile rilevare la posizione."
        });
      }finally {
        this.gettingLocation = false;
      }
    },
    roundFloatCoords(coord) {
      return Number.parseFloat(coord).toFixed(4);
    },

    cleanGeoPosition() {
      this.isGeolocation = false;
      this.newAddress = null;
    }
  }
};
</script>

<style lang="sass">
.minWidthCard
  min-width: 700px
</style>
