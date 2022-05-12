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
              >
                <!--  SCHEDA ELEMENTO TROVATO  -->
                <div
                  class="q-mr-md q-mb-lg q-ml-xs"
                  ref="itemCardObjects"
                  v-for="(item,index) in foundItemsList" :key="index">
                  <lms-results-card-item
                    :focused="itemFocused===index"
                    :item="item"
                    @show-marker="(value) => showMarker(value, index)"
                  />
                </div>
                <a class="col-12 lms-link text-center cursor-pointer" v-if="areMoreElements"
                     @click="showMore">
                  <p v-if="!loading">Mostra altri</p>
                  <q-spinner v-else color="primary" size="md"/>
                </a>

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
      <!-- MOBILE-->
      <div v-if="$q.screen.lt.sm" class="csi-bg-default height-area-mobile relative-position" style="margin-bottom: 50px">
        <!--        <div class="q-pb-md q-px-md text-right">-->
        <!--          <q-btn-->
        <!--            :ripple="false"-->
        <!--            no-caps-->
        <!--            color="white"-->
        <!--            text-color="black"-->
        <!--            icon="fullscreen"-->
        <!--            Left-->
        <!--            label="Ingrandisci"-->
        <!--            @click="fullSizeMap(true)"-->
        <!--          />-->
        <!--        </div>-->

        <!--  MAPPA  -->
        <div class="fit absolute-center " :class="{'invisible' : !isShowingMap}">
          <lms-results-map
            :user-coords="userCoords"
            :found-items-list="foundItemsList"
            :active-item="itemFocused"
            @show-item-card="showItemCardMobile"
            @show-fullsize-map="fullSizeMap"
            :center-marker="centerMarker"
          />
          <div class="absolute-bottom" v-if="selectedItem"
               style="z-index:1000;">
            <div class="q-pa-md">
              <lms-results-card-item
                mobile
                :item="selectedItem"
                @show-marker="(value) => showMarkerMobile(value, itemFocused)"
              />
            </div>
          </div>
        </div>
        <!--  LISTA  -->
        <div class="fit absolute-center" v-show="!isShowingMap">
          <div
            class="row"
          >
            <q-scroll-area
              visible
              :thumb-style="{width:'12px'}"
              class="q-px-0 full-width height-area-mobile"
            >
              <!--  SCHEDA ELEMENTO TROVATO  -->
              <div
                class="q-mb-lg q-mx-md q-mt-sm"
                ref="itemCardObjects"
                v-for="(item,index) in foundItemsList" :key="index">
                <lms-results-card-item
                  :focused="itemFocused===index"
                  :item="item"
                  @show-marker="(value) => showMarker(value, index)"/>
              </div>

              <a class="col-12 lms-link text-center" v-if="areMoreElements"
                   @click="showMore">
                <p v-if="!loading">Mostra altri</p>
                <q-spinner v-else color="primary" size="md"/>
              </a>
            </q-scroll-area>

          </div>

        </div>
        <!--        <div class="absolute-bottom text-center " z-index="2000">-->
        <!--          <q-fab-->
        <!--            v-model="isShowingMap"-->
        <!--            square-->
        <!--            :label="isShowingMap ?  'Mostra elenco' : 'Mostra su mappa' "-->
        <!--            icon="map"-->
        <!--            active-icon="menu"-->
        <!--            direction="up"-->
        <!--            color="white"-->
        <!--            text-color="black"-->
        <!--            @input="onShowMapListInput"-->
        <!--            @hide="isShowingMap = false"-->
        <!--            padding="sm"-->
        <!--          />-->
        <!--        </div>-->
      </div>
    </div>
    <!--INZIO FULLSIZE MAP-->
    <!------------------------------------------------------------->
    <q-dialog v-model="isFullsize" class="bg-white " maximized>
      <q-card class="no-scroll" id="fullsize-map-dialog">
        <q-card-section class="no-scroll fit no-padding csi-bg-default">
          <q-splitter
            v-model="splitterModel"
            class="bg-transparent relative-position"
            :limits="limits"
            v-if="!isFullsizeMobile"
          >
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
                    class="q-px-0 full-width height-fullsize"

                  >
                    <!--  SCHEDA ELEMENTO TROVATO  -->
                    <div
                      class="q-mr-md q-mb-lg q-ml-xs"
                      ref="itemCardObjectsFullsize"
                      v-for="(item,index) in foundItemsList" :key="index">

                      <lms-results-card-item
                        :focused="itemFocused===index"
                        :item="item"
                        @show-marker="(value) => showMarker(value, index)"
                      />

                    </div>
                    <a class="col-12 text-primary lms-link" v-if="areMoreElements"
                         @click="showMore">
                      <p v-if="!loading">Mostra altri</p>
                      <q-spinner v-else color="primary" size="md"/>
                    </a>

                  </q-scroll-area>

                </div>
              </div>

            </template>
            <template v-slot:after>
              <template>
                <div class="height-fullsize" v-if="isFullsize">
                  <lms-results-map
                    :user-coords="userCoords"
                    :found-items-list="foundItemsList"
                    is-fullsize
                    :is-dialog-close="isClosingMap"
                    :active-item="itemFocused"
                    @show-fullsize-map="fullSizeMap"
                    @show-item-card="showItemCard"
                  />
                  <div class="absolute-bottom" v-if="$q.screen.lt.sm  && selectedItem"
                       style="z-index:1000; bottom:50px">
                    <div class="q-pa-md">
                      <lms-results-card-item
                        mobile
                        :item="selectedItem"
                        @show-marker="(value) => showMarker(value, itemFocused)"
                      />

                    </div>
                  </div>
                </div>
              </template>
            </template>
          </q-splitter>
          <!--  MOBILE-->
          <template v-else>
            <div class="height-fullsize" v-show="isShowingMap">
              <lms-results-map
                :user-coords="userCoords"
                :found-items-list="foundItemsList"
                is-fullsize
                :is-dialog-close="isClosingMap"
                :active-item="itemFocused"
                @show-fullsize-map="fullSizeMap"
                @show-item-card="showItemCardMobile"
                :center-marker="centerMarker"
              />
              <div class="absolute-bottom" v-if="selectedItem"
                   style="z-index:1000; bottom:50px">
                <div class="q-pa-md">
                  <lms-results-card-item
                    mobile
                    :item="selectedItem"
                    @show-marker="(value) => showMarkerMobile(value, itemFocused)"
                  />

                </div>
              </div>
            </div>
            <!--            <div class="height-fullsize fullsize__list " v-show="!isShowingMap">-->
            <!--              <div-->
            <!--                class="row"-->
            <!--              >-->
            <!--                <div class="col-12 text-right q-pa-md">-->
            <!--                  <q-btn-->
            <!--                    :ripple="false"-->
            <!--                    no-caps-->
            <!--                    color="white"-->
            <!--                    text-color="black"-->
            <!--                    :icon="isFullsize ? 'fullscreen_exit' : 'fullscreen'"-->
            <!--                    Left-->
            <!--                    :label="isFullsize ? 'Riduci' : 'Ingrandisci'"-->
            <!--                    @click="fullSizeMap(!isFullsize)"-->
            <!--                  />-->
            <!--                </div>-->
            <!--                <div class="col-12 full-height">-->
            <!--                  <q-scroll-area-->
            <!--                    visible-->
            <!--                    :thumb-style="{width:'12px'}"-->
            <!--                    class="q-px-0 full-width height-area-mobile"-->
            <!--                  >-->
            <!--                    &lt;!&ndash;  SCHEDA ELEMENTO TROVATO  &ndash;&gt;-->
            <!--                    <div-->
            <!--                      class="q-mr-md q-mb-lg q-mt-sm q-ml-xs "-->
            <!--                      ref="itemCardObjectsFullsize"-->
            <!--                      v-for="(item,index) in foundItemsList" :key="index">-->

            <!--                      <lms-results-card-item-->
            <!--                        :focused="itemFocused===index"-->
            <!--                        :item="item"-->
            <!--                        @show-marker="(value) => showMarker(value, index)"-->
            <!--                      />-->

            <!--                    </div>-->
            <!--                    <div class="col-12 text-primary text-weight-bold text-center cursor-pointer" v-if="areMoreElements"-->
            <!--                         @click="showMore">-->
            <!--                      <p v-if="!loading">Mostra altri</p>-->
            <!--                      <q-spinner v-else color="primary" size="md"/>-->
            <!--                    </div>-->

            <!--                  </q-scroll-area>-->
            <!--                </div>-->


            <!--              </div>-->

            <!--            </div>-->
            <div class="absolute-bottom text-center map-list-btn">
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
          </template>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--FINE FULLSIZE MAP-->
  </div>

</template>
<script>
  import {scrollHorizontalToElement, scrollToElement} from "src/services/utils";
  import LmsResultsMap from "./LmsResultsMap";
  import {Screen} from 'quasar'
  import {SERVICES} from "src/services/config";
  import LmsResultsCardItem from "./LmsResultsCardItem";

  export default {
    name: "LmsResults",
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
        isClosingMap: false,
        centerMarker:false
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
      selectedItem: {
        deep: true,
        handler(newVal, oldVal) {
          if (newVal && this.isNewItemSelected) {
            this.scrollToItem(newVal)
          }
        }
      },

      isShowingMap: {
        handler(newVal, oldVal) {
          if (!newVal && this.selectedItem) {
            this.scrollToItem(this.selectedItem)
          }
        }
      }
    },
    computed: {
      service() {
        return this.$store.getters["getActiveService"];
      },
      splitterModel: {
        // getter
        get: function () {
          return this.limits[0]
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
      limits() {
        if (this.Screen.lt.xl) return [45, 45]
        if (this.Screen.lt.md) return [50, 50]
        if (this.isFullsize) return [30, 30]
        return [35, 35]
      },
      isFullsizeMobile() {
        return this.isFullsize && this.$q.screen.lt.sm
      },
      isShowingMap: {
        get: function () {
          return this.$store.getters['isShowMap']
        },
        // setter
        set: function (val) {
          this.$store.dispatch('setResultsOnMap', val)
        }

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
          //this.isFullsize = true
          //this.isShowingMap = true
        }

      },
      setLimits(isScreenSm) {
        if (isScreenSm) return [50, 50]
        if (this.isFullsize) return [20, 20]
        return [45, 45]
      },
      showMarker(value, index) {
        if (value) {
          this.centerMarker = false
          this.itemFocused = index
          this.isNewItemSelected = false
          this.selectedItem = this.foundItemsList[index]
        }
      },
      showMarkerMobile(value, index){
        if (value) {
          this.itemFocused = null
          this.centerMarker = true
          setTimeout(()=>{
            this.itemFocused = index
            this.isNewItemSelected = false
            this.selectedItem = this.foundItemsList[index]
            }, 100)

        }

      },
      showItemCard(index) {

        if (this.itemFocused === index) {
          this.itemFocused = null
          this.selectedItem = null
          return
        }
        this.itemFocused = index
        this.isNewItemSelected = true
        this.selectedItem = this.foundItemsList[index]
      },
      showItemCardMobile(index) {
        this.centerMarker=false
        if (this.itemFocused === index) {
          this.itemFocused = null
          this.selectedItem = null
          return
        }
        this.itemFocused = index
        this.selectedItem = this.foundItemsList[index]
      },
      fullSizeMap(val) {
        this.isFullsize = val
      },
      onShowMapListInput() {
        this.isShowingMap = false
        this.isFullsize = false
      },

      scrollToItem(item) {
        if(this.isFullsizeMobile) return
        let index = this.foundItemsList.indexOf(item)
        let results = null
        if (this.isFullsize) {
          results = this.$refs.itemCardObjectsFullsize
        } else
          results = this.$refs.itemCardObjects
        let itemCard = results[index]

        this.$nextTick(() => {
          scrollToElement(itemCard)
        })

      },
      showMore() {
        this.$emit('show-more')
      },
      closeFullsizeMap() {
        this.isClosingMap = true
      },

    }
  }
</script>

<style lang="sass">
  .lms-results
    .height-area
      height: 800px

    .height-area-mobile
      height: 500px

  #fullsize-map-dialog
    .map-list-btn
      margin-bottom: 20px
      z-index: 2000

    .height-fullsize
      height: 100vh !important

      &.fullsize__list
        padding-left: 16px

  .csi-bg-default
    background: #f0f3f8

</style>
