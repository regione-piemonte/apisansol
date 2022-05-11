<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="account-notification-preference-list">
    <div class="q-pb-lg">
      <q-banner  class="q-banner--info">
        <div class="text-body1">
          <p>
            Accendi l'icona relativa al canale su cui vuoi ricevere i
            messaggi di notifica. (blu = acceso, grigio = spento) Puoi
            scegliere tra email, sms o push.
          </p>

          <p class="q-mb-none">
            La notifica push è una tipologia di messaggistica istantanea con
            la quale il messaggio perviene al destinatario senza che questo
            debba effettuare un accesso al servizio. Tale modalità è quella
            tipicamente utilizzata da applicazioni mobile.
          </p>
        </div>
      </q-banner>
    </div>
    <template v-if="!isLoading">
      <q-card :flat="flat">
          <q-card-section>
            <q-list dense class="q-mt-md">
              <!-- ITEM HEADER -->
              <!-- Permette di abilitare/disabilitare bulk il canale di notifica su tutti i servizi -->
              <!-- ------------------------------------------------------------------------------------------------------- -->
              <q-item class="q-item-profile">
                <q-item-section></q-item-section>
                <q-item-section side>
                  <div>
                    <div style="display: inline-block">
                      <div class="col-auto column items-center q-px-sm">
                        <q-checkbox
                          v-model="allPush"
                          :disable="supportedPushServices.length <= 0"
                          dense
                          color="primary"
                          class="q-pa-sm"
                        >
                          <q-tooltip v-if="supportedPushServices.length <= 0">
                            Nessun Servizio supporta le notifiche push
                          </q-tooltip>
                        </q-checkbox>
                        <span class="q-caption">
                          Push
                        </span>
                      </div>
                    </div>

                    <div style="display: inline-block">
                      <div class="col-auto column items-center q-px-xs">
                        <q-checkbox
                          v-model="allMails"
                          :disable="supportedMailsServices.length <= 0"
                          dense
                          color="primary"
                          class="q-pa-sm"
                        >
                          <q-tooltip v-if="supportedMailsServices.length <= 0">
                            Nessun Servizio supporta le email
                          </q-tooltip>
                        </q-checkbox>
                        <span class="q-caption">Email</span>
                      </div>
                    </div>

                    <div
                      v-if="supportedSmsServices.length > 0"
                      style="display: inline-block"
                    >
                      <div class="col-auto column items-center q-px-sm">
                        <q-checkbox
                          v-model="allSms"
                          :disable="supportedSmsServices.length <= 0"
                          dense
                          color="primary"
                          class="q-pa-sm"
                        >
                          <q-tooltip v-if="supportedSmsServices.length <= 0">
                            Nessun Servizio supporta gli SMS
                          </q-tooltip>
                        </q-checkbox>
                        <span class="q-caption">SMS</span>
                      </div>
                    </div>
                  </div>
                </q-item-section>
              </q-item>

              <!-- LISTA DEI SERVIZI -->
              <!-- ------------------------------------------------------------------------------------------------------- -->
              <account-notification-preference-list-item
                v-for="service in services"
                :key="service.name"
                v-model="service._enabledChannels"
                :name="getServiceName(service)"
                :disable-push="!isChannelSupported(service, 'push')"
                :disable-email="!isChannelSupported(service, 'email')"
                :disable-sms="!isChannelSupported(service, 'sms')"
                :no-sms="supportedSmsServices.length <= 0"
              />
            </q-list>
          </q-card-section>
        </q-card>
    </template>

    <template v-else>
      <slot name="loading" />
    </template>

    <!-- MODAL TELEFONO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-dialog v-model="isSelectionModalOpen">
      <q-card>
        <q-toolbar>
          <q-toolbar-title>Numero di telefono mancante!</q-toolbar-title>
          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>

        <q-card-section>
          <p class="text-body1">
            <span class="text-weight-bold">Attenzione!</span> <br />
            Per ricevere SMS è necessario inserire un numero di telefono mobile.
          </p>
        </q-card-section>

        <q-card-section>
          <lms-buttons>
            <lms-button
              label="Aggiungi numero di telefono"
              @click="onAddPhoneNumber"
            />
            <lms-button v-close-popup outline label="Annulla" />
          </lms-buttons>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import AccountNotificationPreferenceListItem from "src/components/AccountNotificationPreferenceListItem";
import { PROFILE } from "src/router/routes";
import { extend } from "quasar";
import { getNotifyPreferences, getNotifyServices } from "src/services/api";
import {NAME_SERVICE_MAP} from "src/services/config";
import {equalsIgnoreCase, keyBy} from "src/services/utils";

const CHANNELS = {
  PUSH: "push",
  EMAIL: "email",
  SMS: "sms"
};

export default {
  name: "AccountNotificationPreferenceList",
  components: { AccountNotificationPreferenceListItem },
  props: {
    numberOfPhone: { type: String, required: false, default: null },
    flat: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      services: [],
      isLoading: true,
      isSelectionModalOpen: false,
      theNumberOfPhone: this.numberOfPhone
    };
  },
  computed: {
    appList() {
      return this.$store.getters["getAppList"];
    },
    user() {
      return this.$store.getters["getUser"];
    },
    userContacts() {
      return this.$store.getters["getNotifyContacts"];
    },
    originOfThePage() {
      return this.userContacts && !this.theNumberOfPhone;
    },
    supportedPushServices() {
      return this.services.filter(service =>
        this.isChannelSupported(service, CHANNELS.PUSH)
      );
    },
    enabledPushServices() {
      return this.supportedPushServices.filter(service =>
        this.isChannelEnabled(service, CHANNELS.PUSH)
      );
    },
    disabledPushServices() {
      return this.supportedPushServices.filter(
        service => !this.isChannelEnabled(service, CHANNELS.PUSH)
      );
    },
    supportedMailsServices() {
      return this.services.filter(service =>
        this.isChannelSupported(service, CHANNELS.EMAIL)
      );
    },
    enabledMailsServices() {
      return this.supportedMailsServices.filter(service =>
        this.isChannelEnabled(service, CHANNELS.EMAIL)
      );
    },
    disabledMailsServices() {
      return this.supportedMailsServices.filter(
        service => !this.isChannelEnabled(service, CHANNELS.EMAIL)
      );
    },
    supportedSmsServices() {
      return this.services.filter(service =>
        this.isChannelSupported(service, CHANNELS.SMS)
      );
    },
    enabledSmsServices() {
      return this.supportedSmsServices.filter(service =>
        this.isChannelEnabled(service, CHANNELS.SMS)
      );
    },
    disabledSmsServices() {
      return this.supportedSmsServices.filter(
        service => !this.isChannelEnabled(service, CHANNELS.SMS)
      );
    },
    allPush: {
      get() {
        let supportedLength = this.supportedPushServices.length;
        if (supportedLength <= 0) return false;
        if (this.enabledPushServices.length >= supportedLength) return true;
        if (this.disabledPushServices.length >= supportedLength) return false;
        return null;
      },
      set() {
        if (this.enabledPushServices.length > 0) {
          this.disableAllChannel(this.services, CHANNELS.PUSH);
        } else {
          this.enableAllChannel(this.services, CHANNELS.PUSH);
        }
      }
    },
    allMails: {
      get() {
        let supportedLength = this.supportedMailsServices.length;
        if (supportedLength <= 0) return false;
        if (this.enabledMailsServices.length >= supportedLength) return true;
        if (this.disabledMailsServices.length >= supportedLength) return false;
        return null;
      },
      set() {
        if (this.enabledMailsServices.length > 0) {
          this.disableAllChannel(this.services, CHANNELS.EMAIL);
        } else {
          this.enableAllChannel(this.services, CHANNELS.EMAIL);
        }
      }
    },
    allSms: {
      get() {
        let supportedLength = this.supportedSmsServices.length;
        if (supportedLength <= 0) return false;
        if (this.enabledSmsServices.length >= supportedLength) return true;
        if (this.disabledSmsServices.length >= supportedLength) return false;
        return null;
      },
      set() {
        if (this.enabledSmsServices.length > 0) {
          this.disableAllChannel(this.services, CHANNELS.SMS);
        } else {
          this.enableAllChannel(this.services, CHANNELS.SMS);
        }
      }
    }
  },
  watch: {
    isLoading: {
      immediate: true,
      handler(newValue) {
        this.$emit("loading", newValue);
      }
    },
    services: {
      deep: true,
      immediate: true,
      handler(newValue) {
        let services = extend(true, [], newValue);

        this.services.forEach(service => {
          if (this.originOfThePage) {
            if (
              !this.userContacts?.sms &&
              service._enabledChannels.indexOf("sms") !== -1
            ) {
              this.isSelectionModalOpen = true;
              service._enabledChannels = service._enabledChannels.filter(
                c => c !== "sms"
              );
            }
          } else {
            if (
              !this.theNumberOfPhone &&
              service._enabledChannels.indexOf("sms") !== -1
            ) {
              this.isSelectionModalOpen = true;
              service._enabledChannels = service._enabledChannels.filter(
                c => c !== "sms"
              );
            }
          }

          if (!service._enabledChannels) return;
          service.channels = service._enabledChannels.join(",");
        });

        services = this.services.map(service => {
          service = extend(true, {}, service);
          let { _enabledChannels, _supportedChannels, ...result } = service;
          return result;
        });

        this.$emit("update", services);
      }
    }
  },
  async created() {
    this.isLoading = true;

    let servicesPromise = getNotifyServices();
    let preferencesPromise = getNotifyPreferences(this.user.cf);

    let servicesResponse = await servicesPromise;
    let preferenceResponse = { data: [] };

    try {
      preferenceResponse = await preferencesPromise;
    } catch (error) {
      // Se abbiamo un 404, vuol dire che l'utente non ha ancora dei contatti
      if (!error.response || error.response.status !== 404)
        return Promise.reject(error);
    }

    this.services = servicesResponse.data;
    let preferences = preferenceResponse.data;

    this.isLoading = false;

    let preferenceIndexedByServiceName = keyBy(preferences, p => p.service_name);
    this.services.forEach(service => {
      this.$set(service, '_supportedChannels', service.channels);

      let enabledChannels = [];
      let preference = preferenceIndexedByServiceName[service.name];
      if (preference && typeof preference.channels === 'string') {
        enabledChannels = preference.channels.split(',');
      }

      this.$set(service, '_enabledChannels', enabledChannels);
    });

  },
  methods: {
    onAddPhoneNumber() {
      this.$emit("add-phone-number");
    },
    getApp(code) {
      return this.appList.find(a => a.notifiche_codice === code);
    },
    getServiceName(service) {
      let serviceCode = service.name;

      if (equalsIgnoreCase(serviceCode, "ritiroreferti")) return NAME_SERVICE_MAP.ritiroreferti;
      if (equalsIgnoreCase(serviceCode, "BUONO_CELIACHIA")) return NAME_SERVICE_MAP.BUONO_CELIACHIA;

      let appService = this.getApp(serviceCode);
      // console.log("appService", appService)
      // console.log("serviceCodice", serviceCode)

      if (appService) return appService.descrizione;

      // return service.name;


      // Se non abbiamo trovato il servizio su apisancross => continuiamo a renderizzare la nostr mappa hardcodata
      if (NAME_SERVICE_MAP[service.name]) return NAME_SERVICE_MAP[service.name];
      return service.name;

    },
    isChannelSupported(service, channel) {
      return (
        service._supportedChannels &&
        service._supportedChannels.includes(channel)
      );
    },
    isChannelEnabled(service, channel) {
      return (
        service._enabledChannels && service._enabledChannels.includes(channel)
      );
    },
    enableAllChannel(services, channel) {
      this.services.forEach(service => {
        if (!this.isChannelSupported(service, channel)) return;
        service._enabledChannels = [channel].concat(service._enabledChannels);
      });
    },
    disableAllChannel(services, channel) {
      this.services.forEach(service => {
        if (!this.isChannelSupported(service, channel)) return;
        // service._enabledChannels = without(service._enabledChannels, channel)
        service._enabledChannels = service._enabledChannels.filter(
          c => c !== channel
        );
      });
    }
  }
};
</script>

<style lang="sass"></style>
