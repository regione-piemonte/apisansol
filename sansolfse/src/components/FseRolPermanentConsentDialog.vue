<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    v-bind="attrs"
    v-on="listeners"
    class="fse-rol-permanent-consent-dialog"
  >
    <q-card style="max-width: 800px">
      <q-toolbar>
        <q-toolbar-title>
          Ritira sempre online
        </q-toolbar-title>

        <q-btn v-close-popup round flat dense icon="close"  aria-label="chiudi finestra" />
      </q-toolbar>

      <q-card-section class="q-gutter-y-md">
        <q-banner class="q-mt-md bg-blue-2" rounded>
          <div class="row q-col-gutter-md">
            <div class="col-auto">
              <q-icon name="fas fa-info-circle" size="md" />
            </div>

            <div class="col text-body1">
              <p>
                Hai ritirato questo referto online, <br />
                se vuoi rendere questa scelta valida per tutti i futuri referti,
                <a
                  href="#"
                  class="lms-link"
                  @click.prevent="onPermanentConsent"
                >
                  <span class="text-bold">Clicca qui</span>
                </a>
              </p>
            </div>
          </div>
        </q-banner>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "FseRolPermanentConsentDialog",
  props: {},
  data() {
    return {};
  },
  computed: {
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    user() {
      return this.$store.getters["getUser"];
    }
  },
  created() {},
  methods: {
    onClose() {
      this.$emit("input", false);
    },
    onPermanentConsent() {
      let url = "/la-mia-salute/#/consensi";
      window.location.assign(url);
    }
  }
};
</script>

<style scoped lang="sass"></style>
