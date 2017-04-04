import { HttpClient, json } from 'aurelia-fetch-client';
import { NewInstance } from 'aurelia-framework';
import { importFetch } from '../../utils';

const fetch = importFetch(); // eslint-disable-line no-unused-vars

export class AutosaveFormCustomAttribute {

  static inject = [ Element, NewInstance.of(HttpClient) ];

  constructor(element, http) {
    this.element = element;
    this.$form = null;
    this._http = http;
  }

  bind() {

    this.$form = this.element.tagName === 'FORM' ? this.element : this.element.querySelector('form');

    if (!this.$form) return;

    this.$form.onsubmit = e => e.preventDefault();

    this.$form.onchange = e => {
      if (!this.value || !this.value.action || !this.value.api) {
        throw new Error('the binding object must have an action and api property');
      }

      const data = this._collectValues();

      return this._http.fetch(this.value.api, {
        method: this.value.action,
        body: json({ data })
      }).then(response => response.json());
    }
  }

  valueChanged(){
    this.bind();
  }

  _collectValues() {
    let valueObj = {};
    for (let i = 0; i < this.$form.elements.length; i++) {
      const elem = this.$form.elements[i];
      valueObj[elem.name] = this.$form.elements[elem.name].value;
    }

    return valueObj;
  }
}
