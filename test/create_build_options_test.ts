import { createBuildOptionsToFetchBody } from '../src/create_build_options';

import { expect } from 'chai';

import { SourceBlob } from '../src/source_blob';
import {
  herokuSourceBlob, herokuSourceBlobShaValue,
} from './heroku_api_examples';

describe('createBlobOptionsToFetchBody', () => {
  let sourceBlob: SourceBlob;

  beforeEach(() => {
    sourceBlob = SourceBlob.fromHerokuBlob(herokuSourceBlob);
  });

  it('converts an options object with mandatory options', () => {
    const body = JSON.parse(createBuildOptionsToFetchBody({
        sourceBlob: sourceBlob}));
    expect(body).to.deep.equal({
        source_blob: { checksum: herokuSourceBlobShaValue,
        url: 'https://example.com/source.tgz?token=xyz', version: 'v1.3.0' }});
  });

  it('converts an options object with null buildpacks', () => {
    const body = JSON.parse(createBuildOptionsToFetchBody({
        buildpackUrls: null, sourceBlob: sourceBlob}));
    expect(body).to.deep.equal({
        buildpacks: null, source_blob: { checksum: herokuSourceBlobShaValue,
        url: 'https://example.com/source.tgz?token=xyz', version: 'v1.3.0' }});
  });

  it('converts an options object with a buildpack', () => {
    const body = JSON.parse(createBuildOptionsToFetchBody({
        buildpackUrls: ['https://github.com/heroku/heroku-buildpack-ruby'],
        sourceBlob: sourceBlob}));
    expect(body).to.deep.equal({
        buildpacks: [{
        url: 'https://github.com/heroku/heroku-buildpack-ruby' }],
        source_blob: { checksum: herokuSourceBlobShaValue,
        url: 'https://example.com/source.tgz?token=xyz', version: 'v1.3.0' }});
  });
});
