<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <component :is="iconComponent" />
</template>


<script>

  import CsiIconAvatarPediatricianMale from "components/global/icons/CsiIconAvatarPediatricianMale";
  import CsiIconAvatarPediatricianFemale from "components/global/icons/CsiIconAvatarPediatricianFemale";

  export default {
    name: "CsiIconAvatarPediatrician",
    props: {
      isFemale: {type: Boolean, required: false, default: false}

    },
    computed: {
      iconComponent() {
        if (!this.isFemale) return CsiIconAvatarPediatricianMale;
        if (this.isFemale) return CsiIconAvatarPediatricianFemale;

        return CsiIconAvatarPediatrician
      },
    }
  }
</script>
