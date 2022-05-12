<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="row q-col-gutter-md items-stretch">
    <div class="col-12 col-md">
      <a href="files/allegato-a.pdf" class="lms-link" target="_blank">
        <q-card class="full-height">
          <q-item>
            <q-item-section side style="color: currentColor">
              <q-icon name="file_copy" size="sm" class="q-mr-sm" />
            </q-item-section>
            <q-item-section>
              Autodichiarazione per l'esecuzione gratuita di test rapidi:
              testing scuola primaria o uscita quarantena scolastica
            </q-item-section>
          </q-item>
        </q-card>
      </a>
    </div>

    <div class="col-12 col-md">
      <a href="files/allegato-b.pdf" class="lms-link" target="_blank">
        <q-card class="full-height">
          <q-item>
            <q-item-section side style="color: currentColor">
              <q-icon name="file_copy" size="sm" class="q-mr-sm" />
            </q-item-section>
            <q-item-section>
              Autodichiarazione per l'esecuzione gratuita di test rapidi: uscita
              da isolamento o da quarantena individuale (per chi ha più di 18
              anni)
            </q-item-section>
          </q-item>
        </q-card>
      </a>
    </div>

    <div class="col-12 col-md">
      <a href="files/allegato-c.pdf" class="lms-link" target="_blank">
        <q-card class="full-height">
          <q-item>
            <q-item-section side style="color: currentColor">
              <q-icon name="file_copy" size="sm" class="q-mr-sm" />
            </q-item-section>
            <q-item-section>
              Autodichiarazione per l'esecuzione gratuita di test rapidi: uscita
              da isolamento o da quarantena individuale (per chi ha meno di 18
              anni)
            </q-item-section>
          </q-item>
        </q-card>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "CovidAttachmentButtons",
  props: {},
  computed: {},
};
</script>

<style scoped lang="scss"></style>
