<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus">
</style>
<template>
  <q-page class="q-pa-md">
    <div v-if="!isLoading">

      <!--BOTTONE FILTRI-->

      <!-- <div>
         <div class="row justify-between items-center">
           <div class="q-pt-md">
             <div v-if="consentsInfoList.length > 0 " @click="toggleFilters"
                  class="row justify-between gutter-x-xs items-center cursor-pointer">
               <div>
                 <q-icon name="filter_list" class="csi-icon--sm"></q-icon>
               </div>
               <div>Filtra per</div>
             </div>
           </div>
         </div>

       </div> -->

      <!-- FILTRI -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <!--<q-slide-transition>
        <q-card class="q-mt-md" v-if="areFiltersOpen">
          <q-card-main>
            <div class="row q-mb-md">

              <div class="col-12 col-md">
                <q-field class="q-mr-md">
                  <q-select
                    float-label="Data"
                    v-model="selectTimeSpan"
                    :options="timeSpan"
                    clearable>
                  </q-select>
                </q-field>
              </div>

              <div class="col-12 col-md">
                <q-field class="q-mr-md">
                  <q-select
                    float-label="Stato"
                    v-model="selectStatus"
                    :options="status"
                    clearable="">
                  </q-select>
                </q-field>
              </div>

              <div class="col-12 col-md">
                <q-field class="q-mr-md">
                  <q-select
                    float-label="Tipologia"
                    v-model="selectType"
                    :options="type"
                    clearable="">
                  </q-select>
                </q-field>
              </div>

              <div class="col-12 col-md">
                <q-field class="q-mr-md">
                  <q-select
                    float-label="Validità"
                    v-model="selectValidationType"
                    :options="ValidationType"
                    clearable="">
                  </q-select>
                </q-field>
              </div>

            </div> -->

      <!-- bottone filtra -->
      <!-- --------------------------------------------------------------------------------------------------- -->
      <!--<div class="-q-pt-xl">
        <div class="row justify-end">
          <q-btn @click="fetchConsents" outline color="primary">Filtra</q-btn>
        </div>
      </div>
    </q-card-main>
  </q-card>

</q-slide-transition> -->

      <!-- consentsList vuota -->
      <!-- --------------------------------------------------------------------------------------------------------- -->

      <div v-if="isEmpty(consentsInfoList)" class="flex-center">
        <q-card>
          <q-card-main>
            <csi-banner image-src="statics/images/banners/delegators-empty.svg">
              <template slot="text">
                <p>Non hai informative da visualizzare</p>
              </template>
            </csi-banner>
          </q-card-main>
        </q-card>
      </div>
      <template v-else>

        <!-- elementi lista -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <csi-consents-list-item
          v-for="(consentInfo, index) in consentsInfoList"
          :key="index"
          :consentInfo="consentInfo"
          @handle="goToDetail"

        />
      </template>
    </div>


    <!-- LOADER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-inner-loading :visible="isLoading">
      <q-spinner-mat size="50px" color="primary"></q-spinner-mat>
    </q-inner-loading>

  </q-page>

</template>

<script>
    import {
        getConsentsValidationTypeList,
        //getConsentsList,
        getAsr,
       // getInfoList,
        getConsentsStatesList,
        getConsentsTypeList, getConsensiInformativeList,
    } from "@services/api/consents";
    import {CsiApiFilterBuilder} from "@services/global/csi-api-filter-builder";
    import CsiModalFileViewer from "components/global/common/CsiModalFileViewer";

    import CsiBanner from "components/global/common/CsiBanner";
    import CsiModalPolicy from "components/global/common/CsiModalPolicy";
    import CsiPolicy from "components/global/common/CsiPolicy";
    import CsiConsentsListItem from "components/global/user-profile/CsiConsentsListItem";
    import {isEmpty} from "@services/global/utils";
    import {notifyError} from "@services/api/utils";

    export default {
        name: 'PageConsentsHome',
        components: {CsiConsentsListItem, CsiPolicy, CsiModalFileViewer, CsiModalPolicy, CsiBanner},
        data() {
            return {
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


            }
        },
        computed: {

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
            }
        },

        methods: {
            isEmpty,
            toggleFilters() {

                this.areFiltersOpen = !this.areFiltersOpen;
            },

            //ricerca consenso con filtro
            async fetchConsents() {
                this.isLoading = true;
                let filter = new CsiApiFilterBuilder();
                if (this.selectStatus) filter.eq('consenso__tipo_stato__codice', this.selectStatus);
                if (this.selectType) filter.eq('informativa__sotto_tipo_consenso__codice', this.selectType);
                if (this.selectValidationType) filter.eq('informativa__tipo_consenso__codice', this.selectValidationType);

                let comparisonDate = new Date();
                let comparisonMonth = comparisonDate.getMonth();
                comparisonDate.setMonth(comparisonMonth - this.selectTimeSpan);
                if (this.selectTimeSpan) filter.gt('data_acquisizione', comparisonDate);
                let filters = filter.build();
                let params = {filter: filters};
                let response = await getConsensiInformativeList(this.taxCode, {params});
                this.consentsInfoList = response.data;
                this.isLoading = false;
                return response.data;

            },

            //vai al dettaglio singolo consenso
            goToDetail(item) {
                let params = {id: item.informativa.id_informativa, singleConsent: item};
                let route = {name: this.$routes.GLOBAL.USER_CONSENT_DETAIL.name, params};
                this.$router.push(route);


            },

            async loadConsents() {
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
                    notifyError(e, 'Non è stato possibile caricare le informative')
                }
                this.isLoading = false;
            }
        },
        async created() {


            // let validationTypePromise = getConsentsValidationTypeList();
            // let statussPromise = getConsentsStatesList();
            // let typesPromise = getConsentsTypeList();
            await this.loadConsents();
            // validationTypePromise = await validationTypePromise;
            // statussPromise = await statussPromise;
            // typesPromise = await typesPromise;
            // this.consentStatuss = statussPromise.data;
            // this.consentValidationType = validationTypePromise.data;
            // this.consentsTypes = typesPromise.data;

        },
        watch: {
            taxCode: {
                handler() {
                    this.loadConsents();
                }
            }
        },


    }
</script>
