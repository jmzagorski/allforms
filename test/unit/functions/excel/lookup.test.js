import { xl_lookup } from '../../../../src/functions/excel'

describe('the excel lookup function', () => {

  it('calls ajax request', () => {
    /* arrange */
    const segments = ['api', '1', '2'];
    const lookupReturn = '4';

    const ajaxSpy = spyOn($, 'ajax')

    /* act */
    const actual = xl_lookup(segments);

    /* assert */
    expect(ajaxSpy).toHaveBeenCalledWith({
      cache: true,
      type: 'get',
      url: 'api/1/2'
    });
  });

});
