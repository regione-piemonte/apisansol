<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="home-message-list-widget overflow-hidden-y">
    <!-- INTESTAZIONE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="row items-center bg-white q-pb-md" :class="headingClasses">
      <div class="col-auto">
        <div class="text-h5 text-bold relative-position">
          Comunicazioni

          <!--          <template v-if="!isLoading && messageListUnseenCount > 0">-->
          <!--            <q-badge color="pink-7" class="vertical-top">-->
          <!--              {{ messageListUnseenCount }}-->
          <!--            </q-badge>-->
          <!--          </template>-->
        </div>
      </div>

      <q-space />

      <div class="col-auto">
        <a :href="urls.messageList()" class="lms-link" aria-label="Vedi tutte le comunicazioni">
          Vedi tutte
        </a>
      </div>

      <!--      <div>-->
      <!--        <a href="#" class="lms-link">-->
      <!--          Deleganti-->
      <!--        </a>-->
      <!--      </div>-->
    </div>
<!--    MOSTRO LE COMUNICAZIONI SOLO SE NON SIAMO SU SIMON-->
    <template v-if="!isSimon">
    <home-config-message-list-widget />
    </template>

    <q-banner class="q-py-md h-banner h-banner--info">
      <template #avatar>
        <q-icon name="img:info-outline.svg" size="md" />
      </template>

      <div class="text-body1">
        Il Fascicolo Sanitario Elettronico si rifà il look: design accattivante
        e servizi sempre più funzionali per una versione tutta da scoprire.
      </div>

      <div class="text-right">
        <q-btn
          color="primary"
          unelevated
          class="q-mt-md"
          @click="$emit('click-onboarding-fse')"
        >
          Vai alle novità
        </q-btn>
      </div>
    </q-banner>

    <q-separator />

    <!-- PROFILO NON ABILITATO SUL NOTIFICATORE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="!notifyContacts">
      <q-banner class="q-py-md h-banner h-banner--info">
        <template #avatar>
          <q-icon name="img:info-outline.svg" size="md" />
        </template>
        <div class="text-body1">
          Resta aggiornato con le nostre comunicazioni e notifiche. Inserisci i
          tuoi contatti nel profilo personale e scegli in che modo preferisci
          essere contattato, potremo così ricordarti quando si avvicina una
          scadenza o dirti se ci sono novità da consultare.
        </div>

        <div class="text-right">
          <q-btn
            type="a"
            href="/la-mia-salute/profilo-utente/#/"
            color="primary"
            unelevated
            class="q-mt-md"
          >
            Vai al profilo
          </q-btn>
        </div>
      </q-banner>

      <q-separator />
    </template>

    <!-- NOTIFICATORE ATTIVO MA NO EMAIL && NO NUMERO CELLULARE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else-if="!notifyContactEmail && !notifyContactPhone">
      <q-banner class="q-py-md h-banner h-banner--info">
        <template #avatar>
          <q-icon name="img:info-outline.svg" size="md" />
        </template>

        <div class="text-body1">
          Resta aggiornato con le nostre comunicazioni e notifiche. Inserisci i
          tuoi contatti nel profilo personale e scegli in che modo preferisci
          essere contattato, potremo così ricordarti quando si avvicina una
          scadenza o dirti se ci sono novità da consultare.
        </div>
      </q-banner>

      <q-separator />
    </template>

    <!-- NOTIFICATORE ATTIVO, NUMERO CELLULARE MA NO EMAIL -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else-if="!notifyContactEmail">
      <q-banner class="q-py-md h-banner h-banner--info">
        <template #avatar>
          <q-icon name="img:info-outline.svg" size="md" />
        </template>

        <div class="text-body1">
          Non hai ancora inserito un indirizzo email al tuo profilo.
        </div>

        <div class="text-right">
          <q-btn
            type="a"
            :href="urls.notifyContacts()"
            color="primary"
            unelevated
            class="q-mt-md"
          >
            Aggiungi
          </q-btn>
        </div>
      </q-banner>

      <q-separator />
    </template>

    <!-- NOTIFICATORE ATTIVO, EMAIL MA NO CELLULARE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else-if="!notifyContactEmail">
      <q-banner class="q-py-md h-banner h-banner--info">
        <template #avatar>
          <q-icon name="img:info-outline.svg" size="md" />
        </template>

        <div class="text-body1">
          Non hai ancora inserito un numero di cellulare al tuo profilo.
        </div>

        <div class="text-right">
          <q-btn
            type="a"
            :href="urls.notifyContacts()"
            color="primary"
            unelevated
            class="q-mt-md"
          >
            Aggiungi
          </q-btn>
        </div>
      </q-banner>

      <q-separator />
    </template>

    <!-- LISTA MESSAGGI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div>
      <!-- SKELETON CARICAMENTO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-if="isLoading">
        <div v-for="i in 6" :key="i" class="bg-blue-grey-1">
          <home-message-list-item-skeleton />
          <q-separator />
        </div>
      </template>

      <!-- ITEM MESSAGGIO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-else>
        <template v-if="messageList.length <= 0">
          <q-banner class="q-py-md h-banner h-banner--info">
            <div class="text-body1">
              Nessun messaggio disponibile
            </div>
          </q-banner>

          <q-img
            src="../../public/no-messaggi.svg"
            alt="avatar"
            no-default-spinner
            basic
            contain
          />
        </template>

        <template v-if="messageList.length > 0">
          <transition-group
            appear
            :css="false"
            @enter="onEnter"
            tag="div"
            class="bg-blue-grey-1"
          >
            <a
              v-for="(message, index) in messageList"
              :key="message.id"
              class="home-message-list-widget__item-wrapper block lms-link-seamless"
              :class="{ 'bg-blue-1': !message.read_at }"
              :href="urls.messageDetail(message.id)"
            >
              <home-message-list-item :message="message" />

              <template v-if="index < messageList.length - 1">
                <q-separator />
              </template>
            </a>

            <!--            <div key="message-list-show-all" class="q-py-md text-center">-->
            <!--              <a href="#" class="lms-link">-->
            <!--                Vedi tutte-->
            <!--              </a>-->
            <!--            </div>-->
          </transition-group>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import HomeMessageListItem from "./HomeMessageListItem";
import HomeMessageListItemSkeleton from "./HomeMessageListItemSkeleton";

import anime from "animejs/lib/anime.es.js";
import * as urls from "src/services/urls";
import HomeConfigMessageListWidget from "components/HomeConfigMessageListWidget";

export default {
  name: "HomeMessageListWidget",
  components: {
    HomeConfigMessageListWidget,
    HomeMessageListItemSkeleton,
    HomeMessageListItem
  },
  props: {
    headingClasses: { type: String, required: false, default: "" },
    isSimon: { type: Boolean, required: false, default: false },
  },
  data() {
    return {
      urls,
      isLoading: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    notifyContacts() {
      return this.$store.getters["getNotifyContacts"];
    },
    notifyContactEmail() {
      return this.notifyContacts?.email;
    },
    notifyContactPhone() {
      return this.notifyContacts?.sms;
    },
    messageList() {
      return this.$store.getters["getMessageList"];
    },
    messageListUnseen() {
      return this.$store.getters["getMessageListUnseen"];
    },
    messageListUnseenCount() {
      return this.$store.getters["getMessageListUnseenCount"];
    }
  },
  async created() {
    this.isLoading = true;
    let messagesPromise = this.$store.dispatch("loadMessageList");
    let messagesUnseenPromise = this.$store.dispatch("loadMessageListUnseen");

    try {
      await messagesPromise;
    } catch (err) {
      console.error(err);
    }

    try {
      await messagesUnseenPromise;
    } catch (err) {
      console.error(err);
    }

    this.isLoading = false;
  },
  methods: {
    onEnter(el, done) {
      let timeline = anime.timeline({ complete: done });
      timeline.add({
        targets: [".home-message-list-widget__item-wrapper"],
        easing: "easeOutCubic",
        duration: 1000,
        delay: anime.stagger(100),
        translateY: [100, 0],
        opacity: [0, 1]
      });
    }
  }
};
</script>

<style scoped lang="sass"></style>
