<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <q-alert type="positive">

      <div class="q-title">Hai attivato il tuo fascicolo!</div>

      <div class="q-body-1 q-mt-md">
        D'ora in poi:
        <ul>
          <li>avrai un unico punto di accesso alla tua storia clinica</li>
          <li>potrai consultare il tuo fascicolo ovunque ti trovi</li>
          <li>
            potrai far arrivare velocemente al tuo medico curante le informazioni che ti riguardano
          </li>
          <li>potrai essere seguito con maggiore continuità</li>
          <li>potrai evitare esami ripetuti o non necessari</li>
        </ul>
      </div>

    </q-alert>

  </div>
</template>

<script>
  export default {
    name: 'CsiEnrollmentAlertSuccess',
    data() {
      return {}
    }
  }
</script>

<style>
</style>
