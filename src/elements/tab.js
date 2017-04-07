import stampit from  'stampit';
import { hasDuplicates } from '../utils';
import { DOM } from 'aurelia-pal';
import map from './viewMap';

const defaults = stampit()
  .props({
    headers: '',
    groupName: null,
    context: '',
    contexts: []
  });

const metadata = stampit()
  .props({
    schema: [ map.tabs, map.contexts ]
  });

export const bootstrap = stampit()
  .init(function() {
    this.contexts = [ 'tab', 'pill' ];
  })
  .methods({
    create($element) {
      return $element ? this._mutate($element) : this._create();
    },
    _create() {
      const headers = _splitHeaders(this.headers);
      const wrapper = DOM.createElement('div');
      const list = DOM.createElement('ul');
      const contentWrapper = DOM.createElement('div');

      wrapper.id = this.groupName.toString().replace(/ /g, '');
      wrapper.appendChild(list);
      wrapper.appendChild(contentWrapper);

      contentWrapper.style.height = '100%';
      contentWrapper.style.width = '100%';
      contentWrapper.style.border = '1px solid rgb(222, 226, 227)';
      contentWrapper.className = 'tab-content';

      list.className = `nav nav-${this.context}s`;

      for (let i = 0; i < headers.length; i++) {
        const $tabHeader = _createBootstrapHeader(headers[i], this.groupName, this.context, list);
        contentWrapper.appendChild($tabHeader.content);
        list.appendChild($tabHeader.item);

        // active the first one by default
        if (i === 0) {
          $tabHeader.content.classList.add('active');
          $tabHeader.item.classList.add('active');
        }
      }

      return wrapper;
    },
    _mutate($element) {
      const headers = _splitHeaders(this.headers);
      const list = $element.querySelector('ul');
      const domHeaders = $element.querySelectorAll('li');
      const contentWrapper = $element.children[1];

      list.className = `nav nav-${this.context}s`;

      // remove headers that no longer exist in the options
      for (let i = headers.length; i < domHeaders.length; i++) {
        domHeaders[0].parentNode.removeChild(domHeaders[i]);
      }

      for (let i = 0; i < headers.length; i++) {
        let $liHeader = domHeaders[i]; // mutable!
        const optHeader = headers[i];
        const newHeader = _createBootstrapHeader(optHeader, $element.id, this.context);

        // short circut
        if ($liHeader && $liHeader.textContent === optHeader) continue

        if ($liHeader) {
          const href = $liHeader.querySelector('a').href;
          const existingContentId = href.substr(href.indexOf('#'));
          const $existingContent = $liHeader.parentNode.parentNode.querySelector(existingContentId);
          $liHeader.parentNode.replaceChild(newHeader.item, $liHeader);
          $existingContent.id = newHeader.content.id;

          if (i === 0) {
            newHeader.item.classList.add('active');
          }

        } else {
          contentWrapper.appendChild(newHeader.content);
          list.appendChild(newHeader.item);
        }
      }

      return $element;
    }
  })
  .compose(defaults, metadata);

function _createBootstrapHeader(tabHeader, id, context) {
  // make sure the id does not start with a number since this is not valid
  tabHeader = tabHeader.replace(/^[0-9]+(?=.*)/, '');
  const hrefId = (tabHeader + id).replace(/ /g, '');
  const item = DOM.createElement('li');
  const a = DOM.createElement('a');
  const content = DOM.createElement('div');

  a.setAttribute('data-toggle', context);
  a.href = `#${hrefId}`;
  a.textContent = tabHeader;

  // custom dropzone support
  content.setAttribute('dropzone', '');
  content.id = hrefId;
  content.className = 'tab-pane';

  item.appendChild(a);

  return { item, a, content };
}

function _splitHeaders(headers) {
  const headerArry = headers.split(',');

  if (hasDuplicates(headerArry.map(h => h.trim()))) {
    throw new Error('Cannot have duplicate headers');
  }

  return headerArry;
}
