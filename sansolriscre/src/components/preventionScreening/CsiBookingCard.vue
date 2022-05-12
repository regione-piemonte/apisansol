<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="col-12 col-sm-6"  v-if="isBookable">
  <q-card
    class="full-height cursor-pointer hoverable-card"
    @click="goToNewAppointment"
  >
    <q-card-section horizontal class="bg-primary items-center">
      <q-card-section>
        <q-avatar color="white">
          <q-icon
            :name="appointmentIcon"
          />
        </q-avatar>
      </q-card-section>
      <q-card-section
        class="text-subtitle1 text-weight-bold text-white q-pl-none"
      >
        <div>{{appointmentTypeName | capitalize}} <br> I livello</div>
      </q-card-section>
    </q-card-section>
    <q-card-section>
      <p class="q-pa-sm">
            {{screeningInfo}}
      </p>
    </q-card-section>
  </q-card>
  </div>
</template>

<script>
import {APPOINTMENT_TYPES_LABEL, APPOINTMENT_TYPES_NAME, SCREENING_INFO} from "src/services/config";
import {  NEW_APPOINTMENT_PLACE } from "src/router/routes";
export default {
name: "CsiBookingCard",
  props:{
      appointmentType:{type:String, required:true, default:''},
      isBookable: {type:Boolean, required:false, default:false}
  },
  computed:{
  appointmentTypeName(){
    return  APPOINTMENT_TYPES_NAME[this.appointmentType]
    },
    screeningInfo(){
      return  SCREENING_INFO[this.appointmentType]
    },

    appointmentTypeLabel(){
      return APPOINTMENT_TYPES_LABEL[this.appointmentType]
    },
    appointmentIcon() {
      return `img:/statics/la-mia-salute/icone/screening-${this.appointmentTypeLabel}.svg`;
    },
  },
  methods:{
    goToNewAppointment() {
      let params = {
        type: this.appointmentTypeLabel,
        typeId:this.appointmentType,
        isNewAppointment: true
      };

      let route = {
        name: NEW_APPOINTMENT_PLACE.name,
        params
      };

      this.$router.push(route);
    }
  }

}
</script>


<style lang="sass">
.minWidthCard
  min-width: 850px
.hoverable-card
  &:hover
    background-color: $grey-3
</style>
