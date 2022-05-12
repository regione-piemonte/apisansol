<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-ticket-list-item">

    <q-card>
      <q-card-main class="no-padding">
        <csi-card-item>

          <!-- HEADER -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template slot="header">
            <q-item>
              <q-item-side>
                <csi-icon-base class="csi-svg-icon--lg">
                  <csi-icon-hospital/>
                </csi-icon-base>
              </q-item-side>

              <q-item-main>
                <q-item-tile>Appuntamento</q-item-tile>
                <q-item-tile class="q-body-2">
                  <span v-if="ticket.asr.descrizione">{{ticket.asr.descrizione}}</span>
                  <span v-else>Nessuna struttura</span>
                </q-item-tile>
                <!-- @TODO: ciclo sui presidi sanitari. Attualmente sembrerebbe che non sia possibile avere questo dato -->
                <!--<q-item-tile v-else v-for="(presidio, index) in ticket.asr.presidi_sanitari" :key="presidio.id">-->
                <!--<div class="q-mr-sm" :class="{invisible: index !== 0}">-->
                <!--<csi-icon-base class="csi-svg-icon&#45;&#45;lg">-->
                <!--<csi-icon-hospital />-->
                <!--</csi-icon-base>-->
                <!--</div>-->

                <!--<div class="col">-->
                <!--<div v-if="index === 0" class="q-body-1 text-weight-light">-->
                <!--Strutture-->
                <!--</div>-->
                <!--<div class="q-body-2">-->
                <!--{{presidio.descrizione}} ({{ticket.asr.descrizione}})-->
                <!--</div>-->
                <!--</div>-->
                <!--</q-item-tile>-->
              </q-item-main>

              <q-item-side v-if="!noMoreActions && !isPayed && hasIuv3 && isReminderPrintable" right>
                <q-icon name="more_vert" color="primary" size="24px">
                  <q-popover touch-position>
                    <q-list link class="no-border">
                      <q-item @click.native="downloadPaymentReminder" v-close-overlay>
                        <q-item-main label="Ristampa promemoria di pagamento"></q-item-main>
                      </q-item>
                    </q-list>
                  </q-popover>
                </q-icon>
              </q-item-side>
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
                <div>
                  {{isPayed ? 'Pagato' : 'Da pagare'}}
                </div>
                <div class="q-body-2">
                  {{amount | toFixed}}
                </div>
              </template>
            </csi-card-item-primary>
          </template>

          <!-- SECONDARY -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template slot="secondary">
            <q-item v-if="holder">
              <q-item-side>
                <csi-icon-base class="csi-svg-icon--lg">
                  <!-- @TODO: non possiamo sapere se si tratta di una donna o di un uomo dal momento che non ci viene passato il dato -->
                  <csi-icon-avatar-person :is-female="false" :is-minor="isHolderMinor"/>
                </csi-icon-base>
              </q-item-side>
              <q-item-main>
                <q-item-tile>Intestatario</q-item-tile>
                <q-item-tile class="q-body-2">{{holder.nome}} {{holder.cognome}}</q-item-tile>
              </q-item-main>
              <q-item-side right class="self-end col-12 col-md-auto">

                <div class="gt-sm">
                  <div class="text-primary text-weight-bold cursor-pointer" @click="toggleShowMore">
                    <span>mostra di più</span>
                    <q-icon
                      name="keyboard_arrow_down"
                      class="csi-icon--sm show-more-icon"
                      :class="{'show-more-icon--active': isShowingMore}"
                    />
                  </div>
                </div>
              </q-item-side>
            </q-item>


            <div class="lt-md q-pa-md">

              <div class="text-primary text-weight-bold cursor-pointer" @click="toggleShowMore">
                <span>mostra di più</span>
                <q-icon
                  name="keyboard_arrow_down"
                  class="csi-icon--sm show-more-icon"
                  :class="{'show-more-icon--active': isShowingMore}"
                />
              </div>
            </div>

            <q-slide-transition>
              <q-list v-if="isShowingMore" no-border dense>
                <q-item>
                  <q-item-main>
                    Identificativo ticket/posizione debitoria: <span class="q-body-2">{{ticket.numero_pratica_regionale}}</span>
                  </q-item-main>
                </q-item>
                <q-item>
                  <q-item-main>
                    Numero Ricetta:
                    <template v-if="nre.length <= 0">
                      <span class="q-body-2">-</span>
                    </template>
                    <template v-else>
                      <q-item v-for="el in nre" :key="el.id" dense class="q-px-none">
                        <q-item-main class="q-body-2">
                          {{el.id}}
                        </q-item-main>

                        <template v-if="el.desc_struttura">
                          <q-item-side class="text-black q-body-1">
                            {{el.desc_struttura}}
                          </q-item-side>
                        </template>

                        <template v-if="el.indirizzo">
                          <q-item-side right>
                            <q-item-tile class="q-caption">
                              <csi-link-map :address="el.indirizzo" target="_blank" class="text-weight-bold">
                                {{el.indirizzo}}
                              </csi-link-map>
                            </q-item-tile>
                          </q-item-side>
                        </template>
                      </q-item>
                    </template>
                  </q-item-main>
                </q-item>
              </q-list>
            </q-slide-transition>

            <!-- AZIONI -->
            <!-- --------------------------------------------------------------------------------------------------------- -->
            <slot v-if="!noActions" name="actions">
              <div class="q-mt-md q-pa-sm">
                <div v-if="isPayed">
                  <csi-buttons>
                    <csi-button primary label="Salva ricevuta" @click="downloadReceipt"/>
                  </csi-buttons>
                </div>

                <div v-else>

                  <div class="row items-center justify-start" :class="{'reverse': this.$q.screen.gt.sm}">

                    <div class="col-12 col-md-auto">
                      <csi-buttons>
                        <csi-button primary label="Paga subito" @click="goToPayment"/>
                        <csi-button
                          v-if="canAddToCart && !addedToCart && !cartLimitReached"
                          secondary
                          label="Aggiungi al carrello"
                          @click="addToCart"
                        />
                      </csi-buttons>
                    </div>

                    <div class="col-12 col-md-auto">
                      <div v-if="addedToCart" class="text-center q-pa-sm">
                        <div class="q-body-2 text-green">
                          <q-icon name="check"></q-icon>
                          Aggiunto al carrello
                        </div>
                        <template v-if="!cartLimitReached">
                          <div class="q-body-1">Puoi aggiungere altri pagamenti</div>
                        </template>
                      </div>

                      <div v-if="!canAddToCart">
                        <div class="q-body-2 text-negative text-center q-pa-sm">
                          Carrello non disponibile
                        </div>
                      </div>

                      <template v-else-if="cartLimitReached && !addedToCart">
                        <div class="q-body-2 text-negative text-center q-pa-sm">
                          Non puoi aggiungere altri pagamenti al carrello
                        </div>
                      </template>
                    </div>

                  </div>
                </div>
              </div>
            </slot>
          </template>
        </csi-card-item>
      </q-card-main>
    </q-card>
  </div>
</template>


<script>
  import {getHealthPaymentsReceiptPdf, getHealthPaymentsReminderPdf} from "@services/api/health-payments";
  import CsiCardItem from "components/global/common/CsiCardItem";
  import CsiCardItemPrimary from "components/global/common/CsiCardItemPrimary";
  import CsiIconBase from "components/global/icons/CsiIconBase";
  import CsiIconEuro from "components/global/icons/CsiIconEuro";
  import CsiIconAvatarPerson from "components/global/icons/CsiIconAvatarPerson";
  import CsiIconAvatarMan from "components/global/icons/CsiIconAvatarMan";
  import {isMinor} from "@services/global/business-logic";
  import CsiIconHospital from "components/global/icons/CsiIconHospital";
  import {canAddToCart, isPayed} from "@services/health-payments/business-logic";
  import CsiLinkMap from "components/global/common/CsiLinkMap";

  export default {
    name: 'CsiTicketListItem',
    components: {
      CsiLinkMap,
      CsiIconHospital,
      CsiIconAvatarMan,
      CsiIconAvatarPerson,
      CsiIconEuro,
      CsiIconBase,
      CsiCardItemPrimary,
      CsiCardItem
    },
    props: {
      ticket: {type: Object, required: true},
      holder: {type: Object, required: false, default: undefined},
      noActions: {type: Boolean, required: false, default: false},
      noMoreActions: {type: Boolean, required: false, default: false},
      showAsPayed: {type: Boolean, required: false, default: false},
      cfForNotAuthenticate: {type: String, required: false, default: null},
    },
    data() {
      return {
        isShowingMore: false,
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      cf() {
        return this.$store.getters['healthPayments/getTaxCode']
      },
      isPayed() {
        return isPayed(this.ticket) || this.showAsPayed
      },
      canAddToCart() {
        return canAddToCart(this.ticket)
      },
      cartItems() {
        return this.$store.getters['healthPayments/cartItems']
      },
      cartLimitReached() {
        return this.cartItems && this.cartItems.length >= this.$config.healthPayments.cartMaxLength
      },
      addedToCart() {
        return this.cartItems.some(item => item.numero_pratica_regionale === this.ticket.numero_pratica_regionale);
      },
      amount() {

        if (this.isPayed) {
          return this.ticket.pagato ? this.ticket.pagato.valore : 0;
        }

        return this.ticket.da_pagare ? this.ticket.da_pagare.valore : 0
      },
      isHolderMinor() {
        return isMinor(this.holder.data_nascita)
      },
      nre() {
        return this.ticket && this.ticket.nre || []
        // if (!Array.isArray(this.ticket.nre)) return this.ticket.nre
        // return this.ticket.nre.join(', ')
      },
      reminderPrintableList() {
        return this.$store.getters['healthPayments/getReminderPrintableList']
      },
      isReminderPrintable() {
        let asrId = this.ticket.asr && this.ticket.asr.id;
        let npr = this.ticket.numero_pratica_regionale;
        return this.reminderPrintableList.some(el => asrId === el.asr_id && npr.startsWith(el.prefisso));
      },
      hasIuv3() {
        let iuv = this.ticket && this.ticket.assegnazione_iuv && this.ticket.assegnazione_iuv.iuvmod3;
        return !!iuv
      }
    },
    methods: {
      toggleShowMore() {
        this.isShowingMore = !this.isShowingMore
      },
      addToCart() {
        this.$store.commit('healthPayments/addToCart', this.ticket);
        this.$emit('added-to-cart', this.ticket)
      },
      goToPayment() {
        let name = this.$routes.HEALTH_PAYMENTS.PAYMENT.name;
        let query = {ticketId: this.ticket.numero_pratica_regionale};
        let params = {ticket: this.ticket};
        this.$router.push({name, query, params});
      },
      async downloadReceipt() {
        let cf = this.holder && this.holder.codice_fiscale;
        let filter = {
          id_ricevuta: {eq: this.ticket.id_ricevuta},
        };

        let params = {filter, xci_cd: 'attachment'};
        let config = {params};
        getHealthPaymentsReceiptPdf(cf, config);
      },
      downloadPaymentReminder() {
        if (!this.cfForNotAuthenticate) {
          getHealthPaymentsReminderPdf(this.cf, this.ticket.numero_pratica_regionale);
        } else {
          getHealthPaymentsReminderPdf(this.cfForNotAuthenticate, this.ticket.numero_pratica_regionale);
        }
      }
    }
  }
</script>


<style scoped lang="stylus">
  .show-more-icon
    transition transform .3s ease

    &--active
      transform rotateZ(-180deg)
</style>
