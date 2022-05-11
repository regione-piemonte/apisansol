<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title no-back>Benvenuto in Assistenza</lms-page-title>

    <template v-if="!isLoading">
      <template v-if="!appService || !selectedRoot">
        <q-banner class="h-banner h-banner--info q-my-lg">
          <div class="text-body1">
            Non ci sono percorsi guidati.
          </div>
        </q-banner>
      </template>
      <template v-else>
        <div class="row items-center q-col-gutter-x-xs">
          <h4 class="col-auto">Servizio: </h4>
          <h2 class="col"> {{ appService.descrizione }}</h2>
        </div>
        <div class="row items-stretch q-mt-md">

          <q-card class="root-card col-12 col-sm-6 col-md-4 cursor-pointer active" @click="toggleTree">
            <q-card-section>
              <div class="root-card__title text-h6">
                {{ selectedRoot.titolo }}
              </div>
            </q-card-section>
          </q-card>
        </div>
        <!--  ALBERO DEGLI AIUTI -->
        <q-slide-transition>
          <div v-show="isVisibile" class="q-mt-md">
            <q-card class="bg-white q-pa-lg aid-tree" flat>
              <div>
                <q-tree
                  ref="tree"
                  :nodes="treeOptions"
                  node-key="id"
                >
                  <template v-slot:default-header="prop">
                    <div class="row items-center  q-py-sm">
                      <div class="col-auto">
                        <q-icon :name="prop.node.icon" size="24px" class="q-mr-sm"/>
                      </div>

                      <q-banner rounded class="col q-py-sm q-px-md"
                                :class="prop.node.header === 'question' ? 'bg-chat-pink': 'bg-chat-blue' ">

                        <div class="text-bold text-body1" v-html="prop.node.label"></div>
                        <div v-if="prop.node.assistance">
                          <br>
                          <p class="text-bold text-body1">
                            <router-link class="lms-link" :to="formRoute">Contatta l'assistenza</router-link>
                            per descrivere il problema riscontrato!
                          </p>
                        </div>

                      </q-banner>
                    </div>
                  </template>

                </q-tree>
              </div>
              <!--            <div v-show="isBranchLoading" class="q-pa-lg text-center">-->
              <!--              <q-spinner-dots color="primary" size="48px" :thickness="3"/>-->
              <!--            </div>-->
            </q-card>
          </div>
        </q-slide-transition>

      </template>
    </template>
    <lms-inner-loading block :showing="isLoading"/>
  </lms-page>
</template>

<script>
import {questionsList} from "src/services/api";
import {apiErrorNotify, isEmpty, orderBy} from "src/services/utils";
import LmsScrollHorizontal from "components/core/LmsScrollHorizontal";
import AssistanceAnswerBtn from "components/AssistanceAnswerBtn";
import {NEW_REQUEST_SPECIFIC} from "src/router/routes";

export default {
  name: "PageAssistanceTreeUserAnswers",
  components: {},
  data() {
    return {
      appService: null,
      selectedRoot: null,
      isLoading: false,
      isVisibile: false,
      isBranchLoading: false,
      contactAssistance: false,
      serviceId: '',
      serviceAppTrees: [],
      rootList: [],
      isUserAssistancePath: false,
      userSelectedRoot: null,
      userSelectedChildren: [],
      treeOptions: null
    }
  },
  mounted() {

  },
  computed: {
    cf() {
      return this.$store.getters["getUser"].cf;
    },
    appList() {
      let appList = this.$store.getters['getAppList'];
      let visibleAppList = appList.filter(app => app.albero_aiuti_visibile)
      return orderBy(visibleAppList, ['descrizione'])
    },

    formRoute() {
      return {
        name: NEW_REQUEST_SPECIFIC.name,
        params: {serviceid: this.serviceId}
      }
    },
    showScrollCards() {
      return this.$q.screen.lt.sm && this.rootList.length > 1 || this.$q.screen.gt.xs && this.rootList.length > 5
    },
    isEmptyRootList() {
      return isEmpty(this.rootList)
    },
  },

  created() {

    let {root, pa} = this.$route.query
    if (root) {
      this.isUserAssistancePath = true
      this.userSelectedRoot = root
      this.userSelectedChildren = pa?.split(',') ?? []
    }
    this.serviceId = this.$route.params?.serviceid
    this.appService = this.appList.find(a => a.portale_codice === this.serviceId)
    if(this.serviceId)
      this.getTreesList()

  },
  methods: {
    isEmpty,
    async getTreesList() {
      this.isLoading = true
      try {
        let params = {
          codice_servizio: this.serviceId
        }
        let paramsOp = {
          codice_servizio: this.serviceId,
          op: 'empty'
        }
        let questionsPromise = questionsList({params})
        let questionsRootPromise = questionsList({params: paramsOp})
        let questionsResponse = await questionsPromise
        let rootResponse = await questionsRootPromise

        this.serviceAppTrees = questionsResponse.data
        this.rootList = rootResponse.data
        if (this.isUserAssistancePath)
          this.getUserSelectedTree()

      } catch (e) {
        apiErrorNotify({error: e, message: 'Non è stato possibile reperire i percorsi'})
      } finally {
        this.isLoading = false
      }
    },
    getQuestion(node, index) {
      return [{
        label: node.domanda,
        icon: 'img:images/avatar-operator.svg',
        header: 'question',
        id: `${node.nid}_question`,
        assistance: node.contattare_assistenza,
        children: this.getAnswer(index)
      }]

    },
    getAnswer(index) {
      let child = this.serviceAppTrees.find(n => n.nid === this.userSelectedChildren[index])
      if (!child) return null
      return [{
        label: child.risposta,
        icon: 'img:images/avatar-user.svg',
        header: 'answer',
        id: child.nid,
        children: this.getQuestion(child, index + 1)
      }]

    },
    async toggleTree() {
      this.isVisibile = !this.isVisibile
    },
    getUserSelectedTree() {
      this.selectedRoot = this.rootList.find(r => r.nid === this.userSelectedRoot)
      let options = null
      if (this.selectedRoot) {
        this.isBranchLoading = true
        this.isVisibile = true

        options = [{
          label: this.selectedRoot.domanda,
          icon: 'img:images/avatar-operator.svg',
          id: this.selectedRoot.nid,
          children: this.getAnswer(0),
          header: 'question'
        }]

      }
      this.treeOptions = options
      setTimeout(() => {
        this.$refs.tree.expandAll()
      }, 300)
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
