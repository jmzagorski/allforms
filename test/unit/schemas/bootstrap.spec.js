import * as schemas from '../../../src/schemas/bootstrap.js';

describe('the bootstrap schemas', () => {
  let sut;

  it('sets the label schema', () => {
    const label = schemas.label;

    expect(label).toContain({
      key: 'type',
      type: 'select',
      default: 'default',
      options: [
        { text: 'default', value: 'default' },
        { text: 'primary', value: 'primary' },
        { text: 'success', value: 'success' },
        { text: 'info', value: 'info' },
        { text: 'danger', value: 'danger' },
        { text: 'warning', value: 'warning' }
      ]
    });
  });

  it('sets the alert schema', () => {
    const alert = schemas.alert;

    expect(alert).toContain({
      key: 'type',
      type: 'select',
      default: 'info',
      options: [
        { text: 'success', value: 'success' },
        { text: 'info', value: 'info' },
        { text: 'danger', value: 'danger' },
        { text: 'warning', value: 'warning' }
      ]
    });
  });

  it('sets the tab schema', () => {
    const tab = schemas.tab;

    expect(tab).toContain({
      key: 'type',
      type: 'select',
      default: 'tab',
      options: [
        { text: 'tab', value: 'tab' },
        { text: 'pill', value: 'pill' }
      ]});
  });
});
