<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>

    <div  class=" scrolling-wrapper text-center">
      <div  class=" q-ma-sm q-px-xs card">
        <q-field>

          <q-select
            hide-underline
            prefix="Periodo:  &nbsp;"
            :value="period"
            :options="timeOptions"
            @change="$emit('period-change', $event)"
            >
          </q-select>


        </q-field>
      </div>
      <div  class=" q-ma-sm q-px-xs card">
        <q-field>
          <q-select
            hide-underline
            prefix="Tipologia:  &nbsp;"
            :value="typology"
            :options="typologyOptions"
            @change="$emit('typology-change', $event)"
            >
          </q-select>
        </q-field>
      </div>
      <div  class=" q-ma-sm q-px-xs card">
        <q-field>
          <q-select
            hide-underline
            prefix="Stato:  &nbsp;"
            :value="status"
            :options="statusOptions"
            @change="$emit('status-change', $event)"
            >
          </q-select>
        </q-field>
      </div>

      <div class=" q-ma-sm q-px-xs card">

        <q-field>
          <q-select
            hide-underline
            prefix ="Prescritto: &nbsp; "
            :value="region"
            :options="regionOptions"
            @change="$emit('region-change', $event)"
          >
          </q-select>
        </q-field>

      </div>
    </div>
</template>


<script>
    import {getPrescriptionStatuss, getPrescriptionTypes} from "@services/api/prescriptions";

    export default {
        name: 'CsiPrescriptionFilters',
        props: {
            period: {required: false, default: null},
            typology: {required: false, default: null},
            status: {required: false, default: null},
            region: {required: false, default: true},
        },
        data(){
            return {
                isLoading: false,
                typologies: [],
                statuss: [],
                timeOptions: [
                    {label: '3 Mesi', value: 3},
                    {label: '6 Mesi', value: 6},
                    {label: '12 Mesi', value: 12},
                    {label: '24 Mesi', value: 24},
                ],

                regionOptions: [
                    {label: 'In Piemonte', value: true},
                    {label: 'Fuori Piemonte', value: false},
                ],
            }
        },
        async created() {
            this.isLoading = true



            let statussPromise = getPrescriptionStatuss()
            let typesPromise = getPrescriptionTypes()


            try {
                let responseStatus = await statussPromise;
                this.statuss = responseStatus.data
            } catch (e) {

            }

            try {
                let responseTypes = await typesPromise;
                this.typologies = responseTypes.data
                console.log(this.typologies)
            } catch (e) {

            }

            this.isLoading = false
        },
        computed: {
            typologyOptions() {
                return this.typologies.map(t => {
                    return {label: t.nome, value: t.codice}
                })
            },
            statusOptions() {
                return this.statuss.map(s => {
                    return {label: s.nome, value: s.codice}
                })
            }
        }
    }
</script>
