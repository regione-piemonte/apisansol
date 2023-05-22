<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <a class="lms-link text-center"
     @click="showMore">
    <div  :class="classes" v-if="loading">
      <farab-pharmacy-list-item-skeleton />
    </div>
    <p v-else>Mostra altri</p>
  </a>
</template>

<script>
import FarabPharmacyListItemSkeleton from "components/FarabPharmacyListItemSkeleton";
export default {
name: "FarabPharmacyShowMoreItem",
  components: {FarabPharmacyListItemSkeleton},
  props:{
    loading:{type:Boolean, default:false},
    classes:{type:String, default:''}
  },
  methods:{
    showMore(){
      this.$emit('show-more')
    }
  }
}
</script>

<style scoped>

</style>
