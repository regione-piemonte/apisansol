<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="cod-document-item-detail">
    <!-- BARRE INFORMATIVE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="full-width">
      <template v-if="!isPersonal && !isPdfDownloadable">
        <lms-card-item-bar class="bg-red-3">
          Non scaricabile per mancato pagamento
        </lms-card-item-bar>
      </template>

<!--      <template v-if="isImageInElaboration">-->
<!--        <lms-card-item-bar class="bg-blue-2">-->
<!--          Le immagini prenotate sono in fase di elaborazione-->
<!--        </lms-card-item-bar>-->
<!--      </template>-->

<!--      <template v-if="hasImageIrreversibleError">-->
<!--        <lms-card-item-bar class="bg-red-3">-->
<!--          Non è stato possibile generare il pacchetto.-->
<!--        </lms-card-item-bar>-->
<!--      </template>-->

      <template v-if="!isPdfDownloadable && hasRefund && !isRefundDownloadable">
        <lms-card-item-bar class="bg-red-3">
          Questo referto non può essere scaricato in quanto non è stato possibile
          eseguire tutte le prestazioni previste. <br />
          Contatta l'azienda sanitaria che ha eseguito le prestazioni per ottenere
          istruzioni sul ritiro del referto e sulla gestione amministrativa del
          pagamento. <br />
          Ci scusiamo per il disagio.
        </lms-card-item-bar>
      </template>
    </div>


    <!-- DOCUMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div
        class="no-margin bg-grey-3 q-py-md row q-col-gutter-x-md items-center"

    >
      <div class="col-auto" >
          <cod-document-item-type-icon :type="typeCode" size="lg" />
      </div>

      <div class="col" >
        <!-- TIPOLOGIA -->
        <div class="text-bold">
          {{ typeName | empty }}
        </div>

        <!-- DATA -->
        <div class="q-mt-sm text-caption">
          Emesso il
          <span class="text-bold">{{ issueDate | date | empty }}</span>
        </div>
      </div>


      <!-- OCCHIO OSCURAMENTO -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <template v-if="!isVisible || isPersonal">
        <div class="col-auto fse-document-item-detail__status-icon q-px-md">
          <template v-if="!isVisible">
            <q-icon name="fas fa-eye-slash" size="xs" class="q-px-sm">
              <q-tooltip>Documento oscurato</q-tooltip>
            </q-icon>
          </template>
          <template v-if="isPersonal">
            <q-icon
              name="fas fa-upload"
              size="xs"
              aria-label="Documento inserito da te"
              class="q-px-sm"
            >
              <q-tooltip>Documento inserito da te</q-tooltip>
            </q-icon>
          </template>
        </div>
      </template>

    </div>


    <div class="row q-col-gutter-md q-py-md">
      <!-- AZIENDA SANITARIA + EPISODIO -->
      <div class="col-12">
        <q-item>
          <q-item-section side>
            <q-icon
                name="img:/statics/la-mia-salute/icone/ospedale.svg"
                size="lg"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ structureName }} <template v-if="aslName">({{ aslName }})</template></q-item-label>

            <template v-if="episodeType">
              <q-item-label class="text-caption">
                {{ episodeType }}
              </q-item-label>
            </template>
          </q-item-section>



        </q-item>
      </div>

      <!-- STATO TICKET -->
      <div class="col-12">
        <q-item>
          <q-item-section side>
            <q-icon
                name="img:/statics/la-mia-salute/icone/ticket.svg"
                size="lg"
            />
          </q-item-section>

        </q-item>
      </div>

      <!-- ID -->
      <div class="col-12 col-md-6">
        <q-item>
          <q-item-section>
            <q-item-label>Referto n°</q-item-label>
            <q-item-label class="text-bold">
              {{ id | empty }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>

      <!-- NRE -->
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

      <!-- UNITA OPERATIVA -->
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

      <!-- ASSETTO ORGANIZZATIVO -->
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

      <!-- PRESTAZIONI -->
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

      <!-- MEDICO -->
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

      <!-- PREGRESSO -->
      <div class="col-12 col-md-6">
        <q-item>
          <q-item-section>
            <q-item-label>Pregresso</q-item-label>
            <q-item-label class="text-bold">
              <template v-if="!isPreviousRecovery">-</template>
              <template v-else>
                Il referto proviene da una richiesta di recupero del
                pregresso
              </template>
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>

      <!-- COCCARDA -->
      <div class="col-12 col-md-6">
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



    <!-- AZIONI -->
    <!-- ------------------------------------------------------------------------------------------------------- -->
    <lms-buttons class="q-pa-md">


<!--      <template v-if="isImageDownloadable">-->
<!--        <lms-button-->
<!--            unelevated-->
<!--            color="primary"-->
<!--            :loadin="isDownloadingImage"-->
<!--            @click="onImageDownload"-->
<!--        >-->
<!--          Scarica immagine-->
<!--        </lms-button>-->
<!--      </template>-->

      <template v-if="isPersonal">
        <!-- IL CITTADINO HA AGGIUNTO UN ALLEGATO QUANDO HA CREATO IL DOCUMENTO PERSONALE -->
        <template v-if="isContributionTypeAttachment">
          <lms-button
              unelevated
              color="primary"
              type="a"
              :href="attachmentUrl"
              target="_blank"
          >
            Scarica allegato
          </lms-button>
        </template>

        <!-- IL CITTADINO HA INSERITO UNA TRASCRIZIONE QUANDO HA CREATO IL DOCUMENTO PERSONALE -->
        <template v-else>
          <lms-button
              unelevated
              color="primary"
              @click="onTranscriptionClick"
          >
            Visualizza
          </lms-button>
        </template>
      </template>

      <template v-if="!isPersonal && isPdfDownloadable">
        <lms-button
            unelevated
            color="primary"
            type="a"
            :href="pdfUrl"
            target="_blank"
        >
          Consulta referto
        </lms-button>
      </template>


    </lms-buttons>





    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->


    <!-- ELENCO DOCUMENTI ASSOCIATI PER NRE -->
    <cod-document-associated-list-by-nre-dialog
      v-model="isAssociatedListByNreDialogVisible"
      :document-list="associatedListByNre"
    />

    <!-- ELENCO DOCUMENTI ASSOCIATI PER EPISODIO -->
    <cod-document-associated-list-by-episode-dialog
      v-model="isAssociatedListByEpisodeDialogVisible"
      :document-list="associatedListByEpisode"
    />

    <!-- VISUALIZZAZIONE TRASCIZIONE -->
    <cod-document-personal-transcription-dialog
      v-model="isDocumentPersonalTranscriptionDialogVisible"
      :document="document"
    />

    <!--    DIALOG DOWNLOAD IMMAGINI-->
<!--    <cod-document-download-image-dialog :document="document"  v-model="isImageDownloadDialog"/>-->
  </div>
</template>

<script>
import LmsCardItemBar from "components/core/LmsCardItemBar";
import CodDocumentItemTypeIcon from "components/CodDocumentItemTypeIcon";
import CodDocumentAssociatedListByNreDialog from "components/CodDocumentAssociatedListByNreDialog";
import CodDocumentAssociatedListByEpisodeDialog from "components/CodDocumentAssociatedListByEpisodeDialog";

import {
  APPLICATION_CODE,
  ASSOCIATION_OPERATION_TYPE_MAP,
  DOCUMENT_DOCTOR_TYPE_MAP, DOCUMENT_IMAGE_OS_MAP,
  DOCUMENT_PERSONAL_CONTRIBUTION_TYPE_MAP,
  DOCUMENT_SIGN_CODE_MAP, TAG_OPERATION_TYPE_CODE_MAP, TAG_TYPE_MAP
} from "src/services/config";
import {
  canDownloadImageFse,
  canDownloadPdfFse,
  canPayFse,
  canRequestImageFse,
  getPayableImportFse,
  getPayedImportFse,
  hasRefundFse,
  imageHasIrreversibleErrorFse,
  isExpiredFse,
  isExpiringFse,
  isImageInElaborationFse,
  isPersonalFse,
  isPreviousRecoveryFse,
  isRefundDownloadableFse,
  isVisibleFse
} from "src/services/business-logic";
import {
  createImageBooking,
  getDocumentAssociatedList,
  getDocumentPdfUrl,
  getDocumentPersonalAttachmentPdfUrl
} from "src/services/api";
import {apiErrorNotifyDialog, notifySuccess} from "src/services/utils";
import CodDocumentPersonalTranscriptionDialog from "components/CodDocumentPersonalTranscriptionDialog";

export default {
name: "CodDocumentItemDetail",
  components: {
    CodDocumentPersonalTranscriptionDialog,
    LmsCardItemBar,
    CodDocumentAssociatedListByEpisodeDialog,
    CodDocumentAssociatedListByNreDialog,
    CodDocumentItemTypeIcon,  },
  props: {
    document: { type: Object, required: false, default: () => null }
  },
  data() {
    return {
      DOCUMENT_SIGN_CODE_MAP,
      isAssociatedListByNreDialogVisible: false,
      isAssociatedListByEpisodeDialogVisible: false,
      isAssociatedListByHideDialogVisible: false,
      isDocumentPersonalTranscriptionDialogVisible: false,
      isBookingImage: false,
      isDownloadingImage: false,
      isTagDeleting: false,
      tagDeleting: null,
      associatedListByNre: [],
      associatedListByEpisode: [],
      associatedListByHide: [],
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
    structureName() {
      return this.document?.metadati?.descrizione_struttura;
    },
    aslName() {
      return this.document?.metadati?.azienda?.descrizione;
    },
    typeCode() {
      return this.document?.metadati?.tipo_documento?.codice;
    },
    typeName() {
      return this.document?.metadati?.tipo_documento?.descrizione;
    },
    issueDate() {
      return this.document?.metadati?.data_validazione;
    },
    nreList() {
      return this.document?.nre ?? [];
    },
    hasNre() {
      return this.nreList.length > 0;
    },
    hasNreAssociated() {
      return this.document?.metadati?.flag_associazioni_nre;
    },
    nreLabel() {
      return this.nreList.join(" ");
    },
    isPersonal() {
      return isPersonalFse(this.document);
    },
    isContributionTypeAttachment() {
      return (
        this.document?.metadati.tipo_contributo ===
        DOCUMENT_PERSONAL_CONTRIBUTION_TYPE_MAP.ATTACHMENT
      );
    },
    tagFixed() {
      return this.document?.etichetta_anatomica;
    },
    tagListPersonal() {
      return this.document?.etichette_personali ?? [];
    },
    tagList() {
      let result = [];

      if (this.tagFixed) result.push(this.tagFixed);
      result = [...result, ...this.tagListPersonal];

      return result;
    },
    hasEpisode() {
      return this.document?.episodio;
    },
    hasEpisodeAssociated() {
      return this.document?.metadati?.flag_episodi_collegati;
    },
    episodeId() {
      return this.document?.episodio?.id_episodio;
    },
    episodeType() {
      return this.document?.episodio?.tipo_episodio?.descrizione;
    },
    episodePlace() {
      return this.document?.episodio?.descrizione_struttura_accettazione;
    },
    episodeDate() {
      return this.document?.episodio?.data_inizio;
    },
    isAssociated() {
      return this.document?.metadati?.flag_associazioni_append;
    },

    isVisible() {
      return isVisibleFse(this.document);
    },
    payableImport() {
      return getPayableImportFse(this.document);
    },
    payedImport() {
      return getPayedImportFse(this.document);
    },
    hasRefund() {
      return this.document && hasRefundFse(this.document);
    },
    isRefundDownloadable() {
      return isRefundDownloadableFse(this.document);
    },
    refundImport() {
      return Math.abs(this.payableImport);
    },
    isPdfDownloadable() {
      return canDownloadPdfFse(this.document);
    },
    isPayable() {
        return canPayFse(this.document);
    },
    isImageBookable() {
      return canRequestImageFse(this.document);
    },
    isImageInElaboration() {
      return isImageInElaborationFse(this.document);
    },
    hasImageIrreversibleError() {
      return imageHasIrreversibleErrorFse(this.document);
    },
    isImageDownloadable() {
      return canDownloadImageFse(this.document);
    },
    isExpiring() {
      return isExpiringFse(this.document);
    },
    isExpired() {
      return isExpiredFse(this.document);
    },

    pdfUrl() {
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.id;
      let params = {
        componente_locale: this.cl,
        id_episodio: this.episodeId,
        firmato_digitalmente: "S",
        criptato: "S",
        pdf: true
      };

      // if (process.env.APP_IS_DEV || process.env.APP_IS_TEST)
      params.codice_app_verticale = APPLICATION_CODE;

      return getDocumentPdfUrl(taxCode, documentId, { params });
    },
    attachmentUrl() {
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.id;
      return getDocumentPersonalAttachmentPdfUrl(taxCode, documentId);
    },
    operationalUnitLabel() {
      return this.document?.metadati?.descrizione_unita_operativa;
    },
    organizationalStructure() {
      return this.document?.metadati?.assetto_organizzativo;
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
    sign() {
      return this.document?.metadati?.coccarda;
    },
    isPreviousRecovery() {
      return isPreviousRecoveryFse(this.document);
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
    classes() {
      let out = [];

      if (this.isVisible) out.push("fse-document-item-detail--visible");
      if (!this.isVisible) out.push("fse-document-item-detail--hidden");
      if (this.isPersonal) out.push("fse-document-item-detail--personal");
      if (this.hasRefund) out.push("fse-document-item-detail--refundable");

      return out;
    }
  },
  created() {},
  methods: {

    onTranscriptionClick() {
      this.isDocumentPersonalTranscriptionDialogVisible = true;
    },

    onTagClick(tag) {
      this.$emit("tag-click", tag);
    },
    onTagsAssociated(tags) {
      this.document.etichetta_anatomica = tags.tagFixed;
      this.document.etichette_personali = tags.tagPersonalList;
    },
    async onTagDelete(tag) {
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.id;

      let isFixed = tag.tipologia_etichetta === TAG_TYPE_MAP.FIXED;
      let payload = {
        categoria: this.document?.categoria,
        id_tag_fisso: isFixed ? tag.id : null,
        lista_id_etichette: isFixed ? [] : [tag.id],
        tipo_operazione: TAG_OPERATION_TYPE_CODE_MAP.REMOVE
      };

      // I documenti personali, cioè quelli caricati in maniera autonoma,
      // non richiedono il codice cl nel payload
      if (!this.isPersonal) {
        payload.codice_cl = this.document?.codice_cl;
      }

      this.isTagDeleting = true;
      this.tagDeleting = tag;

      try {
        let { data } = await associateTag(taxCode, documentId, payload);
        notifySuccess("Etichetta rimossa");

        let fixed = this.document?.etichetta_anatomica;
        let personal = this.document?.etichette_personali ?? [];

        if (isFixed) fixed = null;
        if (!isFixed) personal = personal.filter(t => t.id !== tag.id);

        this.onTagsAssociated({
          tagFixed: fixed,
          tagPersonalList: personal
        });
      } catch (error) {
        let message = "Non è stato possibile rimuovere l'etichetta";
        apiErrorNotifyDialog({ error, message });
      }

      this.isTagDeleting = false;
      this.tagDeleting = null;
    },
    async onSearchAssociatedByNre() {
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.id;

      let params = {
        codice_cl: this.cl,
        tipo_correlazione_documento: ASSOCIATION_OPERATION_TYPE_MAP.NRE
      };

      try {
        let { data } = await getDocumentAssociatedList(taxCode, documentId, {
          params
        });

        this.associatedListByNre = data;
        this.isAssociatedListByNreDialogVisible = true;
      } catch (error) {
        let message =
          "Non è stato possibile caricare i documenti associati per NRE";
        apiErrorNotifyDialog({ error, message });
      }
    },
    async onSearchAssociatedByEpisode() {
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.id;

      let correlationTypeCode = null;

      if (this.document?.episodio?.numero_passaggio) {
        correlationTypeCode = ASSOCIATION_OPERATION_TYPE_MAP.EPISODE_PS;
      }

      if (this.document?.episodio?.numero_nosologico) {
        correlationTypeCode = ASSOCIATION_OPERATION_TYPE_MAP.EPISODE_SDO;
      }

      let params = {
        codice_cl: this.cl,
        tipo_correlazione_documento: correlationTypeCode
      };

      try {
        let { data } = await getDocumentAssociatedList(taxCode, documentId, {
          params
        });

        this.associatedListByEpisode = data;
        this.isAssociatedListByEpisodeDialogVisible = true;
      } catch (error) {
        let message =
          "Non è stato possibile caricare i documenti associati per episodio";
        apiErrorNotifyDialog({ error, message });
      }
    },


    async onImageBooking() {
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.document?.metadati?.codice_documento_dipartimentale;

      let accessionNumberList = this.document?.accession_numbers ?? [];
      accessionNumberList = accessionNumberList.map(el => el.accession_number);

      let payload = {
        sistema_operativo: DOCUMENT_IMAGE_OS_MAP.WINDOWS,
        codice_componente_locale: this.cl,
        accession_numbers: accessionNumberList
      };

      this.isBookingImage = true;

      try {
        let { data } = await createImageBooking(taxCode, documentId, payload);
        this.$emit("image-booked");

      } catch (error) {
        let message = "Non è stato possibile prenotare il referto";
        apiErrorNotifyDialog({ error, message });
      }

      this.isBookingImage = false;
    },
    async onImageDownload() {

      this.isImageDownloadDialog = true
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
}
</script>

<style scoped>

</style>
