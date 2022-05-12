<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <csi-page-title title="Nuova esenzione" @back="onBack"></csi-page-title>
    <!-- CODICE ESENZIONE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <csi-card-exemption-code v-model="selectedExemptionCode" class="q-mt-md" />

    <!-- Titolare -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->

    <q-card class="q-mt-md">
      <q-card-main>
        <p>
          <strong>Sei il titolare dell'esenzione? </strong> <br>
          <a href="#" @click.prevent="openModal">Dimmi di più</a>
        </p>

        <q-option-group
          v-model="insertHolderSelected"
          type="radio"
          inline
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
            ref="holderForm">
          </csi-form-person>
        </template>
      </q-card-main>
    </q-card>

    <!-- INFORMATIVA -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-card class="q-mt-md">
      <q-card-title>Informativa sul trattamento dei dati personali</q-card-title>
      <q-card-main>
        <q-field class="q-mt-md">
          <q-toggle
            v-model="isPolicyAccepted">
            <div class="q-ml-md">
              Dichiaro di aver preso visione di quanto contenuto nelle
              <a href="#" @click.prevent.stop="openModalService">Condizioni del servizio</a> e
              <a href="#" @click.prevent.stop="openModalPrivacy">nell'Informativa sulla Privacy</a>
            </div>
          </q-toggle>
        </q-field>
      </q-card-main>
    </q-card>


    <q-card class="q-mt-md">
      <q-card-title>Validità</q-card-title>
      <q-card-main>
        <div class="row">
          <div class="col-6">
            <div>
              Inizio validità: <br>
              <strong>{{startDate | format}}</strong>
            </div>
          </div>
          <div class="col-6">
            <div>
              Scadenza: <br>
              <strong>{{endDate | format}}</strong>
            </div>
          </div>
        </div>
      </q-card-main>
    </q-card>

    <csi-buttons class="q-pa-sm">
      <csi-button primary @click="onConfirm" label="Conferma" :loading="isSaving" />
      <csi-button secondary @click="onBack" label="Indietro" />
    </csi-buttons>


    <!-- MODALS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-modal v-model="isSelectionModalOpen" minimized>
      <q-modal-layout class="bg-grey-2">

        <q-toolbar slot="header">
          <q-toolbar-title>
            Maggiori informazioni
          </q-toolbar-title>
          <q-btn flat round icon="close" v-close-overlay></q-btn>
        </q-toolbar>

        <div class="q-pa-md">
          <h1 class="csi-h3 q-mb-md">Titolare esenzioni per reddito</h1>
          <p>
            Il titolare di un'esenzione è la persona che detiene la condizione necessaria per ottenere un'esenzione a
            favore di un beneficiario (es: Titolare che detiene la condizione di Disoccupato
            per cui il beneficiario può ottenere l'esenzione XXX, oppure Titolare di pensione minima, ecc.)
          </p>
        </div>
      </q-modal-layout>
    </q-modal>

    <q-modal v-model="isSelectionModalServiceOpen" :content-css="{maxWidth: '800px'}">
      <q-modal-layout class="bg-grey-2">
        <q-toolbar slot="header">
          <q-toolbar-title>
            Condizioni del servizio
          </q-toolbar-title>
          <q-btn flat round icon="close" v-close-overlay />
        </q-toolbar>

        <div class="q-pa-md">
          <csi-policy :iframe-styles="{minHeight: '80vh'}">
            <template slot="text">
              <div v-html="informationDisclaimer"></div>
            </template>
          </csi-policy>
        </div>
      </q-modal-layout>
    </q-modal>

    <q-modal v-model="isSelectionModalPrivacyOpen" :content-css="{maxWidth: '800px'}">
      <q-modal-layout class="bg-grey-2">
        <q-toolbar slot="header">
          <q-toolbar-title>
            Informativa sulla Privacy
          </q-toolbar-title>
          <q-btn flat round icon="close" v-close-overlay />
        </q-toolbar>

        <div class="q-pa-md">
          <csi-policy :iframe-styles="{minHeight: '80vh'}">
            <template slot="text">
              <div v-html="privacyDisclaimer"></div>
            </template>
          </csi-policy>
        </div>
      </q-modal-layout>
    </q-modal>

  </q-page>
</template>

<script>

    import CsiCardExemptionCode from "components/income-exemption/CsiCardExemptionCode";
    import CsiCardPolicy from "components/global/common/CsiCardPolicy";
    import CsiIconBase from "components/global/icons/CsiIconBase";
    import CsiFormPerson from "components/global/forms/CsiFormPerson";
    import {personValidationMixin} from "@mixins/validationsMixin";
    import CsiPageTitle from "components/global/common/CsiPageTitle";
    import {scrollToElement} from "@services/global/utils";
    import {extractBirthPlaceCodePart, GENDERS} from "@services/global/tax-code";
    import {createExemption, getDisclaimer} from "@services/api/income-exemption";
    import CsiPolicy from "components/global/common/CsiPolicy";
    import {getCsiErrorDetailFirst, notifyError} from "@services/api/utils";

    const INSERT_HOLDER_VALUES = {
        ME: 'ME',
        OTHER: 'OTHER',
    }

    export default {
        name: 'PageNewIncomeExemptionForYou',
        mixins: [personValidationMixin],
        components: {CsiPolicy, CsiCardPolicy, CsiCardExemptionCode, CsiIconBase, CsiFormPerson, CsiPageTitle},
        data() {
            return {
                INSERT_HOLDER_VALUES,
                selectedExemptionCode: null,
                isPolicyAccepted: false,
                startDate: new Date(),
                selectedHolder: {},
                holder: {
                    name: '',
                    surname: '',
                    birthDate: '',
                    birthPlace: null,
                    taxCode: '',
                    gender: GENDERS.MALE,
                },
                disclaimer: {},
                insertHolderSelected: INSERT_HOLDER_VALUES.ME,
                isSelectionModalOpen: false,
                isSelectionModalServiceOpen: false,
                isSelectionModalPrivacyOpen: false,
                isSaving: false,
            }
        },
        computed: {
            create() {
                return this.isPolicyAccepted
            },
            user() {
                return this.$store.getters['global/user']
            },
            endDate() {
                return this.$store.getters['incomeExemption/getNewExemptionsExpirationDate']
            },
            privacyDisclaimer() {
                return this.disclaimer.testo_privacy || ''
            },
            informationDisclaimer() {
                return this.disclaimer.testo_informativa || ''
            },
            insertHolderOptions() {
                return [
                    {value: INSERT_HOLDER_VALUES.ME, label: 'Sì'},
                    {value: INSERT_HOLDER_VALUES.OTHER, label: `No, è un'altra persona`},
                ]
            },
            amITheHolder() {
                return this.insertHolderSelected === INSERT_HOLDER_VALUES.ME
            },
            mustInsertHolderData() {
                return !this.amITheHolder
            }
        },
        validations() {
            //return this.personValidationMixin_getSchema();
            let schema = {
                holder: this.personValidationMixin_getSchema(),
            };
            return schema
        },
        async created() {
            let disclaimerPromise = await getDisclaimer();
            this.disclaimer = disclaimerPromise.data;
        },
        methods: {
            onBack() {
                this.$router.go(-1)
            },
            openModalService() {
                this.isSelectionModalServiceOpen = true
            },
            openModalPrivacy() {
                this.isSelectionModalPrivacyOpen = true
            },
            openModal() {
                this.isSelectionModalOpen = true
            },
            isHolderFormValid() {
                this.$v.holder.$touch();
                let hasError = this.$v.holder.$error;
                if (hasError) scrollToElement(this.$refs.holderForm.$el);
                return !hasError;
            },
            onWarningUpdateStep(val) {
                this.hasWarningStep = val
            },
            // async getCity(name, istat) {
            //     let limit = 5
            //     let filter = {
            //         desc: {si: name},
            //         data_validita: {eq: new Date().toISOString()},
            //     }
            //
            //     let params = {filter, limit};
            //
            //     let response = await getCities({params});
            //     let result = response.data
            //
            //     if (istat) {
            //         result = result.filter(r => r.codice_istat === istat)
            //     }
            //
            //     result = result[0]
            //     return result
            // },
            async onConfirm() {

                if (!this.isPolicyAccepted) {
                    this.$q.notify({
                        color: 'negative',
                        message: "Devi accettare l'informativa prima di richiedere l'esenzione"
                    })
                    return
                }

                if (!this.amITheHolder && !this.isHolderFormValid()) return

                // let cityName = this.user.profile.info_anag.dati_primari.desc_comune_nascita
                // let cityIstat = this.user.profile.info_anag.dati_primari.cod_comune_nascita
                // let userCity = await this.getCity(cityName, cityIstat)
                let birthPlaceCode = extractBirthPlaceCodePart(this.user.cf)

                let createdFor = {
                    codice_fiscale: this.user.cf,
                    nome: this.user.nome,
                    cognome: this.user.cognome,
                    // @WARNING: Questo è possibile perchè al momento solo i piemontesi possono creare esenzioni

                    sesso: this.user.profile.info_anag.dati_primari.sesso,
                    data_nascita: this.user.profile.info_anag.dati_primari.data_nascita,
                    luogo_nascita: {
                        codice: birthPlaceCode,
                        descrizione: this.user.profile.info_anag.dati_primari.desc_comune_nascita
                    }
                }

                let holder = {
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

                let payload = {
                    codice_esenzione: this.selectedExemptionCode,
                    disclaimer: true,
                    creato_per: createdFor,
                    titolare: this.amITheHolder ? {...createdFor} : {...holder}
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

<style>
</style>
