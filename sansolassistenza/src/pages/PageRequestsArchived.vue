<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <!--        FILTRI-->
    <q-card class="bg-transparent q-mb-md" flat v-if="requests.length>0">
      <q-card-section class="no-padding">
        <div class="row items-center q-col-gutter-lg q-mb-lg">
          <div v-if="$q.screen.gt.sm" class="col-md-auto col-12 ">
            <div class="self-center text-weight-bold">
              <q-icon class="q-mr-sm" name="filter_list" size="sm"/>
              Filtri
            </div>
          </div>
          <div v-else class="col-12">
            <div class="row items-center">
              <div class="col-auto">
                <q-btn color="white" icon="filter_list" label="Filtri" text-color="black"
                       @click="openFilters"/>
              </div>
            </div>
          </div>
          <q-slide-transition>
            <div v-show="isOpenFilters" class="col-md col-12">
              <div class="row items-center q-col-gutter-lg">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="keyword"
                    :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
                    dense
                    label="Parola chiave"
                    clearable
                    float-label
                    v-on:keyup.enter="setFilters"
                    @blur="setFilters"
                    @clear="setFilters($event, true)"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="serviceSelected"
                    :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
                    :options="requestAppOptions"
                    clearable
                    dense
                    label="Servizio"
                    @input="setFilters"
                    @clear="setFilters($event, true)"
                  >
                  </q-select>
                </div>
              </div>
            </div>
          </q-slide-transition>

        </div>
      </q-card-section>
    </q-card>

    <div class="col sm-gutter no-wrap">
      <template v-if="!requestList.length">
        <q-card class="my-card" v-if="isLoading">
          <div v-for="i in 5" :key="i">
            <assistance-request-item-skeleton archive :index="i"/>
            <q-separator />
          </div>
        </q-card>
        <q-banner v-show="!isLoading" class="h-banner h-banner--info q-mt-md">Nessuna richiesta archiviata.</q-banner>
      </template>
      <template v-else>
        <q-card class="my-card">
          <div v-for="(request,index) in requestList" :key="index"
               class="col-xs-5 col-sm-3 col-md-2">
            <assistance-request-item :request="request" @cancel-request="refreshPage"/>

            <q-separator v-if="index < requestList.length -1" spaced="12px"/>
          </div>
        </q-card>
      </template>
    </div>
  </lms-page>
</template>

<script>
import {apiErrorNotify, isEmpty, orderBy, uniqueElementsBy} from "../services/utils";
import {archiveRequest, deleteRequest, getRequests} from "../services/api";

import {date, Screen} from "quasar";
import {REQUEST_DETAIL} from "src/router/routes";
import AssistanceRequestItem from "components/AssistanceRequestItem";
import {requestAppName} from "src/services/business-logic";
import AssistanceRequestItemSkeleton from "components/AssistanceRequestItemSkeleton";

const {startOfDate, endOfDate, formatDate} = date;

export default {
  name: "PageRequestsOpened",
  components: {AssistanceRequestItemSkeleton, AssistanceRequestItem},
  data() {
    return {
      Screen,
      requests: [],
      filteredRequestList: [],
      isLoading: false,
      isLoadingFilters:false,
      isOpenFilters: false,
      keyword: '',
      keywordsOptions: [],
      serviceSelected: null,
      orderType: null,
      requestAppOptions:[],
      orderOptions: [
        {
          label: 'Data',
          value: 'data'
        },
        {
          label: 'Servizio',
          value: 'servizio'
        }
      ],
    };
  },
  watch: {
    taxCode: {
      immediate: true,
      handler(val, oldVal) {
        this.refreshPage(true)
      }
    },
    Screen: {
      deep: true,
      immediate: true,
      handler(newval, oldval) {
        if (newval?.gt.sm)
          this.isOpenFilters = true
      }
    }
  },
  computed: {
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    appList() {
      return this.$store.getters['getAssistanceAppList']
    },
    requestList() {
      let requestList = []
      let orderedList = []
      if(this.filteredRequestList?.length>0) {

        requestList = this.filteredRequestList.map(request => {
          let code = request.asset_id
          request.applicazione_descrizione = requestAppName(code)
          return request
        })

        orderedList = orderBy(requestList, ['data_aggiornamento'], ['desc'])
      }

     return orderedList
    },

  },
  async created() {
  },
  methods: {
    async getRequestList() {
      this.isLoading = true
      let params = {
        archiviata: true
      }
      try {
        let response = await getRequests(this.taxCode, {params});
        this.requests = response.data;
        this.getRequestAppOptions(this.requests)
        this.filteredRequestList = this.requests
      } catch (e) {
        console.log(e);
        let message = "Non è stato possibile ottenere le richieste";
        apiErrorNotify({e, message});
      }finally {
        this.isLoading = false
      }


    },
    refreshPage(value) {
      if (value) {
        this.requests = []

        this.getRequestList()
      }

    },
    openFilters() {
      this.isOpenFilters = !this.isOpenFilters
    },
    filterKeyword(val) {

    },
    clearKeyword(val) {

    },
    getRequestAppOptions(requests){
      let options=[]
      let appList = []
      if(requests.length>0){
        appList = requests.map(request =>{
          return {
            value: request.asset_id,
            label: requestAppName(request.asset_id)
          }
        })

        let uniqueElements = uniqueElementsBy(appList, (a,b) => a.value === b.value);

        options = orderBy(uniqueElements, ['label'])
      }
      this.requestAppOptions =  options
    },
    async setFilters( val, isClearing = false){

      let validKeyword = !isEmpty(this.keyword) && this.keyword.length>3
      if(!validKeyword && !this.serviceSelected && !isClearing) return

      this.isLoading = true;
      this.filteredRequestList = []
      let params = {
        parola_chiave: null,
        applicazione: null,
        archiviata: true
      }

      if(validKeyword){
        params.parola_chiave = this.keyword
      }

      if(this.serviceSelected){
        params.applicazione = this.serviceSelected.value
      }


      try {
        let response = await getRequests(this.taxCode, {params});
        this.filteredRequestList = response.data;
      } catch (e) {
        console.log(e);
        let message = "Non è stato possibile ottenere le richieste";
        apiErrorNotify({e, message});
      }
      this.isLoading = false

    },

  }
};
</script>

