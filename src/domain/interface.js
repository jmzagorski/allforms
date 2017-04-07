/* eslint-disable */

/**
 * @summary interface for action object
 */
export interface IAction {
  /**
   * @property {string} type the unique type of action
   */
  type: string;

  /**
   * @property {Object} [payload] an optional object containing the action data
   */
  payload: Object;

  /**
   * @property {Boolean} [error] indicator if the action is an error
   */
  error: boolean;

  /**
   * @property {Object} [metadata] any data not associated with the payload
   */
  metadata: Object;
}

/**
 * @summary The type describing the ISnapShot
 *
 */
export interface ISnapShot {
  /**
   * @property {number} id the unique id for the snap shot
   */
  id: number;

  /**
   * @property {date} saved the date and time the snapshot was saved
   */
  saved: date;

  /**
   * @property {Object} data the key/value representation of the data
   */
  data: Object;

  /**
   * @property {number} formId the unique id of the form data
   */
  formDataId: number;
}

/**
 * @summary The type describing the IElement
 *
 */
export interface IElementType {
  /**
   * @property {number} id the unique id for the element type
   */
  id: number;

  /**
   * @property {string} builder the function to call to build the element
   */
  builder: string;

  /**
   * @property {string} caption a friendly name for the element type
   */
  caption: string;
}

/**
 * @summary the element on the IForm
 *
 */
export interface IElement {
  /**
   * @property {number} id the unique id for the element
   */
  id: number;

  /**
   * @property {string} name a unique friendly name for the form
   */
  name: string;

  /**
   * @property {string} formId the id of the master form the element is in
   */
  formId: string;
}

/**
 * @summary the master form
 */
export interface IForm {
  /**
   * @property {string} id the unique id for the form
   */
  id: string;

  /**
   * @property {string} name a friendly name for the form
   */
  name: string;

  /**
   * @property {string} summary a brief summary about the form
   */
  summary: string;

  /**
   * @property {string} summary a brief summary about the form
   */
  style: string;

  /**
   * @property {string} lastComment the comment associated with the last edit
   */
  lastComment: string;

  /**
   * @property {Date} lastEditInDays number of days ago the form was edited
   */
  lastEditInDays: date;

  /**
   * @property {string} template the html string template of the form
   */
  template: string;

  /**
   * @property {IFormFile[]} files the different paths/actions associated
   * with the master form
   */
  files: IFormFile[];
}

/**
 * @summary a path/action for a form
 *
 */
export interface IFormFile {
  /**
   * @property {string} name name of the path
   */
  name: string;

  /**
   * @property {string} lastComment the comment from the last edit on that path
   */
  lastComment: string;

  /**
   * @property {number} lastEditInDays the number of days ago for the last edit
   */
  lastEditInDays: string;

  /**
   * @property {string} icon the icon associated with the path/action
   */
  icon: string;

  /**
   * @property {number} priority the position in which the file should be shown
   * in a group of files
   */
  priority: number;
}

/**
 * @summary a user registered with the application
 *
 */
export interface IMember {
  /**
   * @property {string} loginName login name for the member;
   */
  loginName: string;
}

/**
 * @summary the interface for form that has the actual data
 */
export interface IFormData {
  /**
   * @property {number} id the id of the form instance
   */
  id: number;

  /**
   * @property {string} formId the master form id
   */
  formId: string;

  /**
   * @property {string} [name] the name associated wit the data form. Optional if
   * the master form has a auto name setup
   */
  name: string;

  /**
   * @property {string} summary short description of the data form
   */
  summary: string;

  /**
   * @property {number} [parentId] if the data form was copied, this holds the
   * reference to the parent
   */
  parentId: number;

  /**
   * @property {data} object key/value object that has the name of the input
   * field and the value
   */
  data: Object;
}
