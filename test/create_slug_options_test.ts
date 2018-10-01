import { createSlugOptionsToFetchBody } from '../src/create_slug_options';

import { expect } from 'chai';

import { Stack } from '../src/stack';
import { herokuStack } from './heroku_api_examples';

describe('createSlugOptionsToFetchBody', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = Stack.fromHerokuStack(herokuStack);
  });

  it('converts an options object with mandatory options', () => {
    const body = JSON.parse(createSlugOptionsToFetchBody({
        processTypes: { web: 'node/bin/node minimal.js' }}));
    expect(body).to.deep.equal({
        process_types: { web: 'node/bin/node minimal.js' }});
  });

  it('converts an options object with a Stack', () => {
    const body = JSON.parse(createSlugOptionsToFetchBody({
        processTypes: { web: 'node/bin/node minimal.js' }, stack }));
    expect(body).to.deep.equal({
        process_types: { web: 'node/bin/node minimal.js' },
        stack: '01234567-89ab-cdef-0123-456789abcdef'});
  });

  it('converts an options object with a stack string', () => {
    const body = JSON.parse(createSlugOptionsToFetchBody({
        processTypes: { web: 'node/bin/node minimal.js' },
        stack: 'test-stack'}));
    expect(body).to.deep.equal({
        process_types: { web: 'node/bin/node minimal.js' },
        stack: 'test-stack'});
  });

  it('converts an options object with string options', () => {
    const body = JSON.parse(createSlugOptionsToFetchBody({
        buildpackDescription: 'Ruby/Rack', checksum: 'SHA256:test',
        commitId: '60883d9e8947a57e04dc9124f25df004866a2051',
        commitMessage: 'fixed a bug with API documentation',
        processTypes: { web: 'node/bin/node minimal.js' }}));
    expect(body).to.deep.equal({
        buildpack_provided_description: 'Ruby/Rack',
        checksum: 'SHA256:test',
        commit: '60883d9e8947a57e04dc9124f25df004866a2051',
        commit_description: 'fixed a bug with API documentation',
        process_types: { web: 'node/bin/node minimal.js' }});
  });
});
