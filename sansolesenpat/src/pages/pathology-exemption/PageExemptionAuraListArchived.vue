<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <template v-if="!isLoading">

<!--      <div class="q-mb-md">-->
<!--        <csi-buttons>-->
<!--          <csi-button primary label="Nuova esenzione" @click="onNewExemption"/>-->
<!--        </csi-buttons>-->
<!--      </div>-->
      <!--BOTTONE FILTRI-->
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

      <!-- FILTRI -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->

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

<!--            <div class="col-12 col-md">-->
<!--              <q-field>-->
<!--                <q-select-->
<!--                  float-label="Stato"-->
<!--                  v-model="selectStatus"-->
<!--                  :options="status"-->
<!--                  clearable="">-->
<!--                </q-select>-->
<!--              </q-field>-->
<!--            </div>-->
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


      <!-- ESENZIONI -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->

      <div class="row items-center gutter-sm">
        <div v-if="exemptionList" v-for="exemption in orderedExemptionList" :key="exemption.id" class="col-12">
          <csi-pathology-exemption-aura-list-item
            :exemption="exemption"
            :is-archived="true"
            @click-handle="onHandle(exemption)"
          />
        </div>

        <div class="full-width"  v-if="exemptionList.length===0 ">
          <q-card>
            <q-card-main>
              <csi-banner image-src="statics/images/banners/img_nessun_esenzione_reddito.svg">
                <template slot="text">
                  <p>
                    Non hai ancora alcuna Esenzione in archivio.
<!--                    Per richiederne una ti basterà cliccare il tasto-->
<!--                    "Nuova-->
<!--                    Esenzione" e compilare i campi proposti.-->
                  </p>
                </template>
              </csi-banner>
            </q-card-main>
          </q-card>
        </div>


      </div>
    </template>


    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-inner-loading :visible="isLoading" block/>
  </q-page>
</template>


<script>
    import {
        getAuraExemptionsArchived,
        getExemptionTypes
    } from '@services/api/pathology-exemption'
    import CsiBanner from 'components/global/common/CsiBanner'
    import {notifyError} from "@services/api/utils";
    import CsiPathologyExemptionAuraListItem from "components/pathology-exemption/CsiPathologyExemptionAuraListItem";
    import {orderBy} from "@services/global/utils";

    export default {
        name: 'PageHome',
        components: {CsiPathologyExemptionAuraListItem, CsiBanner},
        data() {
            return {
                selectPathologyType: null,
                selectStatus: null,
                mapPathologyType: [],
                mapStatus: null,
                isLoading: false,
                exemptionList: null,
                exemptionPathologyType: [],
                areFiltersOpen: false
            }
        },
        computed: {
            orderedExemptionList() {
                return orderBy(this.exemptionList, ["data_emissione"], ['desc'])
            },
            user() {
                return this.$store.getters['global/user']
            },
            cf() {
                return this.$store.getters['pathologyExemption/getTaxCode']
            },
            pathologyType() {
                return this.mapPathologyType.map(v => ({label: v.descrizione, value: v.codice, model: v}))
            },
            status() {
                return this.mapStatus.map(c => ({label: c.label, value: c.value, model: c}))
            },
        },
        async created() {
            this.isLoading = true
            this.mapStatus = this.$config.pathologyExemption.mapStatus
            // try {
            //     let response = await getExemptionListArchived(this.cf)
            //     this.exemptionList = response.data
            // } catch (e) {
            //     notifyError(e, 'Al momento non è possibile visualizzare la lista delle esenzioni')
            //     console.error(e)
            // }
            try {

                let response = await getAuraExemptionsArchived(this.cf)
                this.exemptionList = response.data
            } catch (e) {
                notifyError(e, 'Al momento non è possibile visualizzare la lista delle esenzioni')
                console.error(e)
            }
            this.isLoading = false

            let pathologyTypeResponse = await getExemptionTypes(this.cf)
            this.mapPathologyType = pathologyTypeResponse.data
        },
        methods: {
            onHandle(exemption) {
                let name = this.$routes.PATHOLOGY_EXEMPTION.AURA_EXEMPTION_DETAIL.name
                //let params = { emissionDate: exemption.data_emissione, exemptionCode:exemption.codice.codice, expireDate: exemption.data_scadenza, exemption}
                let params = { emissionDate: exemption.data_emissione, exemptionCode:exemption.codice.codice, pathologyCode: exemption.malattia.codice, exemption}
                this.$router.push({name, params})
            },
            toggleFilters() {
                this.areFiltersOpen = !this.areFiltersOpen
            },
            async fetchExemptions() {
                this.isLoading = true
                this.$forceUpdate()
                let filters = {}
                if (this.selectStatus) filters['stato'] = {'eq': this.selectStatus}
                if (this.selectPathologyType) filters['tipologia_esenzione'] = {'eq': this.selectPathologyType}

                let params = {filter: filters}
                try {
                    let response = await getAuraExemptionsArchived(this.cf, {params, _no5XXRedirect: true})
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
            onNewExemption() {
                this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_NEW)
            }
        }
    }
</script>


<style scoped lang="stylus"></style>
