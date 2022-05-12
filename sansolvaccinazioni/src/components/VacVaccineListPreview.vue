<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="vac-vaccine-list-preview">
    <template v-if="vaccineFirst">
        <span class="text-bold">
          {{ vaccineFirst.descrizione | capitalCase }}
        </span>
        <template v-if="vaccineFirst.dose">
         <span>( Dose {{ vaccineFirst.dose }} )</span>
        </template>
        <template v-if="vaccineListLast.length > 0">
          <a class="lms-link cursor-pointer q-ml-xs">
              <template v-if="vaccineListLast.length === 1">
                e un'altro vaccino
              </template>
              <template v-else>
                e altri {{ vaccineListLast.length }} vaccini
              </template>

              <q-menu fit>
                <q-list separator>
                  <q-item v-for="vaccine in vaccineListLast" :key="vaccine.codice">
                    <q-item-section>
                      <q-item-label>
                    <span class="">
                      {{ vaccine.descrizione | capitalCase }}
                    </span>
                        <template v-if="vaccine.dose">
                          ( Dose {{ vaccine.dose }} )
                        </template>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </a>
        </template>
    </template>
  </div>
</template>

<script>
export default {
  name: "VacVaccineListPreview",
  props: {
    vaccineList: { type: Array, required: false, default: () => [] }
  },
  data() {
    return {};
  },
  computed: {
    vaccineFirst() {
      return this.vaccineList[0] ?? null;
    },
    vaccineListLast() {
      return this.vaccineList.slice(1);
    }
  },
  created() {},
  methods: {}
};
</script>

<style lang="sass"></style>
