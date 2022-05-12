<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>

    <div class="row items-center justify-center full-width">
      <div  class="q-ma-sm q-px-xs filter-card col-12 col-md-auto">
        <q-field>
          <q-select
            hide-underline
            prefix	="Periodo: &nbsp;"
            :value="period"
            :options="timeOptions"
            @input="$emit('period-change', $event)"
          >
          </q-select>
        </q-field>
      </div>
      <div  class=" q-ma-sm q-px-xs filter-card col-12 col-md-auto">
        <q-field>
          <q-select
            clearable
            hide-underline
            prefix ="Tipologia: &nbsp;"
            v-model="type"
            :options="typeOptions"
            @input="$emit('type-change', $event)"
            >
          </q-select>
        </q-field>
      </div>
    </div>
</template>


<script>

    export default {
        name: 'CsiPrescriptionArchiveFilter',
        props: {
            period:{required:false, default: null},
            typeList: {required: false, default: []},
        },
        data() {
            return {
                isLoading: false,
                type:null,
                timeOptions: [
                    {label: '3 Mesi', value: 3},
                    {label: '6 Mesi', value: 6},
                    {label: '12 Mesi', value: 12},
                    {label: '24 Mesi', value: 24},
                ],
            }
        },
        async created() {

        },
        computed: {
          typeOptions() {
                return this.typeList.map(type => {
                    return {label: type.descrizione, value: type.codice}
                })
            }
        }
    }
</script>
<style lang="stylus">
.filter-card
  display: inline-block
  border: #979797
  border-style: solid
  border-width: thin
  border-radius: 3px
  font-size: 14px
</style>
