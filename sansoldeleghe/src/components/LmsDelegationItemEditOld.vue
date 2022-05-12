<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="row items-start justify-between q-col-gutter-md" >
      <div class="col-12 col-md-4" :class="{'q-mt-xl' : $q.screen.gt.sm}">
        <q-toggle v-model="isActive" :label="delegationsName" color="primary" @input="onInputActivation"/>
      </div>
      <div class="col-12 col-md-5">
        <div class="q-px-sm">
          <p class="text-overline" >Cosa può fare il delegato</p>
          <p><strong>Vedere e modificare</strong></p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
        </div>

      </div>
      <div class="col-12 col-md ">
        <div class="q-px-sm">
          <p class="text-overline">Validità</p>
          <q-item dense class="q-pa-none">
            <q-item-section side>
              <q-item-label overline>dal</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-input
                required
                dense
                v-model="startDate"
                mask="##/##/####"
                placeholder="gg/mm/aaaa"
                no-error-icon
                reactive-rules
                bottom-slots
                :error="$v.startDate.$error"
                @input="onInputStartDate">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="examDateProxy" v-model="showStartDateCalendar">
                      <q-date
                        v-model="startDate"
                        minimal
                        mask=FORMAT_DATE
                        @input="showStartDateCalendar=false"
                        :options="rangeStartOptions"

                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:error>
                  <div v-if="!$v.startDate.validDate || !$v.startDate.required">Inserire una data valida</div>
                  <template v-else>
                    <div v-if="!$v.startDate.validRange">la data deve essere compresa tra {{minEndDate | date}} e {{maxEndDate | date}}</div>
                  </template>

                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <q-item dense  class="q-pa-none">
            <q-item-section side>
              <q-item-label overline>al</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-input
                required
                dense
                v-model="endDate"
                mask="##/##/####"
                placeholder="gg/mm/aaaa"
                no-error-icon
                reactive-rules
                bottom-slots
                :error="$v.endDate.$error"
                @input="onInputEndDate">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="examDateProxy" v-model="showEndDateCalendar">
                      <q-date
                        v-model="endDate"
                        minimal
                        mask=FORMAT_DATE
                        @input="showEndDateCalendar=false"
                        :options="rangeEndOptions"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:error>
                  <div v-if="!$v.endDate.validDate || !$v.endDate.required">Inserire una data valida</div>
                  <template v-else>
                    <div v-if="!$v.endDate.validRange">la data deve essere compresa tra {{today | date}} e {{endDate}}</div>
                  </template>

                </template>
              </q-input>
            </q-item-section>
          </q-item>
        </div>

      </div>
    </div>

</template>

<script>
import {date} from "quasar";
import {getDelegationDaysInterval} from "src/services/business-logic";
import {required} from "vuelidate/lib/validators";
import {isEmpty} from "src/services/utils";

export default {
name: "LmsDelegationItemEditOld",
  props:{
    delegation: {type: Object, default: null},
    isNew:{type:Boolean, default:false},
    isFse:{type:Boolean, default:false},
  },
  data(){
  return{
    isActive:false,
    startDate:'',
    endDate: '',
    showStartDateCalendar:false,
    showEndDateCalendar:false,
    today: new Date()
  }
  },
  created() {
   let startDate = new Date()
    let serviceDaysInterval = getDelegationDaysInterval(this.delegation?.numero_giorni)
    let maxDate =  date.addToDate(new Date(), {days: serviceDaysInterval})
    this.endDate =  date.formatDate(maxDate, FORMAT_DATE)
    this.startDate = date.formatDate(startDate, FORMAT_DATE)

  },
  validations(){
    return{
      startDate:{
        required,
        validDate: v => isEmpty(v) ||  this.$rules.date(v) ,
        validRange : v=> {
          let today = date.formatDate(new Date(), 'DD/MM/YYYY')
          return isEmpty(v) || this.rangeStartOptions(v, 'DD/MM/YYYY')
        }
      },
      endDate :{
        required,
        validDate: v => isEmpty(v) ||  this.$rules.date(v),
        validRange : v=> {
          let minDate = date.formatDate(this.minEndDate, 'DD/MM/YYYY')
          let maxDate = date.formatDate(this.maxEndDate, 'DD/MM/YYYY')
          return isEmpty(v) || this.rangeEndOptions(v, 'DD/MM/YYYY')
        }
      }
    }
  },
  computed:{

    delegationsName(){
      return this.delegation?.applicazione?.descrizione
    },
    minEndDate(){
      let startDate = date.extractDate(this.startDate, 'DD/MM/YYYY')
     return date.addToDate( startDate, {days: 1})

    },
    maxEndDate(){
      let serviceDaysInterval = getDelegationDaysInterval(this.delegation?.numero_giorni)
      return  date.addToDate(new Date(), {days: serviceDaysInterval})

    },
    startRangeRule(){
      let today = date.formatDate(new Date(), 'DD/MM/YYYY')
      return (v)=> this.rangeStartOptions(v, 'DD/MM/YYYY') || `la data deve essere compresa tra ${today} e ${this.endDate}`
    },
    endRangeRule(){
      let minDate = date.formatDate(this.minEndDate, 'DD/MM/YYYY')
      let maxDate = date.formatDate(this.maxEndDate, 'DD/MM/YYYY')
      return (v)=> this.rangeEndOptions(v, 'DD/MM/YYYY') || `la data deve essere compresa tra ${minDate} e ${maxDate}`
    }
  },
  methods:{
    rangeStartOptions(calendarDate, format = 'YYYY/MM/DD'){
      let selectedDate = date.extractDate(calendarDate, format)
      let today = new Date()
      let endDate = date.extractDate(this.endDate, 'DD/MM/YYYY')
      return date.isBetweenDates(selectedDate, today, endDate, { inclusiveFrom: true, inclusiveTo: true })
    },

    rangeEndOptions(calendarDate, format = 'YYYY/MM/DD'){
      let selectedDate = date.extractDate(calendarDate, format)
      return date.isBetweenDates(selectedDate, this.minEndDate, this.maxEndDate, { inclusiveFrom: true, inclusiveTo: true })
    },
    onInputActivation(val){
      this.$emit('on-activate', val, this.delegation)
    },
    onInputStartDate(val){
      this.$v.startDate.$touch();
      if (this.$v.startDate.$error) {
        return;
      }
      this.$emit('change-start-date', val, this.delegation)
    },
    onInputEndDate(val){
      this.$v.endDate.$touch();
      console.log(this.$v.endDate.$error)
      if (this.$v.endDate.$error) {
        return;
      }
      this.$emit('change-end-date', val, this.delegation)
    },
  }
}
</script>

<style scoped>

</style>
