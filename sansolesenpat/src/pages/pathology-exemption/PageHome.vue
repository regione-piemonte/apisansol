<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus"></style>

<template>
  <q-page>

    <q-tabs>
      <q-route-tab
        label="Esenzioni"
        :to="$routes.PATHOLOGY_EXEMPTION.EXEMPTION_AURA_LIST"
        exact
        slot="title">
      </q-route-tab>

      <q-route-tab
        label="Archivio esenzioni"
        :to="$routes.PATHOLOGY_EXEMPTION.EXEMPTION_AURA_LIST_ARCHIVED"
        exact
        slot="title">
      </q-route-tab>

      <q-route-tab
        label="Domande di esenzione"
        :to="$routes.PATHOLOGY_EXEMPTION.EXEMPTION_LIST"
        exact
        slot="title">
      </q-route-tab>

<!--      <q-route-tab-->
<!--        label="Certificati"-->
<!--        :to="$routes.PATHOLOGY_EXEMPTION.CERTIFICATE_LIST"-->
<!--        exact-->
<!--        slot="title">-->
<!--      </q-route-tab>-->
    </q-tabs>

    <keep-alive :include="keepAlive">
      <router-view/>
    </keep-alive>

  </q-page>
</template>


<script>
    import PageExemptionList from "pages/pathology-exemption/PageExemptionList";
    import PageExemptionAuraList from "pages/pathology-exemption/PageExemptionAuraList";
    import PageExemptionListArchived from "pages/pathology-exemption/PageExemptionAuraListArchived";
    import PageCertificateList from "pages/pathology-exemption/PageCertificateList";

    export default {
        name: 'PageHome',
        components: {PageExemptionList, PageExemptionListArchived, PageCertificateList},
        data() {
            return {
                keepAlive: [
                    PageExemptionList.name,
                    PageExemptionListArchived.name,
                    PageExemptionAuraList.name,
                   // PageCertificateList.name
                ],
                isTest: false,
            };
        },
        computed: {
            user() {
                return this.$store.getters['global/user']
            },
        },
        async created() {
            this.isTest=this.$config.global.isDevelopment || this.$config.global.isTest
            console.log(this.$config.global.isProduction)
        },
        methods: {},
    }
</script>
