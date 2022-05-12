<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
<lms-page padding>
  <div v-if="!isLoading">
    <lms-page-title>Gestisci delegato</lms-page-title>

    <q-card class="q-mt-md">
      <lms-card-item-bar type="negative" v-if="showSaveBanner">
      <q-icon name="warning" size="sm" class="q-mr-sm"/> Ricordati di salvare le modifiche effettuate
      </lms-card-item-bar>

      <!-- DELEGATO & LINK STORICO -->
      <!-- ------------------------------------------------------------------------------------------------------- -->
      <q-card-section >
        <q-item class="no-padding">
          <q-item-section avatar>
            <q-icon size="lg" :name="avatarIcon" />
          </q-item-section>

          <q-item-section class="text-weight-bold">
            <q-item-label>{{fullName | startCase}}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon
              color="grey-7"
              size="sm"
              name="more_vert"
              class="cursor-pointer"
            >
              <q-menu auto-close>
                <q-list>
                  <q-item clickable @click="goToHistory()">
                    <q-item-section>Storico delegato</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-item-section>
        </q-item>
        <q-separator  spaced="lg"></q-separator>
      </q-card-section >

      <q-card-section class="q-px-none">
        <lms-delegation-list
          :delegations="editableDelegations"
          @on-active-delegations="onChangeDelegation"
          @is-fse-weak="onActiveWeak"
        />

      </q-card-section>
      <q-card-actions class="q-pa-md" align="right">
        <lms-buttons >
          <lms-button
            label="Salva"
            :disable="!areDelegationsValid"
            :loading="isSaving"
            @click="saveDelegations()"
          />
        </lms-buttons>
      </q-card-actions>


    </q-card>
  </div>

  <!-- LOADER -->
  <!-- ----------------------------------------------------------------------------------------------------------- -->
  <lms-inner-loading :showing="isLoading"/>


</lms-page>
</template>

<script>
import {
  deepClone,
  equalsIgnoreCase,
  getResponseStatusCode,
  isEmpty,
  orderBy,
  unionBy
} from "src/services/utils";
import LmsDelegationItemEdit from "components/LmsDelegationItemEdit";
import {
  buildDefaultDelegation, getAvatarIcon,
  getDelegationDaysInterval, getFseCode,
  getLastDelegations, getServiceName, getServiceWithFseCodes,
  isDelegationValid
} from "src/services/business-logic";
import {editDelegate, getDelegates} from "src/services/api";
import {DELEGATE_HISTORY, DELEGATE_LIST} from "src/router/routes";
import {date} from "quasar";
import {
  DECLARATION_VALID_STATUS,
  DELEGATION_RANK_CODES,
  DELEGATION_STATUS_MAP,
  DELEGATION_TYPE_CODES, FSE_CODES, FSE_CODES_LIST,
  FSE_CODES_MATCH
} from "src/services/config";
import LmsDelegationList from "components/LmsDelegationList";
import LmsCardItemBar from "components/core/LmsCardItemBar";

export default {
  name: "PageDelegateEdit",
  components: {LmsCardItemBar, LmsDelegationList},
  data() {
    return {
      isLoading: false,
      delegate: {},
      editableDelegations: [],
      areDelegationsValid: true,
      isSaving: false,
      areDelegationsActive:false,
      newDelegations:[],
      activeFseWeak:false,
      showSaveBanner:false,
    }
  },
  computed: {
    taxCode(){
      return this.$store.getters["getTaxCode"];
    },
    appList(){
      return this.$store.getters['getAppList']
    },
    delegableAppServices() {
      return this.$store.getters['delegableAppServices'];
    },
    delegations() {
      return this.delegate?.deleghe ? orderBy(this.delegate.deleghe, ['codice_servizio']) : []
    },
    lastDelegations() {
      if (!this.delegations) return
      return getLastDelegations(this.delegations)
    },
    fullName() {
      return `${this.delegate.nome_delega} ${this.delegate.cognome_delega}`
    },
    avatarIcon(){
      return getAvatarIcon(this.delegate?.sesso_delega)
    }

  },

  async created() {

    let {delegateUuid, delegate} = this.$route.params;

    // se non ci è stato passato il delegato => lo otteniamo dal server
    if (!delegate) {
      this.isLoading = true;
      // Anzichè prendere il singolo delegato prendiamo la lista dei delegati e poi filtriamo per ottenere il singolo delegato
      let response = await getDelegates(this.taxCode)
      delegate = response.data.find(d => d.uuid === delegateUuid)
      if (!delegate) {
        console.error('Il delegato non esiste... probabilmente la URL è stata inserita manualmente ed è presente un errore nel CF del delegato')
      }
      this.isLoading = false;
    }

    this.delegate = delegate;

    this.getDelegationsInfo()

  },
  methods: {
    isEmpty,
    onChangeDelegation(params){
      let selectedDelegation = this.newDelegations.find(delegation => delegation?.codice_servizio === params.codice_servizio)
      if(selectedDelegation){
        let index = this.newDelegations.indexOf(selectedDelegation)
        this.newDelegations[index] = params
      }else{
        this.newDelegations.push(params)
      }

       this.showSaveBanner= this.verifyIsChangeObjects()
    },
    verifyIsChangeObjects(){
      let changesDelegations= []
      this.editableDelegations.forEach(delegation =>{
        let delegationInfo = delegation.info_attivazione
        let sameDelegation = this.newDelegations.find(d =>
          d.codice_servizio === delegationInfo.codice_servizio &&
          d.stato_delega === delegationInfo.stato_delega &&
          d.grado_delega === delegationInfo.grado_delega
        )
        if(sameDelegation) changesDelegations.push(sameDelegation)
      })
      return changesDelegations.length < this.editableDelegations.length
    },
    getDelegationsInfo(){
      let appServices = deepClone(this.delegableAppServices)
      let editableDelegations = appServices.map(delegable =>{
        let activeDelegation= this.delegations.find(d => d.codice_servizio === delegable.codice_servizio)

        if(activeDelegation){
          delegable.info_attivazione= activeDelegation
        }else{
          delegable.info_attivazione= buildDefaultDelegation(delegable)
        }
        return delegable
      })
      this.editableDelegations = deepClone(editableDelegations)
    },
    sortDelegations(delegations){
      delegations.sort((a, b) => {
        a = getServiceName(a.codice_servizio);
        b = getServiceName(b.codice_servizio);
        return a > b ? 1 : -1
      });
      return delegations
    },

    goToHistory() {
      let route = DELEGATE_HISTORY
      let params = {delegateUuid: this.delegate.uuid, delegate: this.delegate}
      this.$router.push({name: route.name, params})
    },

    async saveDelegations() {
      this.isSaving = true
      let delegateCf = this.delegate.codice_fiscale_delega
      let data = JSON.parse(JSON.stringify(this.delegate))

      // Per il momento ogni volta che viene attivata la delega debole su tutto passiamo anche delega debole
      // di FSEPREV E eFSEESE - da gestire in modo diverso più avanti

      FSE_CODES_MATCH.forEach(fseService => {
          let selectedDelegation = this.newDelegations.find(delegation =>
            delegation?.codice_servizio === fseService[0] && DECLARATION_VALID_STATUS.includes(delegation?.stato_delega))

          if (!selectedDelegation) {
            let fseDelegation = this.newDelegations.find(delegation => delegation?.codice_servizio === fseService[1])
            let index = this.newDelegations.indexOf(fseDelegation)
            let fseNewService = this.newDelegations[index]
            if(this.activeFseWeak){
              fseNewService.grado_delega = DELEGATION_RANK_CODES.WEAK
              fseNewService.stato_delega = DELEGATION_STATUS_MAP.ACTIVE
            }else{
              fseNewService.grado_delega = null
              fseNewService.stato_delega = DELEGATION_STATUS_MAP.REVOKED
            }

          }
        })

      this.newDelegations.forEach(nd => {

        delete  nd.delega_descrizione
        let initialDelegation = this.delegations.find(d => d.codice_servizio === nd.codice_servizio )

        let isActive = isDelegationValid(nd.stato_delega)

        // se si tratta di una nuova delega mai attivata che non è stata modificata
        // => non facciamo nulla
        if (!initialDelegation &&
          ([DELEGATION_STATUS_MAP.NOT_ACTIVE].includes(nd.stato_delega) ||
            [DELEGATION_STATUS_MAP.REVOKED].includes(nd.stato_delega))){
          return
        }

        // Se si tratta di una nuova delega => la aggiungiamo solo se lo stato è attivo
        if (!initialDelegation && isActive) {
          data.deleghe.push(nd)
          return
        }

        // se lo stato non è cambiato => se la delega era attiva controllo se l'utente ha modificato la data di fine
        // altrimenti non faccio nulla

        if (initialDelegation.stato_delega === nd.stato_delega) {
          if (isActive) {

            data.deleghe = data.deleghe.map(d => d.uuid === initialDelegation.uuid ? nd : d);

          } else {
            console.debug('La delega non è attiva => mantengo la delega iniziale')
          }
          return
        }



        // se lo stato è cambiato ed è passato da "scaduta" o "revocata" o "rifiutata" ad "attiva"
        // => rimuoviamo le date di revoca e rinuncia e rimpiazziamo la delega iniziale con quella nuova
        if ([DELEGATION_STATUS_MAP.EXPIRED, DELEGATION_STATUS_MAP.REVOKED, DELEGATION_STATUS_MAP.REFUSED].includes(initialDelegation.stato_delega) && isActive) {
          delete nd.data_revoca_delega
          delete nd.data_rinuncia_delega
          console.debug('Delega riattivata:', nd)
          data.deleghe = data.deleghe.map(d => d.uuid === initialDelegation.uuid ? nd : d);
          return
        }

        // se lo stato è cambiato ed è passato da "attiva" o "in sacendza" a "revocata"
        // => inseriamo la nuova delega al posto di quella iniziale
        if (isDelegationValid(initialDelegation.stato_delega) && [DELEGATION_STATUS_MAP.REVOKED].includes(nd.stato_delega)) {
          let index = data.deleghe.findIndex(d => d.uuid === nd.uuid)
          nd.data_revoca_delega= new Date()
          data.deleghe[index] = nd
          return
        }

      });


      try {
         let response = await editDelegate(this.taxCode, delegateCf, data, {_no5XXRedirect: true});
        this.delegate = response.data;
        this.getDelegationsInfo()
        this.$q.notify({
          type: 'positive',
          message: 'Deleghe modificate'
        })

        setTimeout(()=>{ this.$router.push(DELEGATE_LIST)}, 1500)

      } catch (e) {
        this.$q.notify({
          type: 'negative',
          message: `[${getResponseStatusCode(e)}] Non è stato possibile modificare le deleghe`
        })
      }

      this.isSaving = false
    },
    onActiveWeak(val){
      this.activeFseWeak=val
    }



  }
}
</script>

<style scoped>

</style>
