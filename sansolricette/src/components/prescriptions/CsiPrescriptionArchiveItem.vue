<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <!--<transition  appear enter-active-class="animated pulse" leave-active-class="animated bounceOutRight"> -->
  <div>
    <q-card>
      <q-card-main class="no-padding relative-position">
        <csi-card-item>

          <!-- PRIMARY -->
          <!-- --------------------------------------------------------------------------------------------------- -->
          <template slot="primary">
            <csi-card-item-primary>
              <template slot="icon">
                <div class="col-auto col-sm-12" :class="{'text-center': $q.screen.gt.xs}">
                  <csi-icon-base class="csi-svg-icon--lg">
                    <csi-icon-drugs v-if="isPharmaceutical"/>
                    <csi-icon-stethoscope v-else/>
                  </csi-icon-base>
                </div>
              </template>

              <template slot="text">
                <div class="q-pa-xs" :class="{'text-center': $q.screen.gt.xs}">
                  <strong v-if="isPharmaceutical" class="text-primary">Farmaceutica</strong>
                  <strong v-else class="text-primary">Specialistica</strong>
                </div>

                <div class="q-pa-xs" :class="{'text-center': $q.screen.gt.xs}" v-if="issueDate">
                  {{issueDateLabel}} <strong>{{ issueDate | format}}</strong>
                </div>

              </template>
            </csi-card-item-primary>
          </template>

          <!-- SECONDARY -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template slot="secondary">
            <div class="row reverse q-pa-md justify-between">
              <div class="col-auto" v-if="!isActiveDelegationWeak">
                <q-btn flat dense round icon="more_vert" :loading="isHiding">
                  <q-popover>
                    <q-list link>
                      <q-item v-close-overlay @click.native="hidePrescription">
                        <q-item-main>
                          <q-item-tile v-if="isVisibile">
                            Oscura
                          </q-item-tile>
                          <q-item-tile v-else>
                            Mostra
                          </q-item-tile>
                        </q-item-main>
                      </q-item>
                    </q-list>
                  </q-popover>
                </q-btn>
              </div>
              <div class="column col gutter-y-sm">
                <div>
                  <div>Struttura sanitaria</div>
                  <div>
                    <strong> {{ structureName }}</strong>
                  </div>
                </div>
                <!-- NUMERO RICETTA ' -->
                <!-- --------------------------------------------------------------------------------------------------- -->
                <div class="row" v-if="hasNre">
                  <div class="col-auto row items-center gutter-x-xs">
                    <div class="col-auto">
                      <csi-icon-base class="csi-svg-icon--lg">
                        <csi-icon-prescription/>
                      </csi-icon-base>
                    </div>

                    <div class="col">
                      <div>N° ricetta elettronica</div>
                      <div v-for="(nre,index) in nreList" :key="index">
                        <strong> {{ nre }}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </template>

          <!-- AZIONI -->
          <!-- --------------------------------------------------------------------------------------------------- -->
          <template slot="actions" >

            <div class="q-pa-md text-right" >
              <q-btn color="primary" @click="onPrint" class="csi-prescription-archive-item__print-button min-width">Scarica</q-btn>
<!--              <csi-button primary label="Scarica"  />-->
            </div>
          </template>


        </csi-card-item>

        <div class="csi-prescription-archive-item__status-icon" v-if="!isActiveDelegationWeak">
          <div :class="{'invisible':isVisibile}">
            <q-icon name="visibility_off" class="csi-icon--sm" >
              <q-tooltip>Ricetta oscurata</q-tooltip>
            </q-icon>

          </div>
        </div>
      </q-card-main>
    </q-card>


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
          Desideri nascondere la ricetta <strong>{{prescription}}</strong> ?
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
    import {getDocumentPdfUrl} from "../../services/api/enrollment";


    export default {
        name: "CsiPrescriptionArchiveItem",
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
                urlDownload:null

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
          activeDelegation(){
            return this.$store.getters['prescriptions/getActiveDelegation']
          },

            isVisibile() {
              let visibleCodes = ["N", "M"];
              if(this.prescription){
                let visibility = this.prescription.oscurato
                return visibleCodes.includes(visibility);
              }else{
                return true
              }
            },
            metadata(){
              return this.prescription ?  this.prescription.metadati : null
            },

            typeCode(){
              return this.metadata && this.metadata.tipo_documento? this.metadata.tipo_documento.codice : ''
            },
            typeName() {
              return this.metadata && this.metadata.tipo_documento? this.metadata.tipo_documento.descrizione : ''
            },
            isPharmaceutical() {
                return this.typeCode === this.$config.prescriptions.documentTypes.PHARMACEUTICAL_PERFORMANCE ||
                  this.typeCode === this.$config.prescriptions.documentTypes.PHARMACEUTICAL_PRESCRIPTION
            },
          issueDateLabel() {
              let isPrescription =  this.typeCode === this.$config.prescriptions.documentTypes.SPECIALIZED_PRESCRIPTION ||
                this.typeCode === this.$config.prescriptions.documentTypes.PHARMACEUTICAL_PRESCRIPTION

              return isPrescription ? 'Prescritta il: ' : 'Erogata il: '
            },
            issueDate() {
              return this.metadata ? this.metadata.data_validazione : null
            },
            structureName() {
              return this.metadata ? this.metadata.descrizione_struttura : ''
            },

            nreList() {
              return this.prescription ? this.prescription.nre : []
            },
            hasNre() {
              return this.nreList.length > 0;
            },
          episodeId(){
              return this.prescription &&  this.prescription.episodio ? this.prescription.episodio.id_episodio : null
          },
          isActiveDelegationWeak(){
            let rank =  this.getActiveDelegationRank()
            return this.isDelegationActive && rank && rank === this.$config.delegations.delegationRankCodes.WEAK
          }

        },
        methods: {

          async  onPrint() {
            this.isDownloading = true
              let taxCode = this.cf;
              let documentId = this.prescription.id_documento_ilec;
              let params = {
                componente_locale: this.prescription.codice_cl,
                id_episodio: this.episodeId,
                firmato_digitalmente: "S",
                criptato: "S",
                pdf: true,
                id_repository: this.metadata.id_repository_cl,
                documento_dipartimentale: this.metadata.codice_documento_dipartimentale,
                tipo_documento: this.typeCode
              };


              try{
               let pdf= getDocumentPdfUrl(taxCode, documentId, { params });
              }catch (e) {

              }finally {
                this.isDownloading = false
              }
            },
            showModalNre() {
                this.isModalNreVisible = true;
            },
            hidePrescription(){
              this.$emit('hide-prescription', this.isVisibile, this.prescription)
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
            getActiveDelegationRank(){
              if(!this.isDelegationActive) return null
              let serviceCode = this.$config.global.appServiceCodes.prescriptions
              let activeDelegationDetail =   this.activeDelegation.deleghe.find(d => d.codice_servizio === serviceCode)
              return activeDelegationDetail ? activeDelegationDetail.grado_delega : null
            }
        },

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


  .csi-prescription-archive-item__status-icon
    position: absolute
    left: 16px
    bottom: 8px

  .csi-prescription-archive-item__print-button
    &.focus,
    &:focus
      outline 3px solid #f3c716

    &.min-width
      min-width 200px

  @media (max-width: 300px)
    .csi-prescription-archive-item__print-button
      &.min-width
        min-width 150px

</style>

