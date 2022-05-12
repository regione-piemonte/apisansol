<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="lms-the-guard-enrollment-2">
    <template v-if="['000', '002', '004'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          <p>
            Non hai ancora aperto il Fascicolo Sanitario Elettronico
          </p>

          <p class="q-mb-none">Se apri il Fascicolo:</p>

          <ul>
            <li>avrai un unico punto di accesso alla tua storia clinica</li>
            <li>potrai consultare il tuo fascicolo ovunque ti trovi</li>
            <li>
              potrai far arrivare velocemente al tuo medico curante le
              informazioni che ti riguardano
            </li>
            <li>potrai essere seguito con maggiore continuità</li>
            <li>potrai evitare esami ripetuti o non necessari.</li>
          </ul>

          <p class="q-mt-md q-mb-none">
            Il Fascicolo Sanitario Elettronico conterrà referti provenienti da
            ASR della Regione Piemonte e di altre regioni, oltre a referti
            provenienti da Aziende Private accreditate e altri documenti che tu
            stesso potrai inserire.
          </p>

          <lms-buttons class="q-mt-md">
            <lms-button :href="enrollmentUrlDelegator" type="a" unelevated>
              Apri il fascicolo
            </lms-button>
          </lms-buttons>
        </div>
      </q-banner>
    </template>

    <template v-if="['001'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          Il servizio è disponibile solamente per gli assistiti piemontesi
        </div>
      </q-banner>
    </template>

    <template v-else-if="['003'].includes(code)"></template>

    <template v-else-if="['005'].includes(code)">
      <!--      <q-banner class="bg-yellow-2" rounded>-->
      <!--        <template #avatar>-->
      <!--          <q-icon name="fas fa-exclamation-triangle" size="sm" />-->
      <!--        </template>-->

      <!--        <div class="text-body1">-->
      <!--          Per accedere al servizio occorre avere il fascicolo sanitario attivo-->
      <!--          ma hai chiesto di non essere disturbato. Se vuoi aprire il fascicolo-->
      <!--          devi andare al modulo ‘gestione consensi’.-->
      <!--        </div>-->
      <!--      </q-banner>-->
    </template>

    <template v-else-if="['006'].includes(code)">
      TBD: Al momento questo codice non esiste
    </template>

    <template v-if="['007'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          Il delegante non ha il fascicolo sanitario attivo, pertanto la
          navigazione del servizio è inibita.
        </div>
      </q-banner>
    </template>

    <template v-else-if="['008'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          Non hai fornito il consenso alla consultazione. Affinchè i
          professionisti sanitari possano consultare il tuo fascicolo devi
          fornire il consenso alla consultazione.

          <div class="q-mt-md">
            <lms-buttons>
              <lms-button :href="consentFseEditUrlDelegator" type="a" unelevated>
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
<!--      <q-banner class="bg-yellow-2" rounded>-->
<!--        <template #avatar>-->
<!--          <q-icon name="fas fa-exclamation-triangle" size="sm"/>-->
<!--        </template>-->

<!--        <div class="text-body1">-->
<!--          Non hai fornito il consenso alla consultazione. Affinchè i-->
<!--          professionisti sanitari possano consultare il tuo fascicolo devi-->
<!--          fornire il consenso alla consultazione.-->
<!--        </div>-->
<!--      </q-banner>-->
    </template>

    <template v-if="['010'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          &Egrave; stata cambiata la versione di informativa del Fascicolo Sanitario e pertanto è necessario nuovamente
          attivare il fascicolo e prendere visione della nuova informativa e risottomettere i consensi.

          <div class="full-width q-mt-lg">
            <lms-buttons>
              <lms-button :href="enrollmentUrlDelegator" type="a" unelevated>
                Apri il fascicolo
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
          &Egrave; stata cambiata l’informativa: colui che ti ha delegato deve prenderne visione e confermare i consensi dati.
        </div>
      </q-banner>
    </template>

    <template v-if="['012'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          Il processo del trasferimento dei dati del Fascicolo Sanitario Elettronico dalla precedente alla nuova regione
          di assistenza è stato completato.
        </div>

        <div class="full-width q-mt-lg">
          <lms-buttons>
            <lms-button :href="enrollmentUrlDelegator" type="a" unelevated>
              Apri il fascicolo
            </lms-button>
          </lms-buttons>
        </div>
      </q-banner>
    </template>

    <template v-else-if="['013'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          L'utente non è autorizzato a risottomettere i consensi.
        </div>
      </q-banner>
    </template>

    <template v-else-if="['014'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          &Egrave; in corso il trasferimento indice dei dati. Potrai navigare
          nel servizio quando il processo sarà terminato.
        </div>
      </q-banner>
    </template>

    <template v-else-if="['015'].includes(code)">
      <q-banner class="bg-yellow-2" rounded>
        <template #avatar>
          <q-icon name="fas fa-exclamation-triangle" size="sm"/>
        </template>

        <div class="text-body1">
          La regione di assistenza non è valida.
        </div>
      </q-banner>
    </template>

    <template v-if="['016'].includes(code)"></template>

    <template v-if="['017'].includes(code)"></template>
  </div>
</template>

<script>
import {saveDoNotAskMeAgain2} from "../services/api";
import {apiErrorNotifyDialog} from "../services/utils";

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
      let serviceCode = this.app?.codice_servizio;
      return `/la-mia-salute/arruolamento/#/?servizio=${serviceCode}`;
    },
    enrollmentUrlDelegator() {
      let serviceCode = this.app?.codice_servizio;
      let url =  `/la-mia-salute/arruolamento/#/?servizio=${serviceCode}`;
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
