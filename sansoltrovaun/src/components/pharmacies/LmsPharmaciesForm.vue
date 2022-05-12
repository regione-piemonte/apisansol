<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="row items-center q-col-gutter-x-xl">
            <div class="col-12 col-md-6">
              <q-input
                v-model="name"
                label="Nome farmacia"
                bottom-slots
                @clear="clearName"
                @blur="setName"
                clearable
              />
<!--              <q-select-->
<!--                ref="nameSelect"-->
<!--                v-model="name"-->
<!--                clearable-->
<!--                :loading="onSearchingName"-->
<!--                use-input-->
<!--                hide-selected-->
<!--                fill-input-->
<!--                no-error-icon-->
<!--                hide-dropdown-icon-->
<!--                bottom-slots-->
<!--                input-debounce="0"-->
<!--                label="Nome Farmacia"-->
<!--                :options="suggestedNamesOptions"-->
<!--                @filter="filterByName"-->
<!--                @input-value="onInputName"-->
<!--                @blur="setName"-->
<!--                @input="setName"-->
<!--                @clear="clearName"-->
<!--                :error="!isValidName"-->
<!--                error-message="Inserire un nome valido."-->
<!--              >-->
<!--              </q-select>-->
            </div>
          </div>
</template>

<script>
    import { getSuggestDoctors} from "../../services/api";
    import {isEmpty} from "../../services/utils";

    export default {
      name: "LmsPharmaciesForm",
      components: {},
      data(){
        return{
          name:'',
          onSearchingName:false,
          suggestedNamesOptions:[],
          isSearchFinished:false,
          pharmaciesList: [],
          offset: 0,
          isOpenFilter: false,
          isShowingForm:true,
          inputName:''
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
          filters(){
            return {
              name: this.name,
            }
          }
        },
        methods:{
        setDefaultFilters(){
          if(this.defaultFilters){
            this.name= this.defaultFilters.name
          }

        },

          setType(val){
            this.$emit('set-type', this.type)
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
              name: this.name

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
