<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page class="q-pa-md">
    <template v-if="!isLoading">
      <!-- ARRUOLAMENTO FSE -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <!--      <template v-if="$config.global.isDevelopment || $config.global.isTest">-->
      <!--        <div class="q-mb-lg" v-if="!isActiveUserEnrolled">-->
      <!--          <csi-enrollment-card-->
      <!--            :can-open="canOpenFse()"-->
      <!--            @click-activate="onActivate"-->
      <!--          />-->
      <!--        </div>-->
      <!--      </template>-->

      <!-- CONSENSO FSE -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-if="fseConsent && isFseConsentVisible">
        <csi-consents-list-item-fse :consent="fseConsent" :editable="isFseConsentEditable" class="q-my-md"/>
      </template>

      <!-- SE VIENE SELEZIONATO UN DELEGANTE CHE NON HA LA DELEGA SUI CONSENSI -->
      <!-- => non mostriamo nulla -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-if="isDelegationActive && !isActiveDelegationConsents">
        <!-- Non hai i permessi per visualizzare l'elenco dei consensi -->
      </template>

      <!-- NESSUN CONSENSO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-else-if="isEmpty(consentsInfoList)">
        <div class="flex-center">
          <q-card>
            <q-card-main>
              <csi-banner image-src="statics/images/banners/delegators-empty.svg">
                <template slot="text">
                  <div class="q-pt-md" v-if="isPiedmontUser">Non hai informative da visualizzare</div>
                  <div class="text-center q-pt-md  " v-else> Servizio disponibile solo per i cittadini che hanno
                    l'assistenza sanitaria attiva in Piemonte
                  </div>
                </template>
              </csi-banner>
            </q-card-main>
          </q-card>
        </div>
      </template>

      <!-- LISTA CONSENSI -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-else>
        <!-- ALTRI CONSENSI -->
        <csi-consents-list-item
          v-for="(consentInfo, index) in consentsInfoList"
          :key="index"
          :consentInfo="consentInfo"
          @handle="goToDetail"
        />
      </template>
    </template>


    <!-- LOADER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-inner-loading :visible="isLoading"/>
  </q-page>
</template>

<script>
  import {getConsensiInformativeList} from "@services/api/consents";
  import {CsiApiFilterBuilder} from "@services/global/csi-api-filter-builder";
  import CsiModalFileViewer from "components/global/common/CsiModalFileViewer";

  import CsiBanner from "components/global/common/CsiBanner";
  import CsiModalPolicy from "components/global/common/CsiModalPolicy";
  import CsiPolicy from "components/global/common/CsiPolicy";
  import CsiConsentsListItem from "components/consents/CsiConsentsListItem";
  import {isEmpty} from "@services/global/utils";
  import {notifyError} from "@services/api/utils";
  import {isMinor} from "../../services/global/business-logic";
  import CsiEnrollmentCard from "../../components/enrollment/CsiEnrollmentCard";
  import CsiConsentsFseCard from "../../components/consents/CsiConsentsFseCard";
  import CsiConsentsListItemFse from "components/consents/CsiConsentsListItemFse";
  import {getConsenso} from "@services/api/enrollment";
  import {urlEnrollment} from "../../services/enrollment/business-logic";

  export default {
    name: 'PageConsentsHome',
    components: {
      CsiConsentsListItemFse,
      CsiConsentsFseCard,
      CsiEnrollmentCard,
      CsiConsentsListItem, CsiPolicy, CsiModalFileViewer, CsiModalPolicy, CsiBanner
    },
    data() {
      return {
        isLoadingFseConsent: false,
        fseConsent: null,
        //consents: [],
        modalData: null,
        consentsInfoList: [],
        consentValidationType: [],
        consentStatuss: [],
        asrList: [],
        consentsTypes: [],
        //possibili valori per le date (in mesi)
        timeSpan: [
          {
            label: "Ultimo mese",
            value: 1
          },
          {
            label: "Ultimi 6 mesi",
            value: 6
          },
          {
            label: "Ultimo anno",
            value: 12
          },
          {
            label: "Ultimi 5 anni",
            value: 60
          }
        ],
        areFiltersOpen: false,
        selectTimeSpan: null,
        selectStatus: null,
        selectType: null,
        selectValidationType: null,
        isSelectionModalOpen: [],
        isLoading: false,
        nonPiedmontMessage: false,

        fseConsentInfo: null,
        isFseLoading: false,
        consentSupply: false,
        consentConsultation: false,
        consentPrevious: false,
        isOpenConfirmSupplyDialog: false,
        isLastPolicy: false,
        isChangingConsents: false,
        fseConsents: null
      }
    },
    computed: {
      fseCode() {
        return this.$config.enrollment.serviceCodes.consents
      },
      serviceCode() {
        return this.$config.global.appServiceCodes.pathologyExemption
      },
      isPiedmontUser() {
        return this.$store.getters['global/isPiedmontUser']
      },
      //valori dei filtri
      ValidationType() {
        return this.consentValidationType.map(v => ({label: v.descrizione, value: v.codice, model: v}));
      },
      type() {
        return this.consentsTypes.map(t => ({label: t.descrizione, value: t.codice, model: t}));
      },
      status() {
        return this.consentStatuss.map(s => ({label: s.descrizione, value: s.codice, model: s}));
      },
      asr() {
        return this.asrList.map(a => ({label: a.codice, value: a.id, model: a}));
      },
      taxCode() {
        return this.$store.getters['consents/getTaxCode']
      },
      delegableServices() {
        return this.$store.getters['global/delegableAppServices']
      },
      isActiveUserEnrolled() {
        return (
          this.enrollmentInfo &&
          this.enrollmentInfo.codice_risposta ===
          this.$config.enrollment.codes.FSE_APPROVED
        );
      },
      isDelegationActive() {
        return this.$store.getters["consents/isDelegationActive"];
      },
      enrollmentInfo() {
        return this.$store.getters['consents/getActiveUserEnrollmentInfo']
      },
      activeDelegation() {
        return this.$store.getters['consents/getActiveDelegation']
      },
      isActiveDelegationConsents() {
        return this.$store.getters['consents/isActiveDelegationConsents']
      },
      isActiveDelegationFseDoc() {
        return this.$store.getters['consents/isActiveDelegationFseDoc']
      },
      isActiveDelegationFseDocStrong() {
        return this.$store.getters['consents/isActiveDelegationFseDocStrong']
      },
      isDeclarationActive() {
        return (
          this.isDelegationActive &&
          isMinor(this.activeDelegation.data_nascita_delega)
        );
      },
      isFseConsentVisible() {
        // L'utente attivo è piemontese ed
        // il consenso sull'FSE è visibile se l'utente sta operando per sè
        // oppure se ha la delega su FSEDOC
        let isPiedmont = this.enrollmentInfo && this.enrollmentInfo.codice_risposta !== this.$config.enrollment.codes.NO_PIEDMONT;
        return isPiedmont && (!this.isDelegationActive || this.isActiveDelegationFseDoc);
      },
      isFseConsentEditable() {
        // Il consenso sull'FSE è editabile se l'utente sta operando per sè
        // oppure se ha la delega FORTE su FSEDOC
        return !this.isDelegationActive || this.isActiveDelegationFseDocStrong;
      }
    },
    async created() {

      // let validationTypePromise = getConsentsValidationTypeList();
      // let statussPromise = getConsentsStatesList();
      // let typesPromise = getConsentsTypeList();
      // if(this.isPiedmontUser || this.isDelegationActive) {
      //     await this.loadConsents();
      //
      // }

      // validationTypePromise = await validationTypePromise;
      // statussPromise = await statussPromise;
      // typesPromise = await typesPromise;
      // this.consentStatuss = statussPromise.data;
      // this.consentValidationType = validationTypePromise.data;
      // this.consentsTypes = typesPromise.data;

    },
    watch: {
      taxCode: {
        immediate: true,
        handler() {
          this.loadConsents();
          this.loadFseConsent()
        }
      }
    },
    methods: {
      isEmpty,
      canOpenFse() {
        // true se l'utente corrente (delegante o utente loggato che sia) è arruolabile
        let isEnrollable = this.enrollmentInfo && this.enrollmentInfo.risposta;
        let code = this.enrollmentInfo
          ? this.enrollmentInfo.codice_risposta
          : null;
        let enrollableCodes = [
          this.$config.enrollment.DO_NOT_ASK_ME_AGAIN,
          this.$config.enrollment.codes.FSE_NOT_APPROVED
        ];
        // true se l'utente corrente (delegante o utente loggato che sia) è arruolabile oppure se ha un codice
        // che permette l'arruolamento
        isEnrollable = isEnrollable || enrollableCodes.includes(code);

        // Se la delega non è attiva => basta controllare se l'utente risulta "arruolabile"
        if (!this.isDelegationActive) return isEnrollable;

        // Se la delega è attiva => è possibile aprire il FSE solo per i minori
        return this.isDeclarationActive || isEnrollable;

      },
      toggleFilters() {
        this.areFiltersOpen = !this.areFiltersOpen;
      },
      //ricerca consenso con filtro
      // async fetchConsents() {
      //   // @TODO: quando verrà rilasciato in prod dobbiamo evitare di caricare l'elenco dei consensi
      //   //        se il delegante selezionato non ha la delega sui consensi
      //   // if (this.isDelegationActive && !this.isActiveDelegationConsents) return;
      //
      //   try {
      //     this.isLoading = true;
      //     let filter = new CsiApiFilterBuilder();
      //     if (this.selectStatus) filter.eq('consenso__tipo_stato__codice', this.selectStatus);
      //     if (this.selectType) filter.eq('informativa__sotto_tipo_consenso__codice', this.selectType);
      //     if (this.selectValidationType) filter.eq('informativa__tipo_consenso__codice', this.selectValidationType);
      //
      //     let comparisonDate = new Date();
      //     let comparisonMonth = comparisonDate.getMonth();
      //     comparisonDate.setMonth(comparisonMonth - this.selectTimeSpan);
      //     if (this.selectTimeSpan) filter.gt('data_acquisizione', comparisonDate);
      //     let filters = filter.build();
      //     let params = {filter: filters};
      //     let response = await getConsensiInformativeList(this.taxCode, {params});
      //     this.consentsInfoList = response.data;
      //   } catch (e) {
      //
      //   } finally {
      //     this.isLoading = false;
      //   }
      // },
      //vai al dettaglio singolo consenso
      goToDetail(item) {
        let params = {id: item.informativa.id_informativa, singleConsent: item};
        let route = {name: this.$routes.CONSENTS.CONSENT_DETAIL.name, params};
        this.$router.push(route);


      },
      async loadConsents() {
        // Nel caso in cui venga selezionato un delegante che ha la delega solo su FSEDOC
        // => ripuliamo la lista dei consensi e non facciamo la chiamata
        if (this.isDelegationActive && !this.isActiveDelegationConsents) {
          this.consentsInfoList = [];
          return;
        }

        this.isLoading = true;

        try {
          //let consentsListPromise = getConsentsList(this.taxCode, {params: {limit: 0}});
          let consentsListPromise = await getConsensiInformativeList(this.taxCode, {_no5XXRedirect: true});
          // this.consentsInfoList = consentsListPromise.data;
          this.consentsInfoList = consentsListPromise.data;

          for (let i = 0; i < this.consentsInfoList.length; i++) {
            this.isSelectionModalOpen.push(false);
          }
        } catch (e) {
          console.log(e.response.status)
          if (e.response.status === 502) {
          } else {
            notifyError(e, 'Non è stato possibile caricare le informative')
          }
        } finally {
          this.isLoading = false;
          this.$emit('page-load')
        }
      },
      onActivate() {
        // let name = this.$routes.ENROLLMENT.FLOW.name;
        // let query = {};
        //
        // if (this.isDeclarationActive) {
        //   query = {
        //     minore: this.activeDelegation.codice_fiscale_delega,
        //     servizio: this.$config.global.appServiceCodes.consents
        //   }
        // } else if (this.isDelegationActive) {
        //   query = {
        //     d: this.activeDelegation.codice_fiscale_delega,
        //     servizio: this.$config.global.appServiceCodes.consents
        //   }
        // }
        //
        // this.$router.push({name, query});

        let serviceCode= this.$config.global.appServiceCodes.consents

        let url = urlEnrollment(serviceCode, this.isDeclarationActive, this.isDelegationActive, this.activeDelegation )
        window.location.assign(url);

      },
      async loadFseConsent() {
        // Carichiamo il consenso FSE solo se NON siamo in modalità delega
        // oppure siamo in modalità delega ed il delegante ha la delega su FSEDOC
        let canLoad = true;
        if (this.isDelegationActive) canLoad = this.isActiveDelegationFseDoc;
        if (!canLoad) return;

        let taxCode = this.taxCode;
        let serviceCode = this.$config.enrollment.serviceCodes.consents;
        // let serviceCode = this.$config.global.appServiceCodes.consent;
        let params = {servizio: serviceCode};
        let httpConfig = {params, _no5XXRedirect: true};

        this.isLoadingFseConsent = true;

        try {
          let {data} = await getConsenso(taxCode, httpConfig);
          this.fseConsent = data;
        } catch (error) {
          this.fseConsent = null;
          console.error(error);
        }

        this.isLoadingFseConsent = false
      }
    }
  }
</script>


<style scoped lang="stylus">
</style>
