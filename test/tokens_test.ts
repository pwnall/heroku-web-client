import { expect } from 'chai';

import { AccessToken, RefreshToken } from '../src/tokens';

describe('AccessToken', () => {
  let token: AccessToken;

  describe('with a non-null expiration', () => {
    beforeEach(() => {
      token = new AccessToken({
        expiresAt: 1000000, id: 'a-token-id', token: 'an-access-token',
      });
    });

    describe('#authorizationHeader', () => {
      it('serializes correctly', () => {
        expect(token.authorizationHeader()).to.equal('Bearer an-access-token');
      });
    });
    describe('#authorizationId', () => {
      it('returns the correct string', () => {
        expect(token.authorizationId()).to.equal('a-token-id');
      });
    });
    describe('#toJSON', () => {
      it('serializes correctly', () => {
        expect(token.toJSON()).to.deep.equal({
          expiresAt: 1000000, id: 'a-token-id', token: 'an-access-token',
        });
      });
    });
  });

  describe('with a null expiration', () => {
    beforeEach(() => {
      token = new AccessToken({
        expiresAt: null, id: 'a-token-id', token: 'an-access-token',
      });
    });

    describe('#toJSON', () => {
      it('serializes correctly', () => {
        expect(token.toJSON()).to.deep.equal({
          expiresAt: null, id: 'a-token-id', token: 'an-access-token',
        });
      });
    });
  });

  describe('.fromHerokuAuthorization', () => {
    it('works on a correct expiring authorization', () => {
      token = AccessToken.fromHerokuAuthorization(1000000, {
        access_token: { expires_in: 86400, token: 'an-access-token' },
        id: 'an-authorization-id',
      });
      expect(token).to.be.an.instanceOf(AccessToken);
      expect(token.toJSON()).to.deep.equal({
          expiresAt: 1086400, id: 'an-authorization-id',
          token: 'an-access-token',
      });
    });

    it('works on a correct non-expiring authorization', () => {
      token = AccessToken.fromHerokuAuthorization(1000000, {
        access_token: { expires_in: null, token: 'an-access-token' },
        id: 'an-authorization-id',
      });
      expect(token).to.be.an.instanceOf(AccessToken);
      expect(token.toJSON()).to.deep.equal({
          expiresAt: null, id: 'an-authorization-id', token: 'an-access-token',
      });
    });

    it('fails on an authorization without expires_in', () => {
      token = AccessToken.fromHerokuAuthorization(1000000, {
        access_token: { token: 'an-access-token' },
        id: 'an-authorization-id',
      });
      expect(token).to.equal(null);
    });

    it('fails on an authorization with a string expires_in', () => {
      token = AccessToken.fromHerokuAuthorization(1000000, {
        access_token: { expires_in: '86400', token: 'an-access-token' },
        id: 'an-authorization-id',
      });
      expect(token).to.equal(null);
    });

    it('fails on an authorization without a token', () => {
      token = AccessToken.fromHerokuAuthorization(1000000, {
        access_token: { expires_in: 86400 },
        id: 'an-authorization-id',
      });
      expect(token).to.equal(null);
    });
  });
});

describe('RefreshToken', () => {
  const expirationTime = Date.now() + 86400;
  let token: RefreshToken;

  beforeEach(() => {
    token = new RefreshToken({
      clientId: 'a-client-id', expiresAt: expirationTime,
      token: 'an-access-token',
    });
  });

  describe('#toJSON', () => {
    it('serializes correctly', () => {
      expect(token.toJSON()).to.deep.equal({
        clientId: 'a-client-id', expiresAt: expirationTime,
        token: 'an-access-token',
      });
    });
  });
});
