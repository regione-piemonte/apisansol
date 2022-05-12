<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>

    <template v-if="!isLoading">
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
          <csi-pathology-exemption-list-item
            :exemption="exemption"
            @click-handle="onHandle(exemption)"
          />
        </div>


        <!--caso stato vuoto -->

        <div class="full-width"  v-if="!exemptionList">
          <q-card  >
            <q-card-main>
              <csi-banner image-src="statics/images/banners/img_nessun_esenzione_reddito.svg">
                <template slot="text">
                  <p>
                    Non è stata trovata alcuna domanda di Esenzione.
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
        getAttestatiPdf,
        getExemptionListActive, getExemptionListArchived,
        getStatusList,
        getTipologiaDocumenti
    } from "@services/api/pathology-exemption";
    import {getExemptionTypes} from "@services/api/pathology-exemption";
    import CsiPathologyExemptionListItem from "components/pathology-exemption/CsiPathologyExemptionListItem";
    import CsiBanner from "components/global/common/CsiBanner";
    import {notifyError} from "@services/api/utils";
    import {orderBy} from "@services/global/utils";

    export default {
        name: 'PageHome',
        components: {CsiPathologyExemptionListItem, CsiBanner},
        data() {
            return {
                attestati: false,
                type: [],
                statusList: [],
                isLoading: false,
                exemptionList: null,
                loadingDownload: false,
                exemptionListDeactivated: []
            };
        },
        computed: {
            orderedExemptionList() {
                return orderBy(this.exemptionList, ["data_aggiornamento"], ['desc'])
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
                        let response = await getExemptionListActive(this.cf, {_no5XXRedirect: true})

                        this.exemptionList = response.data
                        console.log(this.exemptionList)
                        if(this.exemptionList.length >0 && this.exemptionList.filter(a=>a.stato.codice==='VAL' || a.stato.codice==='VIS' ||a.stato.codice==='INS' ).length >0){
                            this.attestati=true
                        }

                    } catch (e) {
                        notifyError(e, 'Al momento non è possibile visualizzare la lista delle esenzioni')
                        console.error(e)

                    }
                    //AGGIUNGO CHIAMATA A LISTA DI VECCHIO ARCHIVIO PER AVERE TUTTE LE DOMANDE DI ESENZIONE
                    try {
                        let response = await getExemptionListArchived(this.cf)
                        this.exemptionListDeactivated = response.data
                    } catch (e) {
                        notifyError(e, 'Al momento non è possibile visualizzare la lista delle esenzioni')
                        console.error(e)
                    }

                    if(this.exemptionListDeactivated.length>0){
                        this.exemptionList= this.exemptionList.concat(this.exemptionListDeactivated)
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
            //let responseType = await getExemptionTypes();

            try {
                let response = await getExemptionListActive(this.cf, {_no5XXRedirect: true})

                this.exemptionList = response.data
                console.log(this.exemptionList)
                if(this.exemptionList.length >0 && this.exemptionList.filter(a=>a.stato.codice==='VAL' || a.stato.codice==='VIS' ||a.stato.codice==='INS' ).length >0){
                    this.attestati=true
                }

            } catch (e) {
                notifyError(e, 'Al momento non è possibile visualizzare la lista delle esenzioni')
                console.error(e)

            }

            //AGGIUNGO CHIAMATA A LISTA DI VECCHIO ARCHIVIO PER AVERE TUTTE LE DOMANDE DI ESENZIONE
            try {
                let response = await getExemptionListArchived(this.cf)
                this.exemptionListDeactivated = response.data
            } catch (e) {
                notifyError(e, 'Al momento non è possibile visualizzare la lista delle esenzioni')
                console.error(e)
            }

            if(this.exemptionListDeactivated.length>0){
                this.exemptionList= this.exemptionList.concat(this.exemptionListDeactivated)
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
                let name = this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_DETAIL.name
                let params = {id: exemption.id, exemption}
                this.$router.push({name, params})
            },
            onNewExemption() {
                this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_NEW)
            }
        },
    }
</script>


<style scoped lang="stylus"></style>

