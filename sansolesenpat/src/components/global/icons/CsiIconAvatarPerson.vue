<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <component :is="iconComponent" />
</template>


<script>
  import CsiIconAvatarBoy from "components/global/icons/CsiIconAvatarBoy";
  import CsiIconAvatarGirl from "components/global/icons/CsiIconAvatarGirl";
  import CsiIconAvatarMan from "components/global/icons/CsiIconAvatarMan";
  import CsiIconAvatarWoman from "components/global/icons/CsiIconAvatarWoman";

  export default {
    name: "CsiIconAvatarPerson",
    props: {
      isFemale: {type: Boolean, required: false, default: false},
      isMinor: {type: Boolean, required: false, default: false}
    },
    computed: {
      iconComponent() {
        if (this.isMinor && !this.isFemale) return CsiIconAvatarBoy
        if (this.isMinor && this.isFemale) return CsiIconAvatarGirl
        if (!this.isMinor && this.isFemale) return CsiIconAvatarWoman
        return CsiIconAvatarMan
      },
    }
  }
</script>
