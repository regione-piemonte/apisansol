<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <div class="row gutter-xs q-mb-lg">
      <div class="col-12 col-lg ">
        <csi-prescription-archive-filter
          :period="periodSelected"
          :type-list="typeOptions"
          @period-change="onPeriodSelected"
          @type-change="onTypeSelected"
        />
      </div>
    </div>

    <template v-if="!isLoading">
      <!-- BADGE NUMERO RICETTE -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <div class="row items-center justify-center q-mb-lg">
        <div class="col-auto">
          <q-chip class="q-py-xs" color="info" text-color="black">
            <div class="row">
              <div class="col-12 col-md-auto text-center ">
                <strong>
                  <span v-if="isEmpty(documents)">Nessuna ricetta trovata in base ai filtri di ricerca.  </span>
                  <span
                    v-else-if="documents.length === 1">1 ricetta trovata.  </span>
                  <span v-else>{{documents.length}} ricette trovate.  </span>
                </strong>
              </div>
              <div style="white-space: pre-line;" class="col-12 col-md-auto text-center">
                <strong>
                  <span v-if="periodSelected<24" @click="periodIncrement">  <a style="color:#003575"
                                                                               href="javascript:;"> Estendi periodo</a></span>
                </strong>
              </div>
            </div>
          </q-chip>
        </div>
      </div>

      <!-- ELENCO RICETTE -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <template v-if="documents.length>0">
        <div v-for="document in documents" :key="document.id_documento_ilec" class="q-my-md">
          <csi-prescription-archive-item :prescription="document" @hide-prescription="hidePrescription"/>
        </div>
      </template>
    </template>

    <csi-inner-loading :visible="isLoading" block/>
  </q-page>
</template>

<script>
  import CsiPrescriptionEnrollmentModal from "../../components/prescriptions/CsiPrescriptionEnrollmentModal";
  import CsiPrescriptionArchiveFilter from "../../components/prescriptions/CsiPrescriptionArchiveFilter";
  import {isEmpty} from "@services/global/utils";
  import subMonths from 'date-fns/sub_months';
  import format from 'date-fns/format';
  import {searchDocumentList, setVisibility} from "../../services/api/enrollment";
  import CsiPrescriptionArchiveItem from "../../components/prescriptions/CsiPrescriptionArchiveItem";
  import {notifyError} from "../../services/api/utils";
  import {intersectionBy} from "../../services/global/utils";

  export default {
    name: "PagePrescriptionsArchive",
    components: {
      CsiPrescriptionArchiveItem,
      CsiPrescriptionArchiveFilter,
      CsiPrescriptionEnrollmentModal
    },
    data() {
      return {
        isLoading: false,
        isEnrollmentModalVisible: false,
        periodSelected: 3,
        typeSelected: null,
        documents: [],
        startDate: null,
        endDate: null
      }
    },
    computed: {
      user() {
        return this.$store.getters['global/user']
      },
      cf() {
        return this.$store.getters['prescriptions/getTaxCode']
      },
      typeOptions() {
        let options = [];

        let pairList = this.$config.prescriptions.pairList
        for (let i = 0; i < pairList.length; i++) {
          let code = pairList[i].tipologia
          options.push({
            codice: code,
            descrizione: this.$config.prescriptions.documentTypesLabels[code]
          });
        }

        return options;
      }
    },
    created() {
      this.getPrescriptionsList()
    },
    methods: {
      isEmpty,
      periodIncrement() {
        if (this.periodSelected < 24) {
          this.onPeriodSelected(this.periodSelected * 2)
        }
      },
      onPeriodSelected(newValue) {
        this.periodSelected = newValue
        if (newValue)
          this.getPrescriptionsList()
      },
      onTypeSelected(val) {
        console.log('val', val)
        this.typeSelected = val
        this.getPrescriptionsList()
      },
      async getPrescriptionsList() {
        this.isLoading = true
        let today = new Date()
        let startDate = subMonths(today, this.periodSelected)
        startDate = format(startDate, 'YYYY-MM-DD')
        let endDate = format(today, 'YYYY-MM-DD')
        let pairList = this.$config.prescriptions.pairList
        let typeList = []
        if (this.typeSelected) {
          typeList = pairList.filter(p => p.tipologia === this.typeSelected)
        } else {
          typeList = pairList
        }
        let payload = {
          filtro_docs: {
            categoria_tipologia: typeList,
            data_inizio: startDate,
            data_fine: endDate
          }
        };
        try {
          let docsResponse = await searchDocumentList(this.cf, payload, {_no5XXRedirect: true})
          let documentList = docsResponse.data
          this.documents = documentList ? documentList.documenti : []
        } catch (e) {
          notifyError(e, "Errore durante il caricamento delle ricette archiviate.")
        } finally {
          this.isLoading = false
        }

      },
      async hidePrescription(value, prescription) {
        this.isLoading = true
        let payload = {
          oscuramento: [{
            id_documento: prescription.id_documento_ilec,
            codice_cl: prescription.codice_cl,
            oscurato: value,
            tipo_di_dato: {
              codice: 'DOC'
            },
          }],
        }
        let config = {
          _no5XXRedirect: true,
          params: {servizio: this.$config.enrollment.serviceCodes.prescriptions}
        }

        try {
          let response = await setVisibility(this.cf, payload, config)
          this.getPrescriptionsList()
        } catch (e) {
          notifyError(e, "Non è stato possibile modificare il consenso.");
        } finally {
          this.isLoading = false
        }
      },


    }
  }
</script>

<style scoped>

</style>
