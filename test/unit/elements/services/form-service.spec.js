import { FormService } from '../../../../src/elements/services/form-service';
import $ from 'jquery';

describe('the form service', () => {
  let formDataProviderSpy;
  let otherSerices;
  let httpRequestSpy;

  it('populates the form on value changed for complex objects', async done => {
    const formStr = `<form>
      <input name="d">
      <input name="d">
      <input name="a">
      <input name="b.e.f.g">
      <input name="b.e.f.g">
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

  [ { type: 'radio', data: { a: [ 1 ] }, expectFirst: true, expectSecond: false },
    { type: 'checkbox', data: { a: [ 1, 2 ] }, expectFirst: true, expectSecond: true },
    { type: 'checkbox', data: { a: [ 1 ] }, expectFirst: true, expectSecond: false },
  ].forEach(rec => {
    it('populates the form for radio and checkbox', async done => {
      const formStr = `<form>
      <input type=${rec.type} name="a" value="1">
      <input type=${rec.type} name="a" value="2">
      </form>`;
      const $form = $(formStr).get(0);

      const sut = new FormService($form, null, null, null)

      await sut.populate(rec.data);
      const $inputs = $form.querySelectorAll('input');

      expect($inputs[0].checked).toEqual(rec.expectFirst)
      expect($inputs[1].checked).toEqual(rec.expectSecond)
      done();
    });
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

  it('calls other form service populate methods after its done', async done => {
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
      expect(secondOther).not.toHaveBeenCalled();
    });

    secondOther.and.callFake(() => {
      const $input = $form.querySelector('input');
      expect($input.value).toEqual('');
    })

    await sut.populate(data);

    expect(firstOther.calls.count()).toEqual(1);
    expect(firstOther).toHaveBeenCalledWith($form, data);
    expect(secondOther.calls.count()).toEqual(1);
    expect(secondOther).toHaveBeenCalledWith($form, data);
    done();
  });

  it('sends the form to the form data provider', async done => {
    const form = {};
    const formDataProvider = jasmine.createSpy('provider');

    const sut = new FormService(form, formDataProvider, null, { send: () => {} });

    await sut.collect();

    expect(formDataProvider.calls.argsFor(0)[0]).toEqual(form);
    done();
  });

  it('calls collect on other services once its done', async done => {
    const form = {};
    const formDataStub = {};
    const formDataProvider = jasmine.createSpy('provider').and
      .returnValue(formDataStub);
    const firstOther = jasmine.createSpy('1stother');
    const secondOther = jasmine.createSpy('2ndother');
    const others = [
      { collect: firstOther },
      { collect: secondOther }
    ];

    const sut = new FormService(form, formDataProvider, others, { send: () => {} });

    await sut.collect();

    expect(firstOther.calls.count()).toEqual(1);
    expect(secondOther.calls.count()).toEqual(1);
    expect(firstOther).toHaveBeenCalledWith(form, formDataStub);
    expect(secondOther).toHaveBeenCalledWith(form, formDataStub);
    done();
  });

  // TODO how to do this since you cant mock or stub the FileList
  xit('collect input files on submit', async done => {
    done();
  });
})
