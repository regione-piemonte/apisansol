<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<!--
Questa pagina è accessibile solo tramite dispositivi mobile.
Questa pagina può essere richiamata in 2 modalità:

1) Cittadino autenticato:

   Il cittadino arriva a questa pagina navigando la webapp dopo aver fatto il login.
   In questo caso certifichiamo il dispositivo utilizzando il codice fiscale del
   cittadino loggato

2) Cittadino anonimo:

  Il cittadino arriva a questa pagina dopo aver cliccato sul link presente nell'SMS.
  In questo caso certifichiamo il dispositivo utilizzando il codice fiscale e l'otp che ci
  arrivano come parametri nella URL dall'SMS.

  N.B. Il link dell'SMS punta ad uno script PHP, per ragioni di caratteri speciali non inviabilit tramite SMS,
  che poi redirige su questa pagina
-->

<template>
  <lms-page padding>
    <lms-page-title class="q-mb-md" @back="onBack">
      Certifica dispositivo
    </lms-page-title>

    <!-- DISPOSITIVO NON MOBILE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="!isMobile">
      <q-banner class="q-banner--info">
        <div class="text-body1">
          È possibile certificare il dispositivo solo utilizzando un dispositivo
          mobile
        </div>
      </q-banner>
    </template>

    <!-- CERTIFICAZIONE IN CORSO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else-if="isDeviceCertifying">
      <!-- @TODO: cosa facciamo mentre sta validando il dispositivo? -->
      Sto certificando il dispositivo...
    </template>

    <!-- ALTRO DEVICE GIA' CERTIFICATO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
<!--    <template v-else-if="anotherDeviceError">-->
<!--      <q-banner class="q-banner&#45;&#45;negative">-->
<!--        <div class="text-body1">-->
<!--          Non è stato possibile certificare il dispositivo perché hai un altro in uso. Disabilita la certificazione precedente prima di procedere.-->
<!--        </div>-->
<!--      </q-banner>-->
<!--    </template>-->


    <!-- DEVICE CERTIFICATO CON SUCCESSO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else-if="isDeviceCertified">
      <q-banner class="bg-green-2 text-black" rounded>
        <div>
          Ok, la certificazione del tuo dispositivo ha avuto esito positivo. Da
          questo momento puoi consentire ad una farmacia occasionale di accedere alle ricette tue e di chi ti ha
          delegato.
        </div>
      </q-banner>

      <lms-buttons class="q-mt-md">
        <lms-button :to="HOME" outline>
          Torna alla home
        </lms-button>
      </lms-buttons>
    </template>

    <!-- ERRORE CERTIFICAZIONE DEVICE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else-if="hasDeviceCertifyingError">
      <q-banner class="q-banner--negative">
        <div class="text-body1">
          <template v-if="isOtpInvalid">
            Non è stato possibile certificare il dispositivo. I parametri
            contenuti nella url non sono corretti oppure il dispositivo è già
            stato certificato
          </template>

          <template v-if="isOtpExpired">
            Non è stato possibile certificare il dispositivo. E’ necessario
            chiedere l’emissione di un nuovo SMS di verifica.
          </template>
          <template v-else-if="hasAnotherDevice">
            Dispositivo già certificato.
          </template>

          <template v-else>
            A causa di un errore imprevisto non è stato possibile certificare il
            dispositivo. Se il problema persiste contatta l’assistenza.
          </template>
        </div>
      </q-banner>
    </template>

    <!-- DEVICE DA CERTIFICARE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <!-- UTENTE LOGGATO -->
    <!-- -------------- -->
    <template v-else-if="isUserLogged">
      <!-- CONTATTI NON IMPOSTATI -->
      <!-- ---------------------- -->
      <template v-if="!userContactsPhone">
        <q-banner class="q-banner--info">
          <div class="text-body1">
            Per poter certificare il tuo dispositivo è necessario impostare il
            numero di telefono nella sezione <strong>Contatti</strong> del tuo
            Profilo
          </div>
        </q-banner>

        <lms-buttons class="q-mt-md">
          <lms-button :href="userProfileAppUrl" type="a">
            Vai ai contatti
          </lms-button>
          <lms-button :to="HOME" outline>
            Torna alla home
          </lms-button>
        </lms-buttons>
      </template>
    </template>

    <!-- UTENTE ANONIMO -->
    <!-- -------------- -->
    <template v-else-if="!isUserLogged">
      <template v-if="!queryOtp || !queryTaxCode">
        <q-banner class="q-banner--negative">
          <div class="text-body1">
            Non è stato possibile certificare il dispositivo. I parametri
            contenuti nella url non sono corretti
          </div>
        </q-banner>
      </template>
    </template>

  </lms-page>
</template>

<script>
import {
  osName,
  browserName,
  mobileModel,
  mobileVendor
} from "mobile-device-detect";
import {uid} from "quasar";
import {associateDevice, associateDeviceOtp} from "../services/api";
import {HOME} from "src/router/routes";
import {urlUserProfile} from "src/services/urls";
import {apiErrorNotifyDialog} from "src/services/utils";

export default {
  name: "PageDeviceCertification",
  components: {},
  data() {
    return {
      HOME,
      isDeviceCertifying: false,
      isDeviceCertified: false,
      hasDeviceCertifyingError: false,
      deviceCertifyingError: null,
      deviceInfo: null,
      deviceInfoUuid: null,

    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    isUserLogged() {
      return this.$store.getters["isUserLogged"];
    },
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    userContacts() {
      return this.$store.getters["getNotifyContacts"];
    },
    deviceUuid() {
      return this.$store.getters["getDeviceUuid"];
    },

    queryOtp() {
      return this.$route.query.otp;
    },
    queryTaxCode() {
      return this.$route.query.cf;
    },
    isMobile() {
      return this.$q.platform.is.mobile;
    },
    userContactsPhone() {
      return this.userContacts?.sms ?? null;
    },
    userProfileAppUrl() {
      return urlUserProfile();
    },
    deviceCertifyingErrorCodeList() {
      let error = this.deviceCertifyingError;
      let result = [];

      if (error?.response?.data?.code) {
        result.push(error?.response?.data?.code);
      }

      let detailList = error?.response?.data?.detail ?? [];
      detailList.forEach(d => {
        if (d.chiave) result.push(d.chiave);
      });

      return result;
    },
    isDeviceCertifyingErrorHandled() {
      let codes = this.deviceCertifyingErrorCodeList;
      let codesHandled = ["FAR-CC-0070", "AR-CC-0071"];
      return codes.some(c => codesHandled.includes(c));
    },
    isOtpExpired() {
      let codes = this.deviceCertifyingErrorCodeList;
      return codes.includes("FAR-CC-0071");
    },
    isOtpInvalid() {
      let codes = this.deviceCertifyingErrorCodeList;
      return codes.includes("FAR-CC-0070");
    },
    hasAnotherDevice() {
      let codes = this.deviceCertifyingErrorCodeList;
      return codes.includes("FAR-CC-0064");
    },
  },
  async created() {
    // Questa pagina è utilizzabile solo da device mobile.
    if (!this.isMobile) return;

    // Se l'utente è loggato ma non ha i contatti impostati =>
    // gli diciamo di andare ad impostarli
    if (this.isUserLogged && !this.userContactsPhone) return;

    // Certifichiamo il device solo se l'utente è loggato oppure abbiamo tutti i dati
    // necessari per la certificazione del device tramite OTP
    if (this.isUserLogged || (this.queryOtp && this.queryTaxCode)) {
      this.certifyDevice();
    }


  },
  methods: {

    // async getUserCertifiedDevice() {
    //   this.isLoadingUserCertifiedDevice = true;
    //
    //   try {
    //     let taxCode = this.isUserLogged ? this.taxCode : this.queryTaxCode
    //     let {data} = await getCertifiedDeviceAnonymous(taxCode);
    //     this.deviceInfo = data || null;
    //     this.deviceInfoUuid = data?.uuid;
    //
    //     let uuid = data?.uuid ?? null;
    //
    //     // Quando l'uuid sul FSE è null oppure l'uuid sul FSE è diverso dall'uuid del device
    //     // => cancelliamo l'uuid sul device che oramai è obsoleto
    //     if (uuid === null || uuid !== this.deviceUuid) {
    //       await this.$store.dispatch("setDeviceUuid", {uuid: null});
    //     }
    //   } catch (error) {
    //     let status = error?.response?.status;
    //
    //     // Se risponde con 404 => non ci sono device certificati
    //     // => possiamo cancellare l'UUID dal browser che oramai è obsoleto
    //     // => Possiamo anche rimuovere l'eventuale UUID del FSE che abbiamo
    //     if (status === 404) {
    //       this.deviceInfoUuid = null;
    //       await this.$store.dispatch("setDeviceUuid", {uuid: null});
    //     }
    //
    //     // In tutti gli altri casi mostriamo semplicemente il messaggio di errore
    //     else if (status !== 404) {
    //       let message =
    //         "Non stato possibile recuperare le informazioni sul device certificato";
    //       apiErrorNotifyDialog({error, message});
    //     }
    //   }
    //
    //   this.isLoadingUserCertifiedDevice = false;
    // },
    async certifyDeviceAnonymous() {
      let uuid = uid();

      let payload = {
        // ci è stato chiesto di crearne uno nuovo anche se ne abbiamo già uno nel local storage
        uuid,
        otp: this.queryOtp,
        codice_fiscale: this.queryTaxCode,
        sistema_operativo: osName,
        browser: browserName,
        modello: `${mobileVendor} ${mobileModel}`
      };

      this.isDeviceCertifying = true;
      this.isDeviceCertified = false;
      this.hasDeviceCertifyingError = false;
      this.deviceCertifyingError = null;

      try {
        let {data} = await associateDeviceOtp(payload);
        await this.$store.dispatch("setDeviceUuid", {uuid});
        this.isDeviceCertified = true;
      } catch (error) {
        this.deviceCertifyingError = error;
        this.hasDeviceCertifyingError = true;

        // Se non si tratta di un errore gestito
        // => mostriamo il classico messaggio di feedback
        // if (!this.isDeviceCertifyingErrorHandled) {
        //   let message = "Non è stato possibile associare il device.";
        //   apiErrorNotifyDialog({ error, message });
        // }
      }

      this.isDeviceCertifying = false;
    },
    async certifyDeviceAuth() {
      let taxCode = this.taxCode;
      let uuid = uid();
      let phone = this.userContactsPhone;

      let payload = {
        uuid: uuid,
        // fonte_codice: DEVICE_SOURCE_CODES.CITIZEN,
        fonte_codice: "SANSOL",
        telefono: phone,
        sistema_operativo: osName,
        browser: browserName,
        modello: `${mobileVendor} ${mobileModel}`
      };

      this.isDeviceCertifying = true;
      this.isDeviceCertified = false;
      this.hasDeviceCertifyingError = false;
      this.deviceCertifyingError = null;

      try {
        let {data} = await associateDevice(taxCode, payload);
        await this.$store.dispatch("setDeviceUuid", {uuid});
        this.isDeviceCertified = true;
      } catch (error) {
        this.hasDeviceCertifyingError = true;
        this.deviceCertifyingError = error;

        // let message = "Non è stato possibile associare il device.";
        // apiErrorNotifyDialog({ error, message });
      }

      this.isDeviceCertifying = false;
    },
    certifyDevice() {
      if (this.isUserLogged) {
        this.certifyDeviceAuth();
      } else {
        this.certifyDeviceAnonymous();
      }
    },
    onBack() {
      this.$router.push(HOME)
    }
  }
};
</script>

<style lang="sass"></style>
