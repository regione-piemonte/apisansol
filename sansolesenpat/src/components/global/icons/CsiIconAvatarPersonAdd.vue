<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <component :is="iconComponent" />
</template>


<script>
  import CsiIconAvatarMan from "components/global/icons/CsiIconAvatarManAdd";
  import CsiIconAvatarWoman from "components/global/icons/CsiIconAvatarWomanAdd";

  export default {
    name: "CsiIconAvatarPerson",
    props: {
      isFemale: {type: Boolean, required: false, default: false},
      isMinor: {type: Boolean, required: false, default: false}
    },
    computed: {
      iconComponent() {
        if (this.isFemale) return CsiIconAvatarWoman
        return CsiIconAvatarMan
      },
    }
  }
</script>
