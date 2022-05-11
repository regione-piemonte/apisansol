<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-modal :value="value"
           @input="$emit('input', $event)"
           content-classes="q-py-md"
           :content-css="{maxWidth: '800px'}"
           no-route-dismiss
           no-esc-dismiss
           no-backdrop-dismiss>

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
                  cartelle
                  documenti clinici in tuo possesso.
                </p>
              </div>
            </q-slide-transition>
          </div>


          <div class="row q-mt-lg">

            <q-btn @click="$emit('activate')" color="primary" class="col-12">
              Attiva il Fascicolo Sanitario
            </q-btn>
            <q-btn @click="onExit" outline color="primary" class="col-12 q-mt-sm">
              Al momento non mi interessa
            </q-btn>

            <q-field>
              <q-checkbox
                v-model="doNotAskMeAgain"
                label="Non mostrarmi più questo messaggio"
              />
            </q-field>
          </div>
        </div>
      </div>
    </q-modal-layout>

  </q-modal>
</template>

<script>
  export default {
    name: 'CsiEnrollmentModal',
    props: {
      value: {type: Boolean, required: true},
    },
    data() {
      return {
        areMoreInfoVisible: false,
        doNotAskMeAgain: false,
      }
    },
    methods: {
      toggleMoreInfo() {
        this.areMoreInfoVisible = !this.areMoreInfoVisible;
      },
      onExit(){

              this.$emit('exit', this.doNotAskMeAgain)
              console.log(this.mandatory)
          }
      }
  }
</script>

<style>
</style>
