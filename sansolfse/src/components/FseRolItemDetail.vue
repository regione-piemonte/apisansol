<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<!--
Componente che rappresenta un referto ROL (Area rossa) visualizzato come dettaglio
-->

<template>
  <div class="fse-rol-item-detail">
    <!-- BARRE INFORMATIVE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="!isPdfDownloadable && isPayable">
      <lms-card-item-bar class="bg-red-3">
        Non scaricabile per mancato pagamento
      </lms-card-item-bar>
    </template>

    <template v-if="isImageInElaboration">
      <lms-card-item-bar class="bg-blue-3">
        Le immagini prenotate sono in fase di elaborazione
      </lms-card-item-bar>
    </template>

    <template v-if="hasImageIrreversibleError">
      <lms-card-item-bar class="bg-red-3">
        Non è stato possibile generare il pacchetto. E' necessario rivolgersi all'Azienda Sanitaria
      </lms-card-item-bar>
    </template>

    <!-- DOCUMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-card-item>
      <template #primary>
        <lms-card-item-primary>
          <template #icon>
            <fse-document-item-type-icon :type="typeCode" size="xl" />
          </template>

          <template #text>
            <div class="text-bold">
              {{ typeName | empty | caseSentence }}
            </div>

            <div class="q-mt-sm text-caption">
              Emesso il
              <span class="text-bold">{{ issueDate | date | empty }}</span>
            </div>
          </template>
        </lms-card-item-primary>
      </template>

      <template #secondary>
        <div class="row q-col-gutter-md q-py-md">
          <div class="col-12">
            <q-item>
              <q-item-section side>
                <q-icon
                  name="img:/statics/la-mia-salute/icone/ospedale.svg"
                  size="lg"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ structureName }} ({{ aslName }})</q-item-label>

                <template v-if="episodeType">
                  <q-item-label class="text-caption">
                    {{ episodeType }}
                  </q-item-label>
                </template>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-md-6">
            <q-item>
              <q-item-section side>
                <q-icon
                  name="img:/statics/la-mia-salute/icone/calendario.svg"
                  size="lg"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>Disponibile fino al</q-item-label>
                <q-item-label class="text-bold">
                  {{ expireDate | date | empty }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-md-6">
            <q-item>
              <q-item-section side>
                <q-icon
                  name="img:/statics/la-mia-salute/icone/ticket.svg"
                  size="lg"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>Ticket</q-item-label>
                <q-item-label class="text-bold">
                  <template v-if="isPayable">
                    Da pagare
                  </template>
                  <template v-else-if="isWithdrawable">
                    Da ritirare online
                  </template>
                  <template v-else>
                    Da ritirare
                  </template>
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-md-6">
            <q-item>
              <q-item-section>
                <q-item-label>Referto n°</q-item-label>
                <q-item-label class="text-bold">
                  {{ id }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-md-6">
            <q-item>
              <q-item-section>
                <q-item-label>Ricetta n°</q-item-label>
                <q-item-label class="text-bold">
                  {{ nreLabel | empty }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12">
            <q-item>
              <q-item-section>
                <q-item-label>Unità operativa</q-item-label>
                <q-item-label class="text-bold">
                  {{ operationalUnitLabel | empty }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12">
            <q-item>
              <q-item-section>
                <q-item-label>Assetto organizzativo</q-item-label>
                <q-item-label class="text-bold">
                  {{ organizationalStructureLabel | empty }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12">
            <q-item>
              <q-item-section>
                <q-item-label>Prestazioni</q-item-label>
                <q-item-label class="text-bold">
                  {{ performanceLabel | empty }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12">
            <q-item>
              <q-item-section>
                <q-item-label>Firmato / validato da</q-item-label>
                <q-item-label class="text-bold">
                  {{ doctorReferent | empty }} / {{ doctorValidating | empty }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12">
            <q-item>
              <q-item-section>
                <q-item-label>Formato</q-item-label>
                <q-item-label class="text-bold">
                  <template v-if="!sign">
                    -
                  </template>

                  <template v-else>
                    <template v-if="sign === DOCUMENT_SIGN_CODE_MAP.GOLD">
                      <span>
                        <q-icon name="img:icone/icon-gold.svg" size="sm" />
                        PDF (Gold)
                      </span>
                    </template>
                    <template
                      v-else-if="sign === DOCUMENT_SIGN_CODE_MAP.SILVER"
                    >
                      <span>
                        <q-icon name="img:icone/icon-silver.svg" size="sm" />
                        PDF (Silver)
                      </span>
                    </template>
                    <template v-else>
                      <span>
                        <q-icon name="img:icone/icon-bronze.svg" size="sm" />
                        PDF (Bronze)
                      </span>
                    </template>
                    <q-icon
                      name="far fa-question-circle"
                      class="on-right cursor-pointer"
                    >
                      <q-tooltip>
                        <template v-if="sign === DOCUMENT_SIGN_CODE_MAP.GOLD">
                          Qualità alta della firma digitale
                        </template>
                        <template
                          v-else-if="sign === DOCUMENT_SIGN_CODE_MAP.SILVER"
                        >
                          Qualità media della firma digitale
                        </template>
                        <template v-else>
                          Qualità bassa della firma digitale
                        </template>
                      </q-tooltip>
                    </q-icon>
                  </template>
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>

        <lms-buttons class="q-pa-md text-right q-gutter-sm">
          <template v-if="isPayable">
            <q-btn unelevated color="red-7" @click="onPay">
              Paga referto
            </q-btn>
          </template>

          <template v-if="isPdfDownloadable">
            <q-btn
              unelevated
              color="red-7"
              type="a"
              :href="pdfUrl"
              target="_blank"
              @click="onPdfDownloadRol"
            >
              Scarica referto
            </q-btn>
          </template>

          <template v-if="isWithdrawable">
            <q-btn unelevated color="red-7" @click="onPdfDownload">
              Ritira referto
            </q-btn>
          </template>

          <template v-if="isImageBookable">
            <q-btn outline :loading="isBookingImage" @click="onImageBooking">
              Prenota immagine
            </q-btn>
          </template>

          <template v-if="isImageDownloadable">
            <q-btn
              outline
              :loading="isDownloadingImage"
              @click="onImageDownload"
            >
              Scarica immagine
            </q-btn>
          </template>
        </lms-buttons>
      </template>
    </lms-card-item>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <!-- CONSENSO PERMANENTE ROL -->
    <fse-rol-permanent-consent-dialog
      v-model="isPermanentConsentRolDialogVisible"
    />

    <!-- REGISTRA RITIRO -->
    <fse-rol-withdrawal-dialog
      v-model="isWithdrawalDialogVisible"
      :rol-id="id"
      :rol-cl="cl"
      :is-rol-old="document && document.rol === 'S'"
      :episode-id="episodeId"
      @withdrawn="$emit('withdrawn')"
    />

    <!-- PAGAMENTO -->
    <fse-rol-pay-dialog v-model="isPayDialogVisible" :rol="document" />

    <!--    DIALOG DOWNLOAD IMMAGINI-->
    <fse-document-download-image-dialog :document="document"  v-model="isImageDownloadDialog"/>
  </div>
</template>

<script>
import { DOCUMENT_DETAIL } from "../router/routes";
import LmsCardItem from "./core/LmsCardItem";
import LmsCardItemPrimary from "./core/LmsCardItemPrimary";
import LmsCardItemBar from "./core/LmsCardItemBar";
import FseRolPermanentConsentDialog from "./FseRolPermanentConsentDialog";
import FseRolPayDialog from "./FseRolPayDialog";
import FseRolWithdrawalDialog from "./FseRolWithdrawalDialog";
import {
  canDownloadImageRol,
  canDownloadPdfRol,
  canPayRol,
  canRequestImageRol,
  getPayableImportRol,
  getPayedImportRol,
  getTypeCodeRol,
  hasRefundRol,
  imageHasIrreversibleErrorRol,
  isExpiredRol,
  isExpiringRol,
  isImageInElaborationRol,
  isRefundDownloadableRol,
  isVisibleRol,
  isWithdrawableRol
} from "../services/business-logic";
import {
  createAudit,
  createImageBooking,
  getDocumentFseImageDownloadUrl, getDocumentFseImageDownloadUrl2,
  getDocumentFseImageInfo,
  getDocumentPdfUrl,
  getDocumentRolOldPdfUrl,
  setRolAsWithdrawn
} from "../services/api";
import { apiErrorNotifyDialog } from "../services/utils";
import {
  APP_CODE_MAP,
  DOCUMENT_DOCTOR_TYPE_MAP,
  DOCUMENT_IMAGE_OS_MAP,
  DOCUMENT_SIGN_CODE_MAP, IS_DEV, IS_TEST
} from "../services/config";
import { openURL } from "quasar";
import FseDocumentItemTypeIcon from "./FseDocumentItemTypeIcon";
import FseDocumentDownloadImageDialog from "components/FseDocumentDownloadImageDialog";

export default {
  name: "FseRolItemDetail",
  components: {
    FseDocumentDownloadImageDialog,
    FseDocumentItemTypeIcon,
    FseRolWithdrawalDialog,
    FseRolPayDialog,
    FseRolPermanentConsentDialog,
    LmsCardItemBar,
    LmsCardItemPrimary,
    LmsCardItem
  },
  props: {
    document: { type: Object, required: false, default: () => null },
    documentFromList: { type: Object, required: false, default: () => null }
  },
  data() {
    return {
      DOCUMENT_SIGN_CODE_MAP,
      DOCUMENT_DETAIL,
      isPermanentConsentRolDialogVisible: false,
      isWithdrawalDialogVisible: false,
      isPayDialogVisible: false,
      isBookingImage: false,
      isDownloadingImage: false,
      isWithdrawing: false,
      isImageDownloadDialog:false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    id() {
      return this.documentFromList?.id_documento_ilec;
    },
    cl() {
      return this.documentFromList?.codice_cl;
    },
    issueDate() {
      return this.documentFromList?.data_emisione;
    },
    insertDate() {
      return this.documentFromList?.data_inserimento;
    },
    expireDate() {
      return this.documentFromList?.data_scadenza;
    },
    episodeId() {
      return this.documentFromList?.id_episodio;
    },
    expireDays() {
      if (!this.expireDate) return null;
      let now = new Date();

      return getDateDiff(this.expireDate, now, "days");
    },
    typeCode() {
      return getTypeCodeRol(this.documentFromList);
    },
    typeName() {
      return this.documentFromList?.tipo_documento?.descrizione;
    },
    structureName() {
      return this.documentFromList?.descrizione_struttura;
    },
    aslName() {
      return this.documentFromList?.azienda?.descrizione;
    },
    isWithdrawable() {
      return isWithdrawableRol(this.documentFromList);
    },
    isVisible() {
      return isVisibleRol(this.documentFromList);
    },
    payableImport() {
      return getPayableImportRol(this.documentFromList);
    },
    payedImport() {
      return getPayedImportRol(this.documentFromList);
    },
    hasRefund() {
      return this.documentFromList && hasRefundRol(this.documentFromList);
    },
    isRefundDownloadable() {
      return isRefundDownloadableRol(this.documentFromList);
    },
    refundImport() {
      return Math.abs(this.payableImport);
    },
    isPdfDownloadable() {
      return canDownloadPdfRol(this.documentFromList);
    },
    isPayable() {
      return canPayRol(this.documentFromList);
    },
    isImageBookable() {
      return canRequestImageRol(this.documentFromList);
    },
    isImageInElaboration() {
      return isImageInElaborationRol(this.documentFromList);
    },
    hasImageIrreversibleError() {
      return imageHasIrreversibleErrorRol(this.documentFromList);
    },
    isImageDownloadable() {
      return canDownloadImageRol(this.documentFromList);
    },
    isExpiring() {
      return isExpiringRol(this.documentFromList);
    },
    isExpired() {
      return isExpiredRol(this.documentFromList);
    },
    classes() {
      let out = [];

      if (this.isVisible) out.push("fse-rol-item-detail--visible");
      if (!this.isVisible) out.push("fse-rol-item-detail--hidden");
      if (this.hasRefund) out.push("fse-rol-item-detail--refundable");

      return out;
    },
    pdfUrl() {
      let isRolOld = this.documentFromList?.rol === "S";
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.id;

      if (isRolOld) {
        let params = {
          componente_locale: this.cl,
          id_documento_cl: documentId,
          firmato: "S"
        };

        return getDocumentRolOldPdfUrl(taxCode, { params });
      } else {
        let params = {
          componente_locale: this.cl,
          id_episodio: this.episodeId,
          firmato_digitalmente: "S",
          criptato: "S",
          pdf: true
        };

        // if (process.env.APP_IS_DEV || process.env.APP_IS_TEST)
        params.codice_app_verticale = APP_CODE_MAP.FSE;

        return getDocumentPdfUrl(taxCode, documentId, { params });
      }
    },
    // COMPUTED CHE DERIVANO DAL DOCUMENTO DI DETTAGLIO
    nreList() {
      return this.document?.nre ?? [];
    },
    nreLabel() {
      return this.nreList.join(" ");
    },
    operationalUnitLabel() {
      return this.document?.metadati?.descrizione_unita_operativa;
    },
    organizationalStructureLabel() {
      return this.organizationalStructure?.descrizione;
    },
    performanceList() {
      return this.document?.metadati?.prestazioni ?? [];
    },
    performanceLabel() {
      // return this.performanceList.join(", ");
      return this.performanceList
        .map(el => el.descrizione ?? null)
        .filter(el => !!el)
        .join(", ");
    },
    doctorList() {
      return this.document?.medici ?? [];
    },
    doctorReferent() {
      let doctor = this.doctorList.find(
        d => d.tipo_medico === DOCUMENT_DOCTOR_TYPE_MAP.REFERENT
      );

      if (!doctor || !doctor.cognome || !doctor.nome) return null;
      return `${doctor.cognome} ${doctor.nome}`;
    },
    doctorValidating() {
      let doctor = this.doctorList.find(
        d => d.tipo_medico === DOCUMENT_DOCTOR_TYPE_MAP.VALIDATING
      );

      if (!doctor || !doctor.cognome || !doctor.nome) return null;
      return `${doctor.cognome} ${doctor.nome}`;
    },
    sign() {
      return this.document?.metadati?.coccarda;
    },
    episodeType() {
      return this.document?.episodio?.tipo_episodio?.descrizione;
    }
  },
  created() {},
  methods: {
    onPdfDownload() {
      this.isWithdrawalDialogVisible = true;
    },
    async onWithdrawal() {
      let taxCode = this.$store.getters["getTaxCode"];
      let rolId = this.id;

      let payload = {
        codice_cl: this.cl
      };

      this.isWithdrawing = true;

      try {
        let { data } = await setRolAsWithdrawn(taxCode, rolId, payload);
        this.$emit("withdrawn");
      } catch (error) {
        let message = "Non è stato possibile salvare il referto come ritirato";
        apiErrorNotifyDialog({ error, message });
      }

      this.isWithdrawing = false;
    },
    onPdfDownloadRol() {
      // @TODO: Si è deciso temporaneamente di renderlo sempre visibile
      this.isPermanentConsentRolDialogVisible = true;
    },
    onPay() {
      this.isPayDialogVisible = true;
    },
    async onImageBooking() {
      let taxCode = this.$store.getters["getTaxCode"];
      // let documentId = this.id;
      let documentId = this.document?.codice_documento_dipartimentale;

      let accessionNumberList = this.document?.accession_numbers ?? [];
      accessionNumberList = accessionNumberList.map(el => el.accession_number);

      let payload = {
        codice_componente_locale: this.cl,
        sistema_operativo: DOCUMENT_IMAGE_OS_MAP.WINDOWS,
        accession_numbers: accessionNumberList
      };

      this.isBookingImage = true;

      try {
        let { data } = await createImageBooking(taxCode, documentId, payload);
        this.$emit("image-booked");

        try {
          let userAudit = this.$store.getters["getUser"];
          let taxCodeAudit = this.$store.getters["getTaxCode"];
          let departmentCode = this.document?.codice_documento_dipartimentale;
          let payloadAudit = {
            codice_verticale: "FSEDOC",
            codice_audit: "IMR_RIC_SCA_PAC",
            parametri: [
              { indice: "1", valore: userAudit?.cf },
              { indice: "2", valore: taxCodeAudit },
              { indice: "3", valore: departmentCode }
            ]
          };

          createAudit(taxCodeAudit, payloadAudit);
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        let message = "Non è stato possibile prenotare il referto";
        apiErrorNotifyDialog({ error, message });
      }

      this.isBookingImage = false;
    },
    async onImageDownload() {

      this.isImageDownloadDialog=true
    },
    getQualityLabel(sign) {
      if (sign === DOCUMENT_SIGN_CODE_MAP.GOLD)
        return "Qualità alta della firma digitale";
      else if (sign === DOCUMENT_SIGN_CODE_MAP.SILVER)
        return "Qualità media della firma digitale";
      else if (sign === DOCUMENT_SIGN_CODE_MAP.BRONZE)
        return "Qualità bassa della firma digitale";
      else return "";
    }
  }
};
</script>

<style lang="scss">
.fse-rol-item-detail {
  position: relative;
}
</style>
