<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-banner class="q-mt-md bg-blue-2" rounded>
    <div class="row q-col-gutter-md">
      <div class="col-auto">
        <q-icon name="fas fa-info-circle" size="md" />
      </div>

      <div class="col text-body1">
        Non hai nessun documento. <br />
        Il Fascicolo verrà alimentato con i referti emessi successivamente alla
        data di apertura. <br />
        Per visualizzare i referti emessi in precedenza, occorre dare il
        consenso al recupero dei documenti pregressi modificando le impostazioni
        del tuo account. <br />
        È inoltre sempre possibile caricare personalmente i propri documenti.
      </div>
    </div>
  </q-banner>
</template>

<script>
export default {
  name: "FseDocumentListEmptyBanner",
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass"></style>
