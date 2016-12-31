import { Build } from '../src/build';

import { expect } from 'chai';

import { SourceBlob } from '../src/source_blob';
import { herokuBuild, herokuSourceBlobShaValue } from './heroku_api_examples';

describe('Build', () => {
  describe('.fromHerokuBuild', () => {
    it('parses a correct response', () => {
      const build = Build.fromHerokuBuild(herokuBuild);
      expect(build).to.be.an.instanceOf(Build);
      expect(build.appId).to.equal('01234567-89ab-cdef-0123-456789abcdef');
      expect(build.buildpackUrls).to.deep.equal([
          'https://github.com/heroku/heroku-buildpack-ruby']);
      expect(build.createdAt.toISOString()).to.equal(
          '2012-01-01T12:00:00.000Z');
      expect(build.id).to.equal('41234567-89ab-cdef-0123-456789abcdef');
      expect(build.outputStreamUrl).to.equal(
          'https://build-output.heroku.com/streams/01234567-89ab-cdef-0123-' +
          '456789abcdef');
      expect(build.releaseId).to.equal('11234567-89ab-cdef-0123-456789abcdef');
      expect(build.slugId).to.equal('21234567-89ab-cdef-0123-456789abcdef');
      expect(build.sourceBlob).to.be.an.instanceof(SourceBlob);
      expect(build.sourceBlob.checksum).to.equal(herokuSourceBlobShaValue);
      expect(build.sourceBlob.url).to.equal(
          'https://example.com/source.tgz?token=xyz');
      expect(build.sourceBlob.version).to.equal('v1.3.0');
      expect(build.status).to.equal('succeeded');
      expect(build.updatedAt.toISOString()).to.equal(
          '2012-01-02T12:00:00.000Z');
      expect(build.userEmail).to.equal('username@example.com');
      expect(build.userId).to.equal('31234567-89ab-cdef-0123-456789abcdef');
    });
  });

  describe('.toUrlSegment', () => {
    let build: Build;
    beforeEach(() => {
      build = Build.fromHerokuBuild(herokuBuild);
    });

    it('converts an options object with an Build object', () => {
      expect(Build.toUrlSegment(build)).to.equal(
          '41234567-89ab-cdef-0123-456789abcdef');
    });

    it('converts an options object with an build string', () => {
      expect(Build.toUrlSegment('build-id')).to.equal('build-id');
    });
  });
});
