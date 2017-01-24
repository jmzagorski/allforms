export class HttpStub {
  constructor() {
    this.itemStub = null;
    this.url = null;
    this.config = null;
  }

  fetch(url, blob) {
    let response = this.itemStub;
    this.url = url;
    this.blob = blob;
    return new Promise((resolve) => {
      resolve({ json: () => response });
    });
  }

  configure(func) {
    this.config = func;
  }
}

export class RouterStub {
  constructor() {
    this.routes = [];
  }

  configure(handler) {
    return handler(this);
  }

  map(routes) {
    this.routes = routes;
  }

  generate(url) {
    return url;
  }
}

export class InteractStub {

  dropzone(config) {
    this.dropzoneConfig = config;
  }

  draggable(config) {
    this.draggableConfig = config;
  }
}
