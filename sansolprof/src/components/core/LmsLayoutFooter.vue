<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-footer v-bind="attrs" v-on="listeners" class="lms-layout-footer">
    <!-- RATING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="rating">
      <div class="lms-layout-footer__rating row justify-center q-col-gutter-x-md">
        <div class="col-auto">
          <q-icon name="chat_bubble_outline" size="md" />
        </div>

        <div class="col-auto cursor-pointer" @click="$emit('click-rating')">
          <div class="text-h6 text-bold" style="line-height: 1">
            Valuta questo servizio
          </div>
          <div class="text-body1 q-mt-xs">
            Aiutaci a migliorare
          </div>
        </div>
      </div>
    </template>

    <!-- HELP -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="lms-layout-footer__help">
      <div class="row q-col-gutter-xl">
        <div class="col-12 col-md-auto text-center">
          <img
            src="/statics/la-mia-salute/immagini/logo-regione-piemonte.svg"
            alt="Regione Piemonte"
            class="lms-layout-footer__logo-regione"
          />
        </div>

        <div class="col-12 col-md-auto text-center">
          <img
            src="/statics/la-mia-salute/immagini/logo-fesr.svg"
            alt="Fondo europeo di sviluppo regionale"
            class="lms-layout-footer__logo-fesr"
          />
        </div>

        <template v-if="helpContacts || helpFaq">
          <q-space class="gt-sm" />

          <div class="col-12 col-md-auto column lms-layout-footer__help__links">
            <div class="text-h6 text-bold">
              Hai bisogno di aiuto?
            </div>

            <div class="row justify-center q-mt-sm">
              <template v-if="helpContacts">
                <q-btn
                  flat
                  no-caps
                  :label="helpContactsLabel"
                  @click="$emit('click-help-contacts')"
                />
              </template>

              <template v-if="helpContacts && helpFaq">
                <q-separator vertical spaced color="white" />
              </template>

              <template v-if="helpFaq">
                <q-btn
                  flat
                  no-caps
                  :label="helpFaqLabel"
                  @click="$emit('click-help-faq')"
                />
              </template>

              <template v-if="helpFaq && helpAssistance">
                <q-separator vertical spaced color="white" />
              </template>

              <template v-if="helpAssistance">
                <q-btn
                  flat
                  no-caps
                  label="Assistenza"
                  @click="$emit('click-help-assistance')"
                />
              </template>

            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- LINKS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="bg-blue-10 q-px-sm">
      <div
        class="lms-layout-footer__links row justify-between items-center q-col-gutter-y-xl no-margin"
      >
        <div class="col-12 col-sm-auto">
          <a :href="urls.urlPiemonteTu()">
            <img src="/statics/la-mia-salute/immagini/logo-piemonte-tu.svg" alt="Logo Piemonte Tu" class="responsive" style="max-width: 180px;">
          </a>
          <!--        <div class="text-h6 text-bold">-->
          <!--          Sistemapiemonte-->
          <!--        </div>-->
          <!--        <div class="text-caption">-->
          <!--          Un servizio a cura della regione Piemonte-->
          <!--        </div>-->
          <!--        <div class="text-caption">-->
          <!--          P.Iva 02843860012 - CF 80087670016-->
          <!--        </div>-->
        </div>

        <div class="col-12 col-sm-auto">
          <img
            src="/statics/la-mia-salute/immagini/logo-csi.svg"
            alt="Logo CSI"
            class="lms-layout-footer__logo-csi"
          />
        </div>


      </div>
      <div class="q-px-sm">
        <q-separator dark  />
      </div>
      <div
        class="lms-layout-footer__policy-links row items-center q-col-gutter-x-xl">
        <!--            <a-->
        <!--              href="#"-->
        <!--              class="col-12 col-md-auto pis-footer__external-links q-py-sm"-->
        <!--              >Accessibilità</a-->
        <!--            >-->
        <a
          :href="urls.privacyPolicy()"
          target="_blank"
          class="col-12 col-md-auto pis-footer__external-links q-py-sm"
        >Note legali e privacy</a
        >
        <a
          :href="urls.cookiePolicy()"
          target="_blank"
          class="col-12 col-md-auto pis-footer__external-links q-py-sm"
        >Cookie policy</a
        >
      </div>
    </div>
  </q-footer>
</template>

<script>
import * as urls from "src/services/urls";
export default {
  name: "LmsLayoutFooter",
  inheritAttrs: false,
  props: {
    rating: { type: Boolean, required: false, default: false },
    helpContacts: { type: Boolean, required: false, default: false },
    helpContactsLabel: { type: String, required: false, default: "Contatti" },
    helpFaq: { type: Boolean, required: false, default: false },
    helpFaqLabel: { type: String, required: false, default: "FAQ" }
  },
  data() {
    return {urls};
  },
  computed: {
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      //if (!("elevated" in attrs)) attrs.elevated = true;
      return attrs;
    },
    isUserLogged() {
      return this.$store.getters['global/isUserLogged']
    },
    urlPiemonteTu() {
      return this.isUserLogged
        ? 'https://www.piemontetu.it/api/auth/login?redirect=true'
        : 'https://www.piemontetu.it/';
    },
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },

    helpAssistance(){
      return this.workingApp?.albero_aiuti_visibile
    }
  }
};
</script>

<style lang="sass">
  .lms-layout-footer
    background: transparent
  .lms-layout-footer__rating
    background-color: $primary
    color: #FFF
    padding: 32px 16px

  .lms-layout-footer__help
    padding: 32px 16px
    background-color: $primary

  .lms-layout-footer__links
    background-color: $blue-10
    color: #FFF
    padding: 0 16px 32px 16px
    text-align: center

  .lms-layout-footer__policy-links
    background-color: $blue-10
    color: #FFF
    padding: 8px 16px
    text-align: center
    a
      color: #ffffff
      text-decoration: none

  .lms-layout-footer__logo-regione
    width: 100%
    max-width: 160px
    height: auto

  .lms-layout-footer__logo-csi
    max-width: 180px
    height: auto

  .lms-layout-footer__logo-fesr
    width: 100%
    max-width: 280px
    height: auto

  .lms-layout-footer__help__links
    color: #FFFFFF
    text-align: center
</style>
