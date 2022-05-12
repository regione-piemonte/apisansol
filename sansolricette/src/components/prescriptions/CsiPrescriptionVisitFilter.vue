<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>

    <div class=" scrolling-wrapper text-center ">
      <div  class="q-ma-sm q-px-xs card">
        <q-field>
          <q-select
            hide-underline
            prefix	="Periodo: &nbsp;"
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
            prefix ="Stato ricette: &nbsp; "
            :value="status"
            :options="statusOptions"
            @change="$emit('status-change', $event)"
            >
          </q-select>
        </q-field>

      </div>

      <div  class=" q-ma-sm q-px-xs card">

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

    import {getPrescriptionStatuss} from "@services/api/prescriptions";

    export default {
        name: 'CsiPrescriptionFilters',
        props: {
            period: {required: false, default: null},
            status: {required: false, default: null},
            region: {required: false, default: true},
        },
        data() {
            return {
                isLoading: false,
                statuss: [],
                statusDefault: {value: "3", label: "Prescritto" },

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
            console.log(this.statusOptions)
            this.isLoading = true

            try {
                let responseStatus = await getPrescriptionStatuss();
                this.statuss = responseStatus.data
                console.log(this.statuss[0])

            } catch (e) {

            }
            this.isLoading = false
        },
        computed: {
            statusOptions() {
                return this.statuss.map(s => {
                    return {label: s.nome, value: s.codice}
                })
            }
        }
    }
</script>
