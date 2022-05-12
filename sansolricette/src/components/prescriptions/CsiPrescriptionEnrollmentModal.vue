<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<!--
 @TODO: non dovrebbe più essere usata. Possiamo pensare di toglierla per pulizia.
 -->

<template>
  <q-modal
    :value="value"
    @input="$emit('input', $event)"
    :content-css="{maxWidth: '800px'}"
    no-route-dismiss
    no-esc-dismiss
    no-backdrop-dismiss

  >
    <q-modal-layout footer-class="shadow-0">

      <div class="row q-pa-lg gutter-y-sm">

        <div class="col-12 col-sm col-lg-5 q-px-lg">
          <img src="statics/images/enrollment/enrollment.svg" alt="Icona arruolamento">
        </div>

        <div class="col-s12 col-sm">

          <div class="q-body-2">
            Per utilizzare i servizi online della sanità piemontese è necessario aver aperto il Fascicolo Sanitario
            Elettronico
          </div>


          <div class="q-body-1 q-mt-md">

            <div @click="toggleMoreInfo" class="q-body-2 text-primary text-center q-mb-sm cursor-pointer lt-sm">
              <span>Scopri di più</span>
              <q-icon name="arrow_drop_down"
                      class="csi-icon--sm transition-generic"
                      :class="{'rotate-180': areMoreInfoVisible}">
              </q-icon>
            </div>

            <q-slide-transition>
              <div v-show="$q.screen.gt.sm || areMoreInfoVisible">
                <p>
                  Il Fascicolo Sanitario Elettronico (FSE) traccia la tua storia clinica rendendo disponibili tutte le
                  informazioni e i documenti prodotti sul territorio regionale da medici e operatori sanitari anche di
                  strutture
                  diverse (ASL, Aziende Ospedaliere, medici di famiglia e pediatri …).
                </p>
                <p>
                  Puoi inoltre arricchire il tuo fascicolo inserendo dati nel tuo taccuino digitale, e archiviando in
                  cartelle documenti clinici in tuo possesso.
                </p>
              </div>
            </q-slide-transition>
          </div>


          <div v-if="this.canOpenFse" class="row q-mt-lg">

            <q-btn @click="onActivate" color="primary" class="col-12">
              Attiva il Fascicolo Sanitario
            </q-btn>
            <q-btn @click="onExit" outline color="primary" class="col-12 q-mt-sm">
              Al momento non mi interessa
            </q-btn>

          </div>
          <div class="q-body-1 q-mt-md" v-else>

            Siamo spiacenti, ma al momento non è possibile visualizzare ricette per cittadini che non
            hanno un’assistenza sanitaria attiva in Piemonte e non hanno attivato il Fascicolo Sanitario
            Elettronico.
            <div class="row q-mt-lg">
              <q-btn @click="onExit" outline color="primary" class="col-12 q-mt-sm">
                Indietro
              </q-btn>
            </div>

          </div>


        </div>
      </div>


    </q-modal-layout>
  </q-modal>
</template>

<script>
  import {isNil} from "@services/global/utils";

  export default {
    name: 'CsiPrescriptionEnrollmentModal',
    props: {
      value: {type: Boolean, required: true},
    },
    data() {
      return {
        areMoreInfoVisible: false,
      }
    },
    computed: {
      isPiedmontUser() {
        return this.$store.getters['global/isPiedmontUser']
      },
      canOpenFse() {
        let enrollmentInfo = this.$store.state.global.enrollmentInfo;
        if (isNil(enrollmentInfo)) return false;
        let isEnrollable = enrollmentInfo.risposta;
        return isEnrollable;
      },

    },
    methods: {
      toggleMoreInfo() {
        this.areMoreInfoVisible = !this.areMoreInfoVisible;
        console.log(this.isPiedmontUser)
      },
      onActivate() {
        this.$emit('onActivate')
      },
      onExit() {
        this.$emit('onExit')
      }

    }
  }
</script>

<style>
</style>
