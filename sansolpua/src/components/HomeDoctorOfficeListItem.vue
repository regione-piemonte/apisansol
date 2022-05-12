<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-expansion-item
    v-bind="attrs"
    v-on="listeners"
    class="home-doctor-office-list-item"
  >
    <template v-slot:header>
      <q-item-section side>
        <q-icon name="img:/statics/la-mia-salute/icone/ospedale.svg" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          {{ address }}
        </q-item-label>
      </q-item-section>
    </template>

    <q-card class="bg-grey-2">
      <q-card-section>
        <!-- TELEFONO -->
        <!-- ----------------------------------------------------------------------------------------------------------- -->
        <template v-if="phone">
          <q-item dense class="q-px-none home-doctor-office-list-item__phone">
            <q-item-section side>
              <q-icon name="phone" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <a class="lms-link cursor-pointer" :href="`tel:${phone}`">
                  {{ phone }}
                </a>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <!-- EMAIL -->
        <!-- ----------------------------------------------------------------------------------------------------------- -->
        <template v-if="email">
          <q-item dense class="q-px-none home-doctor-office-list-item__mail">
            <q-item-section side>
              <q-icon name="mail" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <a class="lms-link cursor-pointer" :href="`mailto:${email}`">
                  {{ email }}
                </a>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <!-- LISTA ORARI -->
        <!-- ----------------------------------------------------------------------------------------------------------- -->
        <template v-if="timeList.length > 0">
          <q-item
            dense
            class="q-mt-lg q-px-none home-doctor-office-list-item__mail"
          >
            <q-item-section side>
              <q-icon name="schedule" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                Orari di ricevimento
              </q-item-label>
            </q-item-section>
          </q-item>

          <div id="orari" class="q-py-sm">
            <div class="q-gutter-y-xs">
              <div
                v-for="(time, index) in timeList"
                :key="index"
                class="row q-col-gutter-x-md"
              >
                <template v-if="time.intervalli.length > 0">
                  <div
                    class="col-auto text-body1 text-bold"
                    style="width: 40px"
                  >
                    {{ time.nome | substring(0, 3) }}.
                  </div>
                  <div class="col">
                    <home-doctor-time-list-item
                      :time="time"
                      class="text-body1"
                    />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>

        <!-- NOTE AMBULATORIO -->
        <!-- ----------------------------------------------------------------------------------------------------------- -->
        <template v-if="notes">
          <div id="note" class="q-caption">Note: {{ notes }}</div>
        </template>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
import HomeDoctorTimeListItem from "./HomeDoctorTimeListItem";

export default {
  name: "HomeDoctorOfficeListItem",
  inheritAttrs: false,
  components: { HomeDoctorTimeListItem },
  props: {
    office: { type: Object, required: false, default: null }
  },
  data() {
    return {};
  },
  computed: {
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    address() {
      let address = this.office?.indirizzo;
      let city = this.office?.comune;
      return [address, city].filter(v => !!v).join(", ");
    },
    phone() {
      return this.office?.telefono;
    },
    email() {
      return this.office?.email;
    },
    timeList() {
      return this.office?.orari ?? [];
    },
    notes() {
      return this.office?.note;
    }
  },
  methods: {}
};
</script>

<style lang="scss"></style>
