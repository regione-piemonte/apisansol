<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <csi-page-title class="q-mb-md" title="Cambio medico" @back="goBack"></csi-page-title>
    <template v-if="this.doctorTypeList && !isLoading">

      <!------- FILTRI------------>
      <!-- ----------------------------------------------------------------------------------------------------- -->
      <template>
        <div class="row  gutter-x-xs items-center cursor-pointer q-mt-lg" @click="toggleFilters">
          <div>
            <q-icon class="csi-icon--sm" name="filter_list"></q-icon>
          </div>
          <div>Filtra</div>
        </div>

        <q-slide-transition>
          <q-card v-if="areFiltersOpen" class="q-mt-md q-mb-xl">
            <q-card-main class="q-pt-none">
              <csi-doctor-filter-search-form
                :default-fields="searchParams"
                :is-free-search="isFreeSearch"
                :search-finished="isSearchFinished"
                @set-filters="newFiltersSearch"
                @invalid-search="isInvalidSearch"
              />
            </q-card-main>
          </q-card>

        </q-slide-transition>

      </template>


      <!------- RISULTATO RICHIESTA------------>
      <!-- ----------------------------------------------------------------------------------------------------- -->
      <template v-if="isSearchFinished">
        <template v-if="isDoctorsResults && !invalidSearch">
          <div class="row flex items-center justify-between q-mt-lg">
            <h1 v-if="searchArea" class="csi-h1">I medici nei pressi di {{ searchArea }}</h1>
            <h1 v-else class="csi-h1">I medici trovati</h1>
            <div class="row items-center q-py-sm cursor-pointer" v-on:click="showMap">
              <csi-icon-base class="csi-svg-icon--sm">
                <csi-icon-map/>
              </csi-icon-base>
              <span class="q-body-1 text-primary text-weight-bold q-ml-sm">Vedi mappa</span>
            </div>

          </div>
          <div v-for="doctor in doctorsListResults" class="q-mb-xl">
            <csi-doctor-item
              :cf="cf"
              :doctor="doctor"
              class="q-my-md"
            />
          </div>
          <div
            :class="{'hidden': !areMoreElements}"
            class="cursor-pointer text-primary q-body-2 full-width text-center"
            v-on:click="loadMoreDoctors"
          >
            Carica altri
          </div>
        </template>
        <template v-if="invalidSearch || !isDoctorsResults">
          <q-alert class="q-my-md" type="info">
            <template v-if="isSearchingOwnDoctor">
              Sei già assistito dal medico che hai cercato.
            </template>
            <template v-else>
              Nessun medico trovato in base ai filtri impostati.
            </template>

          </q-alert>
        </template>
      </template>
      <csi-inner-loading :visible="uploadNewElements" block/>


      <!--  MODAL MAPPA-->
      <csi-search-doctors-map
        v-model="showMapModal"
        :is-new-search="newSearch"
        :search-params="paramsForMap"
        :user-address="userCoords"
      />


    </template>
    <!--      LOADER-->
    <csi-inner-loading :visible="isLoading"/>

    <!-- MODAL -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-modal
      v-model="notAddressFound"
      :content-css="{maxWidth: '800px'}"
      :maximized="$q.screen.lt.sm"
      no-backdrop-dismiss
      no-esc-dismiss
    >
      <q-modal-layout header-class="no-shadow no-scroll">
        <div class="csi-modal-content flex items-center">
          <div class="q-pa-lg">

            <q-alert class="csi-revoke-doctor-alert" type="warning">
              <div class="q-body-1 q-pa-md">
                <strong>Impossibile proseguire</strong><br>
                Per utilizzare il servizio Il mio medico devi avere il domicilio in Piemonte.
                Procedi quindi alla modifica dei tuoi dati o rivolgiti direttamente all'asl di provenienza.
              </div>
            </q-alert>
            <div class="row q-mt-lg justify-end items-center">
              <csi-buttons class="col-12 col-md-auto">
                <csi-button
                  color="primary"
                  label="OK"
                  @click="goToHomepage"
                />

              </csi-buttons>
            </div>
          </div>
        </div>
      </q-modal-layout>


    </q-modal>

  </q-page>
</template>

<script>

import {

  doctorsOfficesListResults
} from "@services/api/change-doctor";
import CsiDoctorItem from "components/change-doctor/CsiDoctorItem";
import CsiCardItem from "components/global/common/CsiCardItem";
import CsiRevokeAssistanceModal from "components/change-doctor/CsiRevokeAssistanceModal";
import CsiMonitoringModal from "components/change-doctor/CsiMonitoringModal";
import {is4XX, notifyError} from "@services/api/utils";
import CsiPageTitle from "components/global/common/CsiPageTitle";
import {deepClone, equals, isEmpty} from "@services/global/utils";
import CsiIconBase from "components/global/icons/CsiIconBase";
import CsiIconMap from "components/global/icons/CsiIconMap";
import CsiDoctorFilterSearchForm from "components/change-doctor/CsiDoctorFilterSearchForm";
import CsiSearchDoctorsMap from "components/change-doctor/CsiSearchDoctorsMap";
import {getSuggestedAddress} from "@services/api/cross";
import {
  normalizeLoccsiCities, normalizeLoccsiPlaces,
  normalizeLoccsiRoads
} from "@services/change-doctor/business-logic";
import {getStandardAddress, isArrayLike} from "../../services/change-doctor/business-logic";

const LIMIT = 10;

export default {
  name: 'PageChangeDoctorResults',
  components: {
    CsiSearchDoctorsMap,
    CsiDoctorFilterSearchForm,
    CsiMonitoringModal, CsiRevokeAssistanceModal, CsiDoctorItem, CsiCardItem, CsiPageTitle, CsiIconBase, CsiIconMap
  },
  data() {
    return {
      isLoading: false,
      areFiltersOpen: false,
      isFreeSearch: false,
      distance: null,
      offset: 0,
      searchArea: null,
      paramsForMap: null,
      showMapModal: false,
      distanceSearchCounter: 0,

      //variabili filter:
      doctorName: null,
      selectedDoctorType: null,
      selectedDoctorGender: null,
      userCity: '',
      lat: null,
      lon: null,
      address:null,

      //liste di ricerca:
      doctorsListResults: null,
      doctorsOfficesResults: null,

      isSearchFinished: false,
      uploadNewElements: false,
      invalidSearch: false,
      isFiltering: false,
      isNewSearch: false,
      newQueryParams: null,
      isGeoLocation: null,
      //Headers
      xTotalElements: 0,
      xPage: 0,
      xTotalPages: 0,
      xPageSize: 0,
      newSearch: false,
      notAddressFound: false,
      isSearchingOwnDoctor: false,

    }
  },
  computed: {
    cf() {
      return this.$store.getters['changeDoctor/getTaxCode']
    },
    userInfo() {
      return this.$store.getters['changeDoctor/getUserInfo']
    },
    userAge() {
      return this.$store.getters['changeDoctor/getUserAge']
    },
    userDoctorId() {
      return this.$store.getters['changeDoctor/getUserDoctor']
    },
    doctorTypeList() {
      let list = this.$store.getters['changeDoctor/getDoctorTypes'];
      if (list)
        return list.map(t => ({label: t.descrizione, value: t.id}))
    },

    areMoreElements() {
      if (this.xPage < this.xTotalPages) {
        return true
      } else
        return false
    },
    isDoctorsResults() {
      return (!isEmpty(this.doctorsListResults))
    },
    searchParams() {
      return {
        indirizzo:this.searchArea,
        lat : this.lat,
        lon: this.lon,
        distanza: this.distance,
        sesso: this.selectedDoctorGender,
        tipologia:this.selectedDoctorType,
        dottore: this.doctorName,
        geolocalizzazione: this.isGeoLocation
      }
    },
    searchingByName() {
      return this.doctorName && !(this.lat && this.lon)
    },
    userCoords(){
      let userCoords = {
        lat: this.lat,
        lon: this.lon
      };
      return  this.lat && this.lon ? userCoords : null
    }

  },
  async created() {
    if (!this.userInfo) this.$router.replace(this.$routes.CHANGE_DOCTOR.HOME);

    this.isLoading = true;
    await this.newFiltersSearch(this.$route.params)

  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    getDoctorType() {
      let doctorType = null;
      if (!this.isFreeSearch && this.userAge) {
        if (this.userAge < 6) {
          doctorType = this.$config.changeDoctor.doctorsType.PLS;
        }
        if (this.userAge > 16) {
          doctorType = this.$config.changeDoctor.doctorsType.MMG;
        }
      }
      return doctorType
    },

    toggleFilters() {
      this.areFiltersOpen = !this.areFiltersOpen;
    },

    // Ricerca elenco ambulatori in base a filtri
    async searchDoctorsOffices(isNewSearch) {
      this.uploadNewElements = true;

      if (isNewSearch) {
        this.distanceSearchCounter = 0;
        this.doctorsListResults = null;
        this.doctorsOfficesResults = null;
        this.isSearchFinished = false;
        this.offset = 0;
      }

      let queryParams =  {
        latitudine: this.lat,
        longitudine: this.lon,
        distanza: this.distance,
        nome_medico: this.doctorName,
        sesso: this.selectedDoctorGender,
        tipologia: this.selectedDoctorType,
        limit: LIMIT,
        offset: this.offset,
        disponibilita: true
      };
      try {
        let officesListPromise = await doctorsOfficesListResults({_no5XXRedirect: true, params: queryParams});
        let officesResponse = officesListPromise.data;

        if (officesResponse.length === 0 && this.distanceSearchCounter < 5 && queryParams.latitudine && queryParams.longitudine && !queryParams.nome_medico) {
          this.distanceSearchCounter++;
          this.distance += 5;
          this.searchDoctorsOffices(false)
        } else {
          let headers = officesListPromise.headers;
          this.xPage = parseInt(headers['x-page']);
          this.xTotalPages = parseInt(headers['x-total-pages']);
          this.xTotalElements = parseInt(headers['x-total-elements']);
          this.xPageSize = parseInt(headers['x-page-size']);
          if (this.xPage < this.xTotalPages) {
            this.offset = this.offset + LIMIT;
          }
          this.filterDoctorsOffices(officesResponse, isNewSearch);
        }
      } catch (e) {
        let message = 'Non è stato possibile effettuare la ricerca.';
        if (is4XX(e)) {
          message = `Si è verificato un errore nella richiesta, i campi compilati potrebbero non essere corretti.`
        }
        notifyError(e, message)
      } finally {
        this.isLoading = false;
        this.uploadNewElements = false;
      }
    },
    //Funzione che consente di raggruppare gli ambulatori per ogni medico.
    async filterDoctorsOffices(officesResults, isNewSearch) {
      this.isSearchingOwnDoctor = false
      // let availabilityParams=[];
      if (officesResults && officesResults.length > 0) {

        //Viene nascosto il proprio medico
        let officeFilteredList = officesResults.filter(office => office.medico.id !== this.userDoctorId);
        this.isSearchingOwnDoctor = officeFilteredList.length === 0 && this.searchingByName

        let newOfficeList = officeFilteredList.map(office => {
          return {medico: office.medico, ambulatorio: office}
        });


        let officesByIdDoctor = newOfficeList.reduce((obj, offices) => {
          obj[offices.medico.id] = obj[offices.medico.id] || [];

          // if(!availabilityParams || !availabilityParams.find( params => equals(params,offices.medico))){
          //   availabilityParams.push(offices.medico);
          // }
          obj[offices.medico.id].push(offices.ambulatorio);
          return obj;
        }, {});

        // let availabilityResponse = await doctorsAvailability(availabilityParams, {_no5XXRedirect: true});
        // let availabilityList=  availabilityResponse.data;
        // let availabilityList = null; // da cancellare
        let doctorsList = Object.keys(officesByIdDoctor).map(key => {
          let listItem = newOfficeList.find(office => office.medico.id.toString() === key);
          listItem = listItem.medico;
          // if(availabilityList){
          //   let availability= availabilityList.find(a => a.medico_id === key);
          //   listItem.disponibilita = availability
          // }
          listItem.ambulatori = officesByIdDoctor[key];
          return listItem;
        });

        if (isNewSearch || !this.doctorsListResults) {
          this.doctorsListResults = doctorsList
        } else {
          let newList = [this.doctorsListResults, doctorsList];
          this.doctorsListResults = [...new Set([].concat(...newList))];
        }


      }
      this.isSearchFinished = true;
      this.isLoading = false;
    },

    isInvalidSearch(value) {
      this.invalidSearch = value;
    },

    loadMoreDoctors() {
      if (this.areMoreElements) {
        this.searchDoctorsOffices(false);
      }
    },
   async newFiltersSearch(params) {
      this.newSearch = true;
      this.uploadNewElements = true;
      this.isLoading=true;

      let {onlyUserAddress, lat, lon, indirizzo, isFreeSearch, distanza, sesso, tipologia, dottore, geolocalizzazione} = params

     if(onlyUserAddress && this.userInfo.domicilio && this.userInfo.domicilio.indirizzo){
         let normalizedAddressString = getStandardAddress(this.userInfo.domicilio.indirizzo);
         let city = this.userInfo.domicilio.comune
         let params= {indirizzo: normalizedAddressString + ' ' + city};
         let addressResponse = await getSuggestedAddress({ _no5XXRedirect: true, params: params});
         let options = addressResponse.data;
         if(!isEmpty(options)) options = normalizeLoccsiRoads(options);
         let userAddressList = options.filter(a => a.comune === city.toUpperCase());
         if(!userAddressList){
           let params= {indirizzo: city};
           let addressResponse = await getSuggestedAddress({ _no5XXRedirect: true, params: params});
           let options = addressResponse.data;
           if(!isEmpty(options)) options = normalizeLoccsiCities(options);
           userAddressList = options.filter(a => a.indirizzo === city.toUpperCase());
         }

       let userAddress = userAddressList[0];


         if(userAddress){
           this.lat = userAddress.coordinate.coordinates[1]
           this.lon = userAddress.coordinate.coordinates[0]
           this.searchArea = userAddress.indirizzo

         }

     }else{
       this.isFreeSearch = isFreeSearch
       this.isGeoLocation  = geolocalizzazione
       this.doctorName = dottore ? dottore : null;
       this.selectedDoctorType = tipologia ? tipologia : null;
       this.selectedDoctorGender = sesso ? sesso : null;
       this.lat = lat
       this.lon = lon
       this.searchArea = indirizzo
     }

     this.distance = distanza ? distanza : 2;

      if (this.lat & this.lon || this.doctorName) {
        await this.searchDoctorsOffices(this.newSearch);
      }
      this.uploadNewElements = false
      this.isLoading = false


    },
    showMap() {

      this.paramsForMap = {
        latitudine: this.lat,
        longitudine: this.lon,
        distanza: this.distance,
        nome_medico: this.doctorName,
        sesso: this.selectedDoctorGender,
        tipologia: this.selectedDoctorType,
        limit: this.xTotalElements,
        disponibilita: true,
        offset: null,
        geolocalizzazione: this.isGeoLocation
      };

      this.showMapModal = true
    },
    goToHomepage() {
      this.$router.replace(this.$routes.CHANGE_DOCTOR.HOME)
    }

  },

}
</script>
<style lang="stylus" scoped>
@require '~variables'

</style>
