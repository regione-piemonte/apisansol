<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div class="home-doctor-widget">
    <div class="text-h5 text-bold">
      Il tuo medico
    </div>

    <!-- SENZA ASSISTENZA SANITARIA O SENZA DOTTORE -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-if="!hasMedicalAssistance || !hasDoctor">
      <q-banner class="q-mt-md q-py-md h-banner h-banner--info">
        <template #avatar>
          <q-icon name="img:info-outline.svg" size="md" />
        </template>
        <div class="text-body1">
          In questo momento non hai l'assistenza sanitaria di nessun medico in
          Piemonte.
        </div>
      </q-banner>

      <div class="q-mt-md text-right">
        <q-btn
          type="a"
          href="/la-mia-salute/#/il-mio-medico"
          color="primary"
          unelevated
        >
          Scegli un medico
        </q-btn>
      </div>
    </template>

    <!-- INFO MEDICO E LINK -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <template v-else>
      <div class="q-mt-md row q-col-gutter-x-md items-center">
        <div class="col-auto">
          <q-icon
            name="img:/statics/la-mia-salute/icone/medico-uomo.svg"
            size="lg"
          />
        </div>

        <div class="col">
          <div class="text-body1">
            {{ doctorFullName | empty("&nbsp;") }}
          </div>
        </div>
      </div>

      <div class="q-mt-md q-gutter-x-md">
        <a class="lms-link cursor-pointer" href="" @click.prevent="onShowAgenda">
          Vedi orari
        </a>
        <a class="lms-link cursor-pointer" href=""   @click.prevent="onShowContacts">
          Contatta
        </a>
        <a :href="urls.changeDoctor()" class="lms-link">
          Cambia
        </a>
      </div>
    </template>

    <!-- DIALOGS -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-dialog v-model="isAgendaDialogVisible" :maximized="$q.screen.lt.sm">
      <q-card>
        <q-toolbar>
          <q-toolbar-title>
            Gli orari del tuo medico
          </q-toolbar-title>

          <q-btn v-close-popup flat dense round icon="close" aria-label="chiudi finestra" />
        </q-toolbar>

        <q-card-section class="q-px-none">
          <template v-if="doctor">
            <q-list separator>
              <home-doctor-office-list-item
                v-for="(office, index) in doctor.ambulatori"
                :key="office.id"
                :office="office"
                :default-opened="index === 0"
              />
            </q-list>
          </template>
        </q-card-section>

        <lms-inner-loading :showing="isLoadingDoctorDetail" block aria-label="caricamento"/>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isContactsDialogVisible" :maximized="$q.screen.lt.sm">
      <q-card>
        <q-toolbar>
          <q-toolbar-title>
            Contatta il tuo medico
          </q-toolbar-title>

          <q-btn v-close-popup flat dense round icon="close"  aria-label="chiudi finestra"/>
        </q-toolbar>

        <q-card-section class="q-px-none">
          <template v-if="doctor">
            <q-list separator>
              <q-item v-for="office in doctor.ambulatori" :key="office.id">
                <q-item-section class="q-gutter-y-sm">
                  <div>
                    <span class="text-black text-bold vertical-bottom">
                      {{ office.indirizzo }}, {{ office.comune }}
                    </span>
                  </div>

                  <template v-if="office.telefono">
                    <div>
                      <q-icon
                        name="phone"
                        size="xs"
                        color="grey-7"
                        class="q-mr-xs"
                      />
                      <a
                        :href="'tel:' + office.telefono"
                        class="lms-link vertical-bottom"
                      >
                        {{ office.telefono }}
                      </a>
                    </div>
                  </template>

                  <template v-if="office.email">
                    <div>
                      <q-icon
                        name="email"
                        size="xs"
                        color="grey-7"
                        class="q-mr-xs"
                      />
                      <a
                        :href="'mailto:' + office.email"
                        class="lms-link"
                      >
                        {{ office.email }}
                      </a>
                    </div>
                  </template>
                </q-item-section>
              </q-item>
            </q-list>
          </template>
        </q-card-section>

        <lms-inner-loading :showing="isLoadingDoctorDetail" block />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { date } from "quasar";
import HomeDoctorOfficeListItem from "./HomeDoctorOfficeListItem";
import * as urls from "src/services/urls";

const { getDayOfWeek } = date;

const DAY_NAME_MAP = {
  1: "Lunedi",
  2: "Martedi",
  3: "Mercoledi",
  4: "Giovedi",
  5: "Venerdi",
  6: "Sabato",
  7: "Domenica"
};

export default {
  name: "HomeDoctorWidget",
  components: { HomeDoctorOfficeListItem },
  props: {},
  data() {
    return {
      urls,
      isLoadingDoctorDetail: false,
      isAgendaDialogVisible: false,
      isContactsDialogVisible: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    userInfo() {
      return this.$store.getters["getUserInfo"];
    },
    medicalAssistanceInfo() {
      return this.$store.getters["getMedicalAssistanceInfo"];
    },
    doctor() {
      return this.$store.getters["getDoctor"];
    },
    hasMedicalAssistance() {
      return !!this.userInfo?.info_san?.data_inizio_asl;
    },
    hasDoctor() {
      let code = this.userInfo?.info_san?.tipo_movimento;
      let codes = ["S"];
      return codes.includes(code);
      // return !!this.userInfo?.info_san?.codice_fiscale_medico;
    },
    doctorFullName() {
      let lastName = this.userInfo?.info_san?.cognome_medico ?? "";
      let firstName = this.userInfo?.info_san?.nome_medico ?? "";
      return [firstName, lastName]
        .map(el => el.trim())
        .filter(el => !!el)
        .join(" ");
    },
    todayName() {
      let today = new Date();
      let todayDayOfWeekNumber = getDayOfWeek(today);
      let todayName = DAY_NAME_MAP[todayDayOfWeekNumber];
      return todayName;
    },
    openOfficeList() {
      let officeList = this.doctor?.ambulatori ?? [];

      officeList = officeList.filter(o => {
        let timetableList = o?.orari ?? [];
        let dayNameList = timetableList.map(t => t.nome);
        return dayNameList.includes(this.todayName);
      });

      return officeList;
    },
    openingTimeList() {
      let officeList = this.openOfficeList ?? [];

      let result = officeList.map(o => {
        let timetableList = o?.orari ?? [];
        let time = timetableList.find(t => t.nome === this.todayName);
        return { ...o, _orario: time };
      });

      return result;
    },
    doctorEmail() {
      return this.doctor?.mail;
    }
  },
  created() {},
  methods: {
    async   onShowAgenda() {
      this.isAgendaDialogVisible = true;

      this.isLoadingDoctorDetail = true;
      await this.$store.dispatch("loadDoctorDetail", {});
      this.isLoadingDoctorDetail = false;
    },
    async onShowContacts() {
      this.isContactsDialogVisible = true;

      this.isLoadingDoctorDetail = true;
      await this.$store.dispatch("loadDoctorDetail", {});
      this.isLoadingDoctorDetail = false;
    }
  }
};
</script>

<style scoped lang="sass"></style>
