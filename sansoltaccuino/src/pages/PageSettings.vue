<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding class="tac-page-settings">
    <lms-page-title no-back class="q-mb-md">
      Impostazioni
    </lms-page-title>

    <div class="text-body1">
      Ora decidi quali sezioni e quali dati del taccuino attivare e rendere
      visibili nella tua area personale, modificando le impostazioni del
      servizio.
    </div>

    <q-form ref="form" greedy @submit="onSubmit">
      <q-card class="q-mt-lg">
        <q-card-section>
          <div>
            <q-icon name="mdi-gauge-full" color="primary" size="md" left />
            <span class="text-h6 text-bold">Rilevazioni</span>
          </div>

          <div class="q-mt-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6 col-lg-4">
                <q-toggle
                  v-model="pMeasures"
                  label="Altezza, peso e circonferenza vita"
                  left-label
                />
              </div>

              <div class="col-12 col-sm-6 col-lg-4">
                <q-toggle
                  v-model="pCholesterol"
                  label="Colesterolo"
                  left-label
                />
              </div>

              <div class="col-12 col-sm-6 col-lg-4">
                <q-toggle v-model="pInsulin" label="Insulina" left-label />
              </div>

              <div class="col-12 col-sm-6 col-lg-4">
                <q-toggle
                  v-model="pTemperature"
                  label="Temperatura"
                  left-label
                />
              </div>

              <div class="col-12 col-sm-6 col-lg-4">
                <q-toggle v-model="pOxymetry" label="Ossimetria" left-label />
              </div>

              <div class="col-12 col-sm-6 col-lg-4">
                <q-toggle v-model="pSymptoms" label="Sintomi" left-label />
              </div>

              <div class="col-12 col-sm-6 col-lg-4">
                <q-toggle
                  v-model="pPressure"
                  label="Pressione e frequenza cardiaca"
                  left-label
                />
              </div>

              <div class="col-12 col-sm-6 col-lg-4">
                <q-toggle v-model="pGlycemia" label="Glicemia" left-label />
              </div>

              <div class="col-12 col-sm-6 col-lg-4">
                <q-toggle v-model="pPains" label="Dolore" left-label />
              </div>

              <div class="col-12 col-sm-6 col-lg-4">
                <q-toggle
                  v-model="pBreathFreq"
                  label="Frequenza respiratoria"
                  left-label
                />
              </div>

              <div class="col-12 col-sm-6 col-lg-4">
                <q-toggle v-model="pHemoglobin" label="Emoglobina" left-label />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator inset />

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-lg-4">
              <q-toggle v-model="pEvents" left-label>
                <q-icon
                  name="img:/statics/la-mia-salute/icone/calendario.svg"
                  size="md"
                  left
                />
                <span class="text-bold">Eventi</span>
              </q-toggle>
            </div>

            <div class="col-12 col-sm-6 col-lg-4">
              <q-toggle v-model="pDrugs" left-label>
                <q-icon
                  name="img:/statics/la-mia-salute/icone/farmaci.svg"
                  size="md"
                  left
                />
                <span class="text-bold">Farmaci</span>
              </q-toggle>
            </div>

            <div class="col-12 col-sm-6 col-lg-4">
              <q-toggle v-model="pDiet" left-label>
                <q-icon
                  name="img:/statics/la-mia-salute/icone/dieta.svg"
                  size="md"
                  left
                />
                <span class="text-bold">Dieta</span>
              </q-toggle>
            </div>
          </div>
        </q-card-section>

        <q-separator inset />

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-toggle v-model="pStructureContact" left-label>
                <q-icon
                  name="img:/statics/la-mia-salute/icone/contatti-con-strutture.svg"
                  size="md"
                  left
                />
                <span class="text-bold">Contatti con strutture</span>
              </q-toggle>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <lms-buttons class="q-mt-md">
        <lms-button type="Submit" :loading="isSaving">
          Avanti
        </lms-button>
      </lms-buttons>
    </q-form>
  </lms-page>
</template>

<script>
import { DETECTION_LIST } from "../router/routes";
import { ENTITY_CODE_MAP, GROUP_CODE_MAP } from "../services/config";
import { updatePreferenceList } from "../services/api";
import {apiErrorNotify, apiErrorNotifyDialog} from "../services/utils";
import {
  getPreferencePayload,
  getPreferenceValue
} from "../services/business-logic";

export default {
  name: "PageSettings",
  data() {
    return {
      DETECTION_LIST,
      isSaving: false,
      pMeasures: false,
      pCholesterol: false,
      pInsulin: false,
      pTemperature: false,
      pOxymetry: false,
      pSymptoms: false,
      pPressure: false,
      pGlycemia: false,
      pPains: false,
      pBreathFreq: false,
      pHemoglobin: false,
      pEvents: false,
      pDrugs: false,
      pDiet: false,
      pStructureContact: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    notebook() {
      return this.$store.getters["getNotebook"];
    },
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    }
  },
  created() {
    this.pMeasures = getPreferenceValue(
      this.notebook,
      ENTITY_CODE_MAP.DETECTION,
      GROUP_CODE_MAP.WEIGHT
    );

    this.pCholesterol = getPreferenceValue(
      this.notebook,
      ENTITY_CODE_MAP.DETECTION,
      GROUP_CODE_MAP.CHOLESTEROL
    );

    this.pInsulin = getPreferenceValue(
      this.notebook,
      ENTITY_CODE_MAP.DETECTION,
      GROUP_CODE_MAP.INSULIN
    );

    this.pTemperature = getPreferenceValue(
      this.notebook,
      ENTITY_CODE_MAP.DETECTION,
      GROUP_CODE_MAP.TEMPERATURE
    );

    this.pOxymetry = getPreferenceValue(
      this.notebook,
      ENTITY_CODE_MAP.DETECTION,
      GROUP_CODE_MAP.OXYMETRY
    );

    this.pSymptoms = getPreferenceValue(
      this.notebook,
      ENTITY_CODE_MAP.SYMPTOMS,
      null
    );

    this.pPressure = getPreferenceValue(
      this.notebook,
      ENTITY_CODE_MAP.DETECTION,
      GROUP_CODE_MAP.PRESSURE
    );

    this.pGlycemia = getPreferenceValue(
      this.notebook,
      ENTITY_CODE_MAP.DETECTION,
      GROUP_CODE_MAP.GLYCEMIA
    );

    this.pPains = getPreferenceValue(
      this.notebook,
      ENTITY_CODE_MAP.PAINS,
      null
    );

    this.pBreathFreq = getPreferenceValue(
      this.notebook,
      ENTITY_CODE_MAP.DETECTION,
      GROUP_CODE_MAP.BREATH_FREQ
    );

    this.pHemoglobin = getPreferenceValue(
      this.notebook,
      ENTITY_CODE_MAP.DETECTION,
      GROUP_CODE_MAP.HEMOGLOBIN
    );

    this.pEvents = getPreferenceValue(
      this.notebook,
      ENTITY_CODE_MAP.EVENTS,
      null
    );

    this.pDrugs = getPreferenceValue(
      this.notebook,
      ENTITY_CODE_MAP.DRUGS,
      null
    );

    this.pDiet = getPreferenceValue(this.notebook, ENTITY_CODE_MAP.DIET, null);

    this.pStructureContact = getPreferenceValue(
      this.notebook,
      ENTITY_CODE_MAP.STRUCTURE_CONTACT,
      null
    );
  },
  methods: {
    async onSubmit() {
      let taxCode = this.$store.getters["getTaxCode"];
      let notebookId = this.notebook?.id;
      let payload = [
        getPreferencePayload(
          this.notebook,
          ENTITY_CODE_MAP.DETECTION,
          GROUP_CODE_MAP.WEIGHT,
          this.pMeasures
        ),
        getPreferencePayload(
          this.notebook,
          ENTITY_CODE_MAP.DETECTION,
          GROUP_CODE_MAP.TEMPERATURE,
          this.pTemperature
        ),
        getPreferencePayload(
          this.notebook,
          ENTITY_CODE_MAP.DETECTION,
          GROUP_CODE_MAP.PRESSURE,
          this.pPressure
        ),
        getPreferencePayload(
          this.notebook,
          ENTITY_CODE_MAP.DETECTION,
          GROUP_CODE_MAP.BREATH_FREQ,
          this.pBreathFreq
        ),
        getPreferencePayload(
          this.notebook,
          ENTITY_CODE_MAP.DETECTION,
          GROUP_CODE_MAP.OXYMETRY,
          this.pOxymetry
        ),
        getPreferencePayload(
          this.notebook,
          ENTITY_CODE_MAP.SYMPTOMS,
          null,
          this.pSymptoms
        ),
        getPreferencePayload(
          this.notebook,
          ENTITY_CODE_MAP.PAINS,
          null,
          this.pPains
        ),
        getPreferencePayload(
          this.notebook,
          ENTITY_CODE_MAP.DETECTION,
          GROUP_CODE_MAP.GLYCEMIA,
          this.pGlycemia
        ),
        getPreferencePayload(
          this.notebook,
          ENTITY_CODE_MAP.DETECTION,
          GROUP_CODE_MAP.HEMOGLOBIN,
          this.pHemoglobin
        ),
        getPreferencePayload(
          this.notebook,
          ENTITY_CODE_MAP.DETECTION,
          GROUP_CODE_MAP.INSULIN,
          this.pInsulin
        ),
        getPreferencePayload(
          this.notebook,
          ENTITY_CODE_MAP.DETECTION,
          GROUP_CODE_MAP.CHOLESTEROL,
          this.pCholesterol
        ),
        getPreferencePayload(
          this.notebook,
          ENTITY_CODE_MAP.DIET,
          null,
          this.pDiet
        ),
        getPreferencePayload(
          this.notebook,
          ENTITY_CODE_MAP.DRUGS,
          null,
          this.pDrugs
        ),
        getPreferencePayload(
          this.notebook,
          ENTITY_CODE_MAP.EVENTS,
          null,
          this.pEvents
        ),
        getPreferencePayload(
          this.notebook,
          ENTITY_CODE_MAP.STRUCTURE_CONTACT,
          null,
          this.pStructureContact
        )
      ];

      this.isSaving = true;

      try {
        let { data } = await updatePreferenceList(taxCode, notebookId, payload);
        // Aggiorniamo le informazioni del taccuino nello store globale
        let notebook = { ...this.notebook, preferenze: data };
        this.$store.dispatch("setNotebook", { notebook });
        this.$router.push(DETECTION_LIST);
      } catch (err) {
        let message = "Non è stato possibile aggiornare le impostazioni";
        apiErrorNotifyDialog({ err, message });
      }

      this.isSaving = false;
    }
  }
};
</script>
