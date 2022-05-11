<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div class="col sm-gutter no-wrap">
      <template v-if="!requestList.length">
        <q-card class="my-card" v-if="isLoading">
          <div v-for="i in 5" :key="i">
            <assistance-request-item-skeleton :index="i"/>
            <q-separator />
          </div>
        </q-card>
        <q-banner v-show="!isLoading" class="h-banner h-banner--info q-mt-md" >Nessuna richiesta aperta.</q-banner>
      </template>
      <template v-else>
          <q-card class="my-card" >
            <div v-for="(request,index) in requestList" :key="index"
                 class="col-xs-5 col-sm-3 col-md-2">
              <assistance-request-item :request="request" @cancel-request="refreshPage"/>
              <q-separator v-if="index < requestList.length -1"/>
            </div>
          </q-card>
      </template>
    </div>


  </lms-page>
</template>

<script>
import {apiErrorNotify, orderBy} from "../services/utils";
import {archiveRequest, getRequests} from "../services/api";
import { date } from "quasar";
import {REQUEST_DETAIL, REQUESTS_OPENED} from "src/router/routes";
import AssistanceRequestItem from "components/AssistanceRequestItem";
import {requestAppName} from "src/services/business-logic";
import AssistanceRequestItemSkeleton from "components/AssistanceRequestItemSkeleton";
const { startOfDate, endOfDate, formatDate } = date;

export default {
  name: "PageRequestsOpened",
  components: {AssistanceRequestItemSkeleton, AssistanceRequestItem},
  data() {
    return {
      requests:[],
      isLoading:false
    };
  },
  watch:{
    taxCode:{
      immediate:true,
      handler(val,oldVal){
        this.refreshPage(true)
      }
    }
  },
  computed: {
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    appList(){
      return this.$store.getters['getAssistanceAppList']
    },
    requestList(){
      let requestList = []
      let orderedList = []


      if(this.requests?.length>0) {

        requestList = this.requests.map(request => {
          let code = request.asset_id
          request.applicazione_descrizione = requestAppName(code)
          return request
        })

        orderedList = orderBy(requestList, ['data_aggiornamento'], ['desc'])
      }

      return orderedList
    }
  },
  async created() {


  },
  methods: {
    async getRequestList(){
      this.isLoading = true
      try {
        let params = {
          archiviata: false
        }
        let response = await getRequests(this.taxCode, {params});
        this.requests = response.data;

      } catch (e) {
        console.log(e);
        let message = "Non è stato possibile ottenere le richieste";
        apiErrorNotify({ e, message });
      }finally {
        this.isLoading = false
      }
    },
    refreshPage(value){
      if(value){
        this.requests=[]
        this.getRequestList()
      }

    }
  }
};
</script>

