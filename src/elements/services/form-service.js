import { isObject, isArray } from '../../utils';
import { standard as stdLink } from '../link';
import $ from 'jquery';

export class FormService {

  constructor($form, formDataProvider, formServices, requestApi) {
    this._$form = $form;
    this._formDataProvider = formDataProvider;
    this._otherServices = formServices || [];
    this._requestApi = requestApi;
  }

  async populate(dataObj) {
    for (let other of this._otherServices) {
      await other.populate(this._$form, dataObj);
    }

    this._populate(dataObj, '')
  }

  async submit(method, api) {
    const data = await this._collect();

    this._requestApi.send(method, api, data);
  }

  async _collect() {
    const fd = this._formDataProvider(this._$form);

    for (let other of this._otherServices) {
      await other.collect(this._$form, fd);
    }

    return fd;
  }

  _populate(obj, name) {
    for (let prop in obj) {
      if (isObject(obj[prop])) {
        this._populate(obj[prop], name + prop + '.');
        this._setFormValue(name + prop, obj[prop]);
      } else {
        this._setFormValue(name + prop, obj[prop]);
      }
    }
  }

  _setFormValue(name, obj) {
    const $elems = this._$form.querySelectorAll(`[name="${name}"]`);

    for (let i = 0; i < $elems.length; i++) {
      const $elem = $elems[i];
      const value = obj[i] || obj;

      if ($elem.type === 'file') {
        if (isArray(obj)) {
          const $links = [];
          for (var x = 0; x < obj.length; x++) {
            $links.push(this._createLinkFromFile(obj[x], $elem))
          }
        } else {
          this._createLinkFromFile(obj, $elem);
        }
      } else {
        switch ($elems[i].type) {
          case "radio": case "checkbox": 
            // FIXME assuming the value is an array
            $elems[i].checked = obj.find(o => o == $elems[i].value) ? true : false

            break;
          default:
            $elems[i].value = obj[i] || obj;

        }
      }
    }
  }

  _createLinkFromFile(file, $elem) {
    const link = stdLink();
    link.text = file.name
    link.href = file.url;
    const $link = link.create();
    $elem.parentNode.insertBefore($link, $elem.nextSibling);
  }
}
