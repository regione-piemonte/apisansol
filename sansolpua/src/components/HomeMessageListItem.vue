<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div
    class="home-message-list-item row items-center q-col-gutter-x-lg q-pa-md"
  >
    <!-- IMMAGINE SINISTRA -->
    <!-- ----------------- -->
    <!--    <div class="col-auto">-->
    <!--      <q-skeleton type="circle" size="50px" animation="none" />-->
    <!--    </div>-->

    <div class="col">
      <!-- PRIMA RIGA -->
      <!-- ---------- -->
      <div class="row items-center q-col-gutter-x-md">
        <div class="col-auto text-caption">
          {{ tagListLabel }}
        </div>

        <q-space />

        <div class="col-auto text-caption">
          {{ datetime | date }}
        </div>

        <!--        <div class="col-auto q-pl-xs">-->
        <!--          <q-icon-->
        <!--            name="img:/statics/la-mia-salute/icone/avatar-ragazzo.svg"-->
        <!--            size="xs"-->
        <!--          />-->
        <!--          <q-icon-->
        <!--            name="img:/statics/la-mia-salute/icone/avatar-ragazza.svg"-->
        <!--            size="xs"-->
        <!--          />-->
        <!--        </div>-->
      </div>

      <!-- TITOLO -->
      <!-- ------ -->
      <div class="q-mt-sm text-subtitle1" :class="{ 'text-bold': !isRead }">
        {{ title | empty }}
      </div>

      <!-- DESCRIZIONE -->
      <!-- ----------- -->
      <div
        class="q-mt-md text-caption ellipsis-3-lines"
        :class="{ 'text-bold': !isRead }"
      >
        {{ body | empty }}
      </div>

      <!-- CALL TO ACTION -->
      <!-- -------------- -->
      <!--      <template v-if="callToAction">-->
      <!--        <div class="q-mt-xs">-->
      <!--          <a :href="callToAction" class="lms-link">-->
      <!--            Vedi-->
      <!--          </a>-->
      <!--        </div>-->
      <!--      </template>-->
    </div>
  </div>
</template>

<script>
import {
  NOTIFY_TAG_COMMUNICATION,
  NOTIFY_TAG_EXPIRE,
  NOTIFY_TAG_MINOR,
  NOTIFY_TAG_PROTECTED
} from "../services/config";

export default {
  name: "HomeMessageListItem",
  props: {
    message: { type: Object, required: false, default: null }
  },
  data() {
    return {};
  },
  computed: {
    appList() {
      return this.$store.getters["getAppList"];
    },
    title() {
      return this.message?.mex?.title ?? "";
    },
    body() {
      return this.message?.mex?.body ?? "";
    },
    isRead() {
      return this.message?.read_at ?? false;
    },
    datetime() {
      return this.message?.timestamp;
    },
    callToAction() {
      return this.message?.mex?.call_to_action;
    },
    senderCode() {
      return this.message?.sender;
    },
    senderApp() {
      return this.appList.find(a => a.notifiche_codice === this.senderCode);
    },
    senderAppName() {
      return this.senderApp?.descrizione;
    },
    tag() {
      return this.message?.tag ?? "";
    },
    tagListLabel() {
      let tags = [];

      if (this.tag.includes(NOTIFY_TAG_COMMUNICATION)) {
        tags.push("Comunicazione");
      }

      if (this.tag.includes(NOTIFY_TAG_EXPIRE)) {
        tags.push("Scadenza");
      }

      if (this.tag.includes(NOTIFY_TAG_MINOR)) {
        tags.push("Figli minori");
      }

      if (this.tag.includes(NOTIFY_TAG_PROTECTED)) {
        tags.push("Tutelati");
      }

      tags.sort();

      return tags.join(", ");
    }
  },
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass"></style>
