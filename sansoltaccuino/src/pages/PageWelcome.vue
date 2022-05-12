<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding class="csi-container">
    <lms-page-title no-back class="q-mb-md">
      Taccuino delle rilevazioni
    </lms-page-title>

    <q-stepper
      v-model="step"
      flat
      alternative-labels
      :contracted="$q.screen.lt.sm"
      class="q-mt-xl bg-transparent"
    >
      <!-- STEP BENVENUTO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-step
        :name="STEPS.WELCOME"
        title="Benvenuto"
        :done="step > STEPS.WELCOME"
        done-color="green-8"
      >
        <div class="text-body1">
          <p>
            Quella che hai davanti è la nuova versione del taccuino delle
            rilevazioni. Uno spazio dove annotare e consultare le tue
            osservazioni personali (rilevazioni, eventi, sintomi o dolori,
            assunzione di farmaci e dieta) e i contatti con le strutture
            sanitarie (ospedali, cliniche, centri o laboratori medici).
          </p>

          <p>
            Le informazioni contenute nel taccuino possono essere condivise con
            i professionisti (se hai fornito il consenso alla consultazione) e
            con le persone di fiducia che hai delegato.
          </p>

          <p>
            <span class="text-bold"
              >Ricorda che sei libero di cambiare idea!</span
            >
            <br />
            In qualunque momento potrai “nascondere” il taccuino in modo che i
            tuoi delegati o i professionisti sanitari non possano visualizzarlo.
          </p>

          <p>
            Potrai personalizzare la tua pagina personale in qualunque momento
            utilizzando le impostazioni del servizio.
          </p>
        </div>

        <q-banner rounded class="bg-info q-my-lg">
          <div class="text-body1">
            Se hai già utilizzato questo servizio in passato, saranno recuperati
            tutti i dati e le impostazioni di visibilità: i dati che avevi
            deciso di “nascondere” resteranno non visualizzabili per altre
            persone.
          </div>
        </q-banner>

        <lms-buttons>
          <lms-button @click="stepNext">Avanti</lms-button>
        </lms-buttons>
      </q-step>

      <!-- STEP NOTE GENERALI -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-step
        :name="STEPS.GENERAL_NOTES"
        title="Note generali"
        icon="mdi-text"
        :done="step > STEPS.GENERAL_NOTES"
        done-color="green-8"
      >
        <div class="row q-col-gutter-x-xl">
          <template v-if="!delegatorSelected && profileAvatarUrl">
            <div class="col-auto">
              <img :src="profileAvatarUrl" alt="avatar" />
            </div>
          </template>

          <div class="col">
            <div class="text-body1">
              Per cominciare a creare la tua home page, scrivi una breve
              descrizione del tuo <strong>stato di salute</strong> e del tuo
              <strong>stile di vita</strong>.
            </div>

            <q-form ref="form" greedy @submit="onStepNextGeneralNotes">
              <div class="q-mt-md">
                <q-input
                  type="textarea"
                  v-model="healthState"
                  filled
                  stack-label
                  bg-color="white"
                  placeholder="Es. non ho nessuna patologia, sono diabetico..."
                  required
                  label-slot
                  :rules="[ruleRequired]"
                  no-error-icon
                >
                  <template #label>
                    <span class="text-bold">Stato di salute</span>
                  </template>
                </q-input>
              </div>

              <div class="q-mt-md">
                <q-input
                  type="textarea"
                  v-model="lifestyle"
                  filled
                  stack-label
                  bg-color="white"
                  placeholder="Es. vado a lavorare in bicicletta, dormo poco, seguo la dieta mediterranea"
                  required
                  label-slot
                  :rules="[ruleRequired]"
                  no-error-icon
                >
                  <template #label>
                    <span class="text-bold">Stile di vita</span>
                  </template>
                </q-input>
              </div>

              <lms-buttons class="q-mt-md">
                <lms-button type="submit" :loading="isSavingGeneralNotes">
                  Avanti
                </lms-button>
                <lms-button outline @click="stepBack">Indietro</lms-button>
              </lms-buttons>
            </q-form>
          </div>
        </div>
      </q-step>

      <!-- STEP PREFERENZE -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-step
        :name="STEPS.PREFERENCE_LIST"
        title="Preferenze"
        icon="mdi-cog"
        :done="step > STEPS.PREFERENCE_LIST"
        done-color="green-8"
      >
        <div class="text-body1">
          Ora decidi quali sezioni e quali dati del taccuino attivare e rendere
          visibili nella tua area personale, modificando le impostazioni del
          servizio.
        </div>

        <q-form ref="form" greedy @submit="onStepNextPreferenceList">
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
                    <q-toggle
                      v-model="pOxymetry"
                      label="Ossimetria"
                      left-label
                    />
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
                    <q-toggle
                      v-model="pHemoglobin"
                      label="Emoglobina"
                      left-label
                    />
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
            <lms-button type="Submit" :loading="isSavingPreferenceList">
              Avanti
            </lms-button>
            <lms-button outline @click="stepBack">Indietro</lms-button>
          </lms-buttons>
        </q-form>
      </q-step>

      <!-- STEP FEEDBACK -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <q-step :name="STEPS.FEEDBACK" title="Finito" icon="mdi-check-all">
        Ben fatto! Ora puoi iniziare ad inserire le tue informazioni nel
        taccuino

        <lms-buttons class="q-mt-md">
          <lms-button :to="DETECTION_LIST">
            Iniziamo
          </lms-button>
        </lms-buttons>
      </q-step>
    </q-stepper>
  </lms-page>
</template>

<script>
import { DETECTION_LIST } from "../router/routes";
import {
  getPreferencePayload,
  getProfileAvatarUrl
} from "../services/business-logic";
import { updateGeneralNotes, updatePreferenceList } from "../services/api";
import { apiErrorNotifyDialog } from "../services/utils";
import { ENTITY_CODE_MAP, GROUP_CODE_MAP } from "../services/config";

const STEPS = {
  WELCOME: 1,
  GENERAL_NOTES: 2,
  PREFERENCE_LIST: 3,
  FEEDBACK: 4
};

export default {
  name: "PageWelcome",
  data() {
    return {
      DETECTION_LIST,
      STEPS,
      step: STEPS.WELCOME,
      isSavingGeneralNotes: false,
      healthState: "",
      lifestyle: "",
      isSavingPreferenceList: false,
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
    userInfo() {
      return this.$store.getters["getUserInfo"];
    },
    notebook() {
      return this.$store.getters["getNotebook"];
    },
    delegatorSelected() {
      return this.$store.getters["getDelegatorSelected"];
    },
    profileAvatarUrl() {
      let gender = this.userInfo?.info_anag?.dati_primari?.sesso;
      let birthDate = this.userInfo?.info_anag?.dati_primari?.data_nascita;
      return getProfileAvatarUrl({ gender, birthDate });
    },
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    }
  },
  methods: {
    stepBack() {
      this.step -= 1;
    },
    stepNext() {
      this.step += 1;
    },
    async onStepNextGeneralNotes() {
      // this.stepNext();
      // return;

      let taxCode = this.$store.getters["getTaxCode"];
      let notebookId = this.notebook?.id;
      let payload = {
        stato_salute: this.healthState,
        stile_vita: this.lifestyle
      };

      this.isSavingGeneralNotes = true;

      try {
        let { data } = await updateGeneralNotes(taxCode, notebookId, payload);
        // Aggiorniamo le informazioni del taccuino nello store globale
        let notebook = { ...this.notebook, note_generali: data };
        await this.$store.dispatch("setNotebook", { notebook });
        this.stepNext();
      } catch (err) {
        let message =
          "Non è stato possibile aggiornare le informazioni generali";
        apiErrorNotifyDialog({ err, message });
      }

      this.isSavingGeneralNotes = false;
    },
    async onStepNextPreferenceList() {
      // this.stepNext();
      // return;

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

      this.isSavingPreferenceList = true;

      try {
        let { data } = await updatePreferenceList(taxCode, notebookId, payload);
        // Aggiorniamo le informazioni del taccuino nello store globale
        let notebook = { ...this.notebook, preferenze: data };
        await this.$store.dispatch("setNotebook", { notebook });
        this.stepNext();
      } catch (err) {
        let message = "Non è stato possibile aggiornare le impostazioni";
        apiErrorNotifyDialog({ err, message });
      }

      this.isSavingPreferenceList = false;
    }
  }
};
</script>
