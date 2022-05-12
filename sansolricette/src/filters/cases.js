/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

import {
  capitalize as _capitalize,
  capitalizeEveryWord,
  fromCamelCase,
  toCamelCase,
} from "@services/global/utils";
import {capitalCase as _capitalCase} from 'change-case';


// '--Foo-Bar--' => '--foo-bar--'
// 'fooBar' => 'foobar'
export const toLower = s => s ? s.toLowerCase() : '';

// '--Foo-Bar--' => 'foo bar'
// 'fooBar' => 'foo bar'
export const lowerCase = s => s ?  toLower(fromCamelCase(toCamelCase(s), ' ')) : '';

// '--Foo-Bar--' => '--FOO-BAR--'
// 'fooBar' => 'FOOBAR'
export const toUpper = s => s ? s.toUpperCase() : '';

// '--Foo-Bar--' => 'FOO BAR'
// 'fooBar' => 'FOO BAR'
export const upperCase = s => s ? toUpper(fromCamelCase(toCamelCase(s), ' ')) : '';

// '--Foo-Bar--' => 'Foo Bar'
// 'fooBar' => 'Foo Bar'
export const startCase = s => s ? capitalizeEveryWord(fromCamelCase(toCamelCase(s), ' ')) : '';
// Come startCase ma è una versione migliorata che usa la libreria
export const capitalCase = s => s? _capitalCase(s) : '';


// 'FRED' => 'Fred'
// 'fred' => 'Fred'
export const capitalize = s => _capitalize(s, true);
