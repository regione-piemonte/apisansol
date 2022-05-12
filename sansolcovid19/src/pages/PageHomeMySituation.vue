<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page class="covid-page-home-my-situation" padding>
    <div class="row q-col-gutter-md">
      <!-- ULTIMA PRENOTAZIONE TAMPONE -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div class="col-12 col-md">
        <q-card class="covid-page-home-my-situation__box">
          <q-card-section class="full-height">
            <div class="full-height row q-col-gutter-x-sm">
              <div class="col-auto">
                <q-icon
                  name="img:/statics/la-mia-salute/icone/calendario.svg"
                  size="lg"
                />
              </div>

              <div class="col full-height column">
                <div class="col">
                  <div class="text-bold">Prenotazioni</div>

                  <!-- NO PRENOTAZIONI -->
                  <!-- --------------- -->
                  <template v-if="!reservationLast">
                    <div class="q-mt-md">Nessuna prenotazione disponibile</div>
                  </template>

                  <!-- PRENOTAZIONI -->
                  <!-- ------------ -->
                  <template v-else>
                    <!-- PRENOTAZIONE NELLA LISTA TAMPONI -->
                    <template v-if="reservationLast.__type === TYPE_MAP.SWAB">
                      <template v-if="reservationLast.testTipo">
                        <div class="q-mt-md q-body-1 text-bold text-primary">
                          <covid-swab-type-label
                            :code="reservationLast.testTipo.testTipoCod"
                          />
                        </div>
                      </template>

                      <div class="q-caption text-bold">
                        {{ reservationLast.hotspotDispeffFasciaDa | date }} -
                        {{ reservationLast.hotspotDispeffFascia }}
                      </div>

                      <template v-if="reservationLast.hotspotDesc">
                        <div class="q-mt-md q-body-1">
                          Presso: <br />
                          <span class="q-caption">
                            {{ reservationLast.hotspotDesc }}
                          </span>
                        </div>
                      </template>
                    </template>

                    <!-- PRENOTAZIONE NELLA LISTA PRENOTAZIONI -->
                    <template v-else>
                      <template v-if="reservationLast.testTipo">
                        <div class="q-mt-md q-body-1 text-bold text-primary">
                          <covid-swab-type-label
                            :code="reservationLast.testTipo.testTipoCod"
                          />
                        </div>
                      </template>

                      <div class="q-caption text-bold">
                        {{ reservationLast.hotspotDispeffFasciaDa | date }} -
                        {{ reservationLast.hotspotDispeffFascia }}
                      </div>

                      <template v-if="reservationLast.hotspot">
                        <div class="q-mt-md q-body-1">
                          Presso: <br />
                          {{ reservationLast.hotspot.hotspotDesc }}
                        </div>
                      </template>
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- ULTIMO TAMPONE -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div class="col-12 col-md">
        <q-card class="covid-page-home-my-situation__box">
          <q-card-section class="full-height">
            <template v-if="swabLast && swabLast.__type === TYPE_MAP.SCREEN">
              <covid-last-swab-screen-item
                :show-all="swabUnionList.length > 0"
                :swab-last="swabLast"
                class="full-height"
              />
            </template>

            <template v-else>
              <covid-last-swab-item
                :show-all="swabUnionList.length > 0"
                :swab-last="swabLast"
                class="full-height"
              />
            </template>
          </q-card-section>
        </q-card>
      </div>

      <!-- ULTIMO EVENTO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <div class="col-12 col-md">
        <q-card class="covid-page-home-my-situation__box">
          <template v-if="IS_DEV || IS_TEST">
            <template v-if="isEventLastRevoked">
              <lms-card-item-bar type="negative">
                Questo provvedimento è stato revocato il
                {{ eventLastRevokeDate | datetime }} con numero provvedimento revoca
                {{ eventLastRevokeId }}
              </lms-card-item-bar>
            </template>
          </template>

          <q-card-section class="no-padding full-height">
            <q-card-section>
              <div class="full-height row q-col-gutter-x-sm">
                <div class="col-auto">
                  <covid-event-icon :type-code="eventLastTypeId" />
                </div>

                <div class="col full-height column">
                  <div class="col">
                    <div class="text-bold">
                      <!-- Se esiste il "numeroProvvediemento" => si tratta di un provvedimento -->
                      <template v-if="eventLastNumber">
                        Ultimo provvedimento
                      </template>
                      <!-- Altrimenti si tratta di un evento -->
                      <template v-else> Ultimo evento</template>
                    </div>

                    <!-- NO EVENTI -->
                    <!-- --------- -->
                    <template v-if="!eventLast">
                      <div class="q-mt-md">
                        Nessun provvedimento o evento disponibile
                      </div>
                    </template>

                    <!-- EVENTI -->
                    <!-- ------ -->
                    <template v-else>
                      <template v-if="eventLast.decodeTipoEvento">
                        <div class="q-mt-md q-body-1 text-bold text-primary">
                          {{ eventLast.decodeTipoEvento.descTipoEvento }}
                        </div>
                      </template>

                      <div class="text-caption">
                        Dal
                        <span class="text-bold">
                          {{ eventLast.dataDimissioni | date }}
                        </span>
                      </div>

                      <template v-if="!eventLast.dataPrevFineEvento">
                        <template v-if="!isEventLastTypeHealed">
                          <div class="text-caption">
                            La data fine provvedimento sarà valorizzata a
                            chiusura del provvedimento
                          </div>
                        </template>
                      </template>
                      <template v-else>
                        <div class="text-caption">
                          Al
                          <span class="text-bold">
                            {{ eventLast.dataPrevFineEvento | date }}
                          </span>
                          <template v-if="isEventLastTypeQuarantine">
                            Da confermare con tampone negativo senza sintomi
                          </template>
                        </div>
                      </template>

                      <template v-if="eventLastPlace">
                        <div class="q-mt-md">Presso:</div>
                        <div class="text-caption">
                          {{ eventLastPlace }}
                        </div>
                      </template>

                      <template v-if="eventLastNumber">
                        <div class="q-mt-md">Numero provvedimento:</div>
                        <div class="text-caption">
                          {{ eventLastNumber }}
                        </div>
                      </template>

                      <template v-if="eventLastAsl">
                        <div class="q-mt-md">Autorità sanitaria:</div>
                        <div class="text-caption">
                          {{ eventLastAsl }}
                        </div>
                      </template>
                    </template>
                  </div>
                  <template v-if="showConductObligations">
                    <div class="q-mt-md row items-center">
                      <a
                        class="lms-link"
                        :href="conductObbligationsUrl"
                        target="_blank"
                      >
                        Istruzioni e linee guida
                      </a>
                    </div>
                  </template>

                  <!--                <template v-if="IS_DEV || IS_TEST">-->
                  <!--                  <template v-if="eventLastNumber">-->
                  <!--                    <div class="row items-center q-mt-md">-->
                  <!--                      <a class="lms-link" href="#" @click.prevent="printEvent">-->
                  <!--                        Stampa provvedimento-->
                  <!--                      </a>-->
                  <!--                      <covid-print-event :event="eventLast"/>-->
                  <!--                    </div>-->
                  <!--                  </template>-->
                  <!--                </template>-->

                  <!--                  <template v-if="eventList.length > 0">-->
                  <!--                    <div class="col-auto q-mt-lg text-right">-->
                  <!--                      <router-link :to="HOME_EVENT_LIST" class="lms-link">-->
                  <!--                        Vedi tutti-->
                  <!--                      </router-link>-->
                  <!--                    </div>-->
                  <!--                  </template>-->
                </div>
                <template v-if="IS_DEV || IS_TEST">
                  <div class="col-auto">
                    <div
                      v-if="eventLastNumber || showConductObligations"
                      class="row reverse text-center"
                    >
                      <q-icon
                        class="cursor-pointer"
                        color="grey-7"
                        name="more_vert"
                        size="sm"
                      >
                        <q-menu auto-close>
                          <q-list>
                            <q-item
                              v-if="eventLastNumber"
                              clickable
                              @click="printEvent()"
                            >
                              <q-item-section
                                >Stampa Provvedimento</q-item-section
                              >
                            </q-item>
<!--                            <q-item-->
<!--                              v-if="showConductObligations"-->
<!--                              clickable-->
<!--                              tag="a"-->
<!--                              :href="conductObbligationsUrl"-->
<!--                              target="_blank"-->

<!--                            >-->
<!--                              <q-item-section>-->
<!--                                Istruzioni e linee guida</q-item-section-->
<!--                              >-->
<!--                            </q-item>-->
                          </q-list>
                        </q-menu>
                      </q-icon>
                    </div>
                  </div>
                </template>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <template v-if="eventList.length > 0">
                <div class="col-auto q-mt-lg text-right">
                  <router-link :to="HOME_EVENT_LIST" class="lms-link">
                    Vedi tutti
                  </router-link>
                </div>
              </template>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <covid-attachment-buttons class="q-mt-md" />
    <covid-conduct-obligations-dialog
      v-model="isOpenConductObligationsDialog"
      :event-code="eventLastTypeId"
    />

    <covid-print-event :event="eventLast" v-if="eventLastNumber" />
  </lms-page>
</template>

<script>
import { date } from "quasar";
import CovidSwabTypeLabel from "../components/CovidSwabTypeLabel";
import CovidLastSwabItem from "../components/CovidLastSwabItem";
import CovidEventIcon from "../components/CovidEventIcon";
import { orderBy } from "../services/utils";
import CovidLastSwabScreenItem from "../components/CovidLastSwabScreenItem";
import { HOME_EVENT_LIST } from "../router/routes";
import {
  CONDUCT_OBLIGATIONS_CODE_MAP,
  EVENT_TYPE_CODE_MAP,
  IS_DEV,
  IS_PROD,
  IS_TEST,
} from "../services/config";
import CovidAttachmentButtons from "../components/CovidAttachmentButtons";
import CovidConductObligationsDialog from "components/CovidConductObligationsDialog";
import CovidPrintEvent from "components/CovidPrintEvent";
import { onPrintEvent } from "src/services/business-logic";
import LmsCardItemBar from "../components/core/LmsCardItemBar";
import {quarantineRules} from "src/services/urls";

const { getDateDiff, getMaxDate } = date;

const TYPE_MAP = {
  SWAB: "SWAB",
  SCREEN: "SCREEN",
  RESERVATION: "RESERVATION",
};

export default {
  name: "PageHomeMySituation",
  components: {
    LmsCardItemBar,
    CovidPrintEvent,
    CovidConductObligationsDialog,
    CovidAttachmentButtons,
    CovidLastSwabScreenItem,
    CovidEventIcon,
    CovidLastSwabItem,
    CovidSwabTypeLabel,
  },
  props: {},
  data() {
    return {
      IS_DEV,
      IS_TEST,
      IS_PROD,
      TYPE_MAP,
      HOME_EVENT_LIST,
      isOpenConductObligationsDialog: false,
    };
  },
  computed: {
    conductObbligationsUrl(){
      return quarantineRules()
    },
    citizenCovid() {
      return this.$store.getters["getCitizen"];
    },
    reservationList() {
      let now = new Date();
      let reservationList = this.citizenCovid?.elencoPrenotazioneTampone || [];
      let swabList = this.citizenCovid?.elencoTampone || [];

      swabList = swabList.filter((s) => {
        // Escludiamo i tamponi che hanno già un risultato
        if (s.idRisTamp) return false;
        // Escludiamo i tamponi che non hanno hotspot
        if (!s.hotspotDispeffId) return false;

        // Poi prendiamo solo quelli cha hanno la data di appuntamento > di adesso
        let diff = getDateDiff(s.hotspotDispeffFasciaDa, now, "days");
        return diff >= 0;
      });

      reservationList = reservationList.map((s) => {
        return {
          __type: TYPE_MAP.RESERVATION,
          __id: s.prenotazioneTamponeId,
          __date: s.hotspotDispeffFasciaDa,
          ...s,
        };
      });

      swabList = swabList.map((s) => {
        return {
          __type: TYPE_MAP.SWAB,
          __id: s.idTampone,
          __date: s.dataInserimentoRichiesta,
          ...s,
        };
      });

      return [...swabList, ...reservationList];
    },
    reservationListSorted() {
      return orderBy(this.reservationList, ["__date"], ["desc"]);
    },
    reservationLast() {
      return this.reservationListSorted[0];
    },
    swabList() {
      let now = new Date();
      let swabList = this.citizenCovid?.elencoTampone || [];

      swabList = swabList.filter((s) => {
        // Prendiamo i tamponi che hanno già un risultato
        if (s.idRisTamp) return true;
        // Prendiamo i tamponi che non hanno hotspot
        if (!s.hotspotDispeffId) return true;

        // Poi prendiamo solo quelli cha hanno la data di appuntamento < di adesso
        let diff = getDateDiff(s.hotspotDispeffFasciaDa, now, "days");
        return diff < 0;
      });

      return swabList;
    },
    swabScreenList() {
      let now = new Date();
      let screenList = this.citizenCovid?.elencoTestScreening || [];

      screenList = screenList.filter((s) => {
        // Prendiamo i tamponi che hanno già un risultato
        if (s.testEsito) return true;

        // Poi prendiamo solo quelli cha hanno la data di esecuzione < di adesso
        let diff = getDateDiff(s.testDataEsecuzione, now, "days");
        return diff < 0;
      });

      return screenList;
    },
    swabUnionList() {
      let swabList = this.swabList.map((s) => {
        let __date = getMaxDate(s.dataInserimentoRichiesta, s.dataTest);

        return {
          __type: TYPE_MAP.SWAB,
          __id: s.idTampone,
          // __date: s.dataInserimentoRichiesta,
          __date,
          ...s,
        };
      });

      let screenList = this.swabScreenList.map((s) => {
        return {
          __type: TYPE_MAP.SCREEN,
          __id: s.testId,
          __date: s.testDataEsecuzione,
          ...s,
        };
      });

      return [...swabList, ...screenList];
    },
    swabUnionListSorted() {
      return orderBy(this.swabUnionList, ["__date"], ["desc"]);
    },
    swabLast() {
      return this.swabUnionListSorted[0];
    },
    eventList() {
      return this.citizenCovid?.elencoDecorso || [];
    },
    eventListSorted() {
      return orderBy(this.eventList, ["dataDimissioni"], ["desc"]);
    },
    eventLast() {
      return this.eventListSorted[0];
    },
    eventLastTypeId() {
      return this.eventLast?.decodeTipoEvento?.idTipoEvento || null;
    },
    eventLastPlace() {
      let city = this.eventLast?.comuneRicovero?.nomeComune;
      let address = this.eventLast?.indirizzoDecorso;
      let place = this.eventLast?.decorsoPresso;
      return [city, address, place]
        .filter((v) => !!v)
        .join(", ")
        .trim();
    },
    eventLastNote() {
      return this.eventLast?.note;
    },
    eventLastAsl() {
      return this.eventLast?.aslProvvedimento;
    },
    eventLastNumber() {
      return this.eventLast?.numeroProvvedimento;
    },
    eventLastRevokeDate() {
      return this.eventLast?.dataRevoca;
    },
    eventLastRevokeId(){
      return this.eventLast?.idProvvedimentoRevoca;
    },
    isEventLastRevoked() {
      // Un provvedimento è revocato solo se esiste la data revoca
      return !!this.eventLastRevokeDate;
    },
    isEventLastTypeHealed() {
      let codes = [EVENT_TYPE_CODE_MAP.HEALED, 26];
      return codes.includes(this.eventLastTypeId);
    },
    isEventLastTypeQuarantine() {
      let codes = [
        EVENT_TYPE_CODE_MAP.ISOLATION,
        EVENT_TYPE_CODE_MAP.QUARANTINE_VACCINATION_AFTER_120_DAYS,
        EVENT_TYPE_CODE_MAP.QUARANTINE_VACCINATION_NONE,
        EVENT_TYPE_CODE_MAP.QUARANTINE_TO_BE_EXPLORED,
      ];

      return codes.includes(this.eventLastTypeId);
    },
    showConductObligations() {
      return CONDUCT_OBLIGATIONS_CODE_MAP.includes(this.eventLastTypeId);
    },
  },
  created() {},
  methods: {
    showConductObligationsDialog() {
      this.isOpenConductObligationsDialog = true;
    },
    printEvent() {
      onPrintEvent(this.eventLastNumber);
    },
  },
};
</script>

<style lang="scss" scoped>
.covid-page-home-my-situation__box {
  height: 100%;
}
</style>
