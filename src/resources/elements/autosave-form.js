import { FormServiceProvider } from '../../elements/services/form-service-provider';

export class AutosaveFormCustomAttribute {

  static inject = [ Element, FormServiceProvider ];

  constructor(element, formServiceProvider) {
    this.element = element;
    this.$form = null;
    this._formServiceProvider = formServiceProvider;
    this._formService = null
  }

  async bind() {
    this.$form = this.element.tagName === 'FORM' ? this.element : this.element.querySelector('form');

    if (this.$form) {
      this._formService = this._formServiceProvider.provide(this.$form);
      await this._formService.populate(this.value.data);
      this._bindEvents();
    }
  }

  async valueChanged() {
    await this.bind();
  }

  _bindEvents() {
    this.$form.onsubmit = e => e.preventDefault();

    this.$form.onchange = async e => {
      const data = await this._formService.collect();

      this.element.dispatchEvent(new CustomEvent('dataready', {
        bubbles: true,
        detail: { data, api: this.$form.action  }
      }));
    };
  }
}
