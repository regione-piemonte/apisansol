<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div
    class="lms-notification-list-item q-pt-sm q-px-md q-pb-md"
    :class="classes"
    v-on="listeners"
    @click="onClick"
  >
    <!-- Aggiungiamo il div necessario per dare l'effetto "hover" -->
    <template v-if="clickable">
      <div class="q-focus-helper"></div>
    </template>

    <div class="lms-notification-list-item__header row justify-between items-start">
      <div class="col">
        <div class="text-subtitle2 text-weight-bold q-pt-sm q-pb-xs">
          {{ title }}
        </div>
        <template v-if="sender">
          <div>
            <q-badge
              color="info"
              text-color="black"
              class="q-pa-xs q-py-none no-border-radius text-caption"
            >
              {{ sender }}
            </q-badge>
          </div>
        </template>
      </div>
      <template v-if="removable">
        <div class="col-auto">
          <q-btn round flat dense icon="close" @click.stop="onRemove" />
        </div>
      </template>
    </div>

    <div class="lms-notification-list-item__body text-body2">
      <slot />
    </div>

    <template v-if="datetime">
      <div class="lms-notification-list-item__footer text-caption text-italic">
        {{ datetime | datetime }}
      </div>
    </template>

    <!-- DIALOG -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-dialog v-model="isRemoveDialogVisible" persistent>
      <q-card>
        <q-toolbar>
          <q-toolbar-title>
            Rimuovi notifica
          </q-toolbar-title>

          <q-btn v-close-popup flat dense round icon="close"/>
        </q-toolbar>
        <q-card-section>
          Stai per rimuovere la notifica <strong>"{{ title }}"</strong>.
          <br />
          Vuoi proseguire?
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <lms-buttons>
            <lms-button outline v-close-popup color="negative"  @click="onRemoveConfirmed">Sì, rimuovi</lms-button>
            <lms-button outline v-close-popup>No, annulla</lms-button>
          </lms-buttons>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "LmsNotificationListItem",
  props: {
    id: { type: String, required: true },
    title: { type: String, required: true },
    sender: { type: String, required: false, default: null },
    datetime: { type: [String, Date], required: false, default: null },
    read: { type: Boolean, required: false, default: false },
    clickable: { type: Boolean, required: false, default: false },
    removable: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      isRemoveDialogVisible: false
    };
  },
  computed: {
    listeners() {
      const { click, ...listeners } = this.$listeners;
      return listeners;
    },
    classes() {
      let result = [];

      if (this.read) {
        result.push("lms-notification-list-item--read");
      }

      if (this.clickable) {
        result.push("lms-notification-list-item--clickable");
        result.push("cursor-pointer");
        result.push("q-hoverable");
        result.push("q-focusable");
        result.push("q-link");
        result.push("relative-position");
      }

      return result;
    }
  },
  methods: {
    onClick() {
      if (!this.clickable) return;

      let eventName = "click";
      let url = "/la-mia-salute/#/notifiche-utente/" + this.id;

      if (eventName in this.$listeners) return this.$emit(eventName, url);

      window.location.assign(url);
    },
    onRemove() {
      this.isRemoveDialogVisible = true;
    },
    onRemoveConfirmed() {
      this.$emit("remove");
    }
  }
};
</script>

<style lang="sass">
.lms-notification-list-item
  padding: map-get($space-sm, 'y') map-get($space-md, 'x') map-get($space-md, 'y') map-get($space-md, 'x')
  background-color: #E3F2FD

.lms-notification-list-item--read
  background-color: transparent

.lms-notification-list-item__body,
.lms-notification-list-item__footer
  margin-top: map-get($space-sm, 'y')
</style>
