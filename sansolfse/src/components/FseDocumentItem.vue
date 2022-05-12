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
    :draggable="draggable"
    class="fse-document-item"
    @dragstart="draggable && $emit('dragstart', $event)"
  >
    <!-- BARRE INFORMATIVE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="!isPersonal && !isPdfDownloadable">
      <lms-card-item-bar class="bg-red-3">
        Non scaricabile per mancato pagamento
      </lms-card-item-bar>
    </template>

    <template v-if="isImageInElaboration">
      <lms-card-item-bar class="bg-blue-2">
        Le immagini prenotate sono in fase di elaborazione
      </lms-card-item-bar>
    </template>

    <template v-if="hasImageIrreversibleError">
      <lms-card-item-bar class="bg-red-3">
        Non è stato possibile generare il pacchetto. E' necessario rivolgersi all'Azienda Sanitaria
      </lms-card-item-bar>
    </template>

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

    <!-- DOCUMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-card-item>
      <template #primary>
        <!-- TIPOLOGIA -->
        <lms-card-item-primary class="relative-position">
          <template #icon>
            <fse-document-item-type-icon :type="typeCode" size="xl" />
          </template>

          <template #text="props">
            <div :class="{ 'q-px-md': props.isDesktop }" class="text-bold">
              {{ typeName | empty | caseSentence }}
            </div>

            <template v-if="$c.IS_DEV || $c.IS_TEST">
              <div>ID: {{ id }}</div>
            </template>

            <div class="fse-document-item-drag-hint">
              <div class="q-mt-md text-center">
                <q-icon
                  draggable="false"
                  name="img:icone/omino.svg"
                  size="64px"
                />
              </div>

              <div
                class="q-px-sm q-mt-lg text-bold text-caption text-white text-center"
              >
                Trascina il referto all'interno dell'avatar per categorizzarlo
              </div>
            </div>
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

            <!-- IMMAGINI DISPONIBILI -->
            <!--        <div class="q-mt-md text-caption">-->
            <!--          <q-icon name="far fa-image" size="xs" class="on-left" />-->
            <!--          Immagini disponibili-->
            <!--        </div>-->

            <!-- LEGGI SPECIALI -->
            <!-- @TODO: Al momento sembra che questo dato non viene offerto dalle API -->
            <!--        <div class="q-mt-md text-caption">-->
            <!--          <q-icon name="fas fa-shield-alt" size="xs" class="on-left" />-->
            <!--          Documento soggetto a leggi speciali-->
            <!--        </div>-->

            <!-- TICKET NON PAGATO -->
            <template v-if="!isPersonal && !isPdfDownloadable">
              <div class="q-mt-md text-caption">
                Documento non scaricabile perché il ticket non è ancora stato
                pagato
              </div>
            </template>

            <!-- TICKET DA RIMBORSARE -->
            <template v-if="hasRefund">
              <div class="q-mt-md text-caption text-bold text-green-9">
                Ticket da rimborsare. <br />
                Puoi chiedere un rimborso da {{ refundImport | toFixed }} euro
                presso l'Azienda Sanitaria
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
                  @click="onTagClick(tag)"
                >
                  <span>{{ tag.testo }}</span>
                  <q-btn
                    :aria-label="`cancella   ${tag.testo}`"
                    :loading="isTagDeleting && tagDeleting === tag"
                    class="q-ml-xs"
                    color="blue-8"
                    dense
                    flat
                    icon="close"
                    round
                    size="sm"
                    @click.prevent.stop="onTagDelete(tag)"
                  />
                </q-chip>
              </div>
            </template>
          </div>

          <!-- AZIONI -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <div class="q-pa-md row items-center q-col-gutter-md">
            <template v-if="detailLink">
              <div class="col-12 col-md-auto">
                <router-link :to="documentDetailRoute" class="lms-link">
                  <span class=" text-bold">Maggiori informazioni</span>
                </router-link>
              </div>
            </template>

            <div class="col-12 col-md text-right q-gutter-x-sm">
              <template v-if="actions">
                <template v-if="isImageBookable">
                  <q-btn
                    :loading="isBookingImage"
                    color="primary"
                    outline
                    @click="onImageBooking"
                  >
                    Prenota immagine
                  </q-btn>
                </template>

                <template v-if="isImageDownloadable">
                  <q-btn
                    :loadin="isDownloadingImage"
                    color="primary"
                    unelevated
                    @click="onImageDownload"
                  >
                    Scarica immagine
                  </q-btn>
                </template>

                <template v-if="isPersonal">
                  <!-- IL CITTADINO HA AGGIUNTO UN ALLEGATO QUANDO HA CREATO IL DOCUMENTO PERSONALE -->
                  <template v-if="isContributionTypeAttachment">
                    <q-btn
                      :href="attachmentUrl"
                      color="primary"
                      target="_blank"
                      type="a"
                      unelevated
                    >
                      Scarica allegato
                    </q-btn>
                  </template>

                  <!-- IL CITTADINO HA INSERITO UNA TRASCRIZIONE QUANDO HA CREATO IL DOCUMENTO PERSONALE -->
                  <template v-else>
                    <q-btn
                      color="primary"
                      unelevated
                      @click="onTranscriptionClick"
                    >
                      Visualizza
                    </q-btn>
                  </template>
                </template>

                <template v-if="!isPersonal && isPdfDownloadable">
                  <q-btn
                    :href="pdfUrl"
                    color="primary"
                    target="_blank"
                    type="a"
                    unelevated
                  >
                    Consulta referto
                  </q-btn>
                </template>

                <template v-if="isPayable">
                  <q-btn color="primary" outline @click="onPay">
                    Paga
                  </q-btn>
                </template>
              </template>
            </div>
          </div>

          <!-- ALTRE AZIONI -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <template v-if="moreActions">
            <q-btn
              :loading="isChangingDocumentVisibility"
              class="absolute-top-right q-mt-sm q-mr-sm"
              dense
              flat
              icon="more_vert"
              aria-label="Menu altre azioni"
              round
            >
              <q-menu anchor="bottom right" self="top right">
                <q-list style="min-width: 180px">
                  <!-- MODIFICA ETICHETTE -->
                  <q-item v-close-popup clickable @click="onTagAssociate">
                    <q-item-section side>
                      <q-icon class="fas fa-tags" size="xs" />
                    </q-item-section>
                    <q-item-section>Associa etichette</q-item-section>
                  </q-item>

                  <template v-if="isHideUnhideButtonVisible">
                    <!-- OSCURA -->
                    <template v-if="canHideDocumentFse && isVisible">
                      <q-item v-close-popup clickable @click="onHide">
                        <q-item-section side>
                          <q-icon class="fas fa-eye-slash" size="xs" />
                        </q-item-section>
                        <q-item-section>Oscura</q-item-section>
                      </q-item>
                    </template>

                    <!-- DEOSCURA -->
                    <template v-if="canUnhideDocumentFse && !isVisible">
                      <q-item v-close-popup clickable @click="onUnhide">
                        <q-item-section side>
                          <q-icon class="fas fa-eye" size="xs" />
                        </q-item-section>
                        <q-item-section>Deoscura</q-item-section>
                      </q-item>
                    </template>
                  </template>

                  <!-- E' POSSIBILE RIMUOVERE SOLO I DOCUMENTI PERSONALI -->
                  <template v-if="isPersonal">
                    <q-item clickable @click="onRemove">
                      <q-item-section side>
                        <template v-if="isRemovingDocument">
                          <q-spinner color="negative" size="xs" />
                        </template>
                        <template v-else>
                          <q-icon
                            class="fas fa-trash"
                            color="negative"
                            size="xs"
                          />
                        </template>
                      </q-item-section>
                      <q-item-section>Rimuovi</q-item-section>
                    </q-item>
                  </template>
                </q-list>
              </q-menu>
            </q-btn>
          </template>
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
            name="fas fa-upload"
            size="xs"
            aria-label="Documento inserito da te"
          >
            <q-tooltip>Documento inserito da te</q-tooltip>
          </q-icon>
        </template>
      </div>
    </template>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <fse-tag-associate-dialog
      v-model="isTagAssociateDialogVisible"
      :document="document"
      @associated="onTagsAssociated"
    />

    <!-- ELENCO DOCUMENTI ASSOCIATI PER NRE -->
    <fse-document-associated-list-by-nre-dialog
      v-model="isAssociatedListByNreDialogVisible"
      :document-list="associatedListByNre"
    />

    <!-- ELENCO DOCUMENTI ASSOCIATI PER EPISODIO -->
    <fse-document-associated-list-by-episode-dialog
      v-model="isAssociatedListByEpisodeDialogVisible"
      :document-list="associatedListByEpisode"
    />

    <!-- ELENCO DOCUMENTI ASSOCIATI PER OSCURAMENTO/DEOSCURAMENTO -->
    <fse-document-associated-list-by-hide-dialog
      v-model="isAssociatedListByHideDialogVisible"
      :document-list="associatedListByHide"
      :is-hiding="isVisible"
      :is-saving="isChangingDocumentVisibility"
      @save="onHideConfirmed"
    />

    <!-- VISUALIZZAZIONE TRASCIZIONE -->
    <fse-document-personal-transcription-dialog
      v-model="isDocumentPersonalTranscriptionDialogVisible"
      :document="document"
    />

    <!-- PAGAMENTO -->
    <fse-document-pay-dialog
      v-model="isPayDialogVisible"
      :document="document"
    />

    <q-dialog v-model="isHideUnHideExemptionDialog">
      <q-card style="max-width: 800px">
        <q-toolbar>
          <q-toolbar-title>
            Esenzioni per patologia
          </q-toolbar-title>

          <q-btn
            v-close-popup
            flat
            icon="close"
            round
            aria-label="chiudi finestra"
          />
        </q-toolbar>

        <q-card-section class="q-gutter-y-md">
          <q-banner class="q-mt-md bg-blue-2" rounded>
            Proseguendo verrà modificata la visibilità di eventuali altre
            esenzioni per patologia
          </q-banner>
          <!--          <p v-if="isVisible">-->
          <!--            -->
          <!--          </p>-->
        </q-card-section>
        <q-card-section>
          <lms-buttons>
            <lms-button
              :loading="isChangingDocumentVisibility"
              @click="onHideExceptionConfirmed"
            >
              Conferma
            </lms-button>
            <lms-button v-close-popup outline>
              Annulla
            </lms-button>
          </lms-buttons>
        </q-card-section>
      </q-card>
    </q-dialog>

<!--    DIALOG DOWNLOAD IMMAGINI-->
    <fse-document-download-image-dialog :document="document"  v-model="isImageDownloadDialog"/>
  </div>
</template>

<script>
import LmsCardItemBar from "./core/LmsCardItemBar";
import { DOCUMENT_DETAIL } from "../router/routes";
import FseTagAssociateDialog from "./FseTagAssociateDialog";
import {
  APP_CODE_MAP,
  ASSOCIATION_OPERATION_TYPE_MAP,
  DOCUMENT_IMAGE_OS_MAP,
  DOCUMENT_PERSONAL_CONTRIBUTION_TYPE_MAP,
  HIDE_OPERATION_TYPE_MAP,
  IS_DEV,
  IS_TEST,
  TAG_OPERATION_TYPE_CODE_MAP,
  TAG_TYPE_MAP
} from "../services/config";
import {
  isVisibleFse,
  getPayableImportFse,
  getPayedImportFse,
  hasRefundFse,
  isRefundDownloadableFse,
  canDownloadPdfFse,
  canPayFse,
  canRequestImageFse,
  isImageInElaborationFse,
  imageHasIrreversibleErrorFse,
  canDownloadImageFse,
  isExpiringFse,
  isExpiredFse,
  getHideTypeCode,
  isPersonalFse,
  getTypeCodeFse
} from "../services/business-logic";
import {
  apiErrorNotifyDialog,
  notifyError,
  notifySuccess
} from "../services/utils";
import {
  associateTag,
  createAudit,
  createImageBooking,
  deleteDocumentPersonal,
  getDocumentAssociatedList,
  getDocumentFseImageDownloadUrl, getDocumentFseImageDownloadUrl2,
  getDocumentFseImageInfo,
  getDocumentHiddenList,
  getDocumentPdfUrl,
  getDocumentPersonalAttachmentPdfUrl,
  updateDocumentVisibility
} from "../services/api";
import FseDocumentAssociatedListByNreDialog from "./FseDocumentAssociatedListByNreDialog";
import FseDocumentAssociatedListByEpisodeDialog from "./FseDocumentAssociatedListByEpisodeDialog";
import FseDocumentAssociatedListByHideDialog from "./FseDocumentAssociatedListByHideDialog";
import FseDocumentPersonalTranscriptionDialog from "./FseDocumentPersonalTranscriptionDialog";
import LmsCardItem from "./core/LmsCardItem";
import LmsCardItemPrimary from "./core/LmsCardItemPrimary";
import FseDocumentItemTypeIcon from "./FseDocumentItemTypeIcon";
import { openURL } from "quasar";
import FseDocumentPayDialog from "./FseDocumentPayDialog";
import FseDocumentDownloadImageDialog from "components/FseDocumentDownloadImageDialog";

const EXEMPTION_CODES =["57827-8", "REG-ESE-11488-4"];
export default {
  name: "FseDocumentItem",
  components: {
    FseDocumentDownloadImageDialog,
    FseDocumentPayDialog,
    FseDocumentItemTypeIcon,
    LmsCardItemPrimary,
    LmsCardItem,
    FseDocumentPersonalTranscriptionDialog,
    FseDocumentAssociatedListByHideDialog,
    FseDocumentAssociatedListByEpisodeDialog,
    FseDocumentAssociatedListByNreDialog,
    FseTagAssociateDialog,
    LmsCardItemBar
  },
  props: {
    document: { type: Object, required: false, default: () => null },
    actions: { type: Boolean, required: false, default: false },
    moreActions: { type: Boolean, required: false, default: false },
    associatedLink: { type: Boolean, required: false, default: false },
    detailLink: { type: Boolean, required: false, default: false },
    draggable: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      IS_DEV,
      IS_TEST,
      isTagAssociateDialogVisible: false,
      isAssociatedListByNreDialogVisible: false,
      isAssociatedListByEpisodeDialogVisible: false,
      isAssociatedListByHideDialogVisible: false,
      isDocumentPersonalTranscriptionDialogVisible: false,
      isPayDialogVisible: false,
      isChangingDocumentVisibility: false,
      isRemovingDocument: false,
      isBookingImage: false,
      isDownloadingImage: false,
      isTagDeleting: false,
      tagDeleting: null,
      associatedListByNre: [],
      associatedListByEpisode: [],
      associatedListByHide: [],
      isHideUnHideExemptionDialog: false,
      isImageDownloadDialog:false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    canHideDocumentFse() {
      return this.$store.getters["canHideDocumentFse"];
    },
    canUnhideDocumentFse() {
      return this.$store.getters["canUnhideDocumentFse"];
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
    isHideUnhideButtonVisible() {
      // if(process.env.APP_IS_DEV || process.env.APP_IS_TEST){
      return (
        (this.isExemptionDocument && this.exemptionInfo) ||
        !this.isExemptionDocument
      );

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
    documentDetailRoute() {
      let name = DOCUMENT_DETAIL.name;
      let params = { id: this.id };
      let query = { categoria: this.document?.categoria, cl: this.cl };
      return { name, params, query };
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
      params.codice_app_verticale = APP_CODE_MAP.FSE;

      return getDocumentPdfUrl(taxCode, documentId, { params });
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
      if (this.draggable) out.push("fse-document-item--draggable");

      return out;
    },
    exemptionVisibility() {
      let visibleCodes = ["N", "M"];
      let visibility = this.exemptionInfo?.oscuramento_esenzioni ?? false;
      return visibleCodes.includes(visibility);
    }
  },
  created() {},
  methods: {
    onPay() {
      this.isPayDialogVisible = true;
    },
    onTranscriptionClick() {
      this.isDocumentPersonalTranscriptionDialogVisible = true;
    },
    onTagAssociate() {
      this.isTagAssociateDialogVisible = true;
    },
    onTagClick(tag) {
      this.$emit("tag-click", tag);
    },
    onTagsAssociated(...args) {
      this.$emit("tag-associated", ...args);
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

        this.$emit("tag-associated", {
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
    async onHide() {
      //PEr le esenzioni va chiamato il servizio ad Hoc
      // if (process.env.APP_IS_DEV || process.env.APP_IS_TEST) {
      if (this.isExemptionDocument) {
        this.isHideUnHideExemptionDialog = true;
        return;
      }
      // }

      // Per i documenti personali non va chiamata la lista dei correlati per oscuramento
      if (this.isPersonal) {
        this.onHideConfirmed();
        return;
      }

      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.id;

      let params = {
        azione: HIDE_OPERATION_TYPE_MAP.HIDE
      };

      // Il codice della componente locale lo passiamo solo per i documenti che NON sono PERSONALI
      if (!this.isPersonal) {
        params.codice_cl = this.cl;
      }

      try {
        let { data } = await getDocumentHiddenList(taxCode, documentId, {
          params
        });

        this.associatedListByHide = data;

        // Se la get associati per oscuramento non restituisce alcun dato
        // => vuol dire che l'operazione non è ammessa
        if (this.associatedListByHide.length <= 0) {
          notifyError(
            "Operazione non consentita perché il documento ed i suoi correlati sono soggetti a leggi speciali. Per approfondimenti visita le FAQ."
          );
          return;
        }

        // Dall'elenco dei documenti da nascondere rimuoviamo il documento stesso
        this.associatedListByHide = this.associatedListByHide.filter(
          d => d.id_documento_ilec !== documentId
        );

        // Mostriamo la modale solo se ci sono documenti correlati
        if (this.associatedListByHide.length > 0) {
          this.isAssociatedListByHideDialogVisible = true;
        } else {
          this.onHideConfirmed();
        }
      } catch (error) {
        let message =
          "Non è stato possibile caricare i documenti associati per oscuramento";
        apiErrorNotifyDialog({ error, message });
      }
    },
    async onUnhide() {
      //PEr le esenzioni va chiamato il servizio ad Hoc
      // if (process.env.APP_IS_DEV || process.env.APP_IS_TEST){
      if (this.isExemptionDocument) {
        this.isHideUnHideExemptionDialog = true;
        return;
      }
      // }

      // Per i documenti personali non va chiamata la lista dei correlati per oscuramento
      if (this.isPersonal) {
        this.onHideConfirmed();
        return;
      }

      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.id;

      let params = {
        azione: HIDE_OPERATION_TYPE_MAP.UNHIDE
      };

      // Il codice della componente locale lo passiamo solo per i documenti che NON sono PERSONALI
      if (!this.isPersonal) {
        params.codice_cl = this.cl;
      }

      try {
        let { data } = await getDocumentHiddenList(taxCode, documentId, {
          params
        });

        this.associatedListByHide = data;

        // Se la get associati per oscuramento non restituisce alcun dato
        // => vuol dire che l'operazione non è ammessa
        if (this.associatedListByHide.length <= 0) {
          notifyError(
            "Operazione non consentita perché il documento ed i suoi correlati sono soggetti a leggi speciali. Per approfondimenti visita le FAQ."
          );
          return;
        }

        // Dall'elenco dei documenti da nascondere rimuoviamo il documento stesso
        this.associatedListByHide = this.associatedListByHide.filter(
          d => d.id_documento_ilec !== documentId
        );

        // Mostriamo la modale solo se ci sono documenti correlati
        if (this.associatedListByHide.length > 0) {
          this.isAssociatedListByHideDialogVisible = true;
        } else {
          this.onHideConfirmed();
        }
      } catch (error) {
        let message =
          "Non è stato possibile caricare i documenti associati per deoscuramento";
        apiErrorNotifyDialog({ error, message });
      }
    },
    async onHideExceptionConfirmed() {
      let isHiding = this.isVisible;
      let taxCode = this.$store.getters["getTaxCode"];

      let params = {
        servizio: APP_CODE_MAP.PATHOLOGY_EXCEPTION
      };

      // Passare l'elenco di tutti i documenti correlati per oscuramento.
      // In pratica chiediamo di oscurarli tutti
      let payload = {
        oscuramento: [
          {
            fonte_oscuramento: "WA",
            id_documento: null,
            codice_cl: null,
            tipo_di_dato: {
              codice: "ESE",
              descrizione: "ESENZIONI"
            },
            oscurato: this.isVisible
          }
        ]
      };

      this.isChangingDocumentVisibility = true;

      try {
        let { data } = await updateDocumentVisibility(taxCode, payload, {
          params
        });

        this.$emit("exemption-visibility-changed");

        if (isHiding) {
          notifySuccess("Documenti oscurati");
          this.$emit("hided");
        } else {
          notifySuccess("Documenti deoscurati");
          this.$emit("unhided");
        }

        this.isAssociatedListByHideDialogVisible = false;
      } catch (error) {
        let message =
          "Non è stato possibile aggiornare la visibilità dei documenti";
        apiErrorNotifyDialog({ error, message });
      }

      this.isChangingDocumentVisibility = false;
      this.isHideUnHideExemptionDialog = false;
    },
    async onHideConfirmed() {
      let isHiding = this.isVisible;
      let taxCode = this.$store.getters["getTaxCode"];

      let params = {
        servizio: APP_CODE_MAP.FSE
      };

      // Passare l'elenco di tutti i documenti correlati per oscuramento.
      // In pratica chiediamo di oscurarli tutti
      let payload = {
        oscuramento: [
          {
            // fonte_oscuramento: "WA",
            id_documento: this.id,
            codice_cl: this.isPersonal ? undefined : this.cl,
            oscurato: this.isVisible,
            tipo_di_dato: {
              codice: getHideTypeCode(this.document)
            }
          }
        ]
      };

      // Oscuriamo/deoscuriamo anche tutti i documenti associati.
      this.associatedListByHide.forEach(d => {
        payload.oscuramento.push({
          // fonte_oscuramento: "WA",
          id_documento: d.id_documento_ilec,
          codice_cl: isPersonalFse(d) ? undefined : d.codice_cl,
          oscurato: isVisibleFse(d),
          tipo_di_dato: {
            codice: getHideTypeCode(d)
          }
        });
      });

      this.isChangingDocumentVisibility = true;

      try {
        let { data } = await updateDocumentVisibility(taxCode, payload, {
          params
        });

        this.$emit("visibility-changed");

        if (isHiding) {
          notifySuccess("Documento oscurato");
          this.$emit("hided");
        } else {
          notifySuccess("Documento deoscurato");
          this.$emit("unhided");
        }

        this.isAssociatedListByHideDialogVisible = false;
      } catch (error) {
        let message =
          "Non è stato possibile aggiornare la visibilità del documento";
        apiErrorNotifyDialog({ error, message });
      }

      this.isChangingDocumentVisibility = false;
    },
    async onRemove() {
      this.$q
        .dialog({
          title: "Rimuovi Documento",
          message: "Vuoi davvero rimuovere questo documento?",
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          let taxCode = this.$store.getters["getTaxCode"];
          let documentId = this.id;

          this.isRemovingDocument = true;

          try {
            let { data } = await deleteDocumentPersonal(taxCode, documentId);
            notifySuccess("Documento personale rimosso");
            this.$emit("removed");
          } catch (error) {
            let message = "Non è stato possibile rimuovere il documento";
            apiErrorNotifyDialog({ error, message });
          }

          this.isRemovingDocument = false;
        });
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

        try {
          let userAudit = this.$store.getters["getUser"];
          let taxCodeAudit = this.$store.getters["getTaxCode"];
          let departmentCode = this.document?.metadati?.codice_documento_dipartimentale;
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
