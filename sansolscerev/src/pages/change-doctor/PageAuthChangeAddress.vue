<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page class="csi-change-address" padding>
    <csi-page-title class="q-mb-md" title="Aggiornamento residenza e domicilio" @back="goBack"></csi-page-title>
    <template v-if="!isLoading">
      <!------- CITTADINANZA------------>
      <!-- ----------------------------------------------------------------------------------------------------- -->
      <q-card v-if="!isAura || isNotCitizenship" class="bg-white csi-residence q-my-lg">
        <q-card-title class="q-pt-lg q-pb-none">
          <h1 class="csi-h1">Cittadinanza</h1>
        </q-card-title>
        <q-card-main>
          <q-item class="no-padding">
            <q-item-main>
              <div class="row gutter-x-md ">
                <q-field class="q-my-md col-12">
                  <q-select
                    v-model="citizenship"
                    :options="citizenshipOptions"
                    filter
                    float-label="Cittadinanza"
                    @input="OnInputcitizenship"
                  />
                </q-field>
              </div>
            </q-item-main>
          </q-item>

        </q-card-main>
      </q-card>

      <!------- RESIDENZA------------>
      <!-- ----------------------------------------------------------------------------------------------------- -->
      <q-card class="bg-white csi-residence q-my-lg">
        <q-card-title class="q-pt-lg q-pb-none">
          <h1 class="csi-h1">Residenza <span> <q-icon
            class="csi-icon--xs address-info-icon cursor-pointer"
            name="help"
            @click.native="showResidenceDialog()"
          >
            <!--                  <q-tooltip anchor="top right" self="center left">{{intervallo.note}}</q-tooltip>-->
          </q-icon></span></h1>

        </q-card-title>
        <q-card-main ref="residenceForm">
          <q-item class="no-padding">
            <q-item-main>
              <template v-if="!isProduction">
                <div class="row gutter-x-md ">
                  <q-field class="q-my-md col-12">
                    <div class="flex items-center justify-start">
                      <span class="q-pr-md q-my-sm">Stato di residenza</span>
                      <q-option-group
                        v-model="isForeignResidence"
                        :options="countryOptions"
                        class="q-pa-none q-my-sm"
                        color="primary"
                        inline
                        type="radio"
                        @input="countryResidence"
                      />
                    </div>

                  </q-field>
                </div>
              </template>
              <div v-show="isForeignResidence" class="row gutter-x-md">
                <q-field :error="$v.country.$error"
                         class="q-my-md col-12"
                         required

                >
                  <q-input
                    v-model="country"
                    :after="[{icon: 'done', condition: country!== null && country !== '' , handler () {}}]"
                    clearable
                    float-label="Stato estero di residenza"
                    type="text"
                  >
                    <q-autocomplete
                      :debounce="400"
                      :max-results="100"
                      :min-characters="2"
                      :value-field="v => v.label"
                      @search="onSearchCountry"
                      @selected="onSelectedCountry"
                    />
                  </q-input>

                  <template slot="error-label">
                    <div v-if="!$v.country.required">Campo obbligatorio</div>
                    <div v-if="!$v.country.suggest"> Stato non valido. Selezionane uno tra quelli suggeriti.</div>
                  </template>
                </q-field>
              </div>

              <div v-show="!isForeignResidence" class="row gutter-x-md ">
                <q-field class="q-my-md col-12">
                  <q-select
                    v-model="region"
                    :options="regionsOptions"
                    filter
                    float-label="Regione di residenza"
                    @input="regionResidence"
                  />
                </q-field>
              </div>
              <div v-show="!isForeignResidence" class="row gutter-x-md">
                <q-field :error="$v.residence.city.$error"
                         class="q-my-md col-xs-12 col-md-8"
                         required

                >
                  <q-input
                    v-model="residence.city.field"
                    :after="[{icon: 'done', condition: residence.city.selectedItem!== null , handler () {}}]"
                    clearable
                    float-label="Comune"
                    type="text"

                  >
                    <q-autocomplete
                      :debounce="400"
                      :max-results="100"
                      :min-characters="2"
                      :value-field="v => v.label"
                      @search="(terms, done) => onSearchCity(terms, done, residence.city)"
                      @selected="(item, keyboard) => onSelectedCity(item, keyboard, residence.city)"
                    />
                  </q-input>

                  <template slot="error-label">
                    <div v-if="!$v.residence.city.field.required">Campo obbligatorio</div>
                    <div v-if="!$v.residence.city.suggest"> Comune non valido. Selezionane uno tra quelli suggeriti.
                    </div>
                  </template>
                </q-field>
                <q-field class="q-my-md col-xs-12 col-md-4"
                         required

                >
                  <q-input
                    v-model="residence.cap"
                    :after="[{icon: 'done', condition: residence.cap!==null && residence.cap!== '' , handler () {}}]"
                    :disable="residence.city.selectedItem===null && !isNotPiemonteResident"
                    :error="$v.residence.cap.$error"
                    clearable
                    float-label="CAP"
                    type="text"
                    @input="$v.residence.cap.$touch">
                    <!--                          <q-autocomplete-->
                    <!--                            :min-characters="2"-->
                    <!--                            :debounce="400"-->
                    <!--                            :max-results="100"-->
                    <!--                            @search="(terms, done) => onSearchCap(terms, done, residence.cap)"-->
                    <!--                            @selected="(item, keyboard) => onSelectedCap(item, keyboard, residence.cap)"-->
                    <!--                          />-->
                  </q-input>
                  <template slot="error-label">
                    <div v-if="!$v.residence.cap.required">Campo obbligatorio</div>
                    <div v-if="!$v.residence.cap.maxLength">Deve avere esattamente 5 caratteri</div>
                  </template>
                </q-field>
              </div>

              <div v-show="!isForeignResidence" class="row gutter-x-md">
                <q-field :error="$v.residence.address.$error"
                         class="q-my-md col-xs-12 col-md-8"
                         required
                >
                  <q-input
                    v-model="residence.address.field"
                    :after="[{icon: 'done', condition: residence.address.selectedItem!=null , handler () {}}]"
                    :disable="residence.city.selectedItem===null && !isNotPiemonteResident"
                    clearable
                    float-label="Indirizzo"
                    type="text">
                    <q-autocomplete
                      v-if="!isNotPiemonteResident"
                      :debounce="400"
                      :max-results="100"
                      :min-characters="2"
                      :value-field="v => v.label"
                      @search="(terms, done) => onSearchAddress(terms, done, residence.address, residence.city.field)"
                      @selected="(item, keyboard) => onSelectedAddress(item, keyboard, residence.address)"
                    />
                  </q-input>
                  <template slot="error-label">
                    <div v-if="!$v.residence.address.field.required">Campo obbligatorio</div>
                    <div v-if="!$v.residence.address.suggest">Indirizzo non valido. Selezionane uno tra quelli
                      suggeriti.
                    </div>
                  </template>
                </q-field>
                <q-field class="q-my-md col-xs-12 col-md-4">
                  <q-input
                    v-model="residence.streetNumber"
                    :after="[{icon: 'done', condition: residence.streetNumber!=='' && residence.streetNumber!==null, handler () {}}]"
                    :disable="residence.city.selectedItem===null && !isNotPiemonteResident"
                    clearable
                    float-label="N. civico"
                    type="text"/>
                </q-field>

              </div>
            </q-item-main>
          </q-item>
        </q-card-main>
      </q-card>
      <!------- Attiva DOMICILIO------------>
      <!-- ----------------------------------------------------------------------------------------------------- -->
      <q-field class="q-my-md">
        <div class="flex items-center justify-start">
          <span class="q-pr-md q-my-sm">Il domicilio coincide con la residenza</span>
          <q-option-group
            v-model="isSameDomicile"
            :disable="isNotPiemonteResident || isForeignResidence"
            :options="[
            { label: 'Si', value: true },
            { label: 'No', value: false }
           ]"
            class="q-pa-none q-my-sm"
            color="primary"
            inline
            type="radio"
          />
        </div>

      </q-field>

      <!------- DOMICILIO------------>
      <!-- ----------------------------------------------------------------------------------------------------- -->
      <q-card v-if="!isSameDomicile" class="bg-white csi-residence q-my-lg">
        <q-card-title class="q-pt-lg q-pb-none">
          <h1 class="csi-h1">Domicilio <span> <q-icon
            class="csi-icon--xs address-info-icon cursor-pointer"
            name="help"
            @click.native="showDomicileDialog()"
          >
            <!--                  <q-tooltip anchor="top right" self="center left">{{intervallo.note}}</q-tooltip>-->
          </q-icon></span></h1>
        </q-card-title>
        <q-card-main ref="domicileForm">

          <q-item class="no-padding">
            <q-item-main>
              <div class="row gutter-x-md ">
                <q-field :error="$v.domicile.city.$error"
                         class="q-my-md col-xs-12 col-md-8"
                         required
                >
                  <q-input

                    v-model="domicile.city.field"
                    :after="[{icon: 'done', condition: domicile.city.selectedItem!== null, handler () {}}]"
                    clearable
                    float-label="Comune"
                    type="text">
                    <q-autocomplete
                      :debounce="400"
                      :max-results="100"
                      :min-characters="2"
                      :value-field="v => v.label"
                      @search="(terms, done) => onSearchCity(terms, done, domicile.city)"
                      @selected="(item, keyboard) => onSelectedCity(item, keyboard, domicile.city)"
                    />
                  </q-input>
                  <template slot="error-label">
                    <div v-if="!$v.domicile.city.field.required">Campo obbligatorio</div>
                    <div v-if="!$v.domicile.city.suggest">Comune non valido. Selezionane uno tra quelli suggeriti.</div>
                  </template>

                </q-field>
                <q-field class="q-my-md col-xs-12 col-md-4"
                         required>
                  <q-input
                    v-model="domicile.cap"
                    :after="[{icon: 'done', condition: domicile.cap!==null && domicile.cap!=='', handler () {}}]"
                    :disable="domicile.city.capList=== null"
                    :error="$v.domicile.cap.$error"
                    clearable
                    float-label="CAP"
                    type="text"
                    @input="$v.domicile.cap.$touch">
                    <!--                        <q-autocomplete-->
                    <!--                          :min-characters="2"-->
                    <!--                          :debounce="400"-->
                    <!--                          :max-results="100"-->
                    <!--                          @search="(terms, done) => onSearchCap(terms, done, domicile.cap)"-->
                    <!--                          @selected="(item, keyboard) => onSelectedCap(item, keyboard, domicile.cap)"-->
                    <!--                        />-->
                  </q-input>
                  <template slot="error-label">
                    <div v-if="!$v.domicile.cap.maxLength">Deve avere esattamente 5 caratteri</div>
                    <div v-if="!$v.domicile.cap.required">Campo obbligatorio</div>

                  </template>
                </q-field>
              </div>
              <div class="row gutter-x-md ">
                <q-field :error="$v.domicile.address.$error"
                         class="q-my-md col-xs-12 col-md-8"
                         required>
                  <q-input
                    v-model="domicile.address.field"
                    :after="[{icon: 'done', condition: domicile.address.selectedItem!=null, handler () {}}]"
                    :disable="domicile.city.selectedItem===null"
                    clearable
                    float-label="Indirizzo"
                    type="text">
                    <q-autocomplete
                      :debounce="400"
                      :max-results="100"
                      :min-characters="2"
                      :value-field="v => v.label"
                      @search="(terms, done) => onSearchAddress(terms, done, domicile.address, domicile.city.field)"
                      @selected="(item, keyboard) => onSelectedAddress(item, keyboard, domicile.address)"
                    />
                  </q-input>
                  <template slot="error-label">
                    <div v-if="!$v.domicile.address.field.required">Campo obbligatorio</div>
                    <div v-if="!$v.domicile.address.suggest">Indirizzo non valido. Selezionane uno tra quelli
                      suggeriti.
                    </div>
                  </template>
                </q-field>
                <q-field class="q-my-md col-xs-12 col-md-4">
                  <q-input
                    v-model="domicile.streetNumber"
                    :after="[{icon: 'done', condition: domicile.streetNumber!==null && domicile.streetNumber!=='', handler () {}}]"
                    :disable="domicile.city.selectedItem===null"
                    clearable
                    float-label="N. civico"
                    type="text"/>
                </q-field>

              </div>
            </q-item-main>
          </q-item>

        </q-card-main>
      </q-card>

      <!------- RECAPITI------------>
      <!-- ----------------------------------------------------------------------------------------------------- -->
      <q-card class="bg-white csi-residence q-my-lg">
        <q-card-title class="q-pt-lg q-pb-none">
          <h1 class="csi-h1">Recapiti</h1>
        </q-card-title>
        <q-card-main ref="contactsForm">

          <q-item class="no-padding">
            <q-item-main>
              <div class="row gutter-x-md ">
                <q-field :error="$v.telephone1.$error"
                         class="q-my-md col-xs-12 col-md-6"
                         required
                >
                  <q-input
                    v-model.trim="telephone1"
                    :after="[{icon: 'done', condition: telephone1!== null && telephone1!=='', handler () {}}]"
                    clearable
                    float-label="Telefono"
                    type="text"/>
                  <template slot="error-label">
                    <div v-if="!$v.telephone1.required">Campo obbligatorio</div>
                  </template>
                </q-field>
                <!--
                <q-field class="q-my-md col-xs-12 col-md-6"
                >
                  <q-input
                    v-model="telephone2"
                    :after="[{icon: 'done', condition: telephone2!== null || telephone2!=='', handler () {}}]"
                    type="text"
                    clearable
                    float-label="Telefono secondario"/>
                </q-field>
                <q-field class="q-my-md col-xs-12"
                         :error="$v.email.$error"
                >
                  <q-input
                    v-model="email"
                    :after="[{icon: 'done', condition: email!== null || email!=='', handler () {}}]"
                    type="email"
                    clearable
                    float-label="Email"/>
                  <template slot="error-label" >
                    <div v-if="!$v.email.email">Formato email non corretto.</div>
                  </template>

                </q-field>
                -->
              </div>
            </q-item-main>
          </q-item>

        </q-card-main>
      </q-card>

      <!------- Posizione contributiva------------>
      <!-- ----------------------------------------------------------------------------------------------------- -->
      <!--        <q-field class="q-my-md csi-field-options"-->
      <!--                 required-->
      <!--                 :error="$v.isContributoryAbroad.$error"-->
      <!--                 ref="contributoryAbroadForm"-->

      <!--        >-->
      <!--          <div class="flex items-center justify-start">-->
      <!--            <span class="q-pr-md q-mt-sm">* Hai una posizione contributiva all'estero?</span>-->
      <!--            <q-option-group-->
      <!--              class="q-pa-none q-mt-sm"-->
      <!--              inline-->
      <!--              type="radio"-->
      <!--              color="primary"-->
      <!--              v-model="isContributoryAbroad"-->
      <!--              :options="[-->
      <!--            { label: 'Si', value: 'Y' },-->
      <!--            { label: 'No', value: 'N'}-->
      <!--           ]"-->
      <!--            />-->

      <!--          </div>-->
      <!--          <template slot="error-label" >-->
      <!--            <div v-if="!$v.isContributoryAbroad.required">Campo obbligatorio</div>-->
      <!--          </template>-->
      <!--        </q-field>-->

      <div class="row q-mt-lg justify-end items-center">

        <csi-buttons class="col-12 col-md-auto q-pa-sm">
          <csi-button :loading="isNewAddressLoading" label="Prosegui" primary type="submit" @click="changeAddress"/>
          <!--            <span class="loader-container col-md-auto col-12">   <csi-inner-loading :visible="isLoading" block /></span>-->
        </csi-buttons>
      </div>


      <!-- MODALS -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <csi-doctor-consent-modal
        v-model="doctorConsentModal"
        :derogation-type="derogationType"
        :doctor="doctor"
        @change-doctor="isDoctorConsent"
      />


      <q-modal
        ref="modal"
        v-model="notAllowedModal"
        :content-css="{maxWidth: '800px'}"
      >

        <q-modal-layout header-class="no-shadow no-scroll">
          <q-toolbar slot="header" color="transparent" text-color="primary">
            <q-toolbar-title></q-toolbar-title>
            <q-btn v-close-overlay flat icon="close" round/>
          </q-toolbar>
          <div class="csi-modal-content flex items-center">
            <div class="q-px-xl q-pb-lg ">

              <q-alert class="csi-modal-alert" type="warning">
                <div class="q-body-1 q-pa-md">
                  Per poter terminare questa operazione occorre contattare l'ASL di riferimento.
                </div>
              </q-alert>
              <div class="row q-mt-lg justify-end items-center">
                <csi-buttons class="col-12 col-md-auto">
                  <csi-button
                    label="Torna alla Homepage"
                    primary
                    @click="goToHomePage()"
                  />
                  <!--                    <csi-button-->
                  <!--                      secondary-->
                  <!--                      label="Annulla"-->
                  <!--                      v-close-overlay-->
                  <!--                    -->
                  <!--                    />-->
                </csi-buttons>
              </div>
            </div>
          </div>
        </q-modal-layout>
      </q-modal>

      <!-- DIALOG DELLE INFO INDIRIZZI -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <q-dialog
        v-model="openAddressAboutDialog"
      >
        <template v-if="aboutType === 'R'">
          <div slot="title" class="q-title">Residenza</div>
          <div slot="message">
            La residenza è definita giuridicamente come il luogo in cui la persona ha la dimora abituale.
            La residenza risulta dai registri anagrafici ed è quindi conoscibile in modo preciso e verificabile in ogni
            momento.
          </div>
        </template>
        <template v-if="aboutType === 'D'">
          <div slot="title" class="q-title">Domicilio</div>
          <div slot="message">
            Il domicilio è definito giuridicamente come il luogo in cui una persona ha stabilito la sede principale
            dei suoi affari e interessi. Il domicilio può essere diverso dalla propria residenza.
          </div>
        </template>

        <template slot="buttons" slot-scope="props">
          <csi-buttons class="q-px-md q-mb-md">
            <csi-button color="primary" label="Ok" noMinWidth primary @click="props.ok"/>
          </csi-buttons>
        </template>
      </q-dialog>
    </template>
    <!--      LOADER-->
    <csi-inner-loading :visible="isLoading"/>


  </q-page>
</template>

<script>

import {
  combinationControl, getNationalities
} from "@services/api/change-doctor";
import CsiCardItem from "components/global/common/CsiCardItem";
import {getCities, getCountries, getRegions, getSuggestedAddress} from "@services/api/cross";
import {isEmpty, orderBy, scrollToElement} from "@services/global/utils";
import {capitalize, toUpper} from "@filters/cases";
import CsiPageTitle from "components/global/common/CsiPageTitle";

import {email} from 'vuelidate/lib/validators';
import {notifyError} from "@services/api/utils";
import {
  citizenshipInfo,
  firstControlCombinationOptions, getStandardAddress, goToRequestNotAllowed, isAura,
  isDoctorDerogation, normalizeLoccsiCities, normalizeLoccsiPlaces, normalizeLoccsiRoads,
} from "@services/change-doctor/business-logic";
import CsiDoctorConsentModal from "components/change-doctor/CsiDoctorConsentModal";

const DEFAULT_REGION = 'Piemonte';
const DEFAULT_CITIZEN = 'Italia';

const COUNTRY_OPTIONS = [
  {label: 'Italia', value: false},
  {label: 'Estero', value: true}
];

const ADDRESS_ABOUT_TYPE = {
  RESIDENCE: 'R',
  DOMICILE: 'D'
};


export default {
  name: 'PageAuthChangeAddress',
  components: {CsiCardItem, CsiPageTitle, CsiDoctorConsentModal},
  data() {
    return {
      notAllowedModal: false,
      areQueryParams: false,
      doctor: null,
      combinationControl: null,
      citizenshipList: null,
      country: null,
      selectedCountry: null,
      countriesList: null,
      countryOptions: COUNTRY_OPTIONS,
      region: null,
      regionsList: null,
      citiesList: null,
      addressList: null,
      capList: null,
      isLoading: false,
      isNewAddressLoading: false,
      limit: null,
      defaultRegion: null,
      isSameDomicile: true,
      isForeignResidence: false,
      isNotPiemonteResident: false,
      citizenship: null,
      selectedCitizenship: null,
      residence: {
        city: {
          field: '',
          selectedItem: null,
        },
        cap: '',
        address: {
          field: '',
          selectedItem: null,
        },
        streetNumber: ''
      },
      domicile: {
        city: {
          field: '',
          selectedItem: null,
        },
        cap: '',
        address: {
          field: '',
          selectedItem: null,
        },
        streetNumber: ''
      },
      telephone1: '',
      telephone2: '',
      email: '',
      isDoctorDerogation: false,
      doctorConsentModal: false,
      newDomicileParams: null,
      newResidenceParams: null,
      combinationControlResponse: null,
      derogationType: null,
      isCitizenshipSearch: false,
      isResidenceSearch: false,
      isDomicileSearch: false,
      openAddressAboutDialog: false,
      aboutType: ''
    }
  },
  validations() {
    return {
      country: {
        required: v => !this.isForeignResidence || !!v,
        suggest: v => this.isSelectedCountry(v) || !this.isForeignResidence
      },
      residence: {
        city: {
          suggest: v => this.isSelectedOptions(v) || this.isNotPiemonteResident || this.isForeignResidence,
          field: {required: v => this.isForeignResidence || !!v},
        },
        address: {
          suggest: v => this.isSelectedOptions(v) || this.isNotPiemonteResident || this.isForeignResidence,
          field: {required: v => this.isForeignResidence || !!v},
        },
        cap: {
          maxLength: v => this.isForeignResidence || v.length === 5,
          required: v => this.isForeignResidence || !!v,
        }
      },
      domicile: {
        city: {
          suggest: v => this.isSelectedOptions(v),
          field: {required: v => this.isSameDomicile || !!v},
        },
        address: {
          suggest: v => this.isSelectedOptions(v),
          field: {required: v => this.isSameDomicile || !!v},
        },
        cap: {
          maxLength: v => this.isSameDomicile || v.length === 5,
          required: v => this.isSameDomicile || !!v,
        }
      },
      telephone1: {
        required: v => !!v,
      },

      // email:{email}
    }

  },

  watch: {
    residence: {
      deep: true,
      handler(val) {
        this.isEmptyField(val)
      }
    },
    domicile: {
      deep: true,
      handler(val) {
        this.isEmptyField(val)
      }
    }
  },
  computed: {
    isAura() {
      return isAura()
    },
    isNotCitizenship() {
      return citizenshipInfo() === null
    },
    userInfo() {
      return this.$store.getters['changeDoctor/getUserInfo']
    },

    userContacts() {
      let userProfile = this.$store.getters['global/user'];
      return userProfile ? userProfile.contacts : null
    },
    isProduction() {
      return this.$config.global.isProduction
    },
    choosenDoctor() {
      return this.$store.getters['changeDoctor/getChoosenDoctor'];
    },
    isAssistanceRenewal() {
      return this.$store.getters['changeDoctor/isAssistanceRenewal'];
    },
    cf() {
      return this.$store.getters['changeDoctor/getTaxCode']
    },
    isDelegation() {
      return this.$store.getters['changeDoctor/isDelegationActive']
    },
    regionsOptions() {
      let orderedRegions = [];
      if (this.regionsList) {
        let regions = this.regionsList;
        let regionsOptions = regions.map(region => {
          let label = capitalize(region.desc);
          return {label, value: region.codice_istat}
        });

        orderedRegions = orderBy(regionsOptions, ['label']);
      }
      return orderedRegions
    },
    citiesOptions() {
      let orderedCities = [];
      if (this.citiesList) {
        let cities = this.citiesList;
        let citiesOptions = [];
        if (this.isNotPiemonteResident) {
          citiesOptions = cities.map(city => {
            let label = capitalize(city.desc);
            return {label, value: city.codice_istat, _model: city}
          });
        } else {
          citiesOptions = cities.map(city => {
            let label = city.indirizzo;
            return {label, value: city.id, _model: city}
          });
        }

        orderedCities = orderBy(citiesOptions, ['label']);
      }
      return orderedCities
    },
    citizenshipOptions() {
      let orderedCitizen = [];
      if (this.citizenshipList) {
        let citizen = this.citizenshipList;
        let citizenOptions = citizen.map(c => {
          let label = capitalize(c.descrizione);
          return {label, value: c.id, _model: c}
        });

        orderedCitizen = orderBy(citizenOptions, ['label']);
      }
      return orderedCitizen
    },
    areDefaultValues() {
      let citizenship = this.isAura || !this.isAura && this.isCitizenshipSearch;
      let residence = this.isResidenceSearch;
      let domicile = this.isSameDomicile || !this.isSameDomicile && this.isDomicileSearch;

      return (this.defaultRegion && this.userInfo && citizenship && residence && domicile)
    },
    addressOptions() {
      let orderedAddresses = [];
      if (this.addressList) {
        let addresses = this.addressList;

        let addressOptions = addresses.map(address => {
          let label = address.indirizzo.split(',')[0];
          return {label, value: address.id, _model: address}
        });

        orderedAddresses = orderBy(addressOptions, ['label']);
      }
      return orderedAddresses
    },
    countriesOptions() {
      let orderedCountries = [];
      if (this.countriesList) {
        let countries = this.countriesList;
        let countriesOptions = countries.map(country => {
          let label = country.territorio;
          return {label, value: country.codice_istat, _model: country}
        });

        orderedCountries = orderBy(countriesOptions, ['label']);
      }

      return orderedCountries
    },
    userResidence() {
      return this.$store.getters['changeDoctor/getResidenceObj'];
    },
    userDomicile() {
      return this.$store.getters['changeDoctor/getDomicileObj'];
    },

    userNewContactsInfo() {
      return this.$store.getters['changeDoctor/getNewContactsInfo'];
    },
    userCitizenship() {
      return this.$store.getters['changeDoctor/getCitizenship'];
    }
  },

  async created() {
    if (!this.userInfo) this.$router.replace(this.$routes.CHANGE_DOCTOR.HOME);

    this.doctor = this.choosenDoctor ? this.choosenDoctor : null;

    this.limit = 50;
    this.isLoading = true;
    //Cittadinanza
    if (!this.isAura || this.isNotCitizenship) {
      let citizenshipResponse = await this.getCitizenshipList();
      this.citizenshipList = citizenshipResponse.data;

      let citizenshipLabel = this.userCitizenship ? this.userCitizenship.descrizione : ''
      let citizenResult = this.citizenshipOptions;
      if (citizenResult) {
        let citizenship = citizenResult.find(c => {
          let label = toUpper(c.label);
          let result = citizenshipLabel ? label.indexOf(toUpper(citizenshipLabel)) : label.indexOf(toUpper(DEFAULT_CITIZEN));
          return result > -1 ? c : null
        });
        this.selectedCitizenship = citizenship._model;
        this.citizenship = citizenship.value;
      }

    }
    //REGIONI
    let regionsResponse = await getRegions();
    this.regionsList = regionsResponse.data;
    if (this.regionsList) {
      this.defaultRegion = this.regionsOptions.find(c => c.label === capitalize(DEFAULT_REGION)).value;
      this.region = this.defaultRegion
    }
    //RESIDENZA

    if (this.userResidence) {
      this.region = this.userResidence.regione ? this.userResidence.regione : this.defaultRegion
      this.isForeignResidence = this.userResidence.residenza_estero
      if (this.isForeignResidence) {
        this.isSameDomicile = false;
        this.selectedCountry = this.userResidence.stato_estero
        this.country = this.selectedCountry ? this.selectedCountry.label : ''
      } else {
        if (this.region === this.defaultRegion) {

          if (this.userResidence.city) {
            this.residence.city = this.userResidence.city
          }

          if (this.userResidence.address) {
            this.residence.address = this.userResidence.address
          }

          if (this.userResidence.cap) {
            this.residence.cap = this.userResidence.cap
          }
          if (this.userResidence.streetNumber) {
            this.residence.streetNumber = this.userResidence.streetNumber
          }


        } else {
          this.isNotPiemonteResident = true;
          this.isSameDomicile = false;
        }
      }
    }
    if (this.userDomicile) {
      this.isSameDomicile = this.userDomicile.stesso_domicilio
      if(!this.isSameDomicile){
        if (this.userDomicile.city) {
          this.domicile.city = this.userDomicile.city
        }

        if (this.userDomicile.address) {
          this.domicile.address = this.userDomicile.address
        }

        if (this.userDomicile.cap) {
          this.domicile.cap = this.userDomicile.cap
        }
        if (this.userDomicile.streetNumber) {
          this.domicile.streetNumber = this.userDomicile.streetNumber
        }
      }


    }
    let userInfoTel = this.userInfo.recapiti ? this.userInfo.recapiti.telefono : '';
    let userContactsTel = this.userContacts ? this.userContacts.sms : null;
    let userTelephone = userContactsTel ? userContactsTel : userInfoTel;
    this.telephone1 = this.userNewContactsInfo && this.userNewContactsInfo.telefono ? this.userNewContactsInfo.telefono : userTelephone;

    this.isLoading = false
  },

  methods: {
    setQueryParams() {
      let query = {
        cittadinanza: this.selectedCitizenship ? this.selectedCitizenship.descrizione : '',
        residenza_estero: this.isForeignResidence,
        stato_estero: this.country,
        regione: this.region,
        telefono: this.telephone1,
      };
      this.$router.replace({path: this.$router.history.current.fullPath, query: query})
    },

    async getCitizenshipList() {
      let citizenshipResponse = await getNationalities();
      return citizenshipResponse
    },
    async onSearchCountry(terms, done) {

      let params = {
        filter: {
          territorio: {si: toUpper(terms)},
          data_validita: {eq: new Date()},
        },
        limit: this.limit
      };


      let countriesPromise = getCountries({params});
      let countriesResponse = await countriesPromise;
      this.countriesList = countriesResponse.data;

      let result = this.countriesOptions;
      if (result.length === 1) {
        let item = result[0];
        if (terms.toUpperCase() === item.label.toUpperCase()) {
          this.onSelectedCity(item, false, type);
          done([])
        }
      }
      done(result)
    },
    async onSelectedCountry(item, keyboard) {
      this.selectedCountry = item;
      this.country = item.label
    },
    async countryResidence(value) {
      if (value) {
        this.region = null;
        this.isSameDomicile = false
      } else {
        this.region = this.defaultRegion;
        this.isSameDomicile = true
      }
    },
    regionResidence(value) {
      if (value !== this.defaultRegion) {
        this.isSameDomicile = false;
        this.isNotPiemonteResident = true
      } else {
        this.isNotPiemonteResident = false
      }
    },
    OnInputcitizenship(value) {
      this.selectedCitizenship = this.citizenshipOptions.find(c => c.value === value)._model
    },
    // async onSearchCitizenship(terms, done){
    //   this.citizenship.selectedItem = null;
    //   let params= {s : terms};
    //   let citizenshipResponse = await getCitizenshipList({_no5XXRedirect: true, params: params});
    //   this.citizenshipList = citizenshipResponse.data;
    //   let result = this.citizenshipOptions;
    //
    //   if (result.length === 1) {
    //     let item = result[0];
    //     if (terms.toUpperCase() === item.label.toUpperCase()) {
    //       this.onSelectedCitizenship(item);
    //       done([])
    //     }
    //   }
    //   done(result)
    // },
    // onSelectedCitizenship(item, keyboard) {
    //   this.citizenship.field = item.label;
    //   this.citizenship.selectedItem = item;
    // },
    async onSearchCity(terms, done, type) {

      let searchString = terms;
      type.selectedItem = null;
      if (this.isNotPiemonteResident) {
        type.selectedItem = null;
        let limit = this.limit;
        let filter = {
          desc: {si: terms},
          data_validita: {eq: new Date()},
        };

        let params = {filter, limit};

        let cityResponse = await getCities({_no5XXRedirect: true, params: params});
        this.citiesList = cityResponse.data;

      } else {
        let params = {indirizzo: searchString};
        let addressResponse = await getSuggestedAddress({_no5XXRedirect: true, params: params});
        let citiesList = addressResponse.data;
        if (!isEmpty(citiesList)) citiesList = normalizeLoccsiCities(citiesList);
        this.citiesList = citiesList
      }

      let result = this.citiesOptions;
      if (result.length === 1) {
        let item = result[0];
        if (terms.toUpperCase() === item.label.toUpperCase()) {
          this.onSelectedCity(item, false, type);
          done([])
        }
      }
      done(result)
    },
    onSelectedCity(item, keyboard, type) {
      type.field = item.label;
      // type.capList = item._model.codice_cap;
      type.selectedItem = item;
      // this.capList = type.capList;
    },
    //   onSearchCap(terms, done, type){
    //   type.selectedItem = null;
    //   let result = this.capOptions;
    //   if (result.length === 1) {
    //     let item = result[0];
    //     if (terms === item.label) {
    //       this.onSelectedCap(item,false, type);
    //       done([])
    //     }
    //   }
    //   done(result)
    // },
    // onSelectedCap(item,keyboard, type){
    //   type.selectedItem = item;
    //   type.field = item.label;
    // },
    async onSearchAddress(terms, done, type, city) {

      let searchString = terms + ' ' + city;
      type.selectedItem = null;

      let params = {indirizzo: searchString};
      let addressResponse = await getSuggestedAddress({_no5XXRedirect: true, params: params});
      let addressList = addressResponse.data;
      if (!isEmpty(addressList)) addressList = normalizeLoccsiRoads(addressList);
      this.addressList = addressList.filter(a => a.comune === toUpper(city));
      let result = this.addressOptions;

      // Autoselezione in caso di un singolo risultato che fa match esatto con quanto scritto dall'utente
      if (result.length === 1) {
        let item = result[0];
        if (terms.toUpperCase() === item.label.toUpperCase()) {
          this.onSelectedAddress(item, false, type);
          done([])
        }
      }
      done(result)
    },
    onSelectedAddress(item, keyboard, type) {
      type.selectedItem = item;
      type.field = item.label;
    },
    isEmptyField(options) {
      if (!options.city.selectedItem) {
        options.address.selectedItem = null;
        options.address.field = ''
      }

      let typeFields = [options.city, options.address];
      typeFields.forEach(type => {
        if (type.field === "") {
          type.selectedItem = null;
        }
      })
    },
    isSelectedOptions(type) {
      if (type.field !== "" && type.selectedItem === null) {
        // if(type.capList) type.capList = null;
        return false
      }
      return true
    },
    isSelectedCountry(value) {
      return !(value !== "" && this.selectedCountry === null)
    },
    goBack() {
      this.$router.go(-1)
    },
    setCitinzenship() {
      this.$store.dispatch('changeDoctor/setCitizenship', {citizen: this.selectedCitizenship});
    },
    setResidenceParams() {
      let nazione = null;
      let cod_comune = null;
      if (this.isForeignResidence) {
        cod_comune = this.selectedCountry ? this.selectedCountry.value : null;
        nazione = this.selectedCountry.label
      } else {
        nazione = 'ITALIA';
        cod_comune = this.residence.city.selectedItem ? this.residence.city.selectedItem.value : null
      }

      // let regione = this.regionsOptions.find(r => r.value === this.region);
      // if(regione){
      //   regione = regione.label;
      // }

      let streetNumber = !isEmpty(this.residence.streetNumber) ? this.residence.streetNumber : 'SNC';

      let addressParams = {
        nazione: nazione,
        regione: null,
        cod_comune: cod_comune,
        comune: !this.isForeignResidence ? this.residence.city.field : '',
        cap: !this.isForeignResidence ? this.residence.cap : '',
        indirizzo: !this.isForeignResidence ? this.residence.address.field : '',
        civico: !this.isForeignResidence ? streetNumber : '',
      };
      this.newResidenceParams = addressParams;

      // Aggiungo indirizzo nelle informazioni aggiuntive
      this.$store.dispatch('changeDoctor/setNewResidence', {address: addressParams})


      //Salva tutte  le informazioni inserite dall'utente
      this.residence.nazione = this.selectedCountry
      this.residence.residenza_estero = this.isForeignResidence
      this.residence.stato_estero = this.selectedCountry
      this.residence.regione = this.region

      this.$store.dispatch('changeDoctor/setResidenceObj', {address: this.residence});
    },
    setDomicileParams() {
      let addressParams = {};
      // if (this.isSameDomicile) {
      //
      //   addressParams = {
      //     cod_comune: this.residence.city.selectedItem ? this.residence.city.selectedItem.value : null,
      //     comune: this.residence.city.field,
      //     cap: this.residence.cap,
      //     indirizzo: this.residence.address.field,
      //     civico: !isEmpty(this.residence.streetNumber) ? this.residence.streetNumber : 'SNC'
      //   }
      //
      //
      // } else {
      //   addressParams = {
      //     cod_comune: this.domicile.city.selectedItem ? this.domicile.city.selectedItem.value : null,
      //     comune: this.domicile.city.field,
      //     cap: this.domicile.cap,
      //     indirizzo: this.domicile.address.field,
      //     civico: !isEmpty(this.domicile.streetNumber) ? this.domicile.streetNumber : 'SNC'
      //   }
      // }

      if(this.isSameDomicile)
        this.domicile = this.residence

      addressParams = {
        cod_comune: this.domicile.city.selectedItem ? this.domicile.city.selectedItem.value : null,
        comune: this.domicile.city.field,
        cap: this.domicile.cap,
        indirizzo: this.domicile.address.field,
        civico: !isEmpty(this.domicile.streetNumber) ? this.domicile.streetNumber : 'SNC'
      }


      this.$store.dispatch('changeDoctor/setNewDomicile', {address: addressParams});

      this.domicile.stesso_domicilio = this.isSameDomicile
      this.$store.dispatch('changeDoctor/setDomicileObj', {address: this.domicile});
      // if(this.isSameDomicile){
      //   this.residence.stesso_domicilio = this.isSameDomicile
      //   this.$store.dispatch('changeDoctor/setDomicileObj', {address: this.residence});
      // }else{
      //   this.domicile.stesso_domicilio = this.isSameDomicile
      //   this.$store.dispatch('changeDoctor/setDomicileObj', {address: this.domicile});
      // }


      return addressParams
    },
    setContactsParams() {
      // let contactsParams = {
      //   telefono: this.telephone1 ? this.telephone1 : null,
      //   telefono_secondario: this.telephone2 ? this.telephone2 : null,
      //   indirizzo_email: this.email ? this.email : null,
      // };

      let contactsParams = {
        telefono: this.telephone1,
        telefono_secondario: null,
        indirizzo_email: null,
      };

      this.$store.dispatch('changeDoctor/setNewContactInfo', {contacts: contactsParams});

    },
    goToSearchDoctors() {
      let address = this.domicile.address.selectedItem._model
      let route = {
        name: this.$routes.CHANGE_DOCTOR.SEARCH_DOCTOR_RESULTS.name,
       params: {
           lat : address.coordinate.coordinates[1],
           lon : address.coordinate.coordinates[0],
           indirizzo : address.indirizzo
       }

      };


      this.$router.push(route)


    },
    changeAddress() {
      if (!this.isCountryFormValid()) return;
      if (!this.isResidenceFormValid()) return;
      if (!this.isDomicileFormValid()) return;
      if (!this.isContactsFormValid()) return;
      // if (!this.iscontributoryAbroadFormValid()) return;

      // if(this.isContributoryAbroad === 'Y'){
      //   this.notAllowedModal=true;
      //   return
      // }

      this.isNewAddressLoading = true;
      this.setCitinzenship();
      this.setResidenceParams();
      this.newDomicileParams = this.setDomicileParams();
      this.setContactsParams();
      this.$store.dispatch('changeDoctor/setIsAskedAddress', {val: true});
      this.setQueryParams();
      if (!this.doctor) {
        this.goToSearchDoctors(this.newDomicileParams)
      } else {
        //l'utente arriva dalla scelta medico
        this.getCombinationControl()
      }

    },
    isDoctorConsent(value) {
      if (value) {
        firstControlCombinationOptions(this.combinationControlResponse, this.doctor, this.isDoctorDerogation)
      }
    },
    async getCombinationControl() {
      this.$store.dispatch('changeDoctor/resetAllRequestsOptions');
      let cittadinanza = this.selectedCitizenship ? this.selectedCitizenship : this.userInfo.cittadinanza;

      let combinationParams = {
        codice_fiscale_medico: this.doctor.codice_fiscale,
        medico_altra_regione: this.userInfo.medico_altra_regione,
        cittadinanza: cittadinanza,
        domicilio: this.newDomicileParams,
        residenza: this.newResidenceParams,
        rinnovo_assistenza: this.isAssistanceRenewal
      };
      try {
        let combinationresponse = await combinationControl(this.cf, combinationParams, {_no5XXRedirect: true});
        this.combinationControlResponse = combinationresponse.data;

        if (this.combinationControlResponse.ammessa) {
          if (this.combinationControlResponse)
            this.$store.dispatch('changeDoctor/setCombinationControl', {combination: this.combinationControlResponse});

          //VERIFICA SE NECESSARIO IL CONSENSO MEDICO
          let isDoctorDerogationResponse = isDoctorDerogation(this.combinationControlResponse, this.doctor.tipologia.id);
          this.isDoctorDerogation = isDoctorDerogationResponse.isDerogation;
          this.derogationType = isDoctorDerogationResponse.derogationType;

          if (this.isDoctorDerogation) {
            this.doctorConsentModal = true;
          } else {
            firstControlCombinationOptions(this.combinationControlResponse, this.doctor, this.isDoctorDerogation)
          }
        } else {

          //IN caso di ricusazione del medico la richiesta viene bloccata
          let params = {}

          if (this.combinationControlResponse.ricusazione) {
            params = {refusal: true}
          } else {
            params = {notAllowed: true}
          }
          goToRequestNotAllowed(this.doctor, params)

        }
      } catch (e) {
        notifyError(e, 'Non è stato possibile effettuare la richiesta.')
      }
    },
    goToHomePage() {
      this.$router.replace(this.$routes.CHANGE_DOCTOR.HOME)
    },

    isResidenceFormValid() {
      this.$v.residence.$touch();
      let hasError = this.$v.residence.$error;
      if (hasError) scrollToElement(this.$refs.residenceForm.$el);
      return !hasError;
    },
    isCountryFormValid() {
      this.$v.country.$touch();
      let hasError = this.$v.country.$error;
      if (hasError) scrollToElement(this.$refs.residenceForm.$el);
      return !hasError;
    },
    isDomicileFormValid() {
      this.$v.domicile.$touch();
      let hasError = this.$v.domicile.$error;
      if (hasError) scrollToElement(this.$refs.domicileForm.$el);
      return !hasError;
    },
    isContactsFormValid() {
      this.$v.telephone1.$touch();
      let hasError = this.$v.telephone1.$error;
      if (hasError) scrollToElement(this.$refs.contactsForm.$el);
      return !hasError;
    },
    // iscontributoryAbroadFormValid() {
    //   this.$v.isContributoryAbroad.$touch();
    //   let hasError = this.$v.isContributoryAbroad.$error;
    //   if (hasError) scrollToElement(this.$refs.contributoryAbroadForm.$el);
    //   return !hasError;
    // },
    showResidenceDialog() {
      this.openAddressAboutDialog = true;
      this.aboutType = ADDRESS_ABOUT_TYPE.RESIDENCE
    },
    showDomicileDialog() {
      this.openAddressAboutDialog = true;
      this.aboutType = ADDRESS_ABOUT_TYPE.DOMICILE
    }
  }

}
</script>
<style lang="stylus">
.csi-change-address
  .loader-container
    max-height: 30px
    display: flex
    align-items: center
    justify-content: center

  .csi-field-options .q-field-content .q-field-bottom
    border: none !important

  .address-info-icon
    color: #acacac;
    margin-top: -10px;
</style>
