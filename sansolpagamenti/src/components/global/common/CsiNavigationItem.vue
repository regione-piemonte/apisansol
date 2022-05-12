<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style lang="stylus">
</style>

<template>
  <div class="csi-navigation-item">

    <div v-if="!item.meta.isGroup" class="csi-navigation-item__single">
      <q-item @click.native="goToRoute" :link="canNavigate">
        <!-- Vogliamo un'icona tra quelle dei font-icons -->
        <q-item-side v-if="item.meta.iconName" :icon="item.meta.iconName" style="min-width: 0" />
        <!-- Vogliamo un'icona custom SVG -->
        <q-item-side v-if="item.meta.iconComponent" style="min-width: 0">
          <csi-icon-base class="csi-svg-icon--sm">
            <component :is="item.meta.iconComponent" />
          </csi-icon-base>
        </q-item-side>
        <q-item-main :class="{'text-grey': !canNavigate}">
          <q-item-tile label class="q-body-2" :class="{'text-primary': canNavigate, 'text-grey-8': !canNavigate}">
            {{item.meta.navigationLabel}}
          </q-item-tile>
          <q-item-tile v-if="item.meta.navigationSublabel" sublabel>{{item.meta.navigationSublabel}}</q-item-tile>
        </q-item-main>

        <q-item-side v-if="!canNavigate" right>
          <q-icon name="lock" class="csi-icon--xs"></q-icon>
        </q-item-side>
      </q-item>
    </div>

    <div v-else class="csi-navigation-item__single">
      <q-collapsible>

        <template slot="header">
          <q-item-side v-if="item.meta.iconName" :icon="item.meta.iconName"></q-item-side>
          <q-item-side v-if="item.meta.iconComponent" style="min-width: 0">
            <csi-icon-base class="csi-svg-icon--sm">
              <component :is="item.meta.iconComponent" />
            </csi-icon-base>
          </q-item-side>

          <q-item-main>
            <q-item-tile label class="text-primary q-body-2">{{item.meta.navigationLabel}}</q-item-tile>
            <q-item-tile v-if="item.meta.navigationSublabel" sublabel>{{item.meta.navigationSublabel}}</q-item-tile>
          </q-item-main>
        </template>

        <csi-navigation-item
          v-for="(child, index) in item.children"
          :key="index"
          :item="child"
          :level="level + 1"
        />

      </q-collapsible>
    </div>


    <!-- MODAL ALERT PRENOTAZIONI VISITE ED ESAMI -->
    <q-modal v-model="isMedicalPrescriptionAlertVisible" minimized :content-css="{maxWidth: '800px'}">
      <div class="q-pa-md">
        <q-alert color="info">
          <div class="text-weight-bold">Attenzione:</div>
          Il servizio di prenotazione visite ed esami è in fase di evoluzione, al momento è accessibile solo mediante le
          credenziali imputabili Sistema Piemonte o Torino Facile o smart card/Business Key.
          <a
            href="https://www.regione.piemonte.it/web/temi/sanita/accesso-ai-servizi-sanitari/cosa-serve-per-accedere-ai-servizi-on-line">
            Scopri di più
          </a>
        </q-alert>

        <csi-buttons class="q-mt-md">
          <csi-button label="Continua" @click="goToMedicalReservationApp" />
          <csi-button v-close-overlay secondary label="Annulla" />
        </csi-buttons>

      </div>
    </q-modal>

  </div>
</template>

<script>
    import CsiIconBase from "components/global/icons/CsiIconBase";

    export default {
        name: "CsiNavigationItem",
        components: {CsiIconBase},
        props: {
            item: {type: Object, required: true},
            level: {type: Number, required: true}
        },
        data() {
            return {
                isMedicalPrescriptionAlertVisible: false,
            }
        },
        computed: {
            user() {
                return this.$store.getters['global/user']
            },
            isUserLogged() {
                return this.$store.getters["global/isUserLogged"];
            },
            canNavigate() {
                let isPublic = this.item.route.meta && this.item.route.meta.isPublic;
                return isPublic || this.isUserLogged;
            }
        },
        methods: {
            goToRoute() {

                // if (this.mustShowMedicalReservationAlert(this.item)) {
                //     this.showMedicalPrescriptionAlert()
                //     return
                // }

                if (!this.canNavigate) return;
                this.$router.push(this.item.route);
            },
            goToMedicalReservationApp() {
                this.$router.push(this.$routes.OLD_SERVICES.MEDICAL_RESERVATIONS_APP)
            },
            mustShowMedicalReservationAlert(item) {
                let isMedicalReservation = item.route === this.$routes.OLD_SERVICES.MEDICAL_RESERVATIONS_APP
                return isMedicalReservation && this.isUserLogged && this.user.autenticazione_metodo === 'SPID'
            },
            showMedicalPrescriptionAlert() {
                this.isMedicalPrescriptionAlertVisible = true
            },
            hideMedicalPrescriptionAlert() {
                this.isMedicalPrescriptionAlertVisible = false
            },
        }
    };
</script>
