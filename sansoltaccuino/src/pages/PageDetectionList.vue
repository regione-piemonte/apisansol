<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <tac-page padding menu>
    <template v-if="isDelegatorChanging"></template>

    <template v-else>
      <div class="row q-col-gutter-x-xl">
        <!-- COLONNA PRINCIPALE -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <div class="col-12 col-md q-pb-lg">
          <!-- INFORMAZIONI GENERALI -->
          <!-- --------------------- -->
          <div class="row q-col-gutter-x-xl q-py-xl q-px-md">
            <template v-if="!delegatorSelected && profileAvatarUrl">
              <div class="col-auto gt-md">
                <img :src="profileAvatarUrl" alt="avatar" height="180px" />
              </div>
            </template>

            <div class="col text-body1">
              <!-- STATO DI SALUTE -->
              <div>
                <div class="row items-center">
                  <div class="col text-bold">
                    Il mio stato di salute
                  </div>

                  <template v-if="!isDelegationTacWeak">
                    <div class="col-auto">
                      <q-btn
                        color="primary"
                        flat
                        dense
                        no-caps
                        type="a"
                        :to="generalNotesUrlHealthState"
                      >
                        Modifica
                      </q-btn>
                    </div>
                  </template>
                </div>

                <div class="q-mt-sm q-pa-sm tac-general-note-box">
                  {{ healthState }}
                </div>
              </div>

              <!-- STILE DI VITA -->
              <div class="q-mt-lg">
                <div class="row items-center">
                  <div class="col text-bold">
                    Stile di vita
                  </div>

                  <template v-if="!isDelegationTacWeak">
                    <div class="col-auto">
                      <q-btn
                        color="primary"
                        flat
                        dense
                        no-caps
                        type="a"
                        :to="generalNotesUrlLifeStyle"
                      >
                        Modifica
                      </q-btn>
                    </div>
                  </template>
                </div>

                <div class="q-mt-sm q-pa-sm tac-general-note-box">
                  {{ lifestyle }}
                </div>
              </div>

              <!--            <div class="q-mt-md">-->
              <!--              <q-btn outline text-color="primary" :to="GENERAL_NOTES_EDIT">-->
              <!--                Modifica-->
              <!--              </q-btn>-->
              <!--            </div>-->
            </div>
          </div>

          <!-- RILEVAZIONI -->
          <!-- ----------- -->
          <div class="q-px-md">
            <div class="text-h2 text-bold q-mb-md">
              Le tue ultime rilevazioni
            </div>

            <transition-group
              name="tac-group-list"
              tag="div"
              class="row q-col-gutter-x-lg q-col-gutter-y-xl"
            >
              <div
                v-for="component in componentList"
                :key="component.name"
                class="col-12 col-sm-6 col-lg-4"
              >
                <component :is="component" />
              </div>
            </transition-group>
          </div>
        </div>

        <!-- COLONNA DESTRA CON BOX PARTICOLARI -->
        <!-- --------------------------------------------------------------------------------------------------------- -->
        <div class="col-12 col-md-4">
          <div class="q-pa-md">
            <transition-group
              name="tac-group-list"
              tag="div"
              class="row q-col-gutter-lg"
            >
              <div
                v-for="component in otherComponentList"
                :key="component.name"
                class="col-12 col-sm-6 col-md-12"
              >
                <component :is="component" />
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </template>
  </tac-page>
</template>

<script>
import TacGroupListItemMeasures from "../components/TacGroupListItemMeasures";
import TacMenu from "../components/TacMenu";
import TacGroupListItemTemperature from "../components/TacGroupListItemTemperature";
import TacGroupListItemBreathFreq from "../components/TacGroupListItemBreathFreq";
import TacGroupListItemOxymetry from "../components/TacGroupListItemOxymetry";
import TacGroupListItemPressure from "../components/TacGroupListItemPressure";
import TacGroupListItemCholesterol from "../components/TacGroupListItemCholesterol";
import TacGroupListItemInsulin from "../components/TacGroupListItemInsulin";
import TacGroupListItemGlycemia from "../components/TacGroupListItemGlycemia";
import TacGroupListItemHemoglobin from "../components/TacGroupListItemHemogoblin";
import TacGroupListItemPain from "../components/TacGroupListItemPain";
import TacGroupListItemSymptom from "../components/TacGroupListItemSymptom";
import TacGroupListItemEvent from "../components/TacGroupListItemEvent";
import TacGroupListItemDrug from "../components/TacGroupListItemDrug";
import TacGroupListItemStructureContact from "../components/TacGroupListItemStructureContact";
import TacGroupListItemDiet from "../components/TacGroupListItemDiet";
import { ENTITY_CODE_MAP, GROUP_CODE_MAP } from "../services/config";
import { GENERAL_NOTES_EDIT } from "../router/routes";
import { getProfileAvatarUrl } from "../services/business-logic";

const ORDER_MAP = {
  [ENTITY_CODE_MAP.DETECTION + "-" + GROUP_CODE_MAP.WEIGHT]: 1,
  [ENTITY_CODE_MAP.DETECTION + "-" + GROUP_CODE_MAP.TEMPERATURE]: 2,
  [ENTITY_CODE_MAP.DETECTION + "-" + GROUP_CODE_MAP.PRESSURE]: 3,
  [ENTITY_CODE_MAP.DETECTION + "-" + GROUP_CODE_MAP.BREATH_FREQ]: 4,
  [ENTITY_CODE_MAP.DETECTION + "-" + GROUP_CODE_MAP.CHOLESTEROL]: 5,
  [ENTITY_CODE_MAP.DETECTION + "-" + GROUP_CODE_MAP.OXYMETRY]: 6,
  [ENTITY_CODE_MAP.DETECTION + "-" + GROUP_CODE_MAP.GLYCEMIA]: 8,
  [ENTITY_CODE_MAP.DETECTION + "-" + GROUP_CODE_MAP.HEMOGLOBIN]: 9,
  [ENTITY_CODE_MAP.DETECTION + "-" + GROUP_CODE_MAP.INSULIN]: 10,
  [ENTITY_CODE_MAP.SYMPTOMS + "-" + null]: 20,
  [ENTITY_CODE_MAP.PAINS + "-" + null]: 21
};

const COMPONENT_MAP = {
  [ENTITY_CODE_MAP.DETECTION +
  "-" +
  GROUP_CODE_MAP.WEIGHT]: TacGroupListItemMeasures,
  [ENTITY_CODE_MAP.DETECTION +
  "-" +
  GROUP_CODE_MAP.TEMPERATURE]: TacGroupListItemTemperature,
  [ENTITY_CODE_MAP.DETECTION +
  "-" +
  GROUP_CODE_MAP.PRESSURE]: TacGroupListItemPressure,
  [ENTITY_CODE_MAP.DETECTION +
  "-" +
  GROUP_CODE_MAP.BREATH_FREQ]: TacGroupListItemBreathFreq,
  [ENTITY_CODE_MAP.DETECTION +
  "-" +
  GROUP_CODE_MAP.OXYMETRY]: TacGroupListItemOxymetry,
  [ENTITY_CODE_MAP.SYMPTOMS + "-" + null]: TacGroupListItemSymptom,
  [ENTITY_CODE_MAP.PAINS + "-" + null]: TacGroupListItemPain,
  [ENTITY_CODE_MAP.DETECTION +
  "-" +
  GROUP_CODE_MAP.GLYCEMIA]: TacGroupListItemGlycemia,
  [ENTITY_CODE_MAP.DETECTION +
  "-" +
  GROUP_CODE_MAP.HEMOGLOBIN]: TacGroupListItemHemoglobin,
  [ENTITY_CODE_MAP.DETECTION +
  "-" +
  GROUP_CODE_MAP.INSULIN]: TacGroupListItemInsulin,
  [ENTITY_CODE_MAP.DETECTION +
  "-" +
  GROUP_CODE_MAP.CHOLESTEROL]: TacGroupListItemCholesterol
};

const OTHER_ORDER_MAP = {
  [ENTITY_CODE_MAP.EVENTS + "-" + null]: 1,
  [ENTITY_CODE_MAP.DRUGS + "-" + null]: 2,
  [ENTITY_CODE_MAP.DIET + "-" + null]: 3,
  [ENTITY_CODE_MAP.STRUCTURE_CONTACT + "-" + null]: 4
};

const OTHER_COMPONENT_MAP = {
  [ENTITY_CODE_MAP.DIET + "-" + null]: TacGroupListItemDiet,
  [ENTITY_CODE_MAP.DRUGS + "-" + null]: TacGroupListItemDrug,
  [ENTITY_CODE_MAP.EVENTS + "-" + null]: TacGroupListItemEvent,
  [ENTITY_CODE_MAP.STRUCTURE_CONTACT +
  "-" +
  null]: TacGroupListItemStructureContact
};

export default {
  name: "PageDetectionList",
  components: {
    TacGroupListItemDiet,
    TacGroupListItemStructureContact,
    TacGroupListItemDrug,
    TacGroupListItemEvent,
    TacGroupListItemSymptom,
    TacGroupListItemPain,
    TacGroupListItemHemoglobin,
    TacGroupListItemGlycemia,
    TacGroupListItemInsulin,
    TacGroupListItemCholesterol,
    TacGroupListItemPressure,
    TacGroupListItemOxymetry,
    TacGroupListItemBreathFreq,
    TacGroupListItemTemperature,
    TacMenu,
    TacGroupListItemMeasures
  },
  data() {
    return {
      GENERAL_NOTES_EDIT,
      isDelegatorChanging: false
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    userInfo() {
      return this.$store.getters["getUserInfo"];
    },
    notebook() {
      return this.$store.getters["getNotebook"];
    },
    delegatorSelected() {
      return this.$store.getters["getDelegatorSelected"];
    },
    isDelegationTacWeak() {
      return this.$store.getters["isDelegationTacWeak"];
    },
    healthState() {
      return this.notebook?.note_generali?.stato_salute;
    },
    lifestyle() {
      return this.notebook?.note_generali?.stile_vita;
    },
    preferenceList() {
      return this.notebook?.preferenze ?? [];
    },
    preferenceListFiltered() {
      return this.preferenceList.filter(p => {
        let key = p.entita_codice + "-" + p.gruppo_codice;
        return key in COMPONENT_MAP;
      });
    },
    preferenceListFilteredOther() {
      return this.preferenceList.filter(p => {
        let key = p.entita_codice + "-" + p.gruppo_codice;
        return key in OTHER_COMPONENT_MAP;
      });
    },
    componentList() {
      let preferenceList = [...this.preferenceListFiltered].sort((a, b) => {
        if (a.visibile && !b.visibile) return -1;
        if (!a.visibile && b.visibile) return 1;
        let aOrder = ORDER_MAP[a.entita_codice + "-" + a.gruppo_codice];
        let bOrder = ORDER_MAP[b.entita_codice + "-" + b.gruppo_codice];
        return aOrder > bOrder ? 1 : -1;
      });

      return preferenceList.map(
        p => COMPONENT_MAP[p.entita_codice + "-" + p.gruppo_codice]
      );
    },
    otherComponentList() {
      let preferenceList = [...this.preferenceListFilteredOther].sort(
        (a, b) => {
          if (a.visibile && !b.visibile) return -1;
          if (!a.visibile && b.visibile) return 1;
          let aOrder = OTHER_ORDER_MAP[a.entita_codice + "-" + a.gruppo_codice];
          let bOrder = OTHER_ORDER_MAP[b.entita_codice + "-" + b.gruppo_codice];
          return aOrder > bOrder ? 1 : -1;
        }
      );

      return preferenceList.map(
        p => OTHER_COMPONENT_MAP[p.entita_codice + "-" + p.gruppo_codice]
      );
    },
    generalNotesUrlHealthState() {
      let name = GENERAL_NOTES_EDIT.name;
      let query = { stile_salute: true };
      return { name, query };
    },
    generalNotesUrlLifeStyle() {
      let name = GENERAL_NOTES_EDIT.name;
      let query = { stile_vita: true };
      return { name, query };
    },
    profileAvatarUrl() {
      let gender = this.userInfo?.info_anag?.dati_primari?.sesso;
      let birthDate = this.userInfo?.info_anag?.dati_primari?.data_nascita;
      return getProfileAvatarUrl({ gender, birthDate });
    }
  },
  watch: {
    delegatorSelected: {
      immediate: false,
      handler() {
        this.isDelegatorChanging = true;
        setTimeout(() => {
          this.isDelegatorChanging = false;
        }, 100);
      }
    }
  }
};
</script>

<style lang="scss">
.tac-group-list-move {
  transition: transform 1s;
}

.tac-general-note-box {
  background-color: #fcfcfc;
  border: 1px solid #eaeaea;
  border-radius: 5px;
}
</style>
