<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="vac-calendar-month">
    <!-- LISTA GIORNI -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <div class="row q-col-gutter-x-sm q-col-gutter-y-md">
      <div class="col-1" v-for="day in monthDayList" :key="day.toString()">
        <template v-if="isSelectableDate(day)">
          <template v-if="day !== selectedDay">
            <q-btn outline round dense @click="onDaySelected(day)">
              {{ day | date("D") }}
            </q-btn>
          </template>

          <template v-else>
            <q-btn
              unelevated
              round
              dense
              color="primary"
              @click="onDaySelected(day)"
            >
              {{ day | date("D") }}
            </q-btn>
          </template>
        </template>

        <q-btn v-else disable round flat color="grey-6">
          {{ day | date("D") }}
        </q-btn>
      </div>
    </div>

    <!-- ELENCO ORARI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="selectedDay">
      <div class="q-py-md text-center text-h5">
        Seleziona un orario
      </div>

      <div class="row justify-center">
        <div
          class="col-auto"
          v-for="(timeSlot, index) in freeTime"
          :key="index"
        >
          <q-btn
            rounded
            :color="pressedTime[index]"
            class="q-ma-sm"
            @click="onTimeSelected(timeSlot, index)"
          >
            {{ timeSlot.ora }}
            -
            {{ timeSlot.ambulatorio }}
          </q-btn>
        </div>
      </div>
    </template>

    <!--    se siamo nello stepper ho il tasto indietro-->
    <template v-if="canGoBack">
      <lms-buttons>
        <lms-button outline label="indietro" @click="$emit('back')" />
      </lms-buttons>
    </template>
  </div>
</template>

<script>
import { date } from "quasar";

const { daysInMonth, getDateDiff } = date;

export default {
  name: "VacCalendarMonth",
  props: {
    month: { type: Number, required: true },
      year: { type: Number, required: true },
    slotList: { type: Array, required: false, default: () => [] },
    canGoBack: { type: Boolean, required: false }
  },
  data() {
    return {
      freeDays: [],
      freeTime: [],
      data: [],
      selectedDay: null,
      pressedTime: [],
      currentMonth: null,
        possibleFreeTime: [],
    };
  },
  computed: {
    slotListFiltered() {
      return this.slotList.filter(s => {
        let date = new Date(s.data_appuntamento);
        return date.getMonth() === this.currentMonth;
      });
    },
    monthDayList() {
      let result = [];

      for (let i = 1; i <= this.daysInMonth; i++) {
        let date = new Date();
        date.setMonth(this.currentMonth);
        date.setDate(i);
        date.setFullYear(this.year)
        result.push(date);
      }

      return result;
    },
    daysInMonth() {
      let date = new Date();
      date.setMonth(this.currentMonth);
      return daysInMonth(date);
    }
  },
  watch: {
    slotList: {
      async handler() {
        //predispongo i giorni dei mesi
        this.currentMonth = this.month ;

        this.pressedTime = [];
        this.freeTime = [];
      }
    }
  },
  created() {},
  methods: {
    isSelectableDate(date) {


      return this.slotListFiltered.some(s =>
         getDateDiff(s.data_appuntamento, date, "days") ===0

      );
    },
    //scegliendo il giorno predispongo i possibili orari
    onDaySelected(giorno) {
      //questo pulisce il payload nel caso abbia ri-cliccato su un giorno diverso
      this.$emit("clearPayload");

      this.pressedTime = [];
      this.freeTime = [];
      this.selectedDay = giorno;

         this.possibleFreeTime = this.slotListFiltered.filter(s =>
            getDateDiff(s.data_appuntamento, this.selectedDay, "days") ===0)


      for (let i = 0; i < this.possibleFreeTime.length; i++) {
        let timeSlot = { ora: "", ambulatorio: "", codice: "" };

        if (
          parseInt(this.possibleFreeTime[i].data_appuntamento.slice(8, 10)) ===
            this.selectedDay.getDate() &&
          parseInt(this.possibleFreeTime[i].data_appuntamento.slice(5, 7)) ===
            this.currentMonth +1
        ) {
          timeSlot.ora = this.possibleFreeTime[i].data_appuntamento.slice(11, 16);
          timeSlot.ambulatorio = this.possibleFreeTime[i].descrizione;
          timeSlot.codice = this.possibleFreeTime[i].codice_ambulatorio;
          this.freeTime.push(timeSlot);
        }
      }

    },

    //scelgo l'ora
    async onTimeSelected(timeSlot, index) {
      this.pressedTime = [];
      this.pressedTime[index] = "primary";
      this.$forceUpdate();
      //this.$emit('confirm')
      this.confirmDate = this.possibleFreeTime.find(
        a =>
          parseInt(a.data_appuntamento.slice(8, 10)) === this.selectedDay.getDate() &&
          parseInt(a.data_appuntamento.slice(5, 7)) === this.currentMonth +1 &&
          a.data_appuntamento.slice(11, 16) === timeSlot.ora &&
          a.codice_ambulatorio === timeSlot.codice
      );


      // TODO: cercare lo slot selezionato in base al giorno e l'ora selezionati dall'utente
      // let slotSelected = this.slotList.find(s => {
      //   let date = ''
      // });

      //questo va a creare il payload
      if (this.confirmDate) this.$emit("confirm", this.confirmDate);
      else {
        this.$q.notify("Seleziona data e ora per l appuntamento");
      }
    }
  }
};
</script>

<style lang="sass"></style>
