<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>

  <div>
    <q-card
      class="q-mt-md">

      <!-- BARRE COLORATE -->
      <div v-if="atLeastOne"
           class="q-py-sm q-px-md bg-green-2">
        <div class="row-auto">
          <div v-if="isRegional || isDetail">
            {{$config.consents.reverseAvailableStatuses.A}}
          </div>
          <div v-if="isRegional===false && isDetail===false"> {{$config.consents.reverseAvailableStatuses.A}} (per
            {{activatedCounter}} Asr su {{totalAsrCounter}})
          </div>
        </div>
      </div>

      <div v-if="isRevoked"
           class="q-py-sm q-px-md bg-red-2">
        <div class="row-auto">
          <div>
            {{$config.consents.reverseAvailableStatuses.R}}
          </div>
        </div>
      </div>

      <div v-if="notExpressed"
           class="q-py-sm q-px-md bg-grey-2">
        <div class="row-auto">
          <div>
            {{$config.consents.reverseAvailableStatuses.N}}
          </div>
        </div>
      </div>

      <!-- TITOLO -->
      <div class="q-pl-md q-pt-md csi-h4">
        <strong>{{consentInfo.informativa.sotto_tipo_consenso.descrizione}} </strong>
      </div>

      <!-- DATA ACQUISIZIONE -->
      <div v-if="consentInfo.informativa.data_decorrenza" class="q-pl-md q-body-1">
        Data decorrenza: {{consentInfo.informativa.data_decorrenza | format}}
      </div>

      <!-- ABSTRACT -->
      <div class="q-pa-md q-pt-lg " v-if="!consentInfo.informativa.desc_informativa">Testo assente
      </div>

      <div v-else class="q-pa-md q-pt-lg ">{{consentInfo.informativa.desc_informativa}}
      </div>

      <q-item-separator v-if="isDetail" class="q-mx-md"/>

      <!-- MODALE INFORMATIVA -->
      <div class="q-pa-md ">

        <!-- selezione asr e validità consenso -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <template v-if="isDetail">

          <!-- REGIONALE -->
          <div v-if="isRegional" class="q-mt-lg">
            <p>Questo consenso ha validità a livello regionale verrà applicata la scelta per tutte le aziende
              sanitarie</p>
            <div class="row">
              <div class="col-12 ">


                <q-radio class=" q-ma-xs q-pa-sm col-auto"
                         :val="$config.consents.availableStatuses.ACTIVATED" v-model="statusValue"
                         label="Acconsento"></q-radio>


                <q-radio class=" q-ma-xs q-pa-sm col-auto"
                         :val="$config.consents.availableStatuses.REVOKED" v-model="statusValue"
                         label="Non acconsento"></q-radio>


                <q-radio v-if="consentInfo.consensi[0].tipo_stato.codice==='NON ESPRESSO'"
                         class=" q-ma-xs q-pa-sm col-auto"
                         :val="$config.consents.availableStatuses.NOT_EXPRESSED" v-model="statusValue"
                         label="Non mi esprimo"></q-radio>

              </div>

            </div>
          </div>

          <!-- Consensi aziendali -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <div v-else>

            <div
              class=" q-mt-md">
              <p>Scegli per quali aziende sanitarie piemontesi conferire o negare il consenso</p>

              <q-btn-group class=" q-mb-md">
                <q-btn label="Acconsento per tutte" v-if="asrSelected===true" icon="check" @click="checkAll"/>
                <q-btn label="Acconsento per tutte" v-else @click="checkAll"/>
                <q-btn label="Nego per tutte" v-if="asrSelected===false" icon="check" @click="uncheckAll"/>
                <q-btn label="Nego per tutte" v-else @click="uncheckAll"/>
              </q-btn-group>


              <div class="row q-pb-md gutter-sm">
                <div v-for="(consensoAsr, index) in asrList"
                     :key="index"
                     :item="consensoAsr"
                     class="col-12 col-sm-6 col-md-4 col-lg-2 "
                >
                  <div class="row">
                    <div class="col-auto">
                      <q-checkbox
                        class="q-mr-md "
                        :value="asrModels[index]"
                        v-model="asrModels[index]"
                        :color="$config.consents.color[asrModels[index]]"
                        keep-color
                        :toggle-indeterminate="canHave3States(consensoAsr)"
                        :id="index"
                        @input="setAsrModels($event, asrModels[index])"
                        unchecked-icon="mdi-close-box"
                        indeterminate-icon="check_box_outline_blank"
                        :true-value="$config.consents.availableStatuses.ACTIVATED"
                        :false-value="$config.consents.availableStatuses.REVOKED"
                        :indeterminate-value="$config.consents.availableStatuses.NOT_EXPRESSED"
                      >


                      </q-checkbox>
                    </div>
                    <div class="col">

                      <div>
                        {{consensoAsr.asr.descrizione}}
                        <div class="q-body-1"
                             :class="'text-'+$config.consents.color[asrModels[index]]"
                             :for="index">
                          <div v-if="asrModels[index]==='NON ESPRESSO'">Non espresso</div>
                          <div v-else>{{$config.consents.reverseAvailableStatuses[asrModels[index]] }}</div>
                        </div>
                      </div>

                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>

        </template>

        <!-- informativa completa -->
        <!-- ------------------------------------------------------------------------------------------------------- -->

        <template v-if="isDetail">
          <csi-policy  class="q-pt-md">
            <template slot="text">
              <div v-html="html"></div>
            </template>
          </csi-policy>
        </template>

        <!-- presa visione -->
        <!-- ------------------------------------------------------------------------------------------------------- -->

        <div v-if="isDetail" class="q-mt-xl">
          <q-toggle v-model="wasRead" label="Dichiaro di avere letto ed accettato l'informativa"></q-toggle>
        </div>

        <!--scarica-->
        <!--per ora non previsto-->
<!--        <div v-if="isDetail" onclick="download()" class="q-mt-xl">-->
<!--          <q-btn label="Scarica pdf"></q-btn>-->
<!--        </div>-->

        <!-- PULSANTE GESTISCI -->
        <div v-if="!isDetail">
          <div class="row">

            <a href="#" class="q-pt-lg col-12 col-md" @click.prevent.stop="openModal()">Informativa completa</a>

            <csi-buttons class="q-mt-md col-12 col-md ">
              <csi-button v-if="!isDetail" @click="$emit('handle', consentInfo)">Gestisci
              </csi-button>
            </csi-buttons>

          </div>
        </div>

        <!-- PULSANTI SALVA E ESCI -->
        <csi-buttons class="q-mt-md col-6">
          <csi-button v-if="isDetail" :loading="isSaving" @click="goToSuccess(consentInfo)">Salva</csi-button>
          <!--<csi-button secondary v-if="isDetail" @click="$router.push($routes.CONSENTS.HOME)">Indietro</csi-button> -->
          <csi-button secondary v-if="isDetail" @click="$router.push($routes.GLOBAL.USER_CONSENTS)">Indietro</csi-button>
        </csi-buttons>

      </div>
    </q-card>

    <!-- MODALE INFORMATIVA -->
    <q-modal v-model="isModalOpened" :content-css="{maxWidth: '800px'}">

      <q-modal-layout class="bg-grey-2">

        <q-toolbar slot="header">
          <q-toolbar-title>
            Testo integrale
          </q-toolbar-title>
          <q-btn flat round icon="close" v-close-overlay></q-btn>
        </q-toolbar>

        <div class="q-pa-md">
          <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <csi-policy >
              <template slot="text">
                <div v-html="html"></div>
              </template>
            </csi-policy>
          </transition>
        </div>
      </q-modal-layout>
    </q-modal>

  </div>
</template>

<script>
    import CsiPolicy from "components/global/common/CsiPolicy";

    import {taxCode} from "@validators/taxCode";
    import {editConsent, getInformativaPdf, getHTMLInformativa} from "@services/api/consents";
    import {createConsent} from "@services/api/consents";
    import {notifyError} from "@services/api/utils";

    export default {
        name: "CsiConsentsListItem",
        components: {CsiPolicy},
        props: {
            consentInfo: {type: Object, required: true,},
            isDetail: {type: Boolean, required: false, default: false}
        },

        data() {


            return {

                isModalOpened: false,
                statusValue: null,
                wasRead: false,
                UnexpressedAsr: [],
                trueOnce: [],
                consentList: [],
                active: [],
                atLeastOne: false,
                isRevoked: false,
                notExpressed: false,
                totalAsrCounter: 0,
                activatedCounter: 0,
                asrModels: [],
                notChangedConsent: 0,
                controlStateRegional: null,
                isSaving: false,
                html: null
            }
        },

        computed: {
            taxCode() {
                return this.$store.getters['consents/getTaxCode']
            },

            user() {
                return this.$store.getters['global/user']
            },

            asrSelected() {

            },
            asrActiveCounter() {
                for (let i = 0; i < this.consentInfo.consensi.length; i++) {
                    if (this.consentInfo.consensi[i].tipo_stato.codice === 'A')
                        this.active.push(this.consentInfo.consensi[i])
                }

            },

            asrList() {
                return this.consentInfo.consensi;
            },

            isRegional() {
                return this.consentInfo.informativa.tipo_consenso.codice === this.$config.consents.types.REGIONAL;
            },
        },

        async created() {

            let htmlPromise = await getHTMLInformativa(
                this.consentInfo.informativa.tipo_consenso.codice,
                this.consentInfo.informativa.sotto_tipo_consenso.codice)

             this.html= htmlPromise.data



            //selezione di partenza per regionali
            if (this.consentInfo.informativa.tipo_consenso.codice === 'R') {


                if (this.consentInfo.consensi[0].tipo_stato) {
                    this.controlStateRegional = this.consentInfo.consensi[0].tipo_stato.codice
                    if (this.consentInfo.consensi[0].tipo_stato.codice === 'R') {
                        this.statusValue = this.$config.consents.availableStatuses.REVOKED
                    }
                    if (this.consentInfo.consensi[0].tipo_stato.codice === 'A') {
                        this.statusValue = this.$config.consents.availableStatuses.ACTIVATED
                    }
                } else {

                    this.statusValue = this.$config.consents.availableStatuses.NOT_EXPRESSED
                }
            }
            //this.statusValue = this.$config.consents.availableStatuses.ACTIVATED;


            //barre colorate con stato
            let revokedCounter = 0
            for (let i = 0; i < this.consentInfo.consensi.length; i++) {
                this.totalAsrCounter++;
                if (this.consentInfo.consensi[i].tipo_stato.codice === this.$config.consents.availableStatuses.ACTIVATED) {
                    this.atLeastOne = true;
                    this.activatedCounter++;
                }
                if (this.consentInfo.consensi[i].tipo_stato.codice === this.$config.consents.availableStatuses.REVOKED) {
                    revokedCounter++;
                    if (revokedCounter === this.consentInfo.consensi.length)
                        this.isRevoked = true;
                }
            }
            if (revokedCounter === 0 && this.atLeastOne === false) {
                this.notExpressed = true
            }

            // stato partenza di asr per aziendale  (MA PER NON ESPRESSO AZIENDALE??)
            for (let i = 0; i < this.consentInfo.consensi.length; i++) {
                this.asrModels.push(this.consentInfo.consensi[i].tipo_stato.codice)
            }

            //controlli per i NON ESPRESSI

            //qui è dove setto a N i model che prendono valore A per motivi che non capisco...
            //if (this.consent.consensi[i].tipo_stato.descrizione === 'NON ESPRESSO') {
            //    this.consent.consensi[i].tipo_stato.codice = 'NON ESPRESSO';

            // }

            // this.trueOnce.push(this.consent.consensi_asr[i]);

            //  if (this.trueOnce[i].valore_consenso.codice === 'N') {
            //      this.trueOnce[i] = 0;
            //  }
            //}
            // this.UnexpressedAsr = this.consent.consensi_asr
            //  .filter(a => a.valore_consenso.codice === 'N')
            //  .map(a => ({codice: a.valore_consenso.codice}));

        },
        methods: {

            //salva e continua
            async goToSuccess(item) {

                this.isSaving = true;
                if (this.wasRead) {
                    let testAsr = {codice: "999", descrizione: "ASR fittizia per gestire il consenso Regionale"}
                    //put regionale OK
                    if (item.informativa.tipo_consenso.codice === 'R') {



                        //put o post regionale che fa stessa azione
                        if (this.controlStateRegional === this.statusValue) {

                            //let id_informativa = item.informativa.id_informativa
                            //let params = {id: id_informativa, singleConsent: item};
                            //let route = {name: this.$routes.CONSENTS.CONSENT_SUCCESS.name, params};
                            //this.$router.push(route);
                            this.$q.notify('Non è stata apportata alcuna modifica al consenso');
                            this.isSaving = false;


                        } else {


                            if (item.consensi[0].tipo_stato.codice !== "NON ESPRESSO") {
                                let newConsent = item.consensi[0]
                                newConsent.data_acquisizione = new Date().toISOString().split('T')[0];
                                newConsent.tipo_stato.codice = this.statusValue

                                if (newConsent.tipo_stato.codice === 'A') {
                                    newConsent.tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.A
                                    newConsent.valore_consenso = {codice: 'SI', descrizione: 'SI'}
                                }

                                if (newConsent.tipo_stato.codice === 'R') {
                                    newConsent.tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.R
                                    newConsent.valore_consenso = {codice: 'NO', descrizione: 'NO'}
                                }

                                if (newConsent.tipo_stato.codice === 'NON ESPRESSO') {
                                    newConsent.tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.N
                                    newConsent.valore_consenso = null
                                    //prova

                                }

                                //questo forse si può togliere visto che il dato lo passa egidio

                                //newConsent.asr = testAsr

                                //let uuid = newConsent.uuid
                                let id_informativa = item.informativa.id_informativa
                                let id_asl = newConsent.asr.codice
                                let payload = newConsent

                                try {

                                    let response = await editConsent(this.user.cf, id_informativa, id_asl, payload, {_no5XXRedirect: true})


                                    let params = {id: id_informativa, singleConsent: item};
                                    //let route = {name: this.$routes.CONSENTS.CONSENT_SUCCESS.name, params};
                                    let route = {name: this.$routes.GLOBAL.USER_CONSENT_SUCCESS.name, params};
                                    this.$router.push(route);
                                } catch (e) {
                                    notifyError(e, "Non è stato possibile modificre il consenso")

                                    this.$router.back();
                                }
                            } else {
                                //post regionale OK
                                if (item.consensi[0].tipo_stato.codice === "NON ESPRESSO") {
                                    let newConsent = item.consensi[0]
                                    newConsent.nome = this.user.nome
                                    newConsent.cognome = this.user.cognome
                                    //newConsent.uuid = uuidGenerato?
                                    newConsent.data_acquisizione = new Date().toISOString().split('T')[0];
                                    newConsent.tipo_stato.codice = this.statusValue

                                    if (newConsent.tipo_stato.codice === 'A') {
                                        newConsent.tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.A
                                        newConsent.valore_consenso = {codice: 'SI', descrizione: 'SI'}
                                    }

                                    if (newConsent.tipo_stato.codice === 'R') {
                                        newConsent.tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.R
                                        newConsent.valore_consenso = {codice: 'NO', descrizione: 'NO'}
                                    }

                                    if (newConsent.tipo_stato.codice === 'NON ESPRESSO') {
                                        newConsent.tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.N
                                        newConsent.valore_consenso = null
                                    }
                                    //lo mette egidio, non serve
                                    //newConsent.asr = testAsr
                                    //let uuid=uuidGenerato
                                    try {
                                        let payload = newConsent


                                        let response = await createConsent(this.user.cf, payload, {_no5XXRedirect: true})

                                        let params = {id: item.informativa.id_informativa, singleConsent: item};
                                        //let route = {name: this.$routes.CONSENTS.CONSENT_SUCCESS.name, params};
                                        let route = {name: this.$routes.GLOBAL.USER_CONSENT_SUCCESS.name, params};
                                        this.$router.push(route);
                                    } catch (e) {
                                        notifyError(e, "Non è stato possibile modificre il consenso")
                                        this.$router.back();
                                    }

                                }

                            }
                        }
                    } else {

                        let newConsent = item.consensi

                        let responsePromises = []
                        //const callApi = async () =>{ return 'dummy'}

                        for (let i = 0; i < newConsent.length; i++) {

                            if (item.consensi[i].tipo_stato.codice === this.asrModels[i]) {

                                this.notChangedConsent = this.notChangedConsent + 1
                                //let id_informativa = item.informativa.id_informativa
                                //let params = {id: id_informativa, singleConsent: item};
                                //let route = {name: this.$routes.CONSENTS.CONSENT_SUCCESS.name, params};
                                //this.$router.push(route);
                            } else {
                                //post aziendale OK
                                if (item.consensi[i].tipo_stato.codice === "NON ESPRESSO") {

                                    newConsent[i].tipo_stato.codice = this.asrModels[i]

                                    newConsent[i].data_acquisizione = new Date().toISOString().split('T')[0];

                                    if (newConsent[i].tipo_stato.codice === 'A') {
                                        newConsent[i].tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.A
                                        newConsent[i].valore_consenso = {codice: 'SI', descrizione: 'SI'}
                                    }

                                    if (newConsent[i].tipo_stato.codice === 'R') {
                                        newConsent[i].tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.R
                                        newConsent[i].valore_consenso = {codice: 'NO', descrizione: 'NO'}
                                    }

                                    if (newConsent[i].tipo_stato.codice === 'NON ESPRESSO') {
                                        newConsent[i].tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.N
                                        newConsent[i].valore_consenso = null
                                        newConsent[i].asr = testAsr
                                    }

                                    if (newConsent[i].tipo_stato.codice !== 'NON ESPRESSO') {
                                        newConsent[i].nome = this.user.nome
                                        newConsent[i].cognome = this.user.cognome
                                        //newConsent.uuid = uuidGenerato?
                                        //newConsent[i].data_acquisizione = new Date().toISOString().split('T')[0];
                                        //newConsent[i].tipo_stato.codice = this.statusValue


                                        let payload = newConsent[i]



                                        //let response = await createConsent(this.user.cf, payload)
                                        responsePromises.push({
                                            asr: i,
                                            promise: createConsent(this.user.cf, payload, {_no5XXRedirect: true})
                                        })


                                    }


                                }
                                //put aziendale OK
                                else {
                                    newConsent[i].tipo_stato.codice = this.asrModels[i]
                                    newConsent[i].data_acquisizione = new Date().toISOString().split('T')[0];

                                    if (newConsent[i].tipo_stato.codice === 'A') {
                                        newConsent[i].tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.A
                                        newConsent[i].valore_consenso.codice = 'SI'
                                        newConsent[i].valore_consenso.descrizione = 'SI'
                                    }

                                    if (newConsent[i].tipo_stato.codice === 'R') {
                                        newConsent[i].tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.R
                                        newConsent[i].valore_consenso.codice = 'NO'
                                        newConsent[i].valore_consenso.descrizione = 'NO'
                                    }

                                    if (newConsent[i].tipo_stato.codice === 'NON ESPRESSO') {
                                        newConsent[i].tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.N
                                        newConsent[i].valore_consenso = null
                                    }
                                    //let uuid = newConsent[i].uuid

                                    let id_informativa = item.informativa.id_informativa
                                    let id_asl = newConsent[i].asr.codice
                                    let payload = newConsent[i]



                                    //let response = await editConsent(this.user.cf, id_informativa, id_asl, payload)
                                    responsePromises.push({
                                        asr: newConsent[i].asr.descrizione,
                                        promise: editConsent(this.user.cf, id_informativa, id_asl, payload, {_no5XXRedirect: true})
                                    })

                                }

                            }

                        }

                        if (responsePromises.length <= 0) {
                            this.$q.notify("Non è stata apportata alcuna modifica al consenso");
                            this.isSaving = false;
                        } else {
                            let successResponses = []
                            let errorResponses = []
                            for (const p of responsePromises) {
                                try {
                                    let r = await p.promise
                                    successResponses.push({asr: p.asr, response: r})

                                } catch (e) {
                                    errorResponses.push({asr: p.asr, error: e})

                                }
                            }

                            if (errorResponses.length > 0) {
                                // Ci sono stati errori => dobbiamo notificare l'utente
                                let asrs = errorResponses.map(e => e.asr).join(', ')

                                let message = `Non è stato possibile salvare le modifiche per le seguenti ASL: ${asrs}`
                                // notify(messsage)
                                this.$q.notify(message);

                            }
                            //let responses= await Promise.all(responsePromises)
                            let params = {id: item.informativa.id_informativa, singleConsent: item};
                            //let route = {name: this.$routes.CONSENTS.CONSENT_SUCCESS.name, params};
                            let route = {name: this.$routes.GLOBAL.USER_CONSENT_SUCCESS.name, params};
                            this.$router.push(route);
                        }
                        this.isSaving = false;

                    }

                } else {
                    this.$q.notify("Dichiara di avere letto l'informativa");
                    this.isSaving = false;
                }
            },

            async download() {
                let user = this.$store.getters['global/user'];
                let pdf = await getInformativaPdf(user.cf,
                    this.consentInfo.informativa.tipo_consenso.codice,
                    this.consentInfo.informativa.sotto_tipo_consenso.codice, config);
            },

            openModal() {
                this.isModalOpened = true;
            },

            setAsrModels(value, asrModel) {

                //this.$forceUpdate();
            },
            //controllo 3 stati
            canHave3States(asr) {
                return asr.tipo_stato.codice === 'NON ESPRESSO';
            },

            //acconsenti o revoca per tutte le asr
            checkAll() {
                for (let i = 0; i < this.asrModels.length; i++) {
                    this.asrModels[i] = 'A'
                }
                this.$forceUpdate();

            },

            uncheckAll() {
                for (let i = 0; i < this.asrModels.length; i++) {
                    this.asrModels[i] = 'R'
                }
                this.$forceUpdate();

            }
        },

    }

</script>

<style scoped>

</style>
