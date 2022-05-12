<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card class="q-my-md text-body1 relative-position" >

      <lms-card-item no-actions>
        <template slot="primary">
          <lms-card-item-primary >
            <template slot="icon">
              <q-icon size="md" :name="examinationIcon" />
            </template>
            <template slot="text">
              <div class="text-subtitle1 text-weight-bold q-pa-sm q-mb-md">
                {{ examinationName | capitalize }} <br>
                {{examinationLevel}}
              </div>


            </template>
          </lms-card-item-primary>
        </template>
        <template slot="secondary">
          <div class="q-px-md q-pt-md row q-mb-lg">
            <q-list class="col col-md-10">
              <q-item>
                <q-item-section >
                  <div class="row items-stretch">
                    <div class="col-12 col-sm-4 ">
                      <div>Data</div>
                      <div>
                        <strong>{{ examinationDate| date }}</strong>
                      </div>
                    </div>
                    <div class="col-12 col-sm-8" :class="{'q-pt-md' : $q.screen.lt.sm}" >
                      <div>Luogo</div>
                      <div v-if="examinationPlace">
                        <strong>{{examinationPlace.descrizione}}</strong>
                      </div>
                      <div v-if="examinationAsl">
                        ({{examinationAsl.descrizione}})
                      </div>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section >
                  <div>Esito: <strong>{{ examinationResult }}</strong></div>
                </q-item-section>
              </q-item>
            </q-list>
            <q-space />
            <div class="row reverse text-center " v-if="isActiveFseDelegation || !isActiveDelegation">
              <q-icon
                color="grey-7"
                size="sm"
                name="more_vert"
                class="cursor-pointer"
              >
                <q-menu auto-close >
                  <q-list>
                    <q-item clickable @click="hideExamination">
                      <q-item-section v-if="!isHidden">Oscura vista esame</q-item-section>
                      <q-item-section v-else>Mostra vista esame</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </div>

          </div>



          <template slot="actions"> </template>
        </template>

      </lms-card-item>

      <div class="lms-examination-item__status-icon" >
        <template  v-if="isHidden">
          <q-icon name="visibility_off" size="sm" >
            <q-tooltip>Documento oscurato</q-tooltip>
          </q-icon>
        </template>
      </div>




    <q-dialog v-model="isOpenHideModal">
      <q-card class="q-pa-md">
        <q-card-section>
          <p>
            In qualsiasi momento puoi oscurare o de-oscurare i dati e i documenti del Fascicolo.
          </p>
          <p>
            Questa possibilità si aggiunge alla funzione di consenso alla consultazione e/o delega. <br>
            In questo modo potrai ad esempio oscurare puntualmente singoli documenti o gruppi di informazioni
            (come nel caso delle esenzioni e delle misurazioni inserite da te)  ai professionisti Sanitari anche se è
            stato fornito il consenso alla consultazione.
          </p>

        </q-card-section>

          <q-card-actions align="right">
            <lms-buttons>
              <lms-button
                primary
                @click="changeVisibility()"
              >Conferma</lms-button>
              <lms-button outline v-close-popup >Annulla</lms-button>
            </lms-buttons>
          </q-card-actions>

      </q-card>
    </q-dialog>


  </q-card>
</template>

<script>
import { screeningLevel} from "src/services/business-logic";
import {
  APPOINTMENT_TYPES_LABEL,
  APPOINTMENT_TYPES_NAME,
  DELEGATION_RANK_CODES,
  FSE_SERVICE_CODE,
  FSE_VISIBILILY_CODES
} from "src/services/config";
import {equalsIgnoreCase} from "src/services/utils";
export default {
name: "CsiExaminationItem",
  props:{
  examination:{type:Object, required:true, default:null}
  },
  data(){
    return {
      isOpenHideModal:false
    }
  },
  computed:{
    examinationType(){
      return this.examination?.tipo_screening?.codice
    },
    examinationName(){
      return APPOINTMENT_TYPES_NAME[this.examinationType]
    },
    examinationLevel(){
      let type  = this.examination?.tipo_esame?.codice
      let code = type ? type.substr(type.length - 1) : ''
     return screeningLevel(code)
    },
    examinationIcon(){
      let typeLabel = APPOINTMENT_TYPES_LABEL[this.examinationType]
      return typeLabel ? `img:/statics/la-mia-salute/icone/screening-${typeLabel}.svg` : '';
    },
    examinationDate(){
      return this.examination.data
    },
    examinationPlace(){
      return this.examination.unita_operativa
    },
    examinationAsl(){
      return this.examination.azienda_sanitaria
    },
    examinationResult(){
      return this.examination.esito
    },
    isHidden(){
      // let visibleCodes = ["N", "M"];
      // return !visibleCodes.includes(this.examination?.oscurato);
      return this.examination?.oscurato === FSE_VISIBILILY_CODES.HIDDEN
    },
    pacient(){
      return this.examination.paziente
    },
    activeDelegation(){
      return this.$store.getters["getDelegatorSelected"]
    },
    isActiveDelegation(){
      return this.$store.getters["isDelegationActive"]
    },
    isActiveFseDelegation(){
      console.log(this.activeDelegation?.deleghe.some(delegation => {
        return equalsIgnoreCase(delegation.codice_servizio, FSE_SERVICE_CODE) ||
          equalsIgnoreCase(delegation.grado_delega, DELEGATION_RANK_CODES.STRONG)
      }))
     return this.activeDelegation?.deleghe.some(delegation => {
        return equalsIgnoreCase(delegation.codice_servizio, FSE_SERVICE_CODE) &&
          equalsIgnoreCase(delegation.grado_delega, DELEGATION_RANK_CODES.STRONG)
      })
    }

  },
  methods:{
    hideExamination(){
      this.isOpenHideModal= true

      // this.$emit('hide-examination', this.examination, !this.isHidden)
    },
    changeVisibility(){
      this.$emit('hide-examination', this.examination, !this.isHidden)
    }
  }
}
</script>

<style lang="sass">
.lms-examination-item__status-icon
  position: absolute

  left: 16px
  bottom: 8px
</style>
