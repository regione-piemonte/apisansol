<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-table
    :columns="tableCols"
    :data="tableData"
    :pagination="tablePagination"
    flat
    dense
    :grid="$q.screen.lt.md"
    card-container-class="q-col-gutter-md q-px-md"
  >
    <!-- DATA -->
    <template #body-cell-date="props">
      <q-td :props="props">
        {{ props.row.data | datetime | empty }}
      </q-td>
    </template>

    <!-- VALORE -->
    <template #body-cell-value="props">
      <q-td :props="props">
        <template v-if="textValue">
          {{ props.row.valore_testuale | empty }}
        </template>
        <template v-else>
          {{ props.row.valore_numerico | decimals | number | empty }}
        </template>
      </q-td>
    </template>

    <!-- RIMUOVI -->
    <template #body-cell-delete="props">
      <q-td :props="props">
        <template v-if="!isDelegationTacWeak">
          <q-btn
            round
            flat
            dense
            icon="delete"
            color="negative"
            @click="onDelete(props.row)"
          />
        </template>
      </q-td>
    </template>

    <!-- GRID ITEM -->
    <!-- --------- -->
    <template #item="props">
      <div class="col-12 col-sm-6">
        <tac-table-grid-item-detection
          :row="props.row"
          @delete="onDelete(props.row)"
        />
      </div>
    </template>
  </q-table>
</template>

<script>
import TacTableGridItemDetection from "./TacTableGridItemDetection";

export default {
  name: "TacTableDetection",
  components: { TacTableGridItemDetection },
  props: {
    detectionList: { type: Array, required: false, default: () => [] },
    textValue: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      tablePagination: {
        sortBy: "date",
        descending: true,
        page: 1,
        rowsPerPage: 25
      }
    };
  },
  computed: {
    isDelegationTacWeak() {
      return this.$store.getters["isDelegationTacWeak"];
    },
    tableCols() {
      let result = [];

      result.push({
        name: "date",
        label: "Data",
        field: row => row.data,
        align: "left",
        sortable: true
      });

      if (this.textValue) {
        result.push({
          name: "value",
          label: "Descrizione",
          field: row => row.valore_testuale,
          align: "left",
          sortable: true
        });
      } else {
        result.push({
          name: "value",
          label: "Misura",
          field: row => row.valore_numerico,
          align: "left",
          sortable: true
        });

        result.push({
          name: "misure",
          label: "Unità di misura",
          field: row => row.unita_misura?.codice,
          align: "left"
        });
      }

      result.push({
        name: "detection-mode",
        label: "Modalità rilevazione",
        field: row => row.modalita?.descrizione_regionale || "-",
        align: "left",
        sortable: true
      });

      result.push({
        name: "delete",
        label: "",
        field: row => row.id,
        align: "right",
        sortable: false
      });

      return result;
    },
    tableData() {
      return this.detectionList ?? [];
    }
  },
  created() {},
  methods: {
    onDelete(row) {
      this.$emit("delete", row);
    }
  }
};
</script>

<style scoped lang="sass"></style>
