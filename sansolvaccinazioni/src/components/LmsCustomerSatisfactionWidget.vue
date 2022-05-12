<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="customer-satisfaction-widget-container text-right q-ma-lg">
    <q-slide-transition>
      <q-card
        class="q-mb-sm q-mr-lg text-left"
        style="max-width: 320px;"
        v-show="isOpenAssistanceDialog"
      >
        <q-card-section class="text-center q-px-none q-pb-none gt-sm">
          <img  src="/statics/la-mia-salute/immagini/soddisfazione-cliente.svg" width="40%"/>
        </q-card-section>

        <template v-if="$q.screen.gt.sm">
          <q-card-section class="q-pb-sm">
            <div class="customer-satisfaction-widget-card__title">
              Cosa ne pensi?
            </div>

          </q-card-section>
          <q-card-section>
            <p> Conoscere il tuo grado di soddisfazione di questo servizio può aiutarci a capire quali azioni intraprendere
              in futuro.</p>
            <p class="no-margin">Rispondi a poche semplici domande e dai il tuo contributo.</p>
          </q-card-section>
        </template>
        <template v-else>
          <q-expansion-item
            label="Cosa ne pensi?"
            header-class="customer-satisfaction-widget-card__title csw__collapsible"
          >
            <q-card>
              <q-card-section>
                <p> Conoscere il tuo grado di soddisfazione di questo servizio può aiutarci a capire quali azioni intraprendere
                  in futuro.</p>
                <p class="no-margin">Rispondi a poche semplici domande e dai il tuo contributo.</p>
              </q-card-section>
            </q-card>

          </q-expansion-item>
        </template>

        <q-card-section class="column q-gutter-md q-mb-sm">
          <q-btn
            :href="customerSatisfactionUrl"
            :loading="isLoadingSurvey"
            color="primary"
            label="Vai al questionario"
            type="a"
            @click.prevent="goToSurvey"
          ></q-btn>
          <q-btn
            :loading="isLoading"
            color="primary"
            label="Non mi interessa"
            outline
            @click.prevent="saveDoNotAskMeAgain"
          />
        </q-card-section>
      </q-card>
    </q-slide-transition>
    <div class="customer-satisfaction-widget-balloon cursor-pointer  animate-scale gt-sm"
         v-if="!isOpenAssistanceDialog && showBalloon"
         @click="openFabRemote"
    >
      Cosa ne pensi?
    </div>
    <q-fab
      ref="customerSatisfactionFab"
      :class="classes"
      size="60px"
      color="lms-pink"
      class="customer-satisfaction-widget-button"
      round
      icon="img:/statics/la-mia-salute/icone/soddisfazione-cliente-icona.svg"
      active-icon="img:/statics/la-mia-salute/icone/widget-chiusura-icona.svg"
      type="button"
      text-color="white"
      direction="up"
      @input="onInputFab"
      aria-label="Hai bisogno di assistenza?"

    >
    </q-fab>
  </div>
</template>

<script>
import {getUserApplicationsList, setUserApplicationInformation} from "src/services/api";
import {SERVICE_RATING} from "src/router/routes";

export default {
  name: "LmsCustomerSatisfactionWidget",
  data(){
    return{
      isOpenAssistanceDialog: false,
      isLoadingSurvey: false,
      isLoading: false,
      userApplicationAssociation: null,
      isPulseBtn:true,
      showBalloon:false
    }
  },
  props:{

  },
  mounted() {
    setTimeout(()=> {this.showBalloon =true}, 3500)
    setInterval(() =>{this.isPulseBtn = !this.isPulseBtn}, 20000)
  },
  computed:{
    taxCode() {
      return this.$store.getters["getTaxCode"];
    },
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    appId(){
      return this.workingApp?.id
    },
    customerSatisfactionUrl() {
      return this.workingApp?.soddisfazione_cliente_url ?? ''
    },
    isWidgetVisibile() {
      let isUserSeen = this.userApplicationAssociation && this.userApplicationAssociation.soddisfazione_cliente_visualizzato
      return this.workingApp?.soddisfazione_cliente_visibile && !isUserSeen
    },
    classes() {
      return {
        "customer-satisfaction-widget-button__opened": this.isOpenAssistanceDialog,
        "customer-satisfaction-widget-button__pulse" : this.isPulseBtn
      };
    },

  },
  methods:{
    onInputFab(val) {
      this.isOpenAssistanceDialog = val;
    },

    openFabRemote(){
      this.$refs.customerSatisfactionFab?.show()
    },
    async saveAsSeen() {
      try {
        let params = {
          soddisfazione_cliente_visualizzato: true
        }
        let {data: appList} = await setUserApplicationInformation(this.taxCode, this.appId, params)
        if(appList)
          await this.userApplicationsList()
        // this.$store.dispatch("setUserApplicationsList", {appList});
      } catch (error) {
        // notifyError(error, '')
      }

    },
    async goToSurvey() {
      this.isLoadingSurvey = true
      // window.open(this.customerSatisfactionUrl)
      await this.saveAsSeen()
      this.isLoadingSurvey = false
      const route = {
        name: SERVICE_RATING.name,
        query: {cs:true},

      }
      this.$router.push(route)
    },
    async saveDoNotAskMeAgain() {
      this.isLoading = true
      await this.saveAsSeen()
      this.isLoading = false
    },
    async userApplicationsList() {
      try {
        let {data: appList} = await getUserApplicationsList(this.taxCode)
        this.$store.dispatch("setUserApplicationsList", {appList});
      } catch (e) {

      }
    },
  }
}
</script>

<style lang="sass">
.customer-satisfaction-widget-container
  min-width : 200px
  position: fixed
  bottom: 0
  right: 0
  z-index: 99999

.customer-satisfaction-widget-button
  position: relative
  &__pulse
    -webkit-animation: pulse 2.8s linear 3s
    animation: pulse 2.8s linear 3s
  &:hover
    -webkit-animation: none
    animation: none
  &__opened
    -webkit-animation: none
    animation: none

.customer-satisfaction-widget-card__title
  font: normal normal bold 18px / 24px Open Sans

  @media (min-width: $breakpoint-lg-min)
    font: normal normal bold 20px / 22px Open Sans
  &.csw__collapsible
    width: 320px
    @media (max-width: 370px)
      width:  100% !important

.customer-satisfaction-widget-balloon
  background-color: #fef2fa
  padding: 15px 20px 15px 18px
  position: absolute
  top: -60px
  right: 30px
  font-weight: 700
  font-size: 16px
  -webkit-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12)
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12)
  border-radius : 18px 18px 0px 18px
</style>
