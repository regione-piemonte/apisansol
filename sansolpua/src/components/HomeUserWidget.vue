<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
 <div class="home-user-widget row q-pa-md">
      <div class="col-auto q-pr-md">
        <q-img :src="avatarSrc" alt="avatar" width="60px" no-default-spinner />
      </div>

      <div class="home-user-widget__main col self-center">
        <div class="text-h5 text-bold">
          {{ userFullName }}
        </div>

        <div class="q-mt-sm q-gutter-x-md">
          <a :href="URLS.PROFILE" class="lms-link">Profilo</a>
          <a :href="URLS.CONSENT" class="lms-link">Consensi</a>
        </div>

        <!-- INFO FSE + AVATAR DESKTOP -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <!--      <div class="q-mt-sm q-gutter-x-md row">-->
        <!--        <div class="col">-->
        <!--          <div class="text-body1 text-bold">-->
        <!--            Fascicolo sanitario-->
        <!--          </div>-->

        <!--          &lt;!&ndash; SKELETON CARICAMENTO &ndash;&gt;-->
        <!--          &lt;!&ndash; &#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; &ndash;&gt;-->
        <!--          <template v-if="isLoading">-->
        <!--            <q-skeleton type="text" width="50px" />-->
        <!--            <q-skeleton type="text" width="200px" />-->
        <!--          </template>-->

        <!--          &lt;!&ndash; INFO FSE &ndash;&gt;-->
        <!--          &lt;!&ndash; &#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; &ndash;&gt;-->
        <!--          <template v-else>-->
        <!--            <template v-if="consent">-->
        <!--              <div class="text-bold text-green">Aperto</div>-->
        <!--            </template>-->
        <!--            <template v-else>-->
        <!--              <div class="text-bold text-negative">Chiuso</div>-->
        <!--            </template>-->

        <!--            <template v-if="consent && consent.consenso_consultazione">-->
        <!--              <div class="text-body2">Visibile agli operatori finanziari</div>-->
        <!--            </template>-->
        <!--          </template>-->
        <!--        </div>-->
        <!--      </div>-->
      </div>
    </div>

</template>

<script>
import { getConsent } from "../services/api";
import { getProfile } from "../services/business-logic";

const URLS = {
  PROFILE: "/la-mia-salute/profilo-utente/#/",
  DELEGATION: "/la-mia-salute/deleghe/#/",
  CONSENT: "/la-mia-salute/#/consensi"
};

export default {
  name: "HomeUserWidget",
  props: {},
  data() {
    return {
      URLS,
      isLoading: false,
      consent: null
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    userInfo() {
      return this.$store.getters["getUserInfo"];
    },
    userFullName() {
      let firstName = this.user?.nome ?? "";
      let lastName = this.user?.cognome ?? "";
      return [firstName, lastName]
        .filter(el => !!el)
        .map(el => el.trim())
        .join(" ");
    },
    avatarSrc() {
      let gender = this.userInfo?.info_anag?.dati_primari?.sesso;
      let birthDate = this.userInfo?.info_anag?.dati_primari?.data_nascita;

      let profile = getProfile({ gender, birthDate });
      profile = profile.toLowerCase();

      return `avatar-profilo-${profile}.svg`;
    }
  },
  async created() {
    // this.isLoading = true;
    //
    // try {
    //   let taxCode = this.user.cf;
    //   let { data } = await getConsent(taxCode);
    //   this.consent = data;
    // } catch (err) {
    //   console.error(err);
    // }
    //
    // this.isLoading = false;
  },
  methods: {}
};
</script>

<style scoped lang="sass">
.home-user-widget
  .h-avatar--circle
    border: 2px solid $secondary
    border-radius: 50%

@media(min-width: $breakpoint-lg-min)
  .home-user-widget
    padding: 0

  .home-user-widget__main
    padding: 0

//   .h-avatar--circle > img
//     width: 400%
//     height: 400%
//     transform: translateY(40%)
</style>
