<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding style="min-height: 0px">
    <q-banner class="q-banner--warning q-mt-lg" rounded>
      <p class="text-body1 q-mb-none">
        È stata utilizzata una credenziale associata ad una cittadina/o minorenne. Per accedere al servizio
        entrambi i genitori devono dichiarare la propria responsabilità genitoriale attraverso il servizio
        Deleghe ed accedere come delegati per conto del proprio figlio minorenne.
      </p>
    </q-banner>
  </lms-page>
</template>

<script>
export default {
  name: "TheGuardUserMinor"
}
</script>

<style scoped>

</style>
