<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="lms-maintenance">
    <div class="row items-center justify-around">
      <div class="col-10 col-sm-8 col-md-6 col-lg-4">
        <img
          src="/statics/la-mia-salute/immagini/manutenzione.svg"
          alt="Manutenzione"
          class="responsive"
        />
      </div>
    </div>

    <h1 class="text-h4 text-primary text-center q-my-md">
      Servizio non disponibile
    </h1>

    <p class="text-center text-body1">
      Servizio al momento non disponibile a causa di un intervento di
      manutenzione. <br />
      Ti consigliamo di riprovare più tardi. Ci scusiamo per il disagio.
    </p>

    <template v-if="actions">
      <div class="q-mt-xl text-center">
        <lms-button @click="$emit('go-to-home')">Torna alla Home</lms-button>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "LmsMaintenance",
  inheritAttrs: false,
  props: {
    actions: { type: Boolean, requried: false, default: false }
  },
  computed: {}
};
</script>
