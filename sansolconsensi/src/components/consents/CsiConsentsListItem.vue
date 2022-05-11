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
            {{activatedCounter}} Aziende su {{totalAsrCounter}})
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
<!--      <div v-if="consentInfo.informativa.data_decorrenza" class="q-pl-md q-body-1">-->
<!--        Data decorrenza: {{consentInfo.informativa.data_decorrenza | format}}-->
<!--      </div>-->

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


              <div class="col">
                <q-radio class=" q-ma-xs q-pa-sm col-auto"
                         :val="$config.consents.availableStatuses.ACTIVATED" v-model="statusValue"
                         label="Acconsento"></q-radio>

                <div class="q-mx-xs q-px-sm" v-if="consentInfo.consensi[0].tipo_stato.codice==='A'"><small>Attivo dal
                  {{consentInfo.consensi[0].data_acquisizione | format}}</small></div>
              </div>
              <div class="col">
                <q-radio class=" q-ma-xs q-pa-sm col-auto"
                         :val="$config.consents.availableStatuses.REVOKED" v-model="statusValue"
                         label="Non acconsento"></q-radio>

                <div class="  q-mx-xs q-px-sm" v-if="consentInfo.consensi[0].tipo_stato.codice==='R'"><small>Revocato
                  dal {{consentInfo.consensi[0].data_acquisizione | format}}</small></div>
              </div>

              <div class="col">
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
              <p>Scegli per quali aziende conferire o negare il consenso</p>

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
                     class="col-12 col-sm-6 col-md-4 col-lg-3 "
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
                        unchecked-icon="check_box"
                        indeterminate-icon="check_box_outline_blank"
                        checked-icon="mdi-close-box"
                        :true-value="$config.consents.availableStatuses.REVOKED"
                        :false-value="$config.consents.availableStatuses.ACTIVATED"
                        :indeterminate-value="$config.consents.availableStatuses.NOT_EXPRESSED"
                      >


                      </q-checkbox>
                    </div>

                    <div class="col">

                      <div>

                        <!--                        TOOLTIP DESCRIZIONE LIS E RIS-->

                        <div v-if="hasRisLis">
                          {{consensoAsr.asr.descrizione}}


                        </div>
                        <div v-else>
                          {{consensoAsr.asr.descrizione}}
                        </div>

                        <div class="row">
                          <div class="q-body-1"
                               :class="'text-'+$config.consents.color[asrModels[index]]"
                               :for="index">
                            <div v-if="asrModels[index]==='NON ESPRESSO'">Non espresso</div>
                            <div v-else>{{$config.consents.reverseAvailableStatuses[asrModels[index]] }}</div>
                          </div>

                          <!--                        ICONE CON VALORE STATO LIS E RIS SE PRESENTI LIS E RIS-->

                          <div class="q-ml-sm" v-if="hasRisLis && consensoAsr.tipo_stato.codice!=='NON ESPRESSO' ">

                            <q-icon
                              v-if="(consentInfo.stato_notifiche_dipartimentali.filter(a => a.uuid ===consensoAsr.uuid && a.stato_dipartimentale==='A')).length > 0"

                              @click.native="openLisRisModal(consensoAsr.uuid, consensoAsr.tipo_stato.codice)"
                              name="warning"
                              class="csi-icon--xs text-yellow note-info-icon cursor-pointer"
                            >
                            </q-icon>

                            <q-icon
                              v-else-if="(consentInfo.stato_notifiche_dipartimentali.filter(a => a.uuid ===consensoAsr.uuid)).length > 0"
                              @click.native="openLisRisModal(consensoAsr.uuid, consensoAsr.tipo_stato.codice)"
                              name="info"
                              class="csi-icon--xs text-green note-info-icon cursor-pointer"
                            >
                            </q-icon>
                            <q-icon v-else
                                    @click.native="openLisRisModal(consensoAsr.uuid, consensoAsr.tipo_stato.codice)"
                                    name="warning"
                                    class="csi-icon--xs text-red note-info-icon cursor-pointer"
                            ></q-icon>


                            <div class="q-ml-sm" v-if="noDataRisLis">
                              <q-icon
                                @click.native="openLisRisModal(consensoAsr.uuid, consensoAsr.tipo_stato.codice)"
                                name="warning"
                                class="csi-icon--xs text-red note-info-icon cursor-pointer"
                              >
                              </q-icon>
                            </div>

                          </div>
                        </div>
                        <div
                          v-if="asrModels[index]===consensoAsr.tipo_stato.codice && consensoAsr.tipo_stato.codice !=='NON ESPRESSO' "
                          class="q-body-1"><small>Dal {{consensoAsr.data_acquisizione | format}}</small></div>
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
          <csi-policy class="q-pt-md">
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

            <a href="#" class="q-pt-lg col-12 col-md csi-link" @click.prevent.stop="openModal()">Informativa completa</a>

            <csi-buttons class="q-mt-md col-12 col-md ">
              <csi-button v-if="!isDetail" @click="$emit('handle', consentInfo)">Gestisci
              </csi-button>
            </csi-buttons>

          </div>
        </div>

        <!-- PULSANTI SALVA E ESCI -->
        <csi-buttons class="q-mt-md col-6">
          <csi-button v-if="isDetail" :loading="isSaving" @click="goToSuccess(consentInfo)">Salva</csi-button>
          <csi-button secondary v-if="isDetail" @click="$router.push($routes.CONSENTS.HOME)">Indietro</csi-button>

        </csi-buttons>

      </div>
    </q-card>

    <!-- MODALE INFORMATIVA -->
    <q-modal v-model="isModalOpened" m :content-css="{maxWidth: '800px'}">

      <q-modal-layout class="bg-grey-2">

        <q-toolbar slot="header">
          <q-toolbar-title>
            Testo integrale
          </q-toolbar-title>
          <q-btn flat round icon="close" v-close-overlay></q-btn>
        </q-toolbar>

        <div class="q-pa-md">
          <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">

            <csi-policy  class="q-pt-md ":iframe-styles="{height: '100%'}">
              <template slot="text">
                <div v-html="html"></div>
              </template>
            </csi-policy>

          </transition>
        </div>
      </q-modal-layout>
    </q-modal>

    <!-- MODALE LIS E RIS -->
    <q-modal v-model="isRisLisModalOpened">

      <q-modal-layout class=" bg-grey-2">

        <q-toolbar slot="header">
          <q-toolbar-title>
            Stato consenso espresso
          </q-toolbar-title>
          <q-btn flat round icon="close" v-close-overlay></q-btn>
        </q-toolbar>

        <div class="q-ma-md">


          <q-list v-if="!noDataRisLis" bordered separator>

            <!--LIS o RIS-->
            <q-item v-if="dipartimentali.length===0">Non è stata trovata alcuna informazione sul consenso espresso per i
              dipartimentali
              relativi all'Azienda selezionata
            </q-item>
            <q-item v-if="dipartimentali[0] && dipartimentali[0].stato_dipartimentale==='A'">
              <div class="row">
                <div>{{dipartimentali[0].dipartimentale}} : &nbsp;</div>
                <div><strong> Attesa di registrazione da parte dell'azienda sanitaria</strong></div>
              </div>
            </q-item>

            <q-item v-if="dipartimentali[0] && dipartimentali[0].stato_dipartimentale==='C'">
              <div class="row">
                <div>{{dipartimentali[0].dipartimentale}} : &nbsp;</div>
                <div v-if="consentSelectedStatus===$config.consents.availableStatuses.ACTIVATED"><strong> Attivo</strong></div>
                <div v-if="consentSelectedStatus===$config.consents.availableStatuses.REVOKED"><strong> Revocato</strong></div>
              </div>
            </q-item>

            <!--            RIS o LIS-->
            <q-item v-if="dipartimentali[1] && dipartimentali[1].stato_dipartimentale==='A'">
              <div class="row">
                <div>
                  {{dipartimentali[1].dipartimentale}} : &nbsp;
                </div>
                <div>
                  <strong> Attesa di registrazione da parte dell'azienda sanitaria</strong></div>
              </div>
            </q-item>

            <q-item v-if="dipartimentali[1] && dipartimentali[1].stato_dipartimentale==='C'">
              <div class="row">
                <div>{{dipartimentali[1].dipartimentale}} : &nbsp;</div>
                <div v-if="consentSelectedStatus===$config.consents.availableStatuses.ACTIVATED"><strong> Attivo</strong></div>
                <div v-if="consentSelectedStatus===$config.consents.availableStatuses.REVOKED"><strong> Revocato</strong></div>
              </div>
            </q-item>


          </q-list>
          <div v-else>
            Non è stato momentaneamente possibile recuperare i dati per i singoli dipartimentali. Ti preghiamo di
            riprovare più tardi.
          </div>


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


                hasRisLis: false,
                dipartimentali: [],
                isRisLisModalOpened: false,
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
                html: null,
                noDataRisLis: false,
                consentSelectedStatus: null,
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
                    // MODIFICA PER VALORE
                    if (this.consentInfo.consensi[i].tipo_stato.codice === this.$config.consents.availableStatuses.ACTIVATED && this.consentInfo.consensi[i].valore_consenso.codice === 'SI')
                        this.active.push(this.consentInfo.consensi[i])
                }

            },

            asrList() {
                let result = [...(this.consentInfo.consensi.sort((a, b) => a.asr.codice - b.asr.codice))]
                return result
                //return this.consentInfo.consensi;
            },

            isRegional() {
                return this.consentInfo.informativa.tipo_consenso.codice === this.$config.consents.types.REGIONAL;
            },
        },

        async created() {
            //CONTROLLO SE CI SARANNO LIS E RIS

            if (this.consentInfo.informativa.sotto_tipo_consenso.codice === 'ROL' ||
                this.consentInfo.informativa.sotto_tipo_consenso.codice === 'CPROL') {
                if (this.consentInfo.stato_notifiche_dipartimentali && this.consentInfo.stato_notifiche_dipartimentali.length > 0) {
                    this.hasRisLis = true
                } else {
                    this.noDataRisLis = true
                }
            }


            try {

                let htmlPromise = await getHTMLInformativa(
                    this.consentInfo.informativa.tipo_consenso.codice,
                    this.consentInfo.informativa.sotto_tipo_consenso.codice,
                    {_no5XXRedirect: true}
                )


                this.html = htmlPromise.data
            } catch (e) {
                console.error(e)
            }


            //selezione di partenza per regionali
            if (this.consentInfo.informativa.tipo_consenso.codice === this.$config.consents.availableStatuses.REVOKED) {


                if (this.consentInfo.consensi[0].tipo_stato) {
                    if (!this.consentInfo.consensi[0].valore_consenso) {
                        this.statusValue = this.$config.consents.availableStatuses.NOT_EXPRESSED
                        this.controlStateRegional = this.consentInfo.consensi[0].tipo_stato.codice

                    }

                    if (this.consentInfo.consensi[0].valore_consenso) {
                        //MODIFICA PER VALORE

                        this.controlStateRegional = this.consentInfo.consensi[0].tipo_stato.codice

                        if (this.consentInfo.consensi[0].tipo_stato.codice === this.$config.consents.availableStatuses.ACTIVATED && this.consentInfo.consensi[0].valore_consenso.codice === 'NO') {
                            this.controlStateRegional = 'R'
                        }
                        if (this.consentInfo.consensi[0].tipo_stato.codice === this.$config.consents.availableStatuses.REVOKED) {
                            this.statusValue = this.$config.consents.availableStatuses.REVOKED
                        }
                        //MODIFICA PER VALORE
                        if (this.consentInfo.consensi[0].tipo_stato.codice === this.$config.consents.availableStatuses.ACTIVATED && this.consentInfo.consensi[0].valore_consenso.codice === "SI") {
                            this.statusValue = this.$config.consents.availableStatuses.ACTIVATED
                        }
                        if (this.consentInfo.consensi[0].tipo_stato.codice === this.$config.consents.availableStatuses.ACTIVATED && this.consentInfo.consensi[0].valore_consenso.codice === "NO") {
                            this.statusValue = this.$config.consents.availableStatuses.REVOKED
                        }
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
                //MODIFICA PER VALORE
                if (this.consentInfo.consensi[i].tipo_stato.codice === this.$config.consents.availableStatuses.ACTIVATED && this.consentInfo.consensi[i].valore_consenso.codice === 'SI') {
                    this.atLeastOne = true;
                    this.activatedCounter++;
                }
                if (this.consentInfo.consensi[i].tipo_stato.codice === this.$config.consents.availableStatuses.REVOKED) {
                    revokedCounter++;

                }
                if (this.consentInfo.consensi[i].tipo_stato.codice === this.$config.consents.availableStatuses.ACTIVATED && this.consentInfo.consensi[i].valore_consenso.codice === 'NO') {
                    revokedCounter++;
                }
            }
            if (revokedCounter === 0 && this.atLeastOne === false) {
                this.notExpressed = true
            }

            if (revokedCounter > 0 && this.atLeastOne === false) {
                this.isRevoked = true
            }


            //MODIFICA PER VALORE
            for (let i = 0; i < this.consentInfo.consensi.length; i++) {

                if (this.consentInfo.consensi[i].valore_consenso) {
                    if (this.consentInfo.consensi[i].valore_consenso.codice === 'SI') {
                        this.asrModels.push(this.consentInfo.consensi[i].tipo_stato.codice)
                    }
                    if (this.consentInfo.consensi[i].valore_consenso.codice === 'NO') {
                        if (this.consentInfo.consensi[i].tipo_stato.codice === this.$config.consents.availableStatuses.ACTIVATED) {
                            this.asrModels.push(this.$config.consents.availableStatuses.REVOKED)
                        } else {
                            this.asrModels.push(this.consentInfo.consensi[i].tipo_stato.codice)
                        }
                    }
                } else {
                    this.asrModels.push(this.consentInfo.consensi[i].tipo_stato.codice)
                }
            }


        },
        methods: {
//APRE MODALE LIS E RIS
            async openLisRisModal(uuid, stato) {
                this.dipartimentali = this.consentInfo.stato_notifiche_dipartimentali.filter(a => a.uuid === uuid)
                this.consentSelectedStatus= stato
                this.isRisLisModalOpened = true;
            },
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
                                //newConsent.data_acquisizione = new Date().toISOString().split('T')[0];
                                //delegato settato a null per evitare di passare un consenso con questo dato.
                                // Viene poi settto dal rosso quando serve
                                newConsent.cf_delegato = null
                                newConsent.nome_delegato = null
                                newConsent.cognome_delegato = null
                                newConsent.tipo_stato.codice = this.statusValue

                                if (newConsent.tipo_stato.codice === this.$config.consents.availableStatuses.ACTIVATED) {
                                    newConsent.tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.A
                                    newConsent.valore_consenso = {codice: 'SI', descrizione: 'SI'}
                                }

                                if (newConsent.tipo_stato.codice === this.$config.consents.availableStatuses.REVOKED) {
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

                                    let response = await editConsent(this.taxCode, id_informativa, id_asl, payload)


                                    let params = {id: id_informativa, singleConsent: item};
                                    let route = {name: this.$routes.CONSENTS.CONSENT_SUCCESS.name, params};

                                    this.$router.push(route);
                                } catch (e) {
                                    notifyError(e, "Non è stato possibile modificre il consenso")

                                    //this.$router.back();
                                }
                            } else {
                                //post regionale OK
                                if (item.consensi[0].tipo_stato.codice === "NON ESPRESSO") {
                                    let newConsent = item.consensi[0]
                                    //delegato settato a null per evitare di passare un consenso con questo dato.
                                    // Viene poi settto dal rosso quando serve
                                    newConsent.cf_delegato = null
                                    newConsent.nome_delegato = null
                                    newConsent.cognome_delegato = null
                                    newConsent.nome = this.user.nome
                                    newConsent.cognome = this.user.cognome
                                    //newConsent.uuid = uuidGenerato?
                                    //newConsent.data_acquisizione = new Date().toISOString().split('T')[0];
                                    newConsent.tipo_stato.codice = this.statusValue

                                    if (newConsent.tipo_stato.codice === this.$config.consents.availableStatuses.ACTIVATED) {
                                        newConsent.tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.A
                                        newConsent.valore_consenso = {codice: 'SI', descrizione: 'SI'}
                                    }

                                    if (newConsent.tipo_stato.codice === this.$config.consents.availableStatuses.REVOKED) {
                                        //modifica per santina ed egidio
                                        //newConsent.tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.R
                                        newConsent.tipo_stato.codice = this.$config.consents.availableStatuses.ACTIVATED
                                        newConsent.tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.A
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

                                        let response = await createConsent(this.taxCode, payload)

                                        let params = {id: item.informativa.id_informativa, singleConsent: item};
                                        let route = {name: this.$routes.CONSENTS.CONSENT_SUCCESS.name, params};
                                        this.$router.push(route);
                                    } catch (e) {
                                        notifyError(e, "Non è stato possibile modificre il consenso")
                                        //this.$router.back();
                                    }

                                }

                            }
                        }
                    } else {

                        let newConsent = item.consensi

                        let responsePromises = []
                        //const callApi = async () =>{ return 'dummy'}

                        for (let i = 0; i < newConsent.length; i++) {
                            //delegato settato a null per evitare di passare un consenso con questo dato.
                            // Viene poi settto dal rosso quando serve
                            newConsent[i].cf_delegato = null
                            newConsent[i].nome_delegato = null
                            newConsent[i].cognome_delegato = null
                            // if (item.consensi[i].tipo_stato.codice === this.asrModels[i]) {
                            //
                            //
                            // }
                            //MODIFICA PER VALORE
                            // else if(item.consensi[i].valore_consenso && item.consensi[i].valore_consenso.codice==='NO' && this.asrModels[i]==='R'){
                            //     console.log(item.consensi[i].valore_consenso.codice)
                            //     console.log(this.asrModels[i])
                            // }
                            if (item.consensi[i].valore_consenso) {
                                if (item.consensi[i].valore_consenso.codice === 'SI' && item.consensi[i].tipo_stato.codice === this.asrModels[i]) {
                                    continue;

                                }
                                if (item.consensi[i].valore_consenso.codice === 'NO') {
                                    if (item.consensi[i].tipo_stato.codice !== this.$config.consents.availableStatuses.ACTIVATED && item.consensi[i].tipo_stato.codice === this.asrModels[i]) {
                                        continue;
                                    }
                                    if (item.consensi[i].tipo_stato.codice === this.$config.consents.availableStatuses.ACTIVATED && this.asrModels[i] === this.$config.consents.availableStatuses.REVOKED) {
                                        continue;
                                    }

                                }
                            }
                            if (!item.consensi[i].valore_consenso) {
                                if (item.consensi[i].tipo_stato.codice === this.asrModels[i]) {
                                    continue;

                                }
                            }
                            // else if( this.asrModels[i]!=='A' && item.consensi[i].tipo_stato.codice === this.asrModels[i]){
                            //     console.log(item.consensi[i].valore_consenso.codice)
                            //     console.log(this.asrModels[i])
                            // }
                            // else if( this.asrModels[i]==='A'){
                            //     console.log(item.consensi[i].valore_consenso.codice)
                            //     console.log(this.asrModels[i])
                            // }
                            //post aziendale OK
                            if (item.consensi[i].tipo_stato.codice === "NON ESPRESSO") {

                                newConsent[i].tipo_stato.codice = this.asrModels[i]

                                //newConsent[i].data_acquisizione = new Date().toISOString().split('T')[0];

                                if (newConsent[i].tipo_stato.codice === this.$config.consents.availableStatuses.ACTIVATED) {
                                    newConsent[i].tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.A
                                    newConsent[i].valore_consenso = {codice: 'SI', descrizione: 'SI'}
                                }

                                if (newConsent[i].tipo_stato.codice === this.$config.consents.availableStatuses.REVOKED) {
                                    //modifica per santina e egidio
                                    //newConsent[i].tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.R
                                    newConsent[i].tipo_stato.codice = this.$config.consents.availableStatuses.ACTIVATED
                                    newConsent[i].tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.A
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
                                        promise: createConsent(this.taxCode, payload)
                                    })


                                }


                            }
                            //put aziendale OK
                            else {
                                newConsent[i].tipo_stato.codice = this.asrModels[i]
                                //newConsent[i].data_acquisizione = new Date().toISOString().split('T')[0];

                                if (newConsent[i].tipo_stato.codice === this.$config.consents.availableStatuses.ACTIVATED) {
                                    newConsent[i].tipo_stato.descrizione = this.$config.consents.reverseAvailableStatuses.A
                                    newConsent[i].valore_consenso.codice = 'SI'
                                    newConsent[i].valore_consenso.descrizione = 'SI'
                                }

                                if (newConsent[i].tipo_stato.codice === this.$config.consents.availableStatuses.REVOKED) {
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
                                    promise: editConsent(this.taxCode, id_informativa, id_asl, payload)
                                })

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
                            if (successResponses.length > 0) {
                                //let responses= await Promise.all(responsePromises)
                                let params = {id: item.informativa.id_informativa, singleConsent: item};
                                let route = {name: this.$routes.CONSENTS.CONSENT_SUCCESS.name, params};
                                this.$router.push(route);
                            }
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
                    this.asrModels[i] = this.$config.consents.availableStatuses.ACTIVATED
                }
                this.$forceUpdate();
            },

            uncheckAll() {
                for (let i = 0; i < this.asrModels.length; i++) {
                    this.asrModels[i] = this.$config.consents.availableStatuses.REVOKED
                }
                this.$forceUpdate();
            }
        },

    }

</script>

<style scoped lang="stylus">
  .frame
   background-color $grey-3
   width 100%
   height 100%
   border 1px solid $grey-5
   border-radius 4px
</style>
