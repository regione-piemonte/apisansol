<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="lms-the-guard-bootstrap">
    <template v-if="!isLoading">
      <slot />
    </template>

    <lms-inner-loading :showing="isLoading">
      <lms-app-bootstrap-spinner />
    </lms-inner-loading>
  </div>
</template>

<script>
import {
  getConfig,
  getUser,
  getNotifyContacts,
  getDelegatorList,
  // getEnrollmentInfo,
  getUserInfo, getMessageList
} from "src/services/api";
import LmsAppBootstrapSpinner from "src/components/core/LmsAppBootstrapSpinner";

export default {
  name: "TheGuardBootstrap",
  components: { LmsAppBootstrapSpinner },
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    }
  },
  async created() {
    this.isLoading = true;
    let configPromise = getConfig();
    let userPromise = getUser();
    let messagesList = getMessageList({timeout:10000});

    // Prima di tutto carichiamo la configurazione generale di "La mia salute"
    // conterrà informazioni su tutte le applicazioni che compongono il portale, compresa questa che stiamo sviluppando
    // e conterrà informazioni relative a Firebase per l'integrazione delle notifiche push
    try {
      let { data: config } = await configPromise;
      this.$store.dispatch("setConfig", { config });
    } catch (e) {
      console.error(e);
    }


    try{
      let messagesResponse = await messagesList;
      let messageList = messagesResponse?.data?.results ?? []
      this.$store.dispatch("setAppMessages",  messageList );
    }catch (e) {
      console.error(e);
    }

    try {
      // Poi carichiamo le informazioni dell'utente
      // Questo passaggio ci permette di sapere se l'utente è loggato o meno.
      // Se le API rispondono con un errore => l'utente non è loggato
      let { data: user } = await userPromise;
      this.$store.dispatch("setUser", { user });

      // Solo se l'utente è loggato carichiamo
      //  1. I contatti impostati sul notificatore
      //     Se questa chiamata fallisce significa che l'utente non ha
      //     ancora attivato il profilo del notificatore e quindi non può
      //     ricevere SMS, MAIL e Push
      //
      //  2. Informazioni più dettagliate sull'utente
      //     Se questa chiamata fallisce significa che l'utente non è un assistito piemontese
      //     e quindi alcune funzionalità potrebbero essere limitate
      //
      //  3. Informazioni relative all'apertura del FSE
      let taxCode = user.cf;
      let contactsPromise = getNotifyContacts(taxCode);
      let userInfoPromise = getUserInfo(taxCode);
      // let userEnrollmentInfoPromise = getEnrollmentInfo(taxCode);
      let delegatorListPromise = null;

      // Solo se l'applicazione su cui stiamo lavorando è segnata come "delegabile"
      // carichiamo l'elenco dei deleganti per permettere all'utente di operare
      // per conto di un suo delegante
      if (this.workingApp?.delegabile) {
        delegatorListPromise = getDelegatorList(taxCode);
      }

      try {
        let { data: contacts } = await contactsPromise;
        this.$store.dispatch("setNotifyContacts", { contacts });
      } catch (e) {
        console.error(e);
      }

      try {
        let { data: userInfo } = await userInfoPromise;
        this.$store.dispatch("setUserInfo", { userInfo });
      } catch (error) {
        console.error(error);
        this.$store.dispatch("setUserInfoError", { error });
      }

      // try {
      //   let { data: enrollmentInfo } = await userEnrollmentInfoPromise;
      //   this.$store.dispatch("setEnrollmentInfo", { enrollmentInfo });
      // } catch (e) {
      //   console.error(e);
      // }

      if (delegatorListPromise) {
        try {
          let { data: delegatorList } = await delegatorListPromise;
          this.$store.dispatch("setDelegatorList", { delegatorList });
        } catch (e) {
          console.error(e);
        }
      }
    } catch (e) {
      console.error(e);
    }

    this.isLoading = false;
  }
};
</script>

<style scoped></style>
