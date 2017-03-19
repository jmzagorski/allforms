/* eslint-disable */
import * as interfaces from '../domain/interfaces';

interface IElementApi {
  
  /**
   * @summary gets the element by id
   * @param {number} id the id of the element
   * @return {Promise<IElement>} a promise for the IElement object
   */
  get(id: number): Promise<IElement>;

  /**
   * @summary saves a new or existing IElement object
   * @param {IElement} element the IElement object
   * @return {Promise<IElement>} a promise for the new IElement object
   */
  save(element: IElement): Promise<Element>;
}

interface IElementTypeApi {
  
  /**
   * @summary gets all the element types
   * @return {Promise<IElementType>} a promise for the IElementType object
   */
  getAll(): Promise<IElementType>;
}

interface IFormApi {
  /**
   * @summary A call to get all the master forms for the member
   * @return {Promise<Form[]>} a promise for the IForm array
   */
  getAll(): Promise<IForm>;

  /**
   * @summary A call to save a new or existing form
   * @param {IForm} form the IForm object to save
   * @return {Promise<IForm>} a promise for the new IForm object
   */
  save(form: IForm): Promise<IForm>;
}

interface IMemberApi {
  /**
   * @summary A call to get the current member
   * @return {Promise<Member>} a promise for the current IMember object
   */
  getCurrent(): Promise<IMember>;
}

interface ITemplateApi {
  /**
   * @summary A call to get the ITemplate object
   * @param {string} formId the id of the ITemplate
   * @return {Promise<ITemplate>} a promise for the template object
   */
  get(formId: string): Promise<ITemplate>;

  /**
   * @summary add a new ITemplate object
   * @param {ITemplate} template the new ITemplate object
   * @return {Promise<ITemplate>} a promise for the template object from the server
   */
  edit(template: ITemplate): Promise<ITemplate>;

  /**
   * @summary edits an existing ITemplate object
   * @param {ITemplate} template the ITemplate object
   * @return {Promise<ITemplate>} a promise for the template object from the server
   */
  edit(template: ITemplate): Promise<ITemplate>;
  /**
   * @summary edits an existing ITemplate object
   * @param {ITemplate} template the ITemplate object
   * @return {Promise<ITemplate>} a promise for the template object from the server
   */
  edit(template: ITemplate): Promise<ITemplate>;
}
