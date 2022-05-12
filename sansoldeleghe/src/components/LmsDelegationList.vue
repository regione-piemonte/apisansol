<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>

    <div v-if="isNew" class="text-h5 q-mb-lg" >Scelta servizi</div>

    <!--      NON FSE-->
    <q-card class="q-mb-xl " :flat="!isNew">

      <q-card-section    v-for="(delegation,index) in nonFseDelegations" :key="delegation.id"
      >
        <lms-delegation-item-edit
          :delegation="delegation"
          :is-new="isNew"
          @on-change="onChangeDelegation"

        />

        <q-separator v-if="index < nonFseDelegations.length-1"  spaced="md"></q-separator>
      </q-card-section>
    </q-card>
    <!--  FSE-->
    <q-card :flat="!isNew" class="q-pt-xl">
      <q-card-section>
        <div class="lms-fse-tree">
          <div class="lms-fse-tree--root row items-start justify-between q-col-gutter-md q-col-gutter-md-lg " >
            <div class="col-12 col-md-4" >
              <div class="row items-center q-col-gutter-x-sm">
                <q-icon class="col-auto" size="md" name="img:/statics/la-mia-salute/icone/menu-fse.svg"/>
                <div  class="col">
                  <span class="text-h6"><strong>Fascicolo sanitario</strong></span>
                  <q-btn
                    flat
                    round
                    dense
                    icon="o_info"
                    color="primary"
                    @click="showFseInfoModal()"
                  />
                </div>

              </div>

            </div>
            <div class="col-12 col-md-5" :class="{'lms-delegation-item-content': $q.screen.lt.md}">
              <div class="q-px-sm">
                <div class="row items-center q-mb-sm">
                  <p class="text-overline no-margin" >Cosa può fare il delegato</p>
                  <q-btn
                    flat
                    round
                    dense
                    icon="o_info"
                    color="primary"
                    @click="showWeakDelegationInfoModal()"
                  />
                </div>
                <q-checkbox dense v-model="activeFseWeak"
                            label="Visualizza le informazioni non oscurate su tutti i servizi della piattaforma Fascicolo Sanitario" />
              </div>

            </div>
            <div class="col-12 col-md">
            </div>

          </div>
          <div class="q-ml-lg q-mr-sm q-mt-md q-mb-xl">
            <q-separator />
          </div>
          <div class="lms-fse-tree--children">
            <div class="lms-fse-tree--row relative-position"
                 v-for="(delegation,index) in fseDelegations"
                 :key="delegation.id"
            >
              <lms-delegation-item-edit
                :delegation="delegation"
                :is-weak-delegation="activeFseWeak"
                :is-new="isNew"
                is-fse
                @change-weak-delegation="onActiveWeak"
                @on-change="onChangeDelegation"
              />
              <div class="q-pl-md q-py-md" v-if="index < fseDelegations.length-1" >
                <q-separator  ></q-separator>
              </div>


            </div>

          </div>


        </div>
      </q-card-section>

    <!--    DIALOG-->
      <lms-delegation-info-dialog v-model="isOpenFseInfoModal" title="Fascicolo sanitario">
          <p>
            Le informazioni presenti nel fascicolo sanitario sono disponibili in servizi online specifici del portale
            "Tu salute Piemonte":
          </p>
        <ul>
          <li>I documenti che hai chiesto di ritirare online sono scaricabili accedendo al servizio
            "I documenti clinico sanitari" nella sezione "Referti da pagare e/o ritirare"</li>
          <li>I documenti clinici confluiti nel fascicolo e i referti già scaricati sono consultabili accedendo al servizio
            "I documenti clinico sanitari" nella sezione "Archivio documenti"</li>
          <li>Le prescrizioni farmaceutiche e specialistiche sono accessibili nel servizio
            "Ricetta dematerializzata" sezione "Archivio"</li>
          <li>I documenti delle esenzioni sono reperibili nel servizio "Esenzioni per patologia"</li>
          <li>Gli esiti degli esami screening sono consultabili nel servizio "Prevenzione serena"</li>
          <li>I documenti inseriti in autonomia sono presenti nel servizio "I documenti clinico sanitari"
            nella sezione "Archivio documenti"</li>
          <li>Le misurazioni cliniche che hai registrato sono consultabili nel servizio  "Taccuino"</li>
        </ul>
      </lms-delegation-info-dialog>

      <lms-delegation-info-dialog v-model="isOpenWeakDelegationInfoModal" title="Cosa può fare il delegato">
        <p>
          Con la delega permetterai a qualcuno di tua fiducia di accedere ed eventualmente operare sul tuo
          Fascicolo Sanitario Elettronico.<br>
          La delega viene conferita accedendo al servizio "Deleghe" e non deve essere confusa con il consenso alla
          consultazione che ti permette di regolare l'accesso al tuo Fascicolo da parte dei professionisti sanitari.
        </p>
        <p>
          Se desideri che altri cittadini abbiano acceso al tuo fascicolo devi fornire la delega.<br>
          Se desideri che i professionisti Sanitari accedano al tuo fascicolo devi fornire il consenso alla consultazione.<br>
          Puoi revocare la delega e/o il consenso alla consultazione in qualsiasi momento.
        </p>
        <p>
          Puoi delegare persone di tua fiducia ad accedere al tuo Fascicolo.
        </p>
        <p>
          E' consentito fornire una delega su ogni singolo servizio della piattaforma Fascicolo Sanitario
          (Documenti clinico sanitari, Ricetta Elettronica, Esenzioni, Prevenzione, Taccuino): in questo modo il
          delegato agisce in vece tua.<br>
          In alternativa può essere fornita una delega a livello di  "Fascicolo Sanitario", con delle limitazioni in
          un unico passaggio: le limitazioni implicano che il delegato non può visualizzare le informazioni oscurate e
          non può modificare la visibilità dei documenti a cui ha accesso.
        </p>
      </lms-delegation-info-dialog>
    </q-card>
  </div>

</template>

<script>
import LmsDelegationItemEdit from "components/LmsDelegationItemEdit";
import {
  DELEGATION_RANK_CODES,
  DELEGATION_STATUS_MAP,
  FSE_CODES_LIST,
  FSE_CODES_MATCH, IS_DEV,
  IS_TEST
} from "src/services/config";
import {deepClone, equalsIgnoreCase, isEmpty, orderBy} from "src/services/utils";
import {isDelegationValid} from "src/services/business-logic";
import LmsDelegationInfoDialog from "components/LmsDelegationInfoDialog";
export default {
name: "LmsDelegationList",
  components: {LmsDelegationInfoDialog, LmsDelegationItemEdit},
  props:{
   delegations:{type:Array, default:null},
    isNew:{type:Boolean, default: false}
  },
  data() {
    return {
      activeFseWeak: false,
      newDelegations:[],
      isOpenFseInfoModal:false,
      isOpenWeakDelegationInfoModal:false
    }
  },
  created(){
    if(!this.isNew){
      let isWeakDelegation = this.delegations.filter(delegation =>
        delegation.info_attivazione?.grado_delega === DELEGATION_RANK_CODES.WEAK
        && delegation.info_attivazione?.stato_delega === DELEGATION_STATUS_MAP.ACTIVE
        && delegation.gruppo_fse && !FSE_CODES_LIST.includes(delegation.info_attivazione?.codice_servizio))

      if(!isEmpty(isWeakDelegation)) this.activeFseWeak=true
    }

  },
  watch:{
    activeFseWeak:{
      immediate:true,
      handler(val, oldval){

        this.$emit('is-fse-weak', val)
      }
    },
  },
  computed:{
    fseDelegations(){
      let orderedDelegations= []

      let delegations =  this.delegations?.filter(d => d.gruppo_fse && !FSE_CODES_LIST.includes(d.codice_servizio))

      if(delegations){
        // orderedDelegations = this.sortDelegations(delegations)

        orderedDelegations =orderBy(delegations, ['posizione'])
      }

      return orderedDelegations
    },
    nonFseDelegations(){
      let orderedDelegations= []
      let delegations =this.delegations?.filter(d => !d.gruppo_fse)
      if(delegations){
        orderedDelegations = this.sortDelegations(delegations)
      }
      return orderedDelegations
    },
    // areDelegationsActive(){
    //   let activeDelegations = this.newDelegations.filter(delegation => isDelegationValid(delegation.stato_delega));
    //   return  activeDelegations?.length>0 || this.activeFseWeak
    // }
  },
    methods:{
      sortDelegations(delegations){
        delegations.sort((a, b) => {
          a = a.applicazione?.descrizione;
          b = b.applicazione?.descrizione;
          return a > b ? 1 : -1
        });
        return delegations
      },
      onChangeDelegation(params){
          //this.setNewDelegation(params)
       // if(this.isNew){

       // }

        if(this.isNew){
          let hasFseCode = this.withFseCode(params.codice_servizio)

          if(hasFseCode) params.grado_delega=null
          this.$emit('on-active-delegations', params)
        }else{
          //AGGIUNGO anche deleghe FSEPRE / FSEESE
            let fseCode = this.getFseCodes(params.codice_servizio)
            if(fseCode){
              let islastDelegate = this.delegations.find(delegation => delegation.codice_servizio ===fseCode)
              let fseDelegation = JSON.parse(JSON.stringify(params))
              fseDelegation.codice_servizio=fseCode
              if(islastDelegate){
                fseDelegation.uuid= islastDelegate.info_attivazione?.uuid
              }else{
                fseDelegation.uuid= null
              }
              this.$emit('on-active-delegations', fseDelegation)
              params.grado_delega=null
              this.$emit('on-active-delegations', params)
              //  this.setNewDelegation(fseDelegation)
            }else{
              this.$emit('on-active-delegations', params)
            }

        }

       // this.$emit('on-active-delegations', this.newDelegations)
      },
      setNewDelegation(params){
        let selectedDelegation = this.newDelegations.find(delegation => delegation?.codice_servizio === params.codice_servizio)
        if(selectedDelegation){
          let index = this.newDelegations.indexOf(selectedDelegation)
          this.newDelegations[index] = params
        }else{
          this.newDelegations.push(params)
        }
      },
      onActiveWeak(val){
        this.activeFseWeak = val
      },
      getFseCodes(serviceCode){
        if(this.isNew){
          return null
        }

        let match = FSE_CODES_MATCH.find(codes => codes[0] === serviceCode)
        return match ? match[1] : null

      },

      withFseCode(serviceCode){
        let match = FSE_CODES_MATCH.find(codes => codes[0] === serviceCode)
        return !isEmpty(match)
      },
      showFseInfoModal(){
        this.isOpenFseInfoModal=true
      },
      showWeakDelegationInfoModal(){
        this.isOpenWeakDelegationInfoModal=true
      }
    }
}
</script>

<style lang="sass">
.lms-fse-tree--children

.lms-fse-tree--root
  position: relative
  &:after
    content: ""
    position: absolute
    top: 50px
    bottom: -24px
    width: 2px
    right: auto
    left: 24px
    border-left: 2px solid $primary
.lms-fse-tree--row:not(:last-child)
  &:after
    content: ""
    position: absolute
    top: -16px
    bottom: 0
    width: 2px
    right: auto
    left: 8px
    border-left: 2px solid $primary

</style>
