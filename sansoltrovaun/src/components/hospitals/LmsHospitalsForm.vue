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
      <q-field
        label="Tipo struttura"
        stack-label
        borderless
        color="black"
        :class="{'alignLabel' : $q.screen.gt.sm}"
      >
        <q-option-group
          @input="setType"
          v-model="inputType"
          :options="typesOptions"
          :inline="$q.screen.gt.xs"
        />
      </q-field>

    </div>
  </div>
</template>

<script>
  import { getSuggestDoctors} from "../../services/api";
  import {isEmpty, orderBy, capitalize, deepClone} from "../../services/utils";
  import {DOCTOR_TYPES_LABEL} from "../../services/config";

  export default {
    name: "LmsHospitalsForm",
    components: {},
    data(){
      return{
        name:'',
        type:'',
        onSearchingName:false,
        suggestedNamesOptions:[],
        isSearchFinished:false,
        hospitalsList: [],
        offset: 0,
        isOpenFilter: false,
        isShowingForm:true,
        inputName:'',
        typeOptions:[],
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
      hospitalsTypes(){
        return this.$store.getters["getHospitalsTypes"];
      },
      typesOptions(){
        let types = deepClone(this.hospitalsTypes)
        if(!isEmpty(types)){
          types = types.map( type => {
            let label = capitalize(type.descrizione)
            return {label: label, value: type.codice}
          })
          types = orderBy(types, ['label'])
        }
        types.push( {
          label: 'Tutti',
          value: ''
        },)
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
        let type =this.hospitalsTypes.find(t => t.codice === this.inputType ) ?? null

        let typeLabel = type ? capitalize(type.descrizione) : ''
        this.$emit('set-type', {label: typeLabel, value: this.inputType})
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

    },

  }
</script>

<style lang="sass">
  .alignLabel
    margin-top: -16px
</style>
