<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title no-back>Benvenuto in Assistenza </lms-page-title>
    <div class="q-my-lg text-body1">Hai un problema? Segui i percorsi guidati</div>

    <q-card >
      <q-card-section>
        <div class="text-h6">Seleziona il servizio per il quale desideri ricevere assistenza</div>
        <q-select
          v-model="appServiceCode"
          :options="appList"
          option-label="descrizione"
          option-value="portale_codice"
          emit-value
          map-options
          label="Seleziona il Servizio"
          @input="setAppService"
        />

      </q-card-section>
    </q-card>

    <template v-if="!isLoading">
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
            <q-card class="root-card fit cursor-pointer" @click="showTree(root)" :class="{'active': root===selectedRoot}">
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
              <div>
                <q-tree
                  ref="tree"
                  :nodes="treeOptions"
                  node-key="id"
                >
                  <template v-slot:default-header="prop" >
                    <div class="row items-center  q-py-sm">
                      <div class="col-auto"> <q-icon :name="prop.node.icon"  size="24px" class="q-mr-sm" /></div>

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
import {apiErrorNotify, equalsIgnoreCase, isEmpty, orderBy} from "src/services/utils";
import LmsScrollHorizontal from "components/core/LmsScrollHorizontal";
import AssistanceAnswerBtn from "components/AssistanceAnswerBtn";
import {ASSISTANCE_TREE_TEST, NEW_REQUEST_SPECIFIC} from "src/router/routes";
import {APP_SERVICES_MAP} from "src/services/config";
export default {
  name: "PageAssistanceTreeTest",
  components: { LmsScrollHorizontal},
  data() {
    return {
      selectedRoot: null,
      isLoading: false,
      isVisibile: false,
      activeBranch: null,
      isBranchLoading: false,
      contactAssistance: false,
      appServiceCode: '',
      serviceAppTrees: [],
      rootList:[]
    }
  },
  mounted() {

  },
  computed: {
    cf() {
      return this.$store.getters["getUser"].cf;
    },
    appList() {
      let appList =  this.$store.getters['getAppList'];
      let visibleAppList =  appList.filter(app => app.albero_aiuti_visibile)
      return orderBy(visibleAppList, ['descrizione'])
    },
    formRoute() {
      return {
        name: NEW_REQUEST_SPECIFIC.name,
        params: {serviceid: this.appServiceCode}
      }
    },
    showScrollCards() {
      return this.$q.screen.lt.sm && this.rootList.length > 1 || this.$q.screen.gt.xs && this.rootList.length > 5
    },
    isEmptyRootList() {
      return isEmpty(this.rootList)
    },

    treeOptions(){
      let options = {}
      if(this.selectedRoot){
        let root= this.selectedRoot


        options = {
          label: root.domanda,
          icon: 'img:images/avatar-operator.svg',
          id:root.nid,
          children: this.getAnswers(root),
          header:'question'
        }

      }
      return [options]
    }
  },
  created() {
    let {id} = this.$route.query
    this.appServiceCode = id
    if(id)
      this.getTreesList()
  },
  methods: {
    isEmpty,
    setAppService(val){
      let route = {
        name: ASSISTANCE_TREE_TEST.name,
        query:{id: this.appServiceCode}
      }
      this.$router.replace(route)
      this.getTreesList()
    },
    async getTreesList() {
      this.isLoading = true
      try {
        let params = {
          codice_servizio: this.appServiceCode
        }
        let paramsOp= {
          codice_servizio: this.appServiceCode,
          op: 'empty'
        }
        let questionsPromise = questionsList({params})
        let questionsRootPromise = questionsList({params:paramsOp})
        let questionsResponse = await questionsPromise
        let rootResponse = await questionsRootPromise

        this.serviceAppTrees = questionsResponse.data
        this.rootList = rootResponse.data


      } catch (e) {
        apiErrorNotify({error: e, message: 'Non è stato possibile reperire i percorsi'})
      } finally {
        this.isLoading = false

      }

    },
    getQuestions(node){
      return [{
        label: node.domanda,
        icon: 'img:images/avatar-operator.svg',
        header:'question',
        id: `${node.titolo}_answer`,
        assistance: node.contattare_assistenza,
        children : this.getAnswers(node)}]

    },
    getAnswers(node) {
    let childrenList = this.serviceAppTrees.filter(n=> n.percorso_albero === node.nid)
      let children = []

      for(let i =0; i<childrenList?.length; i++){
        let child= childrenList[i]
        children.push(
          {
            label: child.risposta,
            icon: 'img:images/avatar-user.svg',
            header:'answer',
            id: `${child.titolo}_${i}`,
            children:this.getQuestions(child)
          }
        )
      }

    return children

    },
    async showTree(root) {
      if (this.selectedRoot?.nid === root?.nid) {
        this.isVisibile = false
        this.selectedRoot = null
        return
      }
      this.isBranchLoading = true
      this.isVisibile = true
      this.selectedRoot = root
      setTimeout( () => {this.$refs.tree.expandAll()}, 300)


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
