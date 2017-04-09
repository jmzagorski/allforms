import { All } from 'aurelia-framework';
import { FormService } from './form-service';
import { HttpRequest } from '../../api/http-request';

export class FormServiceProvider {

  static inject = [ All.of('FormServices') ];

  constructor(formServices) {
    this._formServices = formServices;
  }

  provide($form) {
    return new FormService(
      $form,
      () => new window.FormData(),
      this._formServices,
      new HttpRequest(() => new window.XMLHttpRequest())
    );
  }
}
