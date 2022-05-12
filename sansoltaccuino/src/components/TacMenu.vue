<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-list class="tac-menu">
    <q-item clickable :to="ROUTES.DETECTION_LIST" exact>
      <q-item-section side>
        <q-icon name="home" color="primary" size="xs" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-bold">
          Home
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator inset />

    <q-item>
      <q-item-section side>
        <q-icon name="mdi-gauge-full" color="primary" size="xs" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-bold">
          Rilevazioni
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item dense clickable :to="ROUTES.DETECTION_MEASURES">
      <q-item-section side class="invisible">
        <q-icon name="home" color="primary" size="xs" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Altezza, peso e circonferenza vita
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item dense clickable :to="ROUTES.DETECTION_TEMPERATURE">
      <q-item-section side class="invisible">
        <q-icon name="home" color="primary" size="xs" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Temperatura
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item dense clickable :to="ROUTES.DETECTION_PRESSURE">
      <q-item-section side class="invisible">
        <q-icon name="home" color="primary" size="xs" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Pressione e frequenza cardiaca
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item dense clickable :to="ROUTES.DETECTION_BREATH_FREQ">
      <q-item-section side class="invisible">
        <q-icon name="home" color="primary" size="xs" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Frequenza respiratoria
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item dense clickable :to="ROUTES.DETECTION_CHOLESTEROL">
      <q-item-section side class="invisible">
        <q-icon name="home" color="primary" size="xs" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Colesterolo
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item dense clickable :to="ROUTES.DETECTION_OXYMETRY">
      <q-item-section side class="invisible">
        <q-icon name="home" color="primary" size="xs" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Ossimetria
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item dense clickable :to="ROUTES.DETECTION_GLYCEMIA">
      <q-item-section side class="invisible">
        <q-icon name="home" color="primary" size="xs" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Glicemia
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item dense clickable :to="ROUTES.DETECTION_HEMOGLOBIN">
      <q-item-section side class="invisible">
        <q-icon name="home" color="primary" size="xs" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Emoglobina
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item dense clickable :to="ROUTES.DETECTION_INSULIN">
      <q-item-section side class="invisible">
        <q-icon name="home" color="primary" size="xs" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Insulina
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item dense clickable :to="ROUTES.SYMPTOM">
      <q-item-section side class="invisible">
        <q-icon name="home" color="primary" size="xs" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Sintomi
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item dense clickable :to="ROUTES.PAIN">
      <q-item-section side class="invisible">
        <q-icon name="home" color="primary" size="xs" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Dolori
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator inset />

    <q-item clickable :to="ROUTES.EVENT">
      <q-item-section side>
        <q-icon name="event" color="primary" size="xs" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Eventi
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator inset />

    <q-item clickable :to="ROUTES.DRUG">
      <q-item-section side>
        <q-icon name="mdi-pill" color="primary" size="xs" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Farmaci
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator inset />

    <q-item clickable :to="ROUTES.DIET">
      <q-item-section side>
        <q-icon name="restaurant" color="primary" size="xs" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Dieta
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator inset />

    <q-item clickable :to="ROUTES.STRUCTURE_CONTACT">
      <q-item-section side>
        <q-icon name="phone" color="primary" size="xs" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Contatti con strutture
        </q-item-label>
      </q-item-section>
    </q-item>

    <template v-if="!isDelegationTacWeak">
      <q-separator inset />

      <q-item clickable :to="ROUTES.SETTINGS">
        <q-item-section side>
          <q-icon name="settings" color="primary" size="xs" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            Impostazioni
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-list>
</template>

<script>
import * as ROUTES from "../router/routes";

export default {
  name: "TacMenu",
  props: {},
  data() {
    return {
      ROUTES
    };
  },
  computed: {
    isDelegationTacWeak() {
      return this.$store.getters["isDelegationTacWeak"];
    }
  },
  created() {},
  methods: {}
};
</script>

<style lang="sass">
.tac-menu
  .q-router-link--active
    background-color: $blue-2
    color: black
    font-weight: map-get($text-weights, 'bold')
</style>
