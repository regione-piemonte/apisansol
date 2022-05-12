<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>

  <q-splitter
    v-model="splitterModel"
    class="bg-white"
    :limits="[50, 50]"
    :horizontal="$q.screen.lt.sm"

  >
    <template v-slot:before>
      <div class="q-pa-md flex justify-center">
        <q-date
          v-show="!isLoadingTemporalSlots"
          @navigation="onNavigation"
          flat
          class="getDateCalendar"
          :value="selectedDate"
          :options="temporalSlotsDates"
          minimal
          @input="onInputDate"
          :navigation-min-year-month="minDateLabel"
          :navigation-max-year-month="maxDateLabel"
          emit-immediately
        />
        <template v-if="isLoadingTemporalSlots">
          <div class="q-pa-md" style="width: 290px;">
            <div class="row items-center q-py-xs">
              <div class="row items-center justify-between col-8">
                <span class="q-px-xs"><q-icon name="chevron_left" size="xs"></q-icon></span>
                <div class="relative-position overflow-hidden flex flex-center col">
                  <q-skeleton type="text" width="64px" class="bg-grey-5"></q-skeleton>
                </div>
                <span class="q-px-xs"><q-icon name="chevron_right" size="xs"></q-icon></span>
              </div>
              <div class="row items-center justify-between col">
                <span class="q-px-xs"><q-icon name="chevron_left" size="xs"></q-icon></span>
                <div class="relative-position overflow-hidden flex flex-center col">
                  <q-skeleton type="text" width="32px" class="bg-grey-5"></q-skeleton>
                </div>
                <span class="q-px-xs"><q-icon name="chevron_right" size="xs"></q-icon></span>
              </div>
            </div>
            <div class="q-mt-sm">
              <div class="row items-center" style="height: 30px">
                <div
                  v-for="(day, i) in 7" :key="i"
                  class="relative-position overflow-hidden flex flex-center col">
                  <q-skeleton type="text" width="30px"></q-skeleton>
                </div>
              </div>
            </div>
            <div class="q-mt-sm">
              <q-skeleton square height="193px"/>
            </div>

          </div>
        </template>
      </div>

    </template>
    <template v-slot:after>
      <div class="q-pa-md ">
        <div class=" q-px-sm q-mb-lg row justify-center">
          <span>Orari disponibili per il <strong>{{ selectedDate |date }}</strong></span>
        </div>
        <q-banner v-if="!possibleTimes || possibleTimes.length === 0 && !isLoadingTemporalSlots"
                  class="full-width q-banner--info q-px-sm">
          <div class="text-body1">
            Seleziona una data dal calendario per vedere i possibili orari
            per la vaccinazione
          </div>
        </q-banner>
        <div class="row justify-center ">
          <q-scroll-area
            style="height: 230px; width: 290px"
            v-if="possibleTimes"
          >
            <q-list class="row items-center justify-center">
              <q-item
                v-for="(time, index) in possibleTimes"
                :key="index"
                class="q-py-xs"

              >
                <lms-button
                  :ripple="false"
                  unelevated
                  :outline="selectedTimeBtn !== index"
                  color="primary"
                  @click="onSelectTime(time, index)"
                >
                  <div>
                    <div>
                      Ore:
                      <strong
                      >{{ time.data_appuntamento | time }}
                      </strong>
                    </div>

                    <div
                      style="line-height: 1em"
                      class="q-pb-sm  text-caption text-lowercase text-capitalize "
                      :class="{ 'text-black': selectedTimeBtn !== index }"
                    >
                      {{ time.descrizione | capitalCase }}
                    </div>
                  </div>
                </lms-button
                >
              </q-item>
            </q-list>
          </q-scroll-area>

        </div>
      </div>
    </template>
  </q-splitter>


</template>

<script>
import {getVaccinationCenterFreeSlotList} from "src/services/api";
import {apiErrorNotify} from "src/services/utils";
import {date} from "quasar";

const {
  buildDate,
  startOfDate,
  endOfDate,
  formatDate,
  clone,
  getDateDiff,
  addToDate,
  subtractFromDate,
  getDayOfWeek
} = date;
export default {
  name: "VacVaccinationCenterFreeSlotCalendar",
  props: {
    vaccinationCenterCode: {type: String, required: true},
    patientCode: {type: String, required: true},
    minDate: {type: Date, required: false, default: () => new Date()},
    maxDate: {type: Date, required: false, default: null},
    // Permette, dopo aver selezionato un mese, di selezionare subito la prima data libera
    selectFirstFreeDate: {type: Boolean, required: false, default: false},
    // Permette, dopo aver selezionato una data, di selezionare subito il primo slot temporale
    selectFirstFreeSlot: {type: Boolean, required: false, default: false},

  },
  data() {
    return {
      splitterModel: 50,
      selectedDate: null,
      temporalSlots: [],
      possibleTimes: [],
      calendarDate: null,
      windowWidth: window.innerWidth,
      isLoadingTemporalSlots: false,
      appointmentDate: null,
      selectedDateIndex:null,
      selectedTimeBtn:null,

    }
  },
  watch: {
    selectedDate: {
      handler() {
        this.getSelectedDateOptions();
      }
    },
    appointmentDate:{
      immediate:true,
      handler(val, oldval){
        console.log('appointment', val)
        this.$emit('on-selected', val)
      }
    }
  },

  computed: {
    startOfMonth() {
      return startOfDate(this.calendarDate, 'month');
    },
    endOfMonth() {
      return endOfDate(this.calendarDate, 'month');
    },
    minDateLabel() {
      let minDate = formatDate(this.calendarDate, 'YYYY/MM/DD')
      return minDate.slice(0, minDate.lastIndexOf('/'));
    },
    maxDateLabel() {
      let formatMaxDate = null
      if (this.maxDate) {
        if(getDateDiff(this.maxDate, this.calendarDate, 'months') > 0){
          formatMaxDate = formatDate(this.maxDate, 'YYYY/MM/DD')
        }else{
          formatMaxDate = formatDate(this.minDate, 'YYYY/MM/DD')
        }
      }
      return  formatMaxDate?.slice(0, formatMaxDate?.lastIndexOf('/'))
    },
    temporalSlotsDates() {
      let temporalSlotsDates = []
      if (this.temporalSlots?.length > 0) {
        let list = this.temporalSlots
        // Prendiamo solo quelle date che sono superiori a "tra 1 ora"

        temporalSlotsDates = list.filter(d =>
          getDateDiff(new Date(d.data_appuntamento), new Date(), 'days') > -1 &&
          getDateDiff(new Date(d.data_appuntamento), new Date(), 'hours') > 1
        );
        // let pos = temporalSlotsDates.forEach(d =>{
        //     console.log(new Date(d.data_appuntamento))
        //     console.log(getDateDiff (new Date(d.data_appuntamento), new Date(), 'hours'))
        // }
        //
        // )
        // console.log(pos)
        temporalSlotsDates.sort(
          (a, b) =>
            new Date(a.data_appuntamento.toString()) -
            new Date(b.data_appuntamento.toString())
        );
        temporalSlotsDates = temporalSlotsDates.map(a =>
          new Date(a.data_appuntamento)
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "/")
        );

      }
      return temporalSlotsDates
    }
  },
  async created() {
    this.calendarDate = this.minDate ?? new Date();
    await this.getTemporalSlots(this.startOfMonth, this.endOfMonth);
    if (this.selectFirstFreeDate)
      this.selectedDate = this.temporalSlotsDates[0]
      await  this.getSelectedDateOptions();
    if (this.selectFirstFreeSlot){
      this.selectedTimeBtn = 0
      this.appointmentDate = this.possibleTimes[0]?.data_appuntamento
    }


  },
  methods: {
    async getTemporalSlots(start, end) {
      this.isLoadingTemporalSlots = true;

      let filter = {};
      filter.codice_paziente = {eq: this.patientCode};
      filter.data_inizio = {eq: start};
      filter.data_fine = {eq: end};

      let params = {filter};
      let id = this.vaccinationCenterCode;

      try {
        let {data} = await getVaccinationCenterFreeSlotList(id, {params});
        this.temporalSlots = data;

        // this.selectedDate = this.temporalSlotsDates[0];
        // if (this.selectedDate) {
        //   this.findTime(this.selectedDate);
        // }
      } catch (error) {
        let message = "Non è stato possibile ottenere i periodi liberi";
        apiErrorNotify({error, message});
      }
      this.isLoadingTemporalSlots = false;
    },
    async onNavigation({month, year}) {
      this.appointmentDate = null;
      let start = new Date();
      let end = new Date();
      let today = new Date();

      start.setDate(1);
      end.setDate(1);

      if (today.getMonth() === month - 1 && today.getFullYear() === year) {
        start.setDate(today.getDate() + 1);
      }
      start.setMonth(month - 1);

      if (month === 12) {
        end.setMonth(0);
      } else {
        end.setMonth(month);
      }

      start.setFullYear(year);
      if (month === 12) {
        end.setFullYear(year + 1);
      } else {
        end.setFullYear(year);
      }

      start = start.toISOString();
      end = end.toISOString();
      await this.getTemporalSlots(start, end)
    },
    onInputDate(value, reason, details) {
      if (reason === "add-day") {
        this.selectedDate = value;
      }
    },
    getSelectedDateOptions() {
      this.appointmentDate = null;
      this.selectedTimeBtn = null
      this.possibleTimes = []

      if (this.selectedDate && this.temporalSlotsDates) {
        this.selectedDateIndex = this.temporalSlotsDates.indexOf(
          this.selectedDate
        );
        let dailyPossibleTimes = this.temporalSlots.filter(
          a => a.data_appuntamento.slice(0, 10).replace(/-/g, "/") === this.selectedDate
        );

        // Nascondiamo gli orari passati
        this.possibleTimes = dailyPossibleTimes.filter(a => getDateDiff(new Date(a.data_appuntamento), new Date(), 'minutes') > 0)

      }
    },
    onSelectTime(time, index) {
      this.selectedTimeBtn = index;
      this.appointmentDate = time.data_appuntamento

    }
  }
}
</script>

<style lang="sass">
.getDateCalendar
  .q-date__calendar-item--out
    opacity: 0.7
    border: none

  .q-date__calendar-item--in .bg-primary
    border: $primary 1px solid

  .q-date__calendar-item--in button
    background: rgba($primary, 0.1)
    border: rgba($primary, 0.5) 1px solid

    .q-btn__wrapper
      padding: 0

</style>
