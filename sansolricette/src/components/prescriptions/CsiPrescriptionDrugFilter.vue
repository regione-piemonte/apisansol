<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>

    <div class="scrolling-wrapper text-center">

      <div class= "q-ma-sm card q-px-xs" >

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


    export default {
        name: 'CsiPrescriptionFilters',
        props: {
            region: {required: false, default: true},
        },
        data() {
            return {
                isLoading: false,
                regionOptions: [
                    {label: 'In Piemonte', value: true},
                    {label: 'Fuori Piemonte', value: false},
                ],
            }
        },
        async created() {

        },
        computed: {

        }
    }
</script>
