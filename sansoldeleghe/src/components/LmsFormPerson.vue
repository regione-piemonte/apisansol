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
            :value="name"
            label="Nome"
            @input="onInput('name', $event)"
            required
            bottom-slots
            no-error-icon
            :error="$v.name.$error"
          >
            <template v-slot:error>
              <div v-if="!$v.name.required">Campo obbligatorio</div>
<!--              <div v-if="!$v.name.onlyLetters">Deve essere composto solo da caratteri alfabetici</div>-->
            </template>
          </q-input>

          <!-- COGNOME -->
          <!-- ----------------------------------------------------------------------------------------------------------- -->
          <q-input
            type="text"
            :value="surname"
            label="Cognome"
            @input="onInput('surname', $event)"
            required
            reactive-rules
            bottom-slots
            :error="$v.surname.$error"
            no-error-icon
          >
            <template v-slot:error>
              <div v-if="!$v.surname.required">Campo obbligatorio</div>
<!--              <div v-if="!$v.surname.onlyLetters">Deve essere composto solo da caratteri alfabetici</div>-->
              <div v-if="!$v.surname.parentsSurname">Abbiamo riscontrato un'anomalia nei dati inseriti, se sono corretti contatta l'assistenza</div>
            </template>
          </q-input>
<!--          Con useTheParent-->
<!--          <q-input-->
<!--            v-else-->
<!--            type="text"-->
<!--            :value="surname"-->
<!--            label="Cognome"-->
<!--            @input="onInput('surname', $event)"-->
<!--            required-->
<!--            bottom-slots-->
<!--            no-error-icon-->
<!--            :error="$v.surname.$error"-->
<!--          >-->
<!--            <template v-slot:hint>-->
<!--              <div v-if="isBirthPlaceInputDisabled" class="text-warning">Seleziona prima la data di nascita</div>-->
<!--            </template>-->
<!--            <template v-slot:error>-->
<!--              <div v-if="!$v.name.required">Campo obbligatorio</div>-->
<!--              <div v-if="!$v.name.alpha">Deve essere composto solo da caratteri alfabetici</div>-->
<!--            </template>-->
<!--          </q-input>-->


          <!-- DATA NASCITA -->
          <!-- ----------------------------------------------------------------------------------------------------------- -->
          <q-input
            required
            label="Data di nascita"
            :value="birthDate"
            mask="##/##/####"
            @input="onInput('birthDate', $event)"
            placeholder="gg/mm/aaaa"
            no-error-icon
            bottom-slots
            :error="$v.birthDate.$error"
         >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="examDateProxy" v-model="showBirthDateCalendar">
                  <q-date
                    :default-year-month="defaultDate"
                    :value="birthDate"
                    minimal
                    :mask=FORMAT_DATE
                    @input="onInput('birthDate', $event)"
                    :options="rangeDateOptions"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:error>
              <div v-if="!$v.birthDate.required">Campo obbligatorio</div>
              <div v-if="!$v.birthDate.validDate">Inserire una data valida</div>
            </template>
          </q-input>

          <!-- LUOGO NASCITA -->
          <!-- ----------------------------------------------------------------------------------------------------------- -->
          <q-select
            :disable="isBirthPlaceInputDisabled"
            :value="birthPlace"
            label="Comune di nascita"
            required
            emit-value
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
            :loading="onSearchingPlace"
            :error="$v.birthPlace.$error"
            @input="onInput('birthPlace', $event)"
          >
            <template v-slot:hint>
              <div v-if="isBirthPlaceInputDisabled" class="text-warning">Seleziona prima la data di nascita</div>
              <template v-else>
                <div>Stato di nascita se straniero</div>
                <div>Non trovi la tua città/nazione? Controlla se il suo nome era lo stesso il {{birthDate}}</div>
              </template>
            </template>
            <template v-slot:error>
              <div v-if="!$v.birthPlace.required">Campo obbligatorio</div>
            </template>
          </q-select>


          <!-- CODICE FISCALE -->
          <!-- ----------------------------------------------------------------------------------------------------------- -->
          <lms-input-tax-code
            required
            no-error-icon
            :value="taxCode"
            bottom-slots
            :error="$v.taxCode.$error"
            @input="onInput('taxCode', $event)"
          >
            <template v-slot:hint>
              <div v-if="hasTaxCodeWarning" class="text-warning">
                <div v-if="!taxCodeWarnings.taxCodeYear">L'anno di nascita potrebbe non corrispondere</div>
                <div v-if="!taxCodeWarnings.taxCodeDay">Il giorno di nascita potrebbe non corrispondere</div>
                <div v-if="!taxCodeWarnings.taxCodeGender">Il sesso potrebbe non corrispondere</div>
              </div>
            </template>

            <template v-slot:error>
              <div v-if="!$v.taxCode.required">Campo obbligatorio</div>
              <div v-if="!$v.taxCode.alphaNum">Deve essere composto solo da lettere e numeri</div>
              <div v-if="!$v.taxCode.taxCodeLength">Deve avere esattamente {{TAX_CODE_LENGTH}} caratteri</div>
              <div v-else>
                <div v-if="!$v.taxCode.taxCodeCin">
                  Il codice di controllo non è corretto, potrebbero esserci degli errori di battitura
                </div>
                <div v-if="!$v.taxCode.taxCodeName">Il nome impostato non corrisponde</div>
                <div v-if="!$v.taxCode.taxCodeSurname">Il cognome impostato non corrisponde</div>
                <div v-if="!$v.taxCode.taxCodeMonth">Il mese di nascita impostato non corrisponde</div>
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
            :value="gender"
            color="black"
            :error="$v.gender.$error"
            no-error-icon
          >
            <q-option-group
              @input="onInput('gender', $event)"
              :value="gender"
              :options="[
              { label: 'Maschio', value: 'M' },
              { label: 'Femmina', value: 'F' },
            ]"
              :inline="$q.screen.gt.xs"
            />

            <template v-slot:error>
              <div v-if="!$v.gender.required">Campo obbligatorio</div>
            </template>
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
import {getDateMonth, hasFalseValue, isValidDate} from "src/services/business-logic";
import {FORMAT_DATE} from "src/services/config";
import {alphaNum, required} from "vuelidate/lib/validators";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_COUNT = 1
export default {
  name: "LmsFormPerson",
  components: {LmsInputTaxCode},
  props: {
    name: {type: String, required: true},
    surname: {type: String, required: false},
    birthDate: {required: true},
    birthPlace: {required: true},
    taxCode: {type: String, required: true},
    gender: {type: String, required: false},
    parentsSurname: {type: Array, required: false, default: null},
    isMinor: {type: Boolean, required: false, default: false},
  },
  data() {
    return {
      MAX_FILE_COUNT,
      MAX_FILE_SIZE,
      FORMAT_DATE,
      LENGTH,
      minBirthDate: null,
      maxBirthDate: null,
      allParents: false,
      singleParent: false,
      TAX_CODE_LENGTH: LENGTH,
      countries: [],
      cities: [],
      isBirthPlaceInvalid: false,
      showBirthDateCalendar:false,
      onSearchingPlace:false,
      showWarningAlert:false,
      isChekingForm:false,
      defaultDate:'',
      isLoading:false,
    }
  },
  watch:{
    hasTaxCodeWarning(val, oldVal){
      this.$emit('has-warnings', val)
    }
  },
  computed: {
    timestampBirthDate(){
      return this.birthDate ? date.extractDate(this.birthDate, FORMAT_DATE): null
    },
    isDocumentRequest(){
      return this.isMinor && this.isMonoParent
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
    isBirthPlaceInputDisabled() {
      return isEmpty(this.birthDate)
    },
  },
  validations(){
    return {
      name: {
        required,
        // onlyLetters: (name) => /^[a-z][a-z\s]*$/i.test(name)
      },
      surname: {
        required,
        // onlyLetters: (surname) => /^[a-z][a-z\s]*$/i.test(surname),
        parentsSurname: (surname) => this.controlParentSurname(surname)
      },
      birthDate: {
        required,
        validDate: (birthDate) => isValidDate(birthDate, this.minBirthDate, this.maxBirthDate)
      },
      birthPlace: {required},
      gender: {required},
      taxCode: {
        required,
        alphaNum,
        taxCodeLength: (taxCode) => hasValidLength(taxCode),
        taxCodeCin: (taxCode) => hasValidCin(taxCode),
        taxCodeName: (taxCode) => taxCodeName(this.name)(taxCode),
        taxCodeSurname: (taxCode) => taxCodeSurname(this.surname)(taxCode),
        taxCodeMonth: (taxCode) => taxCodeMonth(getDateMonth(this.birthDate))(taxCode)
      },
      documents:{
        required: (documents) => documents?.length>0 || !this.isDocumentRequest
      }
    };
  },
  created() {
    let maxYearsOld = this.isMinor ? 18 : 120
    this.minBirthDate = date.subtractFromDate(new Date(), {year: maxYearsOld})
    this.maxBirthDate =  this.isMinor ? new Date() : date.subtractFromDate(new Date(), {year: 18})
    this.defaultDate = date.formatDate(this.maxBirthDate, 'YYYY/MM')
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

      if(parseInt(this.birthDate.slice(6,10))<=1965){

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
    controlParentSurname(surname){
      if(!this.isMinor || isEmpty(this.parentsSurname)) return true
      let minorSurname = surname.toLowerCase().trim()
      let parentsSurnames = this.parentsSurname?.map(s => s.toLowerCase().trim())
      return parentsSurnames.includes(minorSurname)
    },

    onInput(prop, newValue) {
      this.showBirthDateCalendar = false
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
          console.log(this.birthDate)
          console.log(this.birthDate.slice(6,10))
        if(parseInt(this.birthDate.slice(6,10))<=1965){
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
    onInputDocument(document){
      // this.documents = [document]
console.log(document)
    }
  }
}
</script>

<style lang="sass">
.lms-form-person
  .alignLabel
    margin-top: -16px

  .q-file
    width: auto !important
</style>
