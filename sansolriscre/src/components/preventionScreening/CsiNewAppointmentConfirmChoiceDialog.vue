<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog ref="confimDialog" :value="value" :maximized="$q.screen.lt.sm" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-pa-md" style="width:600px; max-width: 800px;">
      <q-card-section >
        <p v-if="isNewAppointment">
            Stai prenotando un nuovo appuntamento di <strong>{{appointmentName}}</strong>
        </p>
        <p v-else> Stai modificando l'appuntamento di <strong>{{appointmentName}}</strong> </p>
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <lms-buttons >
          <lms-button  @click="confirmChange">Conferma</lms-button>
          <lms-button outline v-close-popup>Annulla</lms-button>
        </lms-buttons>

<!--        <q-btn color="primary" outline label="Annulla" v-close-popup></q-btn>-->
<!--        <q-btn color="primary" label="Conferma" @click="confirmChange" />-->
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
  import { NEW_APPOINTMENT_SUMMARY } from "src/router/routes";

  import {capitalize} from "../../services/utils";
  import {APPOINTMENT_TYPES_NAME} from "src/services/config";
    export default {
        name: "CsiNewAppointmentConfirmChoiceDialog",
        props:{
          value:{type: Boolean, required:true, default:false},
          appointmentParams: {type:Object, required:true, default:null},
        },
        data(){
          return{
            NEW_APPOINTMENT_SUMMARY,
            APPOINTMENT_TYPES_NAME,
          }
        },
      computed:{
        appointmentName(){
          let typeId = this.appointmentParams?.newAppointmentInfo?.tipologia_codice;
          return typeId ? capitalize(APPOINTMENT_TYPES_NAME[typeId]) : ''
        },
        isNewAppointment(){
          return this.appointmentParams?.isNewAppointment
        }
      },

      methods:{
        confirmChange(){
          let route = {
            name: this.NEW_APPOINTMENT_SUMMARY.name,
            params: this.appointmentParams
          };

          this.$router.replace(route);
        },
        onDialogHide() {
          this.$emit('close-dialog', false)
        }
      }
    }
</script>

<style scoped>

</style>
