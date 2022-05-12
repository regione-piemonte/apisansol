<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-chip v-bind="$attrs">
    <strong>
<!--      <span v-if="count === 0">Non hai ricette prescritte fuori Piemonte</span>-->
      <span v-if="count === 1">Trovata 1 ricetta prescritta fuori Piemonte</span>
      <span v-else>Trovate {{count}} ricette prescritte fuori Piemonte</span>
    </strong>
  </q-chip>
</template>


<script>
    export default {
        name: 'CsiPrescriptionsCountBadge',
        components: {},
        inheritAttrs: false,
        props: {
            count: {type: Number, required: true}
        },
        data() {
            return {}
        },
        computed: {},
        created() {
        },
        methods: {},
    }
</script>


<style scoped lang="stylus"></style>
