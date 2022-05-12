/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

// aggiunge alla lista dei tag quello che indica il messaggio come "visto"
import {
  BASE_PATHS,
  DOCTOR_TYPES,
  DOCTORS_ICONS,
  FACILITIES_ICONS,
  HOSPITALS_ICONS,
  SERVICES, STORES_ICONS
} from "src/services/config";
import {store} from 'src/store/index'
import {deepClone, isEmpty, orderBy} from "src/services/utils";

export const markMessageAsSeen = tag => {
  return isMessageSeen(tag) ? tag : [tag.split(','), 'noticed'].join(',')
}

// controlla se un messaggio è segnato come visto o meno
export const isMessageSeen = tag => {
  return tag && tag.includes('noticed')
}


export const normalizeLoccsiPlaces = (response) => {
  const indexOrders = {
    ind_loccsi_comuni: 1,
    ind_loccsi_strade: 2,
    ind_loccsi_civici_full: 3
  };

  // Ordiniamo i cataloghi dando più importanza a "comuni", poi "strade" ed infine "civici"
  let features = response.sort((a, b) => {
    return indexOrders[a.name] > indexOrders[b.name] ? 1 : -1;
  });
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
export const normalizeLoccsiCities = (response ) => {
  let features = response.filter(r => r.name ==='ind_loccsi_comuni');
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
export const normalizeLoccsiRoads = (response ) => {
  let features = response.filter(r => r.name ==='ind_loccsi_strade');

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

export const isPediatrician = (doctor) =>{
  let type = doctor.tipologia.id;
  return (type === DOCTOR_TYPES.PLS)
}

export const getIcon = (item) =>{
  let activeService = store.getters['getActiveService']
  let baseUrl = BASE_PATHS.icons
  let icon =''
  if(activeService === SERVICES.DOCTORS)
    icon = doctorTypeIcon(item?.medico)

  if(activeService === SERVICES.PHARMACIES)
    icon = 'farmacia.svg'

  if(activeService === SERVICES.HOSPITALS)
    icon = hospitalTypeIcon(item?.tipo_codice)

  if(activeService === SERVICES.FACILITIES)
    icon = facilityTypeIcon(item?.tipo_assistenza_codice)

  if(activeService === SERVICES.STORES)
    icon = celiacStoresTypeIcon(item?.tipo_codice)
  return baseUrl + icon
}

export const doctorTypeIcon = (doctor) =>{
  let type = doctor?.tipologia?.id;
  let gender  = doctor?.sesso;
  let iconName = ''
  if(type === DOCTOR_TYPES.PLS){
    iconName = gender==='F' ? DOCTORS_ICONS.pediatra_donna : DOCTORS_ICONS.pediatra_uomo
  }else{
    iconName = gender==='F' ? DOCTORS_ICONS.medico_donna : DOCTORS_ICONS.medico_uomo
  }
  return iconName + '.svg'
}

export const hospitalTypeIcon = (type) =>{
  let iconName = HOSPITALS_ICONS[type]

  return iconName ? iconName + '.svg' : ''
}

export const facilityTypeIcon = (type) =>{
  let iconName = FACILITIES_ICONS[type]

  return iconName ? iconName + '.svg' : ''
}

export const celiacStoresTypeIcon = (type) =>{

  let iconName = STORES_ICONS[type]

  return iconName ? iconName + '.svg' : ''
}


export const mapSuggestedAddresses = (resultsList) =>{
  let orderedAddresses = [];
  if (!isEmpty(resultsList)) {
    let addressList = deepClone(resultsList)
    let addresses = addressList.map(address => {
      return {
        label: address.indirizzo,
        value: address.id,
        coords: {
          lat: address.coordinate.coordinates[1],
          lon: address.coordinate.coordinates[0]
        },
        isGeolocated: false
      }
    });

    orderedAddresses = orderBy(addresses, ["label"]);
  }
  return Object.freeze(orderedAddresses);
}


export const errorSearchLabel = () =>{
  let service = store.getters['getActiveService']
  let msg = null
  switch(service){
    case SERVICES.PHARMACIES:
      msg = 'della farmacia'
      break
    case SERVICES.DOCTORS:
      msg = 'del medico'
      break
    case SERVICES.HOSPITALS:
      msg = 'della struttura'
      break
    case SERVICES.FACILITIES:
      msg = 'della struttura'
      break
    case SERVICES.STORES:
      msg = 'del punto vendita'
      break
  }

  return msg ? `È necessario inserire il nome ${msg} o un indirizzo valido` : ''

}


