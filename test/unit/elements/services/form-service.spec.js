import { FormService } from '../../../../src/elements/services/form-service';
import $ from 'jquery';

describe('the form service', () => {
  let formDataProviderSpy;
  let otherSerices;
  let httpRequestSpy;

  it('populates the form on value changed', async done => {
    const formStr = `<form>
      <input name='d'>
      <input name='d'>
      <input name='a'>
      <input name='b.e.f.g'>
      <input name='b.e.f.g'>
      </form>`;
    const $form = $(formStr).get(0);

    const sut = new FormService($form, null, null, null)
    const data = {
      a: 1,
      b: {
        e: {
          f: {
            g: [ 5, 6 ]
          }
        }
      },
      d: [ 3, 4 ]
    }  

    await sut.populate(data);
    const $inputs = $form.querySelectorAll('input');

    expect($inputs[0].value).toEqual('3');
    expect($inputs[1].value).toEqual('4');
    expect($inputs[2].value).toEqual('1');
    expect($inputs[3].value).toEqual('5');
    expect($inputs[4].value).toEqual('6');
    done();
  });

  // INTEGRATION TEST - spec.bundle acts weird if i break this out into its own
  // folder outside of the unit
  [ { url: '/#someurl', name: 'some file'},
    [ { url: '/#someurl', name: 'some file'} ]
  ].forEach(files => {
    it('adds links for attachments', async done => {
      const formStr = `<form><input type="file" name='b'></form>`;
      const $form = $(formStr).get(0);

      const sut = new FormService($form, null, null, null)
      const data = { b: files  };
      await sut.populate(data);
      const $input = $form.querySelector('input');
      const $link = $input.nextSibling;

      expect($link).not.toEqual(null);
      expect($link.tagName).toEqual('A');
      expect($link.href).toContain('/#someurl');
      expect($link.textContent).toEqual('some file');
      done();
    });
  });

  it('calls other form service collect methods after its done', async done => {
    const formStr = `<form><input name='b'></form>`;
    const $form = $(formStr).get(0);
    const firstOther = jasmine.createSpy('1stother');
    const secondOther = jasmine.createSpy('2ndother');
    const others = [
      { populate: firstOther },
      { populate: secondOther }
    ];

    const sut = new FormService($form, null, others, null)
    const data = { b: 1 };

    firstOther.and.callFake(() => {
      const $input = $form.querySelector('input');
      expect($input.value).toEqual('1');
      expect(secondOther).not.toHaveBeenCalled();
    });

    await sut.populate(data);

    expect(firstOther.calls.count()).toEqual(1);
    expect(firstOther).toHaveBeenCalledWith($form);
    expect(secondOther.calls.count()).toEqual(1);
    expect(secondOther).toHaveBeenCalledWith($form);
    done();
  });

  it('collects the form data on submit', async done => {
    const formStr = `<form>
      <input name='d' value="1">
      <input name='d' value="2">
      <input name='a' value="3">
      <input name='b.e.f.g' value="4">
      <input name='b.e.f.g' value="5">
      </form>`;
    const $form = $(formStr).get(0);
    const appendSpy = jasmine.createSpy('append');
    const formDataProvider = jasmine.createSpy('provider').and
      .returnValue({ append: appendSpy})

    const sut = new FormService($form, formDataProvider, null, { send: () => {} });

    await sut.submit('a', 'b');

    expect(appendSpy).toHaveBeenCalledWith('d', '1');
    expect(appendSpy).toHaveBeenCalledWith('d', '2');
    expect(appendSpy).toHaveBeenCalledWith('a', '3');
    expect(appendSpy).toHaveBeenCalledWith('b.e.f.g', '4');
    expect(appendSpy).toHaveBeenCalledWith('b.e.f.g', '5');
    done();
  });

  it('calls collect on other services once its done', async done => {
    const formStr = `<form><input name='d' value="1"></form>`;
    const $form = $(formStr).get(0);
    const appendSpy = jasmine.createSpy('append');
    const formDataProvider = jasmine.createSpy('provider').and
      .returnValue({ append: appendSpy})
    const firstOther = jasmine.createSpy('1stother');
    const secondOther = jasmine.createSpy('2ndother');
    const others = [
      { collect: firstOther },
      { collect: secondOther }
    ];

    const sut = new FormService($form, formDataProvider, others, { send: () => {} });

    firstOther.and.callFake(() => {
      // only one call since there is one input
      expect(appendSpy.calls.count()).toEqual(1)
      expect(secondOther).not.toHaveBeenCalled();
    });

    await sut.submit();

    expect(firstOther.calls.count()).toEqual(1);
    expect(firstOther).toHaveBeenCalledWith($form);
    expect(secondOther.calls.count()).toEqual(1);
    expect(secondOther).toHaveBeenCalledWith($form);
    done();
  });

  // TODO how to do this since you cant mock or stub the FileList
  xit('collect input files on submit', async done => {
    done();
  });

  it('submits the data to the request service', async done => {
    const formStr = `<form></form>`;
    const $form = $(formStr).get(0);
    const formDataStub = { }; 
    const formDataProvider = jasmine.createSpy('provider').and
      .returnValue(formDataStub)
    const requestSpy = { send: jasmine.createSpy('request') };

    const sut = new FormService($form, formDataProvider, null, requestSpy);

    await sut.submit('a', 'b');

    expect(requestSpy.send).toHaveBeenCalledWith('a', 'b', formDataStub);
    done();
  });
})
