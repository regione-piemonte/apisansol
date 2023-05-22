<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="q-my-md">
    <template v-if="isNotDoctorFound">
      <lms-banner type="warning">
        <template v-if="hasDoctor">
          Attenzione! Non puoi utilizzare questo servizio perché il tuo medico di base {{ doctorFullName | empty('') }}
          non ha ancora manifestato la propria adesione
        </template>
        <template v-else>
          Attenzione! Non puoi avviare una conversazione perché al momento non risulti avere un medico di base in
          Piemonte
        </template>
      </lms-banner>
    </template>
    <template v-else-if="isUserNotEnabled">
      <lms-banner type="warning">
        Attenzione! Per utilizzare questo servizio è necessario essere stati abilitati dal proprio medico di base.
      </lms-banner>
    </template>

    <template v-else-if="userBlockInfo && userBlockInfo.motivo_blocco">
      <lms-banner type="warning">
        <template
          v-if="(userBlockInfo.motivo_blocco === BLOCK_REASONS_MAP.DOCTOR_REVOKE) && !this.isValidDoctorAdhesion">
          Attenzione! Non puoi avviare una conversazione perchè il tuo medico {{ doctorFullName }} ha revocato l'adesione al servizio.
          Eventuali messaggi precedenti saranno visibili per tre mesi, poi saranno automaticamente cancellati.
        </template>
        <template v-else-if="userBlockInfo.motivo_blocco === BLOCK_REASONS_MAP.DOCTOR_CHOICE">
          Il tuo medico di base ti ha disabilitato all'uso di questo servizio {{
            userBlockInfo.motivazione_medico ? 'con la seguente motivazione: ' + userBlockInfo.motivazione_medico : ''
          }}
        </template>
      </lms-banner>
    </template>


  </div>
</template>

<script>
import {BLOCK_REASONS_MAP, USER_ENABLING_MAP} from "src/services/config";
import LmsBanner from "components/core/LmsBanner";
import {date} from "quasar";

export default {
  name: "TheGuardMessages",
  components: {LmsBanner},
  data() {
    return {
      BLOCK_REASONS_MAP
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters["getUserInfo"];
    },
    enrollmentCode() {
      return this.$store.getters["getEnrollmentCode"];
    },
    taxCode() {
      return this.$store.getters["getTaxCode"]
    },

    doctorFullName() {
      let lastName = this.userDoctor?.cognome ?? "";
      let firstName = this.userDoctor?.nome ?? "";
      return [firstName, lastName]
        .map(el => el.trim())
        .filter(el => !!el)
        .join(" ");
    },
    isNotDoctorFound() {
      return this.$store.getters["isNotDoctor"];
    },
    hasDoctor() {
      return this.isNotDoctorFound?.noAdhesion
    },
    userDoctor() {
      return this.$store.getters["getUserDoctor"];
    },
    isUserNotEnabled() {
      let enablingInfo = this.$store.getters["getUserEnablingInfo"]
      const notEnabledCodes = [USER_ENABLING_MAP.NONE, USER_ENABLING_MAP.BLOCKED]
      return this.isValidDoctorAdhesion && notEnabledCodes.includes(enablingInfo)
    },
    userBlockInfo() {
      return this.$store.getters["getUserBlockInfo"];
    },

    isValidDoctorAdhesion() {

      if (!this.userDoctor) return false

      let startDate = this.userDoctor?.data_inizio_adesione
      let endDate = this.userDoctor?.data_fine_adesione
      let now = new Date()
      let isValidStartDate = date.getDateDiff(startDate, now, 'days') <= 0
      let isValidEndDate = date.getDateDiff(endDate, now, 'days') > 0 || !endDate

      return isValidStartDate && isValidEndDate
    }


  },
}
</script>

<style scoped>

</style>
