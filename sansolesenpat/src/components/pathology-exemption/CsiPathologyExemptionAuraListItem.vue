<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="pathology-exemption-list-item">
    <q-card>


      <csi-bar v-if="isArchived" bg-color="red-2">
        Scaduta
      </csi-bar>

      <!--new-->

      <!--      <csi-bar v-if="activeStatus.color==='info'" bg-color="blue-2">-->
      <!--        {{activeStatus.label}}-->
      <!--      </csi-bar>-->
      <!--      -->

      <!--      <csi-bar v-if="activeStatus.color==='negative'" bg-color="red-2">-->
      <!--        {{activeStatus.label}}-->
      <!--      </csi-bar>-->

      <q-card-main class="no-padding">
        <csi-card-item>
          <template slot="header">
            <q-item>
              <q-item-main class="q-body-1">
                <div>Esenzione</div>
                <div>
                  <strong>
                    {{ exemption.codice.codice }}
                    {{ exemption.codice.descrizione }}
                  </strong>
                </div>

              </q-item-main>


            </q-item>
          </template>

          <template slot="primary">
            <csi-card-item-primary>
              <template slot="icon">
                <csi-icon-base class="csi-svg-icon--lg">
                  <csi-pathology-type-icon :code="exemption.tipologia.codice" />
                </csi-icon-base>
              </template>

              <template slot="text">
                <div :class="{ 'text-bold text-primary': $q.screen.lt.sm }">
                  Esenzione per {{ exemption.tipologia.descrizione }}
                </div>
              </template>
            </csi-card-item-primary>
          </template>

          <template slot="secondary">
            <!-- INFORMAZIONI ESSENZIALI -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="q-pa-md row items-center gutter-sm">
              <div class="col-12 col-sm">

                <div v-if="exemption.data_emissione">
                  Data emissione:
                  <strong>{{ exemption.data_emissione | format }}</strong>
                </div>
                <div v-if="exemption.data_scadenza">
                  Data scadenza
                  <strong>{{ exemption.data_scadenza | format }}</strong>
                </div>
              </div>


            </div>

            <!-- INFORMAZIONI DETTAGLIO -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <template v-if="isDetail">
              <!-- INFO MALATTIA -->
              <div
                v-if="exemption.malattia && exemption.malattia.codice !== '000'"
                class="q-pa-md row items-center "
              >
                <div class="col-12">
                  Codice diagnosi
                  <strong>{{ exemption.malattia.codice }}</strong>
                </div>

                <div class="col-12">
                  Definizione diagnosi
                  <strong>{{ exemption.malattia.descrizione }}</strong>
                </div>
              </div>

              <!-- LISTA PRESTAZIONI ESENTI -->
              <q-collapsible
                v-if="
                  exemption.malattia.prestazioni &&
                    exemption.malattia.prestazioni.length > 0
                "
                label="Prestazioni esenti"
                header-class="q-body-2"
              >
                <q-list no-border dense class="no-padding">
                  <q-item
                    v-for="performance in exemption.malattia.prestazioni"
                    :key="performance.codice"
                  >
<!--                    <q-item-side>{{ performance.codice }}</q-item-side>-->
                    <q-item-main>{{ performance.descrizione }}</q-item-main>
                  </q-item>
                </q-list>
              </q-collapsible>
            </template>

            <!--            <csi-pathology-exemption-history-collapsible-->
            <!--              v-model="isHistoryCollapsibleVisible"-->
            <!--              :exemption="exemption"-->
            <!--            />-->
          </template>

          <template v-if="!noActions" slot="actions">
            <template v-if="!isDetail">
              <csi-buttons class="q-pa-sm">
                <csi-button primary label="Gestisci" @click="onHandle" />
              </csi-buttons>
            </template>

            <!--            <template v-else>-->
            <template v-if="isDetail">
              <csi-buttons class="q-pa-sm q-mt-md">
                <!--                <csi-button v-if="isToEdit" secondary label="Rettifica" color="warning" @click="onCorrection"/>-->
                <!--                <csi-button v-if="exemption.rinnovabile" secondary label="Rinnova" @click="onRenew"/>-->
                <!--                <csi-button v-if="exemption.annullabile" secondary label="Annulla richiesta" @click="onCancel"/>-->
                <csi-button
                  v-if="exemption.revocabile"
                  secondary
                  label="Revoca"
                  color="negative"
                  @click="openRevokeModal"
                />
                <!--                <csi-button v-if="exemption.stato.codice==='VAL' || exemption.stato.codice==='VIS' "-->
                <!--                            @click="downloadAttestato"-->
                <!--                            secondary label="Scarica attestato"/>-->
                <!--                <csi-button v-if="exemption.certificato_id" @click="downloadCertificatiPdf" secondary-->
                <!--                            label="Scarica certificato"/>-->

                <!-- da capire cosa si scarica -->

                <!--                <csi-button v-if="exemption.zip" secondary label="Scarica allegati" @click="onDownload"/>-->
              </csi-buttons>
            </template>
          </template>
        </csi-card-item>
      </q-card-main>
    </q-card>

    <!-- MODALS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-pathology-exemption-history-modal
      v-model="isHistoryModalVisible"
      :exemption="exemption"
    />

    <!--    MODALE CONFERMA REVOCA-->
    <q-dialog v-model="isRevokeModalOpen">
      <div slot="title" class="q-title">Richiesta di revoca</div>
      <div slot="message">
        Desideri revocare l'esenzione
        <strong
          >{{ exemption.codice.codice }}
          {{ exemption.codice.descrizione }}</strong
        >?
      </div>

      <template slot="buttons" slot-scope="props">
        <csi-buttons>
          <csi-button
            secondary
            color="primary"
            label="chiudi"
            @click="isRevokeModalOpen = false"
          />

          <csi-button
            primary
            color="negative"
            label="Revoca"
            @click="onRevoke"
            :loading="isRevoking"
          />
        </csi-buttons>
      </template>
    </q-dialog>
  </div>
</template>

<script>
import CsiCardItem from "components/global/common/CsiCardItem";
import CsiCardItemPrimary from "components/global/common/CsiCardItemPrimary";
import CsiIconBase from "components/global/icons/CsiIconBase";
import CsiIconDrugs from "components/global/icons/CsiIconDrugs";
import CsiIconCalendar from "components/global/icons/CsiIconCalendar";
import CsiPathologyExemptionHistoryModal from "components/pathology-exemption/CsiPathologyExemptionHistoryModal";
// import CsiPathologyExemptionHistoryCollapsible from 'components/pathology-exemption/CsiPathologyExemptionHistoryCollapsible'
import CsiBar from "components/global/common/CsiBar";
import {
    getAllegatiZip,
    getAttestatoPdf,
    getCertificatoPdf, revokeAuraExemption,
} from "@services/api/pathology-exemption";
import CsiPathologyTypeIcon from "components/pathology-exemption/CsiPathologyTypeIcon";
import {notifyError, notifySuccess} from "@services/api/utils";
import {date} from 'quasar';
const {buildDate, startOfDate, endOfDate, formatDate, clone, getDateDiff, addToDate, subtractFromDate, getDayOfWeek} = date;

export default {
  name: "CsiPathologyExemptionAuraListItem",
  components: {
    CsiPathologyTypeIcon,
    CsiBar,
    CsiPathologyExemptionHistoryModal,
    //CsiPathologyExemptionHistoryCollapsible,
    CsiIconCalendar,
    CsiIconDrugs,
    CsiIconBase,
    CsiCardItemPrimary,
    CsiCardItem
  },
  props: {
    exemption: { type: Object, required: true },
    //statusList: {type: Array, required: false},
    isDetail: { type: Boolean, required: false, default: false },
    isArchived: { type: Boolean, required: false, default: false },
    noActions: { type: Boolean, required: false, default: false },
    noMoreActions: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      isHistoryCollapsibleVisible: false,
      isHistoryModalVisible: false,
      activeStatus: null,
      isRevokeModalOpen: false,
        isRevoking: false,
    };
  },
  computed: {
    isToEdit() {
      return (
        this.exemption.stato.codice ===
          this.$config.pathologyExemption.toEdit.RettificaMedico ||
        this.exemption.stato.codice ===
          this.$config.pathologyExemption.toEdit.RettificaOperatore
      );
    },
    user() {
      return this.$store.getters["global/user"];
    },
    cf() {
      return this.$store.getters["pathologyExemption/getTaxCode"];
    }
  },
  async created() {
    //this.statusList = this.$config.pathologyExemption.listStatus
    // try {
    //     let statusListPromise = await getStatusList()
    //     this.statusList = statusListPromise.data
    // }catch(e){
    //     console.error(e)
    // }

    //this.activeStatus = this.statusList.find(d => d.codice === this.exemption.stato.codice)
    this.activeStatus = this.exemption.stato;
    console.log(this.exemption)
  },
  methods: {
    async downloadAttestato() {
      let params = {};
      params.document_type = "07";
      let response = await getAttestatoPdf(this.cf, this.exemption.id, {
        params
      });
    },
    downloadCertificatiPdf() {
      let response = getCertificatoPdf(this.cf, this.exemption.certificato_id);
    },
    onHandle(...args) {
      // Se c'è l'handler => lo invochiamo perchè il componente padre intende applicare la propria logica
      let eventName = "click-handle";
      if (eventName in this.$listeners) return this.$emit(eventName, ...args);

      console.debug(`default @${eventName}`);
    },
    onHistory(...args) {
      let eventName = "click-history";
      if (eventName in this.$listeners) return this.$emit(eventName, ...args);
      console.debug(`default @${eventName}`);
      this.isHistoryModalVisible = true;
    },
    // onRevoke(...args) {
    //     let eventName = 'click-revoke'
    //     if (eventName in this.$listeners) return this.$emit(eventName, ...args)
    //
    //     console.debug(`default @${eventName}`)
    //     let name = this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_REVOKE.name
    //     let params = {id: this.exemption.id, exemption: this.exemption}
    //     this.$router.push({name, params})
    // },
    openRevokeModal() {
      this.isRevokeModalOpen = true;
    },
    async onRevoke() {

        this.isRevoking=true
        try {
            let filters = {
                data_emissione: null,
                data_revoca: null
            }

            if(this.exemption.data_emissione){filters.data_emissione = {'eq': formatDate(new Date(this.exemption.data_emissione), "YYYY-MM-DD")}}


            // if (this.expireDate) filters.data_scadenza = {'eq': formatDate(new Date(this.expireDate), "YYYY-MM-DD")}


            let response = await revokeAuraExemption(this.cf, this.exemption.codice.codice, this.exemption.malattia.codice, {params: {filter: { data_emissione :{'eq': formatDate(new Date(this.exemption.data_emissione), "YYYY-MM-DD")} }} })
            notifySuccess("Esenzione revocata correttamente")
            this.$emit("revoked")

        }catch (e) {
            notifyError(e, "Non è stato possibile revocare l'esenzione")
        }


        this.isRevoking=false
    },

    async onDownload() {
      let response = await getAllegatiZip(this.cf, this.exemption.id);
    },

    onCancel(...args) {
      let eventName = "click-cancel";
      if (eventName in this.$listeners) return this.$emit(eventName, ...args);

      console.debug(`default @${eventName}`);
      let name = this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_CANCEL.name;
      let params = { id: this.exemption.id, exemption: this.exemption };
      this.$router.push({ name, params });
    },
    onRenew(...args) {
      let eventName = "click-renew";
      if (eventName in this.$listeners) return this.$emit(eventName, ...args);

      console.debug(`default @${eventName}`);
      let name = this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_RENEW.name;
      let params = { id: this.exemption.id, exemption: this.exemption };
      this.$router.push({ name, params });
    },
    onCorrection(...args) {
      let eventName = "click-correction";
      if (eventName in this.$listeners) return this.$emit(eventName, ...args);

      console.debug(`default @${eventName}`);
      let name = this.$routes.PATHOLOGY_EXEMPTION.EXEMPTION_CORRECTION.name;
      let params = { id: this.exemption.id, exemption: this.exemption };
      this.$router.push({ name, params });
    }
  }
};
</script>

<style scoped lang="stylus"></style>
