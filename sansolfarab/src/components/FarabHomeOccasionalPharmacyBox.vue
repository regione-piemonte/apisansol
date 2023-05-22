<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <div class="farab-home-ocasional-pharmachy-box">
    <!-- CARICAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="isLoading">
      <farab-home-occasional-pharmacy-box-skeleton />
    </template>

    <!-- CASO 1 - NESSUN DEVICE CERTIFICATO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else-if="!hasDeviceCertificated">
      <q-card class="q-mt-lg">
        <q-card-section>
          <div class="row q-col-gutter-x-xl">
            <div class="col-4 col-lg-3 gt-sm">
              <q-img
                class="q-pa-md"
                src="images/farmacia-occasionale-vuoto.svg"
              />
            </div>

            <div class="col">
              <p class="text-bold q-mb-sm">
                Consenti alla farmacia occasionale di accedere alle ricette
              </p>

              <q-banner class="q-banner--info q-my-md">
                <div class="text-body1">
                  Puoi permettere a qualunque farmacia in cui ti trovi di
                  accedere alle tue ricette: in questo caso è necessario
                  certificare il dispositivo mobile che utilizzerai per
                  approvare l’accesso.
                </div>
              </q-banner>

              <!-- @TODO: gestire il click -->
              <a
                class="lms-link row items-center"
                @click="isLearnMoreDialog = true"
              >
                Scopri di più
                <q-icon class="q-ml-xs" color="primary" name="o_info" />
              </a>

              <q-banner class="q-banner--warning q-my-md">
                <div class="text-body1">
                  Effettua l'accesso dal dispositivo mobile che intendi
                  certificare.
                </div>
              </q-banner>

              <template v-if="isMobile">
                <lms-buttons class="q-mt-md">
                  <lms-button outline @click="certifyDevice">
                    Certifica il dispositivo
                  </lms-button>
                </lms-buttons>
              </template>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </template>

    <!-- CASO 2 - LAVORO SUL DEVICE NON CERTIFICATO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else-if="hasDeviceCertificated && !isDeviceCertificated">
      <q-card class="q-mt-lg">
        <q-card-section>
          <p class="text-bold q-mb-sm">
            <!-- @TODO questo testo ha senso? -->
            Consenti alla farmacia occasionale di accedere alle ricette
          </p>

          <p class="q-mb-none">
            <!-- @TODO: messaggio -->
          </p>
        </q-card-section>

        <template v-if="deviceInfo">
          <q-card-section class="bg-grey-2">
            <div class="text-h6 q-mb-sm">
              Dispositivo attualmente certificato:
            </div>

            <div class="q-mb-xs">
              Modello:
              <strong>{{ deviceInfo.modello | capitalize }}</strong>
            </div>

            <div class="q-mb-xs">
              Sistema operativo:
              <strong>{{ deviceInfo.sistema_operativo | capitalize }}</strong>
            </div>

            <div class="q-mb-xs">
              Browser:
              <strong>{{ deviceInfo.browser | capitalize }}</strong>
            </div>

            <div class="q-mb-xs">
              Data:
              <strong>{{
                deviceInfo.data_certificazione | date("DD MMMM YYYY")
              }}</strong>
            </div>

            <div>
              Certificato da:
              <strong>{{ deviceInfo.fonte_descrizione | capitalize }}</strong>
            </div>
          </q-card-section>
        </template>

        <!-- Solo l'utente loggato può rimuovere il dispositivo certificato -->
        <template v-if="isUserLogged">
          <q-card-section>
            <lms-buttons>
              <lms-button
                color="negative"
                outline
                @click="openDeviceDisableDialog"
              >
                Disabilita certificazione
              </lms-button>
            </lms-buttons>
          </q-card-section>
        </template>
      </q-card>
    </template>

    <!-- CASO 3 - LAVORO SUL DEVICE CERTIFICATO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else-if="hasDeviceCertificated && isDeviceCertificated">
      <q-card class="q-mt-lg">
        <!--        <lms-card-item-bar type="positive">-->
        <!--          &lt;!&ndash; @TODO: testo &ndash;&gt;-->
        <!--          Questo è il dispositivo che hai certificato per ritirare i farmaci presso una farmacia occasionale-->
        <!--        </lms-card-item-bar>-->

        <q-card-section>
          <div class="row q-mb-md">
            <div class="col">
              <p class="text-bold q-mb-sm">
                Consenti alla farmacia occasionale di accedere alle ricette
              </p>
            </div>
            <q-space />
            <!-- AZIONI SECONDARIE -->
            <!-- ----------------- -->
            <q-icon
              class="col-auto cursor-pointer"
              color="grey-10"
              name="more_vert"
              size="sm"
            >
              <q-menu class="cursor-pointer">
                <q-list separator>
                  <q-item v-close-popup clickable @click="openDeviceInfoDialog">
                    <q-item-section>
                      <q-item-label> Info dispositivo </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item
                    v-close-popup
                    clickable
                    @click="openDeviceDisableDialog"
                  >
                    <q-item-section>
                      <q-item-label> Disabilita dispositivo </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </div>

          <p class="q-mb-none">
            Clicca sul pulsante “<strong>consenti</strong>” dopo che il
            farmacista ha effettuato la lettura della tua tessera sanitaria:
            solo così potrà visualizzare le ricette che non hai ancora
            utilizzato e consegnarti i farmaci prescritti.
          </p>
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <lms-buttons>
            <lms-button
              :loading="isLoadingOccasionalPharmacy"
              @click="getOccasionalPharmacyInfo"
            >
              Consenti
            </lms-button>
          </lms-buttons>
        </q-card-section>
      </q-card>
    </template>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <farab-device-certified-info-dialog
      v-model="isOpenDeviceInfoDialog"
      :device-info="deviceInfo"
      :maximized="$q.screen.lt.md"
      @click-remove-certification="openDeviceDisableDialog"
    />

    <farab-device-certified-remove-dialog
      v-model="isOpenDeviceDisableDialog"
      :maximized="$q.screen.lt.md"
      @removed="onDeviceRemoved"
    />

    <farab-occasional-pharmacy-confirm-dialog
      v-model="isOpenOccasionalPharmacyDialog"
      :maximized="$q.screen.lt.md"
      :occasional-pharmacy="occasionalPharmacy"
      @hide="occasionalPharmacy = null"
    />

    <template v-if="$c.IS_DEV">
      <div class="q-mt-md">
        UUID Device: {{ deviceUuid }} <br />
        UUID FSE: {{ deviceInfoUuid }}
      </div>
    </template>

    <q-dialog v-model="isLearnMoreDialog">
      <q-card>
        <div class="row items-start justify-between reverse q-px-md q-pt-sm">
          <q-btn v-close-popup class="col-auto" dense flat icon="close" round />
        </div>

        <q-card-section>
          <p class="text-h6 text-weight-regular q-mb-lg">
            Ricorda che per usufruire di questo servizio è
            <strong
              >indispensabile aver espresso il consenso alla consultazione dei
              tuoi dati clinico-sanitari</strong
            >… Non l’hai ancora fatto?<br />
            <a
              class="lms-link"
              href="url"
              >Provvedi subito!</a
            >
          </p>

          <template v-if="isMobile">
            <lms-buttons>
              <lms-button outline @click="certifyDevice">
                Certifica il dispositivo
              </lms-button>
            </lms-buttons>
          </template>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { DEVICE_CERTIFICATION } from "src/router/routes";
import {
  apiErrorNotify,
  apiErrorNotifyDialog,
  login,
} from "src/services/utils";
import { getCertifiedDevice, getOccasionalPharmacy } from "src/services/api";
import FarabOccasionalPharmacyConfirmDialog from "components/FarabOccasionalPharmacyConfirmDialog";
import FarabDeviceCertifiedRemoveDialog from "components/FarabDeviceCertifiedRemoveDialog";
import FarabDeviceCertifiedInfoDialog from "components/FarabDeviceCertifiedInfoDialog";
import LmsCardItemBar from "components/core/LmsCardItemBar";
import FarabHomeOccasionalPharmacyBoxSkeleton from "components/FarabHomeOccasionalPharmacyBoxSkeleton";
import { writeCustomLog } from "../services/api";

export default {
  name: "FarabHomeOccasionalPharmacyBox",
  components: {
    FarabHomeOccasionalPharmacyBoxSkeleton,
    FarabDeviceCertifiedInfoDialog,
    FarabDeviceCertifiedRemoveDialog,
    FarabOccasionalPharmacyConfirmDialog,
  },
  props: {},
  data() {
    return {
      isLoadingOccasionalPharmacy: false,
      isLoadingUserCertifiedDevice: false,
      isOpenDeviceInfoDialog: false,
      isOpenDeviceDisableDialog: false,
      isOpenOccasionalPharmacyDialog: false,
      deviceInfo: null,
      deviceInfoUuid: null,
      occasionalPharmacy: null,
      isLearnMoreDialog: false,
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
    deviceUuid() {
      return this.$store.getters["getDeviceUuid"];
    },
    isMobile() {
      return this.$q.platform.is.mobile;
    },
    // Indica se il cittadino ha un device certificato
    hasDeviceCertificated() {
      return !!this.deviceInfoUuid;
    },
    // Indica se questo device è quello certificato
    isDeviceCertificated() {
      return (
        this.hasDeviceCertificated && this.deviceUuid === this.deviceInfoUuid
      );
    },
    isLoading() {
      return this.isLoadingUserCertifiedDevice;
    },
  },
  created() {
    if (this.isUserLogged) {
      this.getUserCertifiedDevice();
    } else {
      this.getOccasionalPharmacy();
    }
  },
  methods: {
    openDeviceInfoDialog() {
      // Questa azione è accessibile solo agli utenti loggati
      if (!this.isUserLogged) {
        let loginUrl = "/api/bff/login";
        let landingUrl = `${window.location.pathname}#/`;
        login(loginUrl, landingUrl);
        return;
      }

      this.isOpenDeviceInfoDialog = true;
    },
    openDeviceDisableDialog() {
      // Questa azione è accessibile solo agli utenti loggati
      if (!this.isUserLogged) {
        let loginUrl = "/api/bff/login";
        let landingUrl = `${window.location.pathname}#/`;
        login(loginUrl, landingUrl);
        return;
      }

      this.isOpenDeviceDisableDialog = true;
    },
    certifyDevice() {
      if (this.isUserLogged) {
        let name = DEVICE_CERTIFICATION.name;
        this.$router.push({ name });
      } else {
        // Da questa webapp facciamo certificare il dispositivo solo da autenticato
        let loginUrl = "/api/bff/login";
        let landingUrl = `${window.location.pathname}#/`;
        login(loginUrl, landingUrl);
      }
    },
    onDeviceRemoved() {
      this.deviceInfoUuid = null;
      // Quando il device è stato rimosso
      // => ricarichiamo le info dalle API
      this.getUserCertifiedDevice();
    },
    async getOccasionalPharmacyInfo() {
      await this.getOccasionalPharmacy();
      this.isOpenOccasionalPharmacyDialog = true;
    },
    async getOccasionalPharmacy() {
      if (!this.deviceUuid) return;

      let params = { device_uuid: this.deviceUuid };

      this.isLoadingOccasionalPharmacy = true;

      try {
        let { data } = await getOccasionalPharmacy({ params });
        this.occasionalPharmacy = data;
        // Se l'utente non è loggato ed il servizio ci ha risposto
        // => significa che l'UUID sul FSE è lo stesso che abbiamo sul browser
        if (!this.isUserLogged) this.deviceInfoUuid = this.deviceUuid;
      } catch (error) {
        let errorCode = error?.response?.data?.detail?.[0]?.chiave ?? null;

        // FAR-CC-0067 -> UUID non valido
        //                Quindi possiamo cancellare l'UUID che abbiamo salvato sul browser
        if (errorCode === "FAR-CC-0067") {
          //CHIAMO API LOG CUSTOM
          try {
            let payload = {
              motivo: "errore FAR-CC-0067 -> UUID non valido in salvataggio",
                endpoint:"/api/v1/farmacia-occasionale",
              uuid: this.deviceUuid,
            };
            let promise = await writeCustomLog(payload);
          } catch (e) {}
          await this.$store.dispatch("setDeviceUuid", { uuid: null });
        }

        // FAR-CC-0068 -> Nessuna richiesta pendente
        //                Significa anche che l'uuid sul browser è lo stesso salvato sul FSE
        else if (errorCode === "FAR-CC-0068") {
          this.deviceInfoUuid = this.deviceUuid;
        }

        // Per gli altri errori => mostriamo semplicemente l'errore
        else {
          let message = "Nessuna farmacia occasionale";
          apiErrorNotifyDialog({ error, message });
        }
      }

      this.isLoadingOccasionalPharmacy = false;
    },
    async getUserCertifiedDevice() {
      this.isLoadingUserCertifiedDevice = true;

      try {
        let { data } = await getCertifiedDevice(this.taxCode);
        this.deviceInfo = data || null;
        this.deviceInfoUuid = data?.uuid;

        let uuid = data?.uuid ?? null;

        // Quando l'uuid sul FSE è null oppure l'uuid sul FSE è diverso dall'uuid del device
        // => cancelliamo l'uuid sul device che oramai è obsoleto
        if (uuid === null || uuid !== this.deviceUuid) {
          let message = "";
          if (uuid === null) {
            message = "l'uuid sul FSE è null";
          } else if (uuid !== this.deviceUuid) {
            message = "l'uuid sul FSE è diverso dall'uuid del device";
          }
          try {
            let payload = { motivo: message, endpoint:"/api/v1/cittadini/"+this.taxCode+"/device-certificato", uuid: this.deviceUuid };
            let promise = await writeCustomLog(payload);
          } catch (e) {}
          await this.$store.dispatch("setDeviceUuid", { uuid: null });
        }
      } catch (error) {
        let status = error?.response?.status;

        // Se risponde con 404 => non ci sono device certificati
        // => possiamo cancellare l'UUID dal browser che oramai è obsoleto
        // => Possiamo anche rimuovere l'eventuale UUID del FSE che abbiamo
        if (status === 404) {
          this.deviceInfoUuid = null;
          try {
            let payload = {
              motivo: "L'api non restituisce dispositivi certificati ",
                endpoint:"/api/v1/cittadini/"+this.taxCode+"/device-certificato",
              uuid: this.deviceUuid,
            };
            let promise = await writeCustomLog(payload);
          } catch (e) {}
          await this.$store.dispatch("setDeviceUuid", { uuid: null });
        }

        // In tutti gli altri casi mostriamo semplicemente il messaggio di errore
        else if (status !== 404) {
          let message =
            "Non stato possibile recuperare le informazioni sul device certificato";
          apiErrorNotifyDialog({ error, message });
        }
      }

      this.isLoadingUserCertifiedDevice = false;
    },
    showMoreOccasionalDialog() {},
  },
};
</script>

<style lang="sass" scoped></style>
