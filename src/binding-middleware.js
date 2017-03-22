import { BindingSignaler } from 'aurelia-templating-resources';

export class BindingMiddleware {

  static inject = [ BindingSignaler ];

  constructor(signalar) {
    this._signalar = signalar;
  }

  listen = store => next => action => {
    next(action);

    if (action.meta && action.meta.isSignal) {
      this._signalar.signal(action.type);
    }
  }
}
