<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="row items-center q-col-gutter-x-xl">
    <div class="col-12 col-md-6">
      <q-input
        v-model="name"
        label="Nome struttura"
        bottom-slots
        @clear="clearName"
        @blur="setName"
        clearable
      />

<!--      <q-select-->
<!--        ref="nameSelect"-->
<!--        v-model="name"-->
<!--        clearable-->
<!--        :loading="onSearchingName"-->
<!--        use-input-->
<!--        hide-selected-->
<!--        fill-input-->
<!--        no-error-icon-->
<!--        hide-dropdown-icon-->
<!--        bottom-slots-->
<!--        input-debounce="0"-->
<!--        label="Nome struttura"-->
<!--        :options="suggestedNamesOptions"-->
<!--        @filter="filterByName"-->
<!--        @input-value="onInputName"-->
<!--        @blur="setName"-->
<!--        @input="setName"-->
<!--        @clear="clearName"-->
<!--        :error="!isValidName"-->
<!--        error-message="Inserire un nome valido."-->
<!--      >-->

<!--      </q-select>-->
    </div>
    <div class="col-12 col-md-6">
      <q-select
        label="Tipo assistenza"
        v-model="type"
        use-input
        fill-input
        no-error-icon
        bottom-slots
        hide-selected
        input-debounce="0"
        :options="typeOptions"
        @filter="filterType"
        @input="setType"
        clearable
        :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
      />

    </div>
  </div>
</template>

<script>
  import { getSuggestDoctors} from "../../services/api";
  import {isEmpty, orderBy} from "../../services/utils";

  export default {
    name: "LmsFacilitiesForm",
    components: {},
    data(){
      return{
        name:'',
        type:'',
        inputType:'',
        onSearchingName:false,
        suggestedNamesOptions:[],
        isSearchFinished:false,
        facilitiesList: [],
        offset: 0,
        isOpenFilter: false,
        isShowingForm:true,
        inputName:'',
        typeOptions:[]
      }
    },
    props:{
      defaultFilters: {type:Object, required:false, default:null},
      resetFilters: {type:Object, required:false, default:null},
    },
    watch:{
      resetFilters:{
        handler(val, oldVal){
          if(!isEmpty(val)){
            this.name = val.name
            this.type = val.type
          }
        }
      },

    },
    created(){
      if(this.$q.screen.lt.md && !this.hideChips) this.isShowingForm = false

      this.setDefaultFilters()
    },
    computed:{
      areNoSuggestions(){
        return this.suggestedNamesOptions.length === 0 && !isEmpty(this.inputName)
      },
      isValidName(){
        let validation = !this.areNoSuggestions || isEmpty(this.inputName)
        this.$emit('is-valid', validation)
        return validation
      },
      typeFacilitiesOptions(){
        let types = this.$store.getters["getFacilitiesTypes"];
        if(!isEmpty(types)){
          types = types.map( type => {
            return {label: type.label, value: type.codice}
          })
          types = orderBy(types, ['label'])
        }

        return types
      },
      filters(){
        return {
          name: this.name,
          type: this.type,
        }
      }
    },
    methods:{
      setDefaultFilters(){
        if(this.defaultFilters){
          this.name= this.defaultFilters.name
          this.type= this.defaultFilters.type

        }
        this.typeOptions = this.typeFacilitiesOptions
      },

      setType(val, done){

        //this.type = val.value
        this.$emit('set-type', val)
      },
      onInputName(val){
        this.inputName= val
      },
      clearName(){
        this.name = ''
        this.$emit('set-name', this.name)
      },
      clearType(){
        this.inputType = null
      },
      setName(val, done){
       // this.name = this.inputName
        this.$emit('set-name', this.name)
      },
      filterByName(val, update, abort){
        if (val.length < 2) {
          abort()
          return
        }
        update(async () => {
          this.onSearchingName = true
          let params = {s: val};
          let namesResponse = await getSuggestDoctors({_no5XXRedirect: true, params: params});
          let options = namesResponse.data
          this.suggestedNamesOptions = options
          this.onSearchingName = false
        })
      },
      setFilterQuery(){
        return {
          name: this.name,
          type: this.type,
          // address: this.selectedAddress,
          // distance: this.distance
        }
      },
      searchItems(){
        let params = this.setFilterQuery()
        this.$emit('query-params', params)
      },
      filterType(val, update, abort){
        update(() => {
          const needle = val.toLowerCase()
          this.typeOptions = this.typeFacilitiesOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
        })
      }
    },

  }
</script>

<style lang="sass">
  .alignLabel
    margin-top: -16px
</style>
