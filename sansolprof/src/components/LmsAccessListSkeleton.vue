<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <q-markup-table v-if="$q.screen.gt.md">
      <thead>
      <tr>
        <th class="text-left" v-for="col in columns" :key="col.name">
          {{ col.label }}
        </th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="n in 5" :key="n">
        <td class="text-left" :class="col.classes" v-for="col in columns" :key="col.name">
          <q-skeleton animation="blink" type="text"/>
        </td>
      </tr>
      </tbody>
    </q-markup-table>

    <div class="row items-stretch q-col-gutter-md" v-else>
      <div class="col-12  col-sm-6" v-for="i in 4" :key="i">
        <q-card class="">
          <q-card-section>
            <div v-for="(col, index) in columns" :key="col.name" class="q-my-sm">
              <div class="text-caption text-bold">{{ col.label }}</div>
              <q-skeleton type="text" :width="rowWidth[index]"/>
            </div>
          </q-card-section>

        </q-card>
      </div>


    </div>
  </div>

</template>

<script>
export default {
  name: "LmsAccessListSkeleton",
  props: {
    columns: {type: Array, default: null}
  },
  data() {
    return {
      rowWidth: ['180px', '120px', '100%', '150px', '180px']
    }
  }
}

</script>

<style scoped>

</style>
