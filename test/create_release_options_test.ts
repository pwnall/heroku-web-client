import {
  createReleaseOptionsToFetchBody,
} from '../src/create_release_options';

import { expect } from 'chai';

import { Slug } from '../src/slug';
import { herokuSlug } from './heroku_api_examples';

describe('createReleaseOptionsToFetchBody', () => {
  let slug: Slug;

  beforeEach(() => {
    slug = Slug.fromHerokuSlug(herokuSlug);
  });

  it('converts an options object with a Slug', () => {
    const body = JSON.parse(createReleaseOptionsToFetchBody({
        slug: slug}));
    expect(body).to.deep.equal({
        slug: '01234567-89ab-cdef-0123-456789abcdef' });
  });

  it('converts an options object with a slug string', () => {
    const body = JSON.parse(createReleaseOptionsToFetchBody({
        slug: 'slug-id' }));
    expect(body).to.deep.equal({ slug: 'slug-id' });
  });

  it('converts an options object with a Slug and a description', () => {
    const body = JSON.parse(createReleaseOptionsToFetchBody({
        description: 'Added a new feature', slug: slug }));
    expect(body).to.deep.equal({
        description: 'Added a new feature',
        slug: '01234567-89ab-cdef-0123-456789abcdef' });
  });

  it('converts an options object with a slug string and a description', () => {
    const body = JSON.parse(createReleaseOptionsToFetchBody({
        description: 'Added a new feature', slug: 'slug-id' }));
    expect(body).to.deep.equal({
        description: 'Added a new feature', slug: 'slug-id' });
  });
});
