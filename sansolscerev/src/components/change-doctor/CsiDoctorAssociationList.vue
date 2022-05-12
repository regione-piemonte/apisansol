<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
<div>
  <q-list no-border separator class="q-px-lg csi-doctor-association-list" >
    <q-item
            v-for="associazione in associations"
            :key="associazione.cod_associazione"
            class="no-padding"
    >
      <q-item-main class="q-py-md">
        <div class="q-pb-md flex items-center justify-start">
          <span class="q-body-1 q-mr-sm">Questo medico è associato a: </span>
          <span class="q-body-2 q-pr-xs">{{associazione.nome}}</span>
          <span v-if="associazione.descrizione_estesa">
            <q-icon
                    name="help"
                    class="csi-icon--xs note-info-icon cursor-pointer"
            >
              <q-tooltip anchor="top right" self="center left" max-width="20px"></q-tooltip>
            </q-icon>
          </span>
        </div>
        <div class="q-pb-md flex items-center justify-start">
          <span class="q-body-1 q-mr-sm">Medici della stessa associazione: </span>
          <template v-if="associazione.medici.length>0">
            <span
                    v-for="(medico, i) in associatedDoctors(associazione.medici)"
                    class="q-body-2 text-primary cursor-pointer"
                    v-on:click="doctorDetails(medico)"
            >
              {{medico.cognome}} {{medico.nome}} {{i < associatedDoctors(associazione.medici).length -1 ? ' - ': ''}}
            </span>
          </template>
        </div>
      </q-item-main>
    </q-item>
  </q-list>

</div>

</template>


<script>
 import {orderBy} from "@services/global/utils";
 import CsiDoctorDetails from "components/change-doctor/CsiDoctorDetails";

 export default {
   name: 'CsiDoctorAssociationList',
   components: {CsiDoctorDetails},
   props: {
     associations: {type: Array, required: true, default: null},
     doctor_id:{type:String, required:true}
   },
   data() {
     return {
       showDoctorDetail:false,
       selectedDoctor:null
     }
   },
   created(){

   },
   methods: {
     associatedDoctors(medici) {
       let filteredDoctors = medici.filter(m => m.id !== this.doctor_id);
       filteredDoctors = orderBy(filteredDoctors, ['cognome']);
       return filteredDoctors;
     },
     // doctorDetails(id, cf){
     //   this.$emit('doctor-details', {id:id, codice_fiscale:cf});
     // },
     doctorDetails(doctor){
       this.selectedDoctor =doctor;
      // this.showDoctorDetail=true
      this.$emit('show-associated-doctor-details', doctor)
     },


   }
 }
 </script>


<style lang="stylus">
  @require '~variables'

  .csi-doctor-association-list

    .note-info-icon
      color: #acacac;
      margin-top: -16px;


</style>
