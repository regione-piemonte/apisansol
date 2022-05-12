<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title
    >Modifica data per
      {{ this.screeningName | capitalize }}
    </lms-page-title
    >
    <q-card class="q-my-md text-body1" v-if="appointment">
      <q-card-section class="q-pa-none">
        <lms-card-item no-actions>
          <template slot="primary">
            <lms-card-item-primary>
              <template slot="icon">
                <q-icon size="md" :name="appointmentTypeIcon"/>
              </template>
              <template slot="text">
                <div class="text-subtitle1 text-weight-bold q-pa-sm">
                  Appuntamento attuale
                </div>
              </template>
            </lms-card-item-primary>
          </template>
          <template slot="secondary">
            <q-item class="full-height" :class="{'q-pt-lg' : $q.screen.gt.xs}">
              <q-item-section>
                <div class="row items-stretch">
                  <div class="col-12 col-sm-6 " v-if="!isDummyAppointment">
                    <div class="row">
                      <div class="col">
                        <div>Data</div>
                        <div>
                          <strong>{{ appointmentDate | date }}</strong>
                        </div>
                      </div>
                      <div class="col">
                        <div>Orario</div>
                        <div>
                          <strong>{{ appointmentHour }}</strong>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div class="col-12 col-sm-6" :class="{'q-pt-md' : $q.screen.lt.sm}">
                    <div>Struttura</div>
                    <div><strong>{{ appointmentOpUnit }}</strong></div>
                    <div>
                      {{ appointmentAddress }}
                    </div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
            <template slot="actions"></template>
          </template>
        </lms-card-item>
      </q-card-section>
    </q-card>
    <template v-if="!isLoading">
      <template v-if="firstAvailableDate">

        <div class="q-my-xl">
          Verifica disponibilità della struttura:
          <strong>
            {{ appointmentOpUnit }}
          </strong>
        </div>

        <div>
          <q-card>
            <csi-appointment-edit-date-time
              :agenda-id="agendaId"
              :appointment-type="typeId"
              :first-available-date="firstAvailableDate"
              @new-appointment="selectedNewDateTime"
              @is-date-list="isAvailableDateList"
            />
          </q-card>


        </div>

        <div class="q-my-lg" v-if="areAvailableDates">
          <lms-buttons>
            <lms-button @click="confirmNewChoice()">Conferma</lms-button>
          </lms-buttons>
        </div>

      </template>

      <div v-if="!firstAvailableDate && !opUnitErr" class="q-mt-xl">
        <q-banner class="full-width h-banner h-banner--info">
          Nessuna disponibilità per la struttura
          <strong>{{ appointmentOpUnit }} - {{ appointmentAddress }}</strong>
        </q-banner>
        <lms-buttons class="q-mt-md">
          <lms-button @click="changeOpUnit">Scegli un'altra struttura</lms-button>
        </lms-buttons>
      </div>

      <div v-if="opUnitErr" class="q-mt-xl">
        <q-banner class="full-width h-banner h-banner--negative">
          Non è stato possibile ottenere le date disponibili per la struttura selezionata.Ti invitiamo a riprovare più
          tardi.
        </q-banner>
      </div>
    </template>
    <div v-else class="q-mt-xl">
      <lms-inner-loading :showing="isLoading" block class="bg-transparent"/>
    </div>

    <!--    DIALOG CONFERMA MODIFICA-->
    <csi-new-appointment-confirm-choice-dialog :value="isConfirmChoiceDialog" :appointment-params="newAppointmentParams"
                                               @close-dialog="closeConfirmDialog"/>



  </lms-page>
</template>

<script>
import CsiAppointmentEditDateTime from "../components/preventionScreening/CsiAppointmentEditDateTime";
import {getOperatingUnitDetail} from "src/services/api";
import {HOME, NEW_APPOINTMENT_SUMMARY, NEW_APPOINTMENT_PLACE} from "src/router/routes";
import {apiErrorNotify, is4XX, is5XX, isEmpty} from "../services/utils";
import CsiNewAppointmentConfirmChoiceDialog
  from "../components/preventionScreening/CsiNewAppointmentConfirmChoiceDialog";
import {APPOINTMENT_TYPES_NAME} from "src/services/config";

export default {
  name: "PageNewDateAppointment",
  components: {CsiNewAppointmentConfirmChoiceDialog, CsiAppointmentEditDateTime},
  data() {
    return {
      HOME,
      NEW_APPOINTMENT_SUMMARY,
      APPOINTMENT_TYPES_NAME,
      NEW_APPOINTMENT_PLACE,
      appointment: null,
      typeLabel: '',
      typeId: null,
      screeningName: "",
      appointmentTypeIcon: "",
      selectedDate: null,
      selectedTime: null,
      agendaId: null,
      firstAvailableDate: null,
      isConfirmChoiceDialog: false,
      newAppointmentParams: {},
      isDummyAppointment: false,
      areAvailableDates: false,
      opUnitErr: '',
      isLoading: false
    };
  },
  computed: {
    userCodes() {
      return this.$store.getters["preventionScreening/getUserCodes"];
    },
    appointmentOpUnit() {
      return this.appointment ? this.appointment.luogo : ''
    },
    appointmentAddress() {
      let details = this.appointment?.detail
      return details ? `${details.unita_operativa_indirizzo}, ${details.unita_operativa_civico} - ${details.unita_operativa_comune}` : ''
    },
    appointmentDate() {
      return this.appointment?.data
    },
    appointmentHour() {
      return this.appointment?.ora ? this.appointment?.ora.slice(0, 5) : ''
    }
  },
  created() {
    if (isEmpty(this.$route.params) || !this.$route.params?.appointment) {
      this.$router.push(HOME);
      return
    }
    let {type, typeId, appointment, isDummyAppointment} = this.$route.params;
    this.typeLabel = type;
    this.typeId = typeId;
    this.appointment = appointment;
    this.isDummyAppointment = isDummyAppointment;
    this.screeningName = APPOINTMENT_TYPES_NAME[typeId];
    this.appointmentTypeIcon = `img:/statics/la-mia-salute/icone/screening-${this.typeLabel}.svg`;
    if (this.appointment) {
      this.agendaId = Number(this.appointment.agenda_codice);
    }
    this.getOpUnitDetail();
  },
  methods: {
    selectedNewDateTime(dateTime) {
      this.selectedDate = dateTime.date;
      this.selectedTime = dateTime.time;
    },

    async getOpUnitDetail() {
      this.isLoading = true
      this.opUnitErr = false
      let opUnitId = this.appointment?.detail.unita_operativa_codice;
      let params = {
        tipologia: this.typeId,
        codice_interno: this.userCodes.codice_interno,
        codice_interno_prefisso: this.userCodes.codice_interno_prefisso,
        asl: this.appointment?.detail.asl_codice
      };
      try {
        let opUnitResponse = await getOperatingUnitDetail(opUnitId, {
          _no5XXRedirect: true,
          params: params
        });
        this.firstAvailableDate =
          opUnitResponse.data.data_primo_appuntamento_disponibile;
      } catch (e) {

        if (is5XX(e)) {
          this.opUnitErr = true
          apiErrorNotify({
            error: e,
            message: "Errore nel caricamento delle date selezionate."
          });
        }

      } finally {
        this.isLoading = false
      }
    },


    confirmNewChoice() {
      if (!this.selectedDate || !this.selectedTime) {
        return;
      }

      let opUnitAddress = `${this.appointment.detail.unita_operativa_indirizzo} ${this.appointment.detail.unita_operativa_civico}, ${this.appointment.detail.unita_operativa_comune}`;
      this.newAppointmentParams = {
        newAppointmentInfo: {
          tipologia_codice: this.typeId,
          agenda_codice: this.agendaId,
          unita_operativa_codice: this.appointment.detail
            .unita_operativa_codice,
          asl_codice: this.appointment.detail.asl_codice,
          dipartimento_codice: this.appointment.detail.dipartimento_codice,
          data: this.selectedDate,
          ora: this.selectedTime.ora,
          ora_inizio: this.selectedTime.ora_inizio,
          ora_fine: this.selectedTime.ora_fine,
          ora_slot: this.selectedTime.ora_slot,
          progressivo: this.selectedTime.progressivo
        },
        opUnitAddress: opUnitAddress,
        type: this.typeLabel
      };


      this.isConfirmChoiceDialog = true

    },

    createNewAppointment() {


      let opUnitAddress = `${this.appointment.detail.unita_operativa_indirizzo} ${this.appointment.detail.unita_operativa_civico}, ${this.appointment.detail.unita_operativa_comune}`;
      let params = {
        newAppointmentInfo: {
          tipologia_codice: this.typeId,
          agenda_codice: this.agendaId,
          unita_operativa_codice: this.appointment.detail
            .unita_operativa_codice,
          asl_codice: this.appointment.detail.asl_codice,
          dipartimento_codice: this.appointment.detail.dipartimento_codice,
          data: this.selectedDate,
          ora: this.selectedTime.ora,
          ora_inizio: this.selectedTime.ora_inizio,
          ora_fine: this.selectedTime.ora_fine,
          ora_slot: this.selectedTime.ora_slot,
          progressivo: this.selectedTime.progressivo
        },
        opUnitAddress: opUnitAddress,
        type: this.typeLabel
      };
      let route = {
        name: this.NEW_APPOINTMENT_SUMMARY.name,
        params
      };

      this.$router.replace(route);
    },
    closeConfirmDialog(val) {
      this.isConfirmChoiceDialog = false
    },
    isAvailableDateList(val) {
      this.areAvailableDates = val
    },
    changeOpUnit() {
      let params = {
        type: this.typeLabel,
        typeId: this.typeId,
        appointment: this.appointment,
        isDummyAppointment: this.isDummyAppointment
      };

      let route = {
        name: this.NEW_APPOINTMENT_PLACE.name,
        params
      };

      this.$router.replace(route);
    }


  }
};
</script>

<style lang="sass"></style>
