<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="covid-event-list-item" >
    <template v-if="IS_DEV || IS_TEST">
      <template v-if="isRevoked">
        <lms-card-item-bar type="negative">
          Questo provvedimento è stato revocato il
          {{ eventRevokeDate | datetime }} con numero provvedimento revoca
          {{ eventRevokeId }}
        </lms-card-item-bar>
      </template>
    </template>

    <div class="row q-py-md">
      <div class="col">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md">
            <q-item class="q-body-1 items-start">
              <q-item-section class="self-center" side>
                <covid-event-icon :type-code="eventTypeId" />
              </q-item-section>

              <q-item-section>
                <div class="text-bold">
                  {{ eventType }}
                </div>

                <template v-if="eventIsolationPlace">
                  <div>Presso {{ eventIsolationPlace }}</div>
                </template>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-md">
            <q-item class="q-body-1">
              <q-item-section>
                <div>
                  Dal
                  <span class="text-bold">
                {{ eventDate | date }}
              </span>
                </div>

                <template v-if="!eventQuarantineEndDate">
                  <template v-if="!isEventTypeHealed">
                    <div class="text-caption">
                      La data fine provvedimento sarà valorizzata a chiusura del
                      provvedimento
                    </div>
                  </template>
                </template>
                <template v-else>
                  <div>
                    Al
                    <span class="text-bold">
                  {{ eventQuarantineEndDate | date | empty }}
                </span>
                    <template v-if="isEventLastTypeQuarantine">
                      Da confermare con tampone negativo senza sintomi
                    </template>
                  </div>
                </template>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-md" v-if="eventNumber">
            <q-item class="q-body-1">
              <q-item-section>
                <template v-if="eventNumber">
                  Numero provvedimento: <br />
                  <span class="text-bold">{{ eventNumber | empty }}</span>
                </template>
                <template v-if="eventNumber && eventAsl">
                  <div class="q-py-xs"></div>
                </template>
                <template v-if="eventAsl">
                  Autorità sanitaria: <br />
                  <span class="text-bold">{{ eventAsl | empty }}</span>
                </template>
              </q-item-section>
            </q-item>
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-item class="q-body-1 items-start">
              <q-item-section class="self-center gt-sm" side>
                <div class="invisible" style="width: 38px"></div>
              </q-item-section>
              <q-item-section>
                Destinatario: <br />
                <div>
              <span class="text-bold">{{
                  recipientFullname | startCase | empty
                }}</span>
                  <span class="text-italic">
                (cf : {{ recipientTaxCode | empty }})</span
                  >
                </div>
                <template v-if="recipientBirthDay">
                  <div>Data di nascita: {{ recipientBirthDay | date }}</div>
                </template>
              </q-item-section>
            </q-item>
          </div>
        </div>
        <template v-if="isEndOfQuarantine">
          <q-item class="q-body-1 items-start q-mt-sm">
            <q-item-section class="self-center gt-sm" side>
              <div class="invisible" style="width: 38px"></div>
            </q-item-section>
            <q-item-section class="text-italic">
              Valido per eventuale rientro a scuola/università
            </q-item-section>
          </q-item>
        </template>
      </div>
      <q-space/>
      <div class="col-auto" v-if="IS_DEV || IS_TEST">
        <div
          class="row reverse text-center q-pa-sm"
          v-if="eventNumber || showConductObligations"
        >
          <q-icon
            color="grey-7"
            size="sm"
            name="more_vert"
            class="cursor-pointer"
          >
            <q-menu auto-close>
              <q-list>
                <q-item clickable @click="printEvent()" v-if="eventNumber">
                  <q-item-section>Stampa Provvedimento</q-item-section>
                </q-item>
<!--                <q-item-->
<!--                  clickable-->
<!--                  tag="a"-->
<!--                  :href="conductObbligationsUrl"-->
<!--                  target="_blank"-->
<!--                  v-if="showConductObligations"-->
<!--                >-->
<!--                  <q-item-section> Istruzioni e linee guida</q-item-section>-->
<!--                </q-item>-->
              </q-list>
            </q-menu>
          </q-icon>
        </div>
      </div>
    </div>

    <template v-if="showConductObligations">
      <div class="q-px-md q-pb-md row items-center justify-end">
        <a
          class="lms-link"
          :href="conductObbligationsUrl"
          target="_blank"
        >
          Istruzioni e linee guida
        </a>
      </div>
    </template>

    <covid-conduct-obligations-dialog
      v-model="isOpenConductObligationsDialog"
      :event-code="eventTypeId"
    />

    <covid-print-event :event="event" v-if="eventNumber" />
  </div>
</template>

<script>
import CovidEventIcon from "./CovidEventIcon";
import {
  CONDUCT_OBLIGATIONS_CODE_MAP,
  EVENT_TYPE_CODE_MAP,
  IS_DEV,
  IS_PROD,
  IS_TEST,
} from "../services/config";
import CovidConductObligationsDialog from "components/CovidConductObligationsDialog";
import CovidPrintEvent from "components/CovidPrintEvent";
import { onPrintEvent } from "src/services/business-logic";
import LmsCardItemBar from "./core/LmsCardItemBar";
import {quarantineRules} from "src/services/urls";

export default {
  name: "CovidEventListItem",
  components: {
    LmsCardItemBar,
    CovidPrintEvent,
    CovidConductObligationsDialog,
    CovidEventIcon,
  },
  props: {
    event: { type: Object, required: false, default: () => null },
  },
  data() {
    return {
      IS_PROD,
      IS_DEV,
      IS_TEST,
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
    eventId() {
      return this.event?.idDecorso;
    },
    eventType() {
      return this.event?.decodeTipoEvento?.descTipoEvento;
    },
    eventTypeId() {
      return this.event?.decodeTipoEvento?.idTipoEvento || null;
    },
    eventDate() {
      return this.event?.dataDimissioni;
    },
    // In realtà è la data di inserimento nel db
    // eventStartDate() {
    //   return this.event && this.event.dataEvento;
    // },
    eventQuarantineEndDate() {
      return this.event?.dataPrevFineEvento;
    },
    eventSymptomsStartDate() {
      return this.event?.dataInizioSint;
    },
    eventSymptoms() {
      return this.event?.sintomi || "-";
    },
    eventNote() {
      return this.event?.note;
    },
    eventClinicalCondition() {
      return this.event?.condizioniCliniche;
    },
    eventStructure() {
      return this.event?.struttura?.nome;
    },
    eventArea() {
      return this.event?.area?.nome;
    },
    eventAsl() {
      return this.event?.aslProvvedimento;
    },
    eventNumber() {
      return this.event?.numeroProvvedimento;
    },
    eventRevokeDate() {
      return this.event?.dataRevoca;
    },
    eventRevokeId() {
      return this.event?.idProvvedimentoRevoca;
    },
    eventIsolationPlace() {
      let city = this.event?.comuneRicovero?.nomeComune;
      let address = this.event?.indirizzoDecorso;
      let place = this.event?.decorsoPresso;
      return [city, address, place]
        .filter((v) => !!v)
        .join(", ")
        .trim();
    },
    isEventTypeHealed() {
      let codes = [EVENT_TYPE_CODE_MAP.HEALED, 26];
      return codes.includes(this.eventTypeId);
    },
    isEndOfQuarantine() {
      return this.eventTypeId === EVENT_TYPE_CODE_MAP.END_OF_QUARANTINE;
    },
    isEventLastTypeQuarantine() {
      let codes = [
        EVENT_TYPE_CODE_MAP.ISOLATION,
        EVENT_TYPE_CODE_MAP.QUARANTINE_VACCINATION_AFTER_120_DAYS,
        EVENT_TYPE_CODE_MAP.QUARANTINE_VACCINATION_NONE,
        EVENT_TYPE_CODE_MAP.QUARANTINE_TO_BE_EXPLORED,
      ];

      return codes.includes(this.eventTypeId);
    },
    recipientTaxCode() {
      return this.citizenCovid?.codiceFiscale;
    },
    recipientFullname() {
      let name = this.citizenCovid?.nome ?? "";
      let surname = this.citizenCovid?.cognome ?? "";
      return `${name} ${surname}`;
    },
    recipientBirthDay() {
      return this.citizenCovid?.dataNascita;
    },
    showConductObligations() {
      return CONDUCT_OBLIGATIONS_CODE_MAP.includes(this.eventTypeId);
    },
    isRevoked() {
      // Un provvedimento è revocato solo se esiste la data revoca
      return !!this.eventRevokeDate;
    },
  },
  created() {},
  methods: {
    showConductObligationsDialog() {
      this.isOpenConductObligationsDialog = true;
    },
    printEvent() {
      onPrintEvent(this.eventNumber);
    },
  },
};
</script>

<style lang="scss" scoped></style>
