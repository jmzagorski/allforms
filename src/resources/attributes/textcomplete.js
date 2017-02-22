import $ from 'jquery';
import 'jquery-textcomplete/dist/jquery.textcomplete.js';

export class TextcompleteCustomAttribute {

  static inject() { return [ Element ]; }

  constructor(element) {
    this.element = element;
  }

  bind() {
    $(this.element).textcomplete([{
      match: /\b(\w{1,})$/,
      search: (term, callback) => {
        callback(this.value.filter(word => word.indexOf(term) === 0 ? word : null));
      },
      index: 1 // which capture group to use based on the match regex
    }], {
      noResultsMessage: 'Nothing found',
      appendTo: this.element.parentNode // to support dialogs don't use default body
    });
  }
}
