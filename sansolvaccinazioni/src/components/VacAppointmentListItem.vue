<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="vac-appointment-list-item">
    <q-card>
      <!-- ISTANZE ATTIVE -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-if="appointmentRequestListActive.length > 0">
        <lms-card-item-bar class="no-padding" type="info">
          <q-list class="q-px-md" separator>
            <q-item
              v-for="appointmentRequest in appointmentRequestListActive"
              :key="appointmentRequest.id_istanza"
              class="q-px-none"
            >
              <q-item-section>
                <q-item-label>
                  {{ appointmentRequest.message }}
                </q-item-label>
                <q-item-label>
                  Stato richiesta: <strong>{{ appointmentRequest.status }} </strong>
                </q-item-label>
                <template
                  v-if="
                    appointmentRequest.nota && appointmentRequest.nota !== ''
                  "
                >
                  <q-item-label>
                    Nota: {{ appointmentRequest.nota }}
                  </q-item-label>
                </template>
              </q-item-section>
            </q-item>
          </q-list>
        </lms-card-item-bar>
      </template>

      <!-- COMUNICAZIONI INADEMPIENZA -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-if="isDefaulting">
        <template v-if="canRequestInstance">
          <lms-card-item-bar type="negative">
            La vaccinazione non è stata effettuata entro il periodo previsto.
            <br/>
            Per prenotare un nuovo appuntamento
            <template v-if="vaccinationCenter && vaccinationCenter.telefono">
              puoi chiamare il numero
              <a :href="'tel:' + vaccinationCenter.telefono" class="lms-link">
                {{ vaccinationCenter.telefono }}
              </a>
            </template>
            <template v-else>
              contatta il centro vaccinale di riferimento.
            </template>
          </lms-card-item-bar>
        </template>

        <template v-else>
          <lms-card-item-bar type="negative">
            La vaccinazione non è stata effettuata entro il periodo previsto.
            <br/>
            Puoi attendere di essere contattato dall'operatore per fissare il
            nuovo appuntamento, oppure puoi
            <template v-if="vaccinationCenter && vaccinationCenter.telefono">
              chiamare il centro vaccinale al numero
              <a :href="'tel:' + vaccinationCenter.telefono" class="lms-link">
                {{ vaccinationCenter.telefono }}
              </a>
            </template>
            <template v-else>
              contattare il centro vaccinale di riferimento.
            </template>
          </lms-card-item-bar>
        </template>
      </template>

      <!-- CARD APPUNTAMENTO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <lms-card-item no-actions>
        <template #primary>
          <lms-card-item-primary>
            <template #icon>
              <q-icon
                name="img:/statics/la-mia-salute/icone/vaccino.svg"
                size="lg"
              />
            </template>

            <template #text>
              <div class="q-px-sm">
                <vac-vaccine-list-preview :vaccine-list="vaccineList"/>
              </div>

            </template>
          </lms-card-item-primary>
        </template>

        <template #secondary>
          <!-- AZIONI SECONDARIE -->
          <!-- ----------------- -->
          <div class="row q-pa-md">
            <q-list class="col col-md-10">
              <q-item class="q-px-none q-pb-md">
                <q-item-section side top>
                  <q-icon
                    name="img:/statics/la-mia-salute/icone/calendario.svg"
                    size="xl"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    Appuntamento
                  </q-item-label>
                  <q-item-label>
                    <div><strong>{{ appointment.data_appuntamento | date }}</strong></div>
                    <div><strong>Ore {{ appointment.data_appuntamento | time }}</strong></div>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-px-none">
                <q-item-section side top>
                  <q-icon
                    name="img:/statics/la-mia-salute/icone/unita-operativa.svg"
                    size="xl"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    Struttura
                  </q-item-label>
                  <q-item-label>
                    <template v-if="!vaccinationCenter">-</template>
                    <template v-else>
                      <strong>
                        {{ vaccinationCenter.descrizione | capitalCase }}
                        <template
                          v-if="
                            vaccinationCenter.asl &&
                              vaccinationCenter.asl.descrizione
                          "
                        >
                          ({{ vaccinationCenter.asl.descrizione }})
                        </template>
                      </strong>

                      <div class="text-caption">
                        {{ vaccinationCenter.indirizzo | capitalCase }},
                        {{ vaccinationCenter.comune | capitalCase }}
                      </div>
                    </template>
                  </q-item-label>
                </q-item-section>

              </q-item>
            </q-list>
            <q-space/>
            <div class="row reverse text-center ">
              <q-icon
                class="cursor-pointer"
                color="grey-7"
                name="more_vert"
                size="sm"
              >
                <q-menu auto-close>
                  <q-list separator>
                    <template v-if="!isDefaulting && canRequestInstance">
                      <q-item
                        v-close-popup
                        clickable
                        @click="modifyBooking(appointment)"
                      >
                        <q-item-section>
                          <q-item-label>
                            Sposta appuntamento
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>

                    <template v-if="!isDefaulting && canRequestInstance">
                      <q-item
                        v-close-popup
                        clickable
                        @click="deleteBooking(appointment)"
                      >
                        <q-item-section>
                          <q-item-label>
                            Annulla appuntamento
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>

                    <q-item v-close-popup clickable @click="onDownload">
                      <q-item-section>
                        <q-item-label>
                          Stampa promemoria appuntamento
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </div>
          </div>

        </template>
      </lms-card-item>
    </q-card>

    <!-- DIALOGS -->
    <!-- --------------------------------------------------------------------------------------------------------- -->
    <!-- dialog di spostamento: sposta o differisci-->
    <q-dialog v-model="isMovingModalOpened" class="q-px-xl" minimized>
      <q-card class="col " style="max-width: 800px">
        <q-card-section class="no-padding">
          <q-toolbar>
            <q-toolbar-title>
              Scegli come intendi proseguire
            </q-toolbar-title>

            <q-btn v-close-popup dense flat icon="close" round/>
          </q-toolbar>
        </q-card-section>

        <q-card-section>
          <div class="row justify-between items-stretch q-col-gutter-lg" style="min-height: 200px">
            <div class="col-12 col-sm-6 ">
              <q-card
                v-close-popup
                class=" move-card full-height"
                @click="modifyBookingMandatory(appointment)"
              >
                <q-toolbar class="move-card-title bg-primary text-white">
                  <q-toolbar-title>
                    Nuovo appuntamento
                  </q-toolbar-title>
                </q-toolbar>
                <q-card-section
                >Puoi spostare la data e l'ora di un appuntamento già fissato. Se l'agenda non è
                  disponibile, attraverso il servizio on line puoi inviare la richiesta di spostamento
                  al Centro Vaccinale
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-sm-6 ">
              <q-card
                v-close-popup
                class="move-card full-height"
                @click.native="goToDeferment(appointment)"
              >
                <q-toolbar class="move-card-title bg-primary text-white">
                  <q-toolbar-title>
                    Differimento
                  </q-toolbar-title>
                </q-toolbar>
                <q-card-section>
                  Il differimento consente di rinviare il vaccino senza fissare una nuova data. Puoi
                  richiedere il
                  differimento attraverso il servizio on line solo se sussistono documentate motivazioni di salute che
                  saranno valutate
                  dal Centro Vaccinale
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!--      modale di conferma alla pagina di cancellazione-->
    <q-dialog v-model="isDeletingModalOpened" class="q-px-xl" minimized>
      <q-card class="col " style="max-width: 800px">
        <q-card-section class="no-padding">
          <q-toolbar>
            <q-toolbar-title>
              Cancella appuntamento
            </q-toolbar-title>

            <q-btn v-close-popup dense flat icon="close" round/>
          </q-toolbar>
        </q-card-section>

        <q-card-section
        >
          È possibile chiedere l’annullamento di un appuntamento per una vaccinazione prevista dal Piano
          Vaccinale Nazionale solo in presenza di condizioni cliniche documentate.
          Proseguendo con la richiesta di annullamento sarà necessario allegare la certificazione
          firmata digitalmente dal medico. Se non si è in possesso di un certificato medico firmato digitalmente,
          per richiedere l’annullamento è necessario recarsi personalmente presso il Centro Vaccinale di competenza.
        </q-card-section
        >

        <lms-buttons class="q-pa-md">
          <lms-button @click="goToOmission(appointment)"
          >Vai alla cancellazione
          </lms-button
          >
          <lms-button v-close-popup outline
          >Resta agli appuntamenti
          </lms-button
          >
        </lms-buttons>
      </q-card>
    </q-dialog>

    <!--      modale di rimando A Padvax-->
    <q-dialog v-model="isOpenPadvaxDialog" class="q-px-xl" minimized>
      <q-card class="col " style="max-width: 800px">
        <q-card-section class="no-padding">
          <q-toolbar>
            <q-toolbar-title>
              <span v-if="isModify"> Sposta appuntamento</span>
              <span v-else> Cancella appuntamento</span>
            </q-toolbar-title>

            <q-btn v-close-popup dense flat icon="close" round/>
          </q-toolbar>
        </q-card-section>

        <q-card-section
        >
          È possibile chiedere
          <span v-if="isModify">lo spostamento</span>
          <span v-else>la cancellazione</span>
          dell'appuntamento accedendo al sito
          <a :href="padvaxUrl" class="lms-link" target="_blank">
            www.ilpiemontetivaccina.it
          </a>
        </q-card-section
        >

        <lms-buttons class="q-pa-md">
          <lms-button v-close-popup outline
          >OK
          </lms-button
          >
        </lms-buttons>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {date} from "quasar";
import {apiErrorNotify, equalsIgnoreCase, startCase} from "../services/utils";
import {
  downloadAppointmentReminderPdf,
  getVaccinationCenterDetail
} from "../services/api";
import LmsCardItemPrimary from "./core/LmsCardItemPrimary";
import LmsCardItem from "./core/LmsCardItem";
import LmsCardItemBar from "./core/LmsCardItemBar";
import VacVaccineListPreview from "./VacVaccineListPreview";
import {DELETE, DIFFERIMENT, MOVE, OMISSION} from "../router/routes";
import {instanceStatus, instanceType, IS_PROD} from "../services/config";
import {vaccinationsAssociationList, vaccinationsList} from "src/services/business-logic";

const {getDateDiff} = date;
const COVID_CODE_VAX = "C19";
export default {
  name: "VacAppointmentListItem",
  components: {
    VacVaccineListPreview,
    LmsCardItemPrimary,
    LmsCardItem,
    LmsCardItemBar
  },
  props: {
    appointment: {type: Object, required: true},
    appointmentRequestList: {type: Array, required: false, default: () => []},
    vaccinationUserInfo: {type: Object, required: false, default: null}
  },
  data() {
    return {
      isDownloading: false,
      isMovingModalOpened: false,
      vaccinationCenter: null,
      isDeletingModalOpened: false,
      isOpenPadvaxDialog: false,
      isModify: false
    };
  },
  computed: {
    cf() {
      return this.$store.getters["getTaxCode"];
    },
    appointmentDate() {
      return this.appointment?.data_appuntamento;
    },

    isDefaulting() {
      let now = new Date();
      let date = this.appointmentDate;
      return getDateDiff(now, date, "days") > 0;
    },
    vaccineList() {
      return vaccinationsList(this.appointment?.associazioni)
    },
    appointmentRequestListActive() {
      let id = this.appointment?.id ?? null;

      let result = [...this.appointmentRequestList];
      result = result.filter(a => a.id_appuntamento === id);

      result = result.map(a => {
        let type = a.tipo;
        let message = "";

        if (type === instanceType.Spostamento) {
          message = "E' stato richiesto lo spostamento dell'appuntamento";
        } else if (type === instanceType.Revoca) {
          message = "E' stata richiesta la revoca dell'appuntamento";
        } else if (type === instanceType.Omissione) {
          message = "E' stata richiesta la revoca dell'appuntamento";
        } else if (type === instanceType.Differimento) {
          message = "E' stato richiesto lo spostamento dell'appuntamento";
        }

        return {
          message,
          status: a.descrizione_stato,
          code: a.id_stato,
          nota: a.note_risposta
        };
      });

      return result;
    },
    canRequestInstance() {
      if (this.appointmentRequestListActive && this.appointmentRequestListActive.length > 0) {

        if (this.appointmentRequestListActive.find(a =>
          [
            instanceStatus.DOC_PRESO_IN_CARICO,
            instanceStatus.DOC_DA_VALUTARE,
            instanceStatus.SPO_DA_VALUTARE,
            instanceStatus.SPO_PRESO_IN_CARICO,
            instanceStatus.REV_DA_VALUTARE,
            instanceStatus.REV_PRESO_IN_CARICO,
          ].includes(a.code))) {
          return false
        } else {
          let revokedAndOmission = []
          revokedAndOmission = this.appointmentRequestListActive.filter(a => [instanceType.Revoca, instanceType.Omissione].includes(a.tipo))
          if (revokedAndOmission.find(a => [
            instanceStatus.DOC_PRESO_IN_CARICO,
            instanceStatus.DOC_DA_VALUTARE,
            instanceStatus.DOC_Confermato,
            instanceStatus.REV_DA_VALUTARE,
            instanceStatus.REV_PRESO_IN_CARICO,
            instanceStatus.REV_Confermato,
          ].includes(a.code))) {
            return false
          }

          return true
        }
      } else {
        return true
      }
    },
    isTest() {
      return process.env.APP_IS_DEV || process.env.APP_IS_TEST
    },
    padvaxUrl() {
      return (this.isTest) ?
        'url' : 'url'
    }
  },
  async created() {
    let id = this.appointment.centro_vaccinale;

    try {
      let {data} = await getVaccinationCenterDetail(id);
      this.vaccinationCenter = data;
    } catch (error) {
      let message =
        "Non è stato possibile caricare il centro vaccinale presso cui è stato prenotato l'appuntamento";
      apiErrorNotify({error, message});
    }
  },
  methods: {
    openDeleteModal() {
      this.isDeletingModalOpened = true;
    },
    isCovid19Vaccine() {
      let sarsCovVaccine = this.vaccineList?.filter(
        vaccination => equalsIgnoreCase(COVID_CODE_VAX, vaccination.codice)
      );

      return sarsCovVaccine && sarsCovVaccine.length > 0
    },
    onDownload() {
      this.isDownloading = true;
      let taxCode = this.cf;
      let id = this.appointment.id;

      downloadAppointmentReminderPdf(taxCode, id);
      setTimeout(() => (this.isDownloading = false), 2000);
    },
    modifyBooking(appointment) {
      let isCovidVaccination = this.isCovid19Vaccine()
      if (isCovidVaccination) {
        this.isModify = true
        this.isOpenPadvaxDialog = true
        return
      }

      // DISABILITIAMO TEMPORANEAMENTE LA POSSIBILITA' DI MODIFICARE GLI APPUNTAMENTI
      if (IS_PROD) {
        this.$q.dialog({
          title: "",
          message: "La modifica dell'appuntamento è temporaneamente sospesa attraverso questo servizio. Ci scusiamo per il disagio"
        });

        return
      }
      //controllo che sia appuntamento obbligatorio
      if (appointment.annullabilita === "S") {
        let params = {id: appointment.id, appointment: appointment};

        let name = MOVE.name;

        this.$router.push({name, params});
      } else {
        this.openMovingModal();
      }
    },
    modifyBookingMandatory(appointment) {
      // DISABILITIAMO TEMPORANEAMENTE LA POSSIBILITA' DI MODIFICARE GLI APPUNTAMENTI
      if (IS_PROD) {

        this.$q.dialog({
          title: "",
          message: "La modifica dell'appuntamento è temporaneamente sospesa attraverso questo servizio. Ci scusiamo per il disagio"
        });

        return
      }

      let params = {id: appointment.id, appointment: appointment};

      let name = MOVE.name;

      this.$router.push({name, params});
    },
    openMovingModal() {
      if (IS_PROD) {
        this.$q.dialog({
          title: "",
          message: "Lo spostamento dell'appuntamento è temporaneamente sospesa attraverso questo servizio. Ci scusiamo per il disagio"
        });
        return
      }

      this.isMovingModalOpened = !this.isMovingModalOpened;
    },
    deleteBooking(appuntamento) {
      let isCovidVaccination = this.isCovid19Vaccine()
      if (isCovidVaccination) {
        this.isModify = false
        this.isOpenPadvaxDialog = true
        return
      }


      if (IS_PROD) {
        this.$q.dialog({
          title: "",
          message: "L'annullamento dell'appuntamento è temporaneamente sospesa attraverso questo servizio. Ci scusiamo per il disagio"
        });
        return
      }

      //controllo che sia appuntamento obbligatorio
      if (appuntamento.annullabilita === "S") {
        let params = {id: appuntamento.id, appuntamento: appuntamento};

        let name = DELETE.name;

        //query: {deleteBooking: "true"}

        this.$router.push({name, params});
      } else {
        this.openDeleteModal();
      }
    },
    goToDeferment(appointment) {

      if (IS_PROD) {
        this.$q.dialog({
          title: "",
          message: "Il differimento dell'appuntamento è temporaneamente sospesa attraverso questo servizio. Ci scusiamo per il disagio"
        });
        return
      }

      let params = {
        id: appointment.id,
        appointment: appointment,
        vaccinationUserInfo: this.vaccinationUserInfo
      };
      let name = DIFFERIMENT.name;
      this.$router.push({name, params});
    },
    goToOmission(appointment) {

      if (IS_PROD) {
        this.$q.dialog({
          title: "",
          message: "L'omissione dell'appuntamento è temporaneamente sospesa attraverso questo servizio. Ci scusiamo per il disagio"
        });
        return
      }

      let params = {
        id: appointment.id,
        appointment: appointment,
        vaccinationUserInfo: this.vaccinationUserInfo
      };
      let name = OMISSION.name;
      this.$router.push({name, params});
    }
  }
};
</script>

<style lang="sass">
.move-card
  cursor: pointer
  transition: all .3s ease

  &:hover
    background-color: $grey-2

.move-card-title
  &:hover
    background-color: transparent
</style>
