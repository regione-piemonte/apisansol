<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <csi-page-title title="Emergenza Coronavirus"/>

    <div class="row items-center gutter-sm q-my-md">
      <div class="col-12 col-lg-6" v-for="banner in banners" :key="banner.number">
        <a :href="'tel:' + banner.number" style="color: black; text-decoration: none;">
          <q-card>
            <q-card-main>
              <q-item>
                <q-item-side>
                  <q-icon name="phone" color="primary" class="csi-icon--md"/>
                </q-item-side>
                <q-item-main class="gutter-y-xs">
                  <q-item-tile class="q-body-1">{{banner.title}}</q-item-tile>
                  <q-item-tile label class="q-display-4">{{banner.number}}</q-item-tile>
                  <template v-if="banner.caption">
                    <q-item-tile sublabel class="text-black">
                      {{banner.caption}}
                    </q-item-tile>
                  </template>
                </q-item-main>
              </q-item>
            </q-card-main>
          </q-card>
        </a>
      </div>
    </div>

    <div class="q-my-md">
      <q-card class="cursor-pointer">
        <q-card-main>
          <q-item>
            <q-item-main>
              <q-item-tile label class="q-display-2">
                Indicazioni e comportamenti da seguire
              </q-item-tile>
            </q-item-main>

            <q-item-side>
              <q-icon name="keyboard_arrow_right" class="csi-icon--md"/>
            </q-item-side>
          </q-item>
        </q-card-main>
      </q-card>
    </div>

    <q-card>
      <q-card-main>
        <div class="q-mt-md q-mb-lg q-display-3">
          Gli aggiornamenti dalla Regione Piemonte
        </div>

        <div v-for="item in items" :key="item.isoDate">
          <div v-html="item.content"></div>
        </div>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<script>
  import Parser from 'rss-parser'
  import {axiosPublicInstance} from "plugins/axios";
  import CsiPageTitle from "components/global/common/CsiPageTitle";

  const banners = [
    {title: 'Richiesta di carattere sanitario sul corona virus', number: '800 19 20 20', caption: null},
    {title: 'Emergenza sanitaria', number: '112', caption: null},
    {title: 'Informazioni sul corona virus', number: '1500', caption: null},
    {
      title: 'Numero verde regionale',
      number: '800 333 444',
      caption: 'Informazioni di carattere NON sanitario h 08:00 - 20:00'
    },
  ];

  export default {
    name: "PageCovid19",
    components: {CsiPageTitle},
    data() {
      return {
        banners,
        items: []
      }
    },
    async created() {
      let parser = new Parser();
      const url = `${axiosPublicInstance.defaults.baseURL}/bff/covid19`;
      let feed = await parser.parseURL(url);
      this.items = feed.items;
    }
  }
</script>

<style scoped>

</style>
