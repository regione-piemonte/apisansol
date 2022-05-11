<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>

    <div v-if="!isLoading" class="q-mt-md">

      <div class="q-px-md">
        <q-alert color="info">
          <p>
            Accendi l'icona relativa al canale su cui vuoi ricevere i messaggi di notifica. (blu = acceso, grigio =
            spento)
            Puoi scegliere tra email, sms o push.
          </p>

          <p>
            La notifica push è una tipologia di messaggistica istantanea con la quale il messaggio perviene al
            destinatario senza che questo debba effettuare un accesso al servizio. Tale modalità è quella tipicamente
            utilizzata da applicazioni mobile.
          </p>
        </q-alert>
      </div>


      <q-list no-border class="q-mt-md">

        <!-- ITEM HEADER -->
        <!-- Permette di abilitare/disabilitare bulk il canale di notifica su tutti i servizi -->
        <q-item>
          <q-item-main></q-item-main>
          <q-item-side right>
            <div class="inline column items-center">
              <q-checkbox
                v-model="allPush"
                :disable="supportedPushServices.length <= 0"
                color="primary"
                class="q-pa-sm">
                <q-tooltip v-if="supportedPushServices.length <= 0">
                  Nessun Servizio supporta le notifiche push
                </q-tooltip>
              </q-checkbox>
              <span class="q-caption">
                Push
              </span>
            </div>

            <div class="inline column items-center">
              <q-checkbox
                v-model="allMails"
                :disable="supportedMailsServices.length <= 0"
                color="primary"
                class="q-pa-sm">
                <q-tooltip v-if="supportedMailsServices.length <= 0">
                  Nessun Servizio supporta le email
                </q-tooltip>
              </q-checkbox>
              <span class="q-caption">Email</span>
            </div>

            <div v-if="supportedSmsServices.length > 0" class="inline column items-center">
              <q-checkbox
                v-model="allSms"
                :disable="supportedSmsServices.length <= 0"
                color="primary"
                class="q-pa-sm">
                <q-tooltip v-if="supportedSmsServices.length <= 0">
                  Nessun Servizio supporta gli SMS
                </q-tooltip>
              </q-checkbox>
              <span class="q-caption">SMS</span>
            </div>
          </q-item-side>
        </q-item>


        <!-- LISTA DEI SERVIZI -->
        <q-item v-for="service in services" :key="service.name">
          <q-item-main>{{getServiceName(service) | lowerCase | capitalize}}</q-item-main>
          <q-item-side right v-if="!service._enabledChannels">
            <q-spinner-mat></q-spinner-mat>
          </q-item-side>
          <q-item-side v-else right>
            <q-checkbox
              :disable="!isChannelSupported(service, 'push')"
              v-model="service._enabledChannels"
              val="push"
              color="primary"
              checked-icon="notifications"
              unchecked-icon="notifications_none"
              class="q-pa-sm">
              <q-tooltip v-if="!isChannelSupported(service, 'push')">
                Push non disponibile per questo servizio
              </q-tooltip>
            </q-checkbox>
            <q-checkbox
              :disable="!isChannelSupported(service, 'email')"
              v-model="service._enabledChannels"
              val="email"
              color="primary"
              checked-icon="email"
              unchecked-icon="mdi-email-outline"
              class="q-pa-sm">
              <q-tooltip v-if="!isChannelSupported(service, 'email')">
                Email non disponibile per questo servizio
              </q-tooltip>
            </q-checkbox>
            <q-checkbox
              v-if="supportedSmsServices.length > 0"
              :disable="!isChannelSupported(service, 'sms')"
              v-model="service._enabledChannels"
              val="sms"
              color="primary"
              checked-icon="message"
              unchecked-icon="mdi-message-text-outline"
              class="q-pa-sm">
              <q-tooltip v-if="!isChannelSupported(service, 'sms')">
                SMS non disponibile per questo servizio
              </q-tooltip>
            </q-checkbox>
          </q-item-side>
        </q-item>
      </q-list>
    </div>


    <q-inner-loading :visible="isLoading">
      <q-spinner-mat size="50px" color="primary"></q-spinner-mat>
    </q-inner-loading>

    <q-modal v-model="isSelectionModalOpen" :content-css="{maxWidth: '800px'}">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-toolbar-title>Numero di telefono mancante!</q-toolbar-title>
          <q-btn
            flat
            round
            icon="close"
            v-close-overlay>
          </q-btn>
        </q-toolbar>
        <q-card inline class="cursor-pointer">
          <q-card-title class="text-center">
            <!-- <p>
               Numero di telefono mancante!
             </p>-->
          </q-card-title>
          <q-card-main>
            <p>
              Attenzione! Per ricevere SMS è necessario inserire un numero di telefono mobile.
            </p>
            <div class="row justify-center">
              <csi-button primary class="q-mr-sm" label="Aggiungi numero di telefono"
                          @click="checkThePage"/>
              <csi-button secondary label="Annulla"
                          v-close-overlay/>
            </div>
          </q-card-main>
        </q-card>
      </q-modal-layout>
    </q-modal>

  </div>
</template>


<script>
  import {getServices, getPreferences} from "@services/api/preferences";
  import {deepClone, isNil, keyBy, omit, without} from "@services/global/utils";

  const NAME_MAP = {
    'name': 'label',

  };

  const CHANNELS = {
    PUSH: 'push',
    EMAIL: 'email',
    SMS: 'sms',
  };

  /**
   * @event NotificationPreferencesList#update
   * @property {Array} services - La lista con i servizi appena modificati
   *
   * @description
   * Evento emesso quando qualche proprietà all'interno di uno dei servizi viene modificata.
   */

  /**
   * @vue-data {Object[]} services - Lista dei servizi da cui l'utente può ricevere le notifiche.
   *
   * @vue-computed {Object[]} supportedPushServices - Lista di servizi che supportano il canale di notifiche push
   * @vue-computed {Object[]} enabledPushServices - Lista di servizi abilitati a notificare l'utente tramite push
   * @vue-computed {Object[]} disabledPushServices - Lista di servizi non abilitati a notificare l'utente tramite push
   * @vue-computed {Object[]} supportedMailsServices - Lista di servizi che supportano il canale di notifiche mail
   * @vue-computed {Object[]} enabledMailsServices - Lista di servizi abilitati a notificare l'utente tramite mail
   * @vue-computed {Object[]} disabledMailsServices - Lista di servizi non abilitati a notificare l'utente tramite mail
   * @vue-computed {Object[]} supportedSmsServices - Lista di servizi che supportano il canale di notifiche SMS
   * @vue-computed {Object[]} enabledSmsServices - Lista di servizi abilitati a notificare l'utente tramite SMS
   * @vue-computed {Object[]} disabledSmsServices - Lista di servizi non abilitati a notificare l'utente tramite SMS
   * @vue-computed {Boolean} allPush - In get permette di controllare se tutti i servizi sono abilitati per le push notifications. In set permette di abilitare/disabilitare in modalità bulk le notifiche tramite push
   * @vue-computed {Boolean} allMails - In get permette di controllare se tutti i servizi sono abilitati per le mail notifications. In set permette di abilitare/disabilitare in modalità bulk le notifiche tramite mail
   * @vue-computed {Boolean} allMails - In get permette di controllare se tutti i servizi sono abilitati per le SMS notifications. In set permette di abilitare/disabilitare in modalità bulk le notifiche tramite SMS
   *
   * @emits NotificationPreferencesList#update
   *
   * @todo
   * Richiedere un endpoint che permette di ottenere la lista dei servizi con le preferenze impostate dell'utente
   *
   * @description
   * Componente che gestisce le preferenze di notifica dell'utente.
   * Tramite questo componente l'utente può impostare, servizio per servizio, se vuole ricevere le notifiche ed
   * eventualmente i canali di comunicazione da abilitare.
   *
   * @example
   * <notification-preferences-list @update="onUpdateServices"></notification-preferences-list>
   * @example
   * export default {
   *  methods: {
   *    onUpdateServices(services){
   *      console.debug(services);
   *    }
   *  }
   * }
   */
  export default {
    name: 'CsiNotificationPreferencesList',
    data() {
      return {
        services: [],
        isLoading: true,
        isSelectionModalOpen: false,
        theNumberOfPhone: this.numberOfPhone
      }
    },
    props: ['numberOfPhone'],
    computed: {
      originOfThePage() {
        if (!this.theNumberOfPhone && this.user.contacts)
          return true
        else
          return false
      },
      user() {
        return this.$store.getters['global/user']
      },
      supportedPushServices() {
        return this.services.filter(service => this.isChannelSupported(service, CHANNELS.PUSH));
      },
      enabledPushServices() {
        return this.supportedPushServices.filter(service => this.isChannelEnabled(service, CHANNELS.PUSH));
      },
      disabledPushServices() {
        return this.supportedPushServices.filter(service => !this.isChannelEnabled(service, CHANNELS.PUSH));
      },
      supportedMailsServices() {
        return this.services.filter(service => this.isChannelSupported(service, CHANNELS.EMAIL));
      },
      enabledMailsServices() {
        return this.supportedMailsServices.filter(service => this.isChannelEnabled(service, CHANNELS.EMAIL));
      },
      disabledMailsServices() {
        return this.supportedMailsServices.filter(service => !this.isChannelEnabled(service, CHANNELS.EMAIL));
      },
      supportedSmsServices() {
        return this.services.filter(service => this.isChannelSupported(service, CHANNELS.SMS));
      },
      enabledSmsServices() {
        return this.supportedSmsServices.filter(service => this.isChannelEnabled(service, CHANNELS.SMS));
      },
      disabledSmsServices() {
        return this.supportedSmsServices.filter(service => !this.isChannelEnabled(service, CHANNELS.SMS));
      },
      allPush: {
        get() {
          if (this.supportedPushServices.length <= 0) return false
          if (this.enabledPushServices.length >= this.supportedPushServices.length) return true;
          if (this.disabledPushServices.length >= this.supportedPushServices.length) return false;
          return null;
        },
        set(value) {
          if (this.enabledPushServices.length > 0) {
            this.disableAllChannel(this.services, CHANNELS.PUSH);
          } else {
            this.enableAllChannel(this.services, CHANNELS.PUSH);
          }
        }
      },
      allMails: {
        get() {
          if (this.supportedMailsServices.length <= 0) return false
          if (this.enabledMailsServices.length >= this.supportedMailsServices.length) return true;
          if (this.disabledMailsServices.length >= this.supportedMailsServices.length) return false;
          return null;
        },
        set(value) {
          if (this.enabledMailsServices.length > 0) {
            this.disableAllChannel(this.services, CHANNELS.EMAIL);
          } else {
            this.enableAllChannel(this.services, CHANNELS.EMAIL);
          }
        }
      },
      allSms: {
        get() {
          if (this.supportedSmsServices.length <= 0) return false
          if (this.enabledSmsServices.length >= this.supportedSmsServices.length) return true;
          if (this.disabledSmsServices.length >= this.supportedSmsServices.length) return false;
          return null;
        },
        set(value) {
          if (this.enabledSmsServices.length > 0) {
            this.disableAllChannel(this.services, CHANNELS.SMS);
          } else {
            this.enableAllChannel(this.services, CHANNELS.SMS);
          }
        }
      },
    },
    watch: {
      services: {
        deep: true,
        immediate: true,
        handler(newValue, oldValue) {
          let services = deepClone(newValue);
          this.services.forEach(service => {
            if (this.originOfThePage) {
              if (!this.user.contacts.sms && service._enabledChannels.indexOf("sms") !== (-1)) {
                this.isSelectionModalOpen = true
                service._enabledChannels.splice(service._enabledChannels.indexOf('sms'), 1);
              }
            } else {
              if (!this.theNumberOfPhone && service._enabledChannels.indexOf("sms") !== (-1)) {
                this.isSelectionModalOpen = true
                service._enabledChannels.splice(service._enabledChannels.indexOf('sms'), 1);
              }
            }

            if (isNil(service._enabledChannels)) return;
            service.channels = service._enabledChannels.join(',');
          });
          services = this.services.map(service => {
            return omit(service, ['_enabledChannels', '_supportedChannels']);
          });
          this.$emit('update', services);
        }
      },
    },
    /**
     * @memberof NotificationPreferencesList.methods
     * @method
     * @async
     *
     * @description
     * Ottiene prima la lista dei servizi da UNP, dopodichè, servizo per servizio,
     * ottiene le preferenze e le inietta nel model del servizio.
     */
    async created() {
      let params = {filter: {tags: {match: this.$config.global.unpServicesTag}}};
      this.isLoading = true;

      let servicesPromise = getServices({params: params});

      let preferencesPromise = getPreferences(this.user.cf);

      let servicesResponse = await servicesPromise;
      let preferenceResponse = {data: []};

      try {
        preferenceResponse = await preferencesPromise;
      } catch (error) {
        // Se abbiamo un 404, vuol dire che l'utente non ha ancora dei contatti
        if (!error.response || error.response.status !== 404) return Promise.reject(error);
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
      checkThePage() {
        if (this.originOfThePage)
          this.$router.push(this.$routes.GLOBAL.USER_CONTACTS)
        else
          this.$root.$emit('back', true);
      },
      getServiceName(service) {
        let serviceCode = service.name

        if (serviceCode === "code") return NAME_MAP.ritiroreferti;
        if (serviceCode === "code") return NAME_MAP.BUONO_CELIACHIA;

        let appService = this.$store.getters['global/appService'](serviceCode)
        if (appService) return appService.descrizione

        // Se non abbiamo trovato il servizio su apisancross => continuiamo a renderizzare la nostr mappa hardcodata
        if (NAME_MAP[service.name]) return NAME_MAP[service.name];
        return service.name;
      },
      /**
       * @memberof NotificationPreferencesList.methods
       * @param {Object} service - Il servizio su cui controllare se il canale è supportato
       * @param {String} channel - Il canale per cui controllare il supporto
       * @returns {Boolean} - `true` se il canale di notifica `channel` è supportato dal servizio `service`, `false` altrimenti
       *
       * @description
       * Controlla se per il servizo `service` il canale di notifica `channel` è supportato o meno.
       */
      isChannelSupported(service, channel) {
        return service._supportedChannels && service._supportedChannels.includes(channel);
      },
      /**
       * @memberof NotificationPreferencesList.methods
       * @param {Object} service - Il servizio su cui controllare se il canale è abilitato
       * @param {String} channel - Il canale per cui controllare l'abilitazione
       * @returns {Boolean} - `true` se il canale di notifica `channel` è abilitato sul servizio `service`, `false` altrimenti
       *
       * @description
       * Controlla se per il servizo `service` il canale di ntoifica `channel` è abilitato o meno.
       */
      isChannelEnabled(service, channel) {
        return service._enabledChannels && service._enabledChannels.includes(channel);
      },
      /**
       * @memberof NotificationPreferencesList.methods
       * @param {Object} services - I servizi su cui abilitare il canale di notifica `channel`
       * @param {String} channel - Il canale di notifica da abilitare sui servizi `services`
       *
       * @description
       * Abilita un canale `channel` su più servizi
       */
      enableAllChannel(services, channel) {
        this.services.forEach(service => {
          if (!this.isChannelSupported(service, channel)) return;
          service._enabledChannels = [channel].concat(service._enabledChannels);
        });
      },
      /**
       * @memberof NotificationPreferencesList.methods
       * @param {Object} services - I servizi su cui disabilitare il canale di notifica `channel`
       * @param {String} channel - Il canale di notifica da disabilitare sui servizi `services`
       *
       * @description
       * Disabilita un canale `channel` su più servizi
       */
      disableAllChannel(services, channel) {
        this.services.forEach(service => {
          if (!this.isChannelSupported(service, channel)) return;
          service._enabledChannels = without(service._enabledChannels, channel);
        });
      }
    },
  }
</script>

<style>
</style>
