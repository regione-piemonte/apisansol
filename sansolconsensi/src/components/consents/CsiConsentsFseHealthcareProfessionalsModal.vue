<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-modal
    :value="value"
    no-esc-dismiss
    no-backdrop-dismiss
    :maximized="$q.screen.lt.sm"
    :content-css="{width: '800px'}"
    @input="$emit('input', $event)"
  >
    <q-modal-layout header-class="no-shadow">
      <q-toolbar slot="header" color="transparent" text-color="black">
        <q-toolbar-title class="q-px-none">
          Decreto del presidente del consiglio dei ministri 29 Settembre, n. 178
        </q-toolbar-title>
        <q-btn flat round icon="close" v-close-overlay/>
      </q-toolbar>

      <div class="q-pa-md">
        <p class="text-weight-bold">
          Regolamento in materia di fascicolo sanitario elettronico. (15G00192) <span class="text-green-8">(GU Serie Generale n.263 del 11-11-2015)</span>
        </p>

        <p class="text-weight-bold text-red-8">
          Entrata in vigore del provvedimento: 26/11/2015
        </p>

        <p>
          I profili di accesso alle informazioni disponibili nel FSE sono definiti in funzione del ruolo che ciascun
          soggetto assume.
          Tali ruoli, in sede di prima applicazione, sono elencati di seguito:
        </p>

        <ul>
          <li>
            Farmacista: operatore sanitario della farmacia abilitato alla professione.
          </li>
          <li>
            Operatore Amministrativo: persona che opera presso le strutture del sistema sanitario e socio-sanitario (es.
            AO, ASL, MMG) con mansioni amministrative.
          </li>
          <li>
            Direttore Sanitario: medico che svolge attività direttive all’interno di una Direzione Sanitaria delle
            strutture del sistema sanitario e socio-sanitario.
          </li>
          <li>
            Medico di Medicina Generale / Pediatra di Libera Scelta: medico convenzionato con la ASL per svolgere
            attività
            di MMG/PLS.
          </li>
          <li>
            Direttore Amministrativo: persona che svolge attività direttive all’interno della Direzione Amministrativa
            di
            strutture del sistema sanitario e socio-sanitario.
          </li>
          <li>
            Medico ed altri dirigenti sanitari (biologo, psicologo, chimico, fi sico): professionisti che operano
            nell’ambito dei servizi sanitari delle strutture del sistema sanitario e socio-sanitario.
          </li>
          <li>
            Medico RSA: medico che opera presso una struttura che eroga assistenza di tipo residenziale.
          </li>
          <li>
            Infermiere o altro Professionista Sanitario: professionista sanitario che opera nell’ambito delle strutture
            del sistema sanitario e socio-sanitario.
          </li>
          <li>
            Medico Rete di Patologia: medico che opera nel contesto di una rete di patologia.
          </li>
          <li>
            Professionista del sociale: professionista che svolge la sua attività sia nel settore sociale che in quello
            sanitario, in servizi di tipo socio-assistenziale e socio-sanitario, residenziali o semiresidenziali, in
            ambiente ospedaliero e al domicilio dell’utente.
          </li>
          <li>
            Assistito: cittadino che usufruisce di servizi sanitari e socio-sanitari.
          </li>
        </ul>
      </div>
    </q-modal-layout>
  </q-modal>
</template>

<script>
  export default {
    name: "CsiConsentsFseHealthcareProfessionalsModal",
    props: {
      value: {type: Boolean, required: false, default: false},
    },
    data() {
      return {}
    },
    computed: {},
    created() {
    },
    methods: {}
  }
</script>

<style scoped lang="stylus">

</style>
