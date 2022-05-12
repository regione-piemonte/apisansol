<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <q-list no-border separator class="q-px-lg lms-doctor-association-list">
      <q-item
        v-for="associazione in associations"
        :key="associazione.cod_associazione"
        class="no-padding"
      >
        <q-item-section class="q-py-md text-body1">
          <div class="q-pb-md flex items-center justify-start">
            <span class="q-mr-sm">Questo medico è associato a: </span>
            <span class="q-pr-xs"><strong>{{associazione.nome}}</strong></span>
          </div>
          <div class="q-pb-md flex items-center justify-start">
            <span class="q-mr-sm">Medici della stessa associazione: </span>
            <template v-if="associatedDoctors(associazione.medici).length>0">
                <a
                  v-for="(medico, i) in associatedDoctors(associazione.medici)"
                  :key="i"
                  class="cursor-pointer lms-link"
                  @click="doctorDetails(medico)"
                >
                  {{medico.cognome}} {{medico.nome}} {{ areMoreDoctors(i, associatedDoctors(associazione.medici)) ? ' - ': ''}}
                </a>
            </template>
          </div>
        </q-item-section>
      </q-item>
    </q-list>

      <lms-doctor-details-dialog
        :value="showDoctorDetail"
        :doctor-id="selectedDoctorId"
        :doctor-cf="selectedDoctorCf"
        @close-dialog="closeDoctorDetails"
      />

  </div>
</template>

<script>
  import LmsDoctorDetailsDialog from "./LmsDoctorDetailsDialog";
  import {isEmpty, orderBy} from "../../services/utils";

  export default {
    name: "LmsDoctorAssociationList",
    components: {LmsDoctorDetailsDialog},
    props: {
      associations: {type: Array, required: true, default: null},
      doctor_id: {type: String, required: true}
    },
    data() {
      return {
        showDoctorDetail: false,
        selectedDoctor: null,
      }
    },
    computed:{
      selectedDoctorId(){
        return this.selectedDoctor?.id ?? ''
      },
      selectedDoctorCf(){
        return this.selectedDoctor?.codice_fiscale ?? ''
      }
    },
    methods: {
      associatedDoctors(medici) {
        let list = []
        if( !isEmpty(medici) ){
          let filteredDoctors = medici.filter(m => m.id !== this.doctor_id);
          list = orderBy(filteredDoctors, ['cognome']);
        }
        return list
      },
      doctorDetails(doctor) {
        this.selectedDoctor = doctor;
        this.showDoctorDetail = true
      },
      closeDoctorDetails(val) {
        this.showDoctorDetail = val
      },
      areMoreDoctors(i, doctors) {
        return i < this.associatedDoctors(doctors).length - 1
      }
    }
  }
</script>

<style scoped>

</style>
