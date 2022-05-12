<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="csi-enrollment-guard-2">
    <template v-if="['000', '002', '004'].includes(code)">

      <q-alert :icon="$q.screen.gt.sm ? 'warning' : ''" class="fse-enrollment" type="warning">
        <div class="text-body-1">
          <template v-if="isMandatory">
            <p class="q-mb-md">
              Per utilizzare questo servizio devi avere il Fascicolo Sanitario attivo.
            </p>
          </template>

          <template v-else>
            <p class="q-mb-md">
              Non hai ancora aperto il Fascicolo Sanitario Elettronico.
            </p>
          </template>

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

          <p class="q-mb-none">
            Il Fascicolo Sanitario Elettronico conterrà referti provenienti da Aziende Sanitarie della Regione Piemonte
            e di altre regioni, oltre a referti provenienti da Strutture Private Accreditate accreditate e altri
            documenti che tu stesso potrai inserire.
          </p>

          <template v-if="!isConsentApp">
            <div class="full-width q-mt-lg">
              <csi-buttons>
                <csi-button primary @click="$emit('click-activate')">
                  Attiva il Fascicolo Sanitario
                </csi-button>
              </csi-buttons>
            </div>
          </template>
        </div>
      </q-alert>
    </template>

    <template v-if="['001'].includes(code)">
      <template v-if="isHealthPaymentApp || isChangeDoctorApp">
        <!-- Su PTW e SCEREV non mostriamo nessun messaggio -->
      </template>

      <template v-else-if="isEsenpatApp || isEsenredApp">
        <q-alert :icon="$q.screen.gt.sm ? 'warning' : ''" class="fse-enrollment" type="warning">
          <div class="text-body-1">
            Non hai il Medico di Famiglia in Piemonte: questo servizio è riservato ai cittadini che hanno il domicilio
            sanitario nel territorio piemontese.
          </div>
        </q-alert>
      </template>

      <template v-else-if="isPrescriptionsApp">
        <q-alert :icon="$q.screen.gt.sm ? 'warning' : ''" class="fse-enrollment" type="warning">
          <div class="text-body-1">
            Non hai il Medico di Famiglia in Piemonte: con questo servizio puoi visualizzare le ricette elettroniche
            rilasciate da medici e strutture sanitarie piemontesi, ma per accedere a tutte le tue ricette devi
            consultare il Fascicolo Sanitario Elettronico della Regione in cui hai il tuo domicilio sanitario.
          </div>
        </q-alert>
      </template>

      <template v-else-if="isEsenpatApp || isEsenredApp || isPrescriptionsApp">
        <q-alert :icon="$q.screen.gt.sm ? 'warning' : ''" class="fse-enrollment" type="warning">
          <div class="text-body-1">
            Non hai il Medico di Famiglia in Piemonte: con questo servizio puoi
            scaricare i referti che hai chiesto di ritirare online ma per
            consultare gli altri documenti della tua storia clinica devi accedere
            al sistema di Fascicolo Sanitario Elettronico della Regione in cui hai
            il tuo domicilio sanitario
          </div>
        </q-alert>
      </template>

      <template v-else>
        <q-alert :icon="$q.screen.gt.sm ? 'warning' : ''" class="fse-enrollment" type="warning">
          <div class="text-body-1">
            Il servizio è disponibile solamente per gli assistiti piemontesi
          </div>
        </q-alert>
      </template>
    </template>

    <template v-else-if="['003'].includes(code)"></template>

    <template v-else-if="['005'].includes(code)">
      <q-alert :icon="$q.screen.gt.sm ? 'warning' : ''" class="fse-enrollment" type="warning">
        <div class="text-body-1">
          Per accedere al servizio occorre avere il fascicolo sanitario attivo ma hai chiesto di non essere disturbato.
          Se vuoi aprire il fascicolo devi andare al modulo ‘gestione consensi’.
        </div>
      </q-alert>
    </template>

    <template v-else-if="['006'].includes(code)">
      TBD: Al momento questo codice non esiste
    </template>

    <template v-if="['007'].includes(code)">
      <q-alert :icon="$q.screen.gt.sm ? 'warning' : ''" class="fse-enrollment" type="warning">
        <div class="text-body-1">
          Colui che ti ha delegato non ha il Fascicolo Sanitario Elettronico attivo.
        </div>
      </q-alert>
    </template>

    <template v-else-if="['008'].includes(code)">
      <q-alert :icon="$q.screen.gt.sm ? 'warning' : ''" class="fse-enrollment" type="warning">
        <div class="text-body-1">
          Non hai fornito il consenso alla consultazione al tuo Fascicolo Sanitario Elettronico.
          Affinchè i professionisti sanitari possano consultare il tuo Fascicolo Sanitario Elettronico devi fornire il
          consenso alla consultazione.

          <template v-if="!isConsentApp">
            <div class="q-mt-md">
              <csi-buttons>
<!--                <csi-button :to="$routes.CONSENTS.CONSENT_DETAIL_FSE">-->
<!--                  Modifica consenso-->
<!--                </csi-button>-->
                <csi-button :to="consentFseEditUrlDelegator">
                  Modifica consenso
                </csi-button>
                <csi-button color="black" secondary @click="onDoNotAsk">
                  Non chiedermelo più
                </csi-button>
              </csi-buttons>
            </div>
          </template>
        </div>
      </q-alert>
    </template>

    <template v-else-if="['009'].includes(code)"></template>

    <template v-if="['010'].includes(code)">
      <q-alert :icon="$q.screen.gt.sm ? 'warning' : ''" class="fse-enrollment" type="warning">
        <div class="text-body-1">
          &Egrave; stata cambiata la versione di informativa del Fascicolo Sanitario e pertanto è necessario
          nuovamente attivare il fascicolo e prendere visione della nuova informativa e risottomettere i consensi.

          <template v-if="!isConsentApp">
            <div class="full-width q-mt-lg">
              <csi-buttons>
                <csi-button primary @click="$emit('click-activate')">
                  Attiva il Fascicolo Sanitario
                </csi-button>
              </csi-buttons>
            </div>
          </template>
        </div>
      </q-alert>
    </template>

    <template v-else-if="['011'].includes(code)">
      <q-alert :icon="$q.screen.gt.sm ? 'warning' : ''" class="fse-enrollment" type="warning">
        <div class="text-body-1">
          &Egrave; stata cambiata l’informativa: colui che ti ha delegato deve prenderne visione e confermare i consensi
          dati.
        </div>
      </q-alert>
    </template>

    <template v-if="['012'].includes(code)">
      <q-alert :icon="$q.screen.gt.sm ? 'warning' : ''" class="fse-enrollment" type="warning">
        <div class="text-body-1">
          Il processo del trasferimento dei dati del Fascicolo Sanitario Elettronico dalla precedente alla nuova regione
          di assistenza è stato completato.
        </div>

        <div class="full-width q-mt-lg">
          <csi-buttons>
            <csi-button primary @click="$emit('click-activate')">
              Attiva il Fascicolo Sanitario
            </csi-button>
          </csi-buttons>
        </div>
      </q-alert>
    </template>

    <template v-else-if="['013'].includes(code)">
      <q-alert :icon="$q.screen.gt.sm ? 'warning' : ''" class="fse-enrollment" type="warning">
        <div class="text-body-1">
          &Egrave; in corso il trasferimento dei dati del Fascicolo Sanitario Elettronico dalla precedente alla nuova
          regione di
          assistenza. Potrai accedere ai dati appena terminato il trasferimento.
        </div>
      </q-alert>
    </template>

    <template v-else-if="['014'].includes(code)">
      <q-alert :icon="$q.screen.gt.sm ? 'warning' : ''" class="fse-enrollment" type="warning">
        <div class="text-body-1">
          &Egrave; in corso il trasferimento dei dati del Fascicolo Sanitario Elettronico dalla precedente alla nuova
          regione di
          assistenza. Potrai accedere ai dati appena terminato il trasferimento.
        </div>
      </q-alert>
    </template>

    <template v-else-if="['015'].includes(code)">
      <template v-if="isHealthPaymentApp || isChangeDoctorApp">
        <!-- Su PTW e Scerev non mostriamo nessun messaggio -->
      </template>

      <template v-else>
        <q-alert :icon="$q.screen.gt.sm ? 'warning' : ''" class="fse-enrollment" type="warning">
          <div class="text-body-1">
            <!--          La regione di assistenza non è valida.-->
            Siamo spiacenti ma al momento non è possibile utilizzare il servizio per cittadini che non hanno
            un'assistenza
            sanitaria attiva in piemonte.
          </div>
        </q-alert>
      </template>
    </template>

    <template v-if="['016'].includes(code)"></template>

    <template v-if="['017'].includes(code)">
      <template v-if="isConsentApp">
        <q-alert :icon="$q.screen.gt.sm ? 'warning' : ''" class="fse-enrollment" type="warning">
          <div class="text-body-1">
            Non puoi modificare i consensi del tuo delegante.
          </div>
        </q-alert>
      </template>
    </template>
  </div>
</template>


<script>
import {notifyError} from "@services/api/utils";
import {saveDoNotAskMeAgain2} from "@services/api/enrollment";

export default {
  name: "CsiEnrollmentGuard2",
  props: {
    code: {type: String, required: false, default: null},
    isMandatory: {type: Boolean, required: false, default: false},
    isConsentApp: {type: Boolean, required: false, default: false},
    isHealthPaymentApp: {type: Boolean, required: false, default: false},
    isChangeDoctorApp: {type: Boolean, required: false, default: false},
    isEsenredApp: {type: Boolean, required: false, default: false},
    isEsenpatApp: {type: Boolean, required: false, default: false},
    isPrescriptionsApp: {type: Boolean, required: false, default: false},
    activeDelegator: {type: Object, required: false, default: () => null}
  },
  data() {
    return {}
  },
  computed: {
    user() {
      return this.$store.getters['global/user'];
    },

    consentFseEditUrlDelegator() {
      let name = this.$routes.CONSENTS.CONSENT_DETAIL_FSE.name;
      let route = {name};
      if (this.activeDelegator){
        route.query = {
          d: this.activeDelegator.uuid
        }
      }

      return route;
    },
    taxCode() {
      let taxCode = ''
      if (this.user)
        taxCode = this.user.cf
      if (this.activeDelegator)
        taxCode = this.activeDelegator.codice_fiscale_delega

      return taxCode
    }
  },
  created() {
  },
  methods: {
    async onDoNotAsk() {
      try {
        // let taxCode = this.user && this.user.cf;
        await saveDoNotAskMeAgain2(this.taxCode, {_no5XXRedirect: true});
        // @TODO: trovare il modo di non ricaricare la pagina
        window.location.reload();
      } catch (e) {
        notifyError(e, 'Non è stato possibile salvare la preferenza.')
      }
    }
  },
}
</script>


<style scoped>

</style>
