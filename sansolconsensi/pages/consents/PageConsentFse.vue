<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <csi-page-title
      class="q-mb-lg"
      title="Dettaglio consenso"
      @back="$router.push($routes.CONSENTS.HOME)"
    />

    <template v-if="!isLoading">
      <q-card>
        <!-- BARRE COLORATE -->
        <template v-if="isActive">
          <csi-bar bg-color="green-2">
            <template v-if="isVisible">
              Attivo e visibile agli operatori sanitari
            </template>

            <template v-else>
              Attivo ma non visibile agli operatori sanitari
            </template>
          </csi-bar>
        </template>

        <template v-if="!isActive">
          <csi-bar bg-color="grey-2">
            Non attivo
          </csi-bar>
        </template>

        <div class="q-pa-md">
          <!-- TITOLO -->
          <!-- ------ -->
          <div class="csi-h4">
            <span class="text-weight-bold">
              Piattaforma Fascicolo Sanitario Elettronico
            </span>
          </div>

          <!-- DESCRIZIONE -->
          <!-- ----------- -->
          <div class="q-mt-lg">
            Il Fascicolo Sanitario Elettronico (FSE) è lo strumento attraverso il quale il cittadino può tracciare e
            consultare tutta la storia della propria vita sanitaria, <span
            class="text-weight-bold">condividendola</span> con i professionisti sanitari. <br/>
            Raccoglie i <span class="text-weight-bold">dati e documenti clinici</span> generati dalle strutture
            sanitarie dell’intero territorio nazionale.
          </div>

          <div class="q-mt-md">
            Il Decreto Rilancio n.34 del 19/05/2020 ha rivisto l’obbligo di espressione di esplicito consenso informato
            per la costituzione del Fascicolo Sanitario. <br>
            Pertanto sono attivi i Fascicoli Sanitari degli assistiti <span class="text-weight-bold">maggiorenni</span>
            della Regione Piemonte. <br>
            E’ facoltà del cittadino fornire o negare il consenso alla consultazione dei documenti contenuti nel proprio
            Fascicolo verso i professionisti sanitari.
          </div>

          <q-card-separator class="q-my-lg"/>

          <!-- CONSENSO ALLA CONSULTAZIONE -->
          <!-- --------------------------- -->
          <div class="text-weight-bold">
            Consenso alla consultazione dei dati e documenti del Fascicolo Sanitario Elettronico da parte dei
            professionisti sanitari.
          </div>

          <div class="q-mt-md">
            Per permettere la consultazione dei dati e documenti contenuti nel FSE al <span class="text-weight-bold">professionista sanitario</span>
            <q-btn color="primary" dense flat icon="info" round @click="showHealtcareProfessionalsModal"/>
            ,
            viene richiesto di esprimere uno specifico consenso. <br>
            Il mancato conferimento del consenso alla consultazione non comporta in ogni caso alcuna conseguenza sulla
            garanzia dell’erogazione delle prestazioni del servizio sanitario nazionale. <br>
            E’ inoltre sempre possibile, pur avendo fornito il consenso alla consultazione del proprio FSE, decidere di
            non far conoscere solo alcuni dati e documenti clinici mediante <span class="text-weight-bold">l’oscuramento puntuale sul singolo documento
            o su gruppi di dato come nel caso delle Esenzioni per Patologia e delle misurazioni registrate nel Taccuino.</span>
            <br>
            In questo caso il sistema garantisce che nessun professionista sanitario venga a conoscenza dell’esistenza
            di tali dati e del fatto che è stata espressa la volontà di oscurarli.
          </div>

          <div class="q-mt-xl">
            <div class="row gutter-md">
              <div class="col-12 col-md">
                <q-radio
                  v-model="isAccepted"
                  :val="true"
                  color="green-6"
                  label="Acconsento ai professionisti sanitari ad accedere ai dati e documenti presenti nel mio Fascicolo Sanitario Elettronico"
                />
              </div>

              <div class="col-12 col-md">
                <q-radio
                  v-model="isAccepted"
                  :val="false"
                  color="negative"
                  label="Non acconsento ai professionisti sanitari ad accedere ai dati e documenti presenti nel mio Fascicolo Sanitario Elettronico"
                />
              </div>
            </div>
          </div>


          <!-- CONSENSO AL PREGRESSO -->
          <!-- --------------------- -->
          <div class="q-mt-xl">
            <div class="row gutter-md">
              <div class="col-12 col-md">
                <q-radio
                  v-model="isHistoryAccepted"
                  :disable="!isHistoryChangeEnabled"
                  :val="true"
                  color="green-6"
                  label="Acconsento al recupero del pregresso"
                />
              </div>

              <div class="col-12 col-md">
                <q-radio
                  v-model="isHistoryAccepted"
                  :disable="!isHistoryChangeEnabled"
                  :val="false"
                  color="negative"
                  label="Non acconsento al recupero del pregresso"
                />
              </div>
            </div>
          </div>

          <q-alert class="q-mt-xl" color="warning">
            Se scegli di revocare il recupero del pregresso, a breve gli eventuali dati precedenti al 19 maggio
            2020 non saranno più disponibili nel fascicolo.
          </q-alert>


          <!-- INFORMATIVA -->
          <!-- ----------- -->
          <div class="q-mt-xl text-weight-bold">
            Informativa
          </div>

          <div>
            <csi-policy :src="policyUrl" class="q-pt-md"/>
          </div>

          <div class="q-mt-lg">
            <q-toggle
              v-model="isPolicyAccepted"
              label="Dichiaro di avere letto ed accettato l'informativa"
            />
          </div>


          <!-- AZIONI -->
          <!-- ------ -->
          <div class="q-mt-xl">
            <csi-buttons>
              <csi-button :loading="isSaving" @click="onSave">Salva</csi-button>
              <csi-button :to="$routes.CONSENTS.HOME" secondary>Indietro</csi-button>
            </csi-buttons>
          </div>
        </div>
      </q-card>
    </template>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-consents-fse-healthcare-professionals-modal v-model="isHealtcareProfessionalsModalVisible"/>

    <!-- LOADER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-inner-loading :visible="isLoading"/>
  </q-page>
</template>

<script>
import CsiPageTitle from "components/global/common/CsiPageTitle";
import {getConsenso, getLastPolicyVersionPdfUrl, saveConsenso} from "@services/api/enrollment";
import CsiBar from "components/global/common/CsiBar";
import CsiPolicy from "components/global/common/CsiPolicy";
import {deepClone} from "@services/global/utils";
import {notifyError, notifySuccess} from "@services/api/utils";
import CsiConsentsFseHealthcareProfessionalsModal
  from "components/consents/CsiConsentsFseHealthcareProfessionalsModal";
import {getArruolabilita} from "../../services/api/enrollment";
import {createAudit} from "../../services/api/online-reports";

export default {
  name: "PageConsentFse",
  components: {CsiConsentsFseHealthcareProfessionalsModal, CsiPolicy, CsiBar, CsiPageTitle},
  data() {
    return {
      isLoading: false,
      isSaving: false,
      consent: null,
      isAccepted: null,
      isHistoryAccepted: null,
      isHistoryChangeEnabled: true,
      isPolicyAccepted: false,
      isHealtcareProfessionalsModalVisible: false,
    }
  },
  computed: {
    taxCode() {
      return this.$store.getters['consents/getTaxCode']
    },
    enrollmentInfo() {
      return this.$store.getters['consents/getActiveUserEnrollmentInfo']
    },
    isActiveUserEnrolled() {
      let codes = [this.$config.enrollment.codes.FSE_APPROVED];
      return this.enrollmentInfo && codes.includes(this.enrollmentInfo.codice_risposta);
    },
    isActive() {
      return this.isActiveUserEnrolled;
      // return this.consent && this.consent.consenso_alimentazione === true
    },
    isVisible() {
      return this.consent && this.consent.consenso_consultazione === true
    },
    policyUrl() {
      let taxCode = this.taxCode;
      return getLastPolicyVersionPdfUrl(taxCode);
    }
  },
  async created() {
    let {consent} = this.$route.params;
    this.consent = consent || null;

    if (!this.consent) {
      await this.loadConsent();
    }

    if (this.consent) {
      this.isAccepted = this.consent.consenso_consultazione;
      this.isHistoryAccepted = this.consent.consenso_pregresso;
      // this.isHistoryChangeEnabled = !this.consent.consenso_pregresso;
    }
  },
  methods: {
    showHealtcareProfessionalsModal() {
      this.isHealtcareProfessionalsModalVisible = true;
    },
    async loadConsent() {
      let taxCode = this.taxCode;
      let serviceCode = this.$config.enrollment.serviceCodes.consents;
      // let serviceCode = this.$config.global.appServiceCodes.consent;
      let params = {servizio: serviceCode};
      let httpConfig = {params, _no5XXRedirect: true};

      this.isLoading = true;

      try {
        let {data} = await getConsenso(taxCode, httpConfig);
        this.consent = data;
      } catch (error) {
        this.consent = null;
        console.error(error);
      }

      this.isLoading = false
    },
    async onSave() {
      if (this.isAccepted === null) {
        this.$q.notify("Dichiara di acconsentire o meno alla consultazione");
        return;
      }

      if (this.isHistoryAccepted === null) {
        this.$q.notify("Dichiara di acconsentire o meno al pregresso");
        return;
      }

      if (!this.isPolicyAccepted) {
        this.$q.notify("Dichiara di avere letto l'informativa");
        return;
      }

      let taxCode = this.taxCode;
      let params = {servizio: 'FSEDOC'};
      let httpConfig = {params, _no5XXRedirect: true};
      let payload = deepClone(this.consent);
      payload.consenso_consultazione = this.isAccepted;
      payload.consenso_pregresso = this.isHistoryAccepted;

      this.isSaving = true;

      try {
        let {data} = await saveConsenso(taxCode, payload, httpConfig);
        this.consent = data;

        await this.reload()

        let name = this.$routes.CONSENTS.CONSENT_SUCCESS_FSE.name;
        let params = {consent: data};
        this.$router.push({name, params});
      } catch (error) {
        let message = "Non è stato possibile modificare il consenso.";
        notifyError(error, message);
      }


      this.isSaving = false;
    },
    async reload() {
      this.isLoading = true;
      let activeUserEnrollmentInfo = null
      let params = {servizio: this.serviceCode};
      let httpConfig = {params, _no5XXRedirect: true};

      try {
        let {data} = await getArruolabilita(this.taxCode, httpConfig);
        activeUserEnrollmentInfo = data;
      } catch (e) {
        console.error(e);
        // Se fallisce per CONSENSI => proviamo con la delega di FSEDOC
        params = {servizio: 'FSEDOC'};
        httpConfig = {params, _no5XXRedirect: true};
        let {data} = await getArruolabilita(this.taxCode, httpConfig);
        activeUserEnrollmentInfo = data;
      } finally {
        console.log('dispatch', activeUserEnrollmentInfo)
        this.$store.commit('consents/setActiveUserEnrollmentInfo', activeUserEnrollmentInfo);
      }

      try {
        let taxCode = this.$store.getters['consents/getTaxCode'];
        let payload = {codice_verticale: "CONSENSI"};
        createAudit(taxCode, payload, {_no5XXRedirect: true});
      } catch (error) {
        console.error(error);
      }

      this.isLoading = false;
    },
  },


}
</script>

<style scoped></style>
