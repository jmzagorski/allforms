import { DOM } from 'aurelia-pal';
import { deepClone } from '../../elements/services/dom-service';
import { InputListService } from '../../elements/services/input-list-service';

export class InputListCustomAttribute {

  static inject = [ Element, InputListService ];

  constructor(element, service) {
    this.element = element;
    this.service = service;
    this.$addBtn = null;

    this._clickListener = e => this._handleClick(e);
  }

  bind() {
    // if the drawer is alreaady there just attach the listener
    if (!this._hasDrawer()) this._createDrawer();

    this.$addBtn = this.$addBtn || this.element.nextSibling.querySelector('button');
    this.$addBtn.addEventListener('click', this._clickListener);
  }

  detached() {
    this.$addBtn.removeEventListener('click', this._clickListener);
  }

  _createDrawer() {
    const $drawer = DOM.createElement('div');
    const targetName = this.element.name + '-drawer';
    $drawer.id = targetName;
    $drawer.className = 'collapse'

    const $drawerBtnSpan = DOM.createElement('span');
    $drawerBtnSpan.className = 'glyphicon glyphicon-resize-vertical';

    const $drawerBtn = DOM.createElement('button');
    $drawerBtn.type = 'button';
    $drawerBtn.setAttribute('data-toggle', 'collapse');
    $drawerBtn.setAttribute('data-target', `#${targetName}`);
    $drawerBtn.className = 'btn btn-default btn-xs';
    $drawerBtn.style.backgroundColor = 'transparent';
    $drawerBtn.appendChild($drawerBtnSpan);

    this.$addBtn = DOM.createElement('button');
    this.$addBtn.type = 'button';
    this.$addBtn.textContent = '+';
    this.$addBtn.className = 'btn btn-success btn-xs';

    $drawer.append(this.$addBtn);

    this.element.parentNode.insertBefore($drawerBtn, this.element.nextSibling);
    this.element.parentNode.insertBefore($drawer, this.element.nextSibling);
  }

  _hasDrawer() {
    return this.element.nextSibling &&
      this.element.nextSibling.id === this.element.name + '-drawer'
  }

  _handleClick(e) {
    const $clone = this.service.cloneSelf(this.element);
    this.service.appendNext(this.element, $clone);
  }
}
