<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
<lms-page padding>
  <lms-page-title>Nuova delega</lms-page-title>
  <lms-stepper
    ref="stepper"
    class="bg-transparent"
    flat
    alternative-labels
    animated
    :contracted="$q.screen.lt.md"
    v-model="currentStep"
    @step="onStep"
  >
    <!-- Step 1 -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <q-step
      title="Delegato"
      :name="STEPS.DELEGATE"
      prefix="1"
      :done="currentStep >STEPS.DELEGATE"
    >

      <q-card>
        <q-card-section>
          Dati del delegato
        </q-card-section>
        <q-card-section>
          <lms-form-person
            ref="formDelegator"
            :name.sync="name"
            :surname.sync="surname"
            :birth-date.sync="birthDate"
            :birth-place.sync="birthPlace"
            :tax-code.sync="taxCode"
            :gender.sync="gender"
            @has-warnings="onWarningUpdateStep1"
          />
        </q-card-section>
      </q-card>

      <q-card
        transition-show="slide-right"
        transition-hide="slide-left"
        class="bg-transparent"
        v-if="showWarningAlertStep1">
        <q-banner  class="h-banner h-banner--warning q-mt-lg">
          <div class="text-body1">
          <p>Ci sono dei campi che potrebbero essere sbagliati.</p>
          <p>Per favore, controlla prima di andare avanti</p>
          <div class="text-right">
            <q-btn flat @click="goToStep2">Ok, ho controllato</q-btn>
          </div>
          </div>
        </q-banner>
      </q-card>

      <lms-buttons v-else class="q-mt-lg">
        <lms-button  label="Continua" :loading="isCheckingStep" @click="onNextStep1"/>
      </lms-buttons>

    </q-step>

    <!-- Step 2 -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <q-step
      title="Servizi"
      :name="STEPS.SERVICES"
      prefix="2"
      :done="currentStep >STEPS.SERVICES">

      <lms-delegation-list
        is-new
        :delegations="delegations"
        @on-active-delegations="onChangeDelegation"
        @is-fse-weak="onActiveWeak"
      />

      <lms-buttons class="q-mt-lg">
        <lms-button  label="Continua" :disabled="!areDelegationsActive" @click="onNextStep2"/>
        <lms-button outline label="Indietro" @click="$refs.stepper.previous()"/>
      </lms-buttons>
    </q-step>

    <!-- Step 3 -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <q-step
      title="Riepilogo"
      :name="STEPS.SUMMARY"
      prefix="3"
      :done="currentStep >STEPS.SUMMARY"
    >

      <!-- DATI DELEGATO -->
      <!-- ------------- -->
      <q-card>
        <q-card-section>
          <q-item class="no-padding">
            <q-item-section avatar>
              <q-icon size="lg" :name="avatarIcon" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6">Dati del delegato</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                @click="goToStep1"
                flat
                round
                dense
                icon="edit"
                color="primary"
              />
            </q-item-section>
          </q-item>

        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <div>Nome</div>
              <div><strong>{{name | empty}}</strong></div>
            </div>
            <div class="col-12 col-sm-6">
              <div >Cognome</div>
              <div ><strong>{{surname | empty}}</strong></div>
            </div>
            <div class="col-12 col-sm-6">
              <div>Data di nascita</div>
              <div><strong>{{timeStampBirthDate | date | empty}}</strong></div>
            </div>
            <div class="col-12 col-sm-6">
              <div>Codice fiscale</div>
              <div ><strong>{{taxCode | empty}}</strong></div>
            </div>
            <div class="col-12 col-sm-6">
              <div>Comune di nascita</div>
              <div  ><strong>{{birthPlace | empty}}</strong></div>
            </div>
            <div class="col-12 col-sm-6">
              <div >Sesso</div>
              <div ><strong>{{gender === 'M' ? 'Maschio' : 'Femmina' | empty}}</strong></div>
            </div>
          </div>
        </q-card-section>

      </q-card>


      <!-- SCELTA SERVIZI -->
      <!-- -------------- -->
      <q-card class="q-mt-md">
        <q-card-section class="q-pb-none">
          <q-item class="no-padding">
            <q-item-section>
              <q-item-label class="text-h6">Scelta servizi</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                @click="returnToStep2"
                flat
                round
                dense
                icon="edit"
                color="primary"
              />
            </q-item-section>
          </q-item>

        </q-card-section>
        <q-card-section>
          <div v-for="delegation in newDelegations"
               :key="delegation.codice_servizio"
               class="row q-mt-sm">
            <div class="col-12 col-sm-6 "><strong>{{delegation.delega_descrizione}}</strong></div>
            <div class="col-12 col-sm-6">
              <span class=""><strong>Valida </strong></span>
              <span>
                dal {{delegation.data_inizio_delega | date | empty}}
                </span>
              <span v-if="delegation.data_fine_delega">
                al {{delegation.data_fine_delega | date}}
                </span>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- INFORMATIVA -->
      <!-- -------------- -->
      <q-card class="q-mt-md">
        <q-card-section class="q-pb-none">
          <span class="text-h6">Informativa</span>
        </q-card-section>
        <q-card-section>
          <lms-policy src="files/delegations-adults.html"/>
          <q-toggle
            v-model="hasAcceptedPolicy"
            label="Dichiaro di aver letto l'informativa e di accettare le condizioni d'uso"
            class="q-mt-lg"
          />
        </q-card-section>
      </q-card>
      <lms-buttons class="q-mt-lg">
        <lms-button  label="Conferma" :loading="isSavingDelegate" @click="onConfirm"/>
        <lms-button outline label="Indietro" @click="returnToStep2"/>
      </lms-buttons>
    </q-step>


    <!-- Step 4 - FINE -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <q-step
      title="Fine"
      :name="STEPS.END"
      prefix="4"
      :done="currentStep >STEPS.END"
    >

      <q-banner  class="h-banner h-banner--positive  q-pa-md" >
        <div class="text-body1">
          <p>
            Hai delegato <strong>{{name}} {{surname}}</strong> ad utilizzare i seguenti servizi online:
          </p>

          <ul>
            <li v-for="delegation in newDelegations" :key="delegation.codice_servizio">
              {{delegation.delega_descrizione}}
            </li>
          </ul>
        </div>
      </q-banner>

      <lms-buttons class="q-mt-lg">
        <lms-button outline label="Torna alla home" :to="HOME"/>
        <lms-button  label="Nuova delega" @click="goTonewDelegation"/>
      </lms-buttons>
    </q-step>

  </lms-stepper>


  <!-- MODALS -->
  <!-- ----------------------------------------------------------------------------------------------------------- -->
  <q-dialog v-model="isDelegateDuplicateModalVisible" :maximized="$q.screen.lt.md">
    <q-card >
      <q-toolbar>
        <q-toolbar-title>
          Cittadino già delegato
        </q-toolbar-title>
        <q-btn v-close-popup flat dense round icon="close"/>
      </q-toolbar>
      <q-card-section>
        <div class="text-h6">Hai già delegato questa persona</div>
      </q-card-section>
      <q-card-section>
        <lms-delegate-item
          :delegate="delegateDuplicated"
          read-only
        />
      </q-card-section>
      <q-card-actions align="right" class="q-px-md">
        <lms-buttons class="q-mb-md ">
          <lms-button  label="Gestisci" @click="goToDelegateDetail"/>
        </lms-buttons>
      </q-card-actions>
    </q-card>
  </q-dialog>

</lms-page>
</template>

<script>
import { date } from 'quasar'
import LmsFormPerson from "components/LmsFormPerson";
import {LENGTH} from "src/services/tax-code";
import {
  buildDefaultDelegation,
  excludeFseCodes, getAvatarIcon, getDelegationDaysInterval, getFseCode, getServiceWithFseCodes,
  isDelegationValid,
  isFseCodes, isGrownChildDelegator,
  personValidation
} from "src/services/business-logic";
import LmsStepper from "components/core/LmsStepper";
import {
  DECLARATION_TYPES_CODES,
  DELEGATION_RANK_CODES,
  DELEGATION_STATUS_MAP,
  DELEGATION_TYPE_CODES, EMPTY_PERSON,
  FORMAT_DATE,
  FSE_CODES_MATCH, IS_DEV, IS_PROD, IS_TEST
} from "src/services/config";
import {
  apiErrorNotify,
  capitalize,
  deepClone,
  equalsIgnoreCase,
  getResponseStatusCode, isEmpty,
  isStatusIn
} from "src/services/utils";
import {getDelegablesApp, getDelegate, saveDelegate} from "src/services/api";
import {DELEGATE_EDIT, DELEGATE_NEW, HOME} from "src/router/routes";
import LmsDelegationItemEdit from "components/LmsDelegationItemEdit";
import LmsPolicy from "components/core/LmsPolicy";
import LmsDelegateItem from "components/LmsDelegateItem";
import LmsDelegationList from "components/LmsDelegationList";

const STEPS = {
  DELEGATE: 1,
  SERVICES: 2,
  SUMMARY: 3,
  END: 4
};


export default {
  name: "PageDelegateNew",
  components: {LmsDelegationList, LmsDelegateItem, LmsPolicy, LmsStepper, LmsFormPerson},
  data() {
    return {
      HOME,
      TAX_CODE_LENGTH: LENGTH,
      STEPS,
      currentStep: STEPS.DELEGATE, //@todo
      //currentStep: STEPS.SERVICES,
      hasAcceptedPolicy: false,
      activeDelegations:[],
      isSavingDelegate: false,
      hasWarningStep1:false,
      showWarningAlertStep1: false,
      isCheckingStep: false,
      isDelegateDuplicateModalVisible: false,
      delegateDuplicated: null,
      name:'',
      surname:'',
      birthDate:'',
      birthPlace:'',
      taxCode:'',
      gender:'',
      activeFseWeak:false,
      newDelegations:[],
      delegations:[]
    };
  },
  computed: {
    timeStampBirthDate(){
      return date.extractDate(this.birthDate, FORMAT_DATE)
    },
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    user() {
      return this.$store.getters['getUser']
    },
    avatarIcon(){
      return getAvatarIcon(this.gender)
    },
    delegableAppServices() {
     return  this.$store.getters['delegableAppServices'];
    },
    fseDelegations(){
      let orderedDelegations= []
      let delegations =  this.delegations?.filter(d => d.gruppo_fse)
      if(delegations){
        orderedDelegations = delegations.sort((a, b) => {
          a = a?.applicazione?.descrizione;
          b = b?.applicazione?.descrizione;
          return a > b ? 1 : -1
        });
      }
      return orderedDelegations
    },
    nonFseDelegations(){
      let orderedDelegations= []

    let delegations =  this.delegations?.filter(d => !d.gruppo_fse)
      if(delegations){
         orderedDelegations = delegations.sort((a, b) => {
          a = a?.applicazione?.descrizione;
          b = b?.applicazione?.descrizione;
          return a > b ? 1 : -1
        });
      }
      return orderedDelegations
    },
    areDelegationsActive(){
      return  this.activeDelegations.length>0
    }

  },

 async  created() {

   this.activeDelegations = []
   this.newDelegations = []
   this.activeFseWeak=false
   await this.getDelegablesServices()
  },
  methods: {
   async getDelegablesServices(){
     if(!isEmpty(this.delegableAppServices)){
       this.delegations = this.delegableAppServices
     }
    },
    onWarningUpdateStep1(val) {
      this.hasWarningStep1 = val
    },

    async onNextStep1() {
      if (!this.isStep1Valid()) return

      this.name = capitalize(this.name, true)
      this.surname = capitalize(this.surname, true)

      this.isCheckingStep = true

      try {
        let response = await getDelegate(this.cf, this.taxCode)
        let delegate = response.data
        //Verifichiamo che non sia un nuovo utente maggiorenne
        let delegation = delegate.deleghe[0]
        let grownChildDeclaration= isGrownChildDelegator(delegation)
        if(!grownChildDeclaration){
          // Se siamo qui => l'utente ha già delegato la persona con questo codice fiscale
          // perciò avvisiamo l'utente
          this.delegateDuplicated = delegate
          this.isDelegateDuplicateModalVisible = true
          return
        }

      } catch (e) {
        // Se mpm so tratta di un 404 => si è verificato uno strano errore
            if (!isStatusIn(e, 404, 404)) {
              apiErrorNotify('Non è stato possibile controllare se hai già delegato questa persona, per favore riprova')
              return
            }

        // Si è verificato un 404 => tutto normale, l'utente non ha già delegato questo cittadino
        // perciò lo facciamo proseguire nello stepper

      }finally {
        this.isCheckingStep = false
      }
      if (this.hasWarningStep1) {
        this.showWarningAlertStep1 = true
        return
      }
      this.goToStep2()

    },
    isStep1Valid(){
      this.$refs.formDelegator.$v.$touch();
      return !this.$refs.formDelegator.$v.$error;
    },
    onStep() {
      this.showWarningAlertStep1 = false
    },
    onNextStep2() {
      // L'utente non può andare avanti senza aver attivato almeno una delega

      if (!this.areDelegationsActive) {
        let message= 'Attiva almeno una delega prima di proseguire'
        apiErrorNotify({message})
        return
      }

      this.newDelegations = this.activeDelegations.filter(delegation =>  !isFseCodes(delegation.codice_servizio))

      this.$refs.stepper.next()

    },
    goToStep1(){
      this.currentStep = STEPS.DELEGATE
    },
    returnToStep2(){
      if(this.areDelegationsActive){
        this.delegations = this.delegations.map(delegation => {
          let activeDelegation = this.activeDelegations.find(d => d.codice_servizio === delegation.codice_servizio)

          if(activeDelegation){
            delegation.info_attivazione= JSON.parse(JSON.stringify(activeDelegation))
          }else{
            delegation.info_attivazione= buildDefaultDelegation(delegation)
          }
          return delegation
        })

        this.delegations = deepClone(this.delegations)

      }
      this.newDelegations=[]
      this.activeDelegations = []
      this.currentStep = STEPS.SERVICES
    },
    goToStep2() {
      if (!this.isStep1Valid()) return
      this.currentStep = STEPS.SERVICES
    },
    getServiceName(service) {
      return service?.applicazione?.descrizione ?? ''
    },
    async onConfirm() {
      if (!this.hasAcceptedPolicy) {
        let message=`Non puoi andare avanti senza accettare l'informativa`
        apiErrorNotify({message})
        return
      }
      let birthDate = this.birthDate ? date.formatDate(this.timeStampBirthDate, 'YYYY-MM-DD') : null


      let data = [
        {
          codice_fiscale_delega: this.taxCode,
          nome_delega: this.name,
          cognome_delega: this.surname,
          data_nascita_delega: birthDate,
          luogo_nascita_delega: this.birthPlace,
          sesso_delega: this.gender,
          deleghe: this.activeDelegations.map(d => {
            return {
              codice_servizio: d.codice_servizio,
              data_inizio_delega: date.formatDate(d.data_inizio_delega, 'YYYY-MM-DD'),
              data_fine_delega: date.formatDate(d.data_fine_delega, 'YYYY-MM-DD'),
              stato_delega: DELEGATION_STATUS_MAP.ACTIVE,
              tipo_delega: DELEGATION_TYPE_CODES.ADULT,
              grado_delega: d.grado_delega,
            }
          }),
        }
      ];
      try {
        this.isSavingDelegate = true
        let response = await saveDelegate(this.cf, data);
        this.$refs.stepper.next();
      } catch (e) {
        apiErrorNotify({error: e, message: "Non è stato possibile salvare la delega"})
      }

      this.isSavingDelegate = false
    },
    goToDelegateDetail() {
      this.isDelegateDuplicateModalVisible = false
      let name = DELEGATE_EDIT.name
      let params = {delegateUuid: this.delegateDuplicated?.uuid, delegate:  this.delegateDuplicated}
      this.$router.push({name, params})
    },
    onChangeDelegation(params){
     if(params?.stato_delega == DELEGATION_STATUS_MAP.ACTIVE){
       let selectedDelegation = this.activeDelegations.find(delegation => delegation?.codice_servizio === params.codice_servizio)
       if(selectedDelegation){
         let index = this.activeDelegations.indexOf(selectedDelegation)
         this.activeDelegations[index] = params
       }else{
         this.activeDelegations.push(params)
       }
     }else{
       this.activeDelegations =  this.activeDelegations.filter(delegation =>
         delegation.codice_servizio !== params.codice_servizio)
     }
    },

    onActiveWeak(val){
     this.activeFseWeak = val
   },
    goTonewDelegation(){
      this.activeDelegations =[]
      this.name=''
      this.surname= ''
      this.birthDate= ''
      this.taxCode=''
      this.gender=''
      this.activeFseWeak=false
      this.newDelegations=[]
      this.currentStep = STEPS.DELEGATE

      //this.$router.push(DELEGATE_NEW)


    }

  },
}
</script>

<style scoped>

</style>
