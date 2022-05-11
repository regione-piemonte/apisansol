<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-footer v-bind="attrs" v-on="listeners" class="lms-layout-footer">

    <div v-if="showPrivacyLink" class="row  justify-end q-my-xl q-mx-lg">
      <!--      <router-link :to="PRIVACY_POLICY" class="lms-link">-->
      <!--        Informativa privacy-->
      <!--      </router-link>-->

      <a class="lms-link" href="/la-mia-salute/#/pagamenti-sanitari/informativa-privacy" target="_blank">Privacy e condizioni d'uso</a>
    </div>

    <!-- IMMAGINE SOPRA IL FOOTER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="lms-footer-illustration">
      <div class="lms-footer-illustration__waves"
           style="background-image : url('/statics/la-mia-salute/immagini/sfondo-footer.svg')">
        <div class="lms-footer-illustration__banner"></div>
      </div>
    </div>
    <!-- RATING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="rating">
      <div class="lms-layout-footer__rating row justify-center q-col-gutter-x-md">
        <div class="col-auto">
          <q-icon name="chat_bubble_outline" size="md"/>
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
            alt="Regione Piemonte"
            class="lms-layout-footer__logo-regione"
            src="/statics/la-mia-salute/immagini/logo-regione-piemonte.svg"
          />
        </div>

        <div class="col-12 col-md-auto text-center">
          <img
            alt="Fondo europeo di sviluppo regionale"
            class="lms-layout-footer__logo-fesr"
            src="/statics/la-mia-salute/immagini/logo-fesr.svg"
          />
        </div>

        <template v-if="helpContacts || helpFaq">
          <q-space class="gt-sm"/>

          <div class="col-12 col-md-auto column lms-layout-footer__help__links">
            <div class="text-h6 text-bold">
              Hai bisogno di aiuto?
            </div>

            <div class="row justify-center q-mt-sm">
              <template v-if="helpContacts">
                <q-btn
                  :label="helpContactsLabel"
                  flat
                  no-caps
                  @click="$emit('click-help-contacts')"
                />
              </template>

              <template v-if="helpContacts && helpFaq">
                <q-separator color="white" spaced vertical/>
              </template>

              <template v-if="helpFaq">
                <q-btn
                  :label="helpFaqLabel"
                  flat
                  no-caps
                  @click="$emit('click-help-faq')"
                />
              </template>

              <template v-if="helpFaq && helpAssistance">
                <q-separator color="white" spaced vertical/>
              </template>

              <template v-if="helpAssistance">
                <q-btn
                  flat
                  label="Assistenza"
                  no-caps
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
            <img alt="Logo Piemonte Tu" class="responsive" src="/statics/la-mia-salute/immagini/logo-piemonte-tu.svg"
                 style="max-width: 180px;">
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
            alt="Logo CSI"
            class="lms-layout-footer__logo-csi"
            src="/statics/la-mia-salute/immagini/logo-csi.svg"
          />
        </div>


      </div>
      <div class="q-px-sm">
        <q-separator dark/>
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
          class="col-12 col-md-auto pis-footer__external-links q-py-sm"
          target="_blank"
        >Note legali e privacy</a
        >
        <a
          :href="urls.cookiePolicy()"
          class="col-12 col-md-auto pis-footer__external-links q-py-sm"
          target="_blank"
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
    rating: {type: Boolean, required: false, default: false},
    helpAssistance: {type: Boolean, required: false, default: false},
    helpContacts: {type: Boolean, required: false, default: false},
    helpContactsLabel: {type: String, required: false, default: "Contatti"},
    helpFaq: {type: Boolean, required: false, default: false},
    helpFaqLabel: {type: String, required: false, default: "FAQ"},
    policy: {type: Boolean, required: false, default: false},
  },
  data() {
    return {
      urls
    };
  },
  computed: {
    listeners() {
      const {...listeners} = this.$listeners;
      return listeners;
    },
    attrs() {
      const {...attrs} = this.$attrs;
      //if (!("elevated" in attrs)) attrs.elevated = true;
      return attrs;
    },
    isUserLogged() {
      return this.$store.getters['global/isUserLogged']
    },
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    isTest() {
      return process.env.APP_IS_DEV || process.env.APP_IS_TEST
    },
    showPrivacyLink() {
      return !this.$route.meta?.privacy && this.policy
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

.lms-layout-footer__policy-links
  background-color: $blue-10
  color: #FFF
  padding: 8px 16px
  text-align: center

  a
    color: #ffffff
    text-decoration: none

.lms-footer-illustration
  width: 100%
  margin-top: 16px
  margin-bottom: -3px

.lms-footer-illustration__waves
  background-repeat: no-repeat
  background-position: center top
  background-size: auto
  min-height: 400px

.lms-footer-illustration__banner
  background-image: url('../../../public/images/estratto-conto-footer-banner.svg')
  background-repeat: no-repeat
  background-position: center top
  background-size: 1000px 400px
  min-height: 400px
</style>
