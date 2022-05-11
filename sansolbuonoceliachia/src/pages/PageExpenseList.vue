<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
<!--    <template v-if="!isPiedmontUser">-->
<!--      <q-banner class="q-mb-md bg-info">-->
<!--        Il servizio è utilizzabile solo dai cittadini piemontesi-->
<!--      </q-banner>-->
<!--    </template>-->

<!--    <template v-if="isPiedmontUser && noPayslip">-->
    <template v-if="!isLoading">
      <template v-if="noPayslip">
        <q-banner  class="q-mb-sm h-banner" v-if="!isEmpty(paySlipErrorMessage)" :class="paySlipErrorMessage.color">
          <div class="text-body1">
            {{paySlipErrorMessage.message}}
          </div>

        </q-banner>

        <lms-buttons>
          <lms-button @click="goToHistory" outline> Storico movimenti</lms-button>
          <lms-button @click="goToFind" outline
          >trova punti vendita celiachia</lms-button
          >
        </lms-buttons>
      </template>

      <!--    <template v-if="!isLoading && isPiedmontUser && !noPayslip">-->
      <template v-else>
        <template v-if="isEmptyPaySlip">
          <q-banner  class="q-mb-md h-banner--info h-banner">
            <div class="text-body1">
              Attualmente non disponi di un buono valido.
            </div>
          </q-banner>
        </template>
        <q-card class="q-pa-md" v-else>
          <div class="row justify-between q-col-gutter-y-sm">
            <div class="text-h3">Le tue spese nel buono corrente</div>
            <div class="text-h6">Numero di autorizzazione: <strong>{{nAuthorization}}</strong></div>
          </div>

          <q-separator spaced="7px"></q-separator>
          <div class=" row q-mt-md reverse q-col-gutter-lg" :class="{'q-mt-md' : $q.screen.gt.sm}">
            <div class="col-md-6 col-12">
              <div class="row" v-if="currentPaySlip">
                <div class="text-center col-md-6 col-12 ">
                  <q-circular-progress
                    color="pink"
                    track-color="grey-3"
                    show-value
                    size="180px"
                    v-model="graphValue"
                  >
                    <div class="col text-center">
                      <div class="text-h3 text-bold">SALDO</div>
                      <div class="text-blue-10 text-weight-bold">
                        {{ availableAmount | decimals}}
                      </div>
                      <div class="text-caption">euro</div>
                    </div>
                  </q-circular-progress>
                </div>
                <div class="col-md-6 col-12" :class="{'text-center' : $q.screen.lt.md}">
                  <div class="q-pa-md">
                    <div>
                      Valore mensile
                    </div>
                    <div class="text-bold">
                      € {{ currentPaySlip.importo_totale | decimals}}
                    </div>
                  </div>

                  <div class="q-pa-md">
                    <div>
                      Il tuo credito scadrà il
                    </div>
                    <div class="text-bold">
                      {{ endDate | date }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-12 ">
              <template v-if="movementList.length>0">
                <q-scroll-area style="height: 220px; padding-right: 16px" v-if="$q.screen.gt.sm">
                  <div v-for="movement in movementList" :key="movement.id">
                    <div class="row  ">
                      <div class="col-md-3 col-12 q-pr-sm  ">
                        {{ movement.data | date }}
                      </div>
                      <div class="col-md-6 col-8 ">
                        <div>{{ movement.struttura.nome }}</div>
                        <div class="text-caption">{{movement.struttura.indirizzo}} - {{movement.struttura.comune}}</div>
                      </div>
                      <div class="col-md-3 col text-bold q-pl-sm text-right">
                        € {{ movement.importo | decimals}}
                      </div>
                    </div>
                    <q-separator spaced="12px"></q-separator>
                  </div>
                </q-scroll-area>
                <template v-else>
                  <div v-for="movement in movementList" :key="movement.id">
                    <div class="row  ">
                      <div class="col-md-3 col-12 q-pr-sm  ">
                        {{ movement.data | date }}
                      </div>
                      <div class="col-md-6 col-8 ">
                        <div>{{ movement.struttura.nome }}</div>
                        <div class="text-caption">{{movement.struttura.indirizzo}} - {{movement.struttura.comune}}</div>
                      </div>
                      <div class="col-md-3 col text-bold q-pl-sm text-right">
                        € {{ movement.importo | decimals}}
                      </div>
                    </div>
                    <q-separator spaced="12px"></q-separator>
                  </div>
                </template>
              </template>
              <q-banner  class="q-mb-md h-banner--info h-banner" v-else>
                <div class="text-body1">
                  Non sono presenti movimenti
                </div>
              </q-banner>

              <lms-buttons class="q-mt-md">
                <lms-button @click="goToHistory" outline>
                  Storico movimenti</lms-button
                >
              </lms-buttons>
            </div>
          </div>
        </q-card>
        <lms-buttons class="q-my-sm">
          <template v-if="!isProduction">
            <lms-button @click="showQrCode" outline v-if="!noPayslip" :loading="isLoadingQR">
              Paga con QR Code
            </lms-button>
          </template>

          <lms-button @click="goToFind" outline>
            Trova punti vendita celiachia
          </lms-button>
        </lms-buttons>
      </template>
    </template>

    <lms-inner-loading :showing="isLoading" block />

    <lms-qr-code-modal v-model="isQRModalVisible" :pin="currentPin" :tax-code="taxCode"/>
  </lms-page>
</template>

<script>
import {getCurrentPayslip, getCurrentPin, getMovementList} from "../services/api";
import {apiErrorNotify, errorHasResponse, isEmpty, isStatusIn} from "../services/utils";

import { PAYMENT_HISTORY } from "../router/routes";
import { date } from "quasar";
import LmsQrCodeModal from "../components/LmsQrCodeModal";
const { startOfDate, endOfDate, formatDate } = date;

export default {
  name: "PageExpenseList",
  components: {LmsQrCodeModal},
  data() {
    return {
      isLoading: false,
      movementList: [],
      graphValue: null,
      isQRModalVisible:false,
      isLoadingQR:false,
      monthNames: [
        "Gennaio",
        "Febbraio",
        "Marzo",
        "Aprile",
        "Maggio",
        "Giugno",
        "Luglio",
        "Agosto",
        "Settembre",
        "Ottobre",
        "Novembre",
        "Dicembre"
      ],
      currentPin:'',
    };
  },

  computed: {
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    currentPaySlip(){
      return this.$store.getters["getCurrentPayslip"];
    },
    availableAmount(){
      let amount = this.currentPaySlip?.importo_disponibile
      return amount>0 ? amount : 0
    },
    noPayslip(){
      return !this.currentPaySlip
    },
    paySlipErrorMessage(){
      return this.$store.getters["getPayslipErrMessage"];
    },
    user() {
      return this.$store.getters["getUser"];
    },

    isEmptyPaySlip(){
      return this.currentPaySlip === {};
    },
    scrollHeight(){
      if(this.$q.screen.lt.md) return '600px'
      return '220px'
    },
    nAuthorization(){
      return this.currentPaySlip?.autorizzazione?.codice ?? ''
    },

    validationDateEnd(){
      return this.currentPaySlip?.data_validita_fine
    },
    startDate(){
      return this.currentPaySlip?.data_inizio;
    },
    endDate(){
      return this.currentPaySlip?.data_fine;
    },
    month(){
      if(!this.currentPaySlip) return ''
      return  this.monthNames[
        new Date(this.currentPaySlip.data_inizio).getMonth()
        ];
    },
    isProduction(){
      return process.env.APP_IS_PROD
    },
    // currentPin(){
    //   return this.$store.getters["getCurrentPin"];
    // }
  },
  watch: {
    currentPaySlip: {
      immediate: true,
      deep:true,
      handler() {
       this.getDefaultInfo()
      }
    }
  },
  async created() {

  },
  methods: {
    isEmpty,
   async getDefaultInfo(){
      this.isLoading = true;
      if (!this.noPayslip) {
        try {
          let config = {};
          config.params = {
            da: formatDate(this.startDate, "YYYY-MM-DD"),
            a: formatDate(this.endDate, "YYYY-MM-DD")
          };
          let response = await getMovementList(this.taxCode, config);
          this.movementList = response.data;
        } catch (e) {
          // let message = "Non è stato possibile recuperare i dei movimenti";
          // apiErrorNotify({ e, message });
        }
      }

      this.isLoading = false;
      this.graphValue = 100;
      setTimeout(this.setGraphValue, 600);
    },
    setGraphValue() {
      if (this.currentPaySlip) {
        this.graphValue =
          (this.availableAmount /
            this.currentPaySlip.importo_totale) *
          100;
      } else {
        this.graphValue = 0;
      }
    },
    goToHistory() {
      let name = PAYMENT_HISTORY.name;
      this.$router.push({ name });
    },
    goToFind() {
      let url = window.location.href.replace(
        "buono-celiachia/#/spese-e-credito",
        "trova-un/#/punti-vendita-prodotti-celiaci"
      );
      window.location.assign(url);
    },
    async showQrCode(){
      this.isLoadingQR = true

      try {
        let response = await getCurrentPin(this.taxCode);
        let currentPin = response.data;
        let pinCode = currentPin?.codice
        this.currentPin= pinCode
        this.isQRModalVisible = true
      } catch (e) {
        let message = "Non è stato possibile recuperare il QR Code"
        apiErrorNotify({ message });
      }

      this.isLoadingQR = false
    },

  }
};
</script>
