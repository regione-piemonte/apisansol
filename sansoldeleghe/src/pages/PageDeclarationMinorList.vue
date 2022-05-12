<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <lms-page padding>
    <template v-if="!isLoading">
      <!-- STATO VUOTO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-if="isEmpty(declarations)">
        <div class="row items-center justify-center q-mb-lg">
          <div class="col-auto">
            <q-chip color="info" text-color="black">
              <strong>
                <span>Non hai deleghe nei confronti di minori</span>
              </strong>
            </q-chip>
          </div>
        </div>

        <q-card>
          <q-card-section>
            <lms-banner image-src="images/img_gestione_minori.svg">
              <template slot="text">
                <p>
                  Questo servizio permette di certificare la propria responsabilità genitoriale (affidata ad entrambi
                  genitori ai sensi dell’<a href="https://it.wikisource.org/wiki/Codice_civile/Libro_I/Titolo_IX"
                                            target="_blank">art. 316 del c.c., come sostituito dal D. Lgs. n.
                  154/2013)</a> ed ottenere delega ed abilitazione ad accedere, per conto dei propri figli minorenni,
                  ai servizi telematici disponibili.
                </p>
                <p>
                  Alla responsabilità genitoriale sono sottoposti tutti i figli minori non emancipati, sia nati nel
                  matrimonio sia nati fuori dal matrimonio. Ciò vale anche nel caso di figli adottivi, nel caso in cui i
                  loro genitori adottivi, per effetto dell'adozione (legittimante), acquistano a tutti gli effetti la
                  responsabilità genitoriale.
                </p>
                <p>
                  La funzionalità telematica, ad oggi, attivata richiede l’istanza di un genitore maggiorenne e la
                  dichiarazione di conferma da parte dell’altro genitore maggiorenne attraverso il sistema pubblico di
                  identità digitale (SPID), o in alternativa con credenziali di Tessera Sanitaria con microchip TS-CNS
                  (Tessera Sanitaria – Carta Nazionale dei Servizi) o qualsiasi Carta Nazionale Servizi.
                </p>
                <p>
                  Al momento il servizio non abilita le funzionalità di delega su dichiarazione fatta da un solo
                  genitore, che non riceve la conferma telematica del secondo genitore.
                </p>
                <template v-if="isPiedmontUser">
                  <q-btn
                    @click="newJointDeclaration"
                    color="primary"
                    class="full-width">
                    Nuova dichiarazione
                  </q-btn>
                </template>

              </template>
            </lms-banner>
          </q-card-section>
        </q-card>
      </template>

      <!-- STATO PIENO -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-else>

        <!-- FILTRI -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <template v-if="isPiedmontUser">

          <div class="row items-center q-col-gutter-xs q-mb-md" :class="{'reverse': $q.screen.gt.xs}">
            <div class="col-12 col-md-auto" :class="$q.screen.lt.md ? 'order-first' : 'order-last'">
              <q-btn
                @click="newJointDeclaration"
                color="primary"
                class="full-width"
              >
                Nuova dichiarazione
              </q-btn>
            </div>
          </div>
        </template>

        <!-- LISTA DELEGANTI MINORI -->
        <!-- ------------------------------------------------------------------------------------------------------- -->
        <div class="csi-group-card">
          <lms-declaration-list-item
            class="q-my-md"
            v-for="declaration in declarationMinorListSorted"
            :key="declaration.uuid"
            :declaration="declaration"
            :no-new-declaration="!isPiedmontUser"
            @confirm="onConfirm(declaration)"
            @revoke="onRevoke(declaration)"
            @newDeclaration="onNewDeclaration(declaration)"
          />
        </div>
      </template>

      <div class="q-py-md text-right">
        <router-link class="lms-link" :to="POLICY_MINORS">Privacy e condizioni d'uso</router-link>
      </div>
    </template>

    <!-- LOADING -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <lms-inner-loading :showing="isLoading"/>

  </lms-page>
</template>

<script>


import {isEmpty} from "src/services/utils";
import {
  DECLARATION_MINOR_CONFIRM,
  DECLARATION_MINOR_NEW,
  DECLARATION_MINOR_REVOKE,
  POLICY_MINORS
} from "src/router/routes";
import LmsBanner from "components/core/LmsBanner";
import LmsDeclarationListItem from "components/LmsDeclarationListItem";
import {getDeclarationMinor} from "src/services/business-logic";
import {getDeclarationMinorList} from "src/services/api";

export default {
  name: "PageDeclarationMinorList",
  components: {LmsDeclarationListItem, LmsBanner},
  data() {
    return {
      POLICY_MINORS,
      isLoading: false,
      isSelectionModalOpen: false,
      declarations: null,
    };
  },
  computed: {
    taxCode(){
      return this.$store.getters["getTaxCode"];
    },
    isPiedmontUser() {
      return this.$store.getters['isPiedmontUser']
    },
    declarationMinorListSorted() {
      let result = [...this.declarations];

      result.sort((a, b) => {
        let aMinor = getDeclarationMinor(a);
        let bMinor = getDeclarationMinor(b);
        let aFullName = [aMinor.nome, aMinor.cognome].join(' ');
        let bFullName = [bMinor.nome, bMinor.cognome].join(' ');
        return aFullName > bFullName ? 1 : -1
      });

      return result
    }
  },
  async created() {
    this.isLoading = true
    try{
      let declarationsResponse = await getDeclarationMinorList(this.taxCode)
      this.declarations = declarationsResponse?.data ?? []
    }catch (e){

    }finally {
      this.isLoading = false
    }


  },
  methods: {
    isEmpty,
    newJointDeclaration() {
      let routeName = DECLARATION_MINOR_NEW.name
      let params = {dettagli: this.declarations}
      this.$router.push({name: routeName, params: params})
    },
    onServiceSelected(newValue) {
      this.serviceSelected = newValue
    },
    onDeclarationUpdate(oldValue, newValue) {
      this.declarations = this.declarations.map(d => d.uuid === oldValue.uuid ? newValue : d)
    },
    onConfirm(declaration) {
      let name = DECLARATION_MINOR_CONFIRM.name
      let params = {id: declaration.uuid, declaration}
      this.$router.push({name, params})
    },
    onRevoke(declaration) {
      let name = DECLARATION_MINOR_REVOKE.name
      let params = {id: declaration.uuid, declaration}
      this.$router.push({name, params})
    },
    onNewDeclaration(declaration) {
      let name = DECLARATION_MINOR_NEW.name
      let params = {declaration: declaration}
      this.$router.push({name, params})
    },
  }
}
</script>

<style scoped>

</style>
