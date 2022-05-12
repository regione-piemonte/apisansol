<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="covid-swab-list-item">
    <template v-if="isDocumentPayable">
      <lms-card-item-bar type="negative">
        Il documento non può essere visualizzato poichè non in regola con il
        pagamento ticket
      </lms-card-item-bar>
    </template>

    <template v-if="isDocumentHidden">
      <lms-card-item-bar class="bg-orange-2 text-black">
        Non puoi consultare il referto perché non hai i requisiti necessari a
        livello di delega
        <a
          href="#"
          class="lms-link"
          @click.prevent="showDocumentHiddenMoreInfoDialog"
          >scopri di più</a
        >
      </lms-card-item-bar>
    </template>

    <template v-if="isDocumentNotAvailable">
      <lms-card-item-bar class="bg-orange-2 text-black">
        Il documento richiesto non è ancora disponibile nel Fascicolo Sanitario
        Elettronico
      </lms-card-item-bar>
    </template>

    <template v-if="isDocumentNotFound">
      <lms-card-item-bar class="bg-orange-2 text-black">
        Il documento richiesto non è disponibile nel Fascicolo Sanitario
        Elettronico
      </lms-card-item-bar>
    </template>

    <template v-if="isDocumentUndownloadable">
      <lms-card-item-bar class="bg-orange-2 text-black">
        Il documento non può essere visualizzato perchè è trascorso il tempo di
        download previsto per i documenti richiesti come scaricabili online
      </lms-card-item-bar>
    </template>

    <template v-if="isDocumentPrintable">
      <lms-card-item-bar class="bg-green-2 text-black">
        Il referto è disponibile, puoi consultarlo cliccando sul bottone
        "CONSULTA REFERTO"
      </lms-card-item-bar>
    </template>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md">
        <q-item class="q-body-1 items-start">
          <q-item-section side>
            <covid-swab-icon :result-status-code="resultCode" :swab-type="typeCode" />
          </q-item-section>

          <q-item-section>
            <div class="text-bold">
              <covid-swab-type-label :code="typeCode" />
            </div>

            <div>
              Esito
              <covid-swab-result-label :code="resultCode" bold />
            </div>
          </q-item-section>
        </q-item>
      </div>

      <div class="col-12 col-md">
        <q-item class="q-body-1">
          <q-item-section>
            <div>
              Richiesto il
              <span class="text-bold">
                <template v-if="!reservationDate">-</template>
                <template v-else>
                  {{ reservationDate | date }}
                </template>
              </span>
            </div>

            <template v-if="resultDate">
              <div>
                Esito del
                <span class="text-bold">
                  {{ resultDate | date }}
                </span>
              </div>
            </template>
          </q-item-section>
        </q-item>
      </div>

      <div class="col-12 col-md">
        <template v-if="hotspotId">
          <q-item class="q-body-1">
            <q-item-section>
              <div>Appuntamento il</div>

              <div>
                <span class="text-bold">
                  {{ hotspotAppointmentDate | date }}
                  {{ hotspotAppointmentTime }}
                </span>
              </div>

              <div class="q-mt-sm">Hotspot</div>

              <div class="text-bold">
                {{ hotspotDescription | empty }}
              </div>
            </q-item-section>
          </q-item>
        </template>
      </div>

      <div class="col-12 col-md">
        <template v-if="isMolecular && isResultPositive && cun">
          <q-item class="q-body-1">
            <q-item-section>
              <div>CUN</div>

              <div>
                <span class="text-bold">
                  {{ cun }}
                </span>
              </div>

              <div class="q-mt-sm">
                <covid-cun-link />
              </div>
            </q-item-section>
          </q-item>
        </template>
      </div>
    </div>

    <template v-if="isReportPharmacyNotVerifiable">
      <div class="q-pa-md text-caption">
        Referto PDF non disponibile per questo tampone
      </div>
    </template>

    <template v-if="isDocumentPrintable || isDocumentPayable">
      <lms-buttons class="q-pa-md">
        <template v-if="isDocumentPrintable">
          <lms-button outline type="a" :href="documentPdfUrl" target="_blank">
            Consulta referto
          </lms-button>
        </template>

        <template v-if="isDocumentPayable">
          <lms-button type="a" outline :href="documentPayableUrl">
            Paga
          </lms-button>
        </template>
      </lms-buttons>
    </template>

    <template v-if="isReportVerifiable">
      <lms-buttons class="q-pa-md">
        <lms-button outline :loading="isReportVerifying" @click="verifyReport">
          Verifica disponibilità referto
        </lms-button>
      </lms-buttons>
    </template>

    <template v-if="$c.IS_DEV || $c.IS_TEST">
      <div>
        Id Ilec: {{ documentId | empty }} <br />
        Codice azione: {{ documentActionCode | empty }} <br />
        Codice dipartimentale: {{ documentDepartmentCode | empty }} <br />
        Codice errore: {{ documentErrorCode | empty }}
      </div>
    </template>

    <q-dialog
      v-model="isDocumentHiddenMoreInfoDialogVisible"
      :maximized="$q.screen.lt.sm"
      content-css="width: 600px"
    >
      <q-card>
        <q-toolbar color="transparent" text-color="black">
          <q-toolbar-title></q-toolbar-title>
          <q-btn flat round icon="close" v-close-popup />
        </q-toolbar>

        <div class="q-pa-md">
          <p>Ecco perché non puoi scaricare il referto:</p>

          <ul>
            <li>
              <strong
                >risulti delegato al servizio "Covid-19" ma non a quello di
                "Ritiro e consultazione referti"</strong
              >, che è necessario per consultare il referto
            </li>
          </ul>

          <p>Oppure</p>

          <ul>
            <li>
              <strong
                >hai la delega per il servizio “Ritiro e consultazione referti”
                ma la tua delega non ha le caratteristiche necessarie per la
                consultazione di questo documento.</strong
              >
              Per risolvere il problema hai due possibilità: chiedere alla
              persona che ti ha delegato di abilitarti a vedere tutti i suoi
              documenti clinico-sanitari, conferendoti la cosiddetta "delega
              forte", oppure di rendere disponibile, de-oscurandolo, questo
              documento
            </li>
          </ul>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import CovidSwabIcon from "./CovidSwabIcon";
import CovidSwabResultLabel from "./CovidSwabResultLabel";
import CovidSwabTypeLabel from "./CovidSwabTypeLabel";
import CovidCunLink from "./CovidCunLink";
import LmsCardItemBar from "./core/LmsCardItemBar";
import {
  getDocumentPdfUrl,
  getDocumentRolOldPdfUrl,
  getIsDocumentDownloadable,
} from "../services/api";
import { notifyError } from "../services/utils";
import { REPORT_VERIFIABLE_CL_LIST } from "../services/config";

export default {
  name: "CovidSwabListItem",
  components: {
    LmsCardItemBar,
    CovidCunLink,
    CovidSwabTypeLabel,
    CovidSwabResultLabel,
    CovidSwabIcon,
  },
  props: {
    swab: { type: Object, required: false, default: () => null },
  },
  data() {
    return {
      isDocumentHiddenMoreInfoDialogVisible: false,
      isReportVerifying: false,
    };
  },
  computed: {
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    documentInfoList() {
      return this.$store.getters["getDocumentInfoList"];
    },
    id() {
      return this.swab?.idTampone;
    },
    hotspotId() {
      return this.swab?.hotspotDispeffId;
    },
    hotspotDescription() {
      return this.swab?.hotspotDesc;
    },
    hotspotAppointmentDate() {
      return this.swab?.hotspotDispeffFasciaDa;
    },
    hotspotAppointmentTime() {
      return this.swab?.hotspotDispeffFascia;
    },
    typeCode() {
      return this.swab?.testTipo?.testTipoCod;
    },
    reservationDate() {
      return this.swab?.dataInserimentoRichiesta;
    },
    resultDate() {
      return this.swab?.dataTest;
    },
    resultCode() {
      return this.swab?.risTampone?.idRisTamp;
    },
    isResultPositive() {
      return this.resultCode === this.$c.SWAB_RESULT_STATUS_MAP.POSITIVE;
    },
    cun() {
      return this.swab && this.swab.cun;
    },
    isMolecular() {
      let codes = [
        this.$c.SWAB_TYPE_CODE_MAP.FAST_A,
        this.$c.SWAB_TYPE_CODE_MAP.FAST_B,
        this.$c.SWAB_TYPE_CODE_MAP.SEROLOGICAL
      ];

      return !codes.includes(this.typeCode);
    },
    documentDepartmentCode() {
      return this.swab && this.swab.idDocumento;
    },
    documentClCode() {
      // return this.swab && this.swab.codCl;
      return this.documentInfo?.codice_cl;
    },
    documentInfo() {
      // return this.documentInfoList.find(el => el.codice_dipartimentale === this.documentDepartmentCode && el.codice_cl === this.documentClCode)
      return this.documentInfoList.find(
        (el) => el.codice_dipartimentale === this.documentDepartmentCode
      );
    },
    documentError() {
      return this.documentInfo?.errore;
    },
    documentErrorCode() {
      return this.documentError?.chiave;
    },
    documentId() {
      return this.documentInfo?.id_documento_ilec;
    },
    documentActionCode() {
      return this.documentInfo?.codice_azione;
    },
    documentEpisodeId() {
      return this.documentInfo?.codice_episodio;
    },
    isDocumentPrintable() {
      return !!this.documentInfo & !this.documentError;
    },
    isDocumentPayable() {
      // Documento non in regola con il pagamento ticket
      return this.documentErrorCode === "FSE_ER_553";
    },
    isDocumentHidden() {
      // Documento oscurato e utente non autorizzato
      return this.documentErrorCode === "FSE_ER_555";
    },
    isDocumentUndownloadable() {
      // Documento non scaricabile
      return this.documentErrorCode === "FSE_ER_554";
    },
    isDocumentNotAvailable() {
      // Documento non scaricabile
      return this.documentErrorCode === "FSE_ER_552";
    },
    isDocumentNotFound() {
      // Documento non scaricabile
      return this.documentErrorCode === "FSE_ER_556";
    },
    documentPdfUrl() {
      let taxCode = this.taxCode;

      if (this.documentActionCode === "ROL") {
        let params = {
          componente_locale: this.documentClCode,
          id_documento_cl: this.documentId,
          firmato: "S",
        };

        return getDocumentRolOldPdfUrl(taxCode, { params });
      }

      if (this.documentActionCode === "FSE") {
        let documentId = this.documentId;
        let params = {
          componente_locale: this.documentClCode,
          id_episodio: this.documentEpisodeId,
          firmato_digitalmente: "S",
          criptato: "S",
          pdf: true,
          codice_app_verticale: "SOLCOVID",
        };

        return getDocumentPdfUrl(taxCode, documentId, { params });
      }

      return null;
    },
    documentPayableUrl() {
      let url = "/la-mia-salute/#/pagamenti-sanitari";
      return url;
    },
    isReportPharmacyNotVerifiable() {
      // I tamponi che hanno una CL che non è nella lista non avranno mai un referto
      // let codes = REPORT_VERIFIABLE_CL_LIST;
      // return !codes.includes(this.swab?.codCl);

      // I tamponi che non hanno questa CL non avranno mai un referto
      let codes = ["api.ref.priv", "app.upload.csv"];
      return codes.includes(this.swab?.codCl);

      // return this.swab?.codCl === "api.ref.priv";
    },
    isReportVerifiable() {
      let hasNecessaryData = this.swab?.idDocumento && this.swab?.codCl;
      let isVerified = !!this.documentInfo;
      return (
        !isVerified && hasNecessaryData && !this.isReportPharmacyNotVerifiable
      );
    },
  },
  created() {},
  methods: {
    showDocumentHiddenMoreInfoDialog() {
      this.isDocumentHiddenMoreInfoDialogVisible = true;
    },
    async verifyReport() {
      let taxCode = this.taxCode;
      let id = this.swab.idDocumento;
      let params = {
        codice_app_verticale: "SOLCOVID",
        componente_locale: this.swab.codCl,
      };

      this.isReportVerifying = true;

      try {
        let { data } = await getIsDocumentDownloadable(taxCode, id, { params });
        await this.$store.dispatch("addDocumentInfo", {
          departmentCode: id,
          documentInfo: data,
          error: null,
        });
      } catch (err) {
        let status = err?.response?.status ?? null;

        // In caso di errore 500 non salviamo le info dell'errore
        // così che resti visibile il bottone di verifica
        if (status >= 500) {
          let message =
            "Siamo spiacenti, a causa di un errore imprevisto non è stato possibile verificare la disponibilità del referto";
          notifyError(message);
          this.isReportVerifying = false;
          return;
        }

        let detailList = err?.response?.data?.detail ?? [];
        let detail = detailList[0];

        await this.$store.dispatch("addDocumentInfo", {
          departmentCode: id,
          documentInfo: null,
          error: detail,
        });
      }

      this.isReportVerifying = false;
    },
  },
};
</script>

<style scoped lang="scss"></style>
