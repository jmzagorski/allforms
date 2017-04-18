import { SnapshotFormatter } from '../../../../../../src/resources/elements/grid/formatters/snapshot-formatter';

describe('the custom snapshot grid formatter', () => {

  it('adds a camera if there is an original id', () => {
    const sut = new SnapshotFormatter();
    const value = 'blah'
    const context = { originalId: 1 };

    const actual = sut.format(null, null, value, null, context);

    expect(actual).toEqual('<span><i class="fa fa-camera-retro"></i></span></span>&nbsp;blah');
  });

  it('does not add a camera if there is no original id', () => {
    const sut = new SnapshotFormatter();
    const value = 'blah'
    const context = { };

    const actual = sut.format(null, null, value, null, context);

    expect(actual).toEqual('blah');
  });
});
