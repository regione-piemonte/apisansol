<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <component :is="iconComponent" />
</template>


<script>

  import CsiIconAvatarDoctorMale from "components/global/icons/CsiIconAvatarDoctorMale";
  import CsiIconAvatarDoctorFemale from "components/global/icons/CsiIconAvatarDoctorFemale";

  export default {
    name: "CsiIconAvatarDoctor",
    props: {
      isFemale: {type: Boolean, required: false, default: false}

    },
    computed: {
      iconComponent() {
        if (!this.isFemale) return CsiIconAvatarDoctorMale
        if (this.isFemale) return CsiIconAvatarDoctorFemale

        return CsiIconAvatarDoctor
      },
    }
  }
</script>
