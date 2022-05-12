<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style></style>


<template>
  <q-page padding>
    <csi-page-title  title="Nuova esenzione" @back="onBack"></csi-page-title>
    <h2 class="q-body-2 csi-h2 q-mt-md " key="subtitle" style="animation-delay: .1s">Per chi è l'esenzione?</h2>
    <div class="row gutter-sm q-mt-md">

      <!-- CREA PER TE -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div class="col-12 col-sm cursor-pointer">
        <transition
          appear
          appear-active-class="animated fadeIn fast">
          <csi-card-selection
            title="Per te"
            @go="$router.push($routes.INCOME_EXEMPTION.NEW_FOR_YOU)">
            <csi-icon-base
              slot="header-icon"
              has-bg
              bg-round
              class="bg-white csi-svg-icon--lg">
              <csi-icon-avatar-person />
            </csi-icon-base>
              Puoi chiedere un esenzione per te, dichiarando, sotto la tua responsabilità, di essere in possesso dei requisiti di reddito
              e delle altre condizioni previste, che danno diritto ad usurfruire dell'esenzione.
          </csi-card-selection>
        </transition>
      </div>

      <!-- CREA PER UN FAMILIARE -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div class="col-12 col-sm cursor-pointer">
        <transition
          appear
          appear-active-class="animated fadeIn">
          <csi-card-selection
            title="Per un componente del tuo nucleo familiare fiscale"
            @go="$router.push($routes.INCOME_EXEMPTION.NEW_FOR_FAMILY)"
            style="animation-delay: 0.1s !important">
            <csi-icon-base
              slot="header-icon"
              has-bg
              bg-round
              class="bg-white csi-svg-icon--lg">
              <csi-icon-people/>
            </csi-icon-base>
            Puoi chiedere l'esenzione per i casi di impedimento previsti dalla vigente normativa, si veda art.4 c.2 e art.5 del DPR 28 Dicembre 2000, n. 445.
          </csi-card-selection>
        </transition>
      </div>

    </div>
  </q-page>
</template>

<script>
  import CsiCardSelection from "components/global/common/CsiCardSelection";
  import CsiIconBase from "components/global/icons/CsiIconBase";
  import CsiIconPeople from "components/global/icons/CsiIconPeople";
  import CsiIconAvatarPerson from "components/global/icons/CsiIconAvatarPerson";
  import {getDisclaimer} from "@services/api/income-exemption";
  import CsiPageTitle from "components/global/common/CsiPageTitle";

  export default {
    name: 'PageNewIncomeExemption',
    components: {CsiIconAvatarPerson, CsiIconPeople, CsiIconBase, CsiCardSelection, CsiPageTitle},
    data() {
      return {}
    },
    created() {
    },
    methods: {
      onBack(){
        this.$router.go(-1)
      }
    },
  }
</script>


