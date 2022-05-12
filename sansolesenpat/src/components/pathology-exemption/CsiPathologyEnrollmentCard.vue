<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-alert type="warning" class="fse-enrollment" v-if="canOpen" :icon="iconCard" >
    <div class="text-body-1">
      <p class="q-mb-md" v-if="requiredOnService">
        Per utilizzare questo servizio devi avere il Fascicolo Sanitario attivo.
      </p>
      <p class="q-mb-md" v-else>
        Non hai ancora aperto il Fascicolo Sanitario Elettronico.
      </p>
      <p>
        Se apri il Fascicolo:
      </p>
      <ul>
        <li>avrai un unico punto di accesso alla tua storia clinica</li>
        <li>potrai consultare il tuo fascicolo ovunque ti trovi</li>
        <li>potrai far arrivare velocemente al tuo medico curante le informazioni che ti riguardano</li>
        <li>potrai essere seguito con maggiore continuità</li>
        <li>potrai evitare esami ripetuti o non necessari</li>
      </ul>
      <p class="no-margin">
        Il Fascicolo Sanitario Elettronico conterrà referti provenienti da ASR della Regione Piemonte e di
        altre regioni, oltre a referti provenienti da Aziende Private accreditate e altri documenti che tu
        stesso potrai inserire.
      </p>

      <div class="full-width q-mt-lg">

        <csi-buttons>

          <q-btn  color="primary" class="col-12 col-md-auto q-px-sm" @click="$emit('click-activate')">
            Attiva il Fascicolo Sanitario
          </q-btn>
          <template v-if="askedOnService">
            <q-btn @click="onExit" outline color="primary" class="col-12 col-md-auto q-px-sm">
              Al momento non mi interessa
            </q-btn>
          </template>
        </csi-buttons>

        <template v-if="askedOnService">
          <q-field class="q-pa-sm" :class="$q.screen.gt.sm? 'text-right': 'text-center'">
            <q-checkbox
              v-model="doNotAskMeAgain"
              label="Non mostrarmi più questo messaggio"
            />
          </q-field>
        </template>
      </div>

    </div>
  </q-alert>
  <q-alert type="enrollment" v-else :icon="iconCard" class="">
    <div class="q-body-1 ">
      Siamo spiacenti, ma al momento non è possibile accedere al servizio per cittadini che non
      hanno un’assistenza sanitaria attiva in Piemonte <span v-if="!notPiedmont"> e non hanno attivato il Fascicolo Sanitario
      Elettronico</span>.
    </div>
  </q-alert>
</template>

<script>
import {canOpenFse as _canOpenFse} from "../../services/enrollment/business-logic";

export default {
  name: "CsiPathologyEnrollmentCard",
  props: {
    canOpen: {type: Boolean, default: false},
    requiredOnService: {type: Boolean, default: false},
    askedOnService: {type: Boolean, default: false},
    notPiedmont:{type: Boolean, default: false},
  },
  data() {
    return {
      areMoreInfoVisible: false,
      doNotAskMeAgain:false
    }
  },
  computed:{
    iconCard(){
      return this.$q.screen.gt.sm ? 'warning' : ''
    },


  },
  methods: {
    toggleMoreInfo() {
      this.areMoreInfoVisible = !this.areMoreInfoVisible;
    },
    onExit(){
      this.$emit('click-exit', this.doNotAskMeAgain)

    }
  }
}
</script>

<style lang="stylus" >

</style>
