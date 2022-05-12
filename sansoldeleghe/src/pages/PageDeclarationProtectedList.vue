<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <template v-if="!isLoading">
      <!-- STATO VUOTO -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <template v-if="isEmpty(declarations)">
        <div class="row items-center justify-center q-mb-lg">
          <div class="col-auto">
            <q-chip color="info" text-color="black" >
              <strong>
                <span>Non hai tutele</span>
              </strong>
            </q-chip>
          </div>
        </div>
        <div>
          <q-card>
            <q-card-section>
              <lms-banner image-src="images/img_gestione_minori.svg">
                <template slot="text">
                  TODO: testo tutele vuote
                </template>
              </lms-banner>
            </q-card-section>
          </q-card>
        </div>
      </template>


      <!-- STATO PIENO -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <div v-else>

        <!-- LISTA DELEGANTI MINORI -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <div class="csi-group-card">
          <lms-declaration-protection-list-item
            v-for="declaration in declarationProtectedListSorted"
            :key="declaration.uuid"
            :declaration="declaration"
            @detail="onDetail(declaration)"
            @revoke="onRevoke(declaration)"
          />
        </div>
      </div>

      <div class="q-py-md text-right">
        <router-link class="lms-link" :to="POLICY_MINORS">Privacy e condizioni d'uso</router-link>
      </div>
    </template>
    <lms-inner-loading :showing="isLoading" />
  </lms-page>
</template>

<script>
import LmsBanner from "components/core/LmsBanner";
import LmsDeclarationProtectionListItem from "components/LmsDeclarationProtectionListItem";
import {DECLARATION_PROTECTED_DETAIL, DECLARATION_PROTECTED_REVOKE, POLICY_MINORS} from "src/router/routes";
import {getDeclarationProtected} from "src/services/business-logic";
import {getDeclarationProtectionList} from "src/services/api";
import {isEmpty} from "src/services/utils";
export default {
  name: "PageDeclarationProtectedList",
  components: {LmsDeclarationProtectionListItem, LmsBanner},
  data() {
    return {
      POLICY_MINORS,
      isLoading: false,
      isSelectionModalOpen: false,
      declarationsResponse: null,
    };
  },
  computed: {
    taxCode() {
      return this.$store.getters['getTaxCode']
    },
    declarations() {
      if (!this.declarationsResponse) return []
      return this.declarationsResponse.data
    },
    declarationProtectedListSorted() {
      let result = [...this.declarations];

      result.sort((a, b) => {
        let aProtected = getDeclarationProtected(a);
        let bProtected = getDeclarationProtected(b);
        let aFullName = [aProtected.nome, aProtected.cognome].join(' ');
        let bFullName = [bProtected.nome, bProtected.cognome].join(' ');
        return aFullName > bFullName ? 1 : -1
      });

      return result
    }
  },
  async created() {
    this.isLoading = true
    try{
      this.declarationsResponse = await getDeclarationProtectionList(this.taxCode)
    }catch (e) {

    }

    this.isLoading = false
  },
  methods: {
    isEmpty,
    onRevoke(declaration) {
      let name = DECLARATION_PROTECTED_REVOKE.name
      let params = {id: declaration.uuid, declaration}
      this.$router.push({name, params})
    },
    onDetail(declaration) {
      let name = DECLARATION_PROTECTED_DETAIL.name
      let params = {id: declaration.uuid, declaration}
      this.$router.push({name, params})
    }
  }
}
</script>

<style scoped>

</style>
