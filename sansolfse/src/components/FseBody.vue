<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <div
    class="fse-body q-px-none"
    :class="{
      'fse-body--minor': isMinor,
      'fse-body--female': isFemale
    }"
  >
    <div class="relative-position">
      <div class="q-px-md">
        <q-img
          basic
          no-default-spinner
          :src="bodyImageUrl"
          class="fse-body__image"
        />
      </div>

      <fse-body-section-tag
        label="Testa"
        type="head"
        :tag-list="tagList"
        :tag-count="tagCounts"
        line-width="80"
        class="fse-body__section fse-body__section--head"
        @drop="onDrop"
        @click="onBodySectionClick"
      />

      <fse-body-section-tag
        label="Torace"
        type="chest"
        :tag-list="tagList"
        :tag-count="tagCounts"
        line-width="80"
        class="fse-body__section fse-body__section--chest"
        @drop="onDrop"
        @click="onBodySectionClick"
      />

      <fse-body-section-tag
        label="Addome"
        type="abdomen"
        :tag-list="tagList"
        :tag-count="tagCounts"
        line-width="80"
        class="fse-body__section fse-body__section--abdomen"
        @drop="onDrop"
        @click="onBodySectionClick"
      />

      <fse-body-section-tag
        label="Bacino"
        type="pelvis"
        :tag-list="tagList"
        :tag-count="tagCounts"
        line-width="80"
        class="fse-body__section fse-body__section--pelvis"
        @drop="onDrop"
        @click="onBodySectionClick"
      />

      <fse-body-section-tag
        label="Arti"
        type="limbs"
        :tag-list="tagList"
        :tag-count="tagCounts"
        line-width="80"
        class="fse-body__section fse-body__section--limbs"
        @drop="onDrop"
        @click="onBodySectionClick"
      />
    </div>

    <div class="q-mt-md">
      <fse-body-other-tag
        v-for="tag in tagListFixedOther"
        :key="'tc--' + tag.id"
        :tag="tag"
        :count="getCount(tag)"
        class="q-py-sm q-px-md"
        @drop="onDrop"
      />
    </div>
  </div>
</template>

<script>
import { date } from "quasar";
import FseBodySectionTag from "./FseBodySectionTag";
import FseBodyOtherTag from "./FseBodyOtherTag";
import { TAG_FIXED_ID_LIST_OTHER } from "../services/config";
import {
  MONTH_MAP,
  extractBirthMonthPart,
  extractBirthYearPart,
  getDay,
  getGender
} from "../services/tax-code";

const { subtractFromDate, isBetweenDates } = date;

export default {
  name: "FseBody",
  components: { FseBodyOtherTag, FseBodySectionTag },
  props: {
    tagList: { type: Array, required: false, default: () => [] },
    tagCounts: { type: Array, required: false, default: () => [] }
  },
  data() {
    return {};
  },
  computed: {
    // userInfo() {
    //   return this.$store.getters["getUserInfo"];
    // },
    delegatorSelected() {
      return this.$store.getters["getDelegatorSelected"];
    },
    isFemale() {
      let taxCode = this.$store.getters["getTaxCode"];
      let gender = getGender(taxCode);
      return ["f", "F"].includes(gender);

      // let data = this.userInfo?.info_anag?.dati_primari;
      // let gender = data?.sesso ?? null;
      //
      // // Se siamo in modalità delega prendiamo i dati del delegante
      // if (this.delegatorSelected) {
      //   gender = this.delegatorSelected?.sesso_delega ?? null;
      // }
      //
      // return ["f", "F"].includes(gender);
    },
    isMinor() {
      let taxCode = this.$store.getters["getTaxCode"];
      let year = Number(extractBirthYearPart(taxCode));
      let month = extractBirthMonthPart(taxCode);
      month = MONTH_MAP.indexOf(month) + 1;
      let day = getDay(taxCode);

      // Se per qualche motivo non riusciamo ad ottenere i dati (es. omocodia)
      // => di default diciamo che non è minore
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return false;
      }

      // Se per qualche motivo abbiamo preso dei dati sbagliati
      // => di default diciamo che non è minore
      if (month <= 0 || day <= 0) {
        return false;
      }

      let now = new Date();
      let currentFullYear = now.getFullYear();
      let currentYear = now.getFullYear();
      currentYear = currentYear.toString().substring(2);
      currentYear = Number(currentYear);
      let currentCentury = currentFullYear - currentYear;
      let previousCentury = currentCentury - 100;

      // Se l'anno di nascita è <= dell'anno corrente
      // => presumibilmente il cittadino è nato in questo secolo, oppure è un centenario
      //    Dal momento che assumiamo che i centenari che utilizzino l'app siano
      //    praticamente nulli, impostiamo l'anno di nascita come se il cittadino fosse
      //    di questo secolo
      if (year <= currentYear) {
        year = currentCentury + year;
      } else {
        year = previousCentury + year;
      }


      let age = currentFullYear - year;

      // console.log({ year, month, day, currentYear, age });
      return age < 18;

      // let data = this.userInfo?.info_anag?.dati_primari;
      // let birthDate = data?.data_nascita ?? null;
      //
      // // Se siamo in modalità delega prendiamo i dati del delegante
      // if (this.delegatorSelected) {
      //   birthDate = this.delegatorSelected?.data_nascita_delega ?? null;
      // }
      //
      // let now = new Date();
      // let endDate = now;
      // let startDate = subtractFromDate(now, { year: 10 });
      //
      // return birthDate && isBetweenDates(birthDate, startDate, endDate);
    },
    bodyImageUrl() {
      let isMinor = this.isMinor;
      let isFemale = this.isFemale;

      if (isMinor && isFemale) return "images/omino-ragazza.svg";
      if (isMinor) return "images/omino-ragazzo.svg";
      if (isFemale) return "images/omino-donna.svg";

      return "images/omino-uomo.svg";
    },
    tagListFixedOther() {
      return this.tagList.filter(el => TAG_FIXED_ID_LIST_OTHER.includes(el.id));
    }
  },
  created() {},
  methods: {
    onBodySectionClick(...args) {
      this.$emit("section-click", ...args);
    },
    onDrop(...args) {
      this.$emit("drop", ...args);
    },
    getCount(tag) {
      let count = this.tagCounts.find(el => el.etichetta?.id === tag?.id);
      count = count?.numero_documenti ?? 0;
      return count;
    }
  }
};
</script>

<style lang="scss">
// GESTIONE DELL'OMINO PER I VARI PROFILI
// - UOMO
// - DONNA
// - RAGAZZO
// - RAGAZZA
.fse-body {
  .fse-body__section {
    // border: 1px solid red;
  }

  .fse-body__section--head {
    top: 0;
    height: 95px;
  }

  .fse-body__section--chest {
    top: 95px;
    height: 85px;
  }

  .fse-body__section--abdomen {
    top: 180px;
    height: 100px;
  }

  .fse-body__section--pelvis {
    top: 280px;
    height: 90px;
  }

  .fse-body__section--limbs {
    top: 370px;
    height: 200px;
  }

  &--female {
    .fse-body__section--head {
      top: 0;
      height: 95px;
    }

    .fse-body__section--chest {
      top: 95px;
      height: 80px;
    }

    .fse-body__section--abdomen {
      top: 175px;
      height: 100px;
    }

    .fse-body__section--pelvis {
      top: 275px;
      height: 90px;
    }

    .fse-body__section--limbs {
      top: 365px;
      height: 230px;
    }
  }

  &--minor {
    .fse-body__section--head {
      top: 0;
      height: 120px;
    }

    .fse-body__section--chest {
      top: 120px;
      height: 90px;
    }

    .fse-body__section--abdomen {
      top: 210px;
      height: 100px;
    }

    .fse-body__section--pelvis {
      top: 310px;
      height: 90px;
    }

    .fse-body__section--limbs {
      top: 400px;
      height: 250px;
    }
  }

  &--female.fse-body--minor {
    .fse-body__section--head {
      top: 0;
      height: 120px;
    }

    .fse-body__section--chest {
      top: 120px;
      height: 90px;
    }

    .fse-body__section--abdomen {
      top: 210px;
      height: 100px;
    }

    .fse-body__section--pelvis {
      top: 310px;
      height: 90px;
    }

    .fse-body__section--limbs {
      top: 400px;
      height: 250px;
    }
  }
}
</style>
