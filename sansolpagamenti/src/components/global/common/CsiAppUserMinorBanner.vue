<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <q-alert type="warning" class="csi-modal-alert" >
      <div class="q-body-1 q-px-md">
        <p>
          È stata utilizzata una credenziale associata ad una cittadina/o minorenne. Per accedere al servizio
          entrambi i genitori devono dichiarare la propria responsabilità genitoriale attraverso il servizio
          Deleghe ed accedere come delegati per conto del proprio figlio minorenne.
        </p>
      </div>
    </q-alert>
  </q-page>
</template>

<script>
export default {
  name: "CsiAppUserMinorBanner"
}
</script>

<style scoped>

</style>
