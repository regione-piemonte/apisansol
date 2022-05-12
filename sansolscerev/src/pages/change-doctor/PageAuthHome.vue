<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<template>
  <q-page padding>
    <template v-if="$config.global.isNewEnrollableActive">
      <div class="q-mb-lg">
        <csi-enrollment-guard2
          :code="enrollmentCode"
          :active-delegator="activeDelegation"
          is-change-doctor-app
          @click-activate="onActivate"
        />
      </div>
    </template>
    <template v-if="!isLoading && isData && !noUserFound">
      <!------- INFO ASSISTITO ------------>
      <!-- ----------------------------------------------------------------------------------------------------- -->
      <q-card v-if="!isProduction" class="bg-white">
        <q-card-title class="q-pa-lg cursor-pointer" @click.native="toggleShowMore">
          <h1 class="csi-h1 ">I tuoi dati </h1>
          <div slot="right" class="row text-primary text-weight-bold cursor-pointer">
            <q-icon
              :class="{'show-more-icon--active': isShowingMore}"
              class="csi-icon--sm show-more-icon"
              name="keyboard_arrow_down"
            />
          </div>
        </q-card-title>
        <q-slide-transition>
          <q-card-main v-if="isShowingMore" class="">
            <div class="row items-center gutter-x-sm q-px-sm">
              <q-item>
                <q-item-side>
                  <q-icon class="csi-icon--md" color="black" name="account_circle"/>
                </q-item-side>
                <q-item-main>
                  <q-item-tile class="q-subheading">
                    <strong v-if="userInfo.cognome || userInfo.nome">{{ userInfo.cognome | toUpper }}
                      {{ userInfo.nome | capitalize }}</strong>
                    <strong v-else>- -</strong>
                  </q-item-tile>
                </q-item-main>
              </q-item>
            </div>
            <div class="row items-center gutter-x-sm q-px-sm">
              <q-item v-if="userInfo.codice_fiscale" class="col-sm-6 col-12">
                <q-item-main>
                  <q-item-tile class="q-body-1">Codice fiscale</q-item-tile>
                  <q-item-tile v-if="userInfo.codice_fiscale" class="q-body-2">{{ userInfo.codice_fiscale | toUpper }}
                  </q-item-tile>
                  <q-item-tile v-else class="q-body-2 text-italic">Nessuna informazione disponibile.</q-item-tile>
                </q-item-main>
              </q-item>

              <q-item class="col-sm-6 col-12">
                <q-item-main>
                  <q-item-tile class="q-body-1">Cittadinanza</q-item-tile>
                  <q-item-tile v-if="userInfo.cittadinanza && userInfo.cittadinanza.descrizione" class="q-body-2">
                    {{ userInfo.cittadinanza.descrizione | toUpper }}
                  </q-item-tile>

                  <q-item-tile v-else class="q-body-2 text-italic">
                    Nessuna informazione disponibile.
                  </q-item-tile>
                </q-item-main>
              </q-item>
            </div>

            <div class="row items-center gutter-x-sm q-px-sm">
              <q-item class="col-sm-6 col-12">
                <q-item-main>
                  <q-item-tile class="q-body-1">Luogo di nascita</q-item-tile>
                  <q-item-tile v-if="userInfo.comune_nascita" class="q-body-2">{{ userInfo.comune_nascita }}
                  </q-item-tile>

                  <q-item-tile v-else class="q-body-2 text-italic">Nessuna informazione disponibile.</q-item-tile>
                </q-item-main>
              </q-item>

              <q-item class="col-sm-6 col-12">
                <q-item-main>
                  <q-item-tile class="q-body-1">Data di nascita</q-item-tile>
                  <q-item-tile v-if="userInfo.data_nascita" class="q-body-2">{{ userInfo.data_nascita | format }}
                  </q-item-tile>
                  <q-item-tile v-else class="q-body-2 text-italic">Nessuna informazione disponibile.</q-item-tile>
                </q-item-main>
              </q-item>
            </div>

            <div class="row items-center gutter-x-sm q-px-sm">
              <q-item class="col-sm-6 col-12">
                <q-item-main>
                  <q-item-tile class="q-body-1">Residenza</q-item-tile>
                  <q-item-tile v-if="userInfo.residenza" class="q-body-2">
                    {{ userInfo.residenza.indirizzo }}, {{ userInfo.residenza.civico }} -
                    {{ userInfo.residenza.comune }}
                  </q-item-tile>

                  <q-item-tile v-else class="q-body-2 text-italic">
                    Nessuna informazione disponibile.
                  </q-item-tile>
                </q-item-main>

              </q-item>

              <q-item class="col-sm-6 col-12">
                <q-item-main>
                  <q-item-tile class="q-body-1">Domicilio</q-item-tile>
                  <q-item-tile v-if="userInfo.domicilio" class="q-body-2">
                    {{ userInfo.domicilio.indirizzo }}, {{ userInfo.domicilio.civico }} -
                    {{ userInfo.domicilio.comune }}
                  </q-item-tile>

                  <q-item-tile v-else class="q-body-2 text-italic">
                    Nessuna informazione disponibile.
                  </q-item-tile>
                </q-item-main>
              </q-item>

            </div>
            <div class="row items-center gutter-x-sm q-px-sm">
              <q-item class="col-sm-6 col-12">
                <q-item-main>
                  <q-item-tile class="q-body-1">Telefono</q-item-tile>
                  <q-item-tile v-if="userInfo.recapiti && userInfo.recapiti.telefono" class="q-body-2">
                    {{ userInfo.recapiti.telefono }}
                  </q-item-tile>

                  <q-item-tile v-else class="q-body-2 text-italic">
                    Nessuna informazione disponibile.
                  </q-item-tile>
                </q-item-main>
              </q-item>

              <!--              <q-item  class="col-sm-6 col-12">-->
              <!--                <q-item-main>-->
              <!--                  <q-item-tile class="q-body-1">Telefono secondario</q-item-tile>-->
              <!--                  <q-item-tile class="q-body-2" v-if="userInfo.recapiti && userInfo.recapiti.telefono_secondario">-->
              <!--                    {{userInfo.recapiti.telefono_secondario}}-->
              <!--                  </q-item-tile>-->

              <!--                  <q-item-tile class="q-body-2 text-italic" v-else>-->
              <!--                    Nessuna informazione disponibile.-->
              <!--                  </q-item-tile>-->
              <!--                </q-item-main>-->
              <!--              </q-item>-->
            </div>
            <!--          <div class="row items-center gutter-x-sm q-px-sm">-->
            <!--              <q-item  class="col-sm-6 col-12">-->
            <!--                <q-item-main>-->
            <!--                  <q-item-tile class="q-body-1">Email</q-item-tile>-->
            <!--                  <q-item-tile class="q-body-2 " v-if="userInfo.recapiti && userInfo.recapiti.indirizzo_email">-->
            <!--                    {{userInfo.recapiti.indirizzo_email | toLower}}-->
            <!--                  </q-item-tile>-->

            <!--                  <q-item-tile class="q-body-2 text-italic" v-else>-->
            <!--                    Nessuna informazione disponibile.-->
            <!--                  </q-item-tile>-->
            <!--                </q-item-main>-->
            <!--              </q-item>-->
            <!--          </div>-->

          </q-card-main>
        </q-slide-transition>
      </q-card>

      <!------- RICHIESTA CAMBIO MEDICO ------------>
      <!-- ----------------------------------------------------------------------------------------------------- -->
      <template v-if="request">
        <q-alert v-if="correctionMessage" class="csi-doctor-alert" icon="feedback" type="info">
          <div class="q-body-1 q-pa-md">
            {{ correctionMessage }}
          </div>
        </q-alert>


        <div class="row justify-between items-center change-doctor-home-title">
          <h1 class="csi-h1 col-xs-12 col-sm-auto">
            La tua richiesta
          </h1>
          <!--            <div-->
          <!--              class="text-primary text-weight-bold cursor-pointer q-body-1 float-right q-py-sm"-->
          <!--              v-on:click="deleteRequestModal"-->
          <!--              v-if="isCancellable"-->
          <!--            >-->
          <!--              <span v-if="isDraft">Annulla bozza</span>-->
          <!--              <span v-else-if="isReviewable">Elimina richiesta</span>-->
          <!--              <span v-else>Annulla richiesta</span>-->
          <!--            </div>-->
        </div>

        <q-card class="bg-grey-3">
          <!---BANNER --->
          <csi-bar
            v-if="statusRequest"
            :bg-color="statusRequest.bgColor"
          >
            <div class="row flex items-center justify-start q-py-sm">
              <div class="col-1 text-center">
                <q-icon class="csi-icon--sm q-pr-sm" name="info"/>
              </div>
              <div class="col-11">{{ statusRequest.msg }}</div>
            </div>
          </csi-bar>

          <q-card-main>
            <q-item class="q-pa-sm">
              <q-item-main>
                <q-item-tile class="q-body-1">
                    <span v-if="isAssistanceRenewal">
                       Domanda di rinnovo assistenza n.
                    </span>
                  <span v-else>
                      Domanda di cambio medico n.
                    </span>
                </q-item-tile>
                <q-item-tile class="q-body-2"> {{ request.id }}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item v-if="!isAssistanceRenewal" class="q-pa-sm">
              <q-item-main>
                <q-item-tile class="q-body-1">Medico richiesto</q-item-tile>
                <q-item-tile v-if="doctorRequested" class="q-body-2"> {{ doctorRequested.cognome |toUpper }}
                  {{ doctorRequested.nome | capitalize }}
                </q-item-tile>
              </q-item-main>
            </q-item>

            <q-list no-border>
              <div class="q-body-1 q-px-sm"> Allegati</div>

              <template v-if="attachments && attachments.length>0">


                <q-item v-for="attachment in attachments" :key="attachment.tipo" class="q-pa-xs ">
                  <q-item-main class="row">
                    <q-item-tile class="col-12 col-sm-4 q-body-1 " color="faded">
                      {{ attachment.descrizione }}
                    </q-item-tile>
                    <q-item-tile class="col-12 col-sm-8 q-body-2">
                      <a class="csi-link" href="#"
                         @click.prevent.stop="downloadAttachment(attachment)">{{ attachment.nome_file }} </a>
                    </q-item-tile>
                  </q-item-main>
                </q-item>


              </template>
              <template v-else>
                <div class="q-px-sm text-italic q-body-2">Nessun allegato.</div>
              </template>

            </q-list>

            <div class="q-mt-lg "><i>Se hai cambiato residenza o domicilio, i tuoi dati saranno aggiornati solo se la
              tua richiesta di scelta medico sarà accettata.</i></div>

            <template v-if="isReviewable && orderedChatMessages.length>0">
              <div class="bg-white q-mt-md">
                <q-item class="q-pr-lg cursor-pointer q-py-md bg-primary text-white" @click.native="toggleShowChat">
                  <q-item-main>
                    <q-item-tile class="text-weight-bold">Cronologia messaggi</q-item-tile>
                  </q-item-main>
                  <q-item-side
                    v-show="orderedChatMessages.length>0"
                    class="text-weight-bold cursor-pointer text-right">
                    <q-icon
                      :class="{'show-more-icon--active': isShowingChat}"
                      class="csi-icon--sm show-more-icon text-white"
                      name="keyboard_arrow_down"
                    />
                  </q-item-side>
                </q-item>

                <template v-if="orderedChatMessages.length>0">
                  <q-slide-transition>
                    <template v-if="isShowingChat">
                      <div class="row">
                        <q-item class="col-xs-12">
                          <q-item-main>
                            <q-item-tile class="text-weight-bold"></q-item-tile>
                            <q-item-tile>
                              <div v-for="(msg,index) in orderedChatMessages"
                                   :key="index">
                                <q-chat-message
                                  v-if="msg.testo"
                                  :name="getMsgAuthorName(msg)"
                                  :sent="msg.cittadino"
                                  :stamp="msg.data | format('DD MMM YYYY HH:mm')"
                                >
                                  <template slot="avatar">
                                    <div class="q-px-md q-py-none" style="margin-bottom: -16px">
                                      <csi-icon-base class="csi-svg-icon--md">
                                        <template v-if="userInfo.sesso === 'F' && msg.cittadino">
                                          <csi-icon-avatar-woman/>
                                        </template>
                                        <template v-else>
                                          <csi-icon-avatar-man/>
                                        </template>
                                      </csi-icon-base>
                                    </div>
                                  </template>
                                  {{ msg.testo }}
                                </q-chat-message>
                              </div>
                            </q-item-tile>
                          </q-item-main>
                        </q-item>
                      </div>
                    </template>
                  </q-slide-transition>
                </template>


              </div>

            </template>


          </q-card-main>

          <!-- AZIONI -->
          <!-- --------------------------------------------------------------------------------------------------------- -->
          <q-card-actions align="end">
            <csi-buttons>
              <csi-button
                v-if="isReviewable"
                label="Modifica"
                primary
                @click="changeRequest(true)"
              />
              <csi-button
                v-if="isDraft"
                label="Completa"
                primary
                @click="changeRequest(false)"
              />
              <csi-button
                v-if="isCancellable"
                :label="isReviewable ? 'Elimina' : 'Annulla'"
                color="negative"
                secondary
                @click="deleteRequestModal"
              />

              <csi-button
                label="Stampa"
                secondary
                @click="getRequestPdf"
              />

            </csi-buttons>
          </q-card-actions>

        </q-card>


      </template>
      <!------- MEDICI MONITORATI ------------>
      <!-- ----------------------------------------------------------------------------------------------------- -->
      <template v-if="isMonitoringDoctors && !isDelegationActive">
        <q-card class="change-doctor-home-title">
          <q-card-title class="q-pa-lg cursor-pointer" @click.native="toggleMonitoredDoctorsCard">
            <h1 class="csi-h1 ">I medici che stai monitorando</h1>
            <div slot="right" class="row text-primary text-weight-bold cursor-pointer">
              <q-icon
                :class="{'show-more-icon--active': isShowingMonitoredDoctors}"
                class="csi-icon--sm show-more-icon"
                name="keyboard_arrow_down"
              />
            </div>
          </q-card-title>
          <q-slide-transition>
            <q-card-main v-if="isShowingMonitoredDoctors" class="no-padding">
              <q-list class="q-px-lg" no-border separator>
                <q-item
                  v-for="doctor in monitoredDoctors"
                  :key="doctor.id"
                  class="csi-monitored-doctors"
                >
                  <q-item-main class="row items-center justify-between">
                    <q-item-tile class="col-xs-12 col-md-8">
                      <div
                        class="text-primary text-weight-bold cursor-pointer q-mr-sm q-subheading"
                        v-on:click="showDoctorDetails(doctor)">
                        {{ doctor.cognome }} {{ doctor.nome }}
                      </div>

                    </q-item-tile>
                    <q-item-tile
                      :class="{'for-mobile': $q.screen.lt.md}"
                      class="text-negative text-weight-bold cursor-pointer q-body-1 text-right col-xs-12 col-md-4 "
                      @click.native="deleteMonitoringModal(doctor)"
                    >
                      Annulla monitoraggio
                    </q-item-tile>
                  </q-item-main>
                </q-item>
                <q-item-separator/>
              </q-list>
            </q-card-main>
          </q-slide-transition>
        </q-card>
      </template>

      <!------- IL TUO MEDICO ------------>
      <!-- ----------------------------------------------------------------------------------------------------- -->
      <template v-if="isAssistanceRenewable">
        <template v-if="isAssistanceExpiring">
          <q-alert class="csi-doctor-alert" icon="feedback" type="warning">
            <div class="q-body-1 q-pa-md">
            <span v-if="assistanceExpiringDays >=0">
              Tra {{ assistanceExpiringDays }}
              <span v-if="assistanceExpiringDays===1">giorno</span>
               <span v-else>giorni</span>
              la tua assistenza scadrà. Puoi procedere con il rinnovo.
            </span>
              <span v-else>
              La tua assistenza è scaduta, puoi procedere con il rinnovo. </span>
            </div>
          </q-alert>

        </template>
        <template v-else>
          <q-alert class="csi-doctor-alert"  type="info">
            <div class="q-body-1 q-pa-md">
              Sarà possibile rinnovare il medico a partire dal {{assistanceRenewableDate |format("DD/MM/YYYY")}}
            </div>
          </q-alert>
        </template>
      </template>

      <div class="row justify-between items-center change-doctor-home-title">
        <h1 class="csi-h1 col-xs-12 col-sm-auto">Il tuo medico</h1>
        <div
          class="text-primary text-weight-bold cursor-pointer q-body-1 float-right q-py-sm"
          v-on:click="goToSearchForm"
        >
          Cerca un altro medico
        </div>
      </div>
      <template v-if="isDoctor">
        <div v-if="doctor">
          <csi-doctor-item
            :associations="doctorAssociations"
            :cf="cf"
            :doctor="doctor"
            class="q-my-md"
            home-card
            @revoke-doctor="revokeDoctor"
            @revoke-assistance="revokeAssistance"
          />
        </div>
        <q-card v-else>
          <q-card-main>
            <q-alert class="q-my-md" type="warning">
              In questo momento non è possibile visualizzare i dettagli del medico.
            </q-alert>
          </q-card-main>
          <q-card-actions align="end">
            <csi-buttons>
              <csi-button
                v-if="!request"
                label="Cambia medico"
                primary
                @click="chooseDoctor"
              />
              <csi-button
                color="negative"
                label="Revoca medico"
                secondary
                @click="showRevokeDoctorModal"
              />
            </csi-buttons>

          </q-card-actions>
        </q-card>

      </template>
      <template v-else>
        <q-alert class="q-my-md" type="info">
          In questo momento non hai l'assistenza sanitaria di nessun medico in Piemonte.
        </q-alert>
        <div class="row justify-end q-py-sm ">
          <!--                    <div class="row items-center justify-start" :class="{'reverse': this.$q.screen.gt.sm}">-->
          <div class="col-12 col-md-auto">
            <csi-buttons>
              <csi-button
                label="Scegli medico"
                primary
                @click="chooseDoctor"
              />
            </csi-buttons>
          </div>
        </div>
      </template>

      <!------- LA TUA ASSISTENZA ------------>
      <!-- ----------------------------------------------------------------------------------------------------- -->
      <template v-if="isProduction">
        <template v-if="assistanceCardVisibile">
          <div class="row change-doctor-home-title">
            <h1 class="csi-h1">La tua assistenza</h1>
          </div>
          <template v-if="isAssistance">
            <q-card>
              <q-card-main class="no-padding">
                <div class="row items-center q-pa-md">
                  <q-item v-if="userInfo.asl_assistenza" class="col-sm-7 col-12">
                    <q-item-main>
                      <q-item-tile class="q-body-1">ASL di assistenza</q-item-tile>
                      <q-item-tile class="q-body-2">{{ userInfo.asl_assistenza.descrizione }}</q-item-tile>
                    </q-item-main>
                  </q-item>

                  <q-item class="col-sm-5 col-12">
                    <q-item-main>
                      <q-item-tile class="q-body-1">Data fine di assistenza</q-item-tile>
                      <q-item-tile class="q-body-2">
                        {{ assistanceEndDate }}
                      </q-item-tile>
                    </q-item-main>
                  </q-item>
                </div>
                <div v-if="isAssistanceExpiring" class="row justify-end q-pa-md">

                  <csi-buttons>
                    <csi-button
                      label="Rinnova assistenza"
                      @click="renewAssistance"
                    />
                  </csi-buttons>

                </div>
                <!--              <div class="row justify-end q-pa-md" >-->

                <!--                <csi-buttons>-->
                <!--                  <csi-button-->
                <!--                    color="negative"-->
                <!--                    secondary-->
                <!--                    label="Revoca assistenza"-->
                <!--                    @click="showRevokeAssistanceModal"-->
                <!--                  />-->
                <!--                </csi-buttons>-->

                <!--              </div>-->
              </q-card-main>
            </q-card>
          </template>
          <template v-else>
            <q-alert class="q-my-md" type="info">
              In questo momento non hai la copertura dell'assistenza sanitaria di nessuna ASL piemontese.
            </q-alert>
            <!--             <div class="row justify-end q-py-sm "  v-if="userInfo.data_revoca_assistenza">-->
            <!--               &lt;!&ndash;                    <div class="row items-center justify-start" :class="{'reverse': this.$q.screen.gt.sm}">&ndash;&gt;-->
            <!--               <div class="col-12 col-md-auto">-->
            <!--                 <csi-buttons>-->
            <!--                   <csi-button-->
            <!--                     secondary-->
            <!--                     label="Stampa revoca assistenza"-->
            <!--                     @click="getRevokeCertificate"-->
            <!--                   />-->
            <!--                 </csi-buttons>-->
            <!--               </div>-->
            <!--             </div>-->
            <div v-if="isAssistanceExpiring" class="row justify-end q-pa-md">

              <csi-buttons>
                <csi-button
                  label="Rinnova assistenza"
                  @click="renewAssistance"
                />
              </csi-buttons>

            </div>
          </template>
        </template>

      </template>
      <template v-else>
        <div class="row change-doctor-home-title">
          <h1 class="csi-h1">La tua assistenza</h1>
        </div>
        <template v-if="isAssistance">
          <q-card>
            <q-card-main class="no-padding">
              <div class="row items-center q-pa-md">
                <q-item v-if="userInfo.asl_assistenza" class="col-sm-7 col-12">
                  <q-item-main>
                    <q-item-tile class="q-body-1">ASL di assistenza</q-item-tile>
                    <q-item-tile class="q-body-2">{{ userInfo.asl_assistenza.descrizione }}</q-item-tile>
                  </q-item-main>
                </q-item>

                <q-item class="col-sm-5 col-12">
                  <q-item-main>
                    <q-item-tile class="q-body-1">Data fine di assistenza</q-item-tile>
                    <q-item-tile class="q-body-2">
                      {{ assistanceEndDate }}
                    </q-item-tile>
                  </q-item-main>
                </q-item>
              </div>


              <div v-if="isAssistanceExpiring" class="row justify-end q-pa-md">

                <csi-buttons>
                  <csi-button
                    label="Rinnova assistenza"
                    @click="renewAssistance"
                  />
                </csi-buttons>

              </div>

            </q-card-main>
          </q-card>
        </template>
        <template v-else>
          <q-alert class="q-my-md" type="info">
            In questo momento non hai la copertura dell'assistenza sanitaria di nessuna ASL piemontese.
          </q-alert>
          <!--           <div class="row justify-end q-py-sm "  v-if="userInfo.data_revoca_assistenza">-->
          <!--             &lt;!&ndash;                    <div class="row items-center justify-start" :class="{'reverse': this.$q.screen.gt.sm}">&ndash;&gt;-->
          <!--             <div class="col-12 col-md-auto">-->
          <!--               <csi-buttons>-->
          <!--                 <csi-button-->
          <!--                   secondary-->
          <!--                   label="Stampa revoca assistenza"-->
          <!--                   @click="getRevokeCertificate"-->
          <!--                 />-->
          <!--               </csi-buttons>-->
          <!--             </div>-->
          <!--           </div>-->

          <div v-if="isAssistanceExpiring" class="">

            <csi-buttons>
              <csi-button
                label="Rinnova assistenza"
                @click="renewAssistance"
              />
            </csi-buttons>

          </div>
        </template>
      </template>


      <!-- MODALS -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <csi-revoke-assistance-modal
        v-model="isRevokeAssistance"
        :assistance="userInfo.asl_assistenza"
        :cf="cf"
        @revoke-assistance="revokeAssistance"
      />

      <csi-monitoring-modal
        v-model="isDeleteMonitoring"
        :cf="cf"
        :doctor="selectedMonitoredDoctor"
        :monitoring="false"
        @update-monitoring-list="updateMonitoringList"
      />

      <csi-confirm-address-modal
        v-model="isChangeAddress"
        :choosen-doctor="choosenDoctor"
        :user-info="userInfo"
        @go-to-results="goToResults"
        @combination-control="getCombinationControl"
      />

      <csi-revoke-doctor-modal
        v-model="isRevokeDoctor"
        :cf="cf"
        :doctor="doctor"
        @revoke-doctor="revokeDoctor"
        @revoke-assistance="revokeAssistance"
      />

      <csi-doctor-consent-modal
        v-model="doctorConsentModal"
        :derogation-type="derogationType"
        :doctor="choosenDoctor"
        @change-doctor="isDoctorConsent"
      />

      <csi-delete-request-modal
        v-model="isDeleteRequest"
        :cf="cf"
        :request="request"
      />
      <csi-doctor-wrong-type v-model="isWrongChoice"/>

      <!-- DIALOG DI cambio medico -->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <q-dialog
        v-model="isRequestInProgressDialog"
      >
        <div slot="title" class="q-title">Richiesta in corso</div>
        <div slot="message">
          Non è possibile inviare una nuova richiesta. <br>
          È necessario annullare prima la domanda precedente.
        </div>

        <template slot="buttons" slot-scope="props">
          <csi-buttons>
            <csi-button color="primary" label="Ok" primary @click="props.ok"/>
          </csi-buttons>
        </template>
      </q-dialog>

      <!-- DIALOG DI limite massimo di richieste-->
      <!-- ----------------------------------------------------------------------------------------------------------- -->
      <q-dialog
        v-model="isMaxLimitDialog"
      >
        <div slot="title" class="q-title">Limite massimo di operazioni</div>
        <div slot="message">
          <span>Hai recentemente effettuato un'operazione di scelta o revoca del medico. Potrai effettuarne una nuova dal {{
              newChangesDate | format
            }}.</span>
        </div>

        <template slot="buttons" slot-scope="props">
          <csi-buttons>
            <csi-button color="primary" label="Ok" primary @click="props.ok"/>
          </csi-buttons>
        </template>
      </q-dialog>

      <!--  DETTAGLIO MEDICO MONITORATO-->
      <template v-if="showMonitoredDoctorDetail">
        <csi-doctor-details v-model="showMonitoredDoctorDetail" :cf="selectedMonitoredDoctor.codice_fiscale"
                            :id="selectedMonitoredDoctor.id"/>
      </template>


    </template>

    <!-- DIALOG DI Rinnovo assistenza-->
    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <q-modal
      v-model="isOpenRenewalModal"
      :content-css="{maxWidth: '800px'}"
    >
      <!--      <q-modal-layout header-class="no-shadow no-scroll">-->
      <!--        <q-toolbar slot="header" color="transparent" text-color="primary">-->
      <!--          <q-toolbar-title></q-toolbar-title>-->
      <!--          <q-btn flat round icon="close" v-close-overlay/>-->
      <!--        </q-toolbar>-->
      <!--        <div class="csi-modal-content flex items-center ">-->
      <!--          <div class="q-px-lg q-pb-lg ">-->

      <!--            <q-alert type="warning" class="q-my-md">-->
      <!--&lt;!&ndash;              Il tuo diritto all'assistenza sanitaria scadrà il <strong>{{ assistanceEndDate }}</strong>. <br>&ndash;&gt;-->
      <!--              Desideri rinnovare l'assistenza a partire da oggi?-->
      <!--            </q-alert>-->

      <!--            <div class="row q-mt-lg justify-end items-center">-->
      <!--              <csi-buttons class="col-12">-->
      <!--                <csi-button primary color="primary" label="Rinnova assistenza" @click="renewAssistance"/>-->
      <!--              </csi-buttons>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </q-modal-layout>-->
    </q-modal>


    <!--      LOADER-->
    <csi-inner-loading :visible="isLoading || (!isData && !noUserFound)"/>
    <template v-if="noUserFound && !isLoading">
      <q-alert class="q-my-md" type="warning">
        In questo momento non è possibile reperire i tuoi dati, ti invitiamo a riprovare più tardi. <br>
        Ci scusiamo per il disagio. Se il problema persiste ti suggeriamo di contattare l'assistenza.
      </q-alert>
    </template>

  </q-page>
</template>

<script>

import {
  associationsList,
  deleteRequest, getAssociationsList, getDoctorDetails, getMonitoredDoctors,
  getRequestPdf,
  getRevokeCertificatePdf, getUserInfo
} from "@services/api/change-doctor";
import CsiCardItemPrimary from "components/global/common/CsiCardItemPrimary";
import CsiDoctorItem from "components/change-doctor/CsiDoctorItem";
import CsiCardItem from "components/global/common/CsiCardItem";
import isAfter from 'date-fns/is_after';
import isEqual from 'date-fns/is_equal';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import max from 'date-fns/max';
import startOfDay from 'date-fns/start_of_day';
import CsiRevokeAssistanceModal from "components/change-doctor/CsiRevokeAssistanceModal";
import CsiMonitoringModal from "components/change-doctor/CsiMonitoringModal";
import CsiConfirmAddressModal from "components/change-doctor/CsiConfirmAddressModal";
import CsiIconAvatarDoctor from "components/global/icons/CsiIconAvatarDoctor";
import CsiIconBase from "components/global/icons/CsiIconBase";
import CsiIconAvatarMan from 'components/global/icons/CsiIconAvatarMan'
import CsiIconAvatarWoman from "components/global/icons/CsiIconAvatarWoman";
import CsiBar from 'components/global/common/CsiBar';
import {
  getStandardAddress,
  goToAttachments,
  maxLimitDate
} from "@services/change-doctor/business-logic";
import {deepClone, format, isEmpty, last, orderBy} from "@services/global/utils";
import CsiDeleteRequestModal from "components/change-doctor/CsiDeleteRequestModal";
import {isDelegationActive} from "@store/change-doctor/getters";
import {is4XX, isStatusIn, notifyError} from "@services/api/utils";
import CsiRevokeDoctorModal from "components/change-doctor/CsiRevokeDoctorModal";
import config from "@configs/change-doctor";
import CsiDoctorWrongType from "components/change-doctor/CsiDoctorWrongType";
import CsiDoctorDetails from "components/change-doctor/CsiDoctorDetails";
import {combinationControl, getAttachment} from "../../services/api/change-doctor";
import {
  firstControlCombinationOptions, goToRequestNotAllowed,
  isDoctorDerogation,
  isTemporaryAssistance, normalizeLoccsiCities, normalizeLoccsiRoads
} from "../../services/change-doctor/business-logic";
import CsiDoctorConsentModal from "../../components/change-doctor/CsiDoctorConsentModal";
import CsiEnrollmentGuard2 from "../../components/enrollment/CsiEnrollmentGuard2";
import {isMinor} from "../../services/global/business-logic";
import {getArruolabilita} from "../../services/api/enrollment";
import {urlEnrollment} from "../../services/enrollment/business-logic";
import {getSuggestedAddress} from "../../services/api/cross";

const ASSISTANCE_EXPIRING_DAYS = 30
export default {
  name: 'PageAuthHome',
  components: {
    CsiEnrollmentGuard2,
    CsiDoctorConsentModal,
    CsiDoctorDetails,
    CsiDoctorWrongType,
    CsiRevokeDoctorModal,
    CsiDeleteRequestModal,
    CsiMonitoringModal,
    CsiRevokeAssistanceModal,
    CsiDoctorItem,
    CsiCardItem,
    CsiConfirmAddressModal,
    CsiIconAvatarDoctor,
    CsiIconAvatarMan,
    CsiIconAvatarWoman,
    CsiIconBase,
    CsiBar,
    CsiCardItemPrimary
  },
  data() {
    return {
      today: null,
      isLoading: false,
      doctor: null,
      isShowingMore: false,
      isLoadingMonitoredDoctor: false,
      showAssistance: false,
      assistanceType: null,
      hideModal: false,
      isRevokeAssistance: false,
      isDeleteMonitoring: false,
      singleMonitoredDoctor: null,
      isChangeAddress: false,
      statusRequest: {
        bgColor: '',
        msg: ''
      },
      attachments: null,
      isDraft: false,
      correctionMessage: null,
      isDeleteRequest: false,
      chatMessages: null,
      isShowingChat: false,
      delegationModal: false,
      isData: false,
      doctorAvailability: null,
      doctorAssociations: null,
      doctorRequest: null,
      idOwnDoctor: null,
      cfOwnDoctor: null,
      isRequestInProgressDialog: false,
      isCancellable: false,
      isReviewable: false,
      isRevokeDoctor: false,
      isAssistance: false,
      isError404: false,
      isWrongChoice: false,
      isOpenRenewalModal: false,
      isMaxLimitDialog: false,
      newChangesDate: null,
      maxLimitChangeOrRevoke: false,
      showMonitoredDoctorDetail: false,
      selectedMonitoredDoctor: null,
      isShowingMonitoredDoctors: false,
      isRenewing: false,
      ASSISTANCE_EXPIRING_DAYS,
      combinationControlResponse: null,
      derogationType: null,
      doctorConsentModal: false,
      isDoctorDerogation: false,
      isLoadingAddress:false
    }
  },
  computed: {
    noUserFound() {
      return isEmpty(this.userInfo)
    },
    userInfo() {
      return this.$store.getters['changeDoctor/getUserInfo']
    },
    isProduction() {
      return this.$config.global.isProduction || this.$config.global.isAlpha
    },
    userAge() {
      return this.$store.getters['changeDoctor/getUserAge']
    },
    activeDelegation() {
      return this.$store.getters["changeDoctor/getActiveDelegation"];
    },
    isDeclarationActive() {
      return (
        this.isDelegationActive &&
        isMinor(this.activeDelegation.data_nascita_delega)
      );
    },
    isDelegationActive() {
      return this.$store.getters['changeDoctor/isDelegationActive']
    },
    request() {
      if (this.userInfo)
        return this.userInfo.richiesta_cambio
    },
    isAssistanceRenewal() {
      return this.request && this.request.rinnovo_assistenza
    },

    monitoredDoctors() {
      return this.$store.getters['changeDoctor/getMonitoredDoctors']
    },
    cf() {
      return this.$store.getters['changeDoctor/getTaxCode']
    },
    isDoctor() {
      return this.userInfo.medico && this.userInfo.medico.codice_fiscale && this.userInfo.medico.id
    },

    isMonitoringDoctors() {
      return this.monitoredDoctors && this.monitoredDoctors.length > 0
    },
    isAskedAddress() {
      return this.$store.getters['changeDoctor/isAskedAddress']
    },
    classPrimary() {
      return {
        'q-py-md': !this.isOwnDoctor,
        'q-py-xl': this.isOwnDoctor
      }
    },
    isAssistanceRenewable() {
      if (!this.userInfo) return false
      let unlimitedDate = new Date(9999, 11, 31);
      let assistanceEndDate = this.userInfo.data_fine_assistenza;
      let unlimitedAssistance = isEqual(unlimitedDate, startOfDay(assistanceEndDate));
      let isTemporary = assistanceEndDate && !unlimitedAssistance
      return this.isDoctor && isTemporary
    },
    assistanceExpiringDays() {
      if (!this.userInfo) return null
      let assistanceEndDate = this.userInfo.data_fine_assistenza
      return differenceInCalendarDays(assistanceEndDate, new Date())
    },
    isAssistanceExpiring() {
      return this.isAssistanceRenewable && this.assistanceExpiringDays <= ASSISTANCE_EXPIRING_DAYS
    },
    assistanceRenewableDate(){
      if (!this.userInfo) return null
      let assistanceEndDate = this.userInfo.data_fine_assistenza

      return subDays(assistanceEndDate, ASSISTANCE_EXPIRING_DAYS)

    },
    assistanceEndDate() {
      if (this.userInfo) {
        let date = new Date(9999, 11, 31);
        let assistanceEndDate = this.userInfo.data_fine_assistenza;
        let areDatesEqual = isEqual(date, startOfDay(assistanceEndDate));
        if (!assistanceEndDate || areDatesEqual)
          return 'Illimitata';
        else
          return format(assistanceEndDate, 'DD MMM YYYY')
      }
    },
    isTemporaryAssistance() {
      return isTemporaryAssistance()
    },
    doctorRequested() {
      return this.doctorRequest
    },
    orderedChatMessages() {
      if (this.chatMessages) {
        return orderBy(this.chatMessages, ['data'])
      }
      return []
    },
    isUserLogged() {
      return this.$store.getters['global/isUserLogged'];
    },
    choosenDoctor() {
      return this.$store.getters['changeDoctor/getChoosenDoctor'];
    },
    serviceCode() {
      return this.$config.global.appServiceCodes.changeDoctor
    },
    enrollmentCode() {
      return this.activeUserEnrollmentInfo ? this.activeUserEnrollmentInfo.codice_risposta : null;
    },
    activeUserEnrollmentInfo() {
      return this.$store.getters["changeDoctor/getActiveUserEnrollmentInfo"];
    },
    assistanceCardVisibile() {
      if (this.userInfo)
        return (isAfter(new Date(), this.userInfo.data_inizio_assistenza) && (!!this.userInfo.data_fine_assistenza || !this.isDoctor))

      return false
    }
  },
  watch: {
    cf: {
      immediate: true,
      handler(val, oldVal) {
        this.$store.dispatch('changeDoctor/setUserInfo', {info: null});
        this.$store.dispatch('changeDoctor/setMaxLimitChanges', {newAllowedDate: null, isMaxLimit: null});
        this.getUserData();
        this.getEnrollment();
      }
    },
    userInfo: {
      immediate: true,
      deep: true,
      handler(val, oldVal) {
        if (val)
          this.getDefaultsValues()
      }
    }
  },
  async created() {

    this.$store.dispatch('changeDoctor/resetAllParams');
    if (isDelegationActive) {
      this.delegationModal = true
    }


  },

  methods: {
    async getEnrollment() {
      let params = {servizio: this.serviceCode};
      let httpConfig = {params, _no5XXRedirect: true};

      try {
        let {data: activeUserEnrollmentInfo} = await getArruolabilita(this.cf, httpConfig);
        this.$store.dispatch('changeDoctor/setActiveUserEnrollmentInfo', {activeUserEnrollmentInfo});
      } catch (e) {
        console.error(e);
      }
    },
    async getUserData() {
      this.isData = false;
      this.$store.dispatch('changeDoctor/setUserInfo', {info: null});
      this.isLoading = true;
      try {
        let userInfoPromise = getUserInfo(this.cf, {_no5XXRedirect: true});
        let userInfoResponse = await userInfoPromise;
        this.$store.dispatch('changeDoctor/setUserInfo', {info: userInfoResponse.data});
        // await this.getDefaultsValues()
      } catch (e) {

        if (is4XX(e)) {
        } else {
          notifyError(e, 'Non è stato possibile effettuare la ricerca.')
        }
        this.isLoading = false;
        notifyError(e, "Errore durante il caricamento dei dati del cittadino.")
      } finally {
        this.isLoading = false;
      }
    },


    async getDefaultsValues() {
      this.isLoading = true;
      await this.getMaxChangesLimit();
      await this.ifAssistance();
      await this.setRequestInfo();
      await this.getDoctorInfo();
      await this.getMonitoredDoctors();
      this.isLoading = false;
      if(this.isData)   this.$emit('page-load')
    },
    getMaxChangesLimit() {
      this.newChangesDate = null;
      this.maxLimitChangeOrRevoke = false;
      let revokeInfo = maxLimitDate(this.userInfo.data_revoca_medico);
      let assistanceDoctorInfo = maxLimitDate(this.userInfo.data_inizio_assistenza_medico);
      if (revokeInfo.isMaxLimit || assistanceDoctorInfo.isMaxLimit) {
        let newAllowedDate = max(revokeInfo.newAllowedDate, assistanceDoctorInfo.newAllowedDate);
        this.newChangesDate = startOfDay(newAllowedDate);
        this.maxLimitChangeOrRevoke = true
      }

      this.$store.dispatch('changeDoctor/setMaxLimitChanges', {
        newAllowedDate: this.newChangesDate,
        isMaxLimit: this.maxLimitChangeOrRevoke
      });
    },
    async getDoctorInfo() {
      this.doctor = null;
      this.idOwnDoctor = null;
      this.doctorAssociations = null;
      if (this.isDoctor) {
        this.idOwnDoctor = this.userInfo.medico.id;
        this.cfOwnDoctor = this.userInfo.medico.codice_fiscale;
        try {
          let doctorInfoPromise = await getDoctorDetails(this.cfOwnDoctor, {_no5XXRedirect: true});
          this.doctor = doctorInfoPromise.data;
          this.$store.dispatch('changeDoctor/setUserDoctorDetails', {doctor: this.doctor});
          let associationsResponse = await getAssociationsList(this.idOwnDoctor, {_no5XXRedirect: true});
          this.doctorAssociations = associationsResponse.data;
          //da cancellare appena abbiamo i dati corretti
          if (this.doctorAssociations === '')
            this.doctorAssociations = []

        } catch (e) {
          notifyError(e, 'Errore durante il caricamento dei dati del medico.')
        } finally {
          // this.isLoading =false;
          this.isData = true;

        }

      } else {
        this.isData = true;

        // this.isLoading =false
      }

    },
    getLastCorrectionMessage() {
      let message = null;
      if (this.chatMessages && this.chatMessages.length > 0) {
        let operatorChats = this.chatMessages.filter(c => c.cittadino == false);
        let lastChat = last(operatorChats);
        if (lastChat)
          message = lastChat.testo;
      }
      return message
    },
    async setRequestInfo() {
      if (this.request) {
        this.attachments = this.request.allegati;
        this.chatMessages = this.request.chat_operatore;
        this.isReviewable = this.request.rettificabile;
        this.isCancellable = this.request.annullabile;
        this.isDraft = this.request.bozza;
        let status = this.request.stato.id;
        this.statusRequest = this.getStatusRequest(status);
        this.correctionMessage = this.getLastCorrectionMessage();

        try {
          let doctorRequestPromise = await getDoctorDetails(this.request.medico.codice_fiscale, {_no5XXRedirect: true});
          this.doctorRequest = doctorRequestPromise.data;

        } catch (e) {
          notifyError(e, 'Non è stato possibile caricare i dettagli delle richieste in corso.')
        }
      }
    },
    getStatusRequest(status) {

      switch (status) {
        case this.$config.changeDoctor.RequestStates.BOZZA:
          return this.$config.changeDoctor.RequestStatesLabel.BOZZA;
          break;
        case this.$config.changeDoctor.RequestStates.IN_LAVORAZIONE:
          return this.$config.changeDoctor.RequestStatesLabel.IN_LAVORAZIONE;
          break;
        case this.$config.changeDoctor.RequestStates.INVIATA:
          return this.$config.changeDoctor.RequestStatesLabel.INVIATA;
          break;
        case this.$config.changeDoctor.RequestStates.IN_REVISIONE:
          return this.$config.changeDoctor.RequestStatesLabel.IN_REVISIONE;
          break;
      }

    },
    toggleShowMore() {
      this.isShowingMore = !this.isShowingMore
    },
    toggleMonitoredDoctorsCard() {
      this.isShowingMonitoredDoctors = !this.isShowingMonitoredDoctors

    },

    toggleShowChat() {
      this.isShowingChat = !this.isShowingChat
    },
    ifDoctorSelectable(doctor) {
      if (doctor.selezionabile || doctor.selezionabile_ricongiungimento_familiare || doctor.selezionabile_assistenza_temporanea) {
        if (doctor.tipologia && doctor.tipologia.id === this.$config.changeDoctor.doctorsType.PLS)
          return false;

        return true;
      }
    },
    ifAssistance() {
      // Card Assistenza visibile solo se non è presente il medico o se limitata
      if (this.userInfo) {
        if (this.userInfo.stato_assistenza === this.$config.changeDoctor.assistanceStatus.ACTIVE && this.userInfo.data_inizio_assistenza) {
          let today = new Date()
          if (isAfter(today, this.userInfo.data_inizio_assistenza))
            this.isAssistance = true;
        } else {
          this.isAssistance = false;
        }
      }

    },
    async getMonitoredDoctors() {
      try {
        let userLogged= this.$store.getters['global/user']
        let cf =  userLogged.cf
        let monitoredDoctorsResponse = await getMonitoredDoctors(cf, {_no5XXRedirect: true});
        let monitoringList = monitoredDoctorsResponse.data;
        this.$store.dispatch('changeDoctor/setMonitoredDoctors', {info: monitoringList});
      } catch (e) {
        notifyError(e, 'Errore durante il caricamento dei medici monitoriati.')
      }

    },
    showRevokeAssistanceModal() {
      this.isRevokeAssistance = true;
    },
    showRenewalAssistanceModal() {
      this.isOpenRenewalModal = true
    },
    renewAssistance() {
      if (this.maxLimitChangeOrRevoke) {
        this.isMaxLimitDialog = true;
        return
      }

      if (this.request) {
        this.isRequestInProgressDialog = true;
        return
      }
      this.$store.dispatch('changeDoctor/setChoosenDoctor', {doctor: this.doctor});
      this.$store.dispatch('changeDoctor/setAssistanceRenewal', true);
      this.isChangeAddress = true

    },
    showRevokeDoctorModal() {
      if (this.maxLimitChangeOrRevoke) {

        this.isMaxLimitDialog = true;
        return
      }
      this.isRevokeDoctor = true
    },
    revokeDoctor() {
      this.userInfo.medico = null;
      this.doctor = null;
      this.userInfo.data_revoca_medico = new Date()
      this.getMaxChangesLimit()
    },
    revokeAssistance() {
      this.userInfo.medico = null;
      this.isAssistance = false;
      this.userInfo.data_revoca_assistenza = new Date()
      this.getMaxChangesLimit()
    },
    async getRevokeCertificate() {
      let pdfPromise = await getRevokeCertificatePdf(this.cf, {_no5XXRedirect: true})
    },
    deleteMonitoringModal(doctor) {
      this.selectedMonitoredDoctor = doctor;
      this.isDeleteMonitoring = true
    },
    updateMonitoringList(id) {
      let monitoredDoctors = this.monitoredDoctors.filter(d => d.id === id);
      this.$store.dispatch('changeDoctor/setMonitoredDoctors', {info: monitoredDoctors})
    },
    async goToResults() {
    //   this.isLoadingAddress= true
    //   let normalizedAddressString = getStandardAddress(this.userInfo.domicilio.indirizzo);
    //   let city = this.userInfo.domicilio.comune
    //   let params= {indirizzo: normalizedAddressString + ' ' + city};
    //   let addressResponse = await getSuggestedAddress({ _no5XXRedirect: true, params: params});
    //   let options = addressResponse.data;
    //   if(!isEmpty(options)) options = normalizeLoccsiRoads(options);
    //   let userAddressList = options.filter(a => a.comune === city.toUpperCase());
    //   if(!userAddressList){
    //     let params= {indirizzo: city};
    //     let addressResponse = await getSuggestedAddress({ _no5XXRedirect: true, params: params});
    //     let options = addressResponse.data;
    //     if(!isEmpty(options)) options = normalizeLoccsiCities(options);
    //     userAddressList = options.filter(a => a.indirizzo === city.toUpperCase());
    //   }
    //
    // let userAddress = userAddressList[0];
    //   let roadParams= null
    //
    //   if(userAddress){
    //     roadParams = {
    //       indirizzo: userAddress.indirizzo,
    //       lat: userAddress.coordinate.coordinates[1],
    //       lon: userAddress.coordinate.coordinates[0]
    //     }
    //   }
    //   this.isLoadingAddress=false
      let route = {
        name: this.$routes.CHANGE_DOCTOR.SEARCH_DOCTOR_RESULTS.name,
        params:{onlyUserAddress:true}
      };
      this.$router.push(route);
    },
    showDoctorDetails(doctor) {
      this.selectedMonitoredDoctor = doctor;
      this.showMonitoredDoctorDetail = true
    },
    goToSearchForm() {
      this.$store.dispatch('changeDoctor/setAssistanceRenewal', false);
      this.$router.push(this.$routes.CHANGE_DOCTOR.SEARCH_DOCTOR);
    },
    chooseDoctor() {
      if (this.maxLimitChangeOrRevoke) {
        this.isMaxLimitDialog = true;
        return
      }

      if (this.request) {
        this.isRequestInProgressDialog = true;
        return
      }
      this.$store.dispatch('changeDoctor/setChoosenDoctor', {doctor: null});
      this.$store.dispatch('changeDoctor/setAssistanceRenewal', false);
      this.isChangeAddress = true
    },
    deleteRequestModal() {
      this.isDeleteRequest = true
    },
    // async deleteRequest(){
    //  this.userInfo.richiesta_cambio = null;
    // },
    changeRequest(isReview = false) {
      // let doctor = deepClone(this.doctorRequest);
      // delete doctor['ambulatori'];
      let params = {
        id: this.doctorRequest.id,
        codice_fiscale: this.doctorRequest.codice_fiscale
      };
      let query = {
        correctionMessage: this.correctionMessage,
        requestCorrection: true,
        isReview: isReview,

      };

      goToAttachments(params, query);
    },

    async getRequestPdf() {
      let pdfPromise = await getRequestPdf(this.cf, this.request.id, {_no5XXRedirect: true})
    },
    getMsgAuthorName(chat) {
      if (chat.cittadino) {
        return this.userInfo.nome
      } else {
        return 'Operatore'
      }
    },

    async downloadAttachment(attachment) {

      try {
        let response = await getAttachment(this.cf, attachment.id, {_no5XXRedirect: true})
      } catch (e) {
        notifyError(e, "Non è stato possibile scaricare l'allegato.")
      }

    },
    async getCombinationControl() {
      this.$store.dispatch('changeDoctor/resetAllRequestsOptions');
      let savecittadinanza = this.$store.getters['changeDoctor/getCitizenship'];
      let saveresidenza = this.$store.getters['changeDoctor/getNewResidence'];
      let savedomicilio = this.$store.getters['changeDoctor/getNewDomicile'];

      let cittadinanza = savecittadinanza ? savecittadinanza : this.userInfo.cittadinanza;
      let residenza = saveresidenza ? saveresidenza : this.userInfo.residenza;
      let domicilio = savedomicilio ? savedomicilio : this.userInfo.domicilio;


      let combinationParams = {
        codice_fiscale_medico: this.doctor.codice_fiscale,
        medico_altra_regione: this.userInfo.medico_altra_regione,
        cittadinanza: cittadinanza,
        domicilio: domicilio,
        residenza: residenza,
        rinnovo_assistenza: true
      };
      try {
        let combinationresponse = await combinationControl(this.cf, combinationParams, {_no5XXRedirect: true});
        this.combinationControlResponse = combinationresponse.data;

        if (this.combinationControlResponse.ammessa) {
          if (this.combinationControlResponse)
            this.$store.dispatch('changeDoctor/setCombinationControl', {combination: this.combinationControlResponse});

          //VERIFICA SE NECESSARIO IL CONSENSO MEDICO

          let isDoctorDerogationResponse = isDoctorDerogation(this.combinationControlResponse, this.choosenDoctor.tipologia.id);
          this.isDoctorDerogation = isDoctorDerogationResponse.isDerogation;
          this.derogationType = isDoctorDerogationResponse.derogationType;


          if (this.isDoctorDerogation) {
            this.doctorConsentModal = true;
          } else {
            firstControlCombinationOptions(this.combinationControlResponse, this.choosenDoctor, this.isDoctorDerogation)
          }
        } else {
          //IN caso di ricusazione del medico la richiesta viene bloccata
          let params = {}

          if (this.combinationControlResponse.ricusazione) {
            params = {refusal: true}
          } else {
            params = {notAllowed: true}
          }
          goToRequestNotAllowed(this.choosenDoctor, params)

        }
      } catch (e) {
        notifyError(e, 'Non è stato possibile effettuare la richiesta.');
      } finally {
        this.isChangeAddress = false
      }
    },
    isDoctorConsent(value) {
      if (value) {
        this.combinationControlLoading = true;
        firstControlCombinationOptions(this.combinationControlResponse, this.choosenDoctor, this.isDoctorDerogation)
      }
    },
    onActivate() {
      // let name = this.$routes.ENROLLMENT.FLOW.name;
      // let query = {};
      //
      // if (this.isDeclarationActive) {
      //   query = {
      //     minore: this.activeDelegation.codice_fiscale_delega,
      //     servizio: this.serviceCode
      //   };
      // } else if (this.isDelegationActive) {
      //   query = {
      //     d: this.activeDelegation.codice_fiscale_delega,
      //     servizio: this.serviceCode
      //   };
      // }
      //
      // this.$router.push({name, query});


      let url = urlEnrollment(this.serviceCode, this.isDeclarationActive, this.isDelegationActive, this.activeDelegation )
      window.location.assign(url);

    },
  }


}
</script>
<style lang="stylus">
.show-more-icon
  transition transform .3s ease

  &--active
    transform rotateZ(180deg)

.csi-monitored-doctors
  padding: 24px 0

.change-doctor-home-title
  margin-top: 48px;
  margin-bottom: 16px;

.for-mobile
  margin-left: 0;
  margin-top: 16px;
  text-align: left;

.csi-doctor-alert
  margin-top: 48px;

  .q-alert-side
    align-self: center
    background: none
    @media (max-width: 480px)
      display: none

.request-attachments
  .q-body-2
    word-break: break-all;

.body-color
  color: #0c0c0c;
</style>
