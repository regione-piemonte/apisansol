<!--
  - SPDX-License-Identifier: EUPL-1.2
  - Copyright Regione Piemonte - 2022
  -->

<style scoped></style>


<template>
  <div>
    <slot></slot>
<!--    <template v-if="!isPathologyException">-->
<!--      <csi-enrollment-modal-->
<!--        v-model="isEnrollModalVisible"-->
<!--        @activate="onActivate"-->
<!--        @exit="onExit"-->
<!--        value/>-->
<!--    </template>-->

  </div>

</template>


<script>
    import CsiEnrollmentModal from "components/enrollment/CsiEnrollmentModal";
    import {isNil} from "@services/global/utils";
    import {getArruolabilita, saveDoNotAskMeAgain} from "@services/api/enrollment";
    import {getResponseStatusCode} from "@services/api/utils";
    import CsiPrescriptionEnrollmentModal from "components/prescriptions/CsiPrescriptionEnrollmentModal";
    import {equalsIgnoreCase} from "../../services/global/utils";

    export default {
        name: "CsiEnrollmentGuard",
        components: {},
        data() {
            return {
                isEnrollModalVisible: false,
                //mandatory: false,
            }
        },
        computed: {
            user() {
                return this.$store.getters['global/user'];
            },
            appServices() {
                return this.$store.state.global.appServices;
            },
          isPathologyException(){
            return equalsIgnoreCase(this.serviceCode, this.$config.global.appServiceCodes.pathologyExemption)

          },
          serviceCode(){
              return this.$route.meta.appServiceCode
          }
        },
        async created() {

            this.$router.beforeEach(this.enrollmentGuardMiddleware);

        },
        watch: {
            user: {
                deep: true,
                immediate: true,
                handler(newValue, oldValue = {}) {
                    if (!isNil(newValue) && newValue.cf !== oldValue.cf) this.loadEnrollmentInfo();
                }
            }
        },
        methods: {
            enrollmentGuardMiddleware(to, from, next) {


                let canShowModal = false;
                let canChangeRoute = true
                let serviceCode = to.meta.appServiceCode
                let isEnrollmentAsked = this.$q.sessionStorage.get.item('is-enrollment-asked');
                let hasFse = this.hasFse();
                let canOpenFse = this.canOpenFse();
                let doNotAskMeAgain = this.hasUserMarkedDoNotAskMeAgain();
                let isEnrollmentSupported = this.isEnrollmentSupported(serviceCode);
                let isEnrollmentMandatory = this.isEnrollmentMandatory(serviceCode);



                // if(serviceCode=== 'promem_tst'){
                //this.mandatory=true
                // if (canOpenFse || doNotAskMeAgain) {
                //     canShowModal = true;
                //     canChangeRoute = false;
                // }


                // }
                // Quando l'arruolamento è obbligatorio
                //    - se l'utente risulta arruolabile
                //    - oppure se l'utente ha spuntato "non me lo chiedere più"
                // => mostriamo la modal ed impediamo il routing alla pagina del servizio
                //
                //    - se l'utente non è arruolabile
                // => il servizio non dovrebbe essere visibile dalla home @TODO


                if (isEnrollmentMandatory) {

                    if(serviceCode === this.$config.global.appServiceCodes.prescriptions ||
                      serviceCode === this.$config.global.appServiceCodes.pathologyExemption
                    ){
                        next(canChangeRoute);
                        return
                    }


                        if (canOpenFse || doNotAskMeAgain) {
                            canShowModal = true;
                            canChangeRoute = false;
                        }

                        //qui andrà fatto un else if per i non piemontesi con fse ciuso per mostrare un altra modale
                        // (canShowModalN2 = true, canChangeRoute = false) con modale nuova apposita

                        // Quando l'arruolamento non è obbligatorio se
                        //  - il servizio supporta l'arruolamento
                        //  - e l'utente è arruolabile
                        //  - e l'utente non ha spuntato "non me lo chiedere più"
                        //  - e non abbiamo già chiesto all'utente di arruolarsi
                        // => mostriamo la modal di arruolamento
                    }
                    else if (isEnrollmentSupported && canOpenFse && !doNotAskMeAgain && !isEnrollmentAsked) {


                        canShowModal = true;

                }


                if (canShowModal) {
                    this.isEnrollModalVisible = true;
                    this.$q.sessionStorage.set('is-enrollment-asked', true);
                }

                next(canChangeRoute);
            },
            async loadEnrollmentInfo() {

                let user = this.$store.getters['global/user'];
                let enrollmentInfo = undefined;
                if (isNil(user)) return;

                try {
                    let enrollmentResponse = await getArruolabilita(user.cf, {_no5XXRedirect: true});
                    enrollmentInfo = enrollmentResponse.data;
                } catch (error) {
                    // @TODO: cosa fare se non si ottiene risposta dal servizio di arruolabilità?
                    // Al momento lasciamo passare l'utente come se fosse arruolato
                } finally {
                    this.$store.commit('global/setEnrollmentInfo', enrollmentInfo);
                    let serviceCode = this.$route.meta && this.$route.meta.appServiceCode
                    if (!isNil(serviceCode) && this.isEnrollmentMandatory(serviceCode) && this.canOpenFse() && serviceCode !== this.$config.global.appServiceCodes.prescriptions) {
                        this.isEnrollModalVisible = true;
                    }
                }

            },
            onActivate() {
                this.isEnrollModalVisible = false;
                this.$router.push(this.$routes.ENROLLMENT.FLOW);
            },
            async onExit(doNotAskMeAgain) {
                this.isEnrollModalVisible = false
                // Se l'utente ha spuntato "non me lo chiedere più" => salviamo sul server l'informazione
                if (doNotAskMeAgain) {
                    try {
                        let response = await saveDoNotAskMeAgain(this.user.cf)
                    } catch (e) {
                        this.$q.notify({
                            type: 'negative',
                            message: `[${getResponseStatusCode(e)}] Non siamo riusciti a salvare la tua richiesta. Ti chiederemo nuovamente di aprire il FSE`
                        })
                    }
                }
            },
            isEnrollmentSupported(serviceCode) {
                let service = this.appServices.find(s => s.codice_servizio === serviceCode);
                return !isNil(service) && service.arruolabile;
            },
            isEnrollmentMandatory(serviceCode) {
                 // if (serviceCode === this.$config.global.appServiceCodes.prescriptions)
                 //     return true
                let service = this.appServices.find(s => s.codice_servizio === serviceCode);
                return !isNil(service) && service.obbligatorio_arruolamento;
            },
            // Il fascicolo sanitario può essere aparto se il servizio ci dice che può essere aperto
            canOpenFse() {
                let enrollmentInfo = this.$store.state.global.enrollmentInfo;
                if (isNil(enrollmentInfo)) return false;
                let isEnrollable = enrollmentInfo.risposta;
                return isEnrollable;
            },
            hasFse() {
                let enrollmentInfo = this.$store.state.global.enrollmentInfo;
                if (isNil(enrollmentInfo)) return false;
                let code = enrollmentInfo.codice_risposta;
                return [this.$config.enrollment.codes.FSE_APPROVED, this.$config.enrollment.codes.FSE_NOT_APPROVED].includes(code);
            },
            hasUserMarkedDoNotAskMeAgain() {
                let enrollmentInfo = this.$store.state.global.enrollmentInfo;
                if (isNil(enrollmentInfo)) return false;
                let code = enrollmentInfo.codice_risposta;
                return code === this.$config.enrollment.codes.DO_NOT_ASK_ME_AGAIN;
            }
        },
    }
</script>
