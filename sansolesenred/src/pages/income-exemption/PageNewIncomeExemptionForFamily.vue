<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped lang="stylus"></style>


<template>
  <q-page padding>
    <csi-page-title title="Nuova per familiare" @back="onBack" />

    <!-- BENEFICIARIO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-card class="q-mt-md">
      <q-card-title>Beneficiario</q-card-title>
      <q-card-main>
        <csi-form-person
          :name.sync="beneficiary.name"
          :surname.sync="beneficiary.surname"
          :birth-date.sync="beneficiary.birthDate"
          :birth-place.sync="beneficiary.birthPlace"
          :tax-code.sync="beneficiary.taxCode"
          :gender.sync="beneficiary.gender"
          :$v="$v.beneficiary"
          emit-birth-place-object
          ref="beneficiaryForm"
        >
<!--          <div slot="name-error-label">-->
<!--            <div v-if="!$v.beneficiary.name.required">-->
<!--              Campo obbligatorio-->
<!--            </div>-->

<!--            <template v-if="!$v.beneficiary.name.validChars">-->
<!--              <div>-->
<!--                Deve essere composto solo da caratteri alfabetici-->
<!--              </div>-->
<!--              &lt;!&ndash;                      <div v-if="controlSurname.length === 1">Deve avere lo stesso cognome del padre</div>&ndash;&gt;-->
<!--              &lt;!&ndash;                      <div v-if="controlSurname.length > 1">Deve avere lo stesso cognome di uno dei due genitori</div>&ndash;&gt;-->
<!--            </template>-->
<!--          </div>-->
<!--          <div slot="surname-error-label">-->
<!--            <div v-if="!$v.beneficiary.surname.required">-->
<!--              Campo obbligatorio-->
<!--            </div>-->

<!--            <template v-if="!$v.beneficiary.surname.validChars">-->
<!--              <div>-->
<!--                Deve essere composto solo da caratteri alfabetici-->
<!--              </div>-->
<!--              &lt;!&ndash;                      <div v-if="controlSurname.length === 1">Deve avere lo stesso cognome del padre</div>&ndash;&gt;-->
<!--              &lt;!&ndash;                      <div v-if="controlSurname.length > 1">Deve avere lo stesso cognome di uno dei due genitori</div>&ndash;&gt;-->
<!--            </template>-->
<!--          </div>-->
        </csi-form-person>
      </q-card-main>
    </q-card>

    <!-- RAPPORTO CON BENEFICIARIO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-card class="q-mt-md">
      <q-card-title>In qualità di?</q-card-title>
      <q-card-main>
        <q-field>
          <q-select
            v-model="selectedFamilyRelationship"
            float-label="Rapporto familiare"
            :options="familyRelationshipsOptions"
          />
        </q-field>
      </q-card-main>
    </q-card>

    <!-- TITOLARE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-card class="q-mt-md">
      <q-card-main>
        <p>
          <strong>Sei il titolare dell'esenzione?</strong> <br>
          <a href="#" @click.prevent="openModal">Dimmi di più</a>
        </p>

        <q-option-group
          v-model="insertHolderSelected"
          type="radio"
          :inline="$q.screen.gt.sm"
          :options="insertHolderOptions"
        />


        <template v-if="mustInsertHolderData">
          <h4 class="q-mt-md">Inserisci i dati del titolare</h4>
          <csi-form-person
            :name.sync="holder.name"
            :surname.sync="holder.surname"
            :birth-date.sync="holder.birthDate"
            :birth-place.sync="holder.birthPlace"
            :tax-code.sync="holder.taxCode"
            :gender.sync="holder.gender"
            :$v="$v.holder"
            emit-birth-place-object
            ref="holderForm"
          >
<!--            <div slot="name-error-label">-->
<!--              <div v-if="!$v.holder.name.required">-->
<!--                Campo obbligatorio-->
<!--              </div>-->

<!--              <template v-if="!$v.holder.name.validChars">-->
<!--                <div>-->
<!--                  Deve essere composto solo da caratteri alfabetici-->
<!--                </div>-->
<!--                &lt;!&ndash;                      <div v-if="controlSurname.length === 1">Deve avere lo stesso cognome del padre</div>&ndash;&gt;-->
<!--                &lt;!&ndash;                      <div v-if="controlSurname.length > 1">Deve avere lo stesso cognome di uno dei due genitori</div>&ndash;&gt;-->
<!--              </template>-->
<!--            </div>-->
<!--            <div slot="surname-error-label">-->
<!--              <div v-if="!$v.holder.surname.required">-->
<!--                Campo obbligatorio-->
<!--              </div>-->

<!--              <template v-if="!$v.holder.surname.validChars">-->
<!--                <div>-->
<!--                  Deve essere composto solo da caratteri alfabetici-->
<!--                </div>-->
<!--                &lt;!&ndash;                      <div v-if="controlSurname.length === 1">Deve avere lo stesso cognome del padre</div>&ndash;&gt;-->
<!--                &lt;!&ndash;                      <div v-if="controlSurname.length > 1">Deve avere lo stesso cognome di uno dei due genitori</div>&ndash;&gt;-->
<!--              </template>-->
<!--            </div>-->
          </csi-form-person>
        </template>
      </q-card-main>
    </q-card>

    <!-- CODICE ESENZIONE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-card-exemption-code v-model="selectedExemptionCode" class="q-mt-md" />

    <!-- INFORMATIVA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-exemption-insert-disclaimer-card v-model="isPolicyAccepted" />

    <!-- VALIDITA' -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-exemption-insert-validity-card class="q-mt-md" />

    <!-- AZIONI -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-buttons class="q-pa-sm">
      <csi-button primary @click="onConfirm" label="Conferma" :loading="isSaving" />
      <csi-button secondary @click="onBack" label="Indietro" />
    </csi-buttons>

    <!-- MODALS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-exemption-holder-info-modal v-model="isSelectionModalOpen" minimized />
  </q-page>
</template>


<script>

    import CsiFormPerson from "components/global/forms/CsiFormPerson";
    import {personValidationMixin} from "@mixins/validationsMixin";
    import {extractBirthPlaceCodePart, GENDERS} from "@services/global/tax-code";
    import CsiCardExemptionCode from "components/income-exemption/CsiCardExemptionCode";
    import CsiCardPolicy from "components/global/common/CsiCardPolicy";
    import {createExemption, getFamilyRelationships} from "@services/api/income-exemption";
    import {scrollToElement} from "@services/global/utils";
    import CsiPageTitle from "components/global/common/CsiPageTitle";
    import CsiExemptionInsertDisclaimerCard from "components/income-exemption/CsiExemptionInsertDisclaimerCard";
    import CsiExemptionHolderInfoModal from "components/income-exemption/CsiExemptionHolderInfoModal";
    import CsiExemptionInsertValidityCard from "components/income-exemption/CsiExemptionInsertValidityCard";
    import {getCsiErrorDetailFirst, notifyError} from "@services/api/utils";


    const INSERT_HOLDER_VALUES = {
        ME: 'ME',
        BENEFICIARY: 'BENEFICIARY',
        OTHER: 'OTHER',
    }

    export default {
        name: 'PageNewIncomeExemptionForFamily',
        components: {
            CsiExemptionInsertValidityCard,
            CsiExemptionHolderInfoModal,
            CsiExemptionInsertDisclaimerCard,
            CsiCardPolicy,
            CsiCardExemptionCode,
            CsiFormPerson,
            CsiPageTitle
        },
        mixins: [personValidationMixin],
        data() {
            return {
                INSERT_HOLDER_VALUES,
                beneficiary: {
                    name: '',
                    surname: '',
                    birthDate: '',
                    birthPlace: null,
                    taxCode: '',
                    gender: GENDERS.MALE,
                },
                holder: {
                    name: '',
                    surname: '',
                    birthDate: '',
                    birthPlace: null,
                    taxCode: '',
                    gender: GENDERS.MALE,
                },
                familyRelationships: [],
                selectedFamilyRelationship: undefined,
                selectedExemptionCode: null,
                isPolicyAccepted: false,
                insertHolderSelected: INSERT_HOLDER_VALUES.ME,
                isSelectionModalOpen: false,
                isSaving: false,
            };
        },
        validations() {
            //return this.personValidationMixin_getSchema();

          // let beneficiary  = {...this.personValidationMixin_getSchema()}
          // beneficiary.name.validChars = name => this.charsValidations(name)
          // beneficiary.surname.validChars = surname => this.charsValidations(surname)
          //
          // let holder  = {...this.personValidationMixin_getSchema()}
          // holder.name.validChars = name => this.charsValidations(name)
          // holder.surname.validChars = surname => this.charsValidations(surname)
          //   let schema = {
          //       beneficiary: beneficiary,
          //       holder: holder,
          //   };
          let schema = {
            beneficiary: this.personValidationMixin_getSchema(),
            holder: this.personValidationMixin_getSchema(),
          };

            return schema
        },
        computed: {
            user() {
                return this.$store.getters['global/user']
            },
            familyRelationshipsOptions() {
                return this.familyRelationships.map(r => {
                    return {label: r.descrizione, value: r.codice, model: r};
                });
            },
            insertHolderOptions() {
                return [
                    {value: INSERT_HOLDER_VALUES.ME, label: 'Sì'},
                    {value: INSERT_HOLDER_VALUES.BENEFICIARY, label: `No, è il beneficiario`},
                    {value: INSERT_HOLDER_VALUES.OTHER, label: `No, è un'altra persona`},
                ]
            },
            amITheHolder() {
                return this.insertHolderSelected === INSERT_HOLDER_VALUES.ME
            },
            mustInsertHolderData() {
                return this.insertHolderSelected === INSERT_HOLDER_VALUES.OTHER
            }
        },
        async created() {
            let response = await getFamilyRelationships();
            this.familyRelationships = response.data;
        },
        methods: {
           charsValidations(val){
              const REGEX = /^[a-zA-Z ']*$/
              return REGEX.test(val)
            },
            onBack() {
                this.$router.go(-1)
            },
            openModal() {
                this.isSelectionModalOpen = true
            },
            isBeneficiaryFormValid() {
                this.$v.beneficiary.$touch();
                let hasError = this.$v.beneficiary.$error;
                if (hasError) scrollToElement(this.$refs.beneficiaryForm.$el);
                return !hasError;
            },
            isHolderFormValid() {
                this.$v.holder.$touch();
                let hasError = this.$v.holder.$error;
                if (hasError) scrollToElement(this.$refs.holderForm.$el);
                return !hasError;
            },
            async onConfirm() {
                /*let data = {
                  codice_esenzione: this.selectedExemptionCode,
                  rapporto_familiare: this.selectedFamilyRelationship,
                  creato_per: {
                    nome: this.name,
                    cognome: this.surname,
                    // codice_fiscale: this.taxCode,
                    data_nascita: this.birthDate,
                    luogo_nascita: this.birthPlace,
                    sesso: this.gender,
                  },
                };*/

                //let response = await createExemption(this.taxCode, data);
                // let exemption = response.data;
                //this.$router.push({...this.$routes.INCOME_EXEMPTION.NEW_SUCCESS, params: {id: exemption.id, exemption}});

                if (!this.isPolicyAccepted) {
                    this.$q.notify({
                        color: 'negative',
                        message: "Devi accettare l'informativa prima di richiedere l'esenzione"
                    })
                    return
                }

                if (!this.isBeneficiaryFormValid()) return
                if (this.mustInsertHolderData && !this.isHolderFormValid()) return

                let createdFor = {
                    codice_fiscale: this.beneficiary.taxCode,
                    nome: this.beneficiary.name,
                    cognome: this.beneficiary.surname,
                    sesso: this.beneficiary.gender,
                    data_nascita: this.beneficiary.birthDate,
                    luogo_nascita: {
                        codice: this.beneficiary.birthPlace ? this.beneficiary.birthPlace.codice_catasto : null,
                        descrizione: this.beneficiary.birthPlace ? this.beneficiary.birthPlace.desc : null
                    }
                }

                let holder = {...createdFor}
                if (this.insertHolderSelected === INSERT_HOLDER_VALUES.ME) {

                    let birthPlaceCode = extractBirthPlaceCodePart(this.user.cf)

                    holder = {
                        codice_fiscale: this.user.cf,
                        nome: this.user.nome,
                        cognome: this.user.cognome,
                        // @WARNING: Questo è possibile perchè al momento solo i piemontesi possono creare esenzioni
                        //           In futuro sarà da capire come ottenere questi dati
                        sesso: this.user.profile.info_anag.dati_primari.sesso,
                        data_nascita: this.user.profile.info_anag.dati_primari.data_nascita,
                        luogo_nascita: {
                            codice: birthPlaceCode,
                            descrizione: this.user.profile.info_anag.dati_primari.desc_comune_nascita
                        }
                    }
                } else if (this.insertHolderSelected === INSERT_HOLDER_VALUES.OTHER) {
                    holder = {
                        codice_fiscale: this.holder.taxCode,
                        nome: this.holder.name,
                        cognome: this.holder.surname,
                        sesso: this.holder.gender,
                        data_nascita: this.holder.birthDate,
                        luogo_nascita: {
                            codice: this.holder.birthPlace ? this.holder.birthPlace.codice_catasto : null,
                            descrizione: this.holder.birthPlace ? this.holder.birthPlace.desc : null
                        }
                    }
                }

                let payload = {
                    codice_esenzione: this.selectedExemptionCode,
                    rapporto_familiare: this.selectedFamilyRelationship,
                    disclaimer: true,
                    creato_per: createdFor,
                    titolare: holder,
                }

                this.isSaving = true

                try {
                    let response = await createExemption(this.user.cf, payload, {_no5XXRedirect: true});
                    let exemption = response.data;
                    let name = this.$routes.INCOME_EXEMPTION.NEW_SUCCESS.name
                    let id = exemption.id
                    let params = {id, exemption}
                    this.$router.push({name, params});
                } catch (e) {
                    let message = `Non è stato possibile richiedere l'esenzione`
                    let detail = getCsiErrorDetailFirst(e)
                    if (detail && detail.value) message = detail.value
                    notifyError(e, message)
                }

                this.isSaving = false
            }
        }
    }
</script>
