<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <template v-if="isDeclarationMode">
      <portal to="layout-header-end">
        <lms-layout-delegator-toolbar
          :first-name="minor.nome"
          :last-name="minor.cognome"
          @close="onCloseDelegation"
        />
      </portal>
    </template>

    <template v-if="isDelegationMode">
      <portal to="layout-header-end">
        <lms-layout-delegator-toolbar
          :first-name="delegator.nome_delega"
          :last-name="delegator.cognome_delega"
          no-close
        />
      </portal>
    </template>

    <lms-page-title no-back class="q-mb-lg">
      Attivazione del Fascicolo Sanitario
    </lms-page-title>

    <template v-if="!isLoading">
      <lms-stepper
        v-model="step"
        :contracted="$q.screen.lt.sm"
        alternative-labels
        animated
        flat
        class="bg-transparent"
      >
        <!-- STEP VERIFICA TEAM -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <template v-if="isDeclarationMode">
          <q-step
            :name="STEP_MAP.TEAM_VERIFICATION"
            title="Verifica Tessera Sanitaria"
            icon="person"
            color="grey-8"
            active-color="primary"
            done-color="green-8"
            :done="step > STEP_MAP.TEAM_VERIFICATION"
          >
            <q-card>
              <q-card-section class="text-h5">
                Verifica Tessera Sanitaria
              </q-card-section>

              <q-card-section>
                <p>
                  Inserisci il "numero di identificazione della tessera
                  sanitaria" di {{ minorFullName }}
                </p>

                <q-input
                  type="text"
                  v-model="team"
                  label="Numero tessera sanitaria"
                  stack-label
                  :maxlength="TEAM_LENGTH"
                  :prefix="TEAM_PREFIX"
                  counter
                  required
                  name="team"
                  autocomplete="team"
                  no-error-icon
                  :error="$v.team.$error"
                >
                  <template #hint>
                    <a
                      class="lms-link cursor-pointer"
                      @click="showTeamFindModal"
                    >
                      Come trovo il numero della tessera sanitaria?
                    </a>
                  </template>

                  <template #error>
                    <div v-if="!$v.team.required">
                      Campo obbligatorio
                    </div>
                    <div v-if="!$v.team.length">
                      Deve essere formato da 20 numeri
                    </div>
                  </template>
                </q-input>
              </q-card-section>
            </q-card>

            <lms-buttons class="q-my-md">
              <lms-button
                primary
                label="Continua"
                :loading="isCheckingTeam"
                @click="onStepTeamNext"
              />
            </lms-buttons>
          </q-step>
        </template>

        <!-- STEP INFORMATIVA -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-step
          :name="STEP_MAP.INFORMATIVE"
          title="Informativa"
          icon="policy"
          color="grey-8"
          active-color="primary"
          done-color="green-8"
          :done="step > STEP_MAP.INFORMATIVE"
        >
          <q-card>
            <q-card-section class="text-h1">
              Informativa
            </q-card-section>

            <q-card-section class=" text-body1">
              <p>
                Prendi visione dell’informativa e dai il consenso alla creazione
                del fascicolo Sanitario.
              </p>

              <p>
                <strong>È importante leggerla e capirla bene</strong> perchè le
                informazioni in essa contenute ti permettono di decidere a chi
                dare accesso ai tuoi dati sanitari, e in quali circostanze, con
                piena consapevolezza.
              </p>

              <p class="q-mb-none">
                <strong>
                  Successivamente potrai cambiare in qualsiasi momento le tue
                  decisioni.
                </strong>
              </p>
            </q-card-section>

            <q-card-section>
              <template v-if="lastPolicyVersionPdfUrl">
                <lms-policy
                  :src="lastPolicyVersionPdfUrl"
                  :src-pdf="lastPolicyVersionPdfUrl"
                />
              </template>
             <template v-else>
               <lms-policy>
                 <enrollment-skeleton-informative-html />
               </lms-policy>
             </template>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-toggle
                v-model="isDisclaimerAccepted"
                label="Dichiaro di aver preso visione e dell'informativa e di
                    accettare le condizioni d'uso"
              />
            </q-card-section>
          </q-card>

          <lms-buttons class="q-my-md">
            <lms-button label="Continua" @click="onStepInformativeNext" />

            <template v-if="isDeclarationMode">
              <lms-button outline label="Indietro" @click="onStepBack" />
            </template>
          </lms-buttons>
        </q-step>

        <!-- STEP CONSENSO -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-step
          :name="STEP_MAP.CONSENT"
          title="Consenso"
          icon="flaky"
          color="grey-8"
          active-color="primary"
          done-color="green-8"
          :done="step > STEP_MAP.CONSENT"
        >
          <q-card>
            <q-card-section class="text-h1">
              Consenso
            </q-card-section>

            <q-card-section class="q-gutter-y-md">
<!--              <div>-->
<!--                <q-toggle-->
<!--                  v-model="addClinicalData"-->
<!--                  label="Acconsento ad alimentare il fascicolo con i miei dati clinici"-->
<!--                  disable-->
<!--                />-->
<!--              </div>-->

              <div>
                <q-toggle
                  v-model="showClinicalData"
                  label="Acconsento alla consultazione del fascicolo"
                />
              </div>

              <div>
                <q-toggle
                  v-model="showPastedClinicalData"
                  label="Acconsento al recupero del pregresso"
                />
              </div>
            </q-card-section>
          </q-card>

          <lms-buttons class="q-my-md">
            <lms-button label="Continua" @click="onStepNext" />
            <lms-button outline label="Indietro" @click="onStepBack" />
          </lms-buttons>
        </q-step>

        <!-- STEP RIEPILOGO -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-step
          :name="STEP_MAP.SUMMARY"
          title="Riepilogo"
          icon="subject"
          color="grey-8"
          active-color="primary"
          done-color="green-8"
          :done="step > STEP_MAP.SUMMARY"
        >
          <q-card>
            <q-card-section class="text-h1">
              Riepilogo
            </q-card-section>

            <q-card-section class="text-body1">
              <p>
                Stai per acconsentire alla creazione del tuo fascicolo sanitario
                con le seguenti specifiche:
              </p>

              <ul>
                <li>
                  Hai preso visione dell'informativa relativa al trattamento dei
                  dati personali per la costituzione del fascicolo sanitario
                  elettronico
                </li>

<!--                <template v-if="addClinicalData">-->
<!--                  <li>-->
<!--                    Hai dato il consenso ad alimentare il fascicolo con i tuoi-->
<!--                    dati clinici-->
<!--                  </li>-->
<!--                </template>-->

                <template v-if="showClinicalData">
                  <li>
                    Hai scelto di dare il consenso alla consultazione del
                    fascicolo
                  </li>
                </template>

                <template v-if="showPastedClinicalData">
                  <li>
                    Hai scelto di dare il consenso al recupero del pregresso
                  </li>
                </template>
              </ul>
            </q-card-section>
          </q-card>

          <lms-buttons class="q-my-md">
            <lms-button
              label="Conferma"
              :loading="isSavingConsent"
              @click="onSaveConsent"
            />

            <lms-button outline label="Indietro" @click="onStepBack" />
          </lms-buttons>
        </q-step>

        <!-- STEP FINE -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-step
          :name="STEP_MAP.END"
          title="Fine"
          icon="done_all"
          color="grey-8"
          active-color="primary"
          done-color="green-8"
          :done="step > STEP_MAP.END"
        >
          <q-card >
              <q-card-section>
                <div class="text-h1">Hai attivato il tuo fascicolo!</div>
              </q-card-section>

              <q-card-section>
                <q-banner  class="q-banner--positive">
                  <div class="text-body1 q-my-md">
                    D'ora in poi:
                    <ul>
                      <li>
                        avrai un unico punto di accesso alla tua storia clinica
                      </li>
                      <li>
                        potrai consultare il tuo fascicolo ovunque ti trovi
                      </li>
                      <li>
                        potrai far arrivare velocemente al tuo medico curante le
                        informazioni che ti riguardano
                      </li>
                      <li>potrai essere seguito con maggiore continuità</li>
                      <li>potrai evitare esami ripetuti o non necessari</li>
                    </ul>
                  </div>
                </q-banner>
              </q-card-section>

          </q-card>

          <lms-buttons class="q-my-md">
            <template v-if="referrerApp">
              <lms-button label="Torna al servizio" @click="goToReferrer" />
            </template>

            <lms-button
              :outline="!!referrerApp"
              label="Torna alla home"
              @click="goToHome"
            />
          </lms-buttons>
        </q-step>
      </lms-stepper>

      <!-- DIALOGS -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-dialog v-model="isTeamFindModalVisible">
        <q-card>
          <q-card-section class="no-padding">
            <q-toolbar>
              <q-toolbar-title>
                Dove trovo il numero della tessera sanitaria?
              </q-toolbar-title>

              <q-btn v-close-popup round flat dense icon="close" />
            </q-toolbar>
          </q-card-section>

          <q-card-section class="text-center">
            <img
              src="/statics/la-mia-salute/immagini/dove-trovo-team.jpg"
              alt="Numero tessera sanitaria"
              class="responsive"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </template>

    <!-- CARICAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-inner-loading :showing="isLoading" />
  </lms-page>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { httpAuth } from "src/boot/http";
import {
  getEnrollmentConsent,
  createEnrollmentConsent,
  getTeamValidity,
  getInformativeVersionLast,
  getDeclarationList, getDelegatorList, getEnrollmentInfo
} from "src/services/api";
import {getActiveDelegations, getDeclarationMinor} from "src/services/business-logic";
import {apiErrorNotify, equalsIgnoreCase, isEmpty} from "src/services/utils";
import LmsStepper from "src/components/core/LmsStepper";
import LmsPolicy from "src/components/core/LmsPolicy";
import {ENROLLMENT_CODE_MAP, TEAM_LENGTH, TEAM_PREFIX} from "../services/config";
import LmsLayoutDelegatorToolbar from "../components/core/LmsLayoutDelegatorToolbar";
import { HOME } from "../router/routes";
import EnrollmentSkeletonInformativeHtml from "components/EnrollmentSkeletonInformativeHtml";

const STEP_MAP = {
  TEAM_VERIFICATION: 1,
  INFORMATIVE: 2,
  CONSENT: 3,
  SUMMARY: 4,
  END: 5
};

export default {
  name: "PageHome",
  components: {EnrollmentSkeletonInformativeHtml, LmsLayoutDelegatorToolbar, LmsPolicy, LmsStepper },
  data() {
    return {
      TEAM_PREFIX,
      TEAM_LENGTH,
      STEP_MAP,
      step: STEP_MAP.INFORMATIVE,
      isLoading: false,
      isTeamFindModalVisible: false,
      isCheckingTeam: false,
      isSavingConsent: false,
      declaration: null,
      referrerAppCode: null,
      team: "",
      isDisclaimerAccepted: false,
      addClinicalData: true,
      showClinicalData: false,
      showPastedClinicalData: false,
      lastPolicyVersion: null,
      delegator:null,

    };
  },
  computed: {
    appList() {
      return this.$store.getters["getAppList"];
    },
    user() {
      return this.$store.getters["getUser"];
    },
    referrerApp() {
      return this.appList.find(a => equalsIgnoreCase(a.codice_servizio, this.referrerAppCode));
    },
    isDeclarationMode() {
      return this.declaration;
    },
    isDelegationMode(){
      return this.delegator
    },
    delegatorsList(){
      return this.$store.getters['getDelegatorList']
    },
    minor() {
      if (!this.declaration) return null;
      return getDeclarationMinor(this.declaration);
    },
    minorFullName() {
      let lastName = this.minor?.nome;
      let firstName = this.minor?.cognome;

      return [lastName, firstName]
        .map(v => v.trim())
        .filter(v => !!v)
        .join(" ");
    },
    lastPolicyVersionPdfUrl() {
      let taxCode = this.user?.cf;
      let baseUrl = httpAuth.defaults.baseURL;
      return `${baseUrl}/pdf`;
    }
  },
  validations() {
    return {
      team: {
        required,
        length: v => v.length === TEAM_LENGTH
      }
    };
  },
  async created() {
    this.isLoading = true
    let { d, minore, servizio } = this.$route.query;
    this.referrerAppCode = servizio;
    let taxCode = this.user.cf;

    // Se c'è popolata la query del minore ma non quella del delegante
    // => popoliamo manualmente quella del delegante perché quella del minore
    //    è un vecchio comportamento che non deve più essere usato.
    //    In particolare non dovrebbe più essere mostrato lo step di validazione team
    if (minore && !d){
      d = minore;
    }

    // Evolutiva:
    // prima accettavamo solo dichiarazioni invece ora va bene un qualsiasi delegante
    if(d){
      try {
        let {data: delegatorList} = await getDelegatorList(taxCode);
        this.$store.dispatch("setDelegatorList", { delegatorList });
        // Prendiamo solo i deleganti che hanno una delega attiva sul servizio di partenza
        this.delegator = delegatorList.filter(delegator => {
          let activeDelegationList = getActiveDelegations(delegator.deleghe);
          return activeDelegationList.some(el => el.codice_servizio === this.referrerAppCode)
        });


        // Tra i deleganti che hanno una delega attiva sul servizio di partenza cerchiamo
        // quello che ci è stato passato nella URL
        this.delegator = this.delegator.find(el => el.codice_fiscale_delega === d || el.uuid === d);
        taxCode = this.delegator.codice_fiscale_delega;

      } catch (err) {
        // Il cittadino non ha una dichiarazione su questo minore
      }

      }

    let params= {servizio: 'CODE'}
    try {
      let { data } = await getInformativeVersionLast(taxCode, {params});
      this.lastPolicyVersion = data.identificativo_informativa;
    } catch (error) {
      let message =
        "Non è stato possibile sapere qual è l'ultima versione dell'informativa";
      apiErrorNotify({ error, message });

      return;
    }
    this.isLoading=false


  },
  methods: {
    onStepNext() {
      this.step += 1;
    },
    onStepBack() {
      this.step -= 1;
    },
    async onStepTeamNext() {
      this.$v.team.$touch();
      if (this.$v.team.$error) return;

      this.isCheckingTeam = true;
      let taxCode = this.minor?.codice_fiscale ?? null;
      let team = `${TEAM_PREFIX}${this.team}`;
      let serviceCode = this.referrerAppCode;

      try {
        let { data } = await getTeamValidity(taxCode, team, serviceCode);

        if (data.risposta) {
          this.onStepNext();
        } else {
          let message = data.desc_risposta;
          apiErrorNotify({ message });
        }
      } catch (error) {
        let message = "Il numero della tessera sanitaria non è corretto";
        apiErrorNotify({ error, message });
      }

      this.isCheckingTeam = false;
    },
    onStepInformativeNext() {
      if (!this.isDisclaimerAccepted) {
        let color = "negative";
        let message = "Prendi visione dell'informativa prima di continuare";
        this.$q.notify({ color, message });
        return;
      }

      this.onStepNext();
    },
    async onSaveConsent() {
      this.isSavingConsent = true;
      let taxCode = this.user.cf;

      // Andiamo a leggere l'id dell'ultima informativa
      // per poi passarla nel payload della creazione del consenso
      // try {
      //   let { data } = await getInformativeVersionLast(taxCode);
      //   this.lastPolicyVersion = data.identificativo_informativa;
      // } catch (error) {
      //   let message =
      //     "Non è stato possibile sapere qual è l'ultima versione dell'informativa";
      //   apiErrorNotify({ error, message });
      //   this.isSavingConsent = false;
      //   return;
      // }

      let params = {servizio: 'CODE'};
      let payload = {
        identificativo_informativa: this.lastPolicyVersion,
        consenso_alimentazione: this.addClinicalData,
        consenso_consultazione: this.showClinicalData,
        consenso_pregresso: this.showPastedClinicalData,

      };

      // Se stiamo aprendo il FSE per un minore => sovrascriviamo il CF ed aggiungiamo il TEAM al payload
      if (this.isDeclarationMode) {
        taxCode = this.minor.codice_fiscale;
        payload.codice_tessera_team = `${TEAM_PREFIX}${this.team}`;

      }


      // Se stiamo aprendo il FSE per un delegante => sovrascriviamo il CF
      if (this.isDelegationMode) {
        taxCode = this.delegator.codice_fiscale_delega;

      }

      try {
        // Purtroppo il servizio necessita che la GET del consenso venga necessariamente chiamata
        // prima di effettuare una POST
        await getEnrollmentConsent(taxCode, { params });
        await createEnrollmentConsent(taxCode, payload, { params });
        // this.onStepNext();
      } catch (error) {
        let message = "Non è stato possibile attivare il fascicolo sanitario";
        apiErrorNotify({ error, message });
        this.isSavingConsent = false;
        return
      }

      // Se siamo arrivati fin qui => il salvataggio del consenso è andato a buon fine
      // Se l'utente sta aprendo il FSE per se stesso => proviamo ad aggiornare lo stato del fascicolo
      //                                                 salvato in locale richiedendo i nuovi dati tramite API
      if (!this.isDeclarationMode && !this.isDelegationMode) {
        try {
          let {data:enrollmentInfo } = await getEnrollmentInfo(taxCode, {params});
          this.$store.dispatch("setEnrollmentInfo", { enrollmentInfo });
        } catch (e) {
          // In caso di errore nell'aggiornamento dei dati lo impostiamo manualmente
          let code = this.addClinicalData
            ? ENROLLMENT_CODE_MAP.FSE_APPROVED
            : ENROLLMENT_CODE_MAP.FSE_NOT_APPROVED;

          let enrollmentInfo = {risposta: false, codice_risposta: code, dettaglio_risposta: ''};
          this.$store.dispatch("setEnrollmentInfo", { enrollmentInfo });
        }
      }

      this.isSavingConsent = false;
      this.onStepNext();
    },
    showTeamFindModal() {
      this.isTeamFindModalVisible = true;
    },
    goToHome() {
      window.location.assign("/la-mia-salute/#/");
    },
    goToReferrer() {
      let url = this.referrerApp?.url;
      window.location.assign(url);
    },
    async onCloseDelegation() {
      // Chiudere la delega significa semplicemente rimuovere il parametro "minore" dalla querystring
      // e ricaricare la pagina
      let name = HOME.name;
      let { minore, ...query } = this.$route.query;
      await this.$router.replace({ name, query });
      window.location.reload();
    }
  }
};
</script>

<style lang="stylus"></style>
