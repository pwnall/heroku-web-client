import { Client } from '../src/client';

import { assert, expect } from 'chai';

import { Account } from '../src/account';
import { Addon } from '../src/addon';
import { App } from '../src/app';
import { DirectCredential } from '../src/direct_credential';
import { HerokuError } from '../src/error';
import { Plan } from '../src/plan';
import { Region } from '../src/region';
import { Stack } from '../src/stack';
import { AccessToken } from '../src/tokens';
import { herokuAccount } from './test_data_helper';

describe('Client', () => {
  let client: Client;

  beforeEach(() => {
    client = new Client();
  });

  describe('#login', () => {
    it('sets and yields token when given valid credentials', () => {
      const credential = new DirectCredential({
        email: herokuAccount.email, password: herokuAccount.password });
      return client.login(credential).then((token: AccessToken) => {
        expect(token).to.be.an.instanceOf(AccessToken);
        expect(token.toJSON().token).to.be.a('string');
        return client.revokeAuthorization();
      }).then((success) => {
        expect(success).to.equal(true);
      });
    });

    it('rejects with HerokuError when given invalid credentials', () => {
      const credential = new DirectCredential({
        email: herokuAccount.email, password: 'invalid password' });
      return client.login(credential).catch((error: HerokuError) => {
        expect(error).to.be.an.instanceOf(HerokuError);
        expect(error.id).to.equal('unauthorized');
      });
    });
  });

  describe('with a valid token', () => {
    beforeEach(() => {
      const credential = new DirectCredential({
        email: herokuAccount.email, password: herokuAccount.password });
      return client.login(credential);
    });
    afterEach(() => {
      return client.revokeAuthorization();
    });

    describe('#account', () => {
      it('gets an Account with the correct email', () => {
        return client.account().then((account: Account) => {
          expect(account.email).to.equal(herokuAccount.email);
        });
      });
    });

    describe('#apps', () => {
      let appName: string;
      beforeEach(() => {
        appName = `hwc-test-${(Date.now() + Math.random()).toString(36)}`.
            replace('.', '-');
        return client.createApp({name: appName});
      });
      afterEach(() => client.deleteApp(appName));

      it('lists a newly created app via #createApp', () => {
        return client.apps().then((apps: App[]) => {
          expect(apps.length).to.be.greaterThan(0);
          assert(apps.find((app: App) => app.name === appName));
        });
      });
    });

    describe('#createApp', () => {
      let appName: string;
      beforeEach(() => {
        appName = `hwc-test-${(Date.now() + Math.random()).toString(36)}`.
            replace('.', '-');
      });
      afterEach(() => client.deleteApp(appName));

      it('creates an app that shows up in the #apps list', () => {
        return client.createApp({
            name: appName, region: 'us', stack: 'cedar-14'}).then((app) => {
          expect(app.name).to.equal(appName);
          expect(app.regionName).to.equal('us');
          expect(app.stackName).to.equal('cedar-14');

          return client.apps();
        }).then((apps) => {
          expect(apps.length).to.be.greaterThan(0);
          assert(apps.find((app: App) => app.name === appName));
        });
      });

      it('creates an app whose status can be obtained by #app', () => {
        let appId: string;
        return client.createApp({
            name: appName, region: 'us', stack: 'cedar-14'}).then((app) => {
          expect(app.name).to.equal(appName);
          expect(app.regionName).to.equal('us');
          expect(app.stackName).to.equal('cedar-14');

          appId = app.id;
          return client.app(app.id);
        }).then((app) => {
          expect(app.id).to.equal(appId);
          expect(app.name).to.equal(appName);
          expect(app.regionName).to.equal('us');
          expect(app.stackName).to.equal('cedar-14');
        });
      });
    });

    describe('#deleteApp', () => {
      let appName: string;
      let createdApp: App;
      beforeEach(() => {
        appName = `hwc-test-${(Date.now() + Math.random()).toString(36)}`.
            replace('.', '-');
        return client.createApp({name: appName}).then((app) => {
          createdApp = app;
        });
      });

      describe('with a name', () => {
        it('deletes the app so it does not show up on the apps list', () => {
          return client.deleteApp(appName).then((deletedApp) => {
            expect(deletedApp.name).to.equal(appName);
            expect(deletedApp.id).to.equal(createdApp.id);
          }).then(() => {
            return client.apps();
          }).then((apps) => {
            assert(!apps.find((app: App) => app.name === appName));
          });
        });
      });
      describe('with an App', () => {
        it('deletes the app so it does not show up on the apps list', () => {
          return client.deleteApp(createdApp).then((deletedApp) => {
            expect(deletedApp.name).to.equal(appName);
            expect(deletedApp.id).to.equal(createdApp.id);
          }).then(() => {
            return client.apps();
          }).then((apps) => {
            assert(!apps.find((app: App) => app.name === appName));
          });
        });
      });
    });

    describe('#regions', () => {
      it('obtains a non-empty array of regions including the US', () => {
        return client.regions().then((regions: Region[]) => {
          expect(regions.length).to.be.greaterThan(0);
          assert(regions.find((region: Region) => region.name === 'us'));
        });
      });
    });

    describe('#stacks', () => {
      it('obtains a non-empty array of stacks including cedar-14', () => {
        return client.stacks().then((stacks: Stack[]) => {
          expect(stacks.length).to.be.greaterThan(0);
          assert(stacks.find((stack: Stack) => stack.name === 'cedar-14'));
        });
      });
    });
  });

  describe('without any token', () => {
    describe('#addon', () => {
      it('obtains information about postgresql', () => {
        return client.addon('heroku-postgresql').then((addon) => {
          expect(addon.name).to.equal('heroku-postgresql');
        });
      });
    });

    describe('#addons', () => {
      it('obtains a non-empty array of add-ons including postgresql', () => {
        return client.addons().then((addons: Addon[]) => {
          expect(addons.length).to.be.greaterThan(0);
          assert(addons.find((addon: Addon) =>
              addon.name === 'heroku-postgresql'));
        });
      });
    });

    describe('#plans', () => {
      it('obtains an array of plans for postgresql w/ a free plan', () => {
        return client.plans('heroku-postgresql').then((plans: Plan[]) => {
          expect(plans.length).to.be.greaterThan(0);
          assert(plans.find((plan) => plan.priceCents === 0));
        });
      });
    });
  });
});
