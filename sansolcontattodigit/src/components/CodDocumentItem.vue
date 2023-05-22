<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<!--
Componente che rappresenta un referto FSE (Area Blu) visualizzato in una lista
-->

<template>
  <div
    :class="classes"
    class="cod-document-item"
  >
    <!-- BARRE INFORMATIVE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="notPayed">
      <lms-card-item-bar class="bg-red-3">
        Questo documento non può essere allegato perché risulta un ticket ancora da pagare
      </lms-card-item-bar>
    </template>


<!--    <template v-if="isImageInElaboration">-->
<!--      <lms-card-item-bar class="bg-blue-2">-->
<!--        Le immagini prenotate sono in fase di elaborazione-->
<!--      </lms-card-item-bar>-->
<!--    </template>-->

    <template v-if="!isPdfDownloadable && hasRefund && !isRefundDownloadable">
      <lms-card-item-bar class="bg-red-3">
        Questo referto non può essere scaricato in quanto non è stato possibile
        eseguire tutte le prestazioni previste. <br/>
        Contatta l'azienda sanitaria che ha eseguito le prestazioni per ottenere
        istruzioni sul ritiro del referto e sulla gestione amministrativa del
        pagamento. <br/>
        Ci scusiamo per il disagio.
      </lms-card-item-bar>
    </template>

    <!-- DOCUMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-card-item>
      <template #primary>
        <!-- TIPOLOGIA -->
        <lms-card-item-primary class="relative-position">
          <template #icon>
            <cod-document-item-type-icon :type="typeCode" size="xl"/>
          </template>

          <template #text="props">
            <div :class="{ 'q-px-md': props.isDesktop }" class="text-bold">
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

            <!-- EPISODIO -->
            <template v-if="hasEpisode">
              <div class="q-mt-md">
                Documento relativo a {{ episodeType }} presso {{ episodePlace }}
                {{ episodeDate | date }}
                <template v-if="associatedLink && hasEpisodeAssociated">
                  <a
                    class="lms-link on-right"
                    href="#"
                    @click.prevent="onSearchAssociatedByEpisode"
                  >
                    Mostra tutti
                  </a>
                </template>
              </div>
            </template>

            <!-- RICETTA ELETTRONICA (NRE) -->
            <template v-if="hasNre">
              <div class="q-mt-md">
                Documento relativo a ricetta elettronica n° {{ nreLabel }}
                <template v-if="associatedLink && hasNreAssociated">
                  <a
                    class="lms-link on-right"
                    href="#"
                    @click.prevent="onSearchAssociatedByNre"
                  >
                    Mostra tutti
                  </a>
                </template>
              </div>
            </template>

            <!-- ASSOCIAZIONI -->
            <template v-if="isAssociated">
              <div class="q-mt-md">
                Documento associato ad altri
                <template v-if="associatedLink">
                  <a class="lms-link on-right" href="#">
                    Mostra tutti
                  </a>
                </template>
              </div>
            </template>

            <!-- DOCUMENTO CARICATO DA TE -->
            <template v-if="isPersonal">
              <div class="q-mt-md text-caption">
                Documento caricato da te
              </div>
            </template>




            <!-- ETICHETTE -->
            <template v-if="tagList.length > 0">
              <div class="q-mt-md">
                <q-chip
                  v-for="tag in tagList"
                  :key="tag.id"
                  class="q-pr-none"
                  clickable
                  color="blue-1"
                  text-color="black"

                >
                  <span>{{ tag.testo }}</span>

                </q-chip>
              </div>
            </template>
          </div>

          <!-- AZIONI -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <div class="q-pa-md row items-center q-col-gutter-md">


            <div class="col-12 col-md text-right q-gutter-x-sm">
              <template v-if="!notPayed">
                <q-btn
                  color="primary"
                  outline
                  unelevated
                  @click="onShowDocumentInfo"
                >
                  Consulta
                </q-btn>

                <template v-if="isAttached">
                  <q-btn color="negative"
                         unelevated
                         outline
                         @click="onCancelAttachmentClick"
                  >
                    Rimuovi
                  </q-btn>
                </template>
                <template v-else>
                  <q-btn color="primary"
                         unelevated
                         @click="onAttachmentClick"
                  >
                    Allega
                  </q-btn>
                </template>
              </template>



              <template v-else>
                <div class="text-italic text-caption"><strong></strong></div>
              </template>

            </div>
          </div>


        </div>
      </template>
    </lms-card-item>

    <!-- OCCHIO OSCURAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="!isVisible || isPersonal">
      <div class="fse-document-item__status-icon q-gutter-x-md">
        <template v-if="!isVisible">
          <q-icon name="fas fa-eye-slash" size="xs">
            <q-tooltip>Documento oscurato</q-tooltip>
          </q-icon>
        </template>
        <template v-if="isPersonal">
          <q-icon
            aria-label="Documento inserito da te"
            name="fas fa-upload"
            size="xs"
          >
            <q-tooltip>Documento inserito da te</q-tooltip>
          </q-icon>
        </template>
      </div>
    </template>

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


    <!-- INFO DOCUMENTO OSCURATO -->
    <q-dialog v-model="showHiddenDocumentDialog">
      <q-card>
        <q-toolbar>
          <q-toolbar-title>
            Documento oscurato
          </q-toolbar-title>

          <q-btn v-close-popup flat round icon="close"  aria-label="chiudi finestra" />
        </q-toolbar>

        <q-card-section >
          <lms-banner type="warning" class="q-mb-md">
            Attenzione, hai scelto di condividere un documenti oscurato, vuoi continuare?
          </lms-banner>
        <lms-buttons>
          <lms-button @click="onAttachmentDocument">Conferma</lms-button>
<!--          <lms-button outline v-close-popup>Annulla</lms-button>-->
          <lms-button outline @click="onDoNotAsk">Non chiedermelo più</lms-button>
        </lms-buttons>


        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import LmsCardItemBar from "./core/LmsCardItemBar";

import {
  APPLICATION_CODE,
  ASSOCIATION_OPERATION_TYPE_MAP, DOCUMENT_HIDDEN_DIALOG, DOCUMENT_HIDDEN_DIALOG_VALUE,
  DOCUMENT_PERSONAL_CONTRIBUTION_TYPE_MAP,
  IS_DEV,
  IS_TEST, PAYMENT_STATUS_CODE_LIST_PAYABLE,
} from "../services/config";
import {
  isVisibleFse,
  getPayableImportFse,
  getPayedImportFse,
  hasRefundFse,
  isRefundDownloadableFse,
  canDownloadPdfFse,
  isImageInElaborationFse,
  imageHasIrreversibleErrorFse,
  isExpiringFse,
  isExpiredFse,
  isPersonalFse,
  getTypeCodeFse, canDownloadImageFse
} from "../services/business-logic";
import {
  apiErrorNotifyDialog,

} from "../services/utils";
import {
  getDocumentAssociatedList,
  getDocumentPdfUrl,
  getDocumentPersonalAttachmentPdfUrl,
} from "../services/api";
import LmsCardItem from "./core/LmsCardItem";
import LmsCardItemPrimary from "./core/LmsCardItemPrimary";
import CodDocumentItemTypeIcon from "components/CodDocumentItemTypeIcon";
import CodDocumentPersonalTranscriptionDialog from "components/CodDocumentPersonalTranscriptionDialog";
import CodDocumentAssociatedListByEpisodeDialog from "components/CodDocumentAssociatedListByEpisodeDialog";
import CodDocumentAssociatedListByNreDialog from "components/CodDocumentAssociatedListByNreDialog";
import {LocalStorage} from "quasar";
import LmsBanner from "components/core/LmsBanner";

const EXEMPTION_CODES = ["57827-8", "REG-ESE-11488-4"];
export default {
  name: "CodDocumentItem",
  components: {
    LmsBanner,
    CodDocumentAssociatedListByNreDialog,
    CodDocumentAssociatedListByEpisodeDialog,
    CodDocumentPersonalTranscriptionDialog,
    CodDocumentItemTypeIcon,
    LmsCardItemPrimary,
    LmsCardItem,
    LmsCardItemBar
  },
  props: {
    document: {type: Object, required: false, default: () => null},
    actions: {type: Boolean, required: false, default: false},
    associatedLink: {type: Boolean, required: false, default: false},
    isAttached:{type: Boolean, required: false, default: false},
  },
  data() {
    return {
      IS_DEV,
      IS_TEST,
      isAssociatedListByNreDialogVisible: false,
      isAssociatedListByEpisodeDialogVisible: false,
      isAssociatedListByHideDialogVisible: false,
      isDocumentPersonalTranscriptionDialogVisible: false,
      isChangingDocumentVisibility: false,
      isRemovingDocument: false,
      isBookingImage: false,
      isDownloadingImage: false,
      isTagDeleting: false,
      tagDeleting: null,
      associatedListByNre: [],
      associatedListByEpisode: [],
      associatedListByHide: [],
      showHiddenDocumentDialog:false
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
    asl(){
      return this.document?.metadati?.azienda
    },
    aslName() {
      return this.asl?.descrizione;
    },
    typeCode() {
      return getTypeCodeFse(this.document);
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
    isExemptionDocument() {
      let code = this.typeCode;
      let codes = EXEMPTION_CODES;
      return codes.includes(code);
    },
    exemptionInfo() {
      return this.$store.getters["getExemptionInfo"];
    },
    isVisible() {
      // if(process.env.APP_IS_DEV || process.env.APP_IS_TEST){
      if (this.isExemptionDocument) {
        let visibleCodes = ["N", "M"];
        let visibility = this.exemptionInfo?.oscuramento_esenzioni ?? false;
        return visibleCodes.includes(visibility);
      } else {
        return isVisibleFse(this.document);
      }
      // }
      // return isVisibleFse(this.document);
    },
    payableImport() {
      return getPayableImportFse(this.document);
    },
    notPayed(){
      let status = this.document?.metadati?.pagato_ticket
       return PAYMENT_STATUS_CODE_LIST_PAYABLE.includes(status) && !this.isPersonal
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
      params.codice_app_verticale =APPLICATION_CODE;

      return getDocumentPdfUrl(taxCode, documentId, {params});
    },
    attachmentUrl() {
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.id;
      return getDocumentPersonalAttachmentPdfUrl(taxCode, documentId);
    },
    classes() {
      let out = [];

      if (this.isVisible) out.push("fse-document-item--visible");
      if (!this.isVisible) out.push("fse-document-item--hidden");
      if (this.isPersonal) out.push("fse-document-item--personal");
      if (this.hasRefund) out.push("fse-document-item--refundable");


      return out;
    },
    isDocHiddenDialogBlocked(){
     return  this.$store.getters['isDocumentHiddenDialogBlocked']
    },
  },
  created() {
  },
  methods: {
    onShowDocumentInfo(){
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.id;
      if(this.isImageDownloadable){
        this.isImageDownloadDialog = true
      }else if(this.isPersonal){
        if(this.isContributionTypeAttachment){
          let url = getDocumentPersonalAttachmentPdfUrl(taxCode, documentId);
          window.open(url);
        }else{
          this.isDocumentPersonalTranscriptionDialogVisible = true;
        }
      }else if(this.isPdfDownloadable){
        let params = {
          componente_locale: this.cl,
          id_episodio: this.episodeId,
          firmato_digitalmente: "S",
          criptato: "S",
          pdf: true
        };
        params.codice_app_verticale = APPLICATION_CODE;
        let url = getDocumentPdfUrl(taxCode, documentId, { params });
        window.open(url);
      }
    },
    async onSearchAssociatedByNre() {
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.id;

      let params = {
        codice_cl: this.cl,
        tipo_correlazione_documento: ASSOCIATION_OPERATION_TYPE_MAP.NRE
      };

      try {
        let {data} = await getDocumentAssociatedList(taxCode, documentId, {
          params
        });

        this.associatedListByNre = data;
        this.isAssociatedListByNreDialogVisible = true;
      } catch (error) {
        let message =
          "Non è stato possibile caricare i documenti associati per NRE";
        apiErrorNotifyDialog({error, message});
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
        let {data} = await getDocumentAssociatedList(taxCode, documentId, {
          params
        });

        this.associatedListByEpisode = data;
        this.isAssociatedListByEpisodeDialogVisible = true;
      } catch (error) {
        let message =
          "Non è stato possibile caricare i documenti associati per episodio";
        apiErrorNotifyDialog({error, message});
      }
    },
    onAttachmentDocument(){
      let accessionNumbers = this.document?.accession_numbers
      if(accessionNumbers)
        accessionNumbers = accessionNumbers.map(an => {return an.accession_number})
      let asl = {...this.asl}
      asl.descrizione = this.aslName?.replaceAll("'", "")
      let attachment = {
        id_documento_ilec: this.id,
        codice_cl: this.cl,
        azienda: asl,
        descrizione_struttura: this.structureName?.replaceAll("'", ""),
        data_validazione: this.issueDate,
        tipo_documento: this.document?.metadati?.tipo_documento,
        tipo_contributo:  this.document?.metadati.tipo_contributo,
        id_episodio: this.document?.episodio?.id_episodio,
        codice_documento_dipartimentale: this.document?.metadati.codice_documento_dipartimentale,
        id_repository_cl: this.document?.metadati.id_repository_cl,
        categoria_tipologia: this.document?.categoria,
        accession_numbers: accessionNumbers
      }

      this.$emit('on-attachment', attachment)
    },
    onAttachmentClick(){
      if(this.isVisible || this.isDocHiddenDialogBlocked){
       this.onAttachmentDocument()
      }else{
        this.showHiddenDocumentDialog=true
      }

    },
    onCancelAttachmentClick(){
      this.$emit('remove-attachment', this.id)
    },
    onDoNotAsk(){
      let status=DOCUMENT_HIDDEN_DIALOG_VALUE
      this.$store.dispatch('setDocumentHiddenDialogInfo', {status})
      this.onAttachmentDocument()
    }
  }
};
</script>

<style lang="scss">
.fse-document-item {
  position: relative;

  &--draggable .lms-card-item-primary:hover .fse-document-item-drag-hint {
    opacity: 1;
    width: 100%;
    height: 100%;
  }
}

.fse-document-item-drag-hint {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  overflow: hidden;
  z-index: $z-top;
  background-color: $primary;
  padding-top: 16px;
  padding-bottom: 16px;
  cursor: move;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.fse-document-item__status-icon {
  position: absolute;
  left: 16px;
  bottom: 8px;
}
</style>
