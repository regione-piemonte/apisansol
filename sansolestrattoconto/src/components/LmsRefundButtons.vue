<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-buttons>
    <lms-button no-min-width outline @click="onPrintRequest" :loading="isRequestPrinting">
      <template v-if="refund.rimborso_modalita_codice === REFOUND_METHOD_MAP.VOUCHER">Stampa voucher</template>
      <template v-if="refund.rimborso_modalita_codice === REFOUND_METHOD_MAP.BONIFICO">Stampa richiesta</template>
    </lms-button>
    <lms-button no-min-width outline @click="onPrintReceipt" :loading="isReceiptPrinting">
      Stampa ricevuta
    </lms-button>
  </lms-buttons>
</template>

<script>
import {REFOUND_METHOD_MAP} from "src/services/config";
import {downloadRefundOrRequest} from "src/services/api";
import {apiErrorNotify} from "src/services/utils";
import {httpAuth} from "boot/http";

export default {
  name: "LmsRefundButtons",
  props: {
    refund: {type: Object, default: null},
  },
  data() {
    return {
      REFOUND_METHOD_MAP,
     isReceiptPrinting:false,
     isRequestPrinting:false
    }
  },
  computed:{
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
  },
  methods: {
    async onPrint(ticketId,params){
      let form = document.createElement('form');
      form.id = 'form-temp';
      form.method = 'post';
      form.action = `${httpAuth.defaults.baseURL}/apisanffe/api/v1/cittadini/${this.taxCode}/ticket-pagati/${ticketId}/richiesta-rimborso/pdf`;

      let hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = 'payload';
      hiddenField.value = JSON.stringify(params);

      form.append(hiddenField);
      document.body.appendChild(form);
      form.submit();
      setTimeout(() => {
        document.getElementById('form-temp').outerHTML = '';
      });
      this.isReceiptPrinting = false
      this.isRequestPrinting = false
    },
    async onPrintReceipt() {
      this.isReceiptPrinting = true
      let ticketId = this.refund.numero_pratica
      let params = {
        stampabile:true,
        id_rimborso:[this.refund.id_rimborso],
        codice_asr: this.refund.asr_id
      }
      try{
        await this.onPrint(ticketId,params)
      }catch (error) {
        let message="Non è stato possibile scaricare il documento"
        apiErrorNotify({error, message})
      }


    },
    async onPrintRequest(){
      this.isRequestPrinting = true
      let ticketId = this.refund.numero_pratica
      let params = {
        modalita_rimborso: this.refund.rimborso_modalita_codice,
        stampabile:true,
        codice_asr: this.refund.asr_id
      }
      try{
        await this.onPrint(ticketId,params)
      }catch (error) {
        let message="Non è stato possibile scaricare il documento"
        apiErrorNotify({error, message})
      }


    },
  }
}
</script>

<style scoped>

</style>
