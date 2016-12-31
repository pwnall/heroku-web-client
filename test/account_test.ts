import { Account } from '../src/account';

import { expect } from 'chai';

import { herokuAccount } from './heroku_api_examples';

describe('Account', () => {
  describe('.fromHerokuAccount', () => {
    it('parses a correct response', () => {
      const account = Account.fromHerokuAccount(herokuAccount);
      expect(account).to.be.an.instanceOf(Account);
      expect(account.allowsTracking).to.equal(true);
      expect(account.canAccessBeta).to.equal(false);
      expect(account.email).to.equal('username@example.com');
      expect(account.id).to.equal('01234567-89ab-cdef-0123-456789abcdef');
      expect(account.isVerified).to.equal(false);
      expect(account.name).to.equal('Tina Edmonds');
      expect(account.smsNumber).to.equal('+1 ***-***-1234');
    });

    it('parses an account with a null SMS number', () => {
      const testAccount = {...herokuAccount };
      testAccount.sms_number = null;

      const account = Account.fromHerokuAccount(testAccount);
      expect(account).to.be.an.instanceOf(Account);
      expect(account.allowsTracking).to.equal(true);
      expect(account.canAccessBeta).to.equal(false);
      expect(account.email).to.equal('username@example.com');
      expect(account.id).to.equal('01234567-89ab-cdef-0123-456789abcdef');
      expect(account.isVerified).to.equal(false);
      expect(account.name).to.equal('Tina Edmonds');
      expect(account.smsNumber).to.equal(null);
    });
  });
});
