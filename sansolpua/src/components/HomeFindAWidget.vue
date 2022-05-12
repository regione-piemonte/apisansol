<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <!-- INTESTAZIONE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="text-h5 text-bold">
      Trova un...
    </div>

    <!-- SCROLLER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <div class="q-mt-md">
      <lms-scroll-horizontal
        controls
        controls-invisible-on-threshold
        classes="row no-wrap"
      >
        <a
          v-for="item in itemList"
          :key="item.label"
          class="col-auto home-find-a-list-item q-px-xl q-py-lg lms-link-seamless"
          :href="item.url"
        >
          <div class="text-center">
            <q-icon
              :name="'img:' + item.iconUrl"
              size="xl"
              class="no-pointer-events"
            />
          </div>
          <div
            class="text-center q-mt-md non-selectable"
            style="max-width: 70px"
          >
            {{ item.label }}
          </div>
        </a>
      </lms-scroll-horizontal>
    </div>
  </div>
</template>

<script>
import LmsScrollHorizontal from "./core/LmsScrollHorizontal";
import * as urls from 'src/services/urls'

export default {
  name: "HomeFindAWidget",
  components: { LmsScrollHorizontal },
  props: {},
  data() {
    return {};
  },
  computed: {
    appList() {
      return this.$store.getters["getAppList"];
    },
    appFindA() {
      return this.appList.find(a => a.codice === "TROVA_UN");
    },
    itemList() {
      return [
        {
          label: "Ospedale o clinica",
          iconUrl: "/statics/la-mia-salute/icone/ospedale.svg",
          url: urls.findAHospital()
        },
        {
          label: "Medico o pediatra",
          iconUrl: "/statics/la-mia-salute/icone/medici-e-pediatri.svg",
          url: urls.findADoctor()
        },
        {
          label: "Farmacia",
          iconUrl: "/statics/la-mia-salute/icone/farmacia.svg",
          url: urls.findAPharmacy()
        },
        {
          label: "Strutture sanitarie",
          iconUrl: "/statics/la-mia-salute/icone/strutture-sanitarie.svg",
          url: urls.findAStructure()
        },
        {
          label: "Negozi celiaci",
          iconUrl: "/statics/la-mia-salute/icone/negozio-celiachia.svg",
          url: urls.findACeliacOutlet()
        }
      ];
    }
  },
  created() {},
  methods: {}
};
</script>

<style scoped lang="sass">
.home-find-a-list-item
  cursor: pointer
  border-radius: 8px
  transition: all .4s ease

  &:hover
    background-color: transparentize($primary, .8)
</style>
