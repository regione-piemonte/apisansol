<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<!--
Componente che rappresenta un referto ROL (Area rossa) visualizzato in una lista
-->

<template>
  <div class="fse-rol-item" :class="classes">
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

    <!--    <template v-if="!isPdfDownloadable && hasRefund && !isRefundDownloadable">-->
    <!--      <lms-card-item-bar class="bg-red-9 text-white">-->
    <!--        Questo referto non può essere scaricato in quanto non è stato possibile-->
    <!--        eseguire tutte le prestazioni previste. <br />-->
    <!--        Contatta l'azienda sanitaria che ha eseguito le prestazioni per ottenere-->
    <!--        istruzioni sul ritiro del referto e sulla gestione amministrativa del-->
    <!--        pagamento. <br />-->
    <!--        Ci scusiamo per il disagio.-->
    <!--      </lms-card-item-bar>-->
    <!--    </template>-->

    <!-- BARRA DI DEBUG TEMPORANEA -->
    <!--    <lms-card-item-bar>-->
    <!--      <div class="row q-col-gutter-md text-caption">-->
    <!--        <div class="col"><strong>ID:</strong> {{ id }}</div>-->
    <!--        <div class="col">-->
    <!--          <strong>rol:</strong> {{ document && document.rol | empty }}-->
    <!--        </div>-->
    <!--        <div class="col">-->
    <!--          <strong>pagato_ticket:</strong>-->
    <!--          {{ document && document.pagato_ticket | empty }}-->
    <!--        </div>-->
    <!--        <div class="col">-->
    <!--          <strong>gg_download:</strong>-->
    <!--          {{ document && document.gg_download | empty }}-->
    <!--        </div>-->
    <!--        <div class="col">-->
    <!--          <strong>id_pacchetto:</strong>-->
    <!--          {{ document && document.id_pacchetto | empty }}-->
    <!--        </div>-->
    <!--        <div class="col">-->
    <!--          <strong>stato_richiesta:</strong>-->
    <!--          {{ document && document.stato_richiesta | empty }}-->
    <!--        </div>-->
    <!--        <div class="col">-->
    <!--          <strong>id_episodio:</strong>-->
    <!--          {{ document && document.id_episodio | empty }}-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </lms-card-item-bar>-->

    <!-- DOCUMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-card-item>
      <template #primary>
        <lms-card-item-primary>
          <template #icon>
            <fse-document-item-type-icon :type="typeCode" size="xl" />
          </template>

          <template #text="props">
            <div class="text-bold" :class="{ 'q-px-md': props.isDesktop }">
              {{ typeName | empty | caseSentence }}
            </div>

            <template v-if="$c.IS_DEV || $c.IS_TEST">
              <div>ID: {{ id }}</div>
            </template>
          </template>
        </lms-card-item-primary>
      </template>

      <template #secondary>
        <div class="relative-position">
          <div class="q-pa-md">
            <div class="row q-col-gutter-md">
              <!-- AZIENDA SANITARIA -->
              <div class="col-12 col-md">
                <div class="text-bold">
                  {{ structureName }}
                </div>
                <template v-if="aslName">
                  <div class="text-caption text-bold">
                    {{ aslName }}
                  </div>
                </template>
              </div>

              <!-- DATA EMISSIONE -->
              <div class="col-12 col-md">
                Emesso il
                <span class="text-bold">{{ issueDate | date | empty }}</span>
              </div>
            </div>

            <!-- DA PAGARE -->
            <div class="q-mt-lg text-red-7">
              <span class="text-bold">
                <template v-if="isPayable">
                  Referto da pagare
                </template>
                <template v-else-if="isWithdrawable">
                  Referto da ritirare
                </template>
                <template v-else>
                  Referto da ritirare online
                </template>
              </span>

              <!-- SCADENZA -->
              <template v-if="expireDate">
                - {{ expireDays }} giorni alla scadenza
              </template>
            </div>

            <!-- CONFERMA RITIRO MANUALE -->
            <template v-if="isWithdrawable">
              <div class="text-caption">
                Hai già ritirato il referto nel centro convenzionato?
                <a
                  href="#"
                  class="lms-link"
                  @click.prevent="onWithdrawal"
                  aria-label="clicca qui per salvare il referto come ritirato"
                >
                  <span class="text-caption text-bold">Clicca qui</span>
                </a>
              </div>
            </template>

            <!-- TICKET DA RIMBORSARE -->
            <template v-if="hasRefund">
              <div class="q-mt-md text-bold text-green-9">
                Ticket da rimborsare
                <template v-if="refundImport">
                  .
                  <br />
                  Puoi chiedere un rimborso da
                  {{ refundImport | toFixed }} euro presso l'Azienda Sanitaria
                </template>
              </div>
            </template>
          </div>

          <!-- AZIONI -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <div class="q-pa-md row items-center q-col-gutter-md">
            <div class="col-12 col-md-auto">
              <router-link class="lms-link" :to="documentDetailRoute">
                <span class="text-bold">Maggiori informazioni</span>
              </router-link>
            </div>

            <div class="col-12 col-md text-right q-gutter-x-sm">
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
                <q-btn
                  outline
                  :loading="isBookingImage"
                  @click="onImageBooking"
                >
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
            </div>
          </div>
        </div>
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
import LmsCardItemBar from "./core/LmsCardItemBar";
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
  DOCUMENT_CATEGORY_MAP,
  DOCUMENT_IMAGE_OS_MAP, IS_DEV, IS_TEST
} from "../services/config";
import { openURL, date } from "quasar";
import LmsCardItem from "./core/LmsCardItem";
import LmsCardItemPrimary from "./core/LmsCardItemPrimary";
import FseDocumentItemTypeIcon from "./FseDocumentItemTypeIcon";
import FseRolPayDialog from "./FseRolPayDialog";
import FseRolWithdrawalDialog from "./FseRolWithdrawalDialog";
import FseRolPermanentConsentDialog from "./FseRolPermanentConsentDialog";
import FseDocumentDownloadImageDialog from "components/FseDocumentDownloadImageDialog";

const { getDateDiff } = date;

export default {
  name: "FseRolItem",
  components: {
    FseDocumentDownloadImageDialog,
    FseRolPermanentConsentDialog,
    FseRolWithdrawalDialog,
    FseRolPayDialog,
    FseDocumentItemTypeIcon,
    LmsCardItemPrimary,
    LmsCardItem,
    LmsCardItemBar
  },
  props: {
    document: { type: Object, required: false, default: () => null }
  },
  data() {
    return {
      isWithdrawing: false,
      isWithdrawalDialogVisible: false,
      isPermanentConsentRolDialogVisible: false,
      isBookingImage: false,
      isDownloadingImage: false,
      isPayDialogVisible: false,
      isImageDownloadDialog:false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    id() {
      return this.document?.id_documento_ilec;
    },
    cl() {
      return this.document?.codice_cl;
    },
    issueDate() {
      return this.document?.data_emisione;
    },
    insertDate() {
      return this.document?.data_inserimento;
    },
    expireDate() {
      return this.document?.data_scadenza;
    },
    episodeId() {
      return this.document?.id_episodio;
    },
    expireDays() {
      if (!this.expireDate) return null;
      let now = new Date();

      return getDateDiff(this.expireDate, now, "days");
    },
    typeCode() {
      return getTypeCodeRol(this.document);
    },
    typeName() {
      return this.document?.tipo_documento?.descrizione;
    },
    structureName() {
      return this.document?.descrizione_struttura;
    },
    aslName() {
      return this.document?.azienda?.descrizione;
    },
    isWithdrawable() {
      return isWithdrawableRol(this.document);
    },
    isVisible() {
      return isVisibleRol(this.document);
    },
    payableImport() {
      return getPayableImportRol(this.document);
    },
    payedImport() {
      return getPayedImportRol(this.document);
    },
    hasRefund() {
      return this.document && hasRefundRol(this.document);
    },
    isRefundDownloadable() {
      return isRefundDownloadableRol(this.document);
    },
    refundImport() {
      return Math.abs(this.payableImport);
    },
    isPdfDownloadable() {
      return canDownloadPdfRol(this.document);
    },
    isPayable() {
      return canPayRol(this.document);
    },
    isImageBookable() {
      return canRequestImageRol(this.document);
    },
    isImageInElaboration() {
      return isImageInElaborationRol(this.document);
    },
    hasImageIrreversibleError() {
      return imageHasIrreversibleErrorRol(this.document);
    },
    isImageDownloadable() {
      return canDownloadImageRol(this.document);
    },
    isExpiring() {
      return isExpiringRol(this.document);
    },
    isExpired() {
      return isExpiredRol(this.document);
    },
    documentDetailRoute() {
      let name = DOCUMENT_DETAIL.name;
      let params = { id: this.id, documentRolFromList: this.document };
      // I documenti del ROL posso essere solo della categoria "FSE"
      let query = {
        categoria: DOCUMENT_CATEGORY_MAP.FSE,
        cl: this.cl,
        area: "ROSSA",
        rol: this.document?.rol
      };
      return { name, params, query };
    },
    classes() {
      let out = [];

      if (this.isVisible) out.push("fse-rol-item--visible");
      if (!this.isVisible) out.push("fse-rol-item--hidden");
      if (this.hasRefund) out.push("fse-rol-item--refundable");

      return out;
    },
    pdfUrl() {
      let isRolOld = this.document?.rol === "S";
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

        // if(process.env.APP_IS_DEV || process.env.APP_IS_TEST)
        params.codice_app_verticale = APP_CODE_MAP.FSE;

        return getDocumentPdfUrl(taxCode, documentId, { params });
      }
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
      this.isImageDownloadDialog = true

    }
  }
};
</script>

<style lang="sass">
.fse-rol-item
  position: relative
</style>
