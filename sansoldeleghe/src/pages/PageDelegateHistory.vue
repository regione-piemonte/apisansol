<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <lms-page-title>Storico assegnazione deleghe</lms-page-title>

    <div v-if="!isLoading" class="q-mt-lg">

      <template v-if="delegateResponseError">
        <div v-if="hasClientError">
          <q-banner rounded class="h-banner h-banner--negative">
            <div class="text-body1">
              <p>Non è stato possibile trovare il delegato</p>
              <p>
                Per favore, se <strong>{{ delegateTaxCode }}</strong> è il codice fiscale di un tuo delegato, riprova.
              </p>
            </div>
          </q-banner>

          <q-btn color="primary" class="full-width q-mt-lg" @click="loadDelegate">Riprova</q-btn>
        </div>
        <div v-if="hasServerError">
          <q-banner rounded class="h-banner h-banner--negative">
            <div class="text-body1">
              Non è stato possibile ottenere il delegato
            </div>
          </q-banner>

          <q-btn color="primary" class="full-width q-mt-lg" @click="loadDelegate">Riprova</q-btn>
        </div>
      </template>

      <q-card v-else >
        <q-card-section>
          <q-item class="no-padding">
            <q-item-section avatar>
              <q-icon size="lg" :name="avatarIcon"/>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-bold">{{ delegateFullName | startCase }}</q-item-label>
              <q-item-label caption>{{ delegate.codice_fiscale_delega }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-section>
          <q-table
            :grid="$q.screen.lt.sm"
            :data="delegate.deleghe"
            :columns="columns"
            row-key="name"
            :pagination.sync="tablePagination"
            hide-bottom
            class="shadow-0">

            <!-- Colonna "Servizio" -->
            <q-td slot="body-cell-service" slot-scope="props" :props="props">
              {{ getServiceName(props.value) }}
            </q-td>

            <!-- Colonna "Attiva dal" -->
            <q-td slot="body-cell-from" slot-scope="props" :props="props">
              {{ props.value | date }}
            </q-td>

            <!-- Colonna "Fino al" -->
            <q-td slot="body-cell-to" slot-scope="props" :props="props">
              {{ props.value | date }}
            </q-td>

            <!-- Colonna "Stato" -->
            <q-td slot="body-cell-state" slot-scope="props" :props="props">
              <lms-delegations-list-item-status :status="props.value" icon-right/>
            </q-td>


            <template v-slot:item="props">

              <div class="col-12 ">
                <q-card flat>
                  <q-card-section class="q-py-none">
                      <q-item class="q-px-none">
                        <q-item-section>
                          <q-item-label caption>{{COLUMN_SERVICE.label}}</q-item-label>
                          <q-item-label>{{getServiceName(props.row.codice_servizio)}}</q-item-label>
                        </q-item-section>
                      </q-item>
                    <q-item class="q-px-none">
                      <q-item-section>
                        <q-item-label caption>{{COLUMN_FROM.label}}</q-item-label>
                        <q-item-label>{{props.row.data_inizio_delega | date}}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-px-none">
                      <q-item-section>
                        <q-item-label caption>{{COLUMN_TO.label}}</q-item-label>
                        <q-item-label>{{props.row.data_fine_delega | date}}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-px-none">
                      <q-item-section>
                        <q-item-label caption>{{COLUMN_STATE.label}}</q-item-label>
                        <q-item-label><lms-delegations-list-item-status :status="props.row.stato_delega"/></q-item-label>
                      </q-item-section>
                    </q-item>

                  </q-card-section>
                  <q-separator spaced="lg"/>
                </q-card>
              </div>
            </template>

          </q-table>


        </q-card-section>
      </q-card>


    </div>
    <!-- LOADER -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-inner-loading :showing="isLoading"/>
  </lms-page>
</template>

<script>
import {getAvatarIcon, getServiceName} from "src/services/business-logic";
import LmsDelegationsListItemStatus from "components/LmsDelegationsListItemStatus";
import {isClientError, isResponseError, isServerError} from "src/services/utils";
import {getDelegate, getDelegates} from "src/services/api";

const COLUMN_SERVICE = {
  name: 'service',
  label: 'Servizio',
  field: 'codice_servizio',
  align: 'left',
  sortable: true,
};

const COLUMN_FROM = {
  name: 'from',
  label: 'Attivo dal',
  field: 'data_inizio_delega',
  align: 'left',
  sortable: true,
};

const COLUMN_TO = {
  name: 'to',
  label: 'Fino al',
  field: 'data_fine_delega',
  align: 'left',
  sortable: true,
};

const COLUMN_STATE = {
  name: 'state',
  label: 'Stato',
  field: 'stato_delega',
  align: 'right',
};
const TABLE_PAGINATION = {
  rowsPerPage: 0
}
export default {
  name: "PageDelegateHistory",
  components: {LmsDelegationsListItemStatus},
  data() {
    return {
      isLoading: true,
      delegateResponse: undefined,
      COLUMN_SERVICE,
      COLUMN_FROM,
      COLUMN_TO,
      COLUMN_STATE,
      columns: [
        COLUMN_SERVICE,
        COLUMN_FROM,
        COLUMN_TO,
        COLUMN_STATE,
      ],
      tablePagination: TABLE_PAGINATION,
      delegateTaxCode:null
    };
  },
  computed: {
    user() {
      return this.$store.getters["getUser"];
    },
    userTaxCode(){
      return this.$store.getters["getTaxCode"];
    },
    delegateUuid() {
      return this.$route.params.delegateUuid;
    },

    delegateResponseSuccess() {
      return !isResponseError(this.delegateResponse) && this.delegateResponse
    },
    delegateResponseError() {
      return isResponseError(this.delegateResponse) && this.delegateResponse
    },
    delegate() {
      if (!this.delegateResponseSuccess) return {}
      return this.delegateResponseSuccess.data
    },
    delegateFullName() {
      return `${this.delegate?.nome_delega} ${this.delegate?.cognome_delega}`;
    },
    hasServerError() {
      return this.delegateResponseError && isServerError(this.delegateResponseError)
    },
    hasClientError() {
      return this.delegateResponseError && isClientError(this.delegateResponseError)
    },
    avatarIcon() {
      return getAvatarIcon(this.delegate?.sesso_delega)
    }
  },

  async created() {

    this.loadDelegate()
  },
  methods: {
    getServiceName,
    async loadDelegate() {
      this.isLoading = true

      let {delegateUuid, delegate} = this.$route.params;

      // se non ci è stato passato il delegato => lo otteniamo dal server
      if (!delegate) {
        // Anzichè prendere il singolo delegato prendiamo la lista dei delegati e poi filtriamo per ottenere il singolo delegato
        let response = await getDelegates(this.userTaxCode)
        delegate = response.data.find(d => d.uuid === delegateUuid)
        if (!delegate) {
          console.error('Il delegato non esiste... probabilmente la URL è stata inserita manualmente ed è presente un errore nel CF del delegato')
        }
      }
      this.delegateTaxCode = delegate?.codice_fiscale_delega

      try {
        this.delegateResponse = await getDelegate(this.userTaxCode, this.delegateTaxCode)
      } catch (errorResponse) {
        this.delegateResponse = errorResponse
      }

       this.isLoading = false
    },

  }
}
</script>

<style scoped>

</style>
