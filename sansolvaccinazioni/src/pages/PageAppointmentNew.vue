<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title class="q-mb-md">
      Prenotazione appuntamento per vaccinazione volontaria
    </lms-page-title>

    <template v-if="!isLoading">
      <lms-stepper
        ref="stepper"
        v-model="step"
        alternative-labels
        header-nav
        animated
        flat
        :contracted="$q.screen.lt.md"
        class="bg-transparent"
      >
        <!-- SCELTA VACCINO -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-step
          :name="STEPS.VACCINE"
          title="Scelta vaccino"
          :prefix="STEPS.VACCINE"
          :done="step > STEPS.VACCINE"
          :header-nav="step > STEPS.VACCINE"
        >
          <!--elenco vaccini-->
          <template v-if="vaccinationsOptions.length <= 0">
            <q-banner rounded class="q-banner--info">
              <div class="text-body1">
                Non hai vaccinazioni selezionabili
              </div>
            </q-banner>
          </template>

          <template v-else>
            <q-card>
              <q-card-section>
                <q-select
                  v-model="selectedVaccination"
                  :options="vaccinationsOptions"
                  label="Seleziona un vaccino"
                  option-value="codice"
                  no-error-icon
                  :option-label="getVaccineOptionLabel"
                  required
                />

                <div v-show="selectedVaccination">
                  <template v-if="!isVaccinationSelectedPayable">
                    <div class="q-mt-lg q-body-1 text-bold">
                      Per questo vaccino non è previsto alcun pagamento
                    </div>
                  </template>

                  <template v-else>
                    <div class="q-mt-lg q-body-1">
                      Costo del vaccino:
                      <strong>{{ vaccinationSelectedAmount }} Euro </strong>
                    </div>
                  </template>
                </div>

              </q-card-section>
            </q-card>

            <!-- Mostriamo il bannerino di avvertenza solo quando -->
            <!-- la vaccinazione selezionata dal cittadino è a pagamento -->
            <template v-if="isVaccinationSelectedPayable">
              <q-banner class="q-mt-lg q-banner--warning">
                <div class="text-body1">
                  <p>
                    <strong> Non effettuare il pagamento prima della vaccinazione.</strong>
                  </p>

                  <p>
                    Il costo del vaccino potrà essere diverso da quanto sopra indicato sulla base del farmaco
                    effettivamente
                    utilizzato e di eventuali costi aggiuntivi che saranno comunicati all’atto della vaccinazione da
                    parte
                    del
                    personale del Centro Vaccinale.
                  </p>

                  <p class="q-mb-none">
                    Se appartieni ad una categoria che ha diritto alla erogazione gratuita del vaccino prenotato, il
                    personale
                    del
                    Centro Vaccinale applicherà l’esenzione all’atto della vaccinazione.
                  </p>
                </div>

              </q-banner>
            </template>
          </template>
          <lms-buttons class="q-mt-md">
            <lms-button @click="onStepVaccineNext" :disabled="!selectedVaccination">
              Continua
            </lms-button>
          </lms-buttons>

        </q-step>

        <!-- CENTRO VACCINALE -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-step
          :name="STEPS.CENTRO_VACCINALE"
          title="Centro vaccinale"
          :prefix="STEPS.CENTRO_VACCINALE"
          :done="step > STEPS.CENTRO_VACCINALE"
          :header-nav="step > STEPS.CENTRO_VACCINALE"
        >
          <template v-if="isLoadingVaccinationCenterList">
            <q-inner-loading block :showing="isLoadingVaccinationCenterList"/>
          </template>
          <template v-else>
            <!-- CENTRO VACCINALE NON SELEZIONATO -->
            <!-- -------------------------------- -->
            <!-- Se il centro vaccinale non è selezionato di default vuol dire che -->
            <!-- il cittadino non ha un centro vaccinale associato -->
            <!-- oppure il suo centro vaccinale non supporta la vaccinazione scelta -->
            <template v-if="!selectedVaccinationsCenter">
              <!-- NO CENTRI VACCINALI ASL DI COMPETENZA DEL CITTADINO -->
              <!-- ------------------------------------------------------ -->
              <template v-if="vaccinationCenterList.length <= 0">
                <q-banner rounded class="q-mt-md q-banner--info">
                  <div class="text-body1">
                    Nella tua ASL non ci sono centri vaccinali che erogano la vaccinazione selezionata
                    <template v-if="selectedVaccination">
                      <span class="text-bold">({{ selectedVaccinationLabel | capitalCase }})</span>
                    </template>
                    .
                  </div>
                </q-banner>
              </template>

              <!-- LISTA CENTRI VACCINALI ASL DI COMPETENZA DEL CITTADINO -->
              <!-- ------------------------------------------------------ -->
              <template v-else>
                <div class="q-my-md text-bold text-h6">
                  Centri vaccinali dalla tua ASL che erogano la vaccinazione selezionata
                </div>

                <q-scroll-area style="height:800px">
                  <div class="q-pr-md">
                    <vac-vaccination-center-card
                      v-for="vaccinationCenter in vaccinationCenterList"
                      :key="vaccinationCenter.codice"
                      :vaccination-center="vaccinationCenter"
                      class="q-my-md"
                      @on-selected="onSelectedVaccinationCenter"/>
                  </div>

                </q-scroll-area>

              </template>

              <lms-buttons class="q-mt-md">
                <lms-button outline @click="openModal">
                  Scegli un'altra ASL
                </lms-button>
                <lms-button outline @click="$refs.stepper.previous()">Indietro</lms-button>
              </lms-buttons>
            </template>
            <!-- CENTRO VACCINALE SELEZIONATO -->
            <!-- ---------------------------- -->
            <template v-else>
              <q-card>
                <q-card-section>
                  <vac-vaccination-center-list-item :vaccination-center="selectedVaccinationsCenter"/>
                  <lms-buttons class="q-mt-sm">
                    <lms-button outline @click="openModal">
                      Cambia centro vaccinale
                    </lms-button>
                  </lms-buttons>

                </q-card-section>
              </q-card>
              <lms-buttons class="q-mt-md">
                <lms-button :disabled="!selectedVaccinationsCenter" @click="onStepVaccinationCenterNext">
                  Continua
                </lms-button>
                <lms-button outline @click="$refs.stepper.previous()">Indietro</lms-button>
              </lms-buttons>
            </template>


          </template>

          <!-- DIALOGS -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <vac-vaccination-center-selection-dialog
            v-model="isModalOpened"
            :asr-selected.sync="asrSelectedCode"
            :vaccination-code="selectedVaccinationCode"
            @selected="onSelectedVaccinationCenter"
          />
        </q-step>

        <!-- STEP CONTATTI / AGENDA -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-step
          :name="STEPS.CONTACTS"
          title="Dati per l'appuntamento"
          :prefix="STEPS.CONTACTS"
          :done="step > STEPS.CONTACTS"
          :header-nav="step > STEPS.CONTACTS"
        >
          <template v-if="isLoadingAgendaSlotList">
            <lms-inner-loading :showing="isLoadingAgendaSlotList" block/>
          </template>
          <template v-else>
            <!-- CENTRO VACCINALE CON AGENDA -->
            <!-- --------------------------- -->
            <template v-if="useAgendaMode">
              <div class="text-bold text-h6 q-pb-md">Seleziona una delle date disponibili per l'appuntamento</div>
              <q-card>
                <q-card-section>
                  <template v-if="citizen && selectedVaccinationsCenterCode">
                    <vac-vaccination-center-free-slot-calendar
                      :vaccination-center-code="selectedVaccinationsCenterCode"
                      :patient-code="patientCode"
                      :min-date="agendaFirstFreeSlotDate"
                      :max-date="agendaCalendarMaxDate"
                      select-first-free-date
                      select-first-free-slot
                      @on-selected="onAgendaSlotSelected"
                    />
                  </template>
                </q-card-section>
              </q-card>

            </template>
            <!-- CENTRO VACCINALE SENZA AGENDA -->
            <!-- ----------------------------- -->
            <template v-else>
              <div class="q-px-sm q-mt-md">
                <q-card>
                  <q-card-section>
                    <div class="text-bold text-h6 q-mb-md">
                      Indica dove vuoi essere ricontattato per fissare l'appuntamento
                    </div>
                    <q-form ref="form" greedy @submit.prevent="">
                      <q-input
                        type="email"
                        bottom-slots
                        no-error-icon
                        :value="email"
                        v-model="email"
                        :placeholder="email"
                        label="Email"
                        :rules="[contactsRequired,  v => $rules.email(v) || 'L\'email inserita non è valida']"
                      ></q-input>
                      <q-input
                        type="tel"
                        bottom-slots
                        no-error-icon
                        unmasked-value
                        mask="### ### ## ##"
                        prefix="+39"
                        v-model="phoneNumber"
                        :placeholder="phoneNumber"
                        label="Numero di telefono"
                        :rules="[contactsRequired]"
                      ></q-input>
                    </q-form>
                  </q-card-section>
                </q-card>

              </div>
            </template>
            <lms-buttons class="q-mt-lg">
              <lms-button :disable="!agendaSlotSelected && useAgendaMode" @click="onStepAgendaNext">Conferma
              </lms-button>
              <lms-button outline @click="$refs.stepper.previous()">Indietro</lms-button>
            </lms-buttons>
          </template>

        </q-step>

        <!-- RIEPILOGO -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-step
          :name="STEPS.RIEPILOGO"
          title="Riepilogo"
          :prefix="STEPS.RIEPILOGO"
          :done="step > STEPS.RIEPILOGO"
          :header-nav="step > STEPS.RIEPILOGO"
        >
          <template v-if="selectedVaccination && selectedVaccinationsCenter">
            <q-banner class="q-banner--info">
              <div class="text-body1 q-pa-sm">
                <template v-if="selectedVaccinationsCenter">
                  <!-- AGENDA -->
                  <!-- ------ -->
                  <div  class="q-gutter-sm" v-if="useAgendaMode">
                    <div class="q-mb-md text-h6 text-bold">
                      Confermi i dati per l'appuntamento?
                    </div>
                    <div>
                      Vaccinazione: <strong>{{ selectedVaccinationLabel| capitalCase }}</strong>
                    </div>
                    <div>
                      Luogo:
                      <strong>
                        {{ selectedVaccinationsCenterAddress }}
                      </strong>
                    </div>
                    <template v-if="agendaSlotSelected">
                      <div>
                        Data: <strong>{{ agendaSlotSelectedDate | date }} </strong>
                      </div>
                      <div>
                        Ora: <strong>{{ agendaSlotSelectedDate |time }}</strong>
                      </div>
                    </template>
                  </div>
                  <!-- NO AGENDA -->
                  <!-- --------- -->
                  <div class="q-gutter-sm" v-else>
                    <div class="q-mb-md text-h6 text-bold">
                      Confermi i dati inseriti?
                    </div>
                    <div>
                      Vaccinazione: <strong>{{ selectedVaccinationLabel| capitalCase }}</strong>
                    </div>
                    <div>
                      Luogo:
                      <strong>
                        {{ selectedVaccinationsCenterAddress }}
                      </strong>
                    </div>
                    <div>Mail: <strong>{{ email | empty }}</strong></div>
                    <div>Telefono: <strong>{{ phoneNumber  | empty }}</strong></div>
                  </div>
                </template>
                <div class="q-pt-md">
                  <template v-if="vaccinationSelectedAmount <= 0">
                    <strong>Per questo vaccino non è previsto alcun pagamento</strong>
                  </template>
                  <template v-else>
                    Vaccino a pagamento:
                    <strong>{{vaccinationSelectedAmount}} Euro </strong>
                  </template>
                </div>
              </div>
            </q-banner>
          </template>

          <!-- NOTE UTENTE (NO AGENDA) -->
          <template v-if="!useAgendaMode">
            <q-card class=" q-mt-md">
              <q-card-section>
                <q-input v-model="notes" label="Note per l'operatore" type="textarea"/>
              </q-card-section>
            </q-card>
          </template>

          <template v-if="selectedVaccinationCode">
            <lms-buttons class="q-mt-lg">
              <lms-button :loading="isSaving" label="Conferma" @click="onStepSummaryNext"/>
              <lms-button
                outline
                label="Indietro"
                @click="$refs.stepper.previous()"
              />
            </lms-buttons>
          </template>
        </q-step>
      </lms-stepper>
    </template>

    <!-- CARICAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-inner-loading :showing="isLoading" block/>
  </lms-page>
</template>

<script>
import {capitalCase} from "change-case";
import {apiErrorNotify} from "../services/utils";
import {
  createAppointment,
  createAppointmentRequest,
  getAsrListTemp,
  getVaccinationCenterDetail,
  getVaccinationCenterFreeSlotList,
  getVaccinationCenterList,
  getVaccinationListVoluntary,
  getVaccinationUserInfo
} from "../services/api";
import LmsStepper from "../components/core/LmsStepper";

import VacVaccinationCenterSelectionDialog from "../components/VacVaccinationCenterSelectionDialog";
import {APPOINTMENT_NEW_SUCCESS} from "../router/routes";
import VacVaccinationCenterCard from "components/VacVaccinationCenterCard";
import VacVaccinationCenterListItem from "components/VacVaccinationCenterListItem";
import VacVaccinationCenterFreeSlotCalendar from "components/VacVaccinationCenterFreeSlotCalendar";
import {date} from "quasar";
import {VACCINATION_CENTER_FILTER} from "src/services/config";

const {addToDate, getDateDiff, startOfDate, endOfDate} = date;
const STEP_MAP = {
  VACCINE: 1,
  CENTRO_VACCINALE: 2,
  CONTACTS: 3,
  RIEPILOGO: 4
};

export default {
  name: "PageAppointmentNew",
  components: {
    VacVaccinationCenterFreeSlotCalendar,
    VacVaccinationCenterListItem,
    VacVaccinationCenterCard,
    VacVaccinationCenterSelectionDialog,
    LmsStepper
  },
  data() {
    return {
      isLoading: false,
      asrList: null,
      selectedVaccinationsCenter: null,
      isModalOpened: false,
      agenda: false,
      vaccinationCenterList: [],
      aslCode: "01",
      email: null,
      phoneNumber: null,
      vaccinationsAddress: null,
      citizen: null,
      vaccinations: null,
      notes: null,
      payloadAgenda: null,
      isSearchingCenters: false,
      selectedDate: null,
      splitterModel: 50,
      isLoadingAgendaSlotList: false,
      vaccinationsOptions: [],
      temporalSlots: [],
      selectedVaccination: null,
      asrSelectedCode: null,
      temporalSlotsDates: [],
      minDate: null,
      possibleTimes: [],
      colorTimes: [],
      initialCalendarDate: null,
      windowWidth: window.innerWidth,
      STEPS: STEP_MAP,
      step: STEP_MAP.VACCINE,
      isLoadingVaccinationCenterList: false,
      agendaSlotList: [],
      agendaSlotSelected: null,
      agendaSlotSelectedDate:null,
      isSaving:false
    };
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    };
  },
  computed: {
    splitterHeight() {
      if (this.windowWidth < 500) {
        return ""
      } else {
        return {
          height: `450px`
        };
      }
    },
    isHorizontal() {
      if (this.windowWidth < 500) {
        return true;
      }
      return false;
    },
    patientCode() {
      return this.citizen?.codice_paziente
    },
    contactsRequired() {
      let message = "Indica almeno uno dei contatti";
      let toFill = [this.email, this.phoneNumber];
      let someFilled = toFill.some(i => !!i);
      return v => someFilled || message;
    },

    notLetter() {
      return v => !v || /^\d+$/.test(v) || "Carattere non valido";
    },
    notValidMail() {
      return v => !v || v.indexOf("@") >= 0 || "mail non valida";
    },
    user() {
      return this.$store.getters["getUser"];
    },

    cf() {
      return this.$store.getters["getTaxCode"];
    },
    vaccinationSelectedAmount() {
      return this.selectedVaccination?.importo_indicativo || 0
    },
    isVaccinationSelectedPayable() {
      return this.vaccinationSelectedAmount > 0
    },
    citizenAslCode() {
      if (!this.citizen || !this.citizen.asl) return null;
      let result = this.citizen.asl.codice?.toString();
      result = result.replace("010", "");
      result = parseInt(result);
      return result;
    },
    citizenVaccinationCenterCode() {
      return this.citizen?.centro_vaccinale
    },
    isAgendaSupported() {
      // return false; // per testare il flusso di istanza appuntamento
      return this.selectedVaccinationsCenter?.ambulatori?.length > 0
    },
    isRequestModeForced() {
      return this.agendaSlotList.length <= 0
    },
    useAgendaMode() {
      return this.isAgendaSupported && !this.isRequestModeForced
    },
    agendaFirstFreeSlot() {
      return this.agendaSlotList[0]
    },
    agendaFirstFreeSlotDate() {
      let date = this.agendaFirstFreeSlot?.data_appuntamento;
      return date ? new Date(date) : null;
    },
    agendaCalendarMaxDate() {
      let result = startOfDate(new Date(), 'month');
      result = addToDate(result, {month: 3});
      result = endOfDate(result, 'month');
      return result;
    },
    selectedVaccinationLabel() {
      return this.selectedVaccination?.descrizione ?? ""
    },
    selectedVaccinationCode() {
      return this.selectedVaccination?.codice ?? ""
    },
    selectedVaccinationsCenterCode() {
      return this.selectedVaccinationsCenter?.codice ?? ""
    },
    selectedVaccinationsCenterAddress() {
      let place = ""
      if (this.selectedVaccinationsCenter) {
        let description = capitalCase(this.selectedVaccinationsCenter.descrizione)
        let city = capitalCase(this.selectedVaccinationsCenter.comune)
        let address = capitalCase(this.selectedVaccinationsCenter.indirizzo)
        place = `${description}, ${city} ${address}`
      }
      return place
    },
  },
  async created() {
    let {cittadino} = this.$route.params;
    this.isLoading = true;
    let vaccinationListPromise = getVaccinationListVoluntary(this.cf);
    let AsrTempListPromise = getAsrListTemp();
    let citizenPromise = null;
    if (!cittadino) citizenPromise = getVaccinationUserInfo(this.cf);

    try {
      let {data} = await vaccinationListPromise;
      this.vaccinationsOptions = data;
    } catch (error) {
      let message = "Non è stato possibile recuperare la lista di vaccinazioni";
      apiErrorNotify({error, message});
    }

    try {
      let {data} = await AsrTempListPromise;
      this.asrList = data.filter(a => a.tipologia === "ASL");
    } catch (error) {
      console.error(error);
    }
    if (citizenPromise) {
      try {
        let {data} = await citizenPromise;
        cittadino = data;
      } catch (e) {
        console.error(e);
      }
    }
    this.citizen = cittadino;
    if (this.citizen) {
      this.email = this.citizen.contatti_vaccinazioni?.email ?? "";
      this.phoneNumber = this.citizen.contatti_vaccinazioni?.telefono ?? "";
    }

    this.isLoading = false;
  },
  methods: {
    async onStepVaccineNext() {
      // resettiamo lo stato dello step su cui stiamo per andare
      this.$refs.stepper.next();
      this.selectedVaccinationsCenter = null;
      await this.loadVaccinationCenterList();

      // Se tra i centri vaccinali che supportano la vaccinazione selezionata c'è anche il centro
      // vaccinale del cittadino => impostiamo il centro vaccinale del cittadino come quello di default

      let userVaccinationCenter = this.vaccinationCenterList.find(c => c.codice === this.citizenVaccinationCenterCode);
      if (userVaccinationCenter) this.selectedVaccinationsCenter = userVaccinationCenter

    },
    async onStepVaccinationCenterNext() {
      // resettiamo lo stato dello step su cui stiamo per andare
      this.agendaSlotSelected = null;

      this.$refs.stepper.next();

      // Se l'agenda è supportata dal centro vaccinale selezionato
      // => se nei primi 3 mesi non ci sono appuntamenti liberi
      //    forziamo la modalità "istanza"
      if (this.isAgendaSupported) {
        let start = new Date();
        let end = endOfDate(addToDate(start, {month: 3}), 'day');
        let filter = {};
        filter.codice_paziente = {eq: this.patientCode};
        filter.data_inizio = {eq: start};
        filter.data_fine = {eq: end};

        let params = {filter};
        this.isLoadingAgendaSlotList = true;

        try {
          let response = await getVaccinationCenterFreeSlotList(this.selectedVaccinationsCenterCode, {params});
          this.agendaSlotList = response.data;
          let now = new Date();

          // Prendiamo solo quelle date che sono superiori a "tra 1 ora"
          this.agendaSlotList = this.agendaSlotList.filter(s => {
            return getDateDiff(s.data_appuntamento, now, 'hours') >= 1;
          });

          // Ordiniamo per data l'elenco
          this.agendaSlotList.sort((a, b) => {
            return new Date(a.data_appuntamento) - new Date(b.data_appuntamento);
          });
        } catch (e) {
          let message = "Non è stato possibile ottenere i periodi liberi"
          apiErrorNotify({e, message});
        }

        this.isLoadingAgendaSlotList = false;
      }
    },
    async onStepAgendaNext() {
      if (!this.useAgendaMode) {
        let isValid = await this.$refs.form.validate();
        if (!isValid) return;
      }
      this.$refs.stepper.next();
    },
    async loadVaccinationCenterList() {
      this.isLoadingVaccinationCenterList = true;
      console.log('cerca')
      try {
        let filter = {};
        let aslCode = `010${this.citizenAslCode}`
        filter.asl = {eq: aslCode};
        filter.associazione = {eq:this.selectedVaccinationCode};
        filter.tipoCentro = { eq: VACCINATION_CENTER_FILTER };
        let params = {filter}
        let response = await getVaccinationCenterList({params});
        this.vaccinationCenterList = response.data;
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoadingVaccinationCenterList = false;
      }

    },
    getVaccineOptionLabel(vaccine) {
      return capitalCase(vaccine?.descrizione);
    },
    async confirmAgenda() {
      let payload = {
        codice_paziente: this.patientCode,
        codice_ambulatorio: this.agendaSlotSelected?.codice_ambulatorio,
        data_convocazione: '',
        data_appuntamento: this.agendaSlotSelectedDate,
        centro_vaccinale: this.selectedVaccinationsCenterCode,
        vaccini: [{
          codice: this.selectedVaccinationCode,
          descrizione: this.selectedVaccinationLabel
        }]
      };
      this.isSaving = true;
      try {
        await createAppointment(this.cf, payload);
        let params = {agenda: this.useAgendaMode};
        let name = APPOINTMENT_NEW_SUCCESS.name;
        this.$router.push({name, params});
      } catch (error) {
        let message = "Non è stato possibile prenotare l'appuntamento";
        apiErrorNotify({error, message});
      }finally {
        this.isSaving = false;
      }
    },
    async confirmNoAgenda() {
      let payload = {
        telefono: this.phoneNumber,
        mail: this.email,
        nome: this.citizen?.nome,
        cognome: this.citizen?.cognome,
        note: this.notes,
        centro_vaccinale: this.selectedVaccinationsCenterCode,
        vaccini: [
          {
            codice: this.selectedVaccinationCode,
            descrizione: this.selectedVaccinationLabel
          }
        ]
      };
      this.isSaving = true;
      try {
        await createAppointmentRequest(this.cf, payload);
        let params = {agenda: this.useAgendaMode};
        let name = APPOINTMENT_NEW_SUCCESS.name;
        this.$router.push({name, params});
      } catch (error) {
        let message = "Impossibile salvare l'appuntamento";
        apiErrorNotify({error, message});
      }finally {
        this.isSaving = false;
      }
    },
    openModal() {
      this.isModalOpened = true;
    },
    onSelectedVaccinationCenter(vaccinationCenter) {
      this.selectedVaccinationsCenter = vaccinationCenter;
      this.isModalOpened = false
      this.onStepVaccinationCenterNext();
    },
    onAgendaSlotSelected(slot) {
      this.agendaSlotSelectedDate = slot
      this.agendaSlotSelected = slot ?  this.agendaSlotList.find(a => a.data_appuntamento === slot) : null;
      console.log("slot",slot)
    },
    onStepSummaryNext() {
      this.useAgendaMode ? this.confirmAgenda() : this.confirmNoAgenda();
    },
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
