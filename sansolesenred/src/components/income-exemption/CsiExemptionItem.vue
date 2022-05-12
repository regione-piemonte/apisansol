<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus">

  @require '~variables'

  .stato-esenzione {
    font-weight bold
  }
</style>


<template>
  <div>
    <q-card>
      <q-card-main class="no-padding">
        <csi-bar :bg-color="statusColor">
          {{exemption.stato.descrizione}}
        </csi-bar>

        <csi-card-item>

          <!--          <template slot="header">-->
          <!--            <div class="q-px-md q-py-sm">-->
          <!--              <strong-->
          <!--                class="stato-esenzione"-->
          <!--                :class="{-->
          <!--                    'text-green-8': $config.incomeExemption.positiveStatuss.includes(exemption.stato.codice),-->
          <!--                    'text-red-8': $config.incomeExemption.negativeStatuss.includes(exemption.stato.codice)-->
          <!--                    }">-->
          <!--              </strong>-->
          <!--            </div>-->

          <!--            <div>-->
          <!--              <strong v-if="isExpiring(exemption)" class="text-warning">(In scadenza)</strong>-->
          <!--            </div>-->
          <!--          </template>-->


          <template slot="primary">
            <csi-card-item-primary>
              <template slot="icon">
                <div class="col-auto col-sm-12" :class="{'text-center': $q.screen.gt.xs,}">
                  <csi-icon-base class="csi-svg-icon--lg">
                    <csi-icon-avatar-person :is-female="exemption.creato_per.sesso === 'F'" />
                  </csi-icon-base>
                </div>
              </template>

              <template slot="text">
                <div style="line-height: 1.5;" :class="{'text-center': $q.screen.gt.xs,}">
                  <div>Beneficiario</div>
                  <div>
                    <strong>{{exemption.creato_per.nome}} {{exemption.creato_per.cognome}}</strong>
                  </div>
                  <div class="capiton text-faded row items-center gutter-x-xs">
                    <div class="col-auto col-sm-12">{{exemption.creato_per.codice_fiscale}}</div>
                    <div v-if="exemption.familiare" class="col-auto col-sm-12">(familiare)</div>
                  </div>
                </div>
              </template>
            </csi-card-item-primary>
          </template>


          <template slot="secondary">
            <!-- RIGA MOTIVAZIONE -->
            <!-- ------------------------------------------------------------------------------------------------------- -->
            <div class="q-pa-md">

              <div>Motivo dell'esenzione</div>
              <div>
                <strong class="text-primary">
                  {{exemption.codice_esenzione.codice}} - {{exemption.codice_esenzione.motivo}}
                </strong>
              </div>
            </div>

            <!-- DATA SCADENZA ED INIZIO VALIDITA' -->
            <!-- ------------------------------------------------------------------------------------------------------- -->
            <div class="row gutter-x-md q-pa-md">

              <div class="row items-center gutter-x-sm">

                <div class="gt-xs">
                  <csi-icon-base class="csi-svg-icon--lg">
                    <csi-icon-calendar />
                  </csi-icon-base>
                </div>

                <div>
                  Inizio validità <br>
                  <strong>{{exemption.data_inizio_validita | format}}</strong>
                </div>
              </div>

              <div class="row items-center gutter-x-sm">

                <div class="gt-xs">
                  <csi-icon-base class="csi-svg-icon--lg">
                    <csi-icon-calendar />
                  </csi-icon-base>
                </div>

                <div class="column">
                  <div>Scadenza</div>
                  <div v-if="isExpiring" class="text-warning text-weight-bold">
                    <template v-if="dayDifference === 0">
                      <span>Scade oggi</span>
                    </template>

                    <template v-if="dayDifference === 1">
                      <span>Scade domani</span>
                    </template>

                    <template v-if="dayDifference > 1 &&  dayDifference < 6 ">
                      <span>-{{dayDifference}}</span><span> giorni alla scadenza</span>
                    </template>

                    <strong v-else>{{exemption.data_scadenza | format}}</strong>
                  </div>
                </div>
              </div>
            </div>

            <template v-if="detail">
              <div class="row gutter-x-md q-pa-md">
                <div class="row items-center gutter-x-sm">
                  <div class="gt-xs">
                    <csi-icon-base class="csi-svg-icon--lg">
                      <csi-icon-calendar />
                    </csi-icon-base>
                  </div>

                  <div class="column">
                    <div>Data richiesta</div>
                    <strong>{{exemption.data_richiesta | format}}</strong>
                  </div>
                </div>

                <div class="row items-center gutter-x-sm">
                  <div class="gt-xs">
                    <csi-icon-base class="csi-svg-icon--lg">
                      <csi-icon-protocol />
                    </csi-icon-base>
                  </div>

                  <div class="column">
                    <div>Protocollo</div>
                    <strong>{{exemption.protocollo || '-'}}</strong>
                  </div>
                </div>
              </div>

              <div v-if="exemption.motivazione_revoca && isRevoke" class="q-px-md q-py-sm">
                <div>Motivazione revoca</div>
                <strong>{{exemption.motivazione_revoca }}</strong>
              </div>

              <div v-if="exemption.creato_da" class="q-px-md q-py-sm">
                Esenzione richiesta da
                <strong>{{exemption.creato_da.nome }} {{exemption.creato_da.cognome }}</strong>
                <template v-if="exemption.rapporto_familiare">
                  in qualità di {{exemption.rapporto_familiare.descrizione}} del beneficiario
                </template>
              </div>
              <div v-if="exemption.creato_per" class="q-px-md q-py-sm">
                Il titolare dell'esenzione è
                <strong>{{exemption.titolare.nome }} {{exemption.titolare.cognome }}</strong>
              </div>

            </template>

            <!-- AZIONI -->
            <!-- ------------------------------------------------------------------------------------------------------- -->
            <csi-card-item-actions>
              <div v-if="exemption.stampabile" class="col-12 col-sm-auto">
                <q-btn @click="onPrint" color="primary" class="full-width" :loading="isPrinting">Stampa</q-btn>
              </div>

              <div v-if="!detail" class="col-12 col-sm-auto">
                <q-btn @click="$emit('detail', exemption)"
                       color="primary"
                       outline
                       class="full-width">
                  Dettagli
                </q-btn>
              </div>
              <!--!noRevokeAction && isRevocable(exemption)-->


              <div v-if="(exemption.revocabile && detail)" class="col-12 col-sm-auto">
                <q-btn @click="$emit('revoke', exemption)"
                       color="negative"
                       outline
                       class="full-width">
                  Revoca
                </q-btn>
              </div>

            </csi-card-item-actions>
          </template>

        </csi-card-item>
      </q-card-main>
    </q-card>
  </div>
</template>

<script>
    import {downloadExemption} from "@services/api/income-exemption";
    import {isExpiring, isRevocable} from "@services/income-exemption/business-logic";
    import CsiCardItem from "components/global/common/CsiCardItem";
    import CsiCardItemPrimary from "components/global/common/CsiCardItemPrimary";
    import CsiCardItemActions from "components/global/common/CsiCardItemActions";
    import CsiIconBase from "components/global/icons/CsiIconBase";
    import CsiIconCalendar from "components/global/icons/CsiIconCalendar";
    import CsiIconProtocol from "components/global/icons/CsiIconProtocol";
    import CsiIconAvatarPerson from "components/global/icons/CsiIconAvatarPerson";
    import differenceInCalendarDays from "date-fns/difference_in_calendar_days"
    import CsiBar from "components/global/common/CsiBar";

    export default {
        name: 'CsiExemptionItem',
        components: {
            CsiBar,
            CsiIconAvatarPerson,
            CsiIconCalendar,
            CsiIconBase,
            CsiCardItemActions,
            CsiCardItemPrimary,
            CsiCardItem,
            CsiIconProtocol
        },
        props: {
            exemption: {type: Object, required: true},
            detail: {type: Boolean, required: false, default: false},
            noRevokeAction: {type: Boolean, required: false, default: false},
        },
        data() {
            return {
                isPdfModalOpen: false,
                blobUrl: null,
                isPrinting: false,
            }
        },
        computed: {
            dayDifference() {
                return differenceInCalendarDays(this.exemption.data_scadenza, new Date())
            },
            user() {
                return this.$store.getters['global/user']
            },
            isWorkInProgress() {
                return ['PRESA_IN_CARICO', 'RICHIESTA'].includes(this.exemption.stato.codice)
            },
            statusColor() {
                let map = {
                    'V': 'positive',
                }

                return map[this.exemption.stato.codice] || 'red-3'
            },
            isRevoke(){
              const statuss = this.$config.incomeExemption.statuss
              if(this.exemption.stato.codice === statuss.REVOKED || this.exemption.stato.codice === statuss.REVOKED_WITH_BLOCK )
                return true
            }
        },
        methods: {
            isRevocable,
            isExpiring,
            async onPrint() {
                this.isPrinting = true
                this.$nextTick( () => {
                    downloadExemption(this.user.cf, this.exemption.id)
                })
                //this.$emit('print', this.exemption);
            }
        }

    }
</script>
