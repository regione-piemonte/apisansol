<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="rol-report-list-item">
    <q-card>
      <q-card-section class="no-padding">
        <!-- HEADER INFORMATIVI -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <template v-if="!canDownloadPdf && canPay">
          <lms-card-item-bar type="negative">
            Non scaricabile per mancato pagamento
          </lms-card-item-bar>
        </template>

        <template v-if="!canDownloadPdf && hasRefund && !isRefundDownloadable">
          <lms-card-item-bar type="negative">
            Questo referto non può essere scaricato in quanto non è stato
            possibile eseguire tutte le prestazioni previste. <br />
            Contatta l'azienda sanitaria che ha eseguito le prestazioni per
            ottenere istruzioni sul ritiro del referto e sulla gestione
            amministrativa del pagamento. <br />
            Ci scusiamo per il disagio.
          </lms-card-item-bar>
        </template>

        <template v-if="isImageInElaboration">
          <lms-card-item-bar type="info">
            Immagine in attesa di elaborazione
          </lms-card-item-bar>
        </template>

        <template v-if="imageHasIrreversibleError">
          <lms-card-item-bar type="negative">
            <span>
              Errore durante la creazione del pacchetto immagini, per la
              risoluzione del problema contattare
            </span>
            <a href="#" class="text-bold" @click.prevent="goToHelp">
              l'assistenza
            </a>
          </lms-card-item-bar>
        </template>

        <!-- CARD -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <lms-card-item>
          <template v-if="$q.screen.lt.sm" #header>
            <div class="row justify-between items-center q-px-md q-py-sm">
              <div>
                Ticket

                <!-- DA PAGARE -->
                <!-- --------- -->
                <template
                  v-if="
                    reportPaymentStatus === REPORT_PAYMENT_STATUS_MAP.NOT_PAYED
                  "
                >
                  <rol-report-status-label :report="item" bold>
                    {{ reportPaymentStatusLabel }}
                    <rol-report-amount-label :amount="payableImport" />
                  </rol-report-status-label>
                </template>

                <!-- PAGATO PARZIALMENTE -->
                <!-- ------------------- -->
                <template
                  v-else-if="
                    reportPaymentStatus ===
                      REPORT_PAYMENT_STATUS_MAP.PARTIALLY_PAYED
                  "
                >
                  <rol-report-status-label :report="item" bold>
                    {{ reportPaymentStatusLabel }}, restano da pagare
                    <rol-report-amount-label :amount="payableImport" />
                  </rol-report-status-label>
                </template>

                <!-- RIMBORSO -->
                <!-- -------- -->
                <template
                  v-else-if="
                    reportPaymentStatus === REPORT_PAYMENT_STATUS_MAP.REFUND
                  "
                >
                  <rol-report-status-label :report="item" bold>
                    {{ reportPaymentStatusLabel }}

                    <template
                      v-if="payableImport !== null && payedImport !== null"
                    >
                      <div>
                        Puoi chiedere un rimborso di
                        {{ Math.abs(payableImport) | number }} &euro; su
                        {{ payedImport | number }} &euro;
                      </div>
                    </template>

                    <div>
                      È possibile ottenere il rimborso presso l'azienda
                      sanitaria
                    </div>
                  </rol-report-status-label>
                </template>

                <!-- ALTRI STATI -->
                <!-- ----------- -->
                <template v-else>
                  <rol-report-status-label :report="item" bold />
                </template>
              </div>
            </div>
          </template>

          <template #primary>
            <lms-card-item-primary>
              <template #icon>
                <rol-report-type-icon :type="reportTypeCode" size="lg" />
              </template>

              <template #text>
                <div :class="{ 'text-bold text-primary': $q.screen.lt.sm }">
                  {{ reportTypeLabel }}
                </div>

                <div>
                  Esame/visita del <br class="gt-xs" />
                  <strong>{{ item.data_episodio | date }}</strong>
                </div>
              </template>
            </lms-card-item-primary>
          </template>

          <template #secondary>
            <div class="row q-col-gutter-x-xs items-center q-pa-md">
              <div class="col-auto">
                <q-icon
                  name="img:/statics/la-mia-salute/icone/ospedale.svg"
                  size="lg"
                  class="gt-xs"
                />
              </div>

              <div class="col">
                <strong>
                  <template
                    v-if="
                      item.luogo_produzione_documento &&
                        item.luogo_produzione_documento.struttura
                    "
                  >
                    {{ item.luogo_produzione_documento.struttura.descrizione }}
                  </template>
                  <template v-else>-</template>

                  <template
                    v-if="
                      item.luogo_produzione_documento &&
                        item.luogo_produzione_documento.azienda
                    "
                  >
                    ({{ item.luogo_produzione_documento.azienda.descrizione }})
                  </template>
                  <template v-else>(-)</template>
                </strong>
              </div>
            </div>

            <div class="row q-col-gutter-md q-pa-md">
              <!-- DISPONIBILE FINO AL -->
              <!-- ------------------- -->
              <div class="col-12 col-lg row q-col-gutter-x-xs items-start">
                <div class="col-auto">
                  <q-icon
                    name="img:/statics/la-mia-salute/icone/calendario.svg"
                    size="lg"
                    class="gt-xs"
                  />
                </div>

                <div class="col">
                  <div>Disponibile fino al</div>

                  <div v-if="isExpiring" class="text-warning text-weight-bold">
                    <template v-if="dayDifference === 0">
                      <span>Scade oggi</span>
                    </template>

                    <template v-if="dayDifference === 1">
                      <span>Scade domani</span>
                    </template>

                    <template v-if="dayDifference > 1">
                      <span>-{{ dayDifference }} </span>
                      <span>giorni alla scadenza</span>
                    </template>
                  </div>

                  <div v-else>
                    <strong>
                      {{ item.data_scaricabile_fino_al | date }}
                    </strong>
                  </div>
                </div>
              </div>

              <!-- TICKET -->
              <!-- ------ -->
              <div
                class="col-12 col-lg row q-col-gutter-x-xs items-start gt-xs"
              >
                <div class="col-auto">
                  <q-icon
                    name="img:/statics/la-mia-salute/icone/ticket.svg"
                    size="lg"
                  />
                </div>

                <div class="col">
                  <div>Ticket</div>

                  <!-- DA PAGARE -->
                  <!-- --------- -->
                  <template
                    v-if="
                      reportPaymentStatus ===
                        REPORT_PAYMENT_STATUS_MAP.NOT_PAYED
                    "
                  >
                    <div>
                      <rol-report-status-label :report="item" bold>
                        {{ reportPaymentStatusLabel }}
                        <rol-report-amount-label :amount="payableImport" />
                      </rol-report-status-label>
                    </div>
                  </template>

                  <!-- PAGATO PARZIALMENTE -->
                  <!-- ------------------- -->
                  <template
                    v-else-if="
                      reportPaymentStatus ===
                        REPORT_PAYMENT_STATUS_MAP.PARTIALLY_PAYED
                    "
                  >
                    <div>
                      <rol-report-status-label :report="item" bold>
                        {{ reportPaymentStatusLabel }}, restano da pagare
                        <rol-report-amount-label :amount="payableImport" />
                      </rol-report-status-label>
                    </div>
                  </template>

                  <!-- RIMBORSO -->
                  <!-- -------- -->
                  <template
                    v-else-if="
                      reportPaymentStatus === REPORT_PAYMENT_STATUS_MAP.REFUND
                    "
                  >
                    <div>
                      <rol-report-status-label :report="item" bold>
                        {{ reportPaymentStatusLabel }}

                        <template
                          v-if="payableImport !== null && payedImport !== null"
                        >
                          <div>
                            Puoi chiedere un rimborso di
                            {{ Math.abs(payableImport) | number }} &euro; su
                            {{ payedImport | number }} &euro;
                          </div>
                        </template>

                        <div>
                          È possibile ottenere il rimborso presso l'azienda
                          sanitaria
                        </div>
                      </rol-report-status-label>
                    </div>
                  </template>

                  <!-- ALTRI STATI -->
                  <!-- ----------- -->
                  <template v-else>
                    <div>
                      <rol-report-status-label :report="item" bold />
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- INFORMAZIONI DI DETTAGLIO -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <template v-if="detail">
              <div class="q-pa-md">
                <div>
                  <p style="word-break: break-all;">
                    Referto n°:
                    <strong>
                      {{ item.id_referto }}
                    </strong>
                  </p>

                  <p>
                    Pervenuto il:
                    <strong>
                      {{ item.data_inserimento | date | empty }}
                    </strong>
                  </p>

                  <p>
                    Disponibile dal:
                    <strong>
                      {{ item.data_disponibilita_referto | date | empty }}
                    </strong>
                  </p>

                  <p>
                    Unità operativa:
                    <strong>
                      {{
                        item.luogo_produzione_documento.unita_operativa
                          .descrizione
                      }}
                    </strong>
                  </p>

                  <p>
                    Firmato/Validato da:
                    <strong>
                      {{ item.medico_refertante | empty | capitalCase }}
                      /
                      {{ item.medico_validante | empty | capitalCase }}
                    </strong>
                  </p>

                  <p>
                    Numero ricetta:
                    <strong>
                      {{ nre | empty }}
                    </strong>
                  </p>

                  <rol-report-health-care-list :health-cares="healthCares" />
                </div>
              </div>
            </template>

            <!-- AZIONI -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <lms-buttons class="q-pa-sm">
              <lms-button
                v-if="canPay"
                label="Paga"
                no-min-width
                @click="$emit('pay')"
              />

              <lms-button
                v-if="canDownloadPdf"
                label="Scarica"
                no-min-width
                @click="$emit('download')"
              />

              <lms-button
                v-if="!detail"
                outline
                label="Dettagli"
                no-min-width
                @click="$emit('detail')"
              />

              <lms-button
                v-if="canRequestImage"
                outline
                label="Prenota immagine"
                no-min-width
                @click="$emit('image-request')"
              />

              <lms-button
                v-if="canDownloadImage"
                outline
                label="Scarica immagine"
                no-min-width
                @click="$emit('image-download')"
              />
            </lms-buttons>
          </template>
        </lms-card-item>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { date } from "quasar";
import { REPORT_PAYMENT_STATUS_MAP } from "src/services/config";
import { HELP_CONTACTS } from "src/router/routes";
import {
  canRequestImage as _canRequestImage,
  isImageInElaboration as _isImageInElaboration,
  imageHasIrreversibleError as _imageHasIrreversibleError,
  canDownloadImage as _canDownloadImage,
  canDownloadPdf as _canDownloadPdf,
  canPay as _canPay,
  hasRefund as _hasRefund,
  isRefundDownloadable as _isRefundDownloadable,
  isExpiring as _isExpiring,
  isExpired as _isExpired,
  getPaymentStatus,
  getPaymentStatusLabel,
  getTypeCode,
  getTypeLabel,
  getPayableImport,
  getPayedImport
} from "src/services/business-logic";
import LmsCardItem from "./core/LmsCardItem";
import LmsCardItemPrimary from "src/components/core/LmsCardItemPrimary";
import RolReportAmountLabel from "src/components/RolReportAmountLabel";
import RolReportStatusLabel from "./RolReportStatusLabel";
import RolReportHealthCareList from "src/components/RolReportHealthCareList";
import RolReportTypeIcon from "./RolReportTypeIcon";
import LmsCardItemBar from "./core/LmsCardItemBar";

const { getDateDiff } = date;

export default {
  name: "RolReportListItem",
  components: {
    LmsCardItemBar,
    LmsCardItem,
    LmsCardItemPrimary,
    RolReportTypeIcon,
    RolReportHealthCareList,
    RolReportAmountLabel,
    RolReportStatusLabel
  },
  props: {
    item: { type: Object, required: true },
    detail: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      REPORT_PAYMENT_STATUS_MAP
    };
  },
  computed: {
    delegatorSelected() {
      return this.$store.getters["getDelegatorSelected"];
    },
    reportTypeCode() {
      return getTypeCode(this.item);
    },
    reportTypeLabel() {
      return getTypeLabel(this.reportTypeCode);
    },
    reportPaymentStatus() {
      return getPaymentStatus(this.item);
    },
    reportPaymentStatusLabel() {
      return getPaymentStatusLabel(this.item);
    },
    // L'utente che opera in "modalità delega" non deve vedere il bottone "Paga"
    canPay() {
      return _canPay(this.item) && !this.delegatorSelected;
    },
    hasRefund() {
      return _hasRefund(this.item);
    },
    isRefundDownloadable() {
      return _isRefundDownloadable(this.item);
    },
    canRequestImage() {
      return _canRequestImage(this.item);
    },
    isImageInElaboration() {
      return _isImageInElaboration(this.item);
    },
    imageHasIrreversibleError() {
      return _imageHasIrreversibleError(this.item);
    },
    canDownloadImage() {
      return _canDownloadImage(this.item);
    },
    canDownloadPdf() {
      return _canDownloadPdf(this.item);
    },
    isExpiring() {
      return _isExpiring(this.item);
    },
    isExpired() {
      return _isExpired(this.item);
    },
    dayDifference() {
      let to = this.item?.data_scaricabile_fino_al;
      return getDateDiff(to, new Date(), "days");
    },
    nre() {
      let nreList = this.item?.elenco_nre ?? [];
      return nreList.join("\n");
    },
    healthCares() {
      return this.item.elenco_prestazioni;
    },
    payableImport() {
      return getPayableImport(this.item);
    },
    payedImport() {
      return getPayedImport(this.item);
    }
  },
  methods: {
    goToHelp() {
      this.$router.push(HELP_CONTACTS);
    }
  }
};
</script>

<style lang="sass"></style>
