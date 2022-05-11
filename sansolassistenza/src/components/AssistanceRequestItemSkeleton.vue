<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
<q-card-section>
  <div class="row items-center ">
    <q-skeleton type="QBadge" class="q-mb-md bg-primary" width="120px" />
    <div class="q-px-md"></div>
    <q-skeleton type="QBadge" class="q-mb-md bg-primary-light" width="100px"/>
  </div>
  <div class="row items-center q-mb-md">
    <q-skeleton type="text" class="col-12 col-sm-auto bg-grey-5"  width="400px" height="25px"  />
  </div>

  <div class="q-px-xl">
    <q-chat-message
      :bg-color="isEvenNumber ? 'chat-blue' : 'chat-pink'"
      size="12"
      :sent="isEvenNumber"
    >
      <template v-slot:avatar>
        <q-icon :style="isEvenNumber ? 'left:16px' : 'right:16px'" size="sm" >
          <q-skeleton type="circle" class="bg-grey-5"  size="24px"/>
        </q-icon>
      </template>

      <div class="q-ma-sm">
        <q-skeleton type="text" class="bg-grey-5" />
        <q-skeleton type="text" class="bg-grey-5" />
        <q-skeleton type="text" class="" width="50%"/>
      </div>
    </q-chat-message>
  </div>

  <div v-if="archive" class="q-mt-md">
    <q-skeleton type="text" width="150px"/>
  </div>
</q-card-section>
</template>

<script>
export default {
  name: "AssistanceRequestItemSkeleton",
  props:{
    index:{type:Number, default:null},
    archive:{type:Boolean, default: false}
  },
  computed:{
    isEvenNumber (){
      return this.index % 2 === 0
    }
  }
}
</script>

<style scoped>

</style>
