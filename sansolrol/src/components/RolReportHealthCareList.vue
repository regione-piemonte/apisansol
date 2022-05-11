<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="rol-report-health-care-list">
    <slot name="title">
      Prestazioni:
    </slot>

    <template v-if="!hasHealthCares">
      <slot name="no-health-cares">
        <span class="text-bold">
          -
        </span>
      </slot>
    </template>

    <template v-else>
      <div
        v-for="(healthCare, index) in previewHealthCares"
        :key="index"
        class="q-mt-sm"
      >
        <slot
          name="health-care-preview"
          :health-care="healthCare"
          :index="index"
        >
          <rol-report-health-care-list-item :health-care="healthCare" />
        </slot>
      </div>

      <div
        v-if="canShowMore"
        class="text-primary cursor-pointer"
        @click="showAll"
      >
        <strong>
          <span>
            Mostra
            <template v-if="moreHealthCares.length <= 0">
              nessuna prestazione
            </template>

            <template v-else-if="moreHealthCares.length === 1">
              un'altra prestazione
            </template>

            <template v-else>
              altre {{ moreHealthCares.length }} prestazioni
            </template>
          </span>
        </strong>
      </div>
    </template>

    <!-- MODALS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-dialog v-model="isShowingAll" minimized>
      <q-card>
        <q-card-section>
          <q-toolbar>
            <q-toolbar-title>
              Elenco prestazioni
            </q-toolbar-title>

            <q-btn v-close-popup flat round icon="close" />
          </q-toolbar>
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div v-for="(healthCare, index) in healthCares" :key="index">
              <slot name="health-care" :health-care="healthCare" :index="index">
                <rol-report-health-care-list-item :health-care="healthCare" />
              </slot>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import RolReportHealthCareListItem from "src/components/RolReportHealthCareListItem";

export default {
  name: "RolReportHealthCareList",
  components: { RolReportHealthCareListItem },
  props: {
    healthCares: { type: Array, required: false, default: () => [] },
    previewLimit: { type: Number, required: false, default: () => 2 }
  },
  data() {
    return {
      isShowingAll: false
    };
  },
  computed: {
    hasHealthCares() {
      return this.healthCares.length > 0;
    },
    splittedHealthCares() {
      // Assicuriamoci di mostrare sempre almeno un elemento
      let limit = Math.max(this.previewLimit, 1);
      let previews = this.healthCares.slice(0, limit);
      let more = this.healthCares.slice(limit);
      return { previews, more };
    },
    previewHealthCares() {
      return this.splittedHealthCares.previews;
    },
    moreHealthCares() {
      return this.splittedHealthCares.more;
    },
    canShowMore() {
      return this.moreHealthCares.length > 0;
    }
  },
  created() {},
  methods: {
    showAll() {
      this.isShowingAll = true;
    }
  }
};
</script>

<style lang="sass"></style>
