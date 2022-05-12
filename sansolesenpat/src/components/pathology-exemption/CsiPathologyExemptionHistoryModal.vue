<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-modal
    ref="modal"
    :value="value"
    :content-css="{minWidth: '50%'}"
    @input="$emit('input', $event)"
    @show="onShow"
  >

    <q-modal-layout v-if="exemption">
      <q-toolbar slot="header">

        <q-toolbar-title>Cronologia esenzione</q-toolbar-title>
        <q-btn flat round icon="close" v-close-overlay />
      </q-toolbar>

      <!-- MODAL BODY -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <template v-if="!isLoading">
        <div class="q-pa-md">
          <q-timeline responsive color="secondary">

            <q-timeline-entry
              v-for="item in history"
              :key="item.id"
              :title="getTitle(item)"
              :subtitle="getSubtitle(item)"
            >

              <q-chat-message
                v-if="item.nota"
                :sent="isMyMessage(item)"
                :name="getMessageAuthorName(item)"
                :stamp="getMessageTime(item)"
              >
                <template slot="avatar">
                  <div class="q-px-md q-py-none" style="margin-bottom: -16px">
                    <csi-icon-base class="csi-svg-icon--md">
                      <csi-icon-avatar-man />
                    </csi-icon-base>
                  </div>
                </template>

                {{item.nota}}


              </q-chat-message>
            </q-timeline-entry>

          </q-timeline>
        </div>
      </template>

      <!-- LOADING -->
      <!-- --------------------------------------------------------------------------------------------------------- -->
      <csi-inner-loading :visible="isLoading" block />
    </q-modal-layout>
  </q-modal>
</template>


<script>
    import {getExemptionDetailHistory} from '@services/api/pathology-exemption'
    import CsiIconAvatarPerson from 'components/global/icons/CsiIconAvatarPersonAdd'
    import CsiIconBase from 'components/global/icons/CsiIconBase'
    import CsiIconAvatarMan from 'components/global/icons/CsiIconAvatarMan'

    export default {
        name: 'CsiPathologyExemptionHistoryModal',
        components: {CsiIconAvatarMan, CsiIconBase, CsiIconAvatarPerson},
        props: {
            value: {type: Boolean, required: false, default: false},
            exemption: {type: Object, required: true},
        },
        data() {
            return {
                isLoading: false,
                history: [],
            }
        },
        computed: {
            user() {
                return this.$store.getters['global/user']
            },
            cf() {
                return this.$store.getters['pathologyExemption/getTaxCode']
            },
        },
        created() {
        },
        methods: {
            getTitle(item) {
                return `${item.nuovo_stato.descrizione}`
            },
            getSubtitle(item) {
                let date = this.$options.filters.format(item.data_creazione)
                return `${date}`
            },
            isMyMessage(item) {
                return item.utente.codice_fiscale === this.cf
            },
            getMessageAuthorName(item) {
                return item.utente.nome
            },
            getMessageTime(item) {
                let time = this.$options.filters.format(item.data_creazione, 'hh:mm')
                return `${time}`
            },
            async onShow() {
                // Avviamo il carricamento solo una volta
                if (this.isLoading || this.isLoaded) return

                this.isLoading = true
                let response = await getExemptionDetailHistory(this.cf, this.exemption.id)

                this.history = response.data
                console.log(this.history)
                this.isLoading = false
                this.isLoaded = true
            }
        },
    }
</script>


<style scoped lang="stylus"></style>
