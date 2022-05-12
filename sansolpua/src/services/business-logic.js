/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import { date } from "quasar";

const { getDateDiff, addToDate } = date;

export const getProfile = ({ gender, birthDate }) => {
  // Se non abbiamo i dati sul sesso o sulla data di nascita => restituiamo un profilo "FALLBACK"
  if (!gender || !birthDate) return "FALLBACK";

  let now = new Date();
  let isMale = ["M", "m"].includes(gender);

  // Controlliamo l'età tenendo conto che il compleanno dell'utente di questo anno sia già passato
  // altrimenti riduciamo di 1 l'età dal momento che non ha ancora compiuto gli anni
  let age = getDateDiff(now, birthDate, "years");
  let max = addToDate(birthDate, { year: age });
  let diff = getDateDiff(now, max, "days");
  if (diff < 0) age -= 1;
  let result = isMale ? "UOMO" : "DONNA";

  if (age <= 10) result += "-BAMBINO";
  else if (age <= 24) result += "-RAGAZZO";
  else if (age <= 55) result += "-ADULTO-GIOVANE";
  else if (age <= 79) result += "-ADULTO-GRANDE";
  else result += "-ANZIANO";

  return result;
};
