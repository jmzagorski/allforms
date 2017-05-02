import stampit from  'stampit';
import map from './viewMap';

export const bootstrap = stampit()
  .props({
    multiple: false,
    schema: [ map.attachment ] // FIXME - i should use its own schema or call attachmetns something else
  })
  .methods({
    duplicate($element) {
      if (!this.multiple || !$element) return $element;

      $element.setAttribute('input-list', '')

      return $element;
    }
  });
