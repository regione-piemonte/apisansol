/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {required, alphaNum} from "vuelidate/lib/validators";
import {taxCodeCin, taxCodeLength, taxCodeMonth, taxCodeName, taxCodeSurname} from "@validators/taxCode";
import getMonth from 'date-fns/get_month';

/**
 * Mixin per la validazione della persona.
 * Da usare quando hai una form che chiede i dati tipici di una persona:
 *  - Nome
 *  - Cognome
 *  - Data di nascita
 *  - Luogo di nascita
 *  - Sesso
 *  - Codice fiscale
 *
 * @type {{methods: {personValidationMixin_getSchema(): *}}}
 * @TODO: eventualmente si può rendere la generazione dello schema della validazione dinamico: prendendo in input un oggetto di configurazione e reagendo alle proprietà che contiene
 */
export const personValidationMixin = {
  methods: {
    personValidationMixin_getSchema() {
      return {
        name: {required},
        surname: {required},
        birthDate: {required},
        birthPlace: {required},
        gender: {required},
        taxCode: {
          required,
          alphaNum,
          taxCodeLength,
          taxCodeCin,
          taxCodeName: (taxCode, person) => taxCodeName(person.name)(taxCode),
          taxCodeSurname: (taxCode, person) => taxCodeSurname(person.surname)(taxCode),
          taxCodeMonth: (taxCode, person) => taxCodeMonth(person.birthDate ? getMonth(person.birthDate) : undefined)(taxCode)
        },
      };
    }
  },
};
