<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <!-- UTENTE NON PIEMONTESE -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <template v-if="!userInfo">
      <div class="q-px-xl">
        <q-banner class="text-center q-banner--info" >
          <div class="text-body1">
            I dati anagrafici sono disponibili agli assistiti della regione
            piemonte
          </div>
        </q-banner>
      </div>
    </template>

    <!-- UTENTE PIEMONTESE -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <q-card >
        <q-card-section>
          <q-list separator class="text-subtitle1">
            <q-item class="q-item-profile">
              <q-item-section>
                <q-item-label class="text-weight-bold">Residenza:</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label v-if="isLoading">
                  <q-skeleton type="text"/>
                </q-item-label>
                <q-item-label v-else>
                  {{ residenceCity | capitalCase }},
                  {{ residenceAddress | capitalCase }},
                  {{ residenceHouseNumber | capitalCase }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="q-item-profile">
              <q-item-section>
                <q-item-label class="text-weight-bold"> Asl di assistenza:</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label v-if="isLoading">
                  <q-skeleton type="text"/>
                </q-item-label>
                <q-item-label v-else>
                  {{ asrLabel | empty }},
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="q-item-profile">
              <q-item-section>
                <q-item-label class="text-weight-bold">Domicilio sanitario:</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ domicileCity | capitalCase }},
                  {{ domicileAddress | capitalCase }},
                  {{ domicileHouseNumber | capitalCase }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </template>
  </lms-page>
</template>

<script>
import {getAsrTempList} from "../services/api";

export default {
  name: "PageProfileIdentity",
  components: {},
  props: {},
  data() {
    return {
      asrList: [],
      isLoading:false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    userInfo() {
      return this.$store.getters["getUserInfo"];
    },
    residenceCity() {
      return this.userInfo?.info_anag?.residenza?.desc_comune ?? "";
    },
    residenceAddress() {
      return this.userInfo?.info_anag?.residenza?.indirizzo ?? "";
    },
    residenceHouseNumber() {
      return this.userInfo?.info_anag?.residenza?.num_civico ?? "";
    },
    domicileCity() {
      return this.userInfo?.info_anag?.domicilio?.desc_comune ?? "";
    },
    domicileAddress() {
      return this.userInfo?.info_anag?.domicilio?.indirizzo ?? "";
    },
    domicileHouseNumber() {
      return this.userInfo?.info_anag?.domicilio?.num_civico ?? "";
    },
    asr() {
      let asrNationalId = this.userInfo?.info_san?.asl_domicilio;
      let asrLocalId = asrNationalId ? asrNationalId.substr(asrNationalId.length - 3) : '';
      return this.asrList.find(a => a.id.toString() === asrLocalId);
    },
    asrLabel() {
      return this.asr?.descrizione;
    }
  },
  async created() {
    this.isLoading = true
    try {
      let {data} = await getAsrTempList();
      this.asrList = data;
    } catch (error) {
      console.error(error);
    }finally {
      this.isLoading = false
    }
  },
  methods: {}
};
</script>

<style lang="sass"></style>
