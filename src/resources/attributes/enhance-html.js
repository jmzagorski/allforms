import { TemplatingEngine } from 'aurelia-framework';

export class EnhanceHtmlCustomAttribute {

  static inject = [ Element, TemplatingEngine ];

  constructor(element, templateEngine) {
    this.element = element;
    this._templateEngine = templateEngine;
    this._view = null;
    this._enhanced = [];
  }

  created(owningView) {
    this._view = owningView;
  }

  valueChanged() {
    this._recurseChildren(this.element)
  }

  _recurseChildren($elem) {
    for (let i = 0; i < $elem.children.length; i++) {
      const child = $elem.children[i];

      if (this._enhanced.indexOf(child) === -1) {
        this._templateEngine.enhance({
          element: child,
          bindingContext: this._view.bindingContext,
          resources: this._view.resources
        });

        this._enhanced.push(child);
      }
    };
  }
}
