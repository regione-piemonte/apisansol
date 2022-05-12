<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card
    v-bind="attrs"
    v-on="listeners"
    :bordered="bordered"
    class="lms-vaccination-center-card"
    :style="{padding: cardStyle}"
  >
    <q-card-section class="q-pb-none">
      <vac-vaccination-center-list-item
        :vaccination-center="vaccinationCenter">
      </vac-vaccination-center-list-item>
    </q-card-section>
    <q-card-actions class="q-px-md q-pb-md" align="right">
      <lms-buttons>
        <lms-button   @click="onSelected" >
          Scegli
        </lms-button>
      </lms-buttons>
    </q-card-actions>
  </q-card>
</template>

<script>
import VacVaccinationCenterListItem from "components/VacVaccinationCenterListItem";
export default {
name: "VacVaccinationCenterCard",
  components: {VacVaccinationCenterListItem},
  props:{
   vaccinationCenter:{type:Object, required:true, default:null},
    bordered:{type:Boolean, required:false, default: false}
  },
  methods:{
    onSelected(){
      this.$emit("on-selected",this.vaccinationCenter)
    }
  },
  computed:{
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    attrs() {
      // eslint-disable-next-line no-unused-vars
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    cardStyle(){
     let padding = this.bordered ? 1 : 2
      return `${padding}px`
    }
  }
}
</script>

<style lang="sass">

.lms-vaccination-center-card
  cursor: pointer
  &:hover
    border: 2px solid rgba($lms-primary-active-color, 0.6)
    //box-shadow: 0 1px 5px rgba($lms-primary-active-color, 0.5), 0 2px 2px rgb($lms-primary-active-color / 50%), 0 3px 1px -2px rgb($lms-primary-active-color / 50%)
    box-shadow: 0px 0px 5px  rgba($lms-primary-active-color, 0.5)
    -webkit-box-shadow:   0px 0px 5px  rgba($lms-primary-active-color, 0.5)
    -moz-box-shadow:   0px 0px 5px  rgba($lms-primary-active-color, 0.5)
    padding: 0px !important

  &.active, &.home:hover
    padding: 0px !important
    border: 2px solid $lms-primary-active-color
    box-shadow: 0px 0px 10px $lms-primary-active-color
    -webkit-box-shadow:   0px 0px 10px $lms-primary-active-color
    -moz-box-shadow:   0px 0px 10px $lms-primary-active-color


</style>
