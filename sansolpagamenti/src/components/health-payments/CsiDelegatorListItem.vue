<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <q-item>
    <q-item-side>
      <csi-icon-base class="csi-svg-icon--lg">
        <csi-icon-avatar-person :is-female="isFemale" />
      </csi-icon-base>
    </q-item-side>
    <q-item-main class="text-bold">
      <q-item-tile label>{{delegatorFullName}}</q-item-tile>
      <q-item-tile sublabel>{{delegator.codice_fiscale_delega}}</q-item-tile>
    </q-item-main>
  </q-item>
</template>


<script>

  import CsiIconBase from "components/global/icons/CsiIconBase";
  import CsiIconAvatarPerson from "components/global/icons/CsiIconAvatarPerson";
  export default {
    name: 'CsiDelegatorListItem',
    components: {CsiIconAvatarPerson, CsiIconBase},
    props: {
      delegator: {type: Object, required: true}
    },
    data () {
      return {}
    },
    computed: {
      delegatorFullName() {
        return `${this.delegator.nome_delega} ${this.delegator.cognome_delega}`;
      },
      isFemale(){
        return this.delegator.sesso_delega === 'F'
      }
    }
  }
</script>

