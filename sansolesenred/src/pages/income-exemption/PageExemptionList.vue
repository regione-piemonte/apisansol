<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>

    <div v-if="!isLoading">

      <template v-if="$config.global.isNewEnrollableActive">
        <div class="q-mb-lg ">
          <csi-enrollment-guard2
            is-esenred-app
            :code="enrollmentCode"
            @click-activate="onActivate"
          />
        </div>
      </template>

      <!-- ALERT DI BLOCCO ESENZIONI -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-alert v-if="isLocked" class="q-mb-lg" color="info">
        <p>
          <strong>Le tue esenzioni per l'anno in corso sono state bloccate</strong>
        </p>
        <p>
          Puoi chiedere lo sblocco e la creazione di nua nuova esnezione creandoti allo sportello della tua ASL di
          competenza.
          <br>
          Diversamente il blocco verrà rimosso in automatico il <strong>{{ unlockDate | format }}</strong>
        </p>
      </q-alert>


      <div class="row justify-between items-center">
        <div class="row justify-between gutter-x-xs items-center cursor-pointer" @click="toggleFilters">
          <div>
            <q-icon class="csi-icon--sm" name="filter_list"></q-icon>
          </div>
          <div>Filtra per</div>
        </div>

        <div v-if="!isLocked && isPiedmontUser" class="text-right">
          <q-btn color="primary" @click="onCreateExemption">Nuova esenzione</q-btn>
        </div>
      </div>


      <!-- FILTRI -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-slide-transition>
        <q-card v-if="areFiltersOpen" class="q-mt-md">
          <q-card-main>
            <q-field class="q-mb-md">
              <q-select
                v-model="selectedExemptionStatus"
                :options="exemptionStatussOptions"
                clearable=""
                float-label="Stato">
              </q-select>
            </q-field>

            <q-field class="q-mb-md">
              <q-select
                v-model="selectedExemptionCode"
                :options="exemptionCodeOptions"
                clearable=""
                float-label="Codice esenzione">
              </q-select>
            </q-field>

            <q-field class="q-mb-md">
              <q-select
                v-model="selectedBeneficiaryCode"
                :options="exemptionBeneficiaryOptions"
                clearable=""
                float-label="Beneficiario">
              </q-select>
            </q-field>

            <q-field class="q-mb-md">
              <q-datetime
                v-model="exemptionStartDate"
                float-label="Dal"
                format="DD MMM YYYY"
                type="date">
              </q-datetime>
            </q-field>

            <q-field class="q-mb-md">
              <q-datetime
                v-model="exemptionEndDate"
                float-label="al"
                format="DD MMM YYYY"
                type="date">
              </q-datetime>
            </q-field>

            <div class="row justify-end">
              <q-btn color="primary" outline="" @click="fetchExemptions">Filtra</q-btn>
            </div>
          </q-card-main>
        </q-card>
      </q-slide-transition>
      <q-alert v-if="filterAreEmpty" class="q-my-md" type="info">
        Nessuna esenzione disponibile, modifica i filtri per impostare una ricerca
      </q-alert>


      <!-- STATO VUOTO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->

      <div v-if="(!exemptions.length && !filterAreEmpty)" class="q-mt-md">

        <q-card>
          <q-card-main>
            <csi-banner image-src="statics/images/banners/img_nessun_esenzione_reddito.svg">
              <template slot="text">
                <p>
                  Per la tua autocertificazione ti basterà selezionare il codice dell'esenzione da reddito e compilare
                  le informazioni richieste. Puoi richiedere un’esenzione non solo per te, ma anche - nei casi di
                  impedimento previsti dalla vigente normativa, si veda art.4 c.2 e art.5 del DPR 28 Dicembre 2000, n.
                  445 - per gli altri componenti del tuo nucleo familiare fiscale.
                  Per compilare una certificazione per il tuo nucleo familiare fiscale ti basterà inserire i relativi
                  dati anagrafici: codice fiscale, cognome, nome, data e comune di nascita.
                  Puoi compilare la tua Autocertificazione velocemente e senza difficoltà."
                </p>
                <!--<div v-if="!isLocked" class="text-center">
                  <q-btn @click="$router.push($routes.INCOME_EXEMPTION.NEW)" color="primary">Nuova esenzione</q-btn>
                </div>-->
              </template>
            </csi-banner>
          </q-card-main>
        </q-card>
      </div>


      <!-- STATO PIENO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div v-else="" class="q-mt-md row gutter-y-sm">
        <div v-for="exemption in exemptions"
             :key="exemption.id"
             class="col-12">
          <csi-exemption-item
            :exemption="exemption"
            no-revoke-action=""
            @detail="goToDetail(exemption)"
            @print="onPrint(exemption)">
          </csi-exemption-item>
        </div>
      </div>
    </div>


    <!-- MODAL PDF -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-modal-file-viewer
      v-model="isPdfModalOpen"
      :blob="blob">
    </csi-modal-file-viewer>


    <!-- LOADER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-inner-loading :visible="isLoading">
      <q-spinner-mat color="primary" size="50px"></q-spinner-mat>
    </q-inner-loading>

  </q-page>
</template>

<script>
import CsiExemptionItem from "components/income-exemption/CsiExemptionItem";
import {
  downloadExemption,
  getExemptionCodes,
  getExemptions,
  getExemptionStatuss,
  getBeneficiaries
} from "@services/api/income-exemption";
import CsiModalFileViewer from "components/global/common/CsiModalFileViewer";
import subYears from 'date-fns/sub_years';
import isAfter from 'date-fns/is_after';
import addYears from 'date-fns/add_years';
import addDays from 'date-fns/add_days';
import CsiBanner from "components/global/common/CsiBanner";
import {notifyError} from "@services/api/utils";
import CsiEnrollmentGuard2 from "../../components/enrollment/CsiEnrollmentGuard2";
import {isMinor} from "../../services/global/business-logic";
import {urlEnrollment} from "../../services/enrollment/business-logic";

export default {
  name: 'PageExemptionList',
  components: {CsiEnrollmentGuard2, CsiModalFileViewer, CsiExemptionItem, CsiBanner},
  data() {
    return {
      areFiltersOpen: false,
      endDate: undefined,
      exemptions: [],
      exemptionCodes: [],
      selectedExemptionCode: null,
      exemptionStatuss: [],
      exemptionBeneficiary: [],
      selectedExemptionStatus: null,
      exemptionStartDate: null,
      exemptionEndDate: null,
      isLoading: false,
      isPdfModalOpen: false,
      blob: null,
      filterAreEmpty: false,
      selectedBeneficiaryCode: null,
    }
  },
  computed: {
    user() {
      return this.$store.getters['global/user']
    },
    isPiedmontUser() {
      return this.$store.getters['global/isPiedmontUser']
    },
    enrollmentCode() {
      return this.activeUserEnrollmentInfo ? this.activeUserEnrollmentInfo.codice_risposta : null;
    },
    activeUserEnrollmentInfo() {
      return this.$store.getters["incomeExemption/getActiveUserEnrollmentInfo"];
    },
    serviceCode() {
      return this.$config.global.appServiceCodes.incomeExemption
    },
    isLocked() {
      return this.$store.getters['incomeExemption/isUserLocked']
    },
    unlockDate() {
      return this.$store.getters['incomeExemption/getUserUnlockDate']
    },
    exemptionCodeOptions() {
      return this.exemptionCodes.map(c => ({
        label: `${c.codice}: ${c.descrizione}`,
        value: c.codice,
        model: c,
      }));
    },
    exemptionStatussOptions() {
      return this.exemptionStatuss.map(s => ({label: s.descrizione, value: s.codice, model: s}));
    },
    exemptionBeneficiaryOptions() {
      return this.exemptionBeneficiary
        .map(b => ({
          label: `${b.nome} ${b.cognome}`,
          value: b.codice_fiscale,
          model: b
        }))
        .sort((a, b) => a.label > b.label ? 1 : -1)
    },
    defaultFilterDates() {
      // La "data limite" è il "prossimo 31 Marzo"
      let now = new Date()

      let limitDate = new Date()
      limitDate.setMonth(2, 31) // 2 = Marzo
      // limitDate.setHours(23)
      // limitDate.setMinutes(59)

      // let start = new Date()
      // start.setMonth(3, 1) //3 = aprile
      // start.setHours(0)
      // start.setMinutes(0)
      // Se abbiamo passato la data limite in questo anno
      // => allora la prossima data limite è quella dell'anno prossimo
      if (isAfter(now, limitDate)) {
        limitDate = addYears(limitDate, 1)
      }
      // start.setFullYear( limitDate.getFullYear() - 1 );

      return {
        end: limitDate,
        start: addDays(subYears(limitDate, 1), 1)
        //start: start
      }
    },


  },
  async created() {
    this.exemptionEndDate = this.defaultFilterDates.end;
    this.exemptionStartDate = this.defaultFilterDates.start;

    this.fetchExemptions()
    let exemptionCodesPromise = getExemptionCodes();
    let exemptionStatussPromise = getExemptionStatuss();
    let exemptionBeneficiariesPromise = getBeneficiaries(this.user.cf);

    let exemptionCodesResponse = await exemptionCodesPromise;
    this.exemptionCodes = exemptionCodesResponse.data;

    let exemptionStatussResponse = await exemptionStatussPromise;
    this.exemptionStatuss = exemptionStatussResponse.data;

    let exemptionBeneficiariesResponse = await exemptionBeneficiariesPromise;
    this.exemptionBeneficiary = exemptionBeneficiariesResponse.data;
  },
  methods: {
    toggleFilters() {
      this.areFiltersOpen = !this.areFiltersOpen;
    },
    async fetchExemptions() {
      this.filterAreEmpty = false
      let user = this.user
      this.isLoading = true;

      // let filters = {
      //     data_inizio_validita: {gte: this.exemptionStartDate},
      //     data_scadenza: {lte: this.exemptionEndDate},
      // }

      let filters = {
        data_scadenza: {gte: this.exemptionStartDate},
        data_inizio_validita: {lte: this.exemptionEndDate},
      }

      if (this.selectedExemptionCode) filters.codice_esenzione = {eq: this.selectedExemptionCode}
      if (this.selectedExemptionStatus) filters.stato = {eq: this.selectedExemptionStatus}
      if (this.selectedBeneficiaryCode) filters.creato_per = {eq: this.selectedBeneficiaryCode}

      let params = {filter: filters};

      try {
        let response = await getExemptions(user.cf, {params, _no5XXRedirect: true});
        this.exemptions = response.data;
      } catch (e) {
        notifyError(e, `Non è stato possibile ottenere la lista di esenzioni`)
      }

      this.isLoading = false;

      if (this.exemptions.length === 0) this.filterAreEmpty = true

      this.$emit('page-load')
    },
    async onPrint(exemption) {
      let user = this.$store.getters['global/user'];
      let id = exemption.id
      let response = await downloadExemption(user.cf, id);
      this.blob = response.data;
      this.isPdfModalOpen = true;
    },
    goToDetail(exemption) {
      let name = this.$routes.INCOME_EXEMPTION.EXEMPTION_DETAIL.name
      let id = exemption.id
      let params = {id, exemption}
      this.$router.push({name, params})
    },
    onCreateExemption() {
      this.$router.push(this.$routes.INCOME_EXEMPTION.NEW)
    },
    onActivate() {
      // let name = this.$routes.ENROLLMENT.FLOW.name;
      // let query = {};
      //
      // this.$router.push({name, query});

      let url = urlEnrollment(this.serviceCode)
      window.location.assign(url);

    },
  },
}
</script>

<style>
</style>
