<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title @back="onBack">
      Carica documento
    </lms-page-title>

    <!-- NUOVA GESTIONE ARRUOLAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="q-my-md">
      <the-guard-enrollment2 :code="enrollmentCode" />
    </div>

    <template v-if="!isEnrollmentCodeBlocker">
      <!-- DATI DEL DOCUMENTO -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <q-card class="q-mt-lg">
        <q-card-section class="text-h6">
          Dati documento
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md">
              <lms-select
                v-model="documentTypeSelectedCode"
                :options="documentTypeList"
                label="Tipologia documento"
                option-value="codice"
                option-label="descrizione"
                emit-value
                map-options
                required
                dense
              />
            </div>

            <div class="col-12 col-md">
              <q-input
                type="date"
                v-model="dateIssue"
                label="Data emissione"
                stack-label
                required
                dense
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- PROVENIENZA DOCUMENTO (ASR e REPARTO) -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <q-card class="q-mt-lg">
        <q-card-section class="text-h6">
          Provenienza del documento
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <!--          <div class="col-12 col-md">-->
            <!--            <q-input-->
            <!--              type="text"-->
            <!--              v-model="asr"-->
            <!--              outlined-->
            <!--              label="Azienda sanitaria"-->
            <!--              required-->
            <!--              dense-->
            <!--            />-->
            <!--          </div>-->

            <div class="col-12 col-md">
              <q-input
                type="text"
                v-model="structure"
                label="Ospedale o struttura"
                required
                dense
              />
            </div>

            <div class="col-12 col-md">
              <q-input type="text" v-model="department" label="Reparto" dense />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- MEDICO -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <q-card class="q-mt-lg">
        <q-card-section class="text-h6">
          Medico
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                type="text"
                v-model="doctor"
                label="Cognome e nome"
                dense
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- ALLEGATO -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <q-card class="q-mt-lg">
        <q-card-section class="text-h6">
          Allegato o trascrizione
        </q-card-section>

        <q-card-section>
          <div>
            <q-radio
              v-model="attachmentType"
              :val="ATTACHMENT_TYPE_MAP.FILE"
              label="Voglio allegare il documento sanitario"
              dense
            />
          </div>

          <div class="q-mt-md">
            <q-radio
              v-model="attachmentType"
              :val="ATTACHMENT_TYPE_MAP.TEXT"
              label="Non ho un documento sanitario da allegare"
              dense
            />
          </div>

          <div class="q-mt-lg q-pb-md">
            <template v-if="attachmentType === ATTACHMENT_TYPE_MAP.FILE">
              <q-file
                v-model="attachmentFile"
                label="* Carica il file che vuoi allegare"
                outlined
                dense
                required
                bottom-slots
                accept=".pdf, .jpeg, .jpg"
                :max-file-size="3 * 1024 * 1024"
              >
                <template #hint>
                  Dimensione massima: 3Mb <br />
                  Formato: pdf, jpeg o jpg
                </template>
              </q-file>
            </template>

            <template v-else>
              <q-input
                type="textarea"
                v-model="attachmentText"
                outlined
                dense
                label="Trascrivi le parti salienti del documento"
                required=""
              />
            </template>
          </div>
        </q-card-section>
      </q-card>

      <!-- ETICHETTE -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <q-card class="q-mt-lg">
        <q-card-section class="text-h6">
          Aggiungi etichetta
        </q-card-section>

        <q-card-section>
          <div class="text-bold text-caption">
            Etichette fisse
          </div>

          <div class="q-mt-xs q-gutter-sm">
            <fse-tag-chip
              v-for="tag in tagListFixed"
              :key="'f--' + tag.id"
              :selected="isTagFixedSelected(tag)"
              clickable
              @click="onSelectFixed(tag)"
            >
              {{ tag.testo }}
            </fse-tag-chip>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-bold text-caption">
            Etichette personali
          </div>

          <div class="q-mt-xs q-gutter-sm">
            <fse-tag-chip
              v-for="tag in tagListPersonal"
              :key="'p--' + tag.id"
              :selected="isTagPersonalSelected(tag)"
              clickable
              @click="onSelectPersonal(tag)"
            >
              {{ tag.testo }}
            </fse-tag-chip>
          </div>
        </q-card-section>

        <q-card-section class="text-right q-gutter-x-md">
          <a href="#" class="lms-link" @click.prevent="onTagCreate">
            Nuova etichetta
          </a>

          <router-link :to="TAG_LIST" class="lms-link">
            Gestisci etichette
          </router-link>
        </q-card-section>
      </q-card>

      <!-- AZIONI -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <lms-buttons class="q-mt-lg">
        <lms-button :loading="isSaving" @click="onSave">Salva</lms-button>
        <!--      <lms-button outline>Annulla</lms-button>-->
      </lms-buttons>
    </template>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <fse-tag-create-dialog
      v-model="isTagCreateDialogVisible"
      @created="onTagCreated"
    />
  </lms-page>
</template>

<script>
import {
  DOCUMENT_CREATE_SUCCESS,
  DOCUMENT_DETAIL,
  DOCUMENT_LIST,
  TAG_LIST
} from "../router/routes";
import FseTagCreateDialog from "../components/FseTagCreateDialog";
import { apiErrorNotifyDialog, orderBy, toBase64 } from "../services/utils";
import {
  DOCUMENT_CATEGORY_MAP,
  DOCUMENT_PERSONAL_CONTRIBUTION_TYPE_MAP,
  IS_PROD,
  TAG_OPERATION_TYPE_CODE_MAP,
  TAG_TYPE_MAP
} from "../services/config";
import { associateTag, createDocumentPersonal } from "../services/api";
import FseTagChip from "../components/FseTagChip";
import LmsSelect from "components/core/LmsSelect";
import TheGuardEnrollment2 from "../components/TheGuardEnrollment2";

const ATTACHMENT_TYPE_MAP = {
  FILE: "FILE",
  TEXT: "TEXT"
};

export default {
  name: "PageDocumentCreate",
  components: {
    TheGuardEnrollment2,
    LmsSelect,
    FseTagChip,
    FseTagCreateDialog
  },
  data() {
    return {
      IS_PROD,
      TAG_LIST,
      ATTACHMENT_TYPE_MAP,
      isSaving: false,
      isTagCreateDialogVisible: false,
      documentTypeSelectedCode: null,
      dateIssue: null,
      // asr: "",
      structure: "",
      department: "",
      doctor: "",
      attachmentType: ATTACHMENT_TYPE_MAP.FILE,
      attachmentFile: null,
      attachmentText: "",
      tagFixedSelectedCode: null,
      tagPersonalListSelectedCode: []
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    categoryList() {
      return this.$store.getters["getCategoryList"];
    },
    documentTypeList() {
      let category = this.categoryList.find(
        c => c.codice === DOCUMENT_CATEGORY_MAP.PERSONAL
      );
      if (!category) return [];
      return category.tipi_documento;
    },
    documentTypeSelected() {
      return this.documentTypeList.find(
        d => d.codice === this.documentTypeSelectedCode
      );
    },
    tagList() {
      return this.$store.getters["getTagList"];
    },
    tagListSorted() {
      return orderBy(this.tagList, ["testo"]);
    },
    tagListFixed() {
      return this.tagListSorted.filter(
        t => t.tipologia_etichetta === TAG_TYPE_MAP.FIXED
      );
    },
    tagListPersonal() {
      return this.tagListSorted.filter(
        t => t.tipologia_etichetta === TAG_TYPE_MAP.PERSONAL
      );
    },
    activeUserEnrollmentInfo() {
      return this.$store.getters["getActiveUserEnrollmentInfo"];
    },
    enrollmentCode() {
      return this.activeUserEnrollmentInfo?.codice_risposta;
    },
    isEnrollmentCodeBlocker() {
      let BLOCK_CODE_LIST = [
        "000",
        "001",
        "002",
        "004",
        "005",
        "007",
        "010",
        "011",
        "012",
        "013",
        "015"
      ];

      return BLOCK_CODE_LIST.includes(this.enrollmentCode);
    }
  },
  created() {},
  methods: {
    onBack() {
      this.$router.push(DOCUMENT_LIST);
    },
    onTagCreate() {
      this.isTagCreateDialogVisible = true;
    },
    onTagCreated(tag) {
      let tagList = [...this.tagList, tag];
      this.$store.dispatch("setTagList", { tagList });
    },
    isTagFixedSelected(tag) {
      return tag.id === this.tagFixedSelectedCode;
    },
    onSelectFixed(tag) {
      let isSelected = this.isTagFixedSelected(tag);
      this.tagFixedSelectedCode = isSelected ? null : tag.id;
    },
    isTagPersonalSelected(tag) {
      return this.tagPersonalListSelectedCode.includes(tag.id);
    },
    onSelectPersonal(tag) {
      let isSelected = this.isTagPersonalSelected(tag);

      if (isSelected) {
        this.tagPersonalListSelectedCode = this.tagPersonalListSelectedCode.filter(
          c => c !== tag.id
        );
      } else {
        this.tagPersonalListSelectedCode = [
          ...this.tagPersonalListSelectedCode,
          tag.id
        ];
      }
    },
    async associateTags(taxCode, documentId) {
      let payload = {
        categoria: DOCUMENT_CATEGORY_MAP.PERSONAL,
        id_tag_fisso: this.tagFixedSelectedCode,
        lista_id_etichette: this.tagPersonalListSelectedCode,
        tipo_operazione: TAG_OPERATION_TYPE_CODE_MAP.ADD
      };

      try {
        await associateTag(taxCode, documentId, payload);
      } catch (error) {
        let message =
          "Non è stato possibile associare le etichette al documento.";
        apiErrorNotifyDialog({ error, message });
      }
    },
    async onSave() {
      let taxCode = this.$store.getters["getTaxCode"];
      let now = new Date();
      let base64 = null;

      let documentType = {
        codice: this.documentTypeSelected?.codice,
        descrizione: this.documentTypeSelected?.descrizione
      };

      let contributionType = {
        codice: DOCUMENT_PERSONAL_CONTRIBUTION_TYPE_MAP.TEXT,
        descrizione: DOCUMENT_PERSONAL_CONTRIBUTION_TYPE_MAP.TEXT
      };

      // Se il cittadino ha deciso di allegare un documento
      // => creiamo il base64 e modifichiamo il tipo di contributo per dire che si tratta di un allegato
      if (this.attachmentType === ATTACHMENT_TYPE_MAP.FILE) {
        base64 = await toBase64(this.attachmentFile);
        // Rimuoviamo il prefisso che indica la tipologia del file ed il tipo di decodifica:
        base64 = base64.split(",")[1];

        contributionType = {
          codice: DOCUMENT_PERSONAL_CONTRIBUTION_TYPE_MAP.ATTACHMENT,
          descrizione: DOCUMENT_PERSONAL_CONTRIBUTION_TYPE_MAP.ATTACHMENT
        };
      }

      // @TODO: le etichette come le associamo?
      //        Nel payload non sono previsti e nella response non viene restituito nessun dato
      //        Quindi non posso usare neanche l'API per associare delle etichette visto che non ho l'ID del documento
      let payload = {
        documento: {
          tipo_allegato: this.attachmentFile?.type,
          allegato: base64,
          trascrizione: this.attachmentText,
          data_ora_aggiornamento: now
        },
        metadati_documento: {
          tipo_documento: documentType,
          data_emissione: this.dateIssue,
          struttura: this.structure,
          unita: this.department,
          medico: this.doctor,
          tipo_contributo: contributionType,
          data_ora_aggiornamento: now
        }
      };

      if (this.attachmentType === ATTACHMENT_TYPE_MAP.FILE) {
      }

      this.isSaving = true;
      console.log({ payload });

      try {
        let { data: documentId } = await createDocumentPersonal(
          taxCode,
          payload
        );

        // Dopo aver creato il documento personale
        // aggiungiamo le etichette selezionate dal cittadino
        // solo se il cittadino ha selezionato almeno un tag
        if (
          this.tagFixedSelectedCode ||
          this.tagPersonalListSelectedCode.length > 0
        ) {
          await this.associateTags(taxCode, documentId);
        }

        // let name = DOCUMENT_DETAIL.name;
        // let params = { id: documentId };
        // let query = { categoria: DOCUMENT_CATEGORY_MAP.PERSONAL };
        // await this.$router.push({ name, params, query });
        await this.$router.push(DOCUMENT_CREATE_SUCCESS);
      } catch (error) {
        let message =
          "Non è stato possibile salvare il documento. Si prega di riprovare.";
        apiErrorNotifyDialog({ error, message });
      }

      this.isSaving = false;
    }
  }
};
</script>
