<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>

    <p class="q-title">Modifica Consenso Effettuata</p>
    <div>

      <!-- Tipi di alert diversi a seconda che sia stata ATTIVATO, REVOCATO o NON ESPRESSO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <!--banner per regionali-->
<!--      <q-alert v-if="singleConsent.informativa.tipo_consenso.codice==='R' && singleConsent.consensi[0].tipo_stato.codice==='A'" type="positive">-->

<!--        <p>Il consenso nominato: <strong>{{singleConsent.informativa.sotto_tipo_consenso.descrizione}}</strong> è stato-->
<!--          ATTIVATO-->
<!--          correttamente.</p>-->

<!--        <p>-->
<!--          Azione effettuata in data: {{new Date() | format}} per-->
<!--          {{singleConsent.informativa.sotto_tipo_consenso.descrizione}}-->
<!--        </p>-->

<!--      </q-alert>-->

<!--      <q-alert v-if="singleConsent.informativa.tipo_consenso.codice==='R' && singleConsent.consensi[0].tipo_stato.codice==='NON ESPRESSO'" type="positive">-->

<!--        <p>Non è stata espressa una decisione per il consenso nominato:-->
<!--          <strong>{{singleConsent.informativa.sotto_tipo_consenso.descrizione}}</strong>.</p>-->
<!--        <p>Potrai selezionare una preferenza in qualunque momento.</p>-->
<!--        <br>-->
<!--        <p>-->
<!--          Azione effettuata in data: {{new Date() | format}} per-->
<!--          {{singleConsent.informativa.sotto_tipo_consenso.descrizione}}-->
<!--        </p>-->

<!--      </q-alert>-->


<!--      <q-alert v-if="singleConsent.informativa.tipo_consenso.codice==='R' && singleConsent.consensi[0].tipo_stato.codice==='R'" type="positive">-->
<!--        <p>Il consenso nominato <strong>{{singleConsent.informativa.sotto_tipo_consenso.descrizione}}</strong> è stato-->
<!--          REVOCATO-->
<!--          correttamente.</p>-->

<!--        <p>-->
<!--          Azione effettuata in data: {{new Date() | format}} per-->
<!--          {{singleConsent.informativa.sotto_tipo_consenso.descrizione}}-->
<!--        </p>-->

<!--      </q-alert>-->
<!--      &lt;!&ndash;banner per aziendali&ndash;&gt;-->

<!--      <q-alert v-if="singleConsent.informativa.tipo_consenso.codice==='A' && atLeastOneActive===true" type="positive">-->
<!--        <p>Il consenso nominato: <strong>{{singleConsent.informativa.sotto_tipo_consenso.descrizione}}</strong> è stato-->
<!--          ATTIVATO-->
<!--          correttamente.</p>-->

<!--        <p>-->
<!--          Azione effettuata in data: {{new Date() | format}} per-->
<!--          {{singleConsent.informativa.sotto_tipo_consenso.descrizione}}-->
<!--        </p>-->

<!--      </q-alert>-->

<!--      <q-alert v-if="singleConsent.informativa.tipo_consenso.codice==='A' && isRevoked===true" type="positive">-->
<!--        <p>Il consenso nominato <strong>{{singleConsent.informativa.sotto_tipo_consenso.descrizione}}</strong> è stato-->
<!--          REVOCATO-->
<!--          correttamente.</p>-->

<!--        <p>-->
<!--          Azione effettuata in data: {{new Date() | format}} per-->
<!--          {{singleConsent.informativa.sotto_tipo_consenso.descrizione}}-->
<!--        </p>-->

<!--      </q-alert>-->

<!--      <q-alert v-if="singleConsent.informativa.tipo_consenso.codice==='A' && notExpressed===true" type="positive">-->
<!--        <p>Il consenso nominato <strong>{{singleConsent.informativa.sotto_tipo_consenso.descrizione}}</strong> è stato-->
<!--          REVOCATO-->
<!--          correttamente.</p>-->

<!--        <p>-->
<!--          Azione effettuata in data: {{new Date() | format}} per-->
<!--          {{singleConsent.informativa.sotto_tipo_consenso.descrizione}}-->
<!--        </p>-->

<!--      </q-alert>-->

      <q-alert type="positive">
                <p>La tua richiesta è stata presa in carico. Se hai attivato le notifiche riceverai conferma della
                  corretta ricezione da parte delle aziende</p>


              </q-alert>


      <div class="q-pt-md">
        <csi-buttons>

          <csi-button @click="$router.push($routes.CONSENTS.HOME)" secondary>
            Torna alla home
          </csi-button>

        </csi-buttons>
      </div>
    </div>

  </q-page>
</template>

<script>

    import CsiModalFileViewer from "components/global/common/CsiModalFileViewer";

    export default {
        name: 'PageConsentSuccess',
        components: {CsiModalFileViewer},
        props: {
            id: {required: false},
            exemption: {type: Object, required: false, default: () => undefined}
        },
        data() {
            return {
                singleConsent: undefined,
                atLeastOneActive: false,
                revokedCounter: 0,
                isRevoked: false,
                notExpressed: false
            };
        },
        methods: {},
        async created() {

            this.status = this.$config.consents.availableStatuses;
            let singleConsent = this.$route.params.singleConsent;
            this.singleConsent = singleConsent;

            if(this.singleConsent.informativa.tipo_consenso.codice==='A'){
                for(let i=0; i<this.singleConsent.consensi.length; i++){
                    if(this.singleConsent.consensi[i].tipo_stato.codice==='A'){
                      this.atLeastOneActive=true
                    }
                    if(this.singleConsent.consensi[i].tipo_stato.codice==='R'){
                        this.revokedCounter++
                        if(this.revokedCounter===this.singleConsent.consensi.length){
                            this.isRevoked=true;
                        }
                    }
                }
                if(this.revokedCounter===0 && this.atLeastOneActive===false){
                    this.notExpressed=true;
                }
                if(this.atLeastOneActive===false && this.revokedCounter>0){
                    this.isRevoked=true;
                }
            }

        }
    }
</script>

<style>
</style>
