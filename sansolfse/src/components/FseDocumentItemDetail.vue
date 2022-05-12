<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<!--
Componente che rappresenta un referto FSE (Area Blu) visualizzato in una lista
-->

<template>
  <div class="fse-document-item-detail">
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
        <lms-card-item-primary>
          <template #icon>
            <fse-document-item-type-icon :type="typeCode" size="lg" />
          </template>

          <template #text>
            <!-- TIPOLOGIA -->
            <div class="text-bold">
              {{ typeName | empty }}
            </div>

            <!-- DATA -->
            <div class="q-mt-sm text-caption">
              Emesso il
              <span class="text-bold">{{ issueDate | date | empty }}</span>
            </div>
          </template>
        </lms-card-item-primary>
      </template>

      <template #secondary>
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
                <q-item-label>{{ structureName }} ({{ aslName }})</q-item-label>

                <template v-if="episodeType">
                  <q-item-label class="text-caption">
                    {{ episodeType }}
                  </q-item-label>
                </template>
              </q-item-section>

              <!-- ALTRE AZIONI -->
              <q-item-section side top>
                <q-btn
                  flat
                  round
                  icon="more_vert"
                  aria-label="Menu altre azioni"
                  color="black"
                  dense
                  :loading="isChangingDocumentVisibility"
                >
                  <q-menu anchor="bottom right" self="top right">
                    <q-list style="min-width: 180px">
                      <q-item clickable v-close-popup @click="onTagAssociate">
                        <q-item-section side>
                          <q-icon class="fas fa-tags" size="xs" />
                        </q-item-section>
                        <q-item-section>Associa etichette</q-item-section>
                      </q-item>
                      <template v-if="isHideUnhideButtonVisible">
                        <template v-if="isVisible">
                          <q-item clickable v-close-popup @click="onHide">
                            <q-item-section side>
                              <q-icon class="fas fa-eye-slash" size="xs" />
                            </q-item-section>
                            <q-item-section>Oscura</q-item-section>
                          </q-item>
                        </template>
                        <template v-if="!isVisible">
                          <q-item clickable v-close-popup @click="onUnhide">
                            <q-item-section side>
                              <q-icon class="fas fa-eye" size="xs" />
                            </q-item-section>
                            <q-item-section>Deoscura</q-item-section>
                          </q-item>
                        </template>
                      </template>
                      <!-- E' POSSIBILE RIMUOVERE SOLO I DOCUMENTI PERSONALI -->
                      <template v-if="isPersonal">
                        <q-item clickable v-close-popup @click="onRemove">
                          <q-item-section side>
                            <q-icon class="fas fa-trash" size="xs" />
                          </q-item-section>
                          <q-item-section>Rimuovi</q-item-section>
                        </q-item>
                      </template>
                    </q-list>
                  </q-menu>
                </q-btn>
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

              <q-item-section>
                <q-item-label>Ticket</q-item-label>
                <q-item-label class="text-bold">
                  <template v-if="isPayable">
                    Da pagare
                  </template>
                  <template v-else>
                    Pagato
                  </template>
                </q-item-label>
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

        <!-- ETICHETTE -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <template v-if="tagList.length > 0">
          <div class="q-mt-md">
            <q-chip
              v-for="tag in tagList"
              :key="tag.id"
              color="blue-1"
              text-color="black"
              clickable
              class="q-pr-none"
              @click="onTagClick(tag)"
            >
              <span>{{ tag.testo }}</span>
              <q-btn
                flat
                dense
                round
                icon="close"
                color="blue-8"
                size="sm"
                :loading="isTagDeleting && tagDeleting === tag"
                class="q-ml-xs"
                @click.prevent.stop="onTagDelete(tag)"
                :aria-label="`cancella ${tag.testo}`"
              />
            </q-chip>
          </div>
        </template>

        <!-- AZIONI -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <lms-buttons class="q-pa-md">
          <template v-if="isImageBookable">
            <lms-button
              outline
              color="primary"
              :loading="isBookingImage"
              @click="onImageBooking"
            >
              Prenota immagine
            </lms-button>
          </template>

          <template v-if="isImageDownloadable">
            <lms-button
              unelevated
              color="primary"
              :loadin="isDownloadingImage"
              @click="onImageDownload"
            >
              Scarica immagine
            </lms-button>
          </template>

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

          <template v-if="isPayable">
            <lms-button outline color="primary" @click="onPay">
              Paga
            </lms-button>
          </template>
        </lms-buttons>
      </template>
    </lms-card-item>

    <!-- OCCHIO OSCURAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="!isVisible || isPersonal">
      <div class="fse-document-item-detail__status-icon q-gutter-x-md">
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

    <!-- PAGAMENTO -->
    <fse-document-pay-dialog
      v-model="isPayDialogVisible"
      :document="document"
    />

    <!--    DIALOG DOWNLOAD IMMAGINI-->
    <fse-document-download-image-dialog :document="document"  v-model="isImageDownloadDialog"/>
  </div>
</template>

<script>
import LmsCardItem from "./core/LmsCardItem";
import LmsCardItemPrimary from "./core/LmsCardItemPrimary";
import {
  canDownloadImageFse,
  canDownloadPdfFse,
  canPayFse,
  canRequestImageFse,
  getHideTypeCode,
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
} from "../services/business-logic";
import { DOCUMENT_DETAIL } from "../router/routes";
import {
  APP_CODE_MAP,
  ASSOCIATION_OPERATION_TYPE_MAP,
  DOCUMENT_DOCTOR_TYPE_MAP,
  DOCUMENT_IMAGE_OS_MAP,
  DOCUMENT_PERSONAL_CONTRIBUTION_TYPE_MAP,
  DOCUMENT_SIGN_CODE_MAP,
  HIDE_OPERATION_TYPE_MAP, IS_DEV, IS_TEST,
  TAG_OPERATION_TYPE_CODE_MAP,
  TAG_TYPE_MAP
} from "../services/config";
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
import {
  apiErrorNotifyDialog,
  notifyError,
  notifySuccess
} from "../services/utils";
import FseTagAssociateDialog from "./FseTagAssociateDialog";
import FseDocumentAssociatedListByNreDialog from "./FseDocumentAssociatedListByNreDialog";
import FseDocumentAssociatedListByEpisodeDialog from "./FseDocumentAssociatedListByEpisodeDialog";
import FseDocumentAssociatedListByHideDialog from "./FseDocumentAssociatedListByHideDialog";
import FseDocumentItemTypeIcon from "./FseDocumentItemTypeIcon";
import LmsCardItemBar from "./core/LmsCardItemBar";
import { openURL } from "quasar";
import FseDocumentPayDialog from "./FseDocumentPayDialog";
import FseDocumentDownloadImageDialog from "components/FseDocumentDownloadImageDialog";

export default {
  name: "FseDocumentItemDetail",
  components: {
    FseDocumentDownloadImageDialog,
    FseDocumentPayDialog,
    LmsCardItemBar,
    FseDocumentItemTypeIcon,
    FseDocumentAssociatedListByHideDialog,
    FseDocumentAssociatedListByEpisodeDialog,
    FseDocumentAssociatedListByNreDialog,
    FseTagAssociateDialog,
    LmsCardItemPrimary,
    LmsCardItem
  },
  props: {
    document: { type: Object, required: false, default: () => null }
  },
  data() {
    return {
      DOCUMENT_SIGN_CODE_MAP,
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
    isHideUnhideButtonVisible() {
      let code = this.typeCode;
      let codes =  ["57827-8", "REG-ESE-11488-4"];
      return !codes.includes(code);
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
    documentDetailRoute() {
      let name = DOCUMENT_DETAIL.name;
      let params = { id: this.id, document: this.document };
      return { name, params };
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
    async onHide() {
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
.fse-document-item-detail {
  position: relative;

  &__status-icon {
    position: absolute;
    left: 16px;
    bottom: 8px;
  }
}
</style>
