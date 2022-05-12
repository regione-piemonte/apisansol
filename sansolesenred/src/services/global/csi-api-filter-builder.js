/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

/**
 * @description
 * Classe che facilità la costruzione dei filtri per le API che rispecchiano le specifiche CSI.
 */
export class CsiApiFilterBuilder {

  _filter;

  /**
   *
   * @param filter
   */
  constructor(filter = {}){
    this._filter = {...filter};
  }


  _getField(field) {
    if (!this._filter[field]) this._filter[field] = {};
    return this._filter[field];
  }

  _setCondition(field, condition, value) {
    let _field = this._getField(field);
    _field[condition] = value;
  }

  /**
   *
   * @param field
   * @param value
   * @returns {CsiApiFilterBuilder}
   */
  eq(field, value) {
    this._setCondition(field, 'eq', value);
    return this;
  }

  /**
   *
   * @param field
   * @param value
   * @returns {CsiApiFilterBuilder}
   */
  ne(field, value) {
    this._setCondition(field, 'ne', value);
    return this;
  }

  /**
   *
   * @param field
   * @param value
   * @returns {CsiApiFilterBuilder}
   */
  gt(field, value) {
    this._setCondition(field, 'gt', value);
    return this;
  }

  /**
   *
   * @param field
   * @param value
   * @returns {CsiApiFilterBuilder}
   */
  gte(field, value) {
    this._setCondition(field, 'gte', value);
    return this;
  }

  /**
   *
   * @param field
   * @param value
   * @returns {CsiApiFilterBuilder}
   */
  lt(field, value) {
    this._setCondition(field, 'lt', value);
    return this;
  }

  /**
   *
   * @param field
   * @param value
   * @returns {CsiApiFilterBuilder}
   */
  lte(field, value) {
    this._setCondition(field, 'lte', value);
    return this;
  }

  /**
   *
   * @returns {{}}
   */
  build() {
    return {...this._filter};
    // return JSON.parse(JSON.stringify(this._filter));
  }

  /**
   *
   * @param filter
   * @param add
   * @returns {CsiApiFilterBuilder}
   */
  raw(filter, add = false) {
    this._filter = add ? {...this._filter, ...filter} : {...filter};
    return this;
  }

  /**
   *
   * @returns {CsiApiFilterBuilder}
   */
  clone() {
    return new CsiApiFilterBuilder(this._filter);
  }


}
