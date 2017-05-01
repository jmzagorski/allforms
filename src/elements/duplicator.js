import stampit from  'stampit';
import map from './viewMap';
import { DOM } from 'aurelia-pal';
import { deleteTarget, deepClone } from './services/dom-service';
import { getFunctionBody } from '../utils';

export const bootstrap = stampit()
  .props({
    multiple: false,
    schema: [ map.attachment ] // FIXME - i should use its own schema or call attachmetns something else
  })
  .methods({
    duplicate($element) {
      if (!this.multiple || !$element) return $element;

      const $drawer = DOM.createElement('div');
      const targetName = $element.name + '-drawer';
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

      const $addBtn = DOM.createElement('button');
      $addBtn.type = 'button';
      $addBtn.textContent = '+';
      $addBtn.className = 'btn btn-success btn-xs';

      $drawer.append($addBtn);

      // TODO make util function insertAfter
      $element.parentNode.insertBefore($drawerBtn, $element.nextSibling);
      $element.parentNode.insertBefore($drawer, $element.nextSibling);

      // FIXME put in actual function for testing and then stringify here
      $addBtn.setAttribute('onclick',`
        const $target = this.parentNode.previousSibling;
        const clone = ${deepClone.toString()};

        const $deepClone = clone(event, $target);
        $deepClone.setAttribute('onkeydown', \`${getFunctionBody(deleteTarget)}\`);

        this.parentNode.appendChild($deepClone);`
      );

      return $element;
    }
  });
