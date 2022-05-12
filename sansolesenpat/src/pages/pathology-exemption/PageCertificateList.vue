<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus"></style>

<template>
  <q-page padding>
    <template v-if="!isLoading">


      <div class="q-mb-md">
        <csi-buttons>
          <csi-button primary label="Nuova esenzione" @click="onNewExemption"/>
        </csi-buttons>

      </div>

      <div class="row items-center gutter-sm">
        <div v-if="certificateList" v-for="(certificate, index) in certificateList" :key="index" class="col-12">
          <csi-pathology-certificate-list-item :certificate="certificate" :exemption="exemptionList[index]"/>
        </div>
      </div>

      <!-- caso vuoto -->
      <div class="q-pt-md" v-if="!certificateList">
        <q-card>
          <q-card-main>
            <csi-banner image-src="statics/images/banners/img_nessun_esenzione_reddito.svg">
              <template slot="text">
                <p>
                  Non hai ancora alcun Certificato. Quando saranno disponibili appariranno in questa
                  pagina.
                </p>
                <!--<div v-if="!isLocked" class="text-center">
                  <q-btn @click="$router.push($routes.INCOME_EXEMPTION.NEW)" color="primary">Nuova esenzione</q-btn>
                </div>-->
              </template>
            </csi-banner>
          </q-card-main>
        </q-card>
      </div>
    </template>
    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-inner-loading :visible="isLoading"/>
  </q-page>
</template>


<script>
    import CsiPathologyCertificateListItem from "components/pathology-exemption/CsiPathologyCertificateListItem";
    import {getCertificateList, getExemptionDetail} from "@services/api/pathology-exemption";
    import CsiBanner from "components/global/common/CsiBanner";
    import {notifyError} from "@services/api/utils";

    export default {
        name: 'PageHome',
        components: {CsiPathologyCertificateListItem, CsiBanner},
        data() {
            return {
                isLoading: false,
                certificateList: null,
                exemptionList: [],
            };
        },
        computed: {
            user() {
                return this.$store.getters['global/user']
            },
            cf() {
                return this.$store.getters['pathologyExemption/getTaxCode']
            },
        },
        async created() {
            this.isLoading = true
            try {
                let response = await getCertificateList(this.cf)
                this.certificateList = response.data
                for (let i = 0; i < this.certificateList.length; i++) {
                    if (this.certificateList[i].esenzione_id) {
                        let responseExemption = await getExemptionDetail(this.cf, this.certificateList[i].esenzione_id)
                        this.exemptionList.push(responseExemption.data)
                    } else {
                        this.exemptionList.push(null)
                    }

                }
            } catch (e) {
                notifyError(e, 'Al momento non è possibile visualizzare la lista dei certificati')
                console.error(e)
            }
            this.isLoading = false
        },
        methods: {
            onNewExemption() {
                this.$router.push(this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_NEW)
            }

        },
    }
</script>
