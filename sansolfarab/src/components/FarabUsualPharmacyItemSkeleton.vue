<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <div class="farab-usual-pharmacy-item-skeleton">
    <div class="q-pa-md">
      <div class="row q-gutter-x-sm">
        <div class="col">
          <q-item class="q-px-none">
            <q-item-section side>
              <q-skeleton type="circle" animation="none" />
            </q-item-section>

            <q-item-section>
              <q-item-label>
                <q-skeleton type="text" width="60px" class="bg-grey-6" />
              </q-item-label>

              <q-item-label>
                <q-skeleton type="text" width="100px" class="bg-blue-3" />
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>

      <div class="q-mt-md">
        <div>
          <q-skeleton type="text" width="80px" class="bg-grey-6" />
        </div>

        <div>
          <q-skeleton type="text" width="120px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FarabUsualPharmacyItemSkeleton"
};
</script>

<style scoped></style>
