<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <div>
      <p>
        Di seguito i contatti presso i quali
        <strong
          >riceverai le comunicazioni del servizio Prevenzione Serena</strong
        >.</p>
    </div>
    <q-card class="bg-white" v-if="!isLoading && userInfo">
      <q-card-section class="q-px-sm q-py-none">
        <q-list separator class="contacts-list" >
          <q-item
            clickable
            @click="updateContact(CONTACTS_TYPES.EMAIL)"
            class="q-pa-md"
          >
            <q-item-section side>
              <q-icon name="email" color="secondary" text-color="white" size="md" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1" class="text-subtitle1">Email</q-item-label>
              <q-item-label v-if="!userInfo.email" class="sublabel"
              >Aggiungi</q-item-label
              >
              <q-item-label v-else class="sublabel">{{
                userInfo.email
                }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon
                v-if="!userInfo.email"
                name="keyboard_arrow_right"
                color="primary"
              />
              <q-icon v-else name="edit" color="faded" />
            </q-item-section>
          </q-item>

          <q-item
            clickable
            @click="updateContact(CONTACTS_TYPES.ADDRESS)"
            class="q-pa-md"
          >
            <q-item-section side>
              <q-icon name="house" color="secondary" text-color="white" size="md" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1" class="text-subtitle1"
              >Indirizzo per spedizione comunicazioni</q-item-label
              >
              <q-item-label v-if="!userAddress" class="sublabel"
              >Aggiungi</q-item-label
              >
              <q-item-label v-else class="sublabel">
                {{ userAddress.indirizzo }} {{ userAddress.civico
                }}<br />
                {{ userAddress.cap }} {{ userAddress.comune}}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon
                v-if="!userAddress"
                name="keyboard_arrow_right"
                color="primary"
              />
              <q-icon v-else name="edit" color="faded" />
            </q-item-section>
          </q-item>

          <q-item
            clickable
            @click="updateContact(CONTACTS_TYPES.LANDLINE_PHONE)"
            class="q-pa-md"
          >
            <q-item-section side>
              <q-icon name="phone" color="secondary" text-color="white" size="md" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1" class="text-subtitle1"
              >Telefono</q-item-label
              >
              <q-item-label v-if="!userInfo.telefono_1 && !userInfo.telefono_1_locale" class="sublabel"
              >Aggiungi</q-item-label
              >
              <q-item-label v-if="userInfo.telefono_1 && !userInfo.telefono_1_locale" class="sublabel">
                {{ userInfo.telefono_1 }}
              </q-item-label>

              <q-item-label v-if="userInfo.telefono_1_locale" class="sublabel">
                {{ userInfo.telefono_1_locale }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon
                v-if="!userInfo.telefono_1 && !userInfo.telefono_1_locale"
                name="keyboard_arrow_right"
                color="primary"
              />
              <q-icon v-else name="edit" color="faded" />
            </q-item-section>
          </q-item>

          <q-item
            clickable
            @click="updateContact(CONTACTS_TYPES.MOBILE_PHONE)"
            class="q-pa-md"
          >
            <q-item-section side>
              <q-icon name="phone" color="secondary" text-color="white" size="md" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1" class="text-subtitle1"
              >Numero cellulare</q-item-label
              >
              <q-item-label v-if="!userInfo.telefono_2 && !userInfo.telefono_2_locale" class="sublabel"
              >Aggiungi</q-item-label
              >
              <q-item-label v-if="userInfo.telefono_2 && !userInfo.telefono_2_locale" class="sublabel">
                {{ userInfo.telefono_2 }}
              </q-item-label>

              <q-item-label v-if="userInfo.telefono_2_locale" class="sublabel">
                {{ userInfo.telefono_2_locale }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon
                v-if="!userInfo.telefono_2 && !userInfo.telefono_2_locale"
                name="keyboard_arrow_right"
                color="primary"
              />
              <q-icon v-else name="edit" color="faded" />
            </q-item-section>
          </q-item>
        </q-list>

      </q-card-section>
    </q-card>


    <template v-if="!userInfo">
      <q-banner class="h-banner h-banner--info">
        Non sono stati trovati i contatti
      </q-banner>
    </template>

    <q-dialog v-model="changeContactDialog" :maximized="$q.screen.lt.sm">
      <template v-if="selectedType === CONTACTS_TYPES.ADDRESS">
        <csi-change-address-dialog @update-address="UpdateNewContacts" />
      </template>
      <template v-else-if="selectedType">
        <csi-change-contacts-dialog
          @update-contacts="UpdateNewContacts"
          :type="selectedType"
          :current-email="userInfo.email"
          :current-landing-phone="userInfo.telefono_1_locale"
          :current-mobile-phone="userInfo.telefono_2_locale"
        />
      </template>
    </q-dialog>
    <lms-inner-loading block :showing="isLoading" />
  </lms-page>
</template>

<script>
import CsiChangeContactsDialog from "../components/preventionScreening/CsiChangeContactsDialog";

import CsiChangeAddressDialog from "../components/preventionScreening/CsiChangeAddressDialog";
import { getUserRiscreInfo } from "src/services/api";
import {CONTACTS_TYPES} from "src/services/config";

export default {
  name: "PageContacts",
  components: { CsiChangeAddressDialog, CsiChangeContactsDialog },
  data() {
    return {
      isLoading: false,
      changeContactDialog: false,
      selectedType: null,
      CONTACTS_TYPES
    };
  },
  computed: {
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    userInfo() {
      return this.$store.getters["preventionScreening/getUserRiscreInfo"];
    },
    userAddress(){
      let address =null
      if(this.userInfo.indirizzo_alternativo){
        address= {
          indirizzo:this.userInfo.indirizzo_alternativo,
          civico: this.userInfo.civico_alternativo,
          cap:this.userInfo.cap_alternativo,
          comune:this.userInfo.comune_alternativo
        }
      }else{
        address= {
          indirizzo:this.userInfo.indirizzo,
          civico: this.userInfo.civico,
          cap:this.userInfo.cap,
          comune:this.userInfo.comune
        }
      }

      return address
    }
  },
  methods: {
    updateContact(type) {
      this.selectedType = type;
      this.changeContactDialog = true;
    },
    UpdateNewContacts(newAddress) {
      this.updateUserData();
    },
    async updateUserData() {
      this.isLoading = true;
      let userDataPromise = getUserRiscreInfo(this.cf, {
        _no5XXRedirect: true
      });
      let userDataResponse = await userDataPromise;
      this.$store.dispatch("preventionScreening/setUserInfo", userDataResponse.data);
      this.isLoading = false;
    }
  }
};
</script>

<style lang="sass"></style>
