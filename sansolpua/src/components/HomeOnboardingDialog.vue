<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-dialog
    :maximized="$q.screen.lt.sm"
    :value="value"
    v-bind="attrs"
    v-on="listeners"
   >
    <q-card class="onboarding-dialog full-height" :class="{'minWidth' : $q.screen.gt.xs, 'heightCard': $q.screen.lt.xl}">
      <q-card-section class="no-padding full-height  ">
        <q-carousel
          height="100%"
          ref="onboardingCarousel"
          v-model="slide"
          swipeable
          animated
          control-color="primary"
        >
          <q-carousel-slide
            class="no-padding"
            v-for="(card,index) in ONBOARDING_LIST_ITEMS"
                            :key="index" :name="index"
            >
            <q-scroll-area
              class="fit"
              :content-style="scrollBarStyle"
            >

            <div class="column no-wrap onboarding-dialog__slide q-pa-md  relative-position">
              <!--indietro/salta-->
              <div class="row items-center justify-between text-primary" :class="{'reverse': isFirstItem}">
                <q-btn
                  v-if="!isFirstItem"
                  dense
                  flat
                  no-caps
                  icon="keyboard_arrow_left"
                  label="indietro"
                  @click="previousSlice"

                />
                <q-btn dense flat no-caps label="Salta" @click="closeDialog"/>
              </div>
              <!--logo salute piemonte-->
              <div class="text-center q-mb-sm">
                <img class="onboarding-dialog__logo-salute-piemonte" src="/statics/la-mia-salute/immagini/logo-la-mia-salute-blu.svg" alt="">
              </div>
              <!--navigation-->
              <div class="row items-center justify-center ">
                <q-btn
                  class="col-auto"
                  v-for="(item, index) in ONBOARDING_LIST_ITEMS"
                  :key="index"
                  size="xs"
                  flat
                  round
                  color="primary"
                  :icon="slide === index ? 'lens' : 'panorama_fish_eye'  "
                  @click="goToSlide(index)"
                  :aria-label="`slide ${index+1}`"
                />
              </div>
              <!--immagine-->
              <div class="text-center q-pt-xl relative-position">

                  <img :src="slideImage(index)" style=" height: 180px">
                <!--avanti-->
                  <div class="absolute onboarding-dialog__next-btn" v-if="$q.screen.gt.xs">
                    <q-btn
                      v-if="!isLastItem"
                      color="white"
                      dense
                      flat
                      no-caps
                      icon-right="arrow_forward_ios"
                      label="avanti"
                      @click="nextSlide"
                    />
                    <q-btn
                      v-else
                      color="white"
                      dense
                      flat
                      no-caps
                      icon-right="arrow_forward_ios"
                      label="fine"
                      @click="closeDialog"
                    />
                  </div>

              </div>


              <!--testo-->
              <div class="q-mt-md text-center text-white" style="min-height: 110px">
                <h1>{{ card.title }}</h1>
                <div v-html="card.description"></div>
              </div>


              <!--avanti-->
              <div class="text-center q-py-md" v-if="$q.screen.lt.sm">
                <q-btn
                  v-if="!isLastItem"
                  color="white"
                  dense
                  flat
                  no-caps
                  icon-right="arrow_forward_ios"
                  label="avanti"
                  @click="nextSlide"
                />
                <q-btn
                  v-else
                  color="white"
                  dense
                  flat
                  no-caps
                  icon-right="arrow_forward_ios"
                  label="fine"
                  @click="closeDialog"
                />
              </div>

              <!--logo regione-->
              <div class="text-center q-mt-md ">
                <img class="onboarding-dialog__logo-regione-piemonte" src="/statics/la-mia-salute/immagini/logo-regione-piemonte.svg" alt="">
              </div>


            </div>

            </q-scroll-area>
          </q-carousel-slide>



<!--          <template v-slot:control>-->
<!--            <q-carousel-control-->
<!--              position="top-right"-->
<!--              :offset="[18, 18]"-->
<!--              class="text-white rounded-borders"-->
<!--              style="background: rgba(0, 0, 0, .3); padding: 4px 8px;"-->
<!--            >-->
<!--              <q-toggle dense dark color="orange" v-model="autoplay" label="Auto Play" />-->
<!--            </q-carousel-control>-->
        </q-carousel>
      </q-card-section>

    </q-card>
  </q-dialog>


</template>

<script>
import {ONBOARDING_LIST_ITEMS} from "src/services/config";

export default {
name: "HomeOnboardingDialog",
  props:{
  value:{type:Boolean, required:true, default: false},
    isLoading:{type:Boolean,  default: false},
  },
  data(){
    return{
      slide: 0,
      ONBOARDING_LIST_ITEMS
    }
  },
  computed:{
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    isLastItem(){
      return this.slide === ONBOARDING_LIST_ITEMS.length -1
    },
    isFirstItem(){
      return this.slide === 0
    },
    scrollBarStyle(){
      return{
        top: 0,
        minHeight: '100%',
        height:  this.$q.screen.gt.xs ? '100%' : ''
      }
    }
  },
  methods:{
    goToSlide(index){
      this.slide = index
      this.$refs.onboardingCarousel.goTo = index
    },
    closeDialog(){
      this.$emit('close-onboarding-dialog');
    },
    slideImage(index){
     return ONBOARDING_LIST_ITEMS[index]?.icon + '.svg'
    },
    previousSlice(){
      this.$refs.onboardingCarousel.previous()
    },
    nextSlide(){
      this.$refs.onboardingCarousel.next()
    },
    heightCard(){
      return this.$q.screen.sm ? '700px' : '100%'
    },
  }

}
</script>

<style lang="sass">
.onboarding-dialog
  height: 100%
  border-radius: 20px !important
  &.minWidth
    min-width: 750px
    @media  (max-width: $breakpoint-sm-max)
      &
        min-width: 100%
  &.heightCard
    height: 700px !important
.onboarding-dialog__slide
  height: 100%
  background: url(../../public/onboarding-sfondo.svg) left -225px top -65px/1200px no-repeat
  @media (max-width: $breakpoint-xs-max)
    &
      min-height: 100vh
      background: url(../../public/onboarding-sfondo-mobile.svg) left -225px top 0px/1000px no-repeat !important
.onboarding-dialog__logo-salute-piemonte
  max-width: 160px
.onboarding-dialog__logo-regione-piemonte
  max-width: 80px
.onboarding-dialog__next-btn
  top: 50%
  right: 80px


</style>
