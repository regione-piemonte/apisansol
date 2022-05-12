<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title @back="onBack"> Referto #{{ documentId }} </lms-page-title>

    <!-- MESSAGGIO DI FEEDBACK PER I DOCUMENTI APPENA CREATI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isCreated">
      <div class="q-mt-lg">
        <q-banner class="bg-green-3">
          <div class="row q-col-gutter-md">
            <div class="col-auto">
              <q-icon name="fas fa-check-circle" size="md" />
            </div>

            <div class="col">
              <div class="text-h5">
                Inserimento avvenuto con successo
              </div>
            </div>
          </div>
        </q-banner>
      </div>
    </template>

    <template v-else>
      <!-- REFERTO ROL -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <template v-if="isRol">
        <div class="q-mt-lg">
          <template
            v-if="isLoadingDocumentDetail || isLoadingDocumentRolFromList"
          >
            <q-card>
              <fse-document-item-detail-skeleton />
            </q-card>
          </template>

          <template v-else>
            <q-card>
              <fse-rol-item-detail
                :document="document"
                :document-from-list="documentRolFromList"
                @image-booked="onDocumentRolImageBooked"
              />
            </q-card>
          </template>
        </div>
      </template>

      <!-- DOCUMENTO FSE -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <template v-if="isFse">
        <div class="q-mt-lg">
          <template v-if="isLoadingDocumentDetail">
            <q-card>
              <fse-document-item-detail-skeleton />
            </q-card>
          </template>

          <template v-else>
            <q-card>
              <fse-document-item-detail
                :document="document"
                @visibility-changed="onDocumentFseVisibilityChanged"
                @image-booked="onDocumentFseImageBooked"
                @removed="onDocumentFseRemoved"
              />
            </q-card>
          </template>
        </div>
      </template>
    </template>
  </lms-page>
</template>

<script>
import FseRolItemDetail from "../components/FseRolItemDetail";
import FseDocumentItemDetail from "../components/FseDocumentItemDetail";
import { apiErrorNotifyDialog } from "../services/utils";
import { getDocumentDetail, searchDocumentList } from "../services/api";
import FseDocumentItemDetailSkeleton from "../components/FseDocumentItemDetailSkeleton";
import { DOCUMENT_LIST } from "../router/routes";

export default {
  name: "PageDocumentDetail",
  components: {
    FseDocumentItemDetailSkeleton,
    FseDocumentItemDetail,
    FseRolItemDetail
  },
  props: {},
  data() {
    return {
      isLoadingDocumentDetail: false,
      isLoadingDocumentRolFromList: false,
      document: null,
      documentRolFromList: null
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    documentId() {
      return this.$route.params?.id;
    },
    isCreated() {
      return this.$route.query?.nuovo;
    },
    isRol() {
      return this.$route.query?.area === "ROSSA";
    },
    isFse() {
      return !this.isRol;
    }
  },
  async created() {
    let { documentRolFromList } = this.$route.params;
    this.loadDocumentDetail();

    if (this.isRol) {
      if (documentRolFromList) {
        this.documentRolFromList = documentRolFromList;
      } else {
        this.loadRolFromList();
      }
    }
  },
  methods: {
    onBack() {
      this.$router.back();
    },
    onDocumentFseVisibilityChanged() {
      this.loadDocumentDetail();
    },
    onDocumentFseImageBooked() {
      this.loadDocumentDetail();
    },
    onDocumentRolImageBooked() {
      this.loadDocumentDetail();
      this.loadRolFromList();
    },
    onDocumentFseRemoved() {
      this.$router.replace(DOCUMENT_LIST);
    },
    async loadDocumentDetail() {
      let { categoria, cl, rol } = this.$route.query;
      let { id } = this.$route.params;

      let taxCode = this.$store.getters["getTaxCode"];
      let documentId = id;
      let params = {
        categoria,
        componente_locale: cl,
        flag_rol: rol ?? null
      };

      this.isLoadingDocumentDetail = true;

      try {
        let { data } = await getDocumentDetail(taxCode, documentId, { params });

        if (this.isRol) {
          this.document = data?.documento_area_rossa;
        } else {
          this.document = data?.documento;
        }
      } catch (error) {
        let message = "Non è stato possibile caricare il documento";
        apiErrorNotifyDialog({ error, message });
      }

      this.isLoadingDocumentDetail = false;
    },
    async loadRolFromList() {
      let { cl } = this.$route.query;
      let { id } = this.$route.params;

      let taxCode = this.$store.getters["getTaxCode"];
      let payload = { area: "ROSSA" };

      this.isLoadingDocumentRolFromList = true;

      try {
        let { data } = await searchDocumentList(taxCode, payload);
        let list = data?.documento_area_rossa ?? [];
        this.documentRolFromList = list.find(
          el => el.id_documento_ilec === id && el.codice_cl === cl
        );
      } catch (error) {
        let message = "Non è stato possibile caricare il documento";
        apiErrorNotifyDialog({ error, message });
      }

      this.isLoadingDocumentRolFromList = false;
    }
  }
};
</script>

<style scoped lang="sass"></style>
