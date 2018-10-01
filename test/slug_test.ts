import { Slug } from '../src/slug';

import { expect } from 'chai';

import { App } from '../src/app';
import { Client } from '../src/client';
import { DirectCredential } from '../src/direct_credential';
import { SourceBlob } from '../src/source_blob';
import { herokuSlug, herokuSourceBlobShaValue } from './heroku_api_examples';
import { appSlug, herokuAccount } from './test_data_helper';

describe('Slug', () => {
  describe('.fromHerokuSlug', () => {
    it('parses a correct response', () => {
      const slug = Slug.fromHerokuSlug(herokuSlug);
      expect(slug).to.be.an.instanceOf(Slug);
      expect(slug.blobMethod).to.equal('GET');
      expect(slug.blobUrl).to.equal('https://api.heroku.com/slugs/1234.tgz');
      expect(slug.buildpackDescription).to.equal('Ruby/Rack');
      expect(slug.checksum).to.equal(herokuSourceBlobShaValue);
      expect(slug.commitId).to.equal(
          '60883d9e8947a57e04dc9124f25df004866a2051');
      expect(slug.commitMessage).to.equal(
          'fixed a bug with API documentation');
      expect(slug.createdAt.toISOString()).to.equal(
          '2012-01-01T12:00:00.000Z');
      expect(slug.id).to.equal('01234567-89ab-cdef-0123-456789abcdef');
      expect(slug.processTypes).to.deep.equal({ web: './bin/web -p $PORT' });
      expect(slug.size).to.equal(2048);
      expect(slug.stackId).to.equal('11234567-89ab-cdef-0123-456789abcdef');
      expect(slug.stackName).to.equal('heroku-18');
      expect(slug.updatedAt.toISOString()).to.equal(
          '2012-01-02T12:00:00.000Z');
    });
  });

  describe('.toUrlSegment', () => {
    let slug: Slug;
    beforeEach(() => {
      slug = Slug.fromHerokuSlug(herokuSlug);
    });

    it('converts an options object with an Slug object', () => {
      expect(Slug.toUrlSegment(slug)).to.equal(
          '01234567-89ab-cdef-0123-456789abcdef');
    });

    it('converts an options object with an slug string', () => {
      expect(Slug.toUrlSegment('slug-id')).to.equal('slug-id');
    });
  });

  describe('#upload', () => {
    let appName: string;
    let app: App;
    let client: Client;
    let slugChecksum: string;
    beforeEach(() => {
      appName = `hwc-test-${(Date.now() + Math.random()).toString(36)}`.
          replace('.', '-');
      client = new Client();
      const credential = new DirectCredential({
        email: herokuAccount.email, password: herokuAccount.password });
      return client.login(credential).then(() => {
        return client.createApp({name: appName});
      }).then(createdApp => {
        app = createdApp;
        return SourceBlob.checksumFor(appSlug);
      }).then(checksum => {
        slugChecksum = checksum;
      });
    });
    afterEach(() => {
      return client.deleteApp(appName).then(() => {
        return client.revokeAuthorization();
      });
    });

    // TODO(pwnall): Slug uploading does not work because Heroku's S3 bucket
    //               does not accept CORS requests.
    //               https://help.heroku.com/tickets/436606
    // TODO(pwnall): When this works, test Client#createRelease and
    //               Client#waitForRelease in client_app_test.ts.
    it.skip("sets the slug's size", () => {
      let slugId: string;
      return client.createSlug(app, {
          checksum: slugChecksum,
          processTypes: { web: 'node/bin/node minimal.js' },
          stack: 'heroku-18' }).then(slug => {
        slugId = slug.id;
        console.log(slug);
        return slug.upload(appSlug);
      }).then(() => {
        return client.slug(app, slugId);
      }).then(slug => {
        console.log(slug);
        expect(slug.size).to.equal(appSlug.byteLength);
      });
    });
  });
});
