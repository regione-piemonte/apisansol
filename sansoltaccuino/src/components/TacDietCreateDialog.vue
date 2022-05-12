<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    :maximized="$q.screen.lt.sm"
    class="tac-diet-create-dialog"
  >
    <q-card style="width: 600px">
      <q-form
        greedy
        novalidate
        @submit="onsubmit"
        class="column"
        style="min-height: 100%"
      >
        <q-toolbar>
          <q-toolbar-title>
            Inserisci informazioni sulla dieta
          </q-toolbar-title>

          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>

        <!-- DATA -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-card-section>
          <q-input
            type="date"
            v-model="date"
            label="Data"
            required
            :rules="[ruleRequired]"
            no-error-icon
          />
        </q-card-section>

        <!-- COLAZIONE -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-card-section class="no-margin bg-grey-3">
          <div class="text-h6">
            Colazione
          </div>

          <q-input
            type="number"
            v-model.number="breakfastKcal"
            label="Calorie"
            dense
            class="q-mt-md"
            :rules="[ruleBreakfastKcal]"
            reactive-rules
            no-error-icon
            :min="MIN"
            :max="MAX"
            :step="STEP"
            clearable
          />

          <q-input
            type="textarea"
            v-model="breakfastDescription"
            label="Descrizione"
            counter
            maxlength="256"
            dense
            autogrow
            class="q-mt-md"
            :rules="[ruleBreakfastDescription]"
            reactive-rules
            no-error-icon
          />
        </q-card-section>

        <!-- PRANZO -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-card-section>
          <div class="text-h6">
            Pranzo
          </div>

          <q-input
            type="number"
            v-model.number="lunchKcal"
            label="Calorie"
            dense
            class="q-mt-md"
            :rules="[ruleLunchKcal]"
            reactive-rules
            no-error-icon
            :min="MIN"
            :max="MAX"
            :step="STEP"
            clearable
          />

          <q-input
            type="textarea"
            v-model="lunchDescription"
            label="Descrizione"
            counter
            maxlength="256"
            dense
            autogrow
            class="q-mt-md"
            :rules="[ruleLunchDescription]"
            reactive-rules
            no-error-icon
          />
        </q-card-section>

        <!-- CENA -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-card-section class="bg-grey-3">
          <div class="text-h6">
            Cena
          </div>

          <q-input
            type="number"
            v-model.number="dinnerKcal"
            label="Calorie"
            dense
            class="q-mt-md"
            :rules="[ruleDinnerKcal]"
            reactive-rules
            no-error-icon
            :min="MIN"
            :max="MAX"
            :step="STEP"
            clearable
          />

          <q-input
            type="textarea"
            v-model="dinnerDescription"
            label="Descrizione"
            counter
            maxlength="256"
            dense
            autogrow
            class="q-mt-md"
            :rules="[ruleDinnerDescription]"
            reactive-rules
            no-error-icon
          />
        </q-card-section>

        <!-- SPUNTINI -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-card-section>
          <div class="text-h6">
            Spuntini
          </div>

          <q-input
            type="number"
            v-model.number="snacksKcal"
            label="Calorie"
            dense
            class="q-mt-md"
            :rules="[ruleSnacksKcal]"
            reactive-rules
            no-error-icon
            :min="MIN"
            :max="MAX"
            :step="STEP"
            clearable
          />

          <q-input
            type="textarea"
            v-model="snacksDescription"
            label="Descrizione"
            counter
            maxlength="256"
            dense
            autogrow
            class="q-mt-md"
            :rules="[ruleSnacksDescription]"
            reactive-rules
            no-error-icon
          />
        </q-card-section>

        <!-- AZIONI -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <q-card-section>
          <lms-buttons>
            <lms-button type="submit" :loading="isSaving">
              Salva
            </lms-button>
          </lms-buttons>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { apiErrorNotifyDialog, notifyError } from "../services/utils";
import { createDiet } from "../services/api";
import { date } from "quasar";

const { formatDate, extractDate } = date;

const MIN = 0;
const MAX = 999999999;
const STEP = 1;
const isNumber = v => typeof v === "number";
const isInRange = (v, min, max) => v >= min && v <= max;

export default {
  name: "TacDietCreateDialog",
  inheritAttrs: false,
  props: {},
  data() {
    return {
      MIN,
      MAX,
      STEP,
      isSaving: false,
      description: "",
      date: null,
      breakfastKcal: null,
      breakfastDescription: "",
      lunchKcal: null,
      lunchDescription: "",
      dinnerKcal: null,
      dinnerDescription: "",
      snacksKcal: null,
      snacksDescription: ""
    };
  },
  computed: {
    listeners() {
      const { transition, ...listeners } = this.$listeners;
      return listeners;
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    user() {
      return this.$store.getters["getUser"];
    },
    notebook() {
      return this.$store.getters["getNotebook"];
    },
    ruleRequired() {
      return v => !!v || "Campo obbligatorio";
    },
    ruleBreakfastKcal() {
      return v => {
        if (this.breakfastDescription) {
          if (!isNumber(v)) return "Campo obbligatorio";
        }

        if (isNumber(v)) {
          if (!Number.isInteger(v)) return "Deve essere un numero intero";
          if (!isInRange(v, MIN, MAX))
            return `Deve essere compreso tra ${MIN} e ${MAX}`;
        }

        return true;
      };
    },
    ruleBreakfastDescription() {
      return v => {
        if (isNumber(this.breakfastKcal)) {
          if (!v) return "Campo obbligatorio";
        }

        return true;
      };
    },
    ruleLunchKcal() {
      return v => {
        if (this.lunchDescription) {
          if (!isNumber(v)) return "Campo obbligatorio";
        }

        if (isNumber(v)) {
          if (!Number.isInteger(v)) return "Deve essere un numero intero";
          if (!isInRange(v, MIN, MAX))
            return `Deve essere compreso tra ${MIN} e ${MAX}`;
        }

        return true;
      };
    },
    ruleLunchDescription() {
      return v => {
        if (isNumber(this.lunchKcal)) {
          if (!v) return "Campo obbligatorio";
        }

        return true;
      };
    },
    ruleDinnerKcal() {
      return v => {
        if (this.dinnerDescription) {
          if (!isNumber(v)) return "Campo obbligatorio";
        }

        if (isNumber(v)) {
          if (!Number.isInteger(v)) return "Deve essere un numero intero";
          if (!isInRange(v, MIN, MAX))
            return `Deve essere compreso tra ${MIN} e ${MAX}`;
        }

        return true;
      };
    },
    ruleDinnerDescription() {
      return v => {
        if (isNumber(this.dinnerKcal)) {
          if (!v) return "Campo obbligatorio";
        }

        return true;
      };
    },
    ruleSnacksKcal() {
      return v => {
        if (this.snacksDescription) {
          if (!isNumber(v)) return "Campo obbligatorio";
        }

        if (isNumber(v)) {
          if (!Number.isInteger(v)) return "Deve essere un numero intero";
          if (!isInRange(v, MIN, MAX))
            return `Deve essere compreso tra ${MIN} e ${MAX}`;
        }

        return true;
      };
    },
    ruleSnacksDescription() {
      return v => {
        if (isNumber(this.snacksKcal)) {
          if (!v) return "Campo obbligatorio";
        }

        return true;
      };
    }
  },
  created() {
    let now = new Date();
    this.date = formatDate(now, "YYYY-MM-DD");
    this.time = formatDate(now, "HH:mm");
  },
  methods: {
    close() {
      this.$emit("input", false);
    },
    async onsubmit() {
      // Verifichiamo che almeno uno dei campi necessari sia stato precompilato
      let breakfast = isNumber(this.breakfastKcal) && this.breakfastDescription;
      let lunch = isNumber(this.lunchKcal) && this.lunchDescription;
      let dinner = isNumber(this.dinnerKcal) && this.dinnerDescription;
      let snacks = isNumber(this.snacksKcal) && this.snacksDescription;
      if (!breakfast && !lunch && !dinner && !snacks) {
        notifyError(
          "Compila almeno una tra Colazione, Pranzo, Cena e Spuntini"
        );
        return;
      }

      let taxCode = this.$store.getters["getTaxCode"];
      let notebookId = this.notebook?.id;

      let payload = { data: this.date };

      if (breakfast) {
        payload.colazione_calorie = this.breakfastKcal;
        payload.colazione_descrizione = this.breakfastDescription;
      }

      if (lunch) {
        payload.pranzo_calorie = this.lunchKcal;
        payload.pranzo_descrizione = this.lunchDescription;
      }

      if (dinner) {
        payload.cena_calorie = this.dinnerKcal;
        payload.cena_descrizione = this.dinnerDescription;
      }

      if (snacks) {
        payload.spuntini_calorie = this.snacksKcal;
        payload.spuntini_descrizione = this.snacksDescription;
      }

      this.isSaving = true;

      try {
        let { data } = await createDiet(taxCode, notebookId, payload);
        this.$emit("created", data);
        this.close();
      } catch (err) {
        let message =
          "Non è stato possibile aggiungere le informazioni sulla dieta";
        apiErrorNotifyDialog({ err, message });
      }

      this.isSaving = false;
    }
  }
};
</script>

<style lang="sass"></style>
