<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="row items-center q-col-gutter-x-xl">
    <div class="col-12 col-md-6">
      <q-select
        v-model="name"
        clearable
        use-input
        hide-selected
        fill-input
        no-error-icon
        hide-dropdown-icon
        bottom-slots
        input-debounce="0"
        label="Nome medico"
        :loading="onSearchingName"
        :options="suggestedNamesOptions"
        @filter="filterByName"
        @filter-abort="abortFilterByName"
        @input-value="onInputName"
        @blur="setName"
        @clear="clearName"
        :error="!isValidName"
        error-message="Inserire un nome valido."
        :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
      >

      </q-select>
    </div>
    <div class="col-12 col-md-6">
      <q-field
        label="Tipo"
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
  import {doctorsOfficesListResults, getSuggestDoctors} from "../../services/api";
  import {deepClone, isEmpty} from "../../services/utils";

  import {DOCTOR_TYPES_LABEL} from "src/services/config";

  export default {
    name: "LmsDoctorsForm",
    components: {},
    data() {
      return {
        name: '',
        type: '',
        onSearchingName: false,
        suggestedNamesOptions: [],
        isSearchFinished: false,
        doctorsList: [],
        offset: 0,
        isOpenFilter: false,
        isShowingForm: true,
        inputName: '',
        inputType: '',
        isGettingDefaultName: false
      }
    },
    props: {
      defaultFilters: {type: Object, required: false, default: null},
      resetFilters: {type: Object, required: false, default: null},
    },
    watch: {
      resetFilters: {
        handler(val, oldVal) {
          if (!isEmpty(val)) {
            this.name = val.name
            this.type = val.type
            if (val.type !== oldVal.type && isEmpty(val.type)) this.inputType = ''
          }
        }
      }
    },
    created() {
      if (this.$q.screen.lt.md && !this.hideChips) this.isShowingForm = false
      this.setDefaultFilters()
    },
    computed: {
      areNoSuggestions() {
        return this.suggestedNamesOptions.length === 0 && !isEmpty(this.inputName)
      },
      isValidName() {
        let validation = !this.areNoSuggestions || isEmpty(this.inputName) || this.isGettingDefaultName
        this.$emit('is-valid', validation)
        return validation
      },
      typesOptions() {
        let types = deepClone(this.$store.getters["getDoctorTypes"]);
        if (!isEmpty(types))
          types = types.map(type => {
            let normalizedType = DOCTOR_TYPES_LABEL.find(t => type.id === t.value)
            return {label: normalizedType.label, value: type.id}
          })
        types.push({
          label: 'Tutti',
          value: ''
        },)
        return types
      },
      filters() {
        return {
          name: this.name,
          type: this.type,
        }
      }
    },
    methods: {
      async setDefaultFilters() {
        if (this.defaultFilters) {
          this.name = this.defaultFilters.name
          this.type = this.defaultFilters.type
          this.inputType = this.type ? this.type.value : ''
        }
        if (this.name) {
          this.isGettingDefaultName = true
          let params = {s: this.name};
          let namesResponse = await getSuggestDoctors({_no5XXRedirect: true, params: params});
          this.suggestedNamesOptions = namesResponse.data
          this.isGettingDefaultName = false
        }
      },

      setType(val) {
        let type = DOCTOR_TYPES_LABEL.find(t => val === t.value) ?? ''
        let typeLabel = type?.label ?? ''
        this.$emit('set-type', {label: typeLabel, value: val})
      },
      onInputName(val) {
        this.inputName = val
        if(isEmpty(this.inputName) || this.inputName.length<2){
          this.suggestedNamesOptions = []
        }
        this.name = this.inputName
      },
      clearName() {
        this.name = ''
        this.$emit('set-name', this.name)
      },
      setName(val, done) {
        console.log('setName[]')
        this.name = this.inputName
        this.$emit('set-name', this.name)
      },
      async filterByName(val, update, abort) {
        if (val.length < 2 || isEmpty(val)) {
          console.log('suggestedNamesOptions[]')

          abort()
          return
        }
        this.onSearchingName = true
        update()
        let params = {s: val};
        let options = []
        try {
          let namesResponse = await getSuggestDoctors({_no5XXRedirect: true, params: params});
          options = namesResponse.data
        } catch (e) {

        } finally {
          update(() => {
            this.suggestedNamesOptions = options
            this.onSearchingName = false
          })
        }


      },
      abortFilterByName() {
      },
      setFilterQuery() {
        return {
          name: this.name,
          type: this.type,
        }
      },
      searchItems() {
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
