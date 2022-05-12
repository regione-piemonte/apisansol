<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>

    <template v-if="!isLoading">

<!--      FILTRI-->
      <div  class="q-mb-lg">
        <div class="row justify-between items-center">
          <div class="q-pt-md">
            <div

              class="row justify-between gutter-x-xs items-center cursor-pointer"
              @click="toggleFilters">
              <div>
                <q-icon name="filter_list" class="csi-icon--sm"></q-icon>
              </div>
              <div>Filtra per</div>
            </div
            >
          </div>
        </div>
      </div>


      <q-card class="q-mt-md q-mb-md" v-if="areFiltersOpen ">
        <q-card-main>
          <div class="row gutter-x-sm q-mb-md">
            <div class="col-12 col-md">
              <q-field>
                <q-select
                  float-label="Tipo patologia"
                  v-model="selectPathologyType"
                  :options="pathologyType"
                  clearable>
                </q-select>
              </q-field>
            </div>

          </div>

          <!-- bottone filtra -->
          <!-- --------------------------------------------------------------------------------------------------- -->
          <div class="q-pt-md">
            <div class="row justify-end">
              <q-btn @click="fetchExemptions" outline color="primary">Filtra</q-btn>
            </div>
          </div>
        </q-card-main>
      </q-card>
      <!-- AZIONI -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <div class="q-mb-md">
        <csi-buttons>
<!--          <csi-button primary label="Nuova esenzione" @click="onNewExemption"/>-->
<!--          <csi-button :loading="loadingDownload" v-if="exemptionList && attestati " secondary label="Scarica attestati" @click="downloadAttestati"/>-->
        </csi-buttons>
      </div>

      <!-- LISTA ESENZIONI -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <div class="row items-center gutter-sm">

        <div v-if="exemptionList && exemptionList.length>0" v-for="(exemption,index) in orderedExemptionList" :key="exemption.id" class="col-12">
          <csi-pathology-exemption-aura-list-item
            :exemption="exemption"
            @click-handle="onHandle(exemption)"
          />
        </div>


        <!--caso stato vuoto -->

        <div class="full-width" v-if="exemptionList.length===0">
          <q-card >
            <q-card-main>
              <csi-banner image-src="statics/images/banners/img_nessun_esenzione_reddito.svg">
                <template slot="text">
                  <p>
                    Non è stata trovata alcuna Esenzione.
<!--                    Per richiederne una ti basterà cliccare il tasto-->
<!--                    "Nuova-->
<!--                    Esenzione" e compilare i campi proposti.-->
                  </p>
                  <!--<div v-if="!isLocked" class="text-center">
                    <q-btn @click="$router.push($routes.INCOME_EXEMPTION.NEW)" color="primary">Nuova esenzione</q-btn>
                  </div>-->
                </template>
              </csi-banner>
            </q-card-main>
          </q-card>
        </div>

      </div>
    </template>


    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-inner-loading :visible="isLoading"/>

  </q-page>
</template>


<script>
    import {
        getAttestatiPdf, getAuraExemptionsActive,
        getExemptionListActive, getExemptionListArchived,
        getStatusList,
        getTipologiaDocumenti
    } from "@services/api/pathology-exemption";
    import {getExemptionTypes} from "@services/api/pathology-exemption";
    import CsiPathologyExemptionListItem from "components/pathology-exemption/CsiPathologyExemptionListItem";
    import CsiBanner from "components/global/common/CsiBanner";
    import {notifyError} from "@services/api/utils";
    import CsiPathologyExemptionAuraListItem from "components/pathology-exemption/CsiPathologyExemptionAuraListItem";
    import {orderBy} from "@services/global/utils";

    export default {
        name: 'PageHome',
        components: {CsiPathologyExemptionAuraListItem, CsiPathologyExemptionListItem, CsiBanner},
        data() {
            return {
                areFiltersOpen: false,
                attestati: false,
                type: [],
                statusList: [],
                isLoading: false,
                exemptionList: null,
                loadingDownload: false,
                exemptionListDeactivated: [],
                selectPathologyType: null,
                mapPathologyType: [],
            };
        },
        computed: {
            orderedExemptionList() {
                return orderBy(this.exemptionList, ["data_emissione"], ['desc'])
            },
            pathologyType() {
                return this.mapPathologyType.map(v => ({label: v.descrizione, value: v.codice, model: v}))
            },
            atLeastOneDownloadable(){
                this.exemptionList.find(e => e.stato.codice)
            },

            user() {
                return this.$store.getters['global/user']
            },
            cf() {
                return this.$store.getters['pathologyExemption/getTaxCode']
            },
        },
        watch: {

            cf: {

                async handler() {
                    this.isLoading = true
                    //let responseType = await getExemptionTypes();
                    try {
                        let response = await getAuraExemptionsActive(this.cf, {_no5XXRedirect: true})

                        this.exemptionList = response.data
                        console.log(this.exemptionList)
                        if(this.exemptionList.length >0 && this.exemptionList.filter(a=>a.stato.codice==='VAL' || a.stato.codice==='VIS' ||a.stato.codice==='INS' ).length >0){
                            this.attestati=true
                        }

                    } catch (e) {
                        notifyError(e, 'Al momento non è possibile visualizzare la lista delle esenzioni')
                        console.error(e)

                    }
                    try {
                        let statusListPromise = await getStatusList()
                        this.statusList = statusListPromise.data
                    }catch(e){
                        console.error(e)
                    }
                    this.isLoading = false
                }
            }
        },
        async created() {
            this.isLoading = true
            let pathologyTypeResponse = await getExemptionTypes(this.cf)
            this.mapPathologyType = pathologyTypeResponse.data
            //let responseType = await getExemptionTypes();
            try {
                let response = await getAuraExemptionsActive(this.cf, {_no5XXRedirect: true})

                this.exemptionList = response.data
                console.log(this.exemptionList)
                if(this.exemptionList.length >0 && this.exemptionList.filter(a=>a.stato.codice==='VAL' || a.stato.codice==='VIS' ||a.stato.codice==='INS' ).length >0){
                    this.attestati=true
                }

            } catch (e) {
                notifyError(e, 'Al momento non è possibile visualizzare la lista delle esenzioni')
                console.error(e)

            }


            try {
                let statusListPromise = await getStatusList()
                this.statusList = statusListPromise.data
            }catch(e){
                console.error(e)
            }
            this.isLoading = false

        },
        methods: {
            async fetchExemptions() {
                this.isLoading = true
                this.$forceUpdate()
                let filters = {}
                if (this.selectPathologyType) filters['tipologia_esenzione'] = {'eq': this.selectPathologyType}

                let params = {filter: filters}
                try {
                    let response = await getAuraExemptionsActive(this.cf, {params, _no5XXRedirect: true})
                    this.exemptionList = response.data
                } catch (e) {
                    console.error(e)
                    this.exemptionList = []
                    this.$q.notify({
                        color: 'negative',
                        message: "Nessun risultato trovato"
                    })
                }
                this.isLoading = false
            },
            toggleFilters() {
                this.areFiltersOpen = !this.areFiltersOpen
            },
            async downloadAttestati() {
                this.loadingDownload=true
                try {
                    setTimeout(this.downloading, 3000)
                    let response = await getAttestatiPdf(this.cf, {_no5XXRedirect: true})

                }catch(e){
                    console.error(e)
                    this.loadingDownload=false
                }

            },
            downloading() {
                this.loadingDownload = !this.loadingDownload
            },
            onHandle(exemption) {

                let name = this.$routes.PATHOLOGY_EXEMPTION.AURA_EXEMPTION_DETAIL.name
                //let params = { emissionDate: exemption.data_emissione, exemptionCode:exemption.codice.codice, expireDate: exemption.data_scadenza, exemption}
                let params = { emissionDate: exemption.data_emissione, exemptionCode:exemption.codice.codice, pathologyCode: exemption.malattia.codice, exemption}
                this.$router.push({name, params})
            },
            onNewExemption() {
                this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_NEW)
            }
        },
    }
</script>


<style scoped lang="stylus"></style>

