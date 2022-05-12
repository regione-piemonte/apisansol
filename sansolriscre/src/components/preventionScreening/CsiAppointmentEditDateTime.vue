<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      class="bg-white"
      :limits="[50, 50]"
      :horizontal="$q.screen.lt.sm"
      v-if="availableDateList.length>0"
    >
      <template v-slot:before>
        <div class="q-pa-md flex justify-center">
          <q-date
            @navigation="onNavigation"
            flat
            class="getDateCalendar"
            :value="selectedDate"
            :options="availableDateList"
            minimal
            @input="onInputDate"
            :navigation-min-year-month="minNavigationDates"
            emit-immediately

          />
        </div>
      </template>
      <template v-slot:after>
        <div class="q-pa-md flex justify-center">
          <div class="text-center q-pa-md" style="width: 290px;">
            <div class="row justify-between ">
              <q-btn
                flat
                round
                icon="chevron_left"
                size="sm"
                @click="previousDate"
                :disable="selectedDateIndex <= 0"
              />
              <div class="self-center">{{ selectedDateLabel }}</div>
              <q-btn
                flat
                round
                icon="chevron_right"
                size="sm"
                @click="nextDate"
                :disable="
                  availableDateList &&
                    selectedDateIndex >= availableDateList.length - 1
                "
              />
            </div>
            <div class="row q-px-sm q-my-lg">
              Orari disponibili
            </div>
            <div class="row">
              <q-scroll-area
                style="height: 150px; width: 290px"
                v-if="availableTimeList && !isHoursLoading"
              >
                <template v-if="hoursListErr">
                  <q-banner class="h-banner h-banner--warning">
                    Orari non disponibili per il giorno selezionato.
                  </q-banner>
                </template>
                <q-list v-else>
                  <q-item
                    v-for="(time, index) in availableTimeList"
                    :key="index"
                    class="q-py-xs"
                  >
                    <lms-button
                      :ripple="false"
                      unelevated
                      :outline="pressedTimeBtn !== index"
                      color="primary"
                      @click="onSelectTime(time, index)"
                      >{{ time.ora_slot.slice(0, 5) }}</lms-button
                    >
                  </q-item>
                </q-list>
              </q-scroll-area>
              <lms-inner-loading block :showing="isHoursLoading" />
            </div>
          </div>
        </div>
      </template>
    </q-splitter>
    <template v-else>
      <q-banner  class="h-banner h-banner--info q-mt-lg" v-if="!isLoadingDate">
        Questa struttura non ha attualmente date disponibili.
      </q-banner>
    </template>

    <lms-inner-loading block :showing="isLoadingDate" />
  </div>
</template>

<script>
import { sortByDate, sortByTime } from "src/services/business-logic";
import { date } from "quasar";
import { getAvailableDates, getAvailableHours } from "src/services/api";
import {STATUS_CODES} from "src/services/config";
import {isEmpty} from "src/services/utils";


export default {
  name: "CsiAppointmentEditDateTime",
  data() {
    return {
      splitterModel: 50,
      selectedDate: null,
      formatSelectedDate: null,
      selectedTime: null,
      datesList: null,
      hoursList: null,
      hoursListErr:false,
      isHoursLoading: false,
      selectedDateIndex: null,
      selectedDateLabel: "",
      pressedTimeBtn: null,
      STATUS_CODES,
        isLoadingDate: false,
    };
  },
  props: {
    agendaId: { type:Number, required: true, default: null },
    appointmentType: { type: String, required: true, default: "" },
    firstAvailableDate: { type: String, default: null }
  },
  watch: {
    selectedDate: {
      immediate: true,
      handler() {
        this.getSelectedDateOptions();
      }
    },
    availableDateList:{
      handler(){
        this.$emit('is-date-list', !isEmpty(this.availableDateList) )
      }
    }
  },
  created() {
    this.getDefaultCalendar();
  },
  computed: {
    today() {
      return new Date();
    },
    defaultDate() {
      let defaultDate = null;
      let getDate = this.firstAvailableDate ? new Date(this.firstAvailableDate) : this.today;
      if (date.getDateDiff(getDate, this.today, 'days') < 0 ) {
        getDate = this.today;
      }
      defaultDate = date.formatDate(getDate, "YYYY/MM/DD");
      return defaultDate;
    },
    minNavigationDates (){
      return  this.defaultDate.slice(0, this.defaultDate.lastIndexOf('/'));
    },
    availableDateList() {
      let availableDateList = [];
      if (this.datesList) {
        let list = this.datesList;
       // list.push({data: this.firstAvailableDate})
        availableDateList = list.filter(d => date.getDateDiff(new Date(d.data), this.today, 'days')  >-1);
        availableDateList = availableDateList.map(d => {
          //let formattedDate = d.data.replace(/-/g, "\/");
          let formattedDate = date.formatDate(new Date(d.data), 'YYYY/MM/DD')
          return formattedDate;
        });
        sortByDate(availableDateList);

      }

      return availableDateList;
    },
    availableTimeList() {
      let freeHoursList = [];
      if (this.hoursList) {
        let list = this.hoursList;
        freeHoursList = list.filter(
          h => h.stato_codice === this.STATUS_CODES.FREE
        );
        sortByTime(freeHoursList);
        let formattedToday = date.formatDate(this.today, "YYYY/MM/DD");
        if (this.selectedDate === formattedToday) {
          freeHoursList = freeHoursList.filter(h => {
            return new Date(formattedToday + " " + h.ora_slot) > this.today;
          });
        }
      }
      return freeHoursList;
    }
  },
  methods: {
      onNavigation({ month, year }){
        if(this.isLoadingDate) return
        this.getAvailableDataList(month, year)
      },
    getSelectedDateOptions() {
      if (this.selectedDate && this.availableDateList) {
        this.selectedDateIndex = this.availableDateList.indexOf(
          this.selectedDate
        );
        this.selectedDateLabel = date.formatDate(
          new Date(this.selectedDate),
          "dddd DD MMMM YYYY"
        );
        this.getAvailableTimeList(this.selectedDate);
      }
    },
    getDefaultCalendar() {
      if (!this.selectedDate) {
        this.selectedDate = this.defaultDate;
      }
       let month = date.formatDate(this.defaultDate, "MM");
       //let month = date.formatDate(this.today, "MM");
       let year = date.formatDate(this.defaultDate, "YYYY");
      //  let year = date.formatDate(this.today, "YYYY");
      this.getAvailableDataList(month, year);
    },

    async getAvailableDataList(month, year) {
        this.isLoadingDate=true;
      let params = {
        tipologia: this.appointmentType,
        mese: month,
        anno: year,
        adesione_spontanea:0 //per ora sempre a 0 , successivamente scegliere in base ad appuntamento spontaneo o modifica
      };
      try {
        let datesResponse = await getAvailableDates(this.agendaId, {
          _no5XXRedirect: true,
          params: params
        });
        if (datesResponse.data.length > 0) {
          this.datesList = datesResponse.data;

          if (this.datesList.length > 0) this.getSelectedDateOptions();
        }
      } catch (e) {

        console.log(e);
      }finally {
        this.isLoadingDate=false
      }

    },
    onInputDate(value, reason, details) {
      console.log("click", reason);
      if (reason === "add-day") this.selectedDate = value;
      // if (reason === "year" || reason === "month") {
      //   if(this.isLoadingDate) return
      //   let month = details.month.toString();
      //   let year = details.year.toString();
      //   if (month < 10) month = "0" + month;
      //   this.getAvailableDataList(month, year);
      // }
    },

    previousDate() {
      this.selectedDate = this.availableDateList[this.selectedDateIndex - 1];
    },
    nextDate() {
      this.selectedDate = this.availableDateList[this.selectedDateIndex + 1];
    },
    async getAvailableTimeList() {
      this.isHoursLoading = true;
      this.formatSelectedDate = this.selectedDate.replace(/\//g, "-");
      let params = {
        tipologia: this.appointmentType,
        adesione_spontanea: 0
      };
      try {
        this.hoursListErr= false
        this.hoursList=null
        let hoursResponse = await getAvailableHours(
          this.agendaId,
          this.formatSelectedDate,
          { _no5XXRedirect: true, params: params }
        );
        this.hoursList = hoursResponse.data;

      } catch (e) {
        this.hoursListErr= true
      }
        this.isHoursLoading = false;
    },
    onSelectTime(time, index) {
      this.pressedTimeBtn = index;
      this.selectedTime = time;
      let newDateTime = {
        date: this.formatSelectedDate,
        time: this.selectedTime
      };

      this.$emit("new-appointment", newDateTime);
    }
  }
};
</script>

<style lang="sass">
.getDateCalendar
  .q-date__calendar-item--out
    opacity: 0.7
    border: none
  .q-date__calendar-item--in .bg-primary
    border: $primary 1px solid
  .q-date__calendar-item--in  button
    background: rgba($primary, 0.1)
    border: rgba($primary, 0.5) 1px solid
    .q-btn__wrapper
      padding: 0
</style>
