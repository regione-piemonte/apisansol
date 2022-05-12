<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<!--
Tabella creata ad hoc perché vogliamo che le rilevazioni dell'insulina
siano raggruppate in una sola tabella.

Le rilevazioni di insulina e insulina farm sono oggetti distinti e per fare il match utlizziamo la data di entrambe
le rilevazioni. Se le due date sono le stesse (al minuto) possiamo ipotizzare che la rilevazione minima e massima
siano state fatte insieme.
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
        <q-card flat bordered class="relative-position">
          <template v-for="col in props.cols">
            <template v-if="col.name !== 'delete'">
              <q-card-section :key="col.name">
                <div class="tac-table-grid-item__field-label">
                  {{ col.label }}
                </div>
                <div class="tac-table-grid-item__field-value">
                  {{ col.value }}
                </div>
              </q-card-section>
            </template>

            <template v-else>
              <template v-if="!isDelegationTacWeak">
                <q-btn
                  flat
                  dense
                  round
                  icon="more_vert"
                  class="absolute-top-right q-mt-sm q-mr-sm"
                  :key="col.name"
                >
                  <q-menu>
                    <q-list>
                      <q-item clickable @click="onDelete(props.row)">
                        <q-item-section side>
                          <q-icon name="delete" color="negative" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>
                            Rimuovi
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </template>
            </template>
          </template>
        </q-card>
      </div>
    </template>
  </q-table>
</template>

<script>
import { date } from "quasar";
import { datetime, empty, number } from "../boot/filters";
import { keyBy } from "../services/utils";

const { formatDate } = date;

export default {
  name: "TacTableDetectionInsulin",
  props: {
    detectionInsulinList: { type: Array, required: false, default: () => [] },
    detectionInsulinFarmList: {
      type: Array,
      required: false,
      default: () => []
    }
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
        field: row => row.insulin.data,
        format: (val, row) => empty(datetime(val)),
        align: "left",
        sortable: true
      });

      result.push({
        name: "value",
        label: "Insulina",
        field: row => row.insulin?.valore_numerico,
        format: (val, row) => empty(number(val)),
        align: "left",
        sortable: true
      });

      result.push({
        name: "misure",
        label: "Unità di misura",
        field: row => row.insulin?.unita_misura?.codice,
        format: (val, row) => empty(val),
        align: "left"
      });

      result.push({
        name: "value-max",
        label: "Insulina farm",
        field: row => row.insulinFarm?.valore_testuale,
        format: (val, row) => empty(val),
        align: "left",
        sortable: true
      });

      result.push({
        name: "detection-mode",
        label: "Modalità rilevazione",
        field: row => row.insulin.modalita?.descrizione_regionale,
        format: (val, row) => empty(val),
        align: "left",
        sortable: true
      });

      result.push({
        name: "delete",
        label: "",
        field: row => row.min?.id,
        align: "right",
        sortable: false
      });

      return result;
    },
    tableData() {
      let insulinFarmKeyedByDate = keyBy(this.detectionInsulinFarmList, el =>
        formatDate(el.data, "YYYY-MM-DDTHH:mm")
      );

      return this.detectionInsulinList.map(el => {
        let key = formatDate(el.data, "YYYY-MM-DDTHH:mm");
        return { insulin: el, insulinFarm: insulinFarmKeyedByDate[key] };
      });
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
