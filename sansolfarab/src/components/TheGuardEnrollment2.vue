<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <div class="lms-the-guard-enrollment-2">
    <template v-if="['000'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          <p>
            Attenzione! Per poter utilizzare questo servizio è necessario il <strong>consenso all’alimentazione dei dati
            contenuti nel tuo Fascicolo Sanitario Elettronico</strong>.
          </p>

          <p class="q-mb-none">Se vuoi, puoi farlo subito</p>

          <lms-buttons class="q-mt-md">
            <lms-button :href="enrollmentUrlDelegator" type="a" unelevated>
              Attiva il tuo Fascicolo Sanitario
            </lms-button>
          </lms-buttons>
        </div>
      </q-banner>
    </template>

    <template v-if="['001'].includes(code)"></template>

    <template v-if="['002'].includes(code)"></template>

    <template v-else-if="['003'].includes(code)"></template>

    <template v-if="['004'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          <p>
            Attenzione! Per poter utilizzare questo servizio è necessario il <strong>consenso all’alimentazione dei dati
            presenti nel tuo Fascicolo Sanitario Elettronico</strong>.
          </p>

          <p class="q-mb-none">Se vuoi, puoi farlo subito</p>

          <lms-buttons class="q-mt-md">
            <lms-button :href="enrollmentUrlDelegator" type="a" unelevated>
              Attiva il tuo Fascicolo Sanitario
            </lms-button>
          </lms-buttons>
        </div>
      </q-banner>
    </template>

    <template v-else-if="['005'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          <p>
            Attenzione! Per poter utilizzare questo servizio <strong>è necessario il consenso all’alimentazione dei dati
            presenti nel tuo Fascicolo Sanitario Elettronico</strong>.
          </p>

        </div>
      </q-banner>
    </template>

    <template v-else-if="['006'].includes(code)"></template>

    <template v-if="['007'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          <p>
            Attenzione! Per poter utilizzare questo servizio è necessario il <strong>consenso all’alimentazione dei dati
            presenti nel tuo Fascicolo Sanitario Elettronico</strong>.
          </p>

          <p class="q-mb-none">Se stai accedendo per conto di una persona <strong>che ti ha delegato, ricorda che in
            assenza del suo consenso non sei abilitato al ritiro in farmacia!</strong></p>
        </div>
      </q-banner>
    </template>

    <template v-else-if="['008'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          <p>
            Attenzione! Per utilizzare questo servizio è necessario il consenso alla consultazione del tuo Fascicolo
            Sanitario Elettronico.
          </p>
          <p class="q-mb-none">Puoi cominciare a impostare le farmacie, ma ricorda che <strong>senza il tuo consenso i
            farmacisti non sono
            abilitati a visualizzare le tue prescrizioni!</strong></p>

          <div class="q-mt-md">
            <lms-buttons>
              <lms-button
                :href="consentFseEditUrlDelegator"
                type="a"
                unelevated
              >
                Modifica consenso
              </lms-button>
              <lms-button
                :loading="isSavingDoNotAsk"
                color="black"
                outline
                @click="onDoNotAsk"
              >
                Non chiedermelo più
              </lms-button>
            </lms-buttons>
          </div>
        </div>
      </q-banner>
    </template>

    <template v-else-if="['009'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          <p>
            Attenzione! Per utilizzare questo servizio è necessario il consenso alla consultazione del tuo Fascicolo
            Sanitario Elettronico.
          </p>
          <p class="q-mb-none">
            In questo momento puoi cominciare a impostare le farmacie, ma senza il consenso alla consultazione del tuo
            delegante, <strong>i farmacisti non sono abilitati a visualizzare le sue prescrizioni!</strong>
          </p>

        </div>
      </q-banner>
    </template>

    <template v-if="['010'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          Attenzione! Per utilizzare questo servizio è necessario prendere <strong>visione della versione aggiornata
          dell’informativa</strong>.
          <div class="full-width q-mt-lg">
            <lms-buttons>
              <lms-button :href="enrollmentUrlDelegator" type="a" unelevated>
                Vai all'informativa
              </lms-button>
            </lms-buttons>
          </div>
        </div>
      </q-banner>
    </template>

    <template v-else-if="['011'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          <p>Attenzione! Per utilizzare questo servizio è necessario prendere visione della versione aggiornata
            dell’informativa. </p>
          <p>
            Se stai accedendo per conto di un’altra persona, <strong>ricorda a chi ti ha delegato di provvedere al più
            presto</strong>.
          </p>
        </div>
      </q-banner>
    </template>

    <template v-if="['012'].includes(code)"></template>

    <template v-else-if="['013'].includes(code)"></template>

    <template v-else-if="['014'].includes(code)"></template>

    <template v-else-if="['015'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          Attenzione! Il servizio è <strong>riservato agli assistiti dalla Regione Piemonte</strong>
        </div>
      </q-banner>
    </template>

    <template v-if="['016'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>
      <p>Attenzione! Per utilizzare questo servizio è necessario il consenso alla consultazione del tuo Fascicolo
        Sanitario Elettronico. </p>
      <p class="q-mb-none">Puoi cominciare a impostare le farmacie, ma ricorda che <strong>senza il tuo consenso i
        farmacisti non sono abilitati a
        visualizzare le tue prescrizioni!</strong></p>
      </q-banner>
    </template>

    <template v-if="['017'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>
      <p>Attenzione! Per utilizzare questo servizio è necessario il consenso alla consultazione del tuo Fascicolo
        Sanitario Elettronico.</p>
      <p class="q-mb-none">In questo momento puoi cominciare a impostare le farmacie, ma senza il consenso alla
        consultazione del tuo delegante, i <strong>farmacisti non sono abilitati a visualizzare le sue prescrizioni!</strong></p>
      </q-banner>
    </template>

    <template v-if="['994'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>
        <div class="text-body1">
          Codice fiscale annullato
        </div>
      </q-banner>
    </template>

    <template v-if="['995'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>
        <div class="text-body1">
           Assistito  emigrato
        </div>
      </q-banner>
    </template>

    <template v-if="['996'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>
        <div class="text-body1">
           Assistito deceduto
        </div>
      </q-banner>
    </template>

    <template v-if="['997'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>
        <div class="text-body1">
           Mancata corrispondenza patient Id
        </div>
      </q-banner>
    </template>

    <template v-if="['998'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>
        <div class="text-body1">
           Identificativo assistito non valido
        </div>
      </q-banner>
    </template>

    <template v-if="['999'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>
        <div class="text-body1">
           Altro errore di stato consensi
        </div>
      </q-banner>
    </template>

  </div>
</template>



<script>
import {saveDoNotAskMeAgain2} from "../services/api";
import {apiErrorNotifyDialog} from "../services/utils";
import { FSE_APP_CODE} from "src/services/config";

export default {
  name: "TheGuardEnrollment2",
  props: {
    code: {type: String, required: false, default: null},
    isMandatory: {type: Boolean, required: false, default: false}
  },
  data() {
    return {
      isSavingDoNotAsk: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    taxCode(){
      return this.$store.getters["getTaxCode"];
    },
    // userInfo() {
    //   return this.$store.getters["getUserInfo"];
    // },
    enrollmentInfo() {
      return this.$store.getters["getEnrollmentInfo"];
    },
    appList() {
      return this.$store.getters["getAppList"];
    },
    app() {
      return this.appList?.find(a => a.codice === process.env.APP_CODE);
    },
    isEnrollmentRecommended() {
      return this.app?.arruolabile;
    },
    isEnrollmentMandatory() {
      return (
        this.isEnrollmentRecommended && this.app?.obbligatorio_arruolamento
      );
    },

    isUserEnrollable() {
      return this.enrollmentInfo?.risposta;
    },
    enrollmentUrl() {
      return `/la-mia-salute/arruolamento/#/?servizio=${FSE_APP_CODE}`;
    },
    enrollmentUrlDelegator() {
      let url = `/la-mia-salute/arruolamento/#/?servizio=${FSE_APP_CODE}`;
      let delegator = this.$store.getters["getDelegatorSelected"];
      if (delegator) url += `&d=${delegator.uuid}`;
      return url;
    },
    consentFseEditUrl() {
      return "/la-mia-salute/#/consensi/fse/";
    },
    consentFseEditUrlDelegator() {
      let url = "/la-mia-salute/#/consensi/fse/";
      let delegator = this.$store.getters["getDelegatorSelected"];
      if (delegator) url += `?d=${delegator.uuid}`;
      return url;
    }
  },
  methods: {
    onActivate() {
      const url = "/la-mia-salute/arruolamento/#/";
      window.location.assign(url);
    },
    async onDoNotAsk() {
      this.isSavingDoNotAsk = true;

      try {
        await saveDoNotAskMeAgain2(this.taxCode);
        // @TODO: trovare il modo di non ricaricare la pagina
        window.location.reload();
      } catch (error) {
        let message = "Non è stato possibile salvare la preferenza";
        apiErrorNotifyDialog({error, message});
      }

      this.isSavingDoNotAsk = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.lms-the-guard-enrollment-2 {
  .q-banner {
    padding: 16px;
    align-items: start;
  }
}
</style>
