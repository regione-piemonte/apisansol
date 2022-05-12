<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title noBack v-if="isNewAppointment">Nuovo appuntamento</lms-page-title>
    <lms-page-title noBack v-else>Modifica appuntamento</lms-page-title>
    <template v-if="!isLoading">
      <q-card class="q-my-md" v-if="isAppointmentCreated">
        <q-card-section class="q-pa-none" horizontal>
          <q-card-section class="bg-positive">
            <q-avatar
              font-size="lms-space-xxl"
              color="white"
              text-color="positive"
              icon="done"
            />
          </q-card-section>
          <q-card-section>
            <div class="text-h6 text-weight-bold q-pb-sm">
              Il tuo nuovo appuntamento è stato correttamente prenotato.
            </div>
            <div class="q-py-sm">
              <strong>{{ appointmentName | capitalize}}</strong>
            </div>
            <div class="q-py-sm">
              <div>
                Data: <strong>{{ appointmentDate | format }}</strong>
              </div>
              <div>
                Ora: <strong>{{ appointmentHour }}</strong>
              </div>
              <div>
                Luogo: <strong>{{ opUnitAddress }}</strong>
              </div>
            </div>

          </q-card-section>
        </q-card-section>
      </q-card>
      <div v-else>
        <q-banner  class="h-banner h-banner--negative q-mt-lg">
          La richiesta non è andata a buon fine.
        </q-banner>
      </div>
      <div>
        <lms-buttons class="q-mt-lg">
          <lms-button outline @click="GoToHomepage()"
            >Torna alla home</lms-button
          >
          <lms-button
            outline
            @click="printNewAppointment()"
            v-if="isAppointmentCreated"
            >Stampa</lms-button
          >
          <lms-button
            outline
            @click="saveOnCalendar()"
            v-if="isAppointmentCreated"
            >Salva su calendario</lms-button
          >
        </lms-buttons>
      </div>
    </template>

    <csi-print-appointment :appointment="printAppointmentData" />
    <lms-inner-loading :showing="isLoading" />
  </lms-page>
</template>

<script>
import { HOME } from "src/router/routes";
import {apiErrorNotify, deepClone, capitalize, isEmpty} from "src/services/utils";
import { changeAppointment, createNewAppointment } from "src/services/api";
import { date } from "quasar";
import { downloadICalendar } from "src/services/api";
import CsiPrintAppointment from "../components/preventionScreening/CsiPrintAppointment";
import {APPOINTMENT_TYPES_NAME} from "src/services/config";

export default {
  name: "PageNewAppointmentSummary",
  components: {CsiPrintAppointment},
  data() {
    return {
      HOME,
      isLoading: false,
      typeId: "",
      typeLabel: "",
      appointment: null,
      opUnitAddress: "",
      isAppointmentCreated: false,
      isNewAppointment: false,
      APPOINTMENT_TYPES_NAME
    };
  },
  computed: {
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    userCodes() {
      return this.$store.getters["preventionScreening/getUserCodes"];
    },
    appointmentName(){
      if(this.typeId) return APPOINTMENT_TYPES_NAME[this.typeId]
      else return ''
    },
    appointmentIcon(){
      return `img:/statics/la-mia-salute/icone/screening-${this.typeLabel}.svg`;
    },
    appointmentDate(){
      return this.appointment?.data
    },
    appointmentHour(){
      return this.appointment?.ora_slot ? this.appointment?.ora_slot.slice(0,5) : ''
    },
    printAppointmentData(){
      if(this.appointment){
        return{
          name: this.appointmentName,
          label: this.typeLabel,
          icon: this.appointmentIcon,
          date: this.appointment.data,
          hour: this.appointment.ora_slot,
          place: this.opUnitAddress
        }
      }else{
        return null
      }

    }
  },
  created() {
    this.isLoading = true;
    if(isEmpty(this.$route.params) || !this.$route.params?.newAppointmentInfo){
      this.GoToHomepage()
      return
    }

    let {
      newAppointmentInfo,
      opUnitAddress,
      type,
      isNewAppointment
    } = this.$route.params;
    this.typeLabel = type;
    this.appointment = newAppointmentInfo;
    this.typeId = this.appointment.tipologia_codice;
    this.opUnitAddress = opUnitAddress;
    this.isNewAppointment = isNewAppointment;

    if (this.isNewAppointment) this.createNewAppointment();
    else this.changeAppointment();
  },
  methods: {
    async createNewAppointment() {
      this.isLoading = true
      try {
        let appointmentQuery = deepClone(this.appointment)
        delete appointmentQuery.progressivo;
        console.log(appointmentQuery);
        let newAppointmentResponse = await createNewAppointment(
          this.cf,
          appointmentQuery,
          { params: this.userCodes }
        );
        this.isAppointmentCreated = true;
      } catch (e) {
        apiErrorNotify({
          error: e,
          message: "Impossibile creare nuovo appuntamento."
        });
      } finally {
        this.isLoading = false;
      }
    },

    async changeAppointment() {
      delete this.appointment["tipologia_codice"];
      try {
        let newAppointmentResponse = await changeAppointment(
          this.cf,
          this.typeId,
          this.appointment,
          { params: this.userCodes }
        );
        console.log(newAppointmentResponse.data);
        this.isAppointmentCreated = true;
      } catch (e) {
        apiErrorNotify({
          error: e,
          message: "Impossibile modificare l'appuntamento."
        });
      } finally {
        this.isLoading = false;
      }
    },

    GoToHomepage() {
      this.$router.push(HOME);
    },

    printNewAppointment() {
      const id= `print-appointment-${this.typeLabel}`
      const prtHtml = document.getElementById(id).innerHTML;
      // Get all stylesheets HTML
      let stylesHtml = "";
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"], style')
      ]) {
        stylesHtml += node.outerHTML;
      }
      // Open the print window
      const WinPrint = window.open(
        "",
        "_blank"
      );
      WinPrint.document.write(`<!DOCTYPE html>
                  <html>
                    <head>
                      ${stylesHtml}
                    </head>
                    <body class="print-page">
                      ${prtHtml}
                    </body>
                  </html>`);

      // WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      //WinPrint.close();
    },

    async saveOnCalendar() {
      const time = this.appointment.ora_slot;
      let hours = time.split(":")[0];
      let minutes = time.split(":")[1];
      let startDate = date.addToDate(this.appointment.data, {
        hours: hours,
        minutes: minutes
      });

      let endDate = date.addToDate(startDate, { hours: 1 });
      let params = {
        file_nome: `appuntamento_screening_${this.typeLabel}`,
        da: startDate,
        a: endDate,
        nome: this.appointmentName ? capitalize(this.appointmentName) : '',
        luogo: this.opUnitAddress
      };

      try {
        let iCalendarResponse = await downloadICalendar({ params: params });

      } catch (e) {
        apiErrorNotify({
          error: e,
          message: "Impossibile effettuare il download."
        });
      }
      //
    }
  }
};
</script>

<style scoped></style>
