<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card>
    <q-card-main>
      <div class="row">
        <!-- BANNER -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <div class="col-12 col-sm col-lg-5 q-px-lg text-center">
          <img
            class="justify-center"
            style="max-width: 400px"
            src="statics/images/enrollment/enrollment.svg"
            alt="Icona arruolamento"
          >
        </div>

        <!-- TESTO NO DATA -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <template v-if="noData">
          <div class="col-12 col-sm">
            <q-alert color="warning">
              Non è stato possibile ricavare i dati riguardanti il Fascicolo Sanitario Elettronico del delegante.
              Ti invitiamo a riprovare a collegarti come delegato.
            </q-alert>

            <!-- AZIONI NO DATA -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <div class="row q-mt-lg">
              <csi-button class="col-sm-auto col-12 q-mt-sm float-right" @click="$emit('click-retry')">
                Riprova
              </csi-button>
            </div>
          </div>
        </template>

        <!-- TESTO DATA -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <template v-else>
          <div class="col-s12 col-sm">
            <div class="q-body-2">
              Il tuo delegante non ha aperto il Fascicolo Sanitario
              Elettronico che è necessario per utilizzare i servizi online della sanità piemontese
            </div>


            <div class="q-body-1 q-mt-md">
              <div @click="toggleMoreInfo" class="q-body-2 text-primary text-center q-mb-sm cursor-pointer lt-sm">
                <span>Scopri di più</span>
                <q-icon
                  name="arrow_drop_down"
                  class="csi-icon--sm transition-generic"
                  :class="{'rotate-180': areMoreInfoVisible}"
                />
              </div>

              <q-slide-transition>
                <div v-show="$q.screen.gt.sm || areMoreInfoVisible">
                  <p>
                    Il Fascicolo Sanitario Elettronico (FSE) traccia la tua storia clinica rendendo disponibili
                    tutte le
                    informazioni e i documenti prodotti sul territorio regionale da medici e operatori sanitari
                    anche di
                    strutture
                    diverse (ASL, Aziende Ospedaliere, medici di famiglia e pediatri …).
                  </p>
                  <p>
                    Puoi inoltre arricchire il tuo fascicolo inserendo dati nel tuo taccuino digitale, e archiviando
                    in
                    cartelle documenti clinici in tuo possesso.
                  </p>
                </div>
              </q-slide-transition>
            </div>

            <!-- AZIONI DATA -->
            <!-- --------------------------------------------------------------------------------------------------- -->
            <template v-if="canOpen">
              <div class="q-mt-md">
                <csi-button label="Attiva il fascicolo sanitario" block @click="$emit('click-activate')"/>
              </div>
            </template>

<!--            SE NON è OBBLIGATIORIO L'FSE DO LA POSSIBILITA DI CHIUDERE LA CARD E CONTINUARE-->
            <template v-if="isObbligatorio===false">
            <div class="q-mt-md">
              <csi-button label="Vai al servizio" block @click="$emit('click-close')"/>
            </div>
            </template>
          </div>
        </template>
      </div>
    </q-card-main>
<!--    <div v-if="isObbligatorio===false" class="q-mt-md">-->
<!--      <csi-button label="Chiudi" block @click="$emit('click-close')"/>-->
<!--    </div>-->
  </q-card>
</template>

<script>
  export default {
    name: "CsiEnrollmentCardDelegator",
    props: {
      canOpen: {type: Boolean, required: false, default: false},
      noData: {type: Boolean, required: false, default: false},
        obbligatorio: {type: Boolean, required: true, default: true}
    },
    data() {
      return {
          isObbligatorio: null,
        areMoreInfoVisible: false
      }
    },
    methods: {
      toggleMoreInfo() {
        this.areMoreInfoVisible = !this.areMoreInfoVisible;
      },

    },
      created() {
        this.isObbligatorio=this.obbligatorio
      }
  }
</script>

<style scoped>

</style>
