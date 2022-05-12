<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <template v-if="isDeclarationMode">
      <csi-active-delegation-toolbar :full-name="declarationFullName" no-close/>
    </template>

    <template v-if="isDelegatorMode">
      <csi-active-delegation-toolbar :full-name="delegatorFullName" no-close/>
    </template>

    <q-page>
      <div class="q-headline q-pa-md">Attivazione del Fascicolo Sanitario</div>

      <template v-if="!isLoading">
        <div>
          <csi-stepper
            ref="stepper"
            alternative-labels
            contractable
            class="stepper-no-padding stepper-no-shadow">

            <!-- Step 0 -->
            <!-- --------------------------------------------------------------------------------------------------------- -->
<!--            <template v-if="isDeclarationMode && isProduction">-->
            <template v-if="isDeclarationMode">
              <q-step default title="Verifica Tessera Sanitaria">
                <q-card>
                  <q-card-title>
                    <div class="q-title">Verifica Tessera Sanitaria</div>
                  </q-card-title>
                  <q-card-main>

                    <p>
                      Inserisci il "numero di identificazione della tessera sanitaria" di {{declarationFullName}}
                    </p>

                    <q-field required :count="teamLength" :error="$v.team.$error">
                      <q-input
                        type="text"
                        v-model="team"
                        stack-label="Numero tessera sanitaria"
                        name="team"
                        autocomplete="team"
                        :maxlength="teamLength"
                        :prefix="teamPrefix"
                      />

                      <template slot="helper">
                        <a href="#" @click.prevent="showTeamFindModal">
                          Come trovo il numero della tessera sanitaria?
                        </a>
                      </template>

                      <div slot="error-label">
                        <div v-if="!$v.team.required">Campo obbligatorio</div>
                        <div v-if="!$v.team.length">Deve essere formato da 20 numeri</div>
                      </div>
                    </q-field>
                  </q-card-main>
                </q-card>
                <csi-buttons class="q-my-md">
                  <csi-button primary label="Continua" :loading="isCheckingTeam" @click="onNextStep0"/>
                  <csi-button secondary label="Annulla" @click="onBackStep0"/>
                </csi-buttons>

              </q-step>
            </template>

            <!-- Step 1 -->
            <!-- --------------------------------------------------------------------------------------------------------- -->
            <q-step default title="Informativa">
              <q-card>
                <q-card-title>
                  <div class="q-title q-pa-md">Informativa</div>
                </q-card-title>
                <q-card-main>
                  <div class="q-body-1 q-pa-md">
                    Prendi visione dell’informativa e dai il consenso alla creazione del fascicolo Sanitario <br/>
                    <br/>
                    <strong>È importante leggerla e capirla</strong> bene perchè le informazioni in essa contenute ti
                    permettono
                    di
                    decidere a chi dare accesso ai tuoi dati sanitari, e in quali circostanze, con piena consapevolezza.
                    <strong>Successivamente potrai cambiare in qualsiasi momento le tue decisioni.</strong>
                  </div>

                  <p>
                    <!--                    <csi-policy-->
                    <!--                      src="statics/terms-and-conditions/newFse.html"-->
                    <!--                      pdf-src="statics/terms-and-conditions/newFse.pdf"-->
                    <!--                    />-->

                    <csi-policy
                      :src="lastPolicyVersionPdfUrl"
                      :pdf-src="lastPolicyVersionPdfUrl"
                    />
                  </p>

                  <q-field
                    class="q-body-1 q-mt-md csi-field--no-label-border"
                    :error="$v.isDisclaimerAccepted.$error">
                    <q-toggle
                      v-model="isDisclaimerAccepted"
                      :color="$v.isDisclaimerAccepted.$error ? 'negative' : 'primary'"
                      :keep-color="$v.isDisclaimerAccepted.$error">
                <span :class="{'text-negative': $v.isDisclaimerAccepted.$error}" class="q-ml-sm">
                  Dichiaro di aver preso visione e dell'informativa e di accettare le condizioni d'uso
                </span>
                    </q-toggle>
                    <div slot="error-label">
                      <div v-if="!$v.isDisclaimerAccepted.isTrue">Accetta l'informativa prima di andare avanti</div>
                    </div>
                  </q-field>
                </q-card-main>
              </q-card>
              <csi-buttons class="q-my-md">
                <csi-button primary label="Continua" @click="onNextStep1"/>
                <csi-button secondary @click="onBackStep1">
                  <template v-if="isDeclarationMode">Indietro</template>
                  <template v-else>Annulla</template>
                </csi-button>
              </csi-buttons>

            </q-step>

            <!-- Step 2 -->
            <!-- --------------------------------------------------------------------------------------------------------- -->
            <q-step title="Consenso">
              <q-card>
                <div class="q-pa-md">
                  <q-card-title>
                    <div class="q-title">Consenso</div>
                  </q-card-title>
                  <q-card-main>
<!--                    <q-field class="q-body-1 q-mt-md">-->
<!--                      <q-toggle-->
<!--                        v-model="addClinicalData"-->
<!--                        label="Acconsento ad alimentare il fascicolo con i miei dati clinici"-->
<!--                        disable>-->
<!--                      </q-toggle>-->
<!--                    </q-field>-->

                    <q-field class="q-body-1 q-mt-md">
                      <q-toggle
                        v-model="showClinicalData"
                        label="Acconsento alla consultazione del fascicolo">
                      </q-toggle>
                    </q-field>
                    <q-field class="q-body-1 q-mt-md">
                      <q-toggle
                        v-model="showPastedClinicalData"
                        label="Acconsento al recupero del pregresso">
                      </q-toggle>
                    </q-field>
                  </q-card-main>
                </div>
              </q-card>
              <csi-buttons class="q-py-md">
                <csi-button primary label="Continua" @click="$refs.stepper.next()"/>
                <csi-button secondary label="Indietro" @click="$refs.stepper.previous()"/>
              </csi-buttons>
            </q-step>

            <!-- Step 3 -->
            <!-- --------------------------------------------------------------------------------------------------------- -->
            <q-step title="Riepilogo">
              <q-card>
                <div class="q-pa-md">
                  <q-card-title>
                    <div class="q-title">Riepilogo</div>
                  </q-card-title>
                  <q-card-main>
                    <div class="q-body-1 q-mt-md">
                      Stai per acconsentire alla creazione del tuo fascicolo sanitario con le seguenti specifiche:
                      <ul>
                        <li class="q-py-md">
                          Hai preso visione dell'informativa relativa al trattamento dei dati personali per la
                          costituzione
                          del
                          fascicolo sanitario elettronico
                        </li>
<!--                        <li v-if="addClinicalData" class="q-py-md">-->
<!--                          Hai dato il consenso ad alimentare il fascicolo con i tuoi dati clinici-->
<!--                        </li>-->
                        <li v-if="showClinicalData" class="q-py-md">
                          Hai scelto di dare il consenso alla consultazione del fascicolo
                        </li>
                        <li v-if="showPastedClinicalData" class="q-py-md">
                          Hai scelto di dare il consenso al recupero del pregresso
                        </li>
                      </ul>
                    </div>
                  </q-card-main>
                </div>
              </q-card>
              <csi-buttons class="q-py-md">
                <csi-button primary label="Conferma" :loading="isSavingConsent" @click="onSaveConsent"/>
                <csi-button secondary label="Indietro" @click="$refs.stepper.previous()"/>
              </csi-buttons>
            </q-step>


            <!-- Step 4 -->
            <!-- --------------------------------------------------------------------------------------------------------- -->
            <q-step title="Fine">
              <q-card>
                <div class="q-pa-md">
                  <q-card-title>
                    <div class="q-title">Hai attivato il tuo fascicolo!</div>
                  </q-card-title>
                  <q-card-main>
                    <q-alert type="positive">
                      <div class="q-body-1 q-mt-md">
                        D'ora in poi:
                        <ul>
                          <li>avrai un unico punto di accesso alla tua storia clinica</li>
                          <li>potrai consultare il tuo fascicolo ovunque ti trovi</li>
                          <li>potrai far arrivare velocemente al tuo medico curante le informazioni che ti riguardano
                          </li>
                          <li>potrai essere seguito con maggiore continuità</li>
                          <li>potrai evitare esami ripetuti o non necessari</li>
                        </ul>
                      </div>
                    </q-alert>
                  </q-card-main>
                </div>
              </q-card>
              <csi-buttons class="q-my-md">
                <csi-button v-if="hasFromRoute" primary label="Torna al servizio" @click="goToService"/>
                <csi-button :primary="!hasFromRoute" :secondary="hasFromRoute" label="Torna alla home"
                            @click="goToHome"/>
              </csi-buttons>
            </q-step>
          </csi-stepper>
        </div>


        <!-- DIALOGS -->
        <!-- ----------------------------------------------------------------------------------------------------------- -->
        <q-dialog v-model="isCancelDialogVisible" @ok="onCancelConfirmed">
          <span slot="message" class="text-black">
            Desideri uscire dalla procedura per la creazione del Fascicolo Sanitario Elettronico?
          </span>

          <template slot="buttons" slot-scope="props">
            <csi-buttons>
              <csi-button primary label="Sì, esci" @click="props.ok"/>
              <csi-button secondary label="No, annulla" @click="props.cancel"/>
            </csi-buttons>
          </template>
        </q-dialog>

        <q-modal v-model="isTeamFindModalVisible" :content-css="{maxWidth: '800px'}">
          <q-modal-layout footer-class="shadow-0">
            <q-toolbar slot="header">
              <q-toolbar-title>Come trovo il numero della tessera sanitaria?</q-toolbar-title>
              <q-btn round flat icon="close" v-close-overlay/>
            </q-toolbar>

            <div class="q-pa-md text-center">
              <img src="statics/images/team-dove-trovarlo.jpg" alt="Numero tessera sanitaria" class="responsive">
            </div>
          </q-modal-layout>
        </q-modal>
      </template>

      <csi-inner-loading :visible="isLoading"/>
    </q-page>
  </div>
</template>


<script>
  import CsiPolicy from 'components/global/common/CsiPolicy'
  import CsiActiveDelegationToolbar from "components/global/common/CsiActiveDelegationToolbar";
  import {required} from 'vuelidate/lib/validators'
  import {isTrue} from '@validators/global'
  import {getArruolabilita, getConsenso, getLastPolicyVersion, saveConsenso} from '@services/api/enrollment'
  import {notifyError} from '@services/api/utils'
  import {getDeclarations, getDelegators} from "@services/api/delegations";
  import {getActiveDelegations, getDeclarationMinor, isDelegationValid} from "@services/delegations/business-logic";
  import {verifyTeam} from "@services/api/profile";
  import {axiosInstance} from "plugins/axios";

  export default {
    name: 'PageEnrollmentFlow',
    components: {CsiActiveDelegationToolbar, CsiPolicy},
    data() {
      return {
        isLoading: false,
        declaration: null,
        delegator: null,
        teamPrefix: '8038000',
        teamLength: 13,
        team: '',
        isTeamFindModalVisible: false,
        isCheckingTeam: false,
        isDisclaimerAccepted: false,
        addClinicalData: true,
        showClinicalData: false,
        showPastedClinicalData: false,
        isSavingConsent: false,
        fromRoute: null,
        isCancelDialogVisible: false,
        lastPolicyVersion: null,
      }
    },
    computed: {
      isProduction() {
        return this.$config.global.isProduction || this.$config.global.isAlpha
      },
      user() {
        return this.$store.getters['global/user']
      },
      hasFromRoute() {
        return !!this.fromRoute
      },
      fromServiceCode() {
        return this.$route.query.servizio
      },
      returnUrl(){
        return this.$route.query.url_ritorno;
      },
      isDelegatorMode() {
        return this.delegator
      },
      isDeclarationMode() {
        //let isPrescription = this.fromServiceCode === this.$config.global.appServiceCodes.prescriptions
        // return this.declaration && isPrescription
        return this.declaration
      },
      minor() {
        if (!this.declaration) return null;
        return getDeclarationMinor(this.declaration);
      },
      delegatorFullName() {
        if (!this.delegator) return '';
        return `${this.delegator.cognome_delega} ${this.delegator.nome_delega}`
      },
      declarationFullName() {
        if (!this.declaration) return '';
        return `${this.minor.cognome} ${this.minor.nome}`
      },
      lastPolicyVersionPdfUrl() {
        let baseUrl = axiosInstance.defaults.baseURL;
        let basePath = this.$config.global.basePaths.enrollment;
        return `${baseUrl}${basePath}/cittadini/${this.user.cf}/informativa-ultima/pdf`
      }
    },
    validations() {
      return {
        team: {
          required,
          length: v => v.length === this.teamLength
        },
        isDisclaimerAccepted: {
          isTrue: isTrue
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // Salviamo la route da cui siamo arrivati
        vm.fromRoute = from
      })
    },
    async created() {
      this.isLoading = true
      let {d, minore} = this.$route.query;
      // console.log(minore)

      try {
        let response = await getLastPolicyVersion(this.user.cf, {_no5XXRedirect: true});
        this.lastPolicyVersion = response.data.identificativo_informativa;
      } catch (err) {
        notifyError(err, "Non è statp possibile sapere qual è l'ultima versione dell'informativa");
        console.error(err);
      }

      // Se c'è popolata la query del minore ma non quella del delegante
      // => popoliamo manualmente quella del delegante perché quella del minore
      //    è un vecchio comportamento che non deve più essere usato.
      //    In particolare non dovrebbe più essere mostrato lo step di validazione team
      if (minore && !d){
        d = minore;
      }

      // if (minore) {
      //   try {
      //     let response = await getDeclarations(this.user.cf);
      //     this.declaration = response.data.find(d => {
      //       let minor = getDeclarationMinor(d);
      //       return minor.codice_fiscale === minore;
      //     })
      //   } catch (err) {
      //     // Il cittadino non ha una dichiarazione su questo minore
      //   }
      // }

      // Evolutiva:
      // prima accettavamo solo dichiarazioni invece ora va bene un qualsiasi delegante
      if (d) {
        try {
          let {data} = await getDelegators(this.user.cf, {_no5XXRedirect: true});

          // Prendiamo solo i deleganti che hanno una delega attiva sul servizio di partenza
          this.delegator = data.filter(delegator => {
            let activeDelegationList = getActiveDelegations(delegator.deleghe);
            return activeDelegationList.some(el => el.codice_servizio === this.fromServiceCode)
          });


          // Tra i deleganti che hanno una delega attiva sul servizio di partenza cerchiamo
          // quello che ci è stato passato nella URL
          this.delegator = this.delegator.find(el => el.codice_fiscale_delega === d || el.uuid === d);
        } catch (err) {
          // Il cittadino non ha una dichiarazione su questo minore
        }
      }

      this.isLoading = false;
    },
    methods: {
      onBackStep0() {
        this.onCancel();
      },
      async onNextStep0() {
        this.$v.team.$touch();
        if (this.$v.team.$error) return;

        this.isCheckingTeam = true;
        let cf = this.minor.codice_fiscale;
        let team = `${this.teamPrefix}${this.team}`;
        let serviceCode = this.fromServiceCode;

        try {
          let {data} = await verifyTeam(cf, team, serviceCode);
          if (data.risposta) {
            this.$refs.stepper.next();
          } else {
            this.$q.notify({
              color: 'negative',
              message: data.desc_risposta
            })
          }
        } catch (err) {
          notifyError(err, 'Il numero della tessera sanitaria non è corretto');
        }

        this.isCheckingTeam = false;
      },
      onBackStep1() {
        this.isDeclarationMode ? this.$refs.stepper.previous() : this.onCancel();
      },
      onNextStep1() {
        this.$v.isDisclaimerAccepted.$touch();
        if (this.$v.isDisclaimerAccepted.$error) return;
        this.$refs.stepper.next();
      },
      async onSaveConsent() {

        this.isSavingConsent = true;
        let cf = this.user.cf;
        let params = {};
        let data = {
          //identificativo_informativa: this.$config.enrollment.termsAndConditionsVersion,
          identificativo_informativa: this.lastPolicyVersion,
          consenso_alimentazione: this.addClinicalData,
          consenso_consultazione: this.showClinicalData,
          consenso_pregresso: this.showPastedClinicalData
        };

        // Se stiamo aprendo il FSE per un minore => socrascrviamo il CF ed aggiungiamo il TEAM al payload
        if (this.isDeclarationMode) {
          cf = this.minor.codice_fiscale;
          data.codice_tessera_team = `${this.teamPrefix}${this.team}`;
          params.servizio = this.fromServiceCode;
        }

        // Se stiamo aprendo il FSE per un delegante => sovrascriviamo il CF
        if (this.isDelegatorMode) {
          cf = this.delegator.codice_fiscale_delega;
          params.servizio = this.fromServiceCode
        }

        // try {
        //   await getConsenso(cf, {_no5XXRedirect: true});
        // } catch (e) {
        //   console.error(e);
        // }

        try {
          let response = await getConsenso(cf, {params, _no5XXRedirect: true});
          // data.identificativo_informativa = response.data.identificativo_informativa;
          response = await saveConsenso(cf, data, {params, _no5XXRedirect: true});
        } catch (e) {
          notifyError(e, 'Non è stato possibile attivare il fascicolo sanitario');
          this.isSavingConsent = false;
          return
        }

        // Se siamo arrivati fin qui => il salvataggio del consenso è andato a buon fine
        // Se l'utente sta aprendo il FSE per se stesso => proviamo ad aggiornare lo stato del fascicolo
        //                                                 salvato in locale richiedendo i nuovi dati tramite API
        if (!this.isDeclarationMode && !this.isDelegatorMode) {
          try {
            let enrollmentResponse = await getArruolabilita(this.user.cf, {_no5XXRedirect: true});
            this.$store.commit('global/setEnrollmentInfo', enrollmentResponse.data);
          } catch (e) {
            // In caso di errore nell'aggiornamento dei dati lo impostiamo manualmente
            let code = this.addClinicalData
              ? this.$config.enrollment.codes.FSE_APPROVED
              : this.$config.enrollment.codes.FSE_NOT_APPROVED;

            let payload = {risposta: false, codice_risposta: code, dettaglio_risposta: ''};
            this.$store.commit('global/setEnrollmentInfo', payload);
          }
        }

        this.isSavingConsent = false;
        this.$refs.stepper.next();
      },
      onCancel() {
        this.isCancelDialogVisible = true
      },
      onCancelConfirmed() {
        this.hasFromRoute ? this.goToService() : this.goToHome()
      },
      goToService() {

        // Ci è stato chiesto esplicitamente dove tornare
        if (this.returnUrl) {
          window.location.assign(this.returnUrl);
          return;
        }

        // Altrimenti si tratta del ritorno ad un servizio non spacchettato
        this.$router.push(this.fromRoute.fullPath);
      },
      goToHome() {
        this.$router.push(this.$routes.GLOBAL.APP)
      },
      showTeamFindModal() {
        this.isTeamFindModalVisible = true;
      }
    }
  }
</script>


<style lang="stylus">
  .stepper-no-padding .q-stepper-step-inner
    padding 0

  .stepper-no-shadow,
  .stepper-no-shadow .q-stepper-header
    box-shadow none

  .csi-field--no-label-border .q-field-bottom
    border-top: none
</style>
