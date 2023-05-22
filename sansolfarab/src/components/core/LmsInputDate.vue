<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <q-input
    v-on="listeners"
    v-bind="attrs"
    no-error-icon
    dense
    :required="required"
    bottom-slots
    mask="##/##/####"
    @input="onInputDate"
    placeholder="gg/mm/aaaa"
    v-model="selectedDate"
    reactive-rules
    :rules="[ruleRequired, ruleValidDate, ruleMinDate]"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy ref="examDateProxy" v-model="showCalendar">
          <q-date
            :value="selectedDate"
            minimal
            :mask=FORMAT_DATE
            :options="rangeOptions"
            :navigation-min-year-month="minYearMonth"
            no-unset
            @input="onInputDate"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>

import {date} from 'quasar'
import {FORMAT_DATE} from "src/services/config";
let {getDateDiff, extractDate, formatDate} = date
export default {
  name: "LmsInputDate",
  props:{
    value:{required:true},
    required: {type:Boolean, required:false, default: false},
    minDate:{type:String, required:false, default: null},
    includeMinDate:{type:Boolean, required:false, default: false},
    defaultMinDate:{type:Boolean, required:false, default: false},
  },
  watch:{
    value:{
      immediate:true,
      handler(val, oldVal){
        this.selectedDate= val
      }
    }
  },
  data() {
    return {
      showCalendar:false,
      selectedDate:null,
      FORMAT_DATE,
      minYearMonth:null
    };
  },
  created() {
    this.minYearMonth = this.minDate ?  formatDate(this.minDateObj , 'YYYY/MM') : '1970/01'
 },
  computed: {
    ruleRequired() {
      return v => (!!v || !this.required) || "Campo obbligatorio";
    },
    ruleValidDate() {
      return v => /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(v) || "Inserire una data valida";
    },
    ruleMinDate(){
      let today = new Date();
      let isMinToday =  this.minDate === formatDate( new Date(), FORMAT_DATE)
      let ruleMsg= isMinToday ? `La data non può essere precedente ad oggi` : `La data non può essere precedente al ${this.minDate}`
      return v =>
        (getDateDiff(extractDate(v, FORMAT_DATE), this.minDateObj) >= 0 || !this.minDate )|| ruleMsg
    },

    minDateObj(){
      return this.minDate ? extractDate(this.minDate, FORMAT_DATE) : null
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    attrs() {
      // eslint-disable-next-line no-unused-vars
      const { ...attrs } = this.$attrs;
      return attrs;
    },

  },
  methods:{
    onInputDate(value){
      this.showCalendar = false
      this.selectedDate=value
      this.$emit("input", value);
    },
    rangeOptions(calendarDate, format ='YYYY/MM/DD' ) {
      if(this.minDate){
        let selectedDate = extractDate(calendarDate, format)
        let dateDifference= getDateDiff(selectedDate, this.minDateObj, 'days')
        return this.includeMinDate ?  dateDifference>= 0 : dateDifference>0
      }else{
        return calendarDate
      }

    }
  }
}
</script>

<style scoped>

</style>
