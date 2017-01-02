import { Release } from '../src/release';

import { expect } from 'chai';

import { herokuRelease } from './heroku_api_examples';

describe('Release', () => {
  describe('.fromHerokuRelease', () => {
    it('parses a correct response', () => {
      const release = Release.fromHerokuRelease(herokuRelease);
      expect(release).to.be.an.instanceOf(Release);
      expect(release.appId).to.equal('01234567-89ab-cdef-0123-456789abcdef');
      expect(release.appName).to.equal('example');
      expect(release.addonPlans).to.deep.equal(['heroku-postgresql:dev']);
      expect(release.createdAt.toISOString()).to.equal(
          '2012-01-01T12:00:00.000Z');
      expect(release.current).to.equal(true);
      expect(release.description).to.equal('Added new feature');
      expect(release.id).to.equal('11234567-89ab-cdef-0123-456789abcdef');
      expect(release.slugId).to.equal('21234567-89ab-cdef-0123-456789abcdef');
      expect(release.status).to.equal('succeeded');
      expect(release.updatedAt.toISOString()).to.equal(
          '2012-01-02T12:00:00.000Z');
      expect(release.userEmail).to.equal('username@example.com');
      expect(release.userId).to.equal('31234567-89ab-cdef-0123-456789abcdef');
    });
  });

  describe('.toUrlSegment', () => {
    let release: Release;
    beforeEach(() => {
      release = Release.fromHerokuRelease(herokuRelease);
    });

    it('converts an options object with an Release object', () => {
      expect(Release.toUrlSegment(release)).to.equal(
          '11234567-89ab-cdef-0123-456789abcdef');
    });

    it('converts an options object with an release string', () => {
      expect(Release.toUrlSegment('release-id')).to.equal('release-id');
    });
  });
});
