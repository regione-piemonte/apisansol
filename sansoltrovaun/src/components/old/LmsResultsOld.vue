<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="lms-results">
    <div class="full-width" v-if="foundItemsList.length>0">
      <div class="row justify-center q-mb-lg" v-if="$q.screen.gt.sm">
        <q-chip color="info"><strong>{{nResultsLabel}}</strong></q-chip>
      </div>
      <q-splitter
        v-model="splitterModel"
        class="bg-transparent relative-position"
        :limits="limits"
        v-if="$q.screen.gt.xs"
      >
<!--        <div class="absolute-top-right text-right q-pa-sm" >-->
<!--          <q-btn-->
<!--            :loading="dialogLoading && isFullsize"-->
<!--            :ripple="false"-->
<!--            no-caps-->
<!--            color="white"-->
<!--            text-color="black"-->
<!--            :icon="isFullsize ? 'fullscreen_exit' : 'fullscreen'"-->
<!--            Left-->
<!--            :label="fullsizeMapLabel"-->
<!--            @click="fullSizeMap()"-->
<!--          />-->
<!--        </div>-->
        <template v-slot:before>
          <!-- Lista elementi trovati VERTICALE-->
          <div :class="{'q-pl-md q-pt-md csi-bg-default': isFullsize}">
            <div
              class="row"
            >
              <q-scroll-area
                :thumb-style="{width:'12px'}"
                visible
                id="scroll-area-vertical"
                class="q-px-0 full-width height-area"
                :class="{'fullsize' : isFullsize}"
                @scroll="onScrollArea"
              >
                <!--  SCHEDA ELEMENTO TROVATO  -->
                <div
                  class="q-mr-md q-mb-lg q-ml-xs"
                  ref="itemCardObjectsVer"
                  v-for="(item,index) in foundItemsList" :key="index">
                  <lms-results-card-item
                    :focused="itemFocused===index"
                    :item="item"
                    @show-marker="(value) => showMarker(value, index)"
                    />
                </div>
                <div class="col-12 text-primary text-weight-bold text-center cursor-pointer" v-if="areMoreElements"
                     @click="showMore">
                  <p v-if="!loading">Mostra altri</p>
                  <q-spinner v-else color="primary" size="md"/>
                </div>

              </q-scroll-area>

            </div>
          </div>

        </template>
        <template v-slot:after>
          <template>
            <div class="height-area" :class="{'fullsize' : isFullsize}">
              <lms-results-map
                :user-coords="userCoords"
                :found-items-list="foundItemsList"
                :is-fullsize="isFullsize"
                :active-item="itemFocused"
                @show-fullsize-map="fullSizeMap"
                @show-item-card="showItemCard"
              />

            </div>
          </template>
        </template>
      </q-splitter>
    </div>

    <!-------    MOBILE ----------------->
    <!-------------------------------------------->
    <div v-if="$q.screen.lt.sm" class="relative-position q-pb-lg" ref="lmsResultsContainer">
      <div class="absolute-bottom text-center map-list-btn">
        <q-fab
          v-model="isListOpen"
          square
          :label="isListOpen ? 'Mostra su mappa' : 'Mostra elenco'"
          icon="menu"
          active-icon="map"
          direction="up"
          color="white"
          text-color="black"
          @input="onFabInput"
          @hide="isListOpen = false"
          padding="sm"
        />
      </div>
      <!--  INZIO LISTA ELEMENTO TROVATO  -->
      <div
        class="row"
        v-show="isListOpen"
      >
        <q-scroll-area
          visible
          :thumb-style="{width:'12px'}"
          id="scroll-area-vertical-mobile"
          class="q-px-0 full-width height-area "
          @scroll="onScrollAreaMobile"
        >
          <div
            class="q-mb-lg q-mr-md q-ml-xs"
            ref="itemCardObjectsVerMobile"
            v-for="(item,index) in foundItemsList" :key="index">
            <lms-results-card-item
              :focused="itemFocused===index"
              :item="item"
              @show-marker="(value) => showMarker(value, index)"/>
          </div>
          <div class="col-12 text-primary text-weight-bold text-center cursor-pointer" v-if="areMoreElements"
               @click="showMore">
            <p v-if="!loading">Mostra altri</p>
            <q-spinner v-else color="primary" size="md"/>
          </div>
        </q-scroll-area>
      </div>
      <!--  FINE LISTA ELEMENTO TROVATO  -->

      <!--  INIZIO MAPPA  -->
      <div v-if="!isListOpen" class="height-area">
        <lms-results-map
          :user-coords="userCoords"
          :found-items-list="foundItemsList"
          :active-item="itemFocused"
          @show-item-card="showItemCardMobile"
          @show-fullsize-map="fullSizeMap"
        />
        <div class="absolute-bottom q-mb-lg" v-if="$q.screen.lt.sm  && selectedItem" style="z-index:1000">
          <div class="q-pa-md">

            <lms-results-card-item
              mobile
              :item="selectedItem"
              @show-marker="(value) => showMarker(value, itemFocused)"/>
          </div>
        </div>
      </div>
      <!--  FINE MAPPA  -->
    </div>
    <!------- FINE   MOBILE ----------------->
    <!-------------------------------------------->

    <!--INZIO FULLSIZE MAP-->
    <!------------------------------------------------------------->
    <q-dialog v-model="isFullsize" class="bg-white" maximized>
      <q-card class="no-scroll">
        <q-card-section class="no-scroll fit no-padding">
          <q-splitter
            v-model="splitterModel"
            class="bg-transparent relative-position"
            :limits="limits"
          >
<!--            <div class="absolute-top text-right q-pa-sm" v-if="$q.screen.gt.xs">-->
<!--              <q-btn-->
<!--                :ripple="false"-->
<!--                no-caps-->
<!--                color="white"-->
<!--                text-color="black"-->
<!--                icon="fullscreen_exit"-->
<!--                Left-->
<!--                :label="fullsizeMapLabel"-->
<!--                @click="fullSizeMap()"-->
<!--              />-->
<!--            </div>-->
            <template v-slot:before>
              <!-- Lista elementi trovati VERTICALE-->
              <div class="q-pl-md q-pt-md csi-bg-default">
                <div
                  class="row"
                >
                  <q-scroll-area
                    visible
                    :thumb-style="{width:'12px'}"
                    id="scroll-area-vertical-fullscreen"
                    class="q-px-0 full-width height-area fullsize"
                    @scroll="onScrollArea"
                  >
                    <!--  SCHEDA ELEMENTO TROVATO  -->
                    <div
                      class="q-mr-md q-mb-lg q-ml-xs"
                      ref="itemCardObjectsVerFullsize"
                      v-for="(item,index) in foundItemsList" :key="index">

                      <lms-results-card-item
                        :focused="itemFocused===index"
                        :item="item"
                        @show-marker="(value) => showMarker(value, index)"
                        />

                    </div>
                    <div class="col-12 text-primary text-weight-bold text-center cursor-pointer" v-if="areMoreElements"
                         @click="showMore">
                      <p v-if="!loading">Mostra altri</p>
                      <q-spinner v-else color="primary" size="md"/>
                    </div>

                  </q-scroll-area>

                </div>
              </div>

            </template>
            <template v-slot:after>
              <template>
                <div class="height-area fullsize" v-if="isFullsize">
                  <lms-results-map
                    :user-coords="userCoords"
                    :found-items-list="foundItemsList"
                    is-fullsize
                    :is-dialog-close="isClosingMap"
                    :active-item="itemFocused"
                    @show-fullsize-map="fullSizeMap"
                    @show-item-card="showItemCard"
                  />
                  <div class="absolute-bottom text-center" v-if="$q.screen.lt.sm"
                       style="z-index:1000; bottom: 16px">
                    <div class="q-pa-md" v-if="selectedItem">
                      <lms-results-card-item
                        mobile
                        :item="selectedItem"
                        @show-marker="(value) => showMarker(value, itemFocused)"
                      />

                    </div>
                    <q-btn
                      square
                      label="Mostra elenco"
                      icon="menu"
                      color="white"
                      text-color="black"
                      padding="sm"
                      @click="onShowMapListInput"
                    />
                  </div>
                  <div class="absolute-bottom text-center map-list-btn">


                  </div>
                </div>
              </template>
            </template>
          </q-splitter>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--FINE FULLSIZE MAP-->
  </div>

</template>
<script>
  import {scrollHorizontalToElement, scrollToElement} from "src/services/utils";
  import LmsResultsMap from "../LmsResultsMap";
  import {Screen} from 'quasar'
  import {SERVICES} from "src/services/config";
  import LmsResultsCardItem from "../LmsResultsCardItem";

  export default {
    name: "LmsResultsOld",
    components: {
      LmsResultsCardItem,
      LmsResultsMap,
    },
    props: {
      foundItemsList: {type: Array, required: true, default: null},
      userCoords: {type: Object, default: null},
      areMoreElements: {type: Boolean, default: false},
      loading: {type: Boolean, default: false},
    },
    data() {
      return {
        servicesList: SERVICES,
        Screen,
        isLoading: false,
        isListOpen: false,
        map: null,
        itemFocused: null,
        selectedItem: null,
        infoExpanded: false,
        isFullsize: false,
        showFixedBtn: false,
        fixedBtnLabel: '',
        isNewItemSelected: false,
        isClosingMap:false
      }
    },

    watch: {
      Screen: {
        deep: true,
        immediate: true,
        handler(newValue, oldValue) {
          this.setScreenParams(newValue);
        }
      },
    },
    computed: {
      service() {
        return this.$store.getters["getActiveService"];
      },
      splitterModel: {
        // getter
        get: function () {
          return this.$q.screen.gt.xs ? this.limits[0] : 0
        },
        // setter
        set: function (newValue) {
          return newValue
        }
      },
      fullsizeMapLabel() {
        if (this.$q.screen.gt.xs) {
          return this.isFullsize ? 'Riduci mappa' : 'Ingrandisci mappa'
        }
        return ''
      },
      nResultsLabel() {
        if (this.foundItemsList.length === 1)
          return `${this.foundItemsList.length} risultato trovato`
        else
          return `${this.foundItemsList.length} risultati trovati`
      },
      serviceIcon() {
        return `img:/statics/la-mia-salute/icone/ospedale.svg`
      },
      dialogLoading() {
        if (!this.$refs.fullsizeMap) return true
        return false
      },
      limits(){
        if (this.Screen.lt.xl) return [45, 45]
        if (this.Screen.lt.md) return [50, 50]
        if (this.isFullsize) return [30, 30]
        return [35, 35]
      }
    },
    created() {

    },
    methods: {
      setScreenParams(value) {
        let isScreenSm = value.sm

        if (isScreenSm)
          this.isListOpen = false
        if (value.xs) {
          // this.scrollResultsIntersection(window.scrollY)
          this.isListOpen = true
          this.isFullsize = false
        }

      },
      setLimits(isScreenSm) {
        if (isScreenSm) return [50, 50]
        if (this.isFullsize) return [20, 20]
        return [45, 45]
      },
      showMarker(value, index) {
        if (value) {
          this.itemFocused = index
          this.selectedItem = this.foundItemsList[index]
        }
      },
      onShowMapListInput() {
        this.isListOpen = true
        this.isFullsize = false
      },
      showItemCard(index) {
        if (this.itemFocused === index) {
          this.itemFocused = null
          this.selectedItem = null
          return
        }
        this.itemFocused = index
        this.selectedItem = this.foundItemsList[index]
        let itemcardV = null
        if (this.isFullsize)
          itemcardV = this.$refs.itemCardObjectsVerFullsize[index]
        else
          itemcardV = this.$refs.itemCardObjectsVer[index];

        scrollToElement(itemcardV)
      },
      showItemCardMobile(index) {
        if (this.itemFocused === index) {
          this.itemFocused = null
          this.selectedItem = null
          return
        }
        this.itemFocused = index
        this.selectedItem = this.foundItemsList[index]
      },
      fullSizeMap(val) {
        // if(this.isFullsize) this.isClosingMap =true
        // this.isFullsize = !this.isFullsize
        this.isFullsize = val
      },
      onFabInput(val) {
        this.isListOpen = val
        if (!this.isListOpen) {
          let results = this.$refs.lmsResultsContainer
          scrollToElement(results)
        } else {
          if (this.selectedItem) {
            this.isNewItemSelected = true
          }

        }
      },


      onScrollArea({verticalPosition}) {
        if (this.isListOpen) {
          let index = this.foundItemsList.indexOf(this.selectedItem)
          let itemcardV = this.$refs.itemCardObjectsVer[index];
          //  scrollToElement(itemcardV)
        }
      },
      onScrollAreaMobile({verticalPosition}) {
        if (this.isNewItemSelected) {
          let index = this.foundItemsList.indexOf(this.selectedItem)
          let itemcardV = this.$refs.itemCardObjectsVerMobile[index];
          // scrollToElement(itemcardV)
          this.isNewItemSelected = false
        }
      },
      showMore() {
        this.$emit('show-more')
      },
      closeFullsizeMap(){
        this.isClosingMap = true
      }

      // scrollResultsIntersection(position){
      //   this.$nextTick(() => {
      //     const container = document.getElementById('lmsResultsContainer')
      //     if(container){
      //       let containerTop   = container.offsetTop
      //       let containerBottom = container.offsetHeight + container.offsetTop
      //       this.showFixedBtn = position > containerTop && position < containerBottom
      //     }
      //   });
      //
      //  // this.showFixedBtn = entry.isIntersecting
      // }
    }
  }
</script>

<style lang="sass">
    .service-card
      border: 2px solid #fff

    .marginForFab
      margin-bottom: 100px

    .height-area
      height: 550px

      &.fullsize
        height: 100vh !important

    .csi-bg-default
      background: #f0f3f8

    .map-list-btn
      margin-bottom: -8px
      z-index: 2000

</style>
