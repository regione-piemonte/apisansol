/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {
  CELIAC_STORES as CELIAC_STORES_ROUTE,
  DOCTORS as DOCTORS_ROUTE,
  HEALTH_FACILITIES as HEALTH_FACILITIES_ROUTE,
  HOSPITALS as HOSPITALS_ROUTE,
  PHARMACIES as PHARMACIES_ROUTE,
  TEST_NEW_DESIGN as TEST_NEW_DESIGN_ROUTE,
  TEST_NEW_DESIGN_DOC as TEST_NEW_DESIGN_DOC_ROUTE
} from "src/router/routes";


const HOSPITALS = {
  title:'Ospedali e case di cura',
  icon:'ospedale',
  id:'HOSPITALS',
  route: HOSPITALS_ROUTE
}

const DOCTORS = {
    title:'Medici e pediatri',
    icon:'stetoscopio',
    id:'DOCTORS',
    route: DOCTORS_ROUTE
}
const PHARMACIES = {
    title:'Farmacie',
    icon:'farmacia',
    id:'PHARMACIES',
    route: PHARMACIES_ROUTE
}
const HEALTH_FACILITIES ={
  title:'Strutture sanitarie',
  icon:'strutture-sanitarie',
  id:'FACILITIES',
  route: HEALTH_FACILITIES_ROUTE
}
const CELIAC_STORES ={
  title:'Punti vendita prodotti per celiaci',
  icon:'negozio-celiachia',
  id:'STORES',
  route: CELIAC_STORES_ROUTE
}

const TEST_NEW_DESIGN ={
    title:'SOLO TEST - Grafica',
    icon:'',
    id:'TEST',
    route: TEST_NEW_DESIGN_ROUTE
}

const TEST_NEW_DESIGN_DOC ={
    title:'SOLO TEST - MEDICI',
    icon:'',
    id:'TEST_DOCTORS',
    route: TEST_NEW_DESIGN_DOC_ROUTE
}

const NAVIGATION_TEST =[
  HOSPITALS,
  DOCTORS,
  PHARMACIES,
  HEALTH_FACILITIES,
  CELIAC_STORES
];


const NAVIGATION_PROD =[
  HOSPITALS,
  DOCTORS,
  PHARMACIES,
  HEALTH_FACILITIES,
  CELIAC_STORES
];

const getNavigation = () => {
  if (process.env.APP_IS_PROD) return NAVIGATION_PROD;
  return NAVIGATION_TEST
};

export const NAVIGATION = getNavigation();
