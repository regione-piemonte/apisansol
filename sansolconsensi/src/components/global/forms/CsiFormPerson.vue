<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus">

  @require '~variables'

  .q-field:not(:first-of-type)
    margin-top: $spaces.md.y

</style>


<template>
  <div>

    <!-- NOME -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-field
      required
      :error="$v.name.$error">
      <q-input
        type="text"
        :value="name"
        @input="onInput('name', $event)"
        float-label="Nome">
      </q-input>

      <div slot="error-label">
        <div v-if="!$v.name.required">Campo obbligatorio</div>
        <div v-if="!$v.name.alpha">Deve essere composto solo da caratteri alfabetici</div>
      </div>
    </q-field>

    <!-- COGNOME -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-field
      required
      :error="$v.surname.$error"
      v-if="!useTheParent"
    >
      <q-input
        type="text"
        :value="surname"
        @input="onInput('surname', $event)"
        float-label="Cognome">
      </q-input>

      <slot name="surname-error-label" slot="error-label">
        <div v-if="!$v.surname.required">Campo obbligatorio</div>
        <div v-if="!$v.surname.alpha">Deve essere composto solo da caratteri alfabetici</div>
      </slot>
    </q-field>

    <!--Caso  speciale new joint -->
    <q-field
      required
      :error="$v.surname.$error"
      v-if="useTheParent">
      <q-input
        type="text"
        :value="surname"
        @input="onInput('surname', $event)"
        float-label="Cognome"
      >
      </q-input>
      <slot name="surname-error-label" slot="error-label">
        <div v-if="!$v.surname.required">Campo obbligatorio</div>
        <div v-if="!$v.surname.alpha">Deve essere composto solo da caratteri alfabetici</div>
      </slot>
      <div slot="warning-label">
        <div>Seleziona prima la data di nascita</div>
      </div>
    </q-field>

    <!-- DATA NASCITA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-field
      required
      :error="$v.birthDate.$error">
      <q-datetime
        type="date"
        :value="birthDate"
        @input="onInput('birthDate', $event)"
        float-label="Data di nascita"
        default-view="year"
        format="DD MMM YYYY"
        :min="minBirthDate"
        :max="maxBirthDate">
      </q-datetime>

      <div slot="error-label">
        <div v-if="!$v.birthDate.required">Campo obbligatorio</div>
      </div>
    </q-field>

    <!-- LUOGO NASCITA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-field
      required
      class="q-mt-md"
      :warning="isBirthPlaceInputDisabled"
      :error="$v.birthPlace.$error || isBirthPlaceInvalid">
      <q-input
        :disable="isBirthPlaceInputDisabled"
        :value="birthPlaceLabel"
        @blur="onBirthPlaceBlur"
        float-label="Comune di nascita">
        <q-autocomplete
          :min-characters="2"
          :debounce="400"
          :max-results="100"
          @search="onBirthPlaceSearch"
          @selected="onBirthPlaceSelected"
        />
      </q-input>

      <div slot="helper">
        <div>Stato di nascita se straniero</div>
        <div>Non trovi la tua città/nazione? Controlla se il suo nome era lo stesso il {{birthDate | format}}</div>
      </div>

      <div slot="warning-label">
        <div>Seleziona prima la data di nascita</div>
      </div>

      <div slot="error-label">
        <div v-if="isBirthPlaceInvalid">
          Luogo di nascita non valido.
          Selezionane uno tra quelli suggeriti.
        </div>
        <div v-else>
          <div v-if="!$v.birthPlace.required">Campo obbligatorio</div>
        </div>
      </div>
    </q-field>

    <!-- CODICE FISCALE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-input-tax-code
      required
      :value="taxCode"
      @input="onInput('taxCode', $event)"
      :warning="taxCodeWarnings.hasWarning"
      :error="$v.taxCode.$error">

      <div slot="warning-label">
        <div v-if="!taxCodeWarnings.taxCodeYear">L'anno di nascita potrebbe non corrispondere</div>
        <div v-if="!taxCodeWarnings.taxCodeDay">Il giorno di nascita potrebbe non corrispondere</div>
        <div v-if="!taxCodeWarnings.taxCodeGender">Il sesso potrebbe non corrispondere</div>
      </div>
      <div slot="error-label">
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
      </div>
    </csi-input-tax-code>


    <!-- SESSO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-field
      required
      v-if="gender">

      <div class="q-if-label">Sesso</div>

      <q-option-group
        type="radio"
        :value="gender"
        @input="onInput('gender', $event)"
        inline
        :options="[
          { label: 'Maschio', value: 'M' },
          { label: 'Femmina', value: 'F' },
        ]">
      </q-option-group>
    </q-field>


  </div>
</template>


<script>
    import CsiInputTaxCode from "components/global/forms/CsiInputTaxCode";
    import {getCities, getCountries} from "@services/api/cross";
    import {taxCodeDay, taxCodeGender, taxCodeYear} from "@validators/taxCode";
    import {LENGTH} from "@services/global/tax-code";
    import {isEmpty, orderBy} from "@services/global/utils";
    import {capitalize, toUpper} from "@filters/cases";
    import getYear from 'date-fns/get_year';
    import getDate from 'date-fns/get_date';
    import {format} from "@filters/date";


    export default {
        name: 'CsiFormPerson',
        components: {CsiInputTaxCode},
        props: {
            name: {type: String, required: true},
            surname: {type: String, required: false},
            birthDate: {required: true},
            birthPlace: {required: true},
            taxCode: {type: String, required: true},
            gender: {type: String, required: false},
            minBirthDate: {type: String, required: false},
            maxBirthDate: {type: String, required: false},
            $v: {type: Object, required: true},
            birthPlaceAutoSelectSinglePerfectMatch: {type: Boolean, required: false, default: false},
            useTheParent: {type: Boolean, required: false, default: false},
            emitBirthPlaceObject: {type: Boolean, required: false, default: false}
        },
        data() {
            return {
                allParents: false,
                singleParent: false,
                TAX_CODE_LENGTH: LENGTH,
                countries: [],
                cities: [],
                isBirthPlaceInvalid: false,
                surnameOfTheParent: this.surname
            }
        },
        computed: {
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
                let year;
                let day;

                if (this.birthDate) {
                    year = getYear(this.birthDate);
                    day = getDate(this.birthDate);
                }

                result.taxCodeYear = taxCodeYear(year)(this.taxCode);
                result.taxCodeDay = taxCodeDay(day)(this.taxCode);
                result.taxCodeGender = taxCodeGender(this.gender)(this.taxCode);
                result.hasWarning = this.$v.taxCode.$dirty && (!result.taxCodeYear || !result.taxCodeDay || !result.taxCodeGender);

                return result;
            },
            hasTaxCodeWarning() {
                let warnings = this.taxCodeWarnings
                return (!warnings.taxCodeYear || !warnings.taxCodeDay || !warnings.taxCodeGender);
            },
            isBirthPlaceInputDisabled() {
                return isEmpty(this.birthDate)
            },
            birthPlaceLabel() {
                let result = this.birthPlace
                if (this.emitBirthPlaceObject) result = this.birthPlace ? this.getBirthPlaceLabel(this.birthPlace) : ''
                return result
            }
        },
        watch: {
            birthDate_() {
                this.updateBirthPlace();
            },
            hasTaxCodeWarning(val, oldVal) {
                this.$emit('has-warning-update', val)
            }
        },
        methods: {
            getBirthPlaceLabel(birthPlace) {
                if(birthPlace.territorio && birthPlace.territorio!==birthPlace.desc ) {
                    return capitalize(birthPlace.desc) + " (" + capitalize(birthPlace.territorio) + ")";
                }else {
                    return capitalize(birthPlace.desc)
                }
            },
            getBirthPlaceSublabel(birthPlace) {
                let result = `[${birthPlace.codice_istat}]`;
                if (birthPlace.data_inizio_validita) result = `${result} dal ${format(birthPlace.data_inizio_validita, 'YYYY')}`;
                if (birthPlace.data_fine_validita) result = `${result} al ${format(birthPlace.data_fine_validita, 'YYYY')}`;
                return result;
            },
            updateBirthPlace() {
                this.isBirthPlaceInvalid = !this.birthPlaceOptions.some(b => {
                    let value = this.birthPlace
                    if (this.emitBirthPlaceObject) value = this.birthPlaceLabel
                    return b.value === value
                });

                if (this.isBirthPlaceInvalid) {
                    let emitValue = ''
                    if (this.emitBirthPlaceObject) emitValue = null
                    this.onInput('birthPlace', '');
                }
            },
            async updateBirthPlaces(searchValue) {
console.log("ciao")
                let limit = 50;
                let filter = {
                    desc: {si: searchValue},
                    data_validita: {eq: this.birthDate},
                };

                let params= {filter, limit};
                let citiesPromise = getCities({params});
                let citiesResponse = await citiesPromise;
                this.cities = citiesResponse.data;



                //FILTRO APPOSITO PER I PAESI ESTERI: SE L'UTENTE è NATO PRIMA DEL 1965 SETTO DATA FITTIZIA A 1966 PER
                //OVVIARE A ERRORE IN BASE DATI
                 filter = {
                    territorio: {si: searchValue},
                    data_validita: {eq: this.birthDate},
                };
                 console.log(this.birthDate)
                 console.log(this.birthDate.slice(0,4))
                 if(parseInt(this.birthDate.slice(0,4))<=1965){
                     filter = {
                         territorio: {si: searchValue},
                         data_validita: {eq: '1966-01-01T00:00:00.000+01:00'},
                     };
                 }




                 params = {filter, limit};
                let countriesPromise = getCountries({params});
                let countriesResponse = await countriesPromise;
                this.countries = countriesResponse.data;
            },
            onInput(prop, newValue) {

                // console.debug('[onInput]:', prop, ':', newValue, '->', `this.$emit('update:${prop}', ${newValue})`);
                this.$emit(`update:${prop}`, newValue);
            },
            async onBirthPlaceSearch(terms, done) {
                await this.updateBirthPlaces(toUpper(terms));
                let result = this.birthPlaceOptions

                // Autoselezione in caso di un singolo risultato che fa match esatto con quanto scritto dall'utente
                if (result.length === 1 && this.birthPlaceAutoSelectSinglePerfectMatch) {
                    let item = result[0]
                    if (terms.toLowerCase() === item.label.toLowerCase()) {
                        this.onBirthPlaceSelected(item)
                        done([])
                    }
                }

                done(this.birthPlaceOptions);
            },
            onBirthPlaceSelected(item, keyboard) {
                this.isBirthPlaceInvalid = false;
                let emitValue = item.value
                if (this.emitBirthPlaceObject) emitValue = item._model
                this.onInput('birthPlace', emitValue);
            },
            onBirthPlaceBlur() {
                this.updateBirthPlace();
            }
        }
    }
</script>
