import { HttpClient, json } from 'aurelia-fetch-client';
import { NewInstance } from 'aurelia-framework';
import { ExcelEngine } from '../../functions/excel/engine';
import { importFetch } from '../../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars
const FORMULA = 'OUTPUT';

export class AutosaveFormCustomAttribute {

  static inject = [ Element, NewInstance.of(HttpClient), ExcelEngine ];

  constructor(element, http, xlEngine) {
    this.element = element;
    this.$form = null;
    this._xlEngine = xlEngine;
    this._http = http;
  }

  bind() {
    this.$form = this.element.tagName === 'FORM' ? this.element : this.element.querySelector('form');

    if (!this.$form) return;

    // bind the data
    for (let d in this.value.data) {
      this.$form.elements[d].value = this.value.data[d];
    }

    // hide formulas that don't have values
    for (let i = 0; i < this.$form.elements.length; i++) {
      const $elem = this.$form.elements[i];

      if ($elem.tagName === FORMULA && !$elem.value) $elem.hidden = true;
    }

    this._bindEvents();
  }

  valueChanged() {
    this.bind();
  }

  async _collectValues() {
    let valueObj = {};
    let $formulas = [];

    // collect all the non formulas in the value object
    for (let i = 0; i < this.$form.elements.length; i++) {
      const $elem = this.$form.elements[i];

      if ($elem.getAttribute('data-formula')) {
        $formulas.push($elem);
      }

      valueObj[$elem.name] = this.$form.elements[$elem.name].value;
    }

    // solve outputs last to ensure all other values are ready
    if ($formulas.length) await this._solveFormulas($formulas, valueObj);

    return valueObj;
  }

  // side affect function
  async _solveFormulas($formulas, variableObj) {
    for (let i = 0; i < $formulas.length; i++) {
      const $formula = $formulas[i];
      const fx = $formula.getAttribute('data-formula');
      const val = await this._xlEngine.parse(fx, variableObj);
      variableObj[$formula.name] = this.$form.elements[$formula.name].value = val.result;

      // use == to get null and undefined
      $formula.hidden = val.result == null ? true : false; // eslint-disable-line no-eq-null, eqeqeq
    }
  }

  _bindEvents() {
    this.$form.onsubmit = e => e.preventDefault();

    this.$form.onchange = async e => {
      if (!this.value || !this.value.action || !this.value.api) {
        throw new Error('the binding object must have an action and api property');
      }

      const data = await this._collectValues();

      return this._http.fetch(this.value.api, {
        method: this.value.action,
        body: json({ data })
      }).then(response => response.json());
    };
  }
}
