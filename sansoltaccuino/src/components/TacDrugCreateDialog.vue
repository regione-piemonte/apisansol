<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    :maximized="$q.screen.lt.sm"
    class="tac-drug-create-dialog"
  >
    <q-card>
      <q-form novalidate greedy @submit="onsubmit" class="column" style="min-height: 100%">
        <q-toolbar>
          <q-toolbar-title>
            Annota farmaci
          </q-toolbar-title>

          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>

        <q-card-section>
          <div class="row q-col-gutter-lg">
            <!-- DATA -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <div class="text-bold text-caption">
                Data assunzione
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-auto">
                  <q-input
                    type="date"
                    v-model="date"
                    label="Data"
                    required
                    :rules="[ruleRequired]"
                    no-error-icon
                  />
                </div>

                <div class="col-auto">
                  <q-input
                    type="time"
                    v-model="time"
                    label="Ora"
                    required
                    :rules="[ruleRequired]"
                    no-error-icon
                  />
                </div>
              </div>
            </div>

            <!-- FARMACO -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <q-input
                type="text"
                v-model="drug"
                label="Farmaco"
                required
                :rules="[ruleRequired]"
                no-error-icon
              />
            </div>

            <!-- QUANTITA' -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="col-12">
              <q-input
                type="text"
                v-model="amount"
                label="Quantità"
                required
                :rules="[ruleRequired]"
                no-error-icon
              />
            </div>
          </div>
        </q-card-section>

        <q-space />

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
  import {apiErrorNotify, apiErrorNotifyDialog} from "../services/utils";
import { createDrug } from "../services/api";
import { date } from "quasar";

const { formatDate, extractDate } = date;

export default {
  name: "TacDrugCreateDialog",
  inheritAttrs: false,
  props: {},
  data() {
    return {
      isSaving: false,
      date: null,
      time: null,
      drug: "",
      amount: ""
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
      let taxCode = this.$store.getters["getTaxCode"];
      let notebookId = this.notebook?.id;
      let datetime = extractDate(
        `${this.date} ${this.time}`,
        "YYYY-MM-DD HH:mm"
      );

      let payload = {
        farmaco: this.drug,
        quantita: this.amount,
        data_assunzione: datetime
      };

      this.isSaving = true;

      try {
        let { data } = await createDrug(taxCode, notebookId, payload);
        this.$emit("created", data);
        this.close();
      } catch (err) {
        let message =
          "Non è stato possibile aggiungere l'annotazione del farmaco";
        apiErrorNotifyDialog({ err, message });
      }

      this.isSaving = false;
    }
  }
};
</script>

<style lang="sass"></style>
