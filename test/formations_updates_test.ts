import { formationUpdatesToFetchBody } from '../src/formation_updates';

import { expect } from 'chai';

interface HerokuFormationUpdate {
  quantity: number;
}

describe('formationUpdatesToFetchBody', () => {
  it('converts an empty updates object', () => {
    expect(formationUpdatesToFetchBody({})).to.equal('{"updates":[]}');
  });

  it('converts an object with a single update', () => {
    const body = JSON.parse(formationUpdatesToFetchBody({
        web: { dynoType: 'standard-1X', quantity: 42 } }));
    expect(body).to.deep.equal({ updates: [{
        quantity: 42, size: 'standard-1X', type: 'web' }]});
  });

  it('converts an object with two updates', () => {
    const body = JSON.parse(formationUpdatesToFetchBody({
        web: { dynoType: 'standard-1X', quantity: 42 },
        worker: { dynoType: 'free', quantity: 16 } }));
    expect(body.updates.
        sort((a: HerokuFormationUpdate, b: HerokuFormationUpdate) => {
      return a.quantity - b.quantity;
    })).to.deep.equal([
        { quantity: 16, size: 'free', type: 'worker'},
        { quantity: 42, size: 'standard-1X', type: 'web' }]);
  });
});
