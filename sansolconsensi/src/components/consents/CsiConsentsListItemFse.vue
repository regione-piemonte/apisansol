<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-consents-list-item-fse">

    <template v-if="!isActive">
      <template v-if="!$config.global.isNewEnrollableActive">
        <csi-enrollment-card
          required-on-service
          :can-open="canOpenFse"
          @click-activate="onActivate"
        />
      </template>
    </template>
    <q-card v-else>
      <!-- BARRE COLORATE -->
      <template v-if="!editable">
        <csi-bar bg-color="grey-2">
          Non modificabile
        </csi-bar>
      </template>

      <template v-else-if="isActive">
        <csi-bar bg-color="green-2">
          <template v-if="isVisible">
            Attivo e visibile agli operatori sanitari
          </template>

          <template v-else>
            Attivo ma non visibile agli operatori sanitari
          </template>
        </csi-bar>
      </template>

      <template v-else-if="!isActive">
        <csi-bar bg-color="grey-2">
          Non attivo
        </csi-bar>
      </template>

      <div class="q-pa-md">
        <!-- TITOLO -->
        <div class="csi-h4">
          <span class="text-weight-bold">
            Piattaforma Fascicolo Sanitario Elettronico
          </span>
        </div>

        <!-- ABSTRACT -->
        <div class="q-mt-lg">
          Il Fascicolo Sanitario Elettronico (FSE) è lo strumento attraverso il quale il cittadino può tracciare e
          consultare tutta la storia della propria vita sanitaria, <span
          class="text-weight-bold">condividendola</span> con i professionisti sanitari. <br/>
          Raccoglie i <span class="text-weight-bold">dati e documenti clinici</span> generati dalle strutture
          sanitarie dell’intero territorio nazionale.
        </div>

        <div class="q-mt-xl">
          <div class="row items-center gutter-sm">
            <div class="col-12 col-sm-auto">
<!--              <a href="#" class="csi-link" @click.prevent.stop="openModal()">Informativa completa</a>-->
              <router-link class="csi-link" :to="CONSENT_POLICY_FSE">Informativa completa</router-link>
            </div>

            <template v-if="editable">
              <div class="col-12 col-sm">
                <csi-buttons>
                  <csi-button :to="detailRouteLink">
                    Gestisci
                  </csi-button>
                </csi-buttons>
              </div>
            </template>
          </div>
        </div>
      </div>
    </q-card>


    <!-- MODALE INFORMATIVA -->
    <q-modal v-model="isModalOpened" :content-css="{width: '800px', height: '80vh'}">
      <q-modal-layout class="bg-grey-2">
        <q-toolbar slot="header">
          <q-toolbar-title>
            Testo integrale
          </q-toolbar-title>
          <q-btn flat round icon="close" v-close-overlay></q-btn>
        </q-toolbar>

        <div class="q-pa-md">
          <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <csi-policy :src="policyUrl" :iframe-styles="{height: '60vh'}" class="q-pt-md"/>
          </transition>
        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>

<script>
  import CsiBar from "components/global/common/CsiBar";
  import CsiPolicy from "components/global/common/CsiPolicy";
  import {getLastPolicyVersionPdfUrl} from "@services/api/enrollment";
  import CsiEnrollmentCard from "../enrollment/CsiEnrollmentCard";
  import {isMinor} from "../../services/global/business-logic";
  import {CONSENT_POLICY_FSE} from "../../router/routes/consents";
  import {urlEnrollment} from "../../services/enrollment/business-logic";

  export default {
    name: "CsiConsentsListItemFse",
    components: {CsiEnrollmentCard, CsiBar, CsiPolicy},
    props: {
      consent: {type: Object, required: false, default: () => null},
      editable: {type: Boolean, required: false, default: false},
    },
    data() {
      return {
        isModalOpened: false,
        CONSENT_POLICY_FSE
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      taxCode() {
        return this.$store.getters['consents/getTaxCode']
      },
      enrollmentInfo() {
        return this.$store.getters['consents/getActiveUserEnrollmentInfo']
      },
      isActiveUserEnrolled() {
        let codes = [this.$config.enrollment.codes.FSE_APPROVED];
        // Con la gestione del nuovo arruolamento vogliamo che la card di gestione
        // del consenso FSE sia visibile anche per questi codici di arruolamento
        if (this.$config.global.isNewEnrollableActive) {
          codes.push('000', '002', '004', '005', '008', '010', '016');
        }
        return this.enrollmentInfo && codes.includes(this.enrollmentInfo.codice_risposta);
      },
      isActive() {
        return this.isActiveUserEnrolled;
        // return this.consent && this.consent.consenso_alimentazione === true
      },
      isVisible() {
        return this.consent && this.consent.consenso_consultazione === true
      },
      policyUrl() {
        let taxCode = this.taxCode;
        return getLastPolicyVersionPdfUrl(taxCode);
      },
      detailRouteLink() {
        let name = this.$routes.CONSENTS.CONSENT_DETAIL_FSE.name;
        let params = {consent: this.consent};
        return {name, params};
      },
      isActiveUserEnrollable() {
        return (
          this.enrollmentInfo && this.enrollmentInfo.risposta
        );
      },
      isDelegationActive() {
        return this.$store.getters['consents/isDelegationActive']
      },
      activeDelegation() {
        return this.$store.getters['consents/getActiveDelegation']
      },
      isDeclarationActive() {
        return this.isDelegationActive && isMinor(this.activeDelegation.data_nascita_delega)
      },
      canOpenFse() {
        // true se l'utente corrente (delegante o utente loggato che sia) è arruolabile
        let isEnrollable = this.isActiveUserEnrollable
        let code = this.isActiveUserEnrollable ? this.isActiveUserEnrollable.codice_risposta : null;
        let enrollableCodes = [this.$config.enrollment.DO_NOT_ASK_ME_AGAIN, this.$config.enrollment.codes.FSE_NOT_APPROVED];
        // true se l'utente corrente (delegante o utente loggato che sia) è arruolabile oppure se ha un codice
        // che permette l'arruolamento
        isEnrollable = isEnrollable || enrollableCodes.includes(code);

        // Se la delega non è attiva => basta controllare se l'utente risulta "arruolabile"
        if (!this.isDelegationActive) return isEnrollable;

        // Se la delega è attiva => è possibile aprire il FSE solo per i minori
        return this.isDeclarationActive;
      },
    },
    created() {
    },
    methods: {
      openModal() {
        this.isModalOpened = true;
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
    },
  }
</script>

<style scoped lang="stylus">
  .frame
    background-color $grey-3
    width 100%
    height 100%
    border 1px solid $grey-5
    border-radius 4px
</style>
