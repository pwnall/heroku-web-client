import { SourceBlob } from '../src/source_blob';

import { expect } from 'chai';

import {
  herokuSourceBlob, herokuSourceBlobShaValue,
} from './heroku_api_examples';

describe('SourceBlob', () => {
  describe('constructor', () => {
    it('correctly initializes all the fields', () => {
      const sourceBlob = new SourceBlob({
        checksum: herokuSourceBlobShaValue,
        url: 'https://example.com/source.tgz?token=xyz', version: 'v1.3.0' });

      expect(sourceBlob.checksum).to.equal(herokuSourceBlobShaValue);
      expect(sourceBlob.url).to.equal(
          'https://example.com/source.tgz?token=xyz');
      expect(sourceBlob.version).to.equal('v1.3.0');
    });
  });

  describe('.fromHerokuBlob', () => {
    it('parses a correct response', () => {
      const sourceBlob = SourceBlob.fromHerokuBlob(herokuSourceBlob);
      expect(sourceBlob).to.be.an.instanceOf(SourceBlob);
      expect(sourceBlob.checksum).to.equal(herokuSourceBlobShaValue);
      expect(sourceBlob.url).to.equal(
          'https://example.com/source.tgz?token=xyz');
      expect(sourceBlob.version).to.equal('v1.3.0');
    });
  });

  describe('.checksumFor', () => {
    it('encodes an empty buffer correctly', () => {
      return SourceBlob.checksumFor(new ArrayBuffer(0)).then((digest) => {
        // The hardcoded value was checked against Ruby's SHA2.
        expect(digest).to.equal(
            'SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca49599' +
            '1b7852b855');
      });
    });
    it('encodes an "abc" buffer correctly', () => {
      const bytes = (new TextEncoder()).encode('abc').buffer;
      return SourceBlob.checksumFor(bytes).then((digest) => {
        // The hardcoded value was checked against Ruby's SHA2.
        expect(digest).to.equal(
            'SHA256:ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff' +
            '61f20015ad');
      });
    });
  });
});
