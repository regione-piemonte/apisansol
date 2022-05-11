<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div>
    <div v-if="isWidgetVisibile" class="customer-satisfaction-widget-container text-right q-ma-lg">
      <q-slide-transition>
        <q-card
          v-show="isOpenAssistanceDialog"
          class="q-mb-sm q-mr-lg text-left"
          style="max-width: 320px;"
        >
          <q-card-main class="text-center q-px-none q-pb-none gt-sm">
            <img basic src="statics/images/soddisfazione-cliente.svg" width="40%"/>
          </q-card-main>
          <template v-if="$q.screen.gt.sm">
            <q-card-title >
              <div class="customer-satisfaction-widget-card__title">
                Cosa ne pensi?
              </div>
            </q-card-title>
            <q-card-main>
              <p> Conoscere il tuo grado di soddisfazione di questo servizio può aiutarci a capire quali azioni intraprendere
                in futuro.</p>
              <p class="no-margin">Rispondi a poche semplici domande e dai il tuo contributo.</p>
            </q-card-main>
          </template>
          <template v-else>

              <q-collapsible
                label="Cosa ne pensi?"
                header-class="customer-satisfaction-widget-card__title csw__collapsible"
              >
                <div>
                  <p> Conoscere il tuo grado di soddisfazione di questo servizio può aiutarci a capire quali azioni intraprendere
                    in futuro.</p>
                  <p class="no-margin">Rispondi a poche semplici domande e dai il tuo contributo.</p>
                </div>
              </q-collapsible>


          </template>
          <q-card-actions align="center" class="q-px-md" vertical>
            <q-btn
              :href="customerSatisfactionUrl"
              :loading="isLoadingSurvey"
              class="full-width q-mb-sm"
              color="primary"
              label="Vai al questionario"
              type="a"
              @click.prevent="goToSurvey"
            />
            <q-btn
              :loading="isLoading"
              class="full-width q-mb-sm"
              color="primary"
              label="Non mi interessa"
              outline
              @click.prevent="saveDoNotAskMeAgain"
            />
          </q-card-actions>
        </q-card>
      </q-slide-transition>

      <div class="customer-satisfaction-widget-balloon cursor-pointer  animate-scale gt-sm"
           v-if="!isOpenAssistanceDialog && showBalloon"
           @click="onClickBtn"
      >
        Cosa ne pensi?
      </div>
      <q-btn
        :class="classes"
        aria-label="Cosa ne pensi?"
        class="customer-satisfaction-widget-button "
        color="pink-15"
        round
        size="19px"
        @click="onClickBtn"
      >
        <img
          class="csw-img__icon "
          src="statics/icons/svgs/soddisfazione-cliente-icona.svg"/>
        <img
          class="csw-img__active-icon"
          src="statics/icons/svgs/widget-chiusura-icona.svg"/>
      </q-btn>
    </div>
  </div>

</template>

<script>
import {equalsIgnoreCase} from "../../../services/global/utils";
import {getUserApplicationsList, setUserApplicationInformation} from "../../../services/api/bff";
import {notifyError} from "../../../services/api/utils";
import CsiIconBase from "../icons/CsiIconBase";
import CsiIconAssistance from "../icons/CsiIconAssistance";
import CsiIconCustomerSatisfaction from "../icons/CsiIconCustomerSatisfaction";
import {SERVICE_RATING} from "../../../router/routes/global";

export default {
  name: "CsiCustomerSatisfactionWidget",
  components: {CsiIconCustomerSatisfaction, CsiIconAssistance, CsiIconBase},
  props: {
    serviceCode: {type: String, required: true, default: null}
  },
  data() {
    return {
      isOpenAssistanceDialog: false,
      isLoadingSurvey: false,
      isLoading: false,
      userApplicationAssociation: null,
      isPulseBtn:true,
      showBalloon:false
    }
  },
  computed: {
    user() {
      return this.$store.getters['global/user']
    },
    appList() {
      return this.$store.getters['global/getAppList']
    },
    userApplication() {
      return this.$store.getters['global/userApplication'](this.activeServiceId)
    },
    activeService() {
      return this.$store.getters['global/appServiceActive'](this.serviceCode);
    },
    activeServiceId() {
      return this.activeService ? this.activeService.id : null
    },
    customerSatisfactionUrl() {
      return this.activeService ? this.activeService.soddisfazione_cliente_url : ''
    },
    isWidgetVisibile() {
      let isUserSeen = this.userApplicationAssociation && this.userApplicationAssociation.soddisfazione_cliente_visualizzato
      return this.activeService && this.activeService.soddisfazione_cliente_visibile && !isUserSeen
    },
    classes() {
        return {
          "customer-satisfaction-widget-button__opened": this.isOpenAssistanceDialog,
          "customer-satisfaction-widget-button__pulse" : this.isPulseBtn
        };


    },
    imgIcon() {
      return this.isOpenAssistanceDialog ? 'statics/icons/svgs/widget-chiusura-icona.svg' : 'statics/icons/svgs/soddisfazione-cliente-icona.svg'


    }
  },
  created() {
    this.userApplicationAssociation = this.userApplication
  },
  mounted() {
    setTimeout(()=> {this.showBalloon =true}, 3500)
    setInterval(() =>{this.isPulseBtn = !this.isPulseBtn}, 20000)
  },
  methods: {
    async saveAsSeen() {
      if (!this.user) return
      try {
        let params = {
          soddisfazione_cliente_visualizzato: true,
          _no5XXRedirect: true
        }
        let {data: userApplication} = await setUserApplicationInformation(this.user.cf, this.activeServiceId, params)
        this.userApplicationAssociation = userApplication
      } catch (error) {
        // notifyError(error, '')
      }

    },
    async userApplicationsList() {
      try {
        let {data: appList} = await getUserApplicationsList(this.user.cf)
        if (appList)
          this.$store.commit('global/setUserApplicationsList', appList);
      } catch (e) {

      }
    },
    async goToSurvey() {
      this.isLoadingSurvey = true
      // window.open(this.customerSatisfactionUrl)
      await this.saveAsSeen()
      await this.userApplicationsList()

      // const route = this.$router.resolve(
      //   {
      //     name: SERVICE_RATING.name,
      //     query: {servizio: this.serviceCode, cs: true}
      //   }
      // );
      // window.open(route.href, '_blank')
      this.isLoadingSurvey = false
      const route = {
        name: SERVICE_RATING.name,
        query: {servizio: this.serviceCode, cs:true},

      }

      this.$router.push(route)


    },
    async saveDoNotAskMeAgain() {
      this.isLoading = true
      await this.saveAsSeen()
      await this.userApplicationsList()
      this.isLoading = false
    },
    onClickBtn(){
      if(this.showBalloon) this.showBalloon=false
      this.isOpenAssistanceDialog = !this.isOpenAssistanceDialog

    }
  }
}
</script>

<style lang="stylus">
.customer-satisfaction-widget-container
  min-width : 200px
  position: fixed
  bottom: 0
  right: 0
  z-index: 99999

.customer-satisfaction-widget-card__title
  font-size: 18px
  line-height: 24px
  font-weight: bold
  @media (min-width: $breakpoint-lg)
    font-size: 20px
    line-height: 22px
  &.csw__collapsible
    width:320px
    @media (max-width: 370px)
      width:100% !important


.customer-satisfaction-widget-button
  position: relative
  &__pulse
    -webkit-animation: pulse 2.8s linear 3s
    animation: pulse 2.8s linear 3s
  &:hover
    -webkit-animation: none
    animation:none
  &__opened
    -webkit-animation: none
    animation:none
    .csw-img__icon
      transform: rotate(180deg) !important
      opacity: 0 !important

    .csw-img__active-icon
      transform: rotate(0deg) !important
      opacity: 1 !important

  .csw-img
    &__icon, &__active-icon
      position: absolute
      transition: opacity .4s, transform .4s

    &__icon
      width: 32px
      opacity: 1
      transform: rotate(0deg)

    &__active-icon
      width: 26px
      opacity: 0
      transform: rotate(-180deg)

.customer-satisfaction-widget-balloon
  background-color: #fef2fa
  padding: 15px 20px 15px 18px
  position: absolute
  top: -60px
  right: 30px
  font-weight: 700
  font-size: 16px
  -webkit-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
  border-radius : 18px 18px 0px 18px
</style>
