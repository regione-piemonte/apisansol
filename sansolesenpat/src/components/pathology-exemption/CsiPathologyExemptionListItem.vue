<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="pathology-exemption-list-item">

    <q-card>
      <!-- HEADER INFORMATIVI -->
      <!-- ------------------------------------------------------------------------------------------------------- -->
<!--new-->
      <csi-bar v-if="activeStatus.codice==='INM' || activeStatus.codice==='INV' ||activeStatus.codice=== 'RAP' ||
       activeStatus.codice==='DAV' || activeStatus.codice==='LAV' || activeStatus.codice==='RDR'" bg-color="blue-2">
        {{activeStatus.descrizione}}
      </csi-bar>

      <csi-bar v-else-if="activeStatus.codice!=='VAL'" bg-color="red-2">
        {{activeStatus.descrizione}}
      </csi-bar>

<!--new-->


<!--      <csi-bar v-if="activeStatus.color==='info'" bg-color="blue-2">-->
<!--        {{activeStatus.label}}-->
<!--      </csi-bar>-->
<!--      -->

<!--      <csi-bar v-if="activeStatus.color==='negative'" bg-color="red-2">-->
<!--        {{activeStatus.label}}-->
<!--      </csi-bar>-->



      <q-card-main class="no-padding">
        <csi-card-item>
          <template slot="header">
            <q-item>
              <q-item-main class="q-body-1">
                <div>Esenzione</div>
                <div>
                  <strong>
                    {{exemption.codice.codice}} {{exemption.codice.descrizione}}
                  </strong>
                </div>
                <div v-if="isDetail" class="q-pt-xs">Numero pratica</div>
                <div v-if="isDetail">
                  <strong>
                    {{exemption.numero_pratica}}
                  </strong>
                </div>


              </q-item-main>

              <q-item-side v-if="!noMoreActions" right>
                <q-item-tile icon="more_vert">
                  <q-popover>
                    <q-list separator link>
                      <q-item @click.native="onHistory" v-close-overlay>
                        Cronologia
                      </q-item>
                      <!--<q-item v-if="!exemption.annullabile" @click.native="onHistory" v-close-overlay> -->


                      <!-- <q-item v-if="exemption.stato.codice==='VAL' ||exemption.stato.codice==='VIS' " @click.native="downloadAttestato"
                               v-close-overlay>
                         Scarica attestato
                       </q-item>


                       <q-item v-if="exemption.certificato_id" @click.native="downloadCertificatiPdf" v-close-overlay>
                         Scarica certficato
                       </q-item> -->
                    </q-list>
                  </q-popover>
                </q-item-tile>
              </q-item-side>
            </q-item>
          </template>

          <template slot="primary">
            <csi-card-item-primary>
              <template slot="icon">
                <csi-icon-base class="csi-svg-icon--lg">
                  <csi-pathology-type-icon :code="exemption.tipologia.codice"/>
                </csi-icon-base>
              </template>

              <template slot="text">
                <div :class="{'text-bold text-primary': $q.screen.lt.sm}">
                  Esenzione per {{exemption.tipologia.descrizione}}
                </div>
              </template>
            </csi-card-item-primary>
          </template>

          <template slot="secondary">
            <!-- INFORMAZIONI ESSENZIALI -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="q-pa-md row items-center gutter-sm">

              <div class="col-12 col-sm">
                <div>Stato: <strong>{{exemption.stato.descrizione}}</strong></div>
                <div v-if="exemption.stato.codice === $config.pathologyExemption.archivedStatuses.Revocata && isDetail">
                  Revocata per:
                  <strong>{{exemption.motivazione_revoca.descrizione}}</strong></div>
                <div v-if="exemption.data_aggiornamento">Aggiornata al <strong>{{exemption.data_aggiornamento | format('DD MMM YYYY')}}</strong></div>
                <div v-else>Aggiornata al <strong>{{exemption.data_richiesta | format('DD MMM YYYY')}}</strong></div>
                <div v-if="exemption.archiviata && exemption.data_inizio_validita">Attivata il <strong>{{exemption.data_inizio_validita |
                  format}}</strong></div>
                <div v-if="exemption.archiviata && !exemption.data_inizio_validita ">Richiesta il <strong>{{exemption.data_richiesta |
                  format}}</strong></div>
              </div>

              <div v-if="!exemption.archiviata && exemption.data_scadenza" class="col-12 col-sm">
                <div class="row items-center gutter-xs">
                  <div class="col-auto">
                    <csi-icon-base class="csi-svg-icon--lg">
                      <csi-icon-calendar/>
                    </csi-icon-base>
                  </div>

                  <div class="col">
                    <div>Attiva fino al</div>
                    <div><strong>{{exemption.data_scadenza | format}}</strong></div>

                  </div>
                </div>
              </div>

              <div v-else-if=" exemption.archiviata" class="col-12 col-sm">


                <div class="row items-center gutter-xs">
                  <div class="col-auto">
                    <csi-icon-base class="csi-svg-icon--lg">
                      <csi-icon-calendar/>
                    </csi-icon-base>
                  </div>


                  <div
                    v-if=" exemption.stato.codice === $config.pathologyExemption.archivedStatuses.Scaduta"
                    class="col">
                    <div>Scaduta il</div>
                    <div><strong>{{exemption.data_scadenza | format}}</strong></div>
                  </div>

                  <div
                    v-else-if=" exemption.stato.codice === $config.pathologyExemption.archivedStatuses.Revocata"
                    class="col">
                    <div>Revocata il</div>
                    <div><strong>{{exemption.data_revoca | format}}</strong></div>
                  </div>

                  <div
                    v-else-if="exemption.stato.codice === $config.pathologyExemption.archivedStatuses.Annullata"
                    class="col">
                    <div>Annullata il</div>
                    <div><strong>{{exemption.data_annullamento | format}}</strong></div>
                  </div>
                </div>
              </div>
            </div>


            <!-- INFORMAZIONI DETTAGLIO -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <template v-if="isDetail">

              <!-- INFO MALATTIA -->
              <div class="q-pa-md row items-center ">
                <div class="col-12">
                  Codice diagnosi <strong>{{exemption.malattia.codice}}</strong>
                </div>

                <div v-if="exemption.malattia.descrizione!=='-'" class="col-12">
                  Definizione diagnosi <strong>{{exemption.malattia.descrizione}}</strong>
                </div>
              </div>


              <!-- LISTA PRESTAZIONI ESENTI -->
              <q-collapsible
                v-if="exemption.malattia.prestazioni && exemption.malattia.prestazioni.length > 0"
                label="Prestazioni esenti"
                header-class="q-body-2">
                <q-list no-border dense class="no-padding">
                  <q-item
                    v-for="performance in exemption.malattia.prestazioni"
                    :key="performance.codice">
<!--                    <q-item-side>{{performance.codice}}</q-item-side>-->
                    <q-item-main>{{performance.descrizione}}</q-item-main>
                  </q-item>
                </q-list>
              </q-collapsible>

            </template>

<!--            <csi-pathology-exemption-history-collapsible-->
<!--              v-model="isHistoryCollapsibleVisible"-->
<!--              :exemption="exemption"-->
<!--            />-->

          </template>


          <template v-if="!noActions" slot="actions">
            <template v-if="!isDetail">
              <csi-buttons class="q-pa-sm">
                <csi-button primary label="Gestisci" @click="onHandle"/>
              </csi-buttons>
            </template>

<!--            <template v-else>-->
            <template v-if="isDetail">


              <csi-buttons class="q-pa-sm">
                <csi-button v-if="isToEdit" secondary label="Rettifica" color="warning" @click="onCorrection"/>
                <csi-button v-if="exemption.rinnovabile" secondary label="Rinnova" @click="onRenew"/>
                <csi-button v-if="exemption.annullabile" secondary label="Annulla richiesta" @click="onCancel"/>
<!--                <csi-button v-if="exemption.revocabile" secondary label="Revoca" color="negative" @click="onRevoke"/>-->
<!--                <csi-button v-if="exemption.stato.codice==='VAL' || exemption.stato.codice==='VIS' "-->
<!--                            @click="downloadAttestato"-->
<!--                            secondary label="Scarica attestato"/>-->
                <csi-button v-if="exemption.certificato_id" @click="downloadCertificatiPdf" secondary
                            label="Scarica certificato"/>

                <!-- da capire cosa si scarica -->


                <csi-button v-if="exemption.zip" secondary label="Scarica allegati" @click="onDownload"/>


              </csi-buttons>
            </template>
          </template>

        </csi-card-item>
      </q-card-main>
    </q-card>


    <!-- MODALS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-pathology-exemption-history-modal
      v-model="isHistoryModalVisible"
      :exemption="exemption"
    />
  </div>
</template>


<script>
    import CsiCardItem from 'components/global/common/CsiCardItem'
    import CsiCardItemPrimary from 'components/global/common/CsiCardItemPrimary'
    import CsiIconBase from 'components/global/icons/CsiIconBase'
    import CsiIconDrugs from 'components/global/icons/CsiIconDrugs'
    import CsiIconCalendar from 'components/global/icons/CsiIconCalendar'
    import CsiPathologyExemptionHistoryModal from 'components/pathology-exemption/CsiPathologyExemptionHistoryModal'
    // import CsiPathologyExemptionHistoryCollapsible from 'components/pathology-exemption/CsiPathologyExemptionHistoryCollapsible'
    import CsiBar from 'components/global/common/CsiBar'
    import {getAllegatiZip, getAttestatoPdf, getCertificatoPdf, getStatusList} from '@services/api/pathology-exemption'
    import CsiPathologyTypeIcon from 'components/pathology-exemption/CsiPathologyTypeIcon'

    export default {
        name: 'CsiPathologyExemptionListItem',
        components: {
            CsiPathologyTypeIcon,
            CsiBar,
            CsiPathologyExemptionHistoryModal,
            //CsiPathologyExemptionHistoryCollapsible,
            CsiIconCalendar,
            CsiIconDrugs,
            CsiIconBase,
            CsiCardItemPrimary,
            CsiCardItem
        },
        props: {
            exemption: {type: Object, required: true},
            //statusList: {type: Array, required: false},
            isDetail: {type: Boolean, required: false, default: false},
            noActions: {type: Boolean, required: false, default: false},
            noMoreActions: {type: Boolean, required: false, default: false},
        },
        data() {
            return {
                isHistoryCollapsibleVisible: false,
                isHistoryModalVisible: false,
                activeStatus: null,
            }
        },
        computed: {
            isToEdit() {
                return this.exemption.stato.codice === this.$config.pathologyExemption.toEdit.RettificaMedico || this.exemption.stato.codice === this.$config.pathologyExemption.toEdit.RettificaOperatore
            },
            user() {
                return this.$store.getters['global/user']
            },
            cf() {
                return this.$store.getters['pathologyExemption/getTaxCode']
            },
        },
        async created() {

            //this.statusList = this.$config.pathologyExemption.listStatus
            // try {
            //     let statusListPromise = await getStatusList()
            //     this.statusList = statusListPromise.data
            // }catch(e){
            //     console.error(e)
            // }

            //this.activeStatus = this.statusList.find(d => d.codice === this.exemption.stato.codice)
            this.activeStatus = this.exemption.stato
        },
        methods: {
            async downloadAttestato() {
                let params = {}
                params.document_type = '07'
                let response = await getAttestatoPdf(this.cf, this.exemption.id, {params})
            },
            downloadCertificatiPdf() {
                let response = getCertificatoPdf(this.cf, this.exemption.certificato_id)

            },
            onHandle(...args) {
                // Se c'è l'handler => lo invochiamo perchè il componente padre intende applicare la propria logica
                let eventName = 'click-handle'
                if (eventName in this.$listeners) return this.$emit(eventName, ...args)

                console.debug(`default @${eventName}`)
            },
            onHistory(...args) {
                let eventName = 'click-history'
                if (eventName in this.$listeners) return this.$emit(eventName, ...args)
                console.debug(`default @${eventName}`)
                this.isHistoryModalVisible = true
            },
            onRevoke(...args) {
                let eventName = 'click-revoke'
                if (eventName in this.$listeners) return this.$emit(eventName, ...args)

                console.debug(`default @${eventName}`)
                let name = this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_REVOKE.name
                let params = {id: this.exemption.id, exemption: this.exemption}
                this.$router.push({name, params})
            },

            async onDownload() {
                let response = await getAllegatiZip(this.cf, this.exemption.id)
            },

            onCancel(...args) {
                let eventName = 'click-cancel'
                if (eventName in this.$listeners) return this.$emit(eventName, ...args)

                console.debug(`default @${eventName}`)
                let name = this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_CANCEL.name
                let params = {id: this.exemption.id, exemption: this.exemption}
                this.$router.push({name, params})
            },
            onRenew(...args) {
                let eventName = 'click-renew'
                if (eventName in this.$listeners) return this.$emit(eventName, ...args)

                console.debug(`default @${eventName}`)
                let name = this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_RENEW.name
                let params = {id: this.exemption.id, exemption: this.exemption}
                this.$router.push({name, params})
            },
            onCorrection(...args) {
                let eventName = 'click-correction'
                if (eventName in this.$listeners) return this.$emit(eventName, ...args)

                console.debug(`default @${eventName}`)
                let name = this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_CORRECTION.name
                let params = {id: this.exemption.id, exemption: this.exemption}
                this.$router.push({name, params})
            },
        },
    }
</script>


<style scoped lang="stylus"></style>
