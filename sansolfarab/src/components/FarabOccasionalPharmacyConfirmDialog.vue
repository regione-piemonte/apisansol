<!--
 SPDX-License-Identifier: EUPL-1.2
 Copyright Regione Piemonte - 2023
-->

<template>
  <q-dialog v-bind="attrs" v-on="listeners" @hide="onHide">
    <q-card>
      <q-card-section>
        <div class="row items-start justify-between ">
          <h2 class="no-margin col">
            <strong>Farmacia occasionale</strong>
          </h2>
          <q-btn v-close-popup class="col-auto" dense flat icon="close" round/>
        </div>
      </q-card-section>

      <!-- NON CI SONO FARMACIE OCCASIONALI CHE HANNO FATTO RICHIESTA -->
      <!-- ---------------------------------------------------------- -->
      <template v-if="!occasionalPharmacy">
        <q-card-section>
          <q-banner class="q-banner--warning">
            <div class="text-body1">
              Non ci sono richieste di autorizzazione da approvare. <br/>
              Torna alla schermata precedente, assicurati che il farmacista abbia effettuato la lettura della tessera
              sanitaria e dopo clicca sul pulsante "consenti".
            </div>
          </q-banner>
        </q-card-section>

        <q-card-section>
          <lms-button v-close-popup class="full-width" label="Chiudi"/>
        </q-card-section>
      </template>

      <!-- CI SONO FARMACIE OCCASIONALI CHE HANNO FATTO RICHIESTA -->
      <!-- ------------------------------------------------------ -->
      <template v-else>
<!--        autrìorizzazione scaduta ??-->
        <template v-if="authorizationError">
          <q-card-section>
            <q-banner class="q-banner--warning">
              <q-item class="text-body1 no-padding">
                <q-item-section side avatar>

                  <q-icon name="warning" size="md"/>

                </q-item-section>
                <q-item-section>
                  <div class="text-body1">
                    Non ci sono richieste di autorizzazione da approvare. <br/>
                    Torna alla schermata precedente, assicurati che il farmacista abbia effettuato la lettura della tessera
                    sanitaria e dopo clicca sul pulsante "consenti".
                  </div>
                </q-item-section>
              </q-item>

            </q-banner>
          </q-card-section>
          <q-card-section>
            <lms-button v-close-popup class="full-width" label="Chiudi"/>
          </q-card-section>
        </template>
        <template v-else>
          <!-- FARMACIA NON AUTORIZZATA -->
          <!-- ------------------------ -->
          <template v-if="!authorizedPharmacy">
            <q-card-section>
              <q-banner class="q-banner--info">
                <div class="text-body1 q-mt-sm">
                  <p>
                    Vuoi autorizzare la farmacia
                  </p>

                  <p>
                    <strong>{{ occasionalPharmacyName }}
                      <br>
                      {{occasionalPharmacyAddress}}
                    </strong>

                  </p>
                  <p>a consultare le ricette in modo occasionale?</p>

                </div>
              </q-banner>
            </q-card-section>

            <q-card-section>
              <lms-button
                :loading="allowingOccasionalPharmacy"
                class="full-width"
                label="Conferma"
                @click="allowOccasionalPharmacy"
              />
            </q-card-section>
          </template>

          <!-- FARMACIA AUTORIZZATA -->
          <!-- -------------------- -->
          <template v-else>
            <q-card-section>
              <q-banner class="q-banner--positive">
                <q-item class="text-body1 no-padding">
                  <q-item-section side avatar>

                    <q-icon name="o_check_circle" size="md"/>

                  </q-item-section>
                  <q-item-section>

                    <div class="text-body1 q-mt-sm">
                      <p>
                        Hai autorizzato la farmacia
                      </p>
                      <p>
                        <strong>{{ occasionalPharmacyName }}
                          <br>
                          {{occasionalPharmacyAddress}}
                        </strong>

                      </p>
                      <p>a consultare le ricette</p>
                    </div>
                  </q-item-section>
                </q-item>

              </q-banner>
            </q-card-section>
          </template>
        </template>


      </template>
    </q-card>
  </q-dialog>
</template>

<script>
import {authorizePharmacy} from "src/services/api";
import {apiErrorNotify, apiErrorNotifyDialog} from "src/services/utils";

export default {
  name: "FarabOccasionalPharmacyConfirmDialog",
  components: {},
  props: {
    occasionalPharmacy: {type: Object, required: false, default: () => null}
  },
  data() {
    return {
      allowingOccasionalPharmacy: false,
      authorizedPharmacy: null,
      authorizationError:false
    };
  },
  computed: {
    attrs() {
      const {...attrs} = this.$attrs;
      return attrs;
    },
    listeners() {
      const {...listeners} = this.$listeners;
      return listeners;
    },
    deviceUuid() {
      return this.$store.getters["getDeviceUuid"];
    },
    occasionalPharmacyName() {
      return this.occasionalPharmacy?.farmacia?.descrizione;
    },
    occasionalPharmacyAddress() {
      let address= this.occasionalPharmacy?.farmacia?.indirizzo ?? ''
      let city = this.occasionalPharmacy?.farmacia?.comune ?? ''
      return `${address} - ${city}` ;
    }
  },
  created() {
  },
  methods: {
    onHide() {
      this.allowingOccasionalPharmacy = false;
      this.authorizedPharmacy = null;
      this.authorizationError=false;
    },
    async allowOccasionalPharmacy() {
      let params = {uuid: this.deviceUuid};

      this.allowingOccasionalPharmacy = true;

      try {
        let {data} = await authorizePharmacy(params);
        this.authorizedPharmacy = true;
      } catch (error) {
        this.authorizedPharmacy = false;
        let errorCode = error?.response?.data?.detail?.[0]?.chiave ?? null;

        // FAR-CC-0068 -> Nessuna richiesta pendente
        //                Significa anche che l'uuid sul browser è lo stesso salvato sul FSE
        if (errorCode === "FAR-CC-0068")
          this.authorizationError = true
        else{
          let message = "Non è stato possibile autorizzare la farmacia";
          apiErrorNotifyDialog({error, message});
        }

        this.allowingOccasionalPharmacy = false;
      }
    }
  }
};
</script>

<style scoped></style>
