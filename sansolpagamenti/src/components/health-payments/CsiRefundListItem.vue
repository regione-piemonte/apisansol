<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-refund-list-item">

    <q-card>
      <q-card-main class="no-padding">
        <csi-card-item>

          <!-- HEADER -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template v-if="asr" slot="header">
            <q-item>
              <q-item-side>
                <csi-icon-base class="csi-svg-icon--lg">
                  <csi-icon-hospital/>
                </csi-icon-base>
              </q-item-side>

              <q-item-main>
                <q-item-tile>ASL</q-item-tile>
                <q-item-tile class="q-body-2">
                  <span v-if="asrDescription">{{asrDescription}}</span>
                  <span v-else>Nessuna struttura</span>
                </q-item-tile>
              </q-item-main>
            </q-item>
          </template>

          <!-- PRIMARY -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template slot="primary">
            <csi-card-item-primary>
              <template slot="icon">
                <csi-icon-base class="csi-svg-icon--lg">
                  <csi-icon-euro/>
                </csi-icon-base>
              </template>

              <template slot="text">
                <div>Rimborso</div>
                <div class="q-body-2">{{amount | toFixed}}</div>
              </template>
            </csi-card-item-primary>
          </template>

          <!-- SECONDARY -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template slot="secondary">
            <q-item>
              <q-item-side>
                <csi-icon-base class="csi-svg-icon--lg">
                  <!-- @TODO: non possiamo sapere se si tratta di una donna o di un uomo dal momento che non ci viene passato il dato -->
                  <csi-icon-avatar-person :is-female="false" :is-minor="isHolderMinor"/>
                </csi-icon-base>
              </q-item-side>
              <q-item-main>
                <q-item-tile>Intestatario</q-item-tile>
                <q-item-tile class="q-body-2">{{holderFullName}}</q-item-tile>
              </q-item-main>
            </q-item>

            <!-- AZIONI -->
            <!-- --------------------------------------------------------------------------------------------------------- -->
            <slot name="actions">
              <div class="q-mt-md q-pa-sm">
                <csi-buttons>
                  <template v-if="usable && !used">
                    <csi-button primary label="Utilizza" @click="onUse"/>
                  </template>
                  <template v-if="used">
                    Usato
                  </template>
                  <template v-if="!usable">
                    Non utilizzabile
                  </template>
                </csi-buttons>
              </div>
            </slot>
          </template>
        </csi-card-item>
      </q-card-main>
    </q-card>
  </div>
</template>


<script>
  import CsiCardItem from "components/global/common/CsiCardItem";
  import CsiCardItemPrimary from "components/global/common/CsiCardItemPrimary";
  import CsiIconBase from "components/global/icons/CsiIconBase";
  import CsiIconEuro from "components/global/icons/CsiIconEuro";
  import CsiIconAvatarPerson from "components/global/icons/CsiIconAvatarPerson";
  import CsiIconHospital from "components/global/icons/CsiIconHospital";
  import {isMinor} from "@services/global/business-logic";

  export default {
    name: 'CsiRefundListItem',
    components: {
      CsiIconHospital,
      CsiIconAvatarPerson,
      CsiIconEuro,
      CsiIconBase,
      CsiCardItemPrimary,
      CsiCardItem
    },
    props: {
      refund: {type: Object, required: true},
      asr: {type: Object, required: false, default: null},
      usable: {type: Boolean, required: false, default: false},
      used: {type: Boolean, required: false, default: false},
    },
    data() {
      return {}
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      cf() {
        return this.$store.getters['healthPayments/getTaxCode']
      },
      asrDescription() {
        let result = this.asr && this.asr.descrizione
        return result
      },
      holderFirstName() {
        let result = this.refund && this.refund.paziente && this.refund.paziente.nome
        return result
      },
      holderLastName() {
        let result = this.refund && this.refund.paziente && this.refund.paziente.cognome
        return result
      },
      holderFullName() {
        return [this.holderFirstName, this.holderLastName].filter(s => !!s).join(' ')
      },
      isHolderMinor() {
        let birthDate = this.refund && this.refund.paziente && this.refund.paziente.data_nascita
        return birthDate ? isMinor(birthDate) : false
      },
      amount() {
        let result = this.refund && this.refund.prenotazione && this.refund.prenotazione.importo_da_rimborsare && this.refund.prenotazione.importo_da_rimborsare.valore
        return result || 0
      },
    },
    methods: {
      onUse() {
        this.$emit('use')
      },
    }
  }
</script>


<style scoped lang="stylus">
</style>
