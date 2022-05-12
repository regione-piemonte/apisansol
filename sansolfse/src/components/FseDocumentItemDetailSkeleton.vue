<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="fse-document-item-detail-skeleton">
    <lms-card-item>
      <template #primary>
        <lms-card-item-primary>
          <template #icon>
            <q-skeleton
              type="circle"
              size="38px"
              animation="none"
              class="bg-grey-6 inline-block"
            />
          </template>

          <template #text>
            <!-- TIPOLOGIA -->
            <div class="text-bold">
              <q-skeleton
                type="text"
                width="200px"
                class="bg-grey-5 inline-block"
              />
            </div>

            <!-- DATA -->
            <div class="q-mt-sm text-caption">
              <q-skeleton
                type="text"
                width="160px"
                class="bg-grey-6 inline-block"
              />
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
                <q-skeleton
                  type="circle"
                  size="38px"
                  animation="none"
                  class="bg-grey-6 inline-block"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton
                    type="text"
                    width="200px"
                    class="bg-grey-5 inline-block"
                  />
                </q-item-label>

                <q-item-label class="text-caption">
                  <q-skeleton
                    type="text"
                    width="120px"
                    class="bg-grey-5 inline-block"
                  />
                </q-item-label>
              </q-item-section>

              <!-- ALTRE AZIONI -->
              <q-item-section side top>
                <q-btn flat round icon="more_vert" color="black" dense />
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12">
            <q-item>
              <q-item-section side>
                <q-skeleton
                  type="circle"
                  size="38px"
                  animation="none"
                  class="bg-grey-6 inline-block"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  Ticket
                </q-item-label>
                <q-item-label class="text-bold">
                  <q-skeleton
                    type="text"
                    width="70px"
                    class="bg-grey-8 inline-block"
                  />
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
                  <q-skeleton
                    type="text"
                    width="70px"
                    class="bg-grey-8 inline-block"
                  />
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
                  <q-skeleton
                    type="text"
                    width="70px"
                    class="bg-grey-8 inline-block"
                  />
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
                  <q-skeleton
                    type="text"
                    width="140px"
                    class="bg-grey-8 inline-block"
                  />
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
                  <q-skeleton
                    type="text"
                    width="160px"
                    class="bg-grey-8 inline-block"
                  />
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
                  <q-skeleton
                    type="text"
                    width="180px"
                    class="bg-grey-8 inline-block"
                  />
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
                  <q-skeleton
                    type="text"
                    width="120px"
                    class="bg-grey-8 inline-block"
                  />
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
                  <q-skeleton
                    type="text"
                    width="160px"
                    class="bg-grey-8 inline-block"
                  />
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
                  <q-skeleton
                    type="text"
                    width="70px"
                    class="bg-grey-8 inline-block"
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>

        <!-- ETICHETTE -->
        <div class="q-py-md q-px-sm q-gutter-md">
          <q-skeleton
            v-for="i in 3"
            :key="'tag--' + i"
            type="QChip"
            animation="none"
            class="bg-grey-5 inline-block"
          />
        </div>

        <!-- AZIONI -->
        <lms-buttons class="q-pa-md">
          <q-skeleton
            type="QBtn"
            width="200px"
            animation="none"
            class="bg-grey-6"
          />
        </lms-buttons>
      </template>
    </lms-card-item>
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
  DOCUMENT_SIGN_CODE_MAP,
  HIDE_OPERATION_TYPE_MAP
} from "../services/config";
import {
  deleteDocumentPersonal,
  getDocumentAssociatedList,
  getDocumentHiddenList,
  getDocumentPdfUrl,
  updateDocumentVisibility
} from "../services/api";
import {apiErrorNotifyDialog, notifySuccess} from "../services/utils";

export default {
  name: "FseDocumentItemDetailSkeleton",
  components: { LmsCardItemPrimary, LmsCardItem },
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
      isChangingDocumentVisibility: false,
      isRemovingDocument: false,
      associatedListByNre: [],
      associatedListByEpisode: [],
      associatedListByHide: []
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

      // if(process.env.APP_IS_DEV || process.env.APP_IS_TEST)
        params.codice_app_verticale = APP_CODE_MAP.FSE

      return getDocumentPdfUrl(taxCode, documentId, { params });
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
      return this.performanceList.join(", ");
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

      if (!doctor) return null;
      return `${doctor.cognome} ${doctor.nome}`;
    },
    doctorValidating() {
      let doctor = this.doctorList.find(
        d => d.tipo_medico === DOCUMENT_DOCTOR_TYPE_MAP.VALIDATING
      );

      if (!doctor) return null;
      return `${doctor.cognome} ${doctor.nome}`;
    },
    classes() {
      let out = [];

      if (this.isVisible)
        out.push("fse-document-item-detail-skeleton--visible");
      if (!this.isVisible)
        out.push("fse-document-item-detail-skeleton--hidden");
      if (this.isPersonal)
        out.push("fse-document-item-detail-skeleton--personal");
      if (this.hasRefund)
        out.push("fse-document-item-detail-skeleton--refundable");

      return out;
    }
  },
  created() {},
  methods: {
    onTagAssociate() {
      this.isTagAssociateDialogVisible = true;
    },
    onTagsAssociated(...args) {
      this.$emit("tag-associated", ...args);
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
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.id;

      let params = {
        codice_cl: this.cl,
        azione: HIDE_OPERATION_TYPE_MAP.HIDE
      };

      try {
        let { data } = await getDocumentHiddenList(taxCode, documentId, {
          params
        });

        this.associatedListByHide = data;

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
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.id;

      let params = {
        codice_cl: this.cl,
        azione: HIDE_OPERATION_TYPE_MAP.UNHIDE
      };

      try {
        let { data } = await getDocumentHiddenList(taxCode, documentId, {
          params
        });

        this.associatedListByHide = data;

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
      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = this.id;

      this.isRemovingDocument = true;

      try {
        let { data } = await deleteDocumentPersonal(taxCode, documentId);
        this.$emit("removed");
      } catch (error) {
        let message = "Non è stato possibile rimuovere il documento";
        apiErrorNotifyDialog({ error, message });
      }

      this.isRemovingDocument = false;
    }
  }
};
</script>

<style lang="sass"></style>
