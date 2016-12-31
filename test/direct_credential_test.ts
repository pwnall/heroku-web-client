import { expect } from 'chai';

import { DirectCredential } from '../src/direct_credential';

describe('DirectCredential', () => {
  describe('#authorizationHeader', () => {
    it('is computed correctly', () => {
      const credential = new DirectCredential({
        email: 'user@domain.com', password: 'password' });
      expect(credential.authorizationHeader()).to.equal(
          'Basic dXNlckBkb21haW4uY29tOnBhc3N3b3Jk');
    });
  });

  describe('#toJSON', () => {
    it('returns the correct values', () => {
      const credential = new DirectCredential({
        email: 'user@domain.com', password: 'password' });
      expect(credential.toJSON()).to.deep.equal({
        email: 'user@domain.com', password: 'password' });
    });
  });

  describe('.fromApiKey', () => {
    it('sets up the credential correctly', () => {
      const credential = DirectCredential.fromApiKey('some-api-key');
      expect(credential.toJSON()).to.deep.equal({
        email: '', password: 'some-api-key'});
    });
  });
});
