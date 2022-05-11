<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title no-back>Benvenuto in Assistenza <span>{{ serviceName }}</span></lms-page-title>
    <div class="q-mt-lg text-body1">Hai un problema? Segui i percorsi guidati</div>
    <div v-if="isEmptyRootList">
      <q-banner class="h-banner h-banner--info q-my-lg">
        <div class="text-body1">
          Non ci sono percorsi guidati per il servizio selezionato.
        </div>
      </q-banner>
    </div>
    <template v-else>
      <div class="row items-stretch q-col-gutter-md q-mt-md" v-if="!showScrollCards">
        <div class="col-12 col-sm-4 col-md-3" v-for="root in rootList" :key="root.nid">
          <q-card class="root-card fit cursor-pointer" @click="showTree(root)" :class="{'active': root===rootItem}">
            <q-card-section>
              <div class="root-card__title text-h6">
                {{ root.titolo }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div v-else class="full-width q-my-lg">
        <lms-scroll-horizontal
          controls
          classes="row no-wrap items-stretch "
        >
          <div class="col-auto q-my-md q-px-md" v-for="root in rootList" :key="root.nid">
            <q-card class="root-card full-height cursor-pointer" style="max-width: 250px" @click="showTree(root)">
              <q-card-section class="full-height">
                <div class="root-card__title text-h6">
                  {{ root.titolo }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </lms-scroll-horizontal>
      </div>

      <!--  ALBERO DEGLI AIUTI -->
      <q-slide-transition>
        <div v-show="isVisibile" class="q-mt-md">
          <q-card class="bg-white q-pa-lg aid-tree" flat>
            <div
              class="row"
              v-for="(branch,index) in questions" :key="index">
              <template v-if="branch.parent">
                <q-chat-message
                  bg-color="chat-pink"
                  class="col-12 col-sm-6"

                >
                  <template v-slot:avatar>
                    <q-icon
                      style="right:16px"
                      size="sm"
                      name="img:images/avatar-operator.svg"
                    />
                  </template>

                  <p v-html="branch.parent.domanda"></p>
                  <template v-if="branch.assistance">
                    <br>
                    <p>
                      <router-link class="lms-link" :to="formRoute">Contatta l'assistenza</router-link>
                      per descrivere il problema riscontrato!
                    </p>
                  </template>

                </q-chat-message>
              </template>
              <q-chat-message
                bg-color="chat-blue"
                class="col-12 col-sm-6 offset-sm-6 "
                v-if="branch.children && branch.children.length>0"
                sent
              >
                <template v-slot:avatar>
                  <q-icon
                    style="left:16px"
                    size="sm"
                    name="img:images/avatar-user.svg"
                  />
                </template>
                <lms-buttons reverse>
                  <assistance-answer-btn
                    v-for="child in branch.children" :key="child.nid"
                    :outline="!child.selezionato"
                    @click="selectAnswer(child, index)"
                  >
                    <div v-html="child.risposta">{{ child.risposta }}</div>
                  </assistance-answer-btn>
                </lms-buttons>
              </q-chat-message>
            </div>
            <div v-show="isBranchLoading" class="q-pa-lg text-center">
              <q-spinner-dots color="primary" size="48px" :thickness="3"/>
            </div>
          </q-card>
        </div>
      </q-slide-transition>
    </template>


    <lms-inner-loading block :showing="isLoading"/>
  </lms-page>
</template>

<script>
import {questionsList} from "src/services/api";
import {apiErrorNotify, equalsIgnoreCase, isEmpty} from "src/services/utils";
import LmsScrollHorizontal from "components/core/LmsScrollHorizontal";
import AssistanceAnswerBtn from "components/AssistanceAnswerBtn";
import {NEW_REQUEST_SPECIFIC} from "src/router/routes";

export default {
  name: "PageAssistanceTree",
  components: {AssistanceAnswerBtn, LmsScrollHorizontal},
  data() {
    return {
      appService: null,
      rootList: [],
      rootItem: null,
      children: null,
      questions: [],
      isLoading: false,
      isVisibile: false,
      activeBranch: null,
      isBranchLoading: false,
      contactAssistance: false,
      appServiceCode: '',
    }
  },
  computed: {
    cf() {
      return this.$store.getters["getUser"].cf;
    },
    appList() {
      return this.$store.getters['getAppList']
    },
    serviceName() {
      return this.appService ? this.appService.descrizione : ''
    },

    formRoute() {
      let name = NEW_REQUEST_SPECIFIC.name
      let params= {serviceid: this.appServiceCode }
      let query = {
        op: this.rootItem?.nid,
        op_label: this.rootItem?.titolo,
        pa_list: this.selectedChildrenList?.join(',')
      }
      return {name, params, query}
    },
    showScrollCards() {
      return this.$q.screen.lt.sm && this.rootList.length > 1 || this.$q.screen.gt.xs && this.rootList.length > 5
    },
    isEmptyRootList() {
      return isEmpty(this.rootList) && !this.isLoading
    },
    selectedChildrenList(){
      let list =[]
      this.questions?.forEach(question => {
        let selectedChild = question.children.find(child => child.selezionato)
        if(selectedChild)
          list.push(selectedChild.nid)
      })
      return list
    }

  },
  created() {
    this.appServiceCode = this.$route.params?.serviceid
    this.appService = this.appList.find(a => equalsIgnoreCase(a.portale_codice, this.appServiceCode))
    this.getRootList()
  },
  methods: {
    isEmpty,
    async getRootList() {
      this.isLoading = true
      try {
        let params = {
          op: 'empty',
          codice_servizio: this.appServiceCode
        }
        let response = await questionsList({params})
        this.rootList = response.data

      } catch (e) {
        apiErrorNotify({error: e, message: 'Non è stato possibile reperire i percorsi'})
      } finally {
        this.isLoading = false
      }

    },
    async getChildrenList(parent) {
      this.isBranchLoading = true
      this.children = []
      try {
        let params = {
          pa: parent.nid,
          codice_servizio: this.appServiceCode
        }
        let response = await questionsList({params})
        this.children = response.data
        if (isEmpty(this.children)) {
          this.activeBranch = {
            parent: parent,
            children: [],
            assistance: parent.contattare_assistenza
          }
        } else {
          this.activeBranch = {
            parent: parent,
            children: this.children,
            assistance: false
          }
        }
        this.questions = this.questions.concat(this.activeBranch)
      } catch (e) {
        apiErrorNotify({error: e, message: 'Non è stato possibile reperire i percorsi'})
      } finally {
        this.isBranchLoading = false
      }


    },
    async showTree(root) {
      if (this.rootItem?.nid === root?.nid) {
        this.isVisibile = false
        this.rootItem = null
        return
      }
      this.isBranchLoading = true
      this.isVisibile = true
      this.rootItem = root

      this.questions = []
      await this.getChildrenList(root)

    },

    selectAnswer(child, branchIndex) {
      this.questions[branchIndex]?.children?.forEach(c => {
        c.selezionato = c === child
        return c
      })
      this.questions.length = branchIndex + 1
      this.getChildrenList(child)
    },

  }
}
</script>

<style lang="sass">
.root-card
  border: 2px solid #fff

  &:hover
    border: 2px solid rgba($lms-primary-light, 0.6)
    box-shadow: 0px 0px 5px rgba($lms-primary-light, 0.5)
    -webkit-box-shadow: 0px 0px 5px rgba($lms-primary-light, 0.5)
    -moz-box-shadow: 0px 0px 5px rgba($lms-primary-light, 0.5)

  &.active, &.home:hover
    margin: 0
    border: 2px solid $lms-primary-light
    box-shadow: 0px 0px 10px $lms-primary-light
    -webkit-box-shadow: 0px 0px 10px $lms-primary-light
    -moz-box-shadow: 0px 0px 10px $lms-primary-light

.root-card__title
  margin: 0
  font-weight: bold

.aid-tree
  //border: 2px solid rgba($lms-primary-light, 0.6)
  p
    margin: 0


</style>
