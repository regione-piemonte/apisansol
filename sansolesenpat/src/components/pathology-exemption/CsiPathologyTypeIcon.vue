<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <component :is="icon" />
</template>


<script>
  import CsiIconDisability from 'components/global/icons/CsiIconDisability'
  import CsiIconVirus from 'components/global/icons/CsiIconVirus'
  import CsiIconDna from 'components/global/icons/CsiIconDna'

  const ICON_MAP = {
    'IN': CsiIconDisability,
    'MC': CsiIconVirus,
    'MR': CsiIconDna,
  }

  export default {
    name: 'CsiPathologyTypeIcon',
    components: {},
    props: {
      code: {type: String, required: false, default: ''}
    },
    data() {
      return {}
    },
    computed: {
      icon() {
        return ICON_MAP[this.code] || ICON_MAP.MR
      }
    },
    created() {
    },
    methods: {},
  }
</script>


<style scoped lang="stylus"></style>
