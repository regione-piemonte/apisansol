<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title no-back class="q-mb-xl">
      Informazioni generali
    </lms-page-title>

    <div class="row q-col-gutter-x-xl">
      <template v-if="!delegatorSelected && profileAvatarUrl">
        <div class="col-auto">
          <img :src="profileAvatarUrl" alt="avatar" />
        </div>
      </template>

      <div class="col">
        <template v-if="!isEditRoute">
          <div class="text-body1">
            Per cominciare a creare la tua home page, scrivi una breve
            descrizione del tuo <strong>stato di salute</strong> e del tuo
            <strong>stile di vita</strong>.
          </div>
        </template>

        <q-form ref="form" greedy @submit="onSubmit">
          <template v-if="!isEditLifeStyleOnly">
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
              >
                <template #label>
                  <span class="text-bold">Stato di salute</span>
                </template>
              </q-input>
            </div>
          </template>

          <template v-if="!isEditHealthStateOnly">
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
              >
                <template #label>
                  <span class="text-bold">Stile di vita</span>
                </template>
              </q-input>
            </div>
          </template>

          <lms-buttons class="q-mt-md">
            <lms-button type="submit" :loading="isSaving">
              <template v-if="!isEditRoute">Avanti</template>
              <template v-else>Salva</template>
            </lms-button>
          </lms-buttons>
        </q-form>
      </div>
    </div>
  </lms-page>
</template>

<script>
import { DETECTION_LIST, GENERAL_NOTES_EDIT, SETTINGS } from "../router/routes";
import { apiErrorNotifyDialog } from "../services/utils";
import { updateGeneralNotes } from "../services/api";
import { getProfileAvatarUrl } from "../services/business-logic";

export default {
  name: "PageGeneralNotes",
  data() {
    return {
      SETTINGS,
      isSaving: false,
      healthState: "",
      lifestyle: ""
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
    isEditRoute() {
      return this.$route.name === GENERAL_NOTES_EDIT.name;
    },
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    },
    // Diamo la possibilità di modificare solo il campo "Stile di salute"
    // tramite un query param
    isEditHealthStateOnly() {
      return this.$route.query?.stile_salute;
    },
    // Diamo la possibilità di modificare solo il campo "Stile di vita"
    // tramite un query param
    isEditLifeStyleOnly() {
      return this.$route.query?.stile_vita;
    },
    profileAvatarUrl() {
      let gender = this.userInfo?.info_anag?.dati_primari?.sesso;
      let birthDate = this.userInfo?.info_anag?.dati_primari?.data_nascita;
      return getProfileAvatarUrl({ gender, birthDate });
    }
  },
  created() {
    this.healthState = this.notebook?.note_generali?.stato_salute ?? "";
    this.lifestyle = this.notebook?.note_generali?.stile_vita ?? "";
  },
  methods: {
    async onSubmit() {
      let taxCode = this.$store.getters["getTaxCode"];
      let notebookId = this.notebook?.id;
      let payload = {
        stato_salute: this.healthState,
        stile_vita: this.lifestyle
      };

      this.isSaving = true;

      try {
        let { data } = await updateGeneralNotes(taxCode, notebookId, payload);
        // Aggiorniamo le informazioni del taccuino nello store globale
        let notebook = { ...this.notebook, note_generali: data };
        await this.$store.dispatch("setNotebook", { notebook });
        let route = this.isEditRoute ? DETECTION_LIST : SETTINGS;
        await this.$router.push(route);
      } catch (err) {
        let message =
          "Non è stato possibile aggiornare le informazioni generali";
        apiErrorNotifyDialog({ err, message });
      }

      this.isSaving = false;
    }
  }
};
</script>

<style lang="scss"></style>
