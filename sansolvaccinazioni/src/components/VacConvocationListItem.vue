<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card class="vac-convocation-list-item">
    <!-- ISTANZE ATTIVE -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <template v-if="appointmentRequestListActive.length > 0">
      <lms-card-item-bar class="no-padding" type="info">
        <q-list class="q-px-md" separator>
          <q-item
            v-for="appointmentRequest in appointmentRequestListActive"
            :key="appointmentRequest.id_istanza"
            class="q-px-none"
          >
            <q-item-section>
              <q-item-label>
                {{ appointmentRequest.message }}
              </q-item-label>
              <q-item-label>
                Stato: <strong>{{ appointmentRequest.status }} </strong>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </lms-card-item-bar>
    </template>

    <q-card-section class="row items-start justify-between">
      <q-item class="q-px-none col">
        <q-item-section class="gt-xs" side top>
          <q-icon
            name="img:/statics/la-mia-salute/icone/vaccino.svg"
            size="xl"
          />
        </q-item-section>
        <q-item-section>
          <vac-vaccine-list-preview :vaccine-list="vaccineList" />

          <div v-if="isCovid19Vaccine" class="text-body1">
            In prossimità del
            {{ convocation.data_convocazione | date }} riceverai un SMS con la
            proposta di data per ricevere la dose aggiuntiva. La convocazione
            avverrà, nel rispetto delle categorie prioritari stabilite dal piano
            nazionale, entro la finestra temporale di validità del proprio green
            pass.
          </div>

          <div v-else class="text-body1">
            L'appuntamento sarà fissato a partire dal
            {{ convocation.data_convocazione | date
            }}<span v-if="vaccinationCenter"
              >, presso {{ vaccinationCenter.descrizione | capitalCase }}</span
            ><span
              v-if="
                vaccinationCenter &&
                  vaccinationCenter.asl &&
                  vaccinationCenter.asl.descrizione
              "
              >({{ vaccinationCenter.asl.descrizione }})</span
            >
          </div>
        </q-item-section>
      </q-item>
      <q-space />
      <template v-if="canRequestInstance && !isCovid19Vaccine">
        <q-icon
          class="col-auto cursor-pointer"
          color="grey-7"
          name="more_vert"
          size="sm"
        >
          <q-menu class="cursor-pointer">
            <q-list separator>
              <q-item clickable @click="goToOmission(convocation)">
                <q-item-section>
                  <q-item-label>
                    Annulla convocazione
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-icon>
      </template>
    </q-card-section>
  </q-card>
</template>

<script>
import { apiErrorNotify, equalsIgnoreCase } from "../services/utils";
import { getVaccinationCenterDetail } from "../services/api";
import LmsCardItemBar from "./core/LmsCardItemBar";
import VacVaccineListPreview from "./VacVaccineListPreview";
import { COVID_VACCINATIONS_CODES, instanceStatus } from "../services/config";
import { OMISSION } from "../router/routes";

export default {
  name: "VacConvocationListItem",
  components: { VacVaccineListPreview, LmsCardItemBar },
  props: {
    convocation: { type: Object, required: true },
    appointmentRequestList: { type: Array, required: false, default: () => [] },
    vaccinationUserInfo: { type: Object, required: false, default: null }
  },
  data() {
    return {
      isLoading: false,
      vaccinationCenter: null
    };
  },
  computed: {
    vaccineList() {
      return this.convocation?.vaccini ?? [];
    },
    appointmentRequestListActive() {
      let id = this.convocation?.id_convocazione ?? null;
      let result = [...this.appointmentRequestList];
      result = result.filter(a => a.id_convocazione === id);

      result = result.map(a => {
        return {
          message: "E' stato richiesto l'annullamento della convocazione",
          status: a.descrizione_stato,
          code: a.id_stato
        };
      });

      return result;
    },
    canRequestInstance() {
      if (
        this.appointmentRequestListActive &&
        this.appointmentRequestListActive.length > 0
      ) {
        if (
          this.appointmentRequestListActive.find(a =>
            [
              instanceStatus.DOC_PRESO_IN_CARICO,
              instanceStatus.DOC_DA_VALUTARE,
              instanceStatus.DOC_Confermato
            ].includes(a.code)
          )
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    isCovid19Vaccine() {
      let sarsCovVaccine = this.vaccineList?.filter(vaccination =>
        COVID_VACCINATIONS_CODES.includes(vaccination.codice)
      );

      return sarsCovVaccine && sarsCovVaccine.length > 0;
    }
  },
  async created() {
    let id = this.convocation.consultorio;

    try {
      let { data } = await getVaccinationCenterDetail(id);
      this.vaccinationCenter = data;
    } catch (error) {
      let message =
        "Non è stato possibile caricare il centro vaccinale della convocazione";
      apiErrorNotify({ error, message });
    }
  },
  methods: {
    goToOmission(convocation) {
      let params = {
        id: convocation.id_convocazione,
        convocation: convocation,
        vaccinationUserInfo: this.vaccinationUserInfo
      };

      let name = OMISSION.name;

      this.$router.push({ name, params });
    }
  }
};
</script>

<style lang="sass"></style>
