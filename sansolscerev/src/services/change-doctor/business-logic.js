/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {config} from '@plugins/config'
import isAfter from "date-fns/is_after";
import store from '@store/index'
import router from '@router'
import {routes} from "@plugins/routes";
import {extractBirthMonthPart, extractBirthYearPart, generateBirthMonthPart, getDay, MONTH_MAP,} from '@services/global/tax-code'
import getYear from 'date-fns/get_year'
import differenceInYears from 'date-fns/difference_in_years'
import isEqual from 'date-fns/is_equal';
import startOfDay from 'date-fns/start_of_day';
import {capitalizeEveryWord, hasTrueValue, isEmpty} from "@services/global/utils";
import addDays from "date-fns/add_days";
import max from "date-fns/max";
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";


//controlla se l'utente è su AURA
export const isAura = () => {
  const user = store.getters['changeDoctor/getUserInfo'];
  if(user.id_aura) return true;
  else return false
};

//controlla se l'utente è straniero e se comunitario o no
export const citizenshipInfo = () => {
  const user = store.getters['changeDoctor/getUserInfo'];
  let userCitizenship = store.getters['changeDoctor/getCitizenship'];
  if(!userCitizenship)
    userCitizenship = user.richiesta_cambio ? user.richiesta_cambio.cittadinanza : user.cittadinanza

  const italianCitizen = '100';
  let params = null;
  if(userCitizenship && userCitizenship.id){
    params = {
      nation: userCitizenship,
      isForeigner : userCitizenship.id !== italianCitizen,
      isEUCitizen : userCitizenship.comunitario
    };
  }

  return params
};


//Controlla se l'utente ha assistenza illimitata, temporanea o disattiva
export const assistanceType = () => {
  const userInfo = store.getters['changeDoctor/getUserInfo'];
  let today = Date.now();
  if(userInfo.stato_assistenza === config.changeDoctor.assistanceStatus.ACTIVE
    && userInfo.data_inizio_assistenza
    && isAfter(today,userInfo.data_inizio_assistenza)){
    if(userInfo.data_fine_assistenza && !isEqual(new Date(9999, 11, 31), startOfDay(userInfo.data_fine_assistenza))){
      if(isAfter(userInfo.data_fine_assistenza,today)){
        return config.changeDoctor.assistanceTypes.TEMPORARY
      }else{
        return config.changeDoctor.assistanceTypes.EXPIRED
      }

    }else{
      return config.changeDoctor.assistanceTypes.UNLIMITED
    }
  }
  return config.changeDoctor.assistanceTypes.NOASSISTANCE
};

//Controllo variazione asl
export const firstControlCombinationOptions = (combination, doctor, isDoctorDerogation) => {
  store.dispatch('changeDoctor/setIsDoctorDerogation', {value: isDoctorDerogation});

  const isDelegation =  store.getters['changeDoctor/isAdultDelegator'];
  store.dispatch('changeDoctor/setIsDelegation', {value: isDelegation});
  const userInfo = store.getters['changeDoctor/getUserInfo'];
  const assistanceActive =  userInfo.stato_assistenza === config.changeDoctor.assistanceStatus.ACTIVE;
  if(config.global.isDevelopment ||  config.global.isTest){
    const isTemporaryAss = isTemporaryAssistance()
    console.log('isTemporaryAssistance', isTemporaryAss)
    if (assistanceActive) {
      if (combination.variazione_asl || isTemporaryAss ) {
        console.log('combination.variazione_asl || isTemporaryAss')
        let tempAss = !combination.variazione_asl &&  isTemporaryAss
        additionalInfoControl(combination, doctor, tempAss)
      }
      else if (combination.deroga_territoriale) {
        console.log('combination.deroga_territoriale', combination.deroga_territoriale)
        let query={
          onlydt:true
        }
        goToAdditionalInformation(doctor, query)
      }
      else {
        console.log(' maximumCoverageControl(combination, doctor)')
        maximumCoverageControl(combination, doctor)
      }

    } else {
      console.log('!assistanceActive',)
      additionalInfoControl(combination, doctor, false,  userInfo.medico_altra_regione)
    }

  }else{
    if(assistanceActive){
      if(combination.variazione_asl){
        assistanceControl(combination, doctor)
      }
      else{
        if(isTemporaryAssistance()){

          let citizenInfo = citizenshipInfo();
          if(isSameAsl(combination) && !citizenInfo.isForeigner){
            maximumCoverageControl(combination, doctor)
          }else{
            goToRenewAssistance(doctor);
          }



        }
        else{
          // console.log('maximumCoverageControl');
          maximumCoverageControl(combination, doctor)
        }

      }
    }else{
      if(userInfo.medico_altra_regione)
        goDoctorAnotherRegion(doctor);
      else{
        assistanceControl(combination, doctor)
      }
    }
  }



};

export const additionalInfoControl = (combination, doctor, tempAss, anotherDoctor) => {
  let citizenInfo = citizenshipInfo();
  let sameAsl = isSameAsl(combination)
  let noAddInfo = !combination.deroga_territoriale && (sameAsl && !citizenInfo.isForeigner)


  let query = {
    addInfo: !sameAsl || !noAddInfo
  }

  if(sameAsl){
    if(combination.deroga_territoriale)
      query.onlydt = true
    if(citizenInfo.isForeigner)
      query.onlyf = true
  }

  if(tempAss){
    goToRenewAssistance(doctor, query)
  }else if(anotherDoctor){
    goDoctorAnotherRegion(doctor, query)
  }else if(noAddInfo){
    maximumCoverageControl(combination, doctor)
  }else{
    goToAdditionalInformation(doctor, query)
  }

}

export const goToRequestNotAllowed = (doctor, feedback) => {
  let params = feedback;
  let route = {
    name: routes.CHANGE_DOCTOR.REQUEST_DOCTOR_NOT_AVAILABLE.name,
    params
  };
  router.push(route);

};

// Determina se è necessario o meno il documento di revoca del medico precedente
// Questo documento è necessario quando il cittadino aveva un medico fuori regione e non ha ancora preso la residenza in piemonte
export const isPreviousDoctorRevokeRequired = () => {
  let combination = store.getters['changeDoctor/getCombinationControl'];
  let userInfo = store.getters['changeDoctor/getUserInfo'];

  let isExtraRegionDoctor = userInfo && userInfo.medico_altra_regione;
  let isNoPiedmontCitizen = combination && combination.asl_residenza && combination.asl_residenza.id === 'Extra-regione';

  return isExtraRegionDoctor && isNoPiedmontCitizen
};

//Controllo massimali
export const maximumCoverageControl = (combination, doctor,  query = {}) => {
  const attachments = store.getters['changeDoctor/getAttachmentsOptions'];
  let params= {
    id: doctor.id,
    codice_fiscale: doctor.codice_fiscale
  };
  let assType = assistanceType();
  let foreignerAttachments = store.getters['changeDoctor/getAttachmentsTypeList'];
  let isRenewTemporaryAssistance = store.getters['changeDoctor/isRenewTemporaryAssistance'];
  const isAssistanceRenewal= store.getters['changeDoctor/isAssistanceRenewal'];

  if (isPreviousDoctorRevokeRequired()){
    goToAttachments(params, query);
    return;
  }

  if(isAssistanceRenewal){
    if(hasTrueValue(attachments)){
      // console.log('goToAttachments');
      goToAttachments(params, query);
    }
    else{
      // console.log('goToConfirmRequest');
      goToConfirmRequest(params)
    }
  }else{
    if((assType === config.changeDoctor.assistanceTypes.TEMPORARY && !combination.variazione_asl && !isRenewTemporaryAssistance) ||
      isTemporaryInscription(combination) ||
      (foreignerAttachments && foreignerAttachments.assistenza_temporanea_stranieri) ||
      combination.deroga_pls
    ){
      if(doctor.disponibilita && doctor.disponibilita.selezionabile_assistenza_temporanea){
        if(hasTrueValue(attachments)){
          // console.log('goToAttachments');
          goToAttachments(params, query);
        }
        else{
          // console.log('goToConfirmRequest');
          goToConfirmRequest(params)
        }

      }else{
        goToRequestNotAllowed(doctor, {temporaryAssistance : true});
      }
    }
    else{
      if(isUserChildhood(doctor.tipologia.id)){
        //console.log('isUserChildhood');
        if(doctor.disponibilita.selezionabile_infanzia){
          if(doctor.disponibilita.selezionabile){
            if(hasTrueValue(attachments))
              goToAttachments(params, query);
            else
              goToConfirmRequest(params);
          }else{
            let isFamilyReunificationInfo = store.getters['changeDoctor/getFamilyReunionInfo'];
            if(doctor.disponibilita.selezionabile_ricongiungimento_familiare && !isFamilyReunificationInfo){
              // console.log('goToFamilyReunification');
              goToFamilyReunification(doctor);

            }else{
              goToRequestNotAllowed(doctor, {notAvailable : true});
            }
          }

        }else{

          goToRequestNotAllowed(doctor, {childhood : true});
        }
      }else{
        if(doctor.disponibilita.selezionabile){
          // console.log('SELEZIONABILE');
          if(hasTrueValue(attachments))
            goToAttachments(params, query);
          else
            goToConfirmRequest(params)
        }
        else{
          let isFamilyReunificationInfo = store.getters['changeDoctor/getFamilyReunionInfo'];
          if(doctor.disponibilita.selezionabile_ricongiungimento_familiare && !isFamilyReunificationInfo){
            // console.log('goToFamilyReunification');
            goToFamilyReunification(doctor);
            return
          }

          goToRequestNotAllowed(doctor, {notAvailable : true});
        }
      }
    }
  }


};

//VERIFICA MASSIMALE INFANZIA
export const isUserChildhood = (doctorType) =>{
  const cf = store.getters['changeDoctor/getTaxCode'];
  const userAge = store.getters['changeDoctor/getUserAge'];
  return userAge ? (userAge < 6 && doctorType === config.changeDoctor.doctorsType.PLS) : false

};

//Controllo se all'utente verrà assegnata assistenza temporanea
export const  isTemporaryInscription= (combination, foreignTemporaryAssistance = false) => {
  if(!isSameAsl(combination)){
    return true
  }else{
    let citizenInfo = citizenshipInfo();
    if(citizenInfo.isForeigner && foreignTemporaryAssistance){
      return true
    }

  return false
  }
};

//Controllo da info cittadino l'utente ha assistenza temporanea
export const isTemporaryAssistance = () => {
  let assType = assistanceType();
  return (assType === config.changeDoctor.assistanceTypes.TEMPORARY)
};

export const isSameAsl = (combination) => {
  return (combination.asl_iscrizione.id === combination.asl_domicilio.id && combination.asl_domicilio.id === combination.asl_residenza.id)
};

//Controlli assistenza
export const assistanceControl = (combination, doctor) => {
  if(isSameAsl(combination)){
    let citizenInfo = citizenshipInfo();
    if(citizenInfo.isForeigner){
      let query = {onlyf : true};
      goToAdditionalInformation(doctor , query)
    }
    else{
      maximumCoverageControl(combination, doctor)
    }

  }else{
      goToAdditionalInformation(doctor)
  }

};


//Controllo se medico selezionabile ricongiungimento
export const isDoctorOnlyFamilyReunion = (availability) => {
  return (!availability.selezionabile && availability.selezionabile_ricongiungimento_familiare)
};

//Controllo se medico selezionabile ricongiungimento
export const isDoctorDerogation = (combination, doctorType) => {

  let derogationType= null;
  if(combination.deroga_territoriale)  derogationType = config.changeDoctor.derogationType.TERRITORIALE;
  if(combination.deroga_associazione)  derogationType = config.changeDoctor.derogationType.ASSOCIAZIONE;
  if(combination.deroga_pls)  derogationType = config.changeDoctor.derogationType.PLS;
  return {
    isDerogation : (combination.deroga_territoriale || combination.deroga_associazione || combination.deroga_pls),
    derogationType : derogationType
  }
};

//Rimanda a pagina RENEW_ASSISTANCE
export const goToRenewAssistance = (doctor, query) => {
  let route = {
    params : {
      id: doctor.id,
      codice_fiscale : doctor.codice_fiscale
    },
    query:query,
    name: routes.CHANGE_DOCTOR.RENEW_ASSISTANCE.name
  };

  router.push(route);
};


// Rimanda a pagina DOCTOR_ANOTHER_REGION
export const goDoctorAnotherRegion = (doctor, query) => {
  let route = {
    params : {
      id: doctor.id,
      codice_fiscale : doctor.codice_fiscale
    },
    query:query,
    name: routes.CHANGE_DOCTOR.DOCTOR_ANOTHER_REGION.name
  };
  router.push(route);
};

//Rimanda a pagina ADDITIONAL_INFORMATION
export const goToAdditionalInformation = (doctor, query) => {
  let route = {
    name: routes.CHANGE_DOCTOR.ADDITIONAL_INFORMATION.name,
    params : {
      id: doctor.id,
      codice_fiscale : doctor.codice_fiscale
    },
    query : query,
  };
  router.push(route)
};

//Rimanda a pagina FAMILY_REUNIFICATION
export const goToFamilyReunification = (doctor) => {

  let params = {
    id: doctor.id,
    codice_fiscale : doctor.codice_fiscale
  };
  let route = {
    params : params,
    name: routes.CHANGE_DOCTOR.FAMILY_REUNIFICATION.name
  };
  router.push(route);
};



//Rimanda a pagina DOCUMENTATION_REQUIRED

export const goToAttachments = (params, query) => {
  let route = {
    name: routes.CHANGE_DOCTOR.DOCUMENTATION_REQUIRED.name,
    params: params,
    query: query
  };
  router.push(route);
};

//porta alla conferma  richiesta cambio medico
export const goToConfirmRequest = (params) =>{
    let route = {
      name: routes.CHANGE_DOCTOR.CONFIRM_DOCTOR_CHOICE.name,
      params:params
    };
    router.push(route);
};

export const isMinorUser = (birth_date) => {
  const TODAY = new Date();
 // let birthDate = new Date(birth_date);
  return differenceInYears(TODAY, birth_date)
};



//controlla disponibilità medico : Messaggi
export const availabilityDoctorMessage = (availability, type) => {
  const selectable = availability.selezionabile;
  const familyReunion = availability.selezionabile_ricongiungimento_familiare;
  const childhood = availability.selezionabile_infanzia;
  const temporaryAssistance = availability.selezionabile_assistenza_temporanea;

  if(type === config.changeDoctor.doctorsType.MMG){
      let combination = "MMG_" + booleanToBinary(selectable) + booleanToBinary(familyReunion) +  booleanToBinary(temporaryAssistance);
      return config.changeDoctor.availabilityTypesMessage_MMG[combination]
  }
  if(type === config.changeDoctor.doctorsType.PLS){
    let combination = "PLS_" + booleanToBinary(selectable) + booleanToBinary(familyReunion) + booleanToBinary(childhood) +  booleanToBinary(temporaryAssistance);
    let message = config.changeDoctor.availabilityTypesMessage_PLS[combination];
    return message ? message : null
  }


};


export const booleanToBinary = (value) => {
  let binary = value ? 1 : 0;
  return binary
};



//Primo controllo combinazione
export const combinationControlOptions = (combination) => {
  let assType = assistanceType();
  return (assType === config.changeDoctor.assistanceTypes.NOASSISTANCE || !isAura() || combination.variazione_asl)
};


//Controllo se medico altre regione
export const isDoctorAnotherRegion = () => {
  const userInfo = store.getters['changeDoctor/getUserInfo'];
  /// da capire se ci sono ancora altri controlli
  return (!isAura() && userInfo.medico_altra_regione)
};



//Controllo se ha su data per capire se ha superato numero massimo di modifiche
export const maxLimitDate = (date) =>{
  let today =new Date();
  const MAX_LIMIT_DAYS = config.global.isProduction ? 1 : -1; // VERFICA NUMERO MASSIMO DI GIORNI
  // const MAX_LIMIT_DAYS = 1; // VERFICA NUMERO MASSIMO DI GIORNI
  let newAllowedDay = null;
  let isMaxLimit =false;
  if(date){
    let revokeDate = new Date(date);
    newAllowedDay =  addDays(revokeDate, MAX_LIMIT_DAYS);
    isMaxLimit = differenceInCalendarDays(today,revokeDate) < MAX_LIMIT_DAYS
  }

  return {
    newAllowedDate : newAllowedDay,
    isMaxLimit: isMaxLimit
  }
};

//E' PRESENTE IL FILTRO SOLO PER I MEDICI DI NOVARA (208)
export const isAllowedASL = (asl) =>{
  const aslAllowedList = ['203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213' ];
  let selectedAsl = aslAllowedList.find(a => asl === a );
  return  !isEmpty(selectedAsl)
};


export const getStandardAddress = (addressString) => {
  //Tolgo la punteggiatura
  let newAddress = addressString.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
  //tolgo doppi spazi
  newAddress = newAddress.replace(/\s{2,}/g, " ");

  return newAddress
};

export const normalizeLoccsiPlaces = (responseList) => {
  const indexOrders = {
    ind_loccsi_comuni: 1,
    ind_loccsi_strade: 2,
    ind_loccsi_civici_full: 3
  };

  // Ordiniamo i cataloghi dando più importanza a "comuni", poi "strade" ed infine "civici"
    let features = responseList.sort((a, b) => {
      return indexOrders[a.name] > indexOrders[b.name] ? 1 : -1;
    });
    let places = features.reduce((out, index) => {
      let places = index.featureCollection.features.map(feature => {
           return {
             id: feature.id,
             coordinate: feature.geometry,
             indirizzo: feature.properties.loccsi_label,
             __feature: feature
           }
        });
      return [...out, ...places];
    }, []);
    if (places.length > 5) places = places.slice(0, 5);
    features = places;

  return features;

};

export const normalizeLoccsiRoads = (responseList) => {
  if(!responseList) return []
  let features = responseList.filter(r => r.name ==='ind_loccsi_strade');

  let places = features.reduce((out, index) => {
    let places = index.featureCollection.features.map(feature => {
      return {
        id: feature.id,
        coordinate: feature.geometry,
        indirizzo: feature.properties.loccsi_label,
        comune: feature.properties.comune,
        __feature: feature
      }
    });
    return [...out, ...places];
  }, []);
  if (places.length > 5) places = places.slice(0, 5);
  features = places;

  return features;

};



export const normalizeLoccsiCities = (responseList ) => {
  let features = responseList.filter(r => r.name ==='ind_loccsi_comuni');
  let places = features.reduce((out, index) => {
    let places = index.featureCollection.features.map(feature => {
      return {
        id: feature.properties.codice_istat,
        coordinate: feature.geometry,
        indirizzo: feature.properties.loccsi_label,
        __feature: feature
      }
    });
    return [...out, ...places];
  }, []);
  if (places.length > 5) places = places.slice(0, 5);
  features = places;

  return features;
};


export const isArrayLike = obj =>
  obj != null && typeof obj[Symbol.iterator] === 'function';
