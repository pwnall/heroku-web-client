import { Client } from '../src/client';

import { assert, expect } from 'chai';

import { App } from '../src/app';
import { Attachment } from '../src/attachment';
import { Build } from '../src/build';
import { DirectCredential } from '../src/direct_credential';
import { Release } from '../src/release';
import { SourceBlob } from '../src/source_blob';
import { appSlug, herokuAccount, testApp } from './test_data_helper';

describe('Client', () => {
  let client: Client;

  beforeEach(() => {
    client = new Client();
  });

  describe('with an existing application', () => {
    let appName: string;
    let app: App;
    beforeEach(() => {
      appName = `hwc-test-${(Date.now() + Math.random()).toString(36)}`.
          replace('.', '-');
      const credential = new DirectCredential({
        email: herokuAccount.email, password: herokuAccount.password });
      return client.login(credential).then(() => {
        return client.createApp({name: appName});
      }).then((createdApp) => {
        app = createdApp;
      });
    });
    afterEach(() => {
      return client.deleteApp(appName).then(() => {
        return client.revokeAuthorization();
      });
    });

    describe('#app', () => {
      it('returns information about the application', () => {
        return client.app(app.id).then((returnedApp) => {
          expect(returnedApp.id).to.equal(app.id);
          expect(returnedApp.name).to.equal(appName);
          expect(returnedApp.regionId).to.equal(app.regionId);
          expect(returnedApp.stackId).to.equal(app.stackId);
        });
      });
    });

    describe('#createAttachment', () => {
      it('creates an attachment that can be inspected by #attachment', () => {
        let attachmentId: string;
        return client.createAttachment(app, {
          plan: 'heroku-postgresql:hobby-dev',
        }).then((attachment) => {
          expect(attachment.addonName).to.equal('heroku-postgresql');
          expect(attachment.appId).to.equal(app.id);
          expect(attachment.appName).to.equal(app.name);
          expect(attachment.planName).to.equal('heroku-postgresql:hobby-dev');

          attachmentId = attachment.id;
          return client.attachment(app.id, attachmentId);
        }).then((attachment) => {
          expect(attachment.addonName).to.equal('heroku-postgresql');
          expect(attachment.appId).to.equal(app.id);
          expect(attachment.appName).to.equal(app.name);
          expect(attachment.id).to.equal(attachmentId);
          expect(attachment.planName).to.equal('heroku-postgresql:hobby-dev');
        });
      });

      it('creates an attachment that shows up in #attachments', () => {
        let attachmentId: string;
        return client.createAttachment(app, {
          plan: 'heroku-postgresql:hobby-dev',
        }).then((attachment) => {
          expect(attachment.addonName).to.equal('heroku-postgresql');
          expect(attachment.appId).to.equal(app.id);
          expect(attachment.appName).to.equal(app.name);
          expect(attachment.planName).to.equal('heroku-postgresql:hobby-dev');

          attachmentId = attachment.id;
          return client.attachments(app.id);
        }).then((attachments) => {
          expect(attachments.length).to.be.greaterThan(0);
          assert(attachments.find((attachment: Attachment) => {
            return attachment.id === attachmentId;
          }));
        });
      });

      it('creates an attachment that settles after #waitForAttachment', () => {
        let attachmentId: string;
        return client.createAttachment(app, {
          plan: 'heroku-postgresql:hobby-dev',
        }).then((attachment) => {
          expect(attachment.addonName).to.equal('heroku-postgresql');
          expect(attachment.appId).to.equal(app.id);
          expect(attachment.appName).to.equal(app.name);
          expect(attachment.planName).to.equal('heroku-postgresql:hobby-dev');

          attachmentId = attachment.id;
          return client.waitForAttachment(app.id, attachmentId);
        }).then((attachment) => {
          expect(attachment.addonName).to.equal('heroku-postgresql');
          expect(attachment.appId).to.equal(app.id);
          expect(attachment.appName).to.equal(app.name);
          expect(attachment.id).to.equal(attachmentId);
          expect(attachment.planName).to.equal('heroku-postgresql:hobby-dev');
          expect(attachment.state).to.equal('provisioned');
        });
      });
    });

    describe('#deleteAttachment', () => {
      let attachment: Attachment;
      beforeEach(() => {
        return client.createAttachment(app, {
          plan: 'heroku-postgresql:hobby-dev',
        }).then((createdAttachment) => {
          attachment = createdAttachment;
        });
      });

      it('removes the attachment from the #attachments list', () => {
        return client.deleteAttachment(app, attachment).
            then((deletedAttachment) => {
          expect(deletedAttachment.addonName).to.equal('heroku-postgresql');
          expect(deletedAttachment.addonId).to.equal(attachment.addonId);
          expect(deletedAttachment.appId).to.equal(app.id);
          expect(deletedAttachment.appName).to.equal(app.name);
          expect(deletedAttachment.id).to.equal(attachment.id);
          expect(deletedAttachment.planName).to.equal(
              'heroku-postgresql:hobby-dev');

          return client.attachments(app);
        }).then((attachments) => {
          expect(attachments.length).to.deep.equal(0);
        });
      });
    });

    describe('#createBuild', () => {
      const buildpackUrls =
          ['https://github.com/heroku/heroku-buildpack-nodejs'];
      let sourceBlob: SourceBlob;
      beforeEach(() => {
        sourceBlob = new SourceBlob({
            checksum: `SHA256:${testApp.sha256}`, url: testApp.url,
            version: 'v1.0.42' });
      });

      it('creates a build that can be inspected by #build', () => {
        let buildId: string;
        return client.createBuild(app, {
            buildpackUrls: buildpackUrls, sourceBlob: sourceBlob }).
            then((build) => {
          expect(build.appId).to.equal(app.id);
          // It is tempting to test the buildpackUrls property here as well.
          // It turns out that the buildpack URLs are set to null right after
          // the build's creation.
          expect(build.sourceBlob).to.deep.equal(sourceBlob);
          expect(build.userEmail).to.equal(herokuAccount.email);

          buildId = build.id;
          return client.build(app.id, buildId);
        }).then((build) => {
          expect(build.appId).to.equal(app.id);
          expect(build.id).to.equal(buildId);
          expect(build.sourceBlob).to.deep.equal(sourceBlob);
          expect(build.userEmail).to.equal(herokuAccount.email);
        });
      });

      it('creates a build that shows up in #builds output', () => {
        let buildId: string;
        return client.createBuild(app, {
            buildpackUrls: buildpackUrls, sourceBlob: sourceBlob }).
            then((build) => {
          expect(build.appId).to.equal(app.id);
          expect(build.sourceBlob).to.deep.equal(sourceBlob);
          expect(build.userEmail).to.equal(herokuAccount.email);

          buildId = build.id;
          return client.builds(app.id);
        }).then((builds: Build[]) => {
          expect(builds.length).to.be.greaterThan(0);
          assert(builds.find((build: Build) => build.id === buildId));
        });
      });

      it('creates a build that settles after #waitForBuild', () => {
        let buildId: string;
        return client.createBuild(app, {
            buildpackUrls: buildpackUrls, sourceBlob: sourceBlob }).
            then((build) => {
          expect(build.appId).to.equal(app.id);
          expect(build.sourceBlob).to.deep.equal(sourceBlob);
          expect(build.userEmail).to.equal(herokuAccount.email);

          buildId = build.id;
          return client.waitForBuild(app, build);
        }).then((build) => {
          expect(build.appId).to.equal(app.id);
          expect(build.buildpackUrls).to.deep.equal(buildpackUrls);
          expect(build.id).to.equal(buildId);
          expect(build.sourceBlob).to.deep.equal(sourceBlob);
          expect(build.status).to.equal('succeeded');
          expect(build.userEmail).to.equal(herokuAccount.email);
        });
      });

      it('creates a build whose release works with #release', () => {
        let releaseId: string;
        return client.createBuild(app, {
            buildpackUrls: buildpackUrls, sourceBlob: sourceBlob }).
            then((build) => {
          return client.waitForBuild(app, build);
        }).then((build) => {
          releaseId = build.releaseId;
          return client.release(app, releaseId);
        }).then((release) => {
          expect(release.appId).to.equal(app.id);
          expect(release.appName).to.equal(appName);
          expect(release.current).to.equal(true);
          expect(release.id).to.equal(releaseId);
          expect(release.status).to.equal('succeeded');
          expect(release.userEmail).to.equal(herokuAccount.email);
        });
      });

      it('creates a build whose release shows up in #releases', () => {
        let releaseId: string;
        return client.createBuild(app, {
            buildpackUrls: buildpackUrls, sourceBlob: sourceBlob }).
            then((build) => {
          return client.waitForBuild(app, build);
        }).then((build) => {
          releaseId = build.releaseId;
          return client.releases(app);
        }).then((releases) => {
          expect(releases.length).to.be.greaterThan(0);
          assert(releases.find((release: Release) => {
            return release.id === releaseId;
          }));
        });
      });
    });

    describe('#updateFormations', () => {
      const buildpackUrls =
          ['https://github.com/heroku/heroku-buildpack-nodejs'];
      beforeEach(() => {
        const sourceBlob = new SourceBlob({
            checksum: `SHA256:${testApp.sha256}`, url: testApp.url,
            version: 'v1.0.42' });
        return client.createBuild(app, {
            buildpackUrls: buildpackUrls, sourceBlob: sourceBlob }).
            then((build) => {
          return client.waitForBuild(app, build);
        });
      });

      it('updates get reflected in the #formations list', () => {
        return client.updateFormations(app, {
          web: { dynoType: 'Free', quantity: 0 },
        }).then((formations) => {
          expect(formations.length).to.equal(1);
          const formation = formations[0];
          expect(formation.appId).to.equal(app.id);
          expect(formation.appName).to.equal(appName);
          expect(formation.command).to.equal('npm start');
          expect(formation.dynoType).to.equal('Free');
          expect(formation.processType).to.equal('web');
          expect(formation.quantity).to.equal(0);

          return client.updateFormations(app, {
            web: { dynoType: 'Free', quantity: 1 },
          });
        }).then((formations) => {
          expect(formations.length).to.equal(1);
          const formation = formations[0];
          expect(formation.appId).to.equal(app.id);
          expect(formation.appName).to.equal(appName);
          expect(formation.command).to.equal('npm start');
          expect(formation.dynoType).to.equal('Free');
          expect(formation.processType).to.equal('web');
          expect(formation.quantity).to.equal(1);
        });
      });
    });

    describe('#createSlug', () => {
      let slugChecksum: string;
      beforeEach(() => {
        return SourceBlob.checksumFor(appSlug).then((checksum) => {
          slugChecksum = checksum;
        });
      });

      it('creates a slug that can be inspected by #slug', () => {
        let slugId: string;
        return client.createSlug(app, {
            buildpackDescription: 'heroku-web-test raw slug',
            checksum: slugChecksum,
            commitId: 'a16e5c17a52a04fb9e308a0f92e707731a7ce287',
            commitMessage: 'Initial commit.',
            processTypes: { web: 'node/bin/node minimal.js' },
            stack: 'cedar-14' }).then((slug) => {
          expect(slug.buildpackDescription).to.equal(
              'heroku-web-test raw slug');
          expect(slug.checksum).to.equal(slugChecksum);
          expect(slug.commitId).to.equal(
              'a16e5c17a52a04fb9e308a0f92e707731a7ce287');
          expect(slug.commitMessage).to.equal('Initial commit.');
          expect(slug.processTypes).to.deep.equal({
              web: 'node/bin/node minimal.js' });
          expect(slug.stackName).to.equal('cedar-14');

          slugId = slug.id;
          return client.slug(app.id, slugId);
        }).then((slug) => {
          expect(slug.buildpackDescription).to.equal(
              'heroku-web-test raw slug');
          expect(slug.checksum).to.equal(slugChecksum);
          expect(slug.commitId).to.equal(
              'a16e5c17a52a04fb9e308a0f92e707731a7ce287');
          expect(slug.commitMessage).to.equal('Initial commit.');
          expect(slug.id).to.equal(slugId);
          expect(slug.processTypes).to.deep.equal({
              web: 'node/bin/node minimal.js' });
          expect(slug.stackName).to.equal('cedar-14');
        });
      });
    });

    describe('#updateConfigVars', () => {
      it('creates variables that show up in #configVars', () => {
        return client.updateConfigVars(app, {
          RESOURCE: 'pseudo.credential',
          TEST_NAME: 'heroku-web-client',
        }).then((configVars) => {
          expect(configVars).to.deep.equal({
            RESOURCE: 'pseudo.credential',
            TEST_NAME: 'heroku-web-client',
          });
          return client.configVars(app);
        }).then((configVars) => {
          expect(configVars).to.deep.equal({
            RESOURCE: 'pseudo.credential',
            TEST_NAME: 'heroku-web-client',
          });
        });
      });

      it('deletes variables', () => {
        return client.updateConfigVars(app, {
          RESOURCE: 'pseudo.credential',
          TEST_NAME: 'heroku-web-client',
        }).then((configVars) => {
          expect(configVars).to.deep.equal({
            RESOURCE: 'pseudo.credential',
            TEST_NAME: 'heroku-web-client',
          });
          return client.updateConfigVars(app, { RESOURCE: null });
        }).then((configVars) => {
          expect(configVars).to.deep.equal({
            TEST_NAME: 'heroku-web-client',
          });
          return client.configVars(app);
        }).then((configVars) => {
          expect(configVars).to.deep.equal({
            TEST_NAME: 'heroku-web-client',
          });
        });
      });
    });
  });
});
