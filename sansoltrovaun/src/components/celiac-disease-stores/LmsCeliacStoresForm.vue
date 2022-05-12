<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="row items-center q-col-gutter-x-xl">
    <div class="col-12 col-md-6">
      <q-input
        v-model="name"
        label="Nome negozio"
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
        label="Tipo negozio"
        v-model="type"
        bottom-slots
        :options="typesOptions"
        @input="setType"
        clearable
        :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
      />

    </div>
  </div>
</template>

<script>
  import {capitalize, deepClone, isEmpty, orderBy} from "../../services/utils";
  import {getSuggestDoctors} from "../../services/api";

    export default {
        name: "LmsCeliacStoresForm",
        data(){
          return{
            name:'',
            type:'',
            onSearchingName:false,
            suggestedNamesOptions:[],
            isSearchFinished:false,
            storesList: [],
            offset: 0,
            isOpenFilter: false,
            isShowingForm:true,
            inputName:'',
            inputType:''
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
                if(val.type !== oldVal.type && isEmpty(val.type)) this.inputType = ''
              }
            }
          }
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
        storesTypes(){
          return this.$store.getters["getCeliacStoresTypes"];
        },
        typesOptions(){
          let types = deepClone(this.storesTypes)
          if(!isEmpty(types)){
            types = types.map( type => {
              return {label: type.descrizione, value: type.codice}
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
            this.inputType = this.type ? this.type.value : ''
          }

        },

        setType(val){
          this.$emit('set-type', val)
        },
        onInputName(val){
          this.inputName= val

        },
        clearName(){
          this.name = ''
          this.$emit('set-name', this.name)
        },
        setName(val, done){
          //this.name = this.inputName
          this.$emit('set-name', this.name)
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

      },
    }
</script>

<style scoped>

</style>
