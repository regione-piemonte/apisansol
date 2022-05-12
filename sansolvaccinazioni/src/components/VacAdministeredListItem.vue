<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card class="vac-administered-list-item">
    <template v-if="reactionListActive.length > 0">
      <lms-card-item-bar type="info" class="no-padding">
        <q-list separator class="q-px-md">
          <q-item
            v-for="reaction in reactionListActive"
            :key="reaction.id_istanza"
            class="q-px-none"
          >
            <q-item-section>
              <q-item-label>
                {{ reaction.message }}
              </q-item-label>
              <q-item-label>
                Stato: <strong>{{ reaction.status }} </strong>
              </q-item-label>
              <template v-if="reaction.tipo">
                <q-item-label>
                  Segnalazione per:
                  <strong>{{ reaction.tipo | capitalCase}} </strong>
                </q-item-label>
              </template>
              <q-item-label>
                Data reazione: <strong>{{ reaction.data_reazione | date }} </strong>
              </q-item-label>
              <template v-if="reaction.nota && reaction.nota !== ''">
                <q-item-label> Nota: {{ reaction.nota }} </q-item-label>
              </template>
            </q-item-section>
          </q-item>
        </q-list>
      </lms-card-item-bar>
    </template>

    <template v-if="!isLoading">
      <q-card-section class="row items-start justify-between">
        <q-item class="q-px-none col">
          <q-item-section side top class="gt-xs">
            <q-icon
              name="img:/statics/la-mia-salute/icone/vaccino.svg"
              size="xl"
            />
          </q-item-section>
          <q-item-section>
            <vac-vaccine-list-preview :vaccine-list="vaccineList"/>
            <div>
              <template v-if="vaccinationCenter" >
                Effettuato il
                {{ administered.data_appuntamento | date }} presso
                {{ vaccinationCenter.descrizione | capitalCase }}
              </template>
              <template v-else>
                Effettuato il
                {{ administered.data_appuntamento | date }}
              </template>
            </div>
          </q-item-section>
        </q-item>
        <q-space/>
        <!-- AZIONI SECONDARIE -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-icon
          name="more_vert"
          class="col-auto cursor-pointer"
          color="grey-7"
          size="sm"
        >
          <q-menu class="cursor-pointer">
            <q-list separator>
              <q-item v-close-popup clickable @click="download">
                <q-item-section>
                  <q-item-label>
                    Stampa scheda
                  </q-item-label>
                </q-item-section>
              </q-item>

              <template v-if="canRequestInstance">
                <q-item
                  v-close-popup
                  clickable
                  @click="goToEvent(administered, vaccinationUserInfo)"
                >
                  <q-item-section>
                    <q-item-label>
                      Segnala evento avverso
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-menu>
        </q-icon>
      </q-card-section>
    </template>

    <!-- CARICAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <q-card-section class="row items-start justify-between q-col-gutter-x-md">
        <div class="col row items-center q-col-gutter-x-md">
          <div class="col-auto gt-xs">
            <q-skeleton  square  height="46px" width="46px" />
          </div>
          <div class="col">
            <q-skeleton type="text" class="bg-grey-5"  width="40%" />
            <q-skeleton type="text"   width="100%" />
          </div>
        </div>
        <q-space/>
        <div class="col-auto ">
          <q-icon
            name="more_vert"
            class="col-auto cursor-pointer"
            color="grey-7"
            size="sm"
         />
        </div>

      </q-card-section>


    </template>

  </q-card>
</template>

<script>
import LmsCardItemBar from "./core/LmsCardItemBar";
import {
  downloadDocumentPdf,
  getVaccinationCenterDetail
} from "../services/api";
import { apiErrorNotify } from "../services/utils";
import VacVaccineListPreview from "./VacVaccineListPreview";
import {EVENT} from "../router/routes";
import {instanceStatus} from "../services/config";

export default {
  name: "VacAdministeredListItem",
  components: { VacVaccineListPreview, LmsCardItemBar },
  props: {
    administered: { type: Object, required: true },
    reactionList: { type: Array, required: false },
    vaccinationUserInfo: { type: Object, required: true },
    reactionTypeList: { type: Array, required: true }
  },
  data() {
    return {
      isLoading: true,
      isDownloading: false,
      vaccinationCenter: null
    };
  },
  computed: {
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    isPiedmontUser() {
      return this.$store.getters["getDelegatorSelected"];
    },
    vaccineList() {
      let result = [];

      this.administered.associazioni.forEach(a => {
        a.vaccinazioni.forEach(v => {
          result.push(v);
        });
      });

      return result;
    },
    reactionListActive() {
      let id = this.administered?.id ?? null;

      let result = [...this.reactionList];
      result = result.filter(a => a.id_vaccinazione === id);

      result = result.map(a => {
        let type = this.reactionTypeList.find(t => t.codice === a.tipologia);

        return {
          message:
            "E' stata segnalata una reazione avversa per questa somministrazione",
          status: a.descrizione_stato,
          code: a.id_stato,
          data_reazione: a.data_reazione,
          nota: a.note_risposta,
          tipo: type?.descrizione
        };
      });

      return result;
    },
    canRequestInstance() {
        if (this.reactionListActive && this.reactionListActive.length > 0 && this.reactionListActive.find(a => [instanceStatus.REA_Proposta,
            instanceStatus.REA_Presa_In_Carico,].includes(a.code))) {
            return false
        } else return true
    }
  },
  async created() {
    this.isLoading = true;

    let id = this.administered?.centro_vaccinale;

    try {
      let { data } = await getVaccinationCenterDetail(id);
      this.vaccinationCenter = data;
    } catch (error) {
      let message =
        "Non è stato possibile caricare il centro vaccinale della vaccinazione";
      apiErrorNotify({ error, message });
    }

    this.isLoading = false;
  },
  methods: {
    async download() {
      if (!this.administered) return;

      let taxCode = this.cf;
      let id = this.administered.data_appuntamento;

      this.isDownloading = true;
      downloadDocumentPdf(taxCode, id);
      setTimeout(() => (this.isDownloading = false), 2000);
    },
    goToEvent(administration, vaccinationUserInfo) {
      let params = {
        id: administration.id,
        administration: administration,
        citizen: vaccinationUserInfo
      };
        let name = EVENT.name
      this.$router.push({name, params});
    }
  }
};
</script>

<style scoped></style>
