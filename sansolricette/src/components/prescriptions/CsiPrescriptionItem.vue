<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <!--<transition  appear enter-active-class="animated pulse" leave-active-class="animated bounceOutRight"> -->
  <div>
    <q-card>
      <q-card-main class="no-padding">
        <csi-card-item>

          <!-- HEADER -->
          <!-- --------------------------------------------------------------------------------------------------- -->
          <template slot="header" v-if="!detail">
            <div class="row items-center q-px-md q-py-sm">
              <div class="col ">
                Stato: <strong>{{ prescription.stato.nome }}</strong>
              </div>

              <div v-if="canHide" class="col-auto">
                <q-btn flat dense round icon="more_vert" :loading="isHiding">
                  <q-popover>
                    <q-list link>
                      <q-item v-close-overlay @click.native="showIsToHide">
                        Nascondi
                      </q-item>
                    </q-list>
                  </q-popover>
                </q-btn>
              </div>
            </div>
          </template>

          <!-- PRIMARY -->
          <!-- --------------------------------------------------------------------------------------------------- -->
          <template slot="primary">
            <csi-card-item-primary>
              <template slot="icon">
                <div class="col-auto col-sm-12" :class="{'text-center': $q.screen.gt.xs,}">
                  <csi-icon-base class="csi-svg-icon--lg">
                    <csi-icon-drugs v-if="isPharmaceutical"/>
                    <csi-icon-stethoscope v-else/>
                  </csi-icon-base>
                </div>
              </template>

              <template slot="text">
                <div class="q-pa-xs" :class="{'text-center': $q.screen.gt.xs,}">
                  <strong v-if="isPharmaceutical" class="text-primary">Farmaceutica</strong>
                  <strong v-else class="text-primary">Specialistica</strong>
                </div>

                <div class="q-pa-xs" :class="{'text-center': $q.screen.gt.xs,}">
                  Prescritta il: <strong>{{ prescription.data_compilazione | format}}</strong>
                </div>

                <div v-if="!prescription.regionale" class="q-pa-xs">
                  prescritta fuori piemonte
                </div>
              </template>
            </csi-card-item-primary>
          </template>


          <!-- SECONDARY -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template slot="secondary">

            <!-- LISTA PRESCRIZIONI -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <template v-if="performances.length > 0">
              <div class="row gutter-y-sm gutter-x-xs  q-py-sm" v-if="!detail">
                <div class="col-auto">
                  <csi-prescription-performance-item
                    :performance="firstPerformance"
                    :is-pharmaceutical="isPharmaceutical"
                    :detail=false

                  />
                </div>


                <!-- Mostriamo solo la prima prescrizione -->
                <!-- Tutte le altre le mettiamo in un popover -->
                <div v-if="performances.length > 1" class="col-auto q-ml-md">
                  <a
                    href="#"
                    class="text-primary text-weight-bold"
                    style="text-decoration: none"
                    @click.prevent="showPerformancesPopover"
                  >
                    <template v-if="performances.length === 2"> e un'altra prescrizione</template>
                    <template v-else>e altre {{performances.length - 1}} prescrizioni</template>

                    <q-popover v-model="isPerformancesPopoverVisible">
                      <q-list>
                        <csi-prescription-performance-item
                          v-for="performance in otherPerformances"
                          :key="`${performance.codice_catalogo_regionale}-${performance.codice_aic}-${performance.codice_gruppo_equivalenza}`"
                          :performance="performance"
                          :is-pharmaceutical="isPharmaceutical"
                          :detail=false
                          class="q-pa-sm"
                        />
                      </q-list>
                    </q-popover>
                  </a>
                </div>
              </div>
            </template>

            <!-- NUMERO RICETTA E PRIORITA' -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="row gutter-y-xs gutter-x-lg q-px-md" v-if="!detail">

              <div class="col-auto row items-center gutter-x-xs">
                <div class="col-auto">
                  <csi-icon-base class="csi-svg-icon--lg">
                    <csi-icon-prescription/>
                  </csi-icon-base>
                </div>

                <div class="col">
                  <div>N° ricetta elettronica</div>
                  <div>
                    <strong> {{ prescription.nre }}</strong>
                  </div>
                </div>
              </div>

              <div v-if="!isPharmaceutical && prescription.priorita" class="col-auto row items-center gutter-x-xs">
                <div class="col-auto">
                  <csi-icon-base class="csi-svg-icon--lg">
                    <csi-icon-rocket/>
                  </csi-icon-base>
                </div>

                <div class="col">
                  <div>Priorità</div>
                  <div>
                    <strong>{{ prescription.priorita.codice }}</strong>
                    <q-tooltip>{{prescription.priorita.descrizione}}</q-tooltip>
                  </div>
                </div>
              </div>

            </div>

            <!-- TABS NEL DETTAGLIO -->
            <!-- ------------------------------------------------------------------------------------------------- -->
            <q-tabs v-if="detail">

              <q-tab slot="title" name="detail" label="Dettaglio" default/>
              <q-tab slot="title" name="barCode" label="Bar code"/>

              <!-- TAB DETTAGLIO -->
              <!-- ----------------------------------------------------------------------------------------------- -->
              <q-tab-pane class="q-pl-none" name="detail">
                <div class="q-ml-md">
                  Stato<strong> {{ prescription.stato.nome }}</strong>
                </div>

                <div class="q-mt-md">
                  <csi-prescription-performance-item
                    v-for="performance in performances"
                    :key="`${performance.codice_catalogo_regionale}-${performance.codice_aic}-${performance.codice_gruppo_equivalenza}`"
                    :performance="performance"
                    :is-pharmaceutical="isPharmaceutical"
                    :detail=true
                    class="q-mt-sm"
                  />
                </div>
                <div class="q-pl-md">
                  <div class="row gutter-y-xs gutter-x-sm q-mt-md">
                    <div class="col-12 col-md">
                      N° ricetta: <strong> {{ prescription.nre }}</strong>
                    </div>
                    <div v-if="!isPharmaceutical && prescription.priorita" class="col-12 col-md">
                      Priorità: <strong>{{ prescription.priorita.codice }}</strong>
                      <q-tooltip>{{prescription.priorita.descrizione}}</q-tooltip>
                    </div>
                  </div>

                  <div v-if="!isPharmaceutical" class="q-mt-md">
                    Medico prescrittore <br>
                    <strong>
                      <template v-if="!prescription.medico_prescrittore">-</template>
                      <template v-else>
                        {{prescription.medico_prescrittore.cognome}} {{prescription.medico_prescrittore.nome}}
                      </template>
                    </strong>
                  </div>

                  <div class="q-mt-md">
                    Esenzione<br>
                    <strong>
                      <template v-if="!prescription.esenzione">-</template>
                      <template v-else>
                        <!--{{ prescription.esenzione.codice}} - {{prescription.esenzione.descrizione}} -->
                        {{prescription.esenzione.descrizione}}
                      </template>
                    </strong>
                  </div>

                  <div v-if="!isPharmaceutical" class="q-mt-md">
                    Quesito diagnostico <br>
                    <strong>{{ prescription.diagnosi }}</strong>
                  </div>
                </div>
              </q-tab-pane>

              <!-- TAB BAR CODE -->
              <!-- ----------------------------------------------------------------------------------------------- -->
              <q-tab-pane name="barCode">
                <div>
                  <div class="text-center csi-h5">NRE</div>
                  <div class="text-center">
                    <csi-barcode
                      :value="prescription.nre"
                      format="CODE39"
                      class="cursor-pointer"
                      @click="showModalNre"
                    />
                  </div>
                </div>

                <div class="q-mt-lg">
                  <div class="text-center csi-h5">Codice Fiscale</div>
                  <div class="text-center">
                    <csi-barcode
                      :value="prescription.assistito.codice_fiscale"
                      format="CODE39"
                      class="cursor-pointer"
                      @click="showModalTaxCode"
                    />
                  </div>
                </div>
              </q-tab-pane>
            </q-tabs>
          </template>

          <!-- AZIONI -->
          <!-- --------------------------------------------------------------------------------------------------- -->
          <template slot="actions">
            <csi-buttons class="q-pa-sm">
              <csi-button v-if="canUnhide" label="Ripristina" :loading="isRestoring" @click="restore"/>
              <csi-button v-if="canDownload" label="Scarica" :loading="isDownloading" @click="onPrint"/>
              <csi-button
                v-if="!detail && prescription.completa"
                secondary
                label="Dettagli"
                @click="$emit('detail', prescription)"
              />
            </csi-buttons>
          </template>
        </csi-card-item>
      </q-card-main>
    </q-card>

    <!-- MODAL BARCODE -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <q-modal v-model="isModalNreVisible" maximized>
      <q-btn
        flat
        round
        icon="close"
        v-close-overlay
        class="fixed-top-right"
      />

      <div class="barcode-wrapper">
        <csi-barcode
          :value="prescription.nre"
          format="CODE39"
        />
      </div>
    </q-modal>

    <q-modal v-model="isModalTaxCodeVisible" maximized>
      <q-btn
        flat
        round
        icon="close"
        v-close-overlay
        class="fixed-top-right"
      />

      <div class="barcode-wrapper">
        <csi-barcode
          :value="prescription.assistito.codice_fiscale"
          format="CODE39"
        />
      </div>
    </q-modal>

    <!--modale conferma nascoste-->
    <q-modal minimized class="q-pb-xl transparent" v-model="isToHide">
      <q-modal-layout footer-class="no-shadow" class="bg-info">
        <q-toolbar slot="header">
          <q-toolbar-title>
            Nascondi ricetta
          </q-toolbar-title>
        </q-toolbar>
        <q-btn
          flat
          round
          icon="close"
          v-close-overlay
          class="fixed-top-right"
        />
      </q-modal-layout>
      <q-card class="q-pa-md">
        <div class="text-center q-pb-sm">
          Desideri nascondere la ricetta <strong>{{prescription.nre}}</strong> ?
        </div>
        <csi-buttons>
          <csi-button v-close-overlay @click.native="hide">Nascondi</csi-button>
          <csi-button secondary v-close-overlay>Indietro</csi-button>
        </csi-buttons>
      </q-card>
    </q-modal>

  </div>
  <!-- </transition> -->
</template>


<script>
  import CsiCardItem from "components/global/common/CsiCardItem";
  import CsiCardItemPrimary from "components/global/common/CsiCardItemPrimary";
  import CsiCardItemActions from "components/global/common/CsiCardItemActions";
  import CsiBarcode from "components/global/common/CsiBarcode";
  import CsiIconBase from "components/global/icons/CsiIconBase";
  import CsiIconDrugs from "components/global/icons/CsiIconDrugs";
  import CsiIconPrescription from "components/global/icons/CsiIconPrescription";
  import CsiIconStethoscope from "components/global/icons/CsiIconStethoscope";
  import CsiIconRocket from "components/global/icons/CsiIconRocket";
  import {
    getPrescriptionPdf,
    updatePrescriptionHiddenStatus,
    memoizePrescriptions, getPrescriptionPdfAjax
  } from "@services/api/prescriptions";
  import {notifyError} from "@services/api/utils";
  import CsiPrescriptionPerformanceItem from "components/prescriptions/CsiPrescriptionPerformanceItem";


  export default {
    name: "CsiPrescriptionItem",
    components: {
      CsiPrescriptionPerformanceItem,
      CsiIconRocket,
      CsiIconStethoscope,
      CsiIconPrescription,
      CsiIconDrugs,
      CsiIconBase,
      CsiBarcode,
      CsiCardItemActions,
      CsiCardItemPrimary,
      CsiCardItem
    },
    props: {
      prescription: {type: Object, required: false},
      detail: {type: Boolean, required: false, default: false},
    },
    data() {
      return {
        isModalNreVisible: false,
        isModalTaxCodeVisible: false,
        isHiding: false,
        isRestoring: false,
        isPerformancesPopoverVisible: false,
        isToHide: false,
        isDownloading: false,
      };
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      cf() {
        return this.$store.getters['prescriptions/getTaxCode']
      },
      isDelegationActive() {
        return this.$store.getters['prescriptions/isDelegationActive']
      },
      isActiveDelegationWeak() {
        return this.$store.getters['prescriptions/isActiveDelegationWeak']
      },
      performances() {
        return this.prescription.prescrizioni || []
      },
      firstPerformance() {
        return this.performances[0]
      },
      otherPerformances() {
        return this.performances.slice(1)
      },
      isHidden() {
        return this.prescription.nascosta
      },
      isPharmaceutical() {
        return this.prescription.tipologia.codice === 'F'
      },
      canHide() {
        if (!this.isDelegationActive) return !this.isHidden;
        return !this.isHidden && !this.isActiveDelegationWeak;
      },
      canUnhide() {
        if (!this.isDelegationActive) return this.isHidden;
        return this.isHidden && !this.isActiveDelegationWeak;
      },
      canDownload() {
        return !this.isHidden;
      }
    },
    methods: {
      onPrint() {


        let filter = {}
        filter.tipologia = {eq: this.prescription.tipologia.codice}
        filter.regionale = {eq: this.prescription.regionale}
        if (this.prescription.tipologia.codice === 'P') {
          let newDate = new Date()

          filter.data_compilazione = {gte: this.prescription.data_compilazione, lte: newDate}
        }
        let config = {params: {filter}, _no5XXRedirect: true}

        this.isDownloading = true;
        try {

          //let response = await getPrescriptionPdfAjax(this.cf, this.prescription.nre, config)

          // this.$nextTick(() => {

          getPrescriptionPdf(this.cf, this.prescription.nre, config)
          setTimeout(this.downloading, 3000)
          // }
          // )
        } catch (e) {
          notifyError(e, 'Non è stato possibile stampare la ricetta')
          this.isDownloading = false;
        }


      },
      showModalNre() {
        this.isModalNreVisible = true;
      },

      downloading() {
        this.isDownloading = !this.isDownloading
      },
      showModalTaxCode() {
        this.isModalTaxCodeVisible = true;
      },
      showPerformancesPopover() {
        this.isPerformancesPopoverVisible = true
      },
      showIsToHide() {
        this.isToHide = true;
      },

      async hide() {
        this.isHiding = true

        try {

          let payload = {nascosta: true}
          let response = await updatePrescriptionHiddenStatus(this.cf, this.prescription.nre, payload)
          this.$emit('hide')
          // location.reload();
        } catch (e) {
          notifyError(e, 'Non è stato possibile nascondere la ricetta')
        }

        this.isHiding = false
      },
      async restore() {
        this.isRestoring = true

        try {
          let payload = {nascosta: false}
          let response = await updatePrescriptionHiddenStatus(this.cf, this.prescription.nre, payload)
          this.$emit('restore')
          // location.reload();
        } catch (e) {
          notifyError(e, 'Non è stato possibile ripristinare la ricetta')
        }
        if (this.detail) {
          this.$router.go(-1)
        }
        this.isRestoring = false
      },
    }
  }
</script>


<style lang="stylus">

  @require '~variables';

  .barcode-wrapper
    position fixed
    top 50%
    left 50%
    text-align center
    width 100vh
    transform translate(-50%, -50%) rotateZ(90deg)

  @media (min-width: $breakpoint-sm)

    .barcode-wrapper
      width 100vw
      transform translate(-50%, -50%)

</style>

