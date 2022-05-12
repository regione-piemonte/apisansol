<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="q-pa-md">
    <template v-if="!isLoading">
      <!-- UTENTE NON CENSITO -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <template v-if="!vaccinationUserInfo && !isDelegationActive">
        <q-banner class="q-banner--info q-mt-lg">
          <div class="text-body1">
            Il tuo profilo non risulta censito nell'Anagrafe vaccinale.
          </div>
        </q-banner>
      </template>

      <template v-if="vaccinationUserInfo">
        <div class="q-gutter-y-md">
          <q-banner  class="q-banner--info">
            <div class="text-body1">
              Puoi salvare un indirizzo mail e fino a 3 diversi numeri di telefono
              come contatti per il servizio Vaccinazioni
            </div>
          </q-banner>

          <q-card>
            <q-card-section class="q-px-none q-py-none">
              <q-list separator>
                <vac-email-item
                  class="q-py-md"
                  :email="email"
                  @email-verified="editMail"
                />

                <vac-mobile-phone-item
                  label="Numero telefono mobile"
                  :mobile-phone="phone1"
                  @mobile-phone-verified="editPhone1"
                  class="q-py-md"
                />

                <q-item class="q-py-md" clickable @click="openPhone2Modal">
                  <q-item-section side>
                    <q-icon name="phone" color="secondary" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="1" class="text-subtitle1">Numero telefono fisso</q-item-label>
                    <q-item-label class="text-grey-7">
                      {{ phone2 | empty("Aggiungi") }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-icon
                      :name="phone2 ? 'edit' : 'keyboard_arrow_right'"
                      :color="phone2 ? 'faded' : 'primary'"
                    />
                  </q-item-section>
                </q-item>

                <q-item class="q-py-md" clickable @click="openPhone3Modal" v-if="IS_TEST || IS_DEV">
                  <q-item-section side>
                    <q-icon name="phone" color="secondary" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="1" class="text-subtitle1">Numero telefono </q-item-label>
                    <q-item-label class="text-grey-7">
                      {{ phone3 | empty("Aggiungi") }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-icon
                      :name="phone3 ? 'edit' : 'keyboard_arrow_right'"
                      :color="phone3 ? 'faded' : 'primary'"
                    />
                  </q-item-section>
                </q-item>

                <vac-address-item class="q-py-md" :address="vaccinationAddress" />

                <template class="q-py-md" v-if="temporalAddressIsValid">
                  <vac-address-item
                    :address="temporalAddress"
                    label="Indirizzo temporaneo"
                    editable
                  />

                </template>
              </q-list>


            </q-card-section>
            <q-card-actions align="right" class="q-px-md q-pb-md" v-if="!temporalAddressIsValid">
              <lms-buttons>
                <lms-button outline @click="openModal">
                  Aggiungi indirizzo temporaneo
                </lms-button>
              </lms-buttons>
            </q-card-actions>

          </q-card>


        </div>

        <!-- MODAL indirizzo temporaneo -->
        <!-- ----------------------------------------------------------------------------------------------------------- -->

        <!--        <csi-contact-address-modal @confirmed="onAddressVerified" />-->
        <template v-if="isAddressModalOpen">
          <vac-address-dialog
            v-model="isAddressModalOpen"
            @confirmed="onAddressVerified"
          ></vac-address-dialog>
        </template>

        <!--              modal phone 3-->
        <q-dialog v-model="isPhone3ModalOpen" :content-css="{ minWidth: '60vw' }">
          <!-- @note: `v-if` permette di resettare il contenuto della modal alla chiusura -->

          <q-card style="width: 800px; max-width: 800px;">
            <q-card-section class="q-py-sm q-pr-none">
              <q-toolbar>
                <q-toolbar-title>
                  Inserisci un numero di telefono fisso
                </q-toolbar-title>

                <q-btn v-close-popup flat round dense icon="close" />
              </q-toolbar>
            </q-card-section>

            <div class="q-pa-md">
                <q-input v-model="phone3" type="tel" label="Telefono (fisso)">
                </q-input>
              <lms-buttons class="q-mt-md">
                <lms-button
                  primary
                  label="Salva"
                  :loading="loadingContacts"
                  @click="editPhone3"
                />
              </lms-buttons>
            </div>
          </q-card>
        </q-dialog>

        <!--              modal phone 3-->
        <q-dialog v-model="isPhone2ModalOpen" :content-css="{ minWidth: '60vw' }">
          <!-- @note: `v-if` permette di resettare il contenuto della modal alla chiusura -->

          <q-card style="width: 800px; max-width: 800px;">
            <q-card-section class="q-py-sm q-pr-none">
              <q-toolbar>
                <q-toolbar-title>
                  Inserisci un numero di telefono fisso
                </q-toolbar-title>

                <q-btn v-close-popup flat round dense icon="close" />
              </q-toolbar>
            </q-card-section>

            <div class="q-pa-md">
                <q-input v-model="phone2" type="tel" label="Telefono fisso">
                </q-input>

              <lms-buttons class="q-mt-md">
                <lms-button
                  primary
                  label="Salva"
                  :loading="loadingContacts"
                  @click="editPhone2"
                />
              </lms-buttons>
            </div>
          </q-card>
        </q-dialog>
      </template>
    </template>

    <!-- CARICAMENTO -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-inner-loading :showing="isLoading" block />
  </div>
</template>

<script>
import { date } from "quasar";
import {ENROLLMENT_CODE_MAP, IS_DEV, IS_TEST} from "../services/config";
import {
  getEnrollmentInfo,
  getVaccinationUserAddressTemp,
  getVaccinationUserInfo,
  updateVaccinationUserContacts
} from "../services/api";
import { apiErrorNotify } from "../services/utils";
import VacAddressItem from "../components/VacAddressItem";
import VacMobilePhoneItem from "../components/VacMobilePhoneItem";
import VacEmailItem from "../components/VacEmailItem";
import VacContactAddressModal from "../components/VacContactAddressModal";
import VacAddressDialog from "components/VacAddressDialog";

const { getDateDiff } = date;

export default {
  name: "PageUserContacts",
  components: {
    VacAddressDialog,

    VacEmailItem,
    VacMobilePhoneItem,
    VacAddressItem
  },
  data() {
    return {
      IS_DEV,
      IS_TEST,
      isLoading: false,
      vaccinationUserInfo: null,
      enrollmentCode: null,
      phone1: null,
      phone2: null,
      phone3: null,
      email: null,
      vaccinationAddress: "",
      loadingContacts: false,
      tempAddress: null,
      isAddressModalOpen: false,
      newAddress: null,
      isPhone2ModalOpen: false,
      isPhone3ModalOpen: false
    };
  },
  computed: {
    workingApp() {
      return this.$store.getters["getWorkingApp"];
    },
    user() {
      return this.$store.getters["getUser"];
    },
    isDelegationActive() {
      return this.$store.getters["getDelegatorSelected"];
    },
    cf() {
      return this.$store.getters["getTaxCode"];
    },

    enrollmentInfo() {
      return this.$store.getters["getEnrollmentInfo"];
    },
    isEnlisted() {
      return (
        this.enrollmentInfo?.codice_risposta ===
        ENROLLMENT_CODE_MAP.FSE_APPROVED
      );
    },
    canOpenFse() {
      return this.enrollmentInfo?.risposta ?? false;
    },
    temporalAddress() {
      return this.tempAddress;
    },
    temporalAddressIsValid() {
      let now = new Date();
      let endDate = this.temporalAddress.data_fine_validita;
      return getDateDiff(now, endDate, "days") <= 0;
    }
  },
  created() {
    this.loadVaccinationsHome();
  },
  watch: {
    cf: {
      async handler() {
        this.vaccinationUserInfo = null;
        //riempio la home
        this.loadVaccinationsHome();
      }
    }
  },
  methods: {
    openPhone2Modal() {
      this.isPhone2ModalOpen = true;
    },
    openPhone3Modal() {
      this.isPhone3ModalOpen = true;
    },
    onAddressVerified(newAddress) {
      //da aggiungere comune
      this.tempAddress = newAddress;
    },
    openModal() {
      this.isAddressModalOpen = true;
    },
    async loadVaccinationsHome() {
      let taxCode = this.cf;
      this.isLoading = true;

      await this.getDelegateEnrollment();

      let vaccinationUserInfoPromise = getVaccinationUserInfo(taxCode);

      try {
        let { data } = await vaccinationUserInfoPromise;
        this.vaccinationUserInfo = data;

        if (
          this.vaccinationUserInfo &&
          this.vaccinationUserInfo.codice_fiscale === ""
        ) {
          this.vaccinationUserInfo = null;
        }
      } catch (error) {
        console.error(error);
      }

      if (this.vaccinationUserInfo) {
        if (this.vaccinationUserInfo.domicilio_vaccinazioni) {
          let indirizzo = this.vaccinationUserInfo.domicilio_vaccinazioni
            .indirizzo;
          let cap = this.vaccinationUserInfo.domicilio_vaccinazioni.cap;
          let comune = this.vaccinationUserInfo.domicilio_vaccinazioni.comune;
          if (comune !== "") {
            this.vaccinationAddress = comune + " " + indirizzo;
          }
        }

        if (this.vaccinationUserInfo.contatti_vaccinazioni) {
          this.email = this.vaccinationUserInfo.contatti_vaccinazioni.email;
          this.phone1 = this.vaccinationUserInfo.contatti_vaccinazioni.telefono;
          this.phone2 = this.vaccinationUserInfo.contatti_vaccinazioni.telefono_2;
          this.phone3 = this.vaccinationUserInfo.contatti_vaccinazioni.telefono_3;
        }

        try {
          let { data } = await getVaccinationUserAddressTemp(taxCode);
          this.tempAddress = data;
        } catch (error) {
          let message = "Nessun contatto temporaneo trovato";
          apiErrorNotify({ error, message });
        }
      }

      setTimeout(() => (this.isLoading = false), 3000);
    },
    async getDelegateEnrollment() {
      if (!this.isDelegationActive) return;

      let taxCode = this.cf;
      let params = {
        servizio: this.workingApp?.codice_servizio
      };

      try {
        let { data } = await getEnrollmentInfo(taxCode, { params });
        this.enrollmentCode = data.codice_risposta;
      } catch (error) {
        console.error(error);
        this.enrollmentCode = "999";
      }
    },
    editMail(newContact) {
      if (this.email === newContact) {
        let color = "info";
        let message = "Nessuna modifica ai contatti";
        this.$q.notify({ color, message });
        return;
      }

      this.email = newContact;
      this.editContactsNew();
    },
    editPhone1(newContact) {
      if (this.phone1 === newContact) {
        let color = "info";
        let message = "Nessuna modifica ai contatti";
        this.$q.notify({ color, message });
        return;
      }

      this.phone1 = newContact;
      this.editContactsNew();
    },
    editPhone2() {
      this.editContactsNew();
    },
    editPhone3() {
      this.editContactsNew();
    },
    async editContactsNew() {
      this.loadingContacts = true;

      let taxCode = this.cf;
      let payload = {
        telefono: this.phone1,
        telefono_2: this.phone2,
        telefono_3: this.phone3,
        email: this.email
      };

      try {
        await updateVaccinationUserContacts(taxCode, payload);
        let type = "positive";
        let color = "green-6";
        let message = "Contatti aggiornati";
        this.$q.notify({ type, color, message });
      } catch (error) {
        let message = "Non è stato possibile modificare i contatti";
        apiErrorNotify({ error, message });
      }

      this.loadingContacts = false;
      this.isPhone2ModalOpen = false;
      this.isPhone3ModalOpen = false;
    }
  }
};
</script>

<style lang="sass"></style>
