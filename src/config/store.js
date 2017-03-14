import { createStore } from 'redux';

export class Store {

  static init(container, rootReducer, initialState, middleware) {
    const store = createStore(rootReducer, initialState, middleware);
    container.registerInstance(Store, store);
  }

  getState() { }

  dispatch() { }

  subscribe() { }

  replaceReducers() { }

  observable() { }
}
