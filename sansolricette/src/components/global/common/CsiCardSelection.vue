<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style>
  .csi-policy-link {
    cursor: pointer;
    text-decoration: underline;
  }

</style>


<template>
  <q-card :inline="inline" class="bg-secondary text-white full-height" @click.native="$emit('go')">

    <q-card-title class="text-center">
      <slot name="header">
        <slot name="header-icon">
          <q-icon v-if="headerIcon" :name="headerIcon" size="56px"></q-icon>
        </slot>
        <slot name="title">
          <p v-if="title">{{title}}</p>
        </slot>
      </slot>
    </q-card-title>

    <q-card-main class="text-center">
      <slot></slot>

      <div v-if="policy" class="q-mt-lg q-caption">
        <a @click="isPolicyModalOpen = true" class=csi-policy-link>
          Scopri di più
        </a>
      </div>
    </q-card-main>

    <!--<q-card-actions align="end">-->
      <!--<slot name="actions">-->
        <!--<q-btn @click="$emit('go')" flat color="white">Vai</q-btn>-->
      <!--</slot>-->
    <!--</q-card-actions>-->


    <csi-modal-policy
      v-model="isPolicyModalOpen"
      :policy="policy"
      minimized>
    </csi-modal-policy>

  </q-card>
</template>

<script>
  import CsiModalPolicy from "components/global/common/CsiModalPolicy";

  export default {
    name: 'CsiCardSelection',
    components: {CsiModalPolicy},
    props: {
      inline: {type: Boolean, required: false, default: true},
      headerIcon: {type: String, required: false, default: ''},
      title: {type: String, required: false, default: ''},
      policy: {type: String, required: false, default: ''},
    },
    data() {
      return {
        isPolicyModalOpen: false,
      }
    }
  }
</script>


