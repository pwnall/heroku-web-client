import { configVarUpdatesToFetchBody } from '../src/config_var_updates';

import { expect } from 'chai';

describe('configVarUpdatesToFetchBody', () => {
  it('converts an empty options object', () => {
    expect(configVarUpdatesToFetchBody({})).to.equal('{}');
  });

  it('converts an options object that only uses strings', () => {
    const body = JSON.parse(configVarUpdatesToFetchBody({
        SUPPLEMENTAL: 'supplemental', TEST_NAME: 'test-name' }));
    expect(body).to.deep.equal({
        SUPPLEMENTAL: 'supplemental', TEST_NAME: 'test-name' });
  });

  it('converts an options object that uses numbers', () => {
    const body = JSON.parse(configVarUpdatesToFetchBody({
        SUPPLEMENTAL: 42, TEST_NAME: 'test-name' }));
    expect(body).to.deep.equal({ SUPPLEMENTAL: '42', TEST_NAME: 'test-name' });
  });
});
