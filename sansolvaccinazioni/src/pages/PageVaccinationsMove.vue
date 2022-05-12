<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div v-if="!isLoading">
      <lms-page-title class="q-mb-md">Sposta appuntamento</lms-page-title>

      <!--caso non agenda-->
      <div v-if="!agenda">
        <q-banner class="q-mb-md q-banner--info">
          <div class="text-body1 ">
            <p>
              Hai richiesto la modifica per la prenotazione per i seguenti
              vaccini: <strong>{{ vaccinationsName | capitalCase}}</strong>
            </p>
            <p class="q-mb-sm">Desideri confermare la richiesta e i tuoi contatti?</p>
          </div>
        </q-banner>

        <q-card class="q-pa-md">
          <q-form ref="form" greedy @submit.prevent="" :class="$q.screen.lt.md ? 'q-gutter-lg' : 'q-gutter-md'">
            <div v-if="citizen">
              <!--CHIEDO I CONTATTI-->
              <div class="q-mt-sm">
                <q-input
                  type="email"
                  dense
                  required
                  bottom-slots
                  no-error-icon
                  :value="email"
                  v-model="email"
                  :placeholder="email"
                  label="Email"
                  :rules="[contactsRequired,  v => $rules.email(v) || 'L\'email inserita non è valida']"
                ></q-input>

                <q-input
                  :value="telefono"
                  type="tel"
                  dense
                  required
                  v-model="telefono"
                  :placeholder="telefono"
                  label="Numero di telefono"
                  no-error-icon
                  unmasked-value
                  mask="### ### ## ##"
                  prefix="+39"
                  bottom-slots
                  :rules="[contactsRequired]"
                ></q-input>
              </div>
            </div>

            <!--          MOTIVAZIONE-->

            <q-select
              class="q-mb-sm"
              required
              dense
              bottom-slots
              no-error-icon
              emit-value
              map-options
              label="Seleziona una motivazione per lo spostamento"
              v-model="modelMotivation"
              :options="optionsMotivation"
              :rules="[ruleRequired]"
            />

            <!--          NOTE-->
            <q-input
              v-model="notes"
              type="textarea"
              dense
              :max-height="200"
              rows="4"
              label="Inserisci eventuali note per l'operatore"
            ></q-input>

          </q-form>
        </q-card>
      </div>

      <!--  CASO AGENDA-->
      <div v-else>
        <q-card>
          <q-card-section>
            <vac-vaccination-center-list-item
              :vaccination-center="selectedVaccinationCenterStartCase"
              :vaccinations="vaccinationsName"
            />
          </q-card-section>
        </q-card>
        <!--    SE è CON AGENDA USO IL CALENDARIO-->
        <q-card class="q-my-md" v-if="selectedVaccinationCenter && citizen">
        <vac-vaccination-center-free-slot-calendar
          :vaccination-center-code="selectedVaccinationCenter.codice"
          :patient-code="citizen.codice_paziente"
          select-first-free-date
          @on-selected="onAgendaDateSelected"
       />
        </q-card>

        <!--        NOTE-->
        <q-card class="q-pa-md q-mt-md">
          <q-input
            v-model="notes"
            type="textarea"
            :max-height="200"
            rows="2"
            label="Inserisci eventuali note per l'operatore"
          ></q-input>
        </q-card>

        <!--        CONFERMA CON AGENDA-->
        <lms-buttons class="q-mt-md">
          <lms-button v-if="selectedDate" @click="confirmAgenda"
            >Conferma
          </lms-button>
          <div v-else style="height: 44px"></div>
        </lms-buttons>
      </div>


      <!-- controllo cancellazione-->

      <!--      CONFERMA SENZA AGENDA-->
      <div v-if="!agenda" class="q-pt-md ">
        <lms-buttons>
          <lms-button @click="confirm">Conferma </lms-button>
        </lms-buttons>
      </div>
    </div>

    <lms-inner-loading :showing="isLoading" block />
  </lms-page>
</template>

<script>
import { capitalCase } from "change-case";
import {
  getAppointmentList,
  getMotivationsList,
  getVaccinationCenterDetail,
  getVaccinationCenterFreeSlotList,
  getVaccinationUserInfo,
  moveAppointment,
  moveAppointmentAgenda
} from "../services/api";
import { apiErrorNotify } from "../services/utils";
import { MOVE_SUCCESS } from "../router/routes";
import VacVaccinationCenterListItem from "components/VacVaccinationCenterListItem";
import VacVaccinationCenterFreeSlotCalendar from "components/VacVaccinationCenterFreeSlotCalendar";
import {vaccinationsList, vaccinationsNames} from "src/services/business-logic";

export default {
  name: "PageVaccinationMove",
  components: {VacVaccinationCenterFreeSlotCalendar, VacVaccinationCenterListItem},
  props: {
    id: { required: false },
    exemption: { type: Object, required: false, default: () => undefined }
  },
  data() {
    return {
      //vaccinazione di prova da visualizzare quando la pagina viene ricaricata
      motivationList: null,
      isLoading: false,
      modelMotivation: null,
      appointment: null,
      citizen: null,
      email: null,
      telefono: null,
      notes: null,
      selectedVaccinationCenter: null,
      selectedDate: null,
      splitterModel: 50,
      temporalSlots: [],
      temporalSlotsDates: [],
      minDate: null,
      possibleTimes: [],
      colorTimes: [],
      initialCalendarDate: null,
      windowWidth: window.innerWidth,
      isLoadingTemporalSlots: false,

      //MESI USATI PER CALENDARIO

      searchingYear: null,
      yearUp: false,
      yearDown: false,
      payloadAgenda: null,
      isSaving:false,
      agendaSlotSelected:null
    };
  },

  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    };
  },

  computed: {
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    },
    contactsRequired() {
      let message = "Indica almeno uno dei contatti";
      let toFill = [this.email, this.telefono];
      let someFilled = toFill.some(i => !!i);
      return v => someFilled || message;
    },
    appointmentAssociationList() {
      return this.appointment?.associazioni ?? [];
    },
    selectedVaccinationCenterStartCase() {
      if (this.selectedVaccinationCenter) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.selectedVaccinationCenter.descrizione = capitalCase(
          this.selectedVaccinationCenter.descrizione
        );
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.selectedVaccinationCenter.comune = capitalCase(
          this.selectedVaccinationCenter.comune
        );
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.selectedVaccinationCenter.indirizzo = capitalCase(
          this.selectedVaccinationCenter.indirizzo
        )
          .replace(/([1-9]+)/g, ", $1")
          .trim();

        return this.selectedVaccinationCenter;
      }
      return null;
    },
    appointmentVaccinationList() {
      return vaccinationsList(this.appointmentAssociationList)
    },
    vaccinationsName() {
      return vaccinationsNames(this.appointmentVaccinationList)
    },
    agenda() {
      return this.appointment?.agenda;
    },
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    //la motivazione scelta
    selected() {
      return this.motivationList.find(
        v => v.codice === this.modelMotivation
      );
    },

    optionsMotivation() {
      if (this.motivationList)
        return this.motivationList.map(t => ({
          label: t.descrizione,
          value: t.codice
        }));
      return [];
    }
  },
  methods: {
    selectTime(time, index) {
      this.colorTimes = [];
      this.colorTimes[index] = "primary";
      this.payloadAgenda = {
        codice_paziente: this.citizen.codice_paziente,
        data_convocazione: this.appointment.data_convocazione,
        data_appuntamento: time.data_appuntamento,
        note: this.notes
      };
    },
    findTime(date) {
      this.payloadAgenda = null;
      this.colorTimes = [];
      this.possibleTimes = this.temporalSlots.filter(
        a => a.data_appuntamento.slice(0, 10).replace(/-/g, "/") === date
      );
    },

    onAgendaDateSelected(date) {
      this.selectedDate = date;
    },

    clearPayload() {
      this.payloadAgenda = null;
    },

    onBack() {
      this.$router.go(-1);
    },

    async confirmAgenda() {
      this.payloadAgenda = {
        codice_paziente: this.citizen.codice_paziente,
        data_convocazione: this.appointment.data_convocazione,
        data_appuntamento: this.selectedDate,
        note: this.notes
      };

      try {
        let moveAgendaVacinationPromise = await moveAppointmentAgenda(
          this.cf,
          this.appointment.id,
          this.payloadAgenda
        );

        let params = {
          appuntamento: this.appointment,
          nuovaData: this.payloadAgenda,
          agenda: this.agenda,
          centroVaccinale: this.selectedVaccinationCenter
        };

        let name = MOVE_SUCCESS.name;

        this.$router.push({ name, params });
      } catch (e) {
        let message = "Lo spostamento non è andato a buon fine";
        apiErrorNotify({ e, message });
      }
    },

    async confirm() {
      let isValid = await this.$refs.form.validate();
      if (!isValid) return;

      let payload = {
        telefono: this.telefono,
        mail: this.email,
        nome: this.citizen.nome,
        cognome: this.citizen.cognome,
        note: this.notes,
        motivazione: this.selected.codice,
        centro_vaccinale: this.appointment.centro_vaccinale,
        vaccini: this.appointmentVaccinationList.map(obj => ({
          codice: obj.codice,
          descrizione: obj.descrizione
        }))
      };
      try {
        let response = await moveAppointment(
          this.cf,
          this.appointment.id,
          payload
        );

        let params = { appuntamento: this.appointment };

        let name = MOVE_SUCCESS.name;

        this.$router.push({ name, params });
      } catch (e) {
        let message = "Lo spostamento non è andato a buon fine";
        apiErrorNotify({ e, message });
      }
    }
  },

  async created() {
    this.isLoading = true;

    let today = new Date();

    let minMonth = "";
    if (today.getMonth() < 10) {
      minMonth = "0" + parseInt(today.getMonth() + 1);
    } else {
      minMonth = parseInt(today.getMonth() + 1);
    }

    this.minDate = today.getFullYear() + "/" + minMonth;

    let appointment = this.$route?.params?.appointment;

    if (!appointment) {
      let id = this.$route?.params?.id;

      this.isLoading = true;

      let response = await getAppointmentList(this.cf);
      let appointmentList = response.data;
      appointment = appointmentList.filter(
        c => c.id.toString() === id.toString()
      )[0];

      this.isLoading = false;
    }
    this.appointment = appointment;

    try {
      let selectedVaccinationCenterId = this.appointment.centro_vaccinale;
      let selectedVaccinationCenterPromise = await getVaccinationCenterDetail(
        selectedVaccinationCenterId
      );
      this.selectedVaccinationCenter = selectedVaccinationCenterPromise.data;
    } catch (e) {
      let message =
        " Non è stato possibile trovare il centro vaccinale per l'appuntamento";
      apiErrorNotify({ e, message });
    }

    let cittadinoPromise = await getVaccinationUserInfo(this.cf);
    this.citizen = cittadinoPromise.data;
    if (this.citizen.contatti_vaccinazioni) {
      if (this.citizen.contatti_vaccinazioni.email)
        this.email = this.citizen.contatti_vaccinazioni.email;

      if (this.citizen.contatti_vaccinazioni.telefono)
        this.telefono = this.citizen.contatti_vaccinazioni.telefono;
    }

    try {
      let motivazioniPromise = await getMotivationsList();
      this.motivationList = motivazioniPromise.data;
      if (this.motivationList.length === 0) {
        let message =
          "Non è stato possibile recuperare i dati delle motivazioni";
        apiErrorNotify({
          message
        });
      }
    } catch (e) {
      let message = "Non è stato possibile recuperare i dati delle motivazioni";
      apiErrorNotify({ e, message });
    }

    // if (this.agenda) {
    //   this.slotTemporale();
    // }

    this.isLoading = false;
  },
  onSaveNoAgenda(){

  }
};
</script>

<style lang="sass">
.time-card
  cursor: pointer
  transition: all .3s ease

  &:hover
    background-color: $grey-2
</style>
