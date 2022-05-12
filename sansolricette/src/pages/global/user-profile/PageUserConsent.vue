<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>

<template>
  <q-page padding>
    <csi-page-title title="Dettaglio consenso" @back="$router.push($routes.GLOBAL.USER_CONSENTS)"/>

    <!-- contenuto del dettaglio -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-consents-list-item v-if="singleConsent"
                            :consentInfo="singleConsent"
                            is-detail
    />

    <csi-inner-loading :visible="isLoading"></csi-inner-loading>
  </q-page>
</template>

<script>
    import
    {
        getInformativaPdf,
        //getConsentsList,
        getConsensiInformativeList,
    } from "@services/api/consents";
    import CsiPageTitle from "components/global/common/CsiPageTitle";
    import CsiConsentsListItem from "components/global/user-profile/CsiConsentsListItem";

    export default {
        name: "PageConsent",
        components: {
            CsiConsentsListItem,
            CsiPageTitle,
        },
        data() {
            return {
                singleConsent: undefined,
                isLoading: false,
                consentStatuss: [],
                asrList: [],
                asrModels: [],
                statusValue: null,
                status: null
            }
        },
        computed: {
            taxCode() {
                return this.$store.getters['consents/getTaxCode']
            }
        },
        async created() {


            this.status = this.$config.consents.availableStatuses;

            let singleConsent = this.$route.params.singleConsent;


            //controllo per refresh pagina
            if (!singleConsent) {
                let user = this.$store.getters['global/user'];
                let cf = user.cf;
                let id = this.$route.params.id;

                this.isLoading = true;

                let response = await getConsensiInformativeList(cf);
                let consentList = response.data;
                singleConsent = consentList.filter(c => c.informativa.id_informativa.toString() === id)[0]

                this.isLoading = false;


            }
            this.singleConsent = singleConsent;

            //let statussPromise = await getConsentsStatesList();
            //this.consentStatuss = statussPromise.data;
        },

        methods: {

            async download() {
                let user = this.$store.getters['global/user'];
                let pdf = await getInformativaPdf(user.cf);
            },
        },
    }
</script>
