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
        <q-banner rounded class="q-mb-md h-banner " v-if="!isEmpty(paySlipErrorMessage)" :class="paySlipErrorMessage.color">
          <div class="text-body1">
            <!--          Attualmente non disponi di un buono valido.-->
            {{paySlipErrorMessage.message}}
          </div>
        </q-banner>
      </template>

      <!--    DA METTERE LA VERSIONE CON CONTROLLO-->
      <!--    <template v-if="!isLoading && isPiedmontUser && !noPayslip">-->
      <template v-else>
        <template v-if="isEmptyPaySlip">
          <q-banner class="q-mb-md h-banner h-banner--info">
            <div class="text-body1">
              Attualmente non disponi di un buono valido.
            </div>
          </q-banner>
        </template>

        <q-card class="q-pa-md" v-else>
          <div class=" q-py-md row items-center q-col-gutter-md"
          >
            <div class="col-md-8 col-sm-7 col-12">
              Visualizza il tuo PIN per effettuare i pagamenti
            </div>
            <div class="col-md-4 col-sm-5  col-12">
              <lms-buttons>
                <lms-button  @click="showCurrentPin" outline :loading="isLoadingPin">
                  Visualizza PIN</lms-button
                >
              </lms-buttons>
            </div>

          </div>
          <q-separator spaced="8px"/>
          <div class=" q-py-md row items-center q-col-gutter-md"
          >
            <div class="col-md-8  col-sm-7 col-12">
              Se temi che qualcuno stia usando il tuo PIN, richiedi un nuovo PIN
            </div>
            <div class="col-md-4 col-sm-5 col-12 ">
              <lms-buttons>
                <lms-button  @click="confirmNewPin" outline :loading="isLoadingNewPin">
                  Richiedi un nuovo PIN</lms-button
                >
              </lms-buttons>

            </div>
          </div>
          <template v-if="!isProduction">
            <q-separator spaced="8px"/>
            <div class=" q-py-md row items-center  q-col-gutter-md"
            >
              <div class="col-md-8 col-sm-7 col-12">
                <div>
                  Se vuoi pagare con QR Code, aprilo e mostralo al rivenditore
                </div>
                <div class="text-caption">
                  (Questo metodo di pagamento è valido solo presso alcuni
                  rivenditori, chiedi prima di pagare)
                </div>
              </div>
              <div class="col-md-4 col-sm-5 col-12 ">
                <lms-buttons>
                  <lms-button @click="showQrCode" outline :loading="isLoadingQR">
                    Paga con QR Code</lms-button
                  >
                </lms-buttons>
              </div>

            </div>
          </template>
        </q-card>


      </template>
    </template>

    <!--      DIALOG QR CODE-->
    <lms-qr-code-modal v-model="isQRModalVisible" :pin="currentPin" :tax-code="taxCode"/>

    <!--DIALOG CONFERMA NUOVO PIN-->
    <q-dialog v-model="confirmNewPinDialogOpen">
      <q-card  class="q-pa-md">
        <q-card-section class="row items-center no-padding">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <p >
            Stai per modificare il tuo codice PIN.
          </p>
        </q-card-section>
        <!-- buttons example -->
        <q-card-actions align="right">
          <lms-buttons >
            <lms-button  @click="showNewPin"  :loading="isLoadingNewPin">Conferma</lms-button>
            <lms-button outline v-close-popup>Annulla</lms-button>
          </lms-buttons>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!--DIALOG PIN-->
    <q-dialog v-model="isPinModalVisible">
      <q-card style="width: 400px" class="q-pa-md text-center">
        <q-card-section class="row items-center no-padding">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div class="text-h3" v-if="currentPin">
            <div  class="text-center">Il tuo PIN:</div>
            <h1 class="q-my-xl" style="letter-spacing: 1px; font-size: 40px"><strong > {{ currentPin }}</strong></h1>
          </div>
          <div v-else>
            <q-banner class="h-banner h-banner--negative">
              <div class="text-body1">
                Non è stato possibile recuperare il codice PIN
              </div>
            </q-banner>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <lms-inner-loading :showing="isLoading" block />
  </lms-page>
</template>

<script>
import {apiErrorNotify, errorHasResponse, isEmpty, isStatusIn} from "../services/utils";
import {
  createNewPin,
  getCurrentPin,
} from "../services/api";

import LmsQrCodeModal from "../components/LmsQrCodeModal";


export default {
  name: "PagePayment",
 components:{LmsQrCodeModal},

  data() {
    return {
      isLoading: false,
      isPinModalVisible: false,
      isLoadingPin: false,
      isLoadingNewPin: false,
      isQRModalVisible: false,
      isLoadingQR: false,
      windowWidth: window.innerWidth,
      qrCode: null,
      qrCodeOption: null,
      pinErrorMessage:'',
      confirmNewPinDialogOpen:false
    };
  },

  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    };
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
  computed: {
    isEmptyPaySlip(){
      return isEmpty(this.currentPaySlip);
    },
    noPayslip(){
      return !this.currentPaySlip
    },
    currentPaySlip(){
      return this.$store.getters["getCurrentPayslip"];
    },
    paySlipErrorMessage(){
      return this.$store.getters["getPayslipErrMessage"];
    },
    currentPin(){
      return this.$store.getters["getCurrentPin"];
    },
    isProduction(){
      return process.env.APP_IS_PROD
    },
    isMaximized() {
      if (this.windowWidth < 800) {
        return true;
      }
      return false;
    },

    taxCode() {
      return this.$store.getters["getTaxCode"];
    }
  },
  async created() {

  },
  methods: {
    isEmpty,
    async getDefaultInfo(){

      if(!this.noPayslip) {
        try {
          let response = await getCurrentPin(this.taxCode);
          let currentPin = response.data;
          let pinCode = currentPin?.codice
          this.$store.dispatch('setNewPin', pinCode)
        } catch (e) {
          this.pinErrorMessage = " Non è stato possibile creare un nuovo PIN";
        }
      }

      this.isLoading = false
    },
    async showCurrentPin() {
      if (this.currentPin) {
        this.isPinModalVisible = true
      } else {
        let message = this.pinErrorMessage
        apiErrorNotify({message});
      }
    },
    confirmNewPin(){
      this.confirmNewPinDialogOpen=true
    },

    async showNewPin() {
      this.isLoadingNewPin = true;
      try {
        let responseNew = await createNewPin(this.taxCode);

        let response = await getCurrentPin(this.taxCode);
        let currentPin = response.data;
        let pinCode = currentPin?.codice
        this.$store.dispatch('setNewPin', pinCode)
        this.isPinModalVisible = true
      } catch (e) {
        let message = " Non è stato possibile creare un nuovo PIN";

        apiErrorNotify({message});
      } finally {
        this.isLoadingNewPin = false;
        this.confirmNewPinDialogOpen=false
      }

    },
    async showQrCode() {
      if (this.currentPin) {
        this.isQRModalVisible = true
      } else {
        let message = "Non è stato possibile recuperare il QR Code";
        apiErrorNotify({message});
      }
    }
  }
};
</script>
