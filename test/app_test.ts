import { App } from '../src/app';

import { expect } from 'chai';

import { herokuApp } from './heroku_api_examples';

describe('App', () => {
  describe('.fromHerokuApp', () => {
    it('parses a correct response', () => {
      const app = App.fromHerokuApp(herokuApp);
      expect(app).to.be.an.instanceOf(App);
      expect(app.buildpackDescription).to.equal('Ruby/Rack');
      expect(app.buildStackId).to.equal(
          '01234567-89ab-cdef-0123-456789abcdef');
      expect(app.buildStackName).to.equal('heroku-18-build');
      expect(app.createdAt.toISOString()).to.equal('2012-01-01T12:00:00.000Z');
      expect(app.gitUrl).to.equal('https://git.heroku.com/example.git');
      expect(app.id).to.equal('11234567-89ab-cdef-0123-456789abcdef');
      expect(app.inMaintenanceMode).to.equal(false);
      expect(app.name).to.equal('example');
      expect(app.ownerEmail).to.equal('username@example.com');
      expect(app.ownerId).to.equal('31234567-89ab-cdef-0123-456789abcdef');
      expect(app.regionId).to.equal('41234567-89ab-cdef-0123-456789abcdef');
      expect(app.regionName).to.equal('us');
      expect(app.releasedAt.toISOString()).to.equal(
          '2012-01-02T12:00:00.000Z');
      expect(app.repositorySize).to.equal(42);
      expect(app.slugSize).to.equal(16);
      expect(app.stackId).to.equal('61234567-89ab-cdef-0123-456789abcdef');
      expect(app.stackName).to.equal('heroku-18');
      expect(app.updatedAt.toISOString()).to.equal('2012-01-03T12:00:00.000Z');
      expect(app.webUrl).to.equal('https://example.herokuapp.com/');
    });

    it('parses a newly created app', () => {
      const app = App.fromHerokuApp({
        archived_at: null,
        build_stack: {
          id: 'f9f9cbd7-2970-41ef-8db5-3df7123b041f',
          name: 'heroku-18',
        },
        buildpack_provided_description: null,
        created_at: '2016-12-21T07:39:44Z',
        git_url: 'https://git.heroku.com/hwc-test-iwymplpa-8y3nmi.git',
        id: 'ed2d86dc-2340-463a-864c-ccc7e4510820',
        maintenance: false,
        name: 'hwc-test-iwymplpa-8y3nmi',
        organization: null,
        owner: {
          email: 'apiwebclient@gmail.com',
          id: 'd0077420-81c6-4dc9-adb7-ca8904124b2e',
        },
        region: {
          id: '59accabd-516d-4f0e-83e6-6e3757701145',
          name: 'us',
        },
        released_at: '2016-12-21T07:39:45Z',
        repo_size: null,
        slug_size: null,
        space: null,
        stack: {
          id: 'f9f9cbd7-2970-41ef-8db5-3df7123b041f',
          name: 'heroku-18',
        },
        updated_at: '2016-12-21T07:39:45Z',
        web_url: 'https://hwc-test-iwymplpa-8y3nmi.herokuapp.com/',
      });

      expect(app).to.be.an.instanceOf(App);
      expect(app.buildpackDescription).to.equal(null);
      expect(app.buildStackId).to.equal(
          'f9f9cbd7-2970-41ef-8db5-3df7123b041f');
      expect(app.buildStackName).to.equal('heroku-18');
      expect(app.createdAt.toISOString()).to.equal('2016-12-21T07:39:44.000Z');
      expect(app.gitUrl).to.equal(
          'https://git.heroku.com/hwc-test-iwymplpa-8y3nmi.git');
      expect(app.id).to.equal('ed2d86dc-2340-463a-864c-ccc7e4510820');
      expect(app.inMaintenanceMode).to.equal(false);
      expect(app.name).to.equal('hwc-test-iwymplpa-8y3nmi');
      expect(app.ownerEmail).to.equal('apiwebclient@gmail.com');
      expect(app.ownerId).to.equal('d0077420-81c6-4dc9-adb7-ca8904124b2e');
      expect(app.regionId).to.equal('59accabd-516d-4f0e-83e6-6e3757701145');
      expect(app.regionName).to.equal('us');
      expect(app.releasedAt.toISOString()).to.equal(
          '2016-12-21T07:39:45.000Z');
      expect(app.repositorySize).to.equal(null);
      expect(app.slugSize).to.equal(null);
      expect(app.stackId).to.equal('f9f9cbd7-2970-41ef-8db5-3df7123b041f');
      expect(app.stackName).to.equal('heroku-18');
      expect(app.updatedAt.toISOString()).to.equal('2016-12-21T07:39:45.000Z');
      expect(app.webUrl).to.equal(
          'https://hwc-test-iwymplpa-8y3nmi.herokuapp.com/');
    });
  });

  describe('.toUrlSegment', () => {
    let app: App;
    beforeEach(() => {
      app = App.fromHerokuApp(herokuApp);
    });

    it('converts an options object with an App object', () => {
      expect(App.toUrlSegment(app)).to.equal(
          '11234567-89ab-cdef-0123-456789abcdef');
    });

    it('converts an options object with an app string', () => {
      expect(App.toUrlSegment('app-name')).to.equal('app-name');
    });
  });
});
