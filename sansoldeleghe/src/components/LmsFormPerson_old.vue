<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>

        <q-form
          ref="formPerson"
          v-bind="attrs"
          greedy
          class="lms-form-person " :class="$q.screen.lt.md ? 'q-gutter-lg' : 'q-gutter-md'"
          v-on="listeners"
        >
          <!-- NOME -->
          <!-- ----------------------------------------------------------------------------------------------------------- -->
          <q-input
            type="text"
            v-model="name"
            label="Nome"
            @input="onInput('name', $event)"
            required
            reactive-rules
            bottom-slots
            :rules="[v => $rules.required(v) || 'Campo obbligatorio',
          v => $rules.alpha(v) || 'Deve essere composto solo da caratteri alfabetici'  ]"
            no-error-icon
          />

          <!-- COGNOME -->
          <!-- ----------------------------------------------------------------------------------------------------------- -->
          <q-input
            v-if="!useTheParent"
            type="text"
            v-model="surname"
            label="Cognome"
            @input="onInput('surname', $event)"
            required
            reactive-rules
            bottom-slots
            :rules="[v => $rules.required(v) || 'Campo obbligatorio',
          v => $rules.alpha(v) || 'Deve essere composto solo da caratteri alfabetici' ]"
            no-error-icon
          />
          <q-input
            v-else
            type="text"
            v-model="surname"
            label="Cognome"
            @input="onInput('surname', $event)"
            required
            reactive-rules
            bottom-slots
            :rules="[v => $rules.required(v) || 'Campo obbligatorio',
          v => $rules.alpha(v) || 'Deve essere composto solo da caratteri alfabetici' ]"
            no-error-icon

          >
            <template v-slot:hint>
              <div v-if="isBirthPlaceInputDisabled" class="text-warning">Seleziona prima la data di nascita</div>
            </template>
          </q-input>


          <!-- DATA NASCITA -->
          <!-- ----------------------------------------------------------------------------------------------------------- -->
          <q-input
            required
            label="Data di nascita"
            v-model="birthDate"
            mask="##/##/####"
            @input="onInput('birthDate', $event)"
            placeholder="gg/mm/aaaa"
            no-error-icon
            reactive-rules
            bottom-slots
            :rules="[v => $rules.required(v) || 'Campo obbligatorio',
                     v=> $rules.date(v) || 'Inserire una data valida']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="examDateProxy" v-model="showBirthDateCalendar">
                  <q-date
                    :default-year-month="defaultDate"
                    v-model="birthDate"
                    minimal
                    :mask=FORMAT_DATE
                    @input="showBirthDateCalendar=false"
                    :options="rangeDateOptions"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <!-- LUOGO NASCITA -->
          <!-- ----------------------------------------------------------------------------------------------------------- -->
          <q-select
            :disable="isBirthPlaceInputDisabled"
            v-model="birthPlace"
            label="Comune di nascita"
            required
            :rules="[v => $rules.required(v) || 'Campo obbligatorio']"
            no-error-icon
            :options="birthPlaceOptions"
            @filter="onBirthPlaceSearch"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            clearable
            bottom-slots
            hide-dropdown-icon
            reactive-rules
            :loading="onSearchingPlace"
          >
            <template v-slot:hint>
              <div v-if="isBirthPlaceInputDisabled" class="text-warning">Seleziona prima la data di nascita</div>
              <template v-else>
                <div>Stato di nascita se straniero</div>
                <div>Non trovi la tua città/nazione? Controlla se il suo nome era lo stesso il {{birthDate}}</div>
              </template>
            </template>
          </q-select>


          <!-- CODICE FISCALE -->
          <!-- ----------------------------------------------------------------------------------------------------------- -->
          <lms-input-tax-code
            required
            no-error-icon
            v-model="taxCode"
            bottom-slots
            reactive-rules
            @input="onInput('taxCode', $event)"
            :rules="[
            v => $rules.required(v) || 'Campo obbligatorio',
            v => $rules.alphaNum(v) || 'Deve essere composto solo da caratteri alfabetici',
            v => $rules.length(v, LENGTH) || `Deve avere esattamente ${LENGTH} caratteri`,
            v => $rules.taxCodeValidCin(v) || 'Il codice di controllo non è corretto, potrebbero esserci degli errori di battitura',
            v => $rules.taxCodeValidName(v, name) || `Il nome impostato non corrisponde`,
             v => $rules.taxCodeValidSurname(v, surname) || `Il cognome impostato non corrisponde`,
              v => $rules.taxCodeValidMonth(v, timestampBirthDate) || `Il mese di nascita impostato non corrisponde`,
            ]"
          >
            <template v-slot:hint>
              <div v-if="hasTaxCodeWarning" class="text-warning">
                <div v-if="!taxCodeWarnings.taxCodeYear">L'anno di nascita potrebbe non corrispondere</div>
                <div v-if="!taxCodeWarnings.taxCodeDay">Il giorno di nascita potrebbe non corrispondere</div>
                <div v-if="!taxCodeWarnings.taxCodeGender">Il sesso potrebbe non corrispondere</div>
              </div>
            </template>

          </lms-input-tax-code>
          <!-- SESSO-->
          <!-- ----------------------------------------------------------------------------------------------------------- -->

          <q-field
            label="Sesso"
            stack-label
            borderless
            required
            v-model="gender"
            color="black"
            reactive-rules
            no-error-icon
            :rules="[v => $rules.required(v) || 'Campo obbligatorio']"
          >
            <q-option-group
              @input="onInput('gender', $event)"
              v-model="gender"
              :options="[
              { label: 'Maschio', value: 'M' },
              { label: 'Femmina', value: 'F' },
            ]"
              :inline="$q.screen.gt.xs"
            />
          </q-field>
        </q-form>


</template>

<script>
import {capitalize, isEmpty, orderBy} from "src/services/utils";
import {
  hasValidCin, hasValidForm,
  hasValidLength,
  LENGTH,
  taxCodeDay,
  taxCodeGender, taxCodeMonth,
  taxCodeName, taxCodeSurname,
  taxCodeYear
} from "src/services/tax-code";
import {date, format} from "quasar";
import LmsInputTaxCode from "components/core/LmsInputTaxCode";
import {getCities, getCountries} from "src/services/api";
import {hasFalseValue} from "src/services/business-logic";
import {FORMAT_DATE} from "src/services/config";

export default {
  name: "LmsFormPersonOld",
  components: {LmsInputTaxCode},
  props: {
    defaultParams: {type: Object, required: false, default: null},
    birthPlaceAutoSelectSinglePerfectMatch: {type: Boolean, required: false, default: false},
    useTheParent: {type: Boolean, required: false, default: false},
    isMinor:{type:Boolean,required: false, default: false}
  },
  data() {
    return {
      FORMAT_DATE,
      LENGTH,
      name: '',
      surname: '',
      birthDate: '',
      birthPlace:null,
      taxCode: '',
      gender:null,
      minBirthDate: null,
      maxBirthDate: null,
      allParents: false,
      singleParent: false,
      TAX_CODE_LENGTH: LENGTH,
      countries: [],
      cities: [],
      isBirthPlaceInvalid: false,
      surnameOfTheParent: this.surname,
      showBirthDateCalendar:false,
      onSearchingPlace:false,
      showWarningAlert:false,
      isChekingForm:false,
      defaultDate:'',
      isLoading:false,
    }
  },
  watch:{
    defaultParams:{
      immediate:true,
      deep:true,
      handler(val, oldVal){
        this.$emit('update:defaultParams', val)
        this.setDefaultParams()
      }
    },
    formParams:{
      deep:true,
      handler(val, oldVal){
        console.log('ipdate')
        this.$emit('update:defaultParams', val)
      }
    }
  },
  computed: {
    timestampBirthDate(){
      return this.birthDate ? date.extractDate(this.birthDate, FORMAT_DATE): null
    },
    listeners() {
      const { ...listeners } = this.$listeners;
      return listeners;
    },
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
    birthPlaceOptions() {
      let countries = this.countries;
      let cities = this.cities;
      let countriesOptions = countries.map(country => {
        let label = this.getBirthPlaceLabel(country);
        return {label, value: label, _model: country}
      });

      let citiesOptions = cities.map(city => {
        let label = this.getBirthPlaceLabel(city);
        return {label, value: label, _model: city}
      });

      let orderedCountries = orderBy(countriesOptions, ['label']);
      let orderedCities = orderBy(citiesOptions, ['label']);

      return [...orderedCountries, ...orderedCities];
    },
   taxCodeWarnings() {
      let result = {};

        let year = this.timestampBirthDate?.getFullYear()
        let day = this.timestampBirthDate?.getDate()

      result.taxCodeYear = taxCodeYear(year)(this.taxCode);
      result.taxCodeDay = taxCodeDay(day)(this.taxCode);
      result.taxCodeGender = taxCodeGender(this.gender)(this.taxCode);
      return result;
    },
    hasTaxCodeWarning() {
      return hasFalseValue(this.taxCodeWarnings) && !isEmpty(this.taxCode)
    },
    // taxCodeErrors(){
    //   // let result = {}
    //   // let month;
    //   // if (this.birthDate) {
    //   //   month = date.formatDate(this.timestampBirthDate, 'MM')
    //   // }
    //   // result.required = !isEmpty(this.taxCode)
    //   // result.validform = hasValidForm(this.taxCode)
    //   // result.taxCodeLength = hasValidLength(this.taxCode)
    //   // result.taxCodeCin = hasValidCin(this.taxCode)
    //   // result.taxCodeName = taxCodeName(this.name)(this.taxCode);
    //   // result.taxCodeSurname = taxCodeSurname(this.surname)(this.taxCode);
    //   // result.taxCodeMonth = taxCodeMonth(month)(this.taxCode);
    //   //
    //    return true;
    // },
    // hasTaxCodeErrors(){
    //   // return hasFalseValue(this.taxCodeErrors)
    // },
    isBirthPlaceInputDisabled() {
      return isEmpty(this.birthDate)
    },
    formParams(){
      return {
        name: this.name,
        surname: this.surname,
        birthDate: date.extractDate(this.birthDate, FORMAT_DATE),
        birthPlace: this.birthPlace?.value,
        taxCode: this.taxCode,
        gender: this.gender
      }
    }

  },

  created() {

  },
  methods: {
    rangeDateOptions(calendarDate, format = 'YYYY/MM/DD'){

      let selectedDate = date.extractDate(calendarDate, format)
      return date.isBetweenDates(selectedDate, this.minBirthDate,this.maxBirthDate, { inclusiveFrom: true, inclusiveTo: true ,  onlyDate: true})
    },

    submitForm(){
      this.$refs.formPerson.validate().then(success => {
        if (success) {

          // if(this.hasTaxCodeWarning){
          //   this.showWarningAlert=true
          //   this.$emit('has-warnings', true)
          //   return
          // }
          // this.$emit('has-warnings', true)
          this.$emit('on-submit', this.formParams, this.hasTaxCodeWarning)
        }
        else {
        }
      })

    },
    goAhead(){
      this.$emit('on-submit', this.formParams)
    },
   async  setDefaultParams() {

      if (this.defaultParams) {
        this.isLoading =true
        let minDate = this.defaultParams.minBirthDate ?? date.subtractFromDate(new Date(), {year: 120})
        let maxDate = this.defaultParams.maxBirthDate ?? date.subtractFromDate(new Date(), {year: 18})
        let birthDate = this.defaultParams.birthDate  ? date.formatDate(this.defaultParams.birthDate, FORMAT_DATE) : ''
        this.name = this.defaultParams.name
        this.surname = this.defaultParams.surname
        this.birthDate = birthDate
        this.taxCode = this.defaultParams.taxCode
        this.gender = this.defaultParams.gender
        this.minBirthDate = minDate
        this.maxBirthDate = maxDate
        await this.searchDefaultBirthPlace(this.defaultParams.birthPlace)

        this.isLoading =false
      }else{
        this.minBirthDate =  date.subtractFromDate(new Date(), {year: 120})
        this.maxBirthDate =  date.subtractFromDate(new Date(), {year: 18})
      }

      this.defaultDate = date.formatDate(this.maxBirthDate, 'YYYY/MM')
    },
    async searchDefaultBirthPlace(searchValue){
      if(!this.defaultParams?.birthDate) return
      let birthDate = date.formatDate(this.defaultParams?.birthDate , 'YYYY-MM-DD')

      let limit = 50;
      let filter = {
        desc: {si: searchValue},
        data_validita: {eq: birthDate},
      };

      let params= {filter, limit};
      let citiesResponse = await getCities({params});
      this.cities = citiesResponse.data;

      //FILTRO APPOSITO PER I PAESI ESTERI: SE L'UTENTE è NATO PRIMA DEL 1965 SETTO DATA FITTIZIA A 1966 PER
      //OVVIARE A ERRORE IN BASE DATI
      filter = {
        territorio: {si: searchValue},
        data_validita: {eq: birthDate},
      };
      if(parseInt(this.birthDate.slice(0,4))<=1965){
        filter = {
          territorio: {si: searchValue},
          data_validita: {eq: '1966-01-01T00:00:00.000+01:00'},
        };
      }

      params = {filter, limit};
      let countriesResponse = await getCountries({params});
      this.countries = countriesResponse.data;

      this.birthPlace = this.birthPlaceOptions.find( place => place?.value?.toLowerCase() === searchValue.toLowerCase())


      this.isLoading = false
    },
    getBirthPlaceLabel(birthPlace) {
      if(birthPlace?.territorio && birthPlace?.territorio!==birthPlace.desc ) {
        return capitalize(birthPlace.desc) + " (" + capitalize(birthPlace.territorio) + ")";
      }else {
        return capitalize(birthPlace.desc)
      }
    },

    // updateBirthPlace() {
    //   this.isBirthPlaceInvalid = !this.birthPlaceOptions.some(b => {
    //     let value = this.birthPlace
    //     let value = this.birthPlaceLabel
    //     return b.value === value
    //   });
    //
    //   if (this.isBirthPlaceInvalid) {
    //     let emitValue = ''
    //     emitValue = null
    //     this.onInput('birthPlace', '');
    //   }
    // },

    onInput(prop, newValue) {

      // console.debug('[onInput]:', prop, ':', newValue, '->', `this.$emit('update:${prop}', ${newValue})`);
      this.$emit(`update:${prop}`, newValue);
    },
    async onBirthPlaceSearch(value, update, abort) {
      if (value.length < 2 || isEmpty(value)) {
        abort()
        return
      }
      this.onSearchingPlace=true
      update()
      let searchValue= value?.toUpperCase()
      try{

        let birthDate = date.formatDate(this.timestampBirthDate , 'YYYY-MM-DD')

        let limit = 50;
        let filter = {
          desc: {si: searchValue},
          data_validita: {eq: birthDate},
        };

        let params= {filter, limit};
        let citiesResponse = await getCities({params});
        this.cities = citiesResponse.data;

        //FILTRO APPOSITO PER I PAESI ESTERI: SE L'UTENTE è NATO PRIMA DEL 1965 SETTO DATA FITTIZIA A 1966 PER
        //OVVIARE A ERRORE IN BASE DATI
        filter = {
          territorio: {si: searchValue},
          data_validita: {eq: birthDate},
        };
        if(parseInt(this.birthDate.slice(0,4))<=1965){
          filter = {
            territorio: {si: searchValue},
            data_validita: {eq: '1966-01-01T00:00:00.000+01:00'},
          };
        }

        params = {filter, limit};
        let countriesResponse = await getCountries({params});
        this.countries = countriesResponse.data;

      }catch (e) {

      }finally{
        update(()=>{
          this.onSearchingPlace=false
        })
      }

    },

  }
}
</script>

<style lang="sass">
.lms-form-person
  .alignLabel
    margin-top: -16px
</style>
