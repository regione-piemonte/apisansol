<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="cod-document-item-skeleton">
    <lms-card-item>
      <template #primary>
        <!-- TIPOLOGIA -->
        <lms-card-item-primary class="relative-position">
          <template #icon>
            <q-skeleton
              type="circle"
              size="46px"
              animation="none"
              class="inline-block bg-grey-6"
            />
          </template>

          <template #text>
            <q-skeleton
              type="text"
              width="120px"
              class="inline-block bg-grey-6"
            />
          </template>
        </lms-card-item-primary>
      </template>

      <template #secondary>
        <div class="relative-position">
          <div class="q-pa-md">
            <div class="row q-col-gutter-md">
              <!-- AZIENDA SANITARIA -->
              <div class="col-12 col-md">
                <q-skeleton type="text" width="120px" class="bg-grey-6" />
                <q-skeleton type="text" width="80px" />
              </div>

              <!-- DATA EMISSIONE -->
              <div class="col-12 col-md">
                <q-skeleton type="text" width="160px" class="bg-grey-6" />
              </div>
            </div>

            <!-- EPISODIO -->
            <div class="q-mt-md">
              <q-skeleton type="text" width="220px" />
              <q-skeleton type="text" width="100px" />
            </div>

            <!-- ETICHETTE -->
            <div class="q-mt-xl q-gutter-md">
              <q-skeleton
                v-for="i in 3"
                :key="'tag--' + i"
                type="QChip"
                class="bg-blue-1 inline-block"
              />
            </div>
          </div>

          <!-- AZIONI -->
          <!-- ----------------------------------------------------------------------------------------------------- -->
          <div class="q-pa-md row items-center q-col-gutter-md">
            <div class="col-12 col-md-auto">
              <q-skeleton type="text" width="160px" class="bg-blue-3" />
            </div>

            <div class="col-12 col-md text-right">
              <q-skeleton
                type="QBtn"
                width="140px"
                class="inline-block bg-blue-8"
              />
            </div>
          </div>
        </div>
      </template>
    </lms-card-item>
  </div>
</template>

<script>
import LmsCardItem from "../core/LmsCardItem";
import LmsCardItemPrimary from "../core/LmsCardItemPrimary";

export default {
  name: "CodDocumentItemSkeleton",
  components: { LmsCardItemPrimary, LmsCardItem },
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {}
};
</script>

<style lang="scss"></style>
