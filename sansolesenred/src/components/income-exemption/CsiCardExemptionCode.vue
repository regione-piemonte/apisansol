<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-card>
    <q-card-title v-if="title">{{title}}</q-card-title>
    <q-card-main>

      <q-field class="q-mb-md">
        <q-select
          :value="value"
          @change="onChange"
          float-label="Codice esenzione"
          :options="exemptionCodeOptions">
        </q-select>
      </q-field>

      <div v-if="selectedOption" class="q-mt-lg">
        <div class="q-body-2">Motivo esenzione</div>
        <div>{{selectedOption.model.motivo}}</div>
      </div>

    </q-card-main>
  </q-card>
</template>

<script>
    import {getExemptionCodes} from "@services/api/income-exemption";
    import CsiIconBase from "components/global/icons/CsiIconBase";
    import CsiIconCalendar from "components/global/icons/CsiIconCalendar";

    export default {
        name: 'CsiCardExemptionCode',
        components: {CsiIconCalendar, CsiIconBase},
        props: {

            value: {required: true},
            title: {type: String, required: false, default: ''},
        },
        data() {
            return {
                exemptionCodes: [],
            }
        },
        computed: {
            exemptionCodeOptions() {
                return this.exemptionCodes
                    .filter(c => c.valido)
                    .map(code => {
                        return {
                            label: `${code.codice}: ${code.descrizione}`,
                            value: code.codice,
                            model: code,
                        };
                    });
            },
            user() {
                return this.$store.getters['global/user']
            },
            selectedOption() {
                return this.exemptionCodeOptions.find(option => option.value === this.value);
            }
        },
        async created() {
            let response = await getExemptionCodes();
            this.exemptionCodes = response.data;
        },
        methods: {
            onChange(newVal) {
                this.$emit('input', newVal);
            }
        },
    }
</script>

<style>
</style>
