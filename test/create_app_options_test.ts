import { createAppOptionsToFetchBody } from '../src/create_app_options';

import { expect } from 'chai';

import { Region } from '../src/region';
import { Stack } from '../src/stack';
import { herokuRegion, herokuStack } from './heroku_api_examples';

describe('createAppOptionsToFetchBody', () => {
  let region: Region;
  let stack: Stack;

  beforeEach(() => {
    region = Region.fromHerokuRegion(herokuRegion);
    stack = Stack.fromHerokuStack(herokuStack);
  });

  it('converts an empty options object', () => {
    expect(createAppOptionsToFetchBody({})).to.equal('{}');
  });

  it('converts an options object that only uses strings', () => {
    const body = JSON.parse(createAppOptionsToFetchBody({
        name: 'test-name', region: 'test-region', stack: 'test-stack'}));
    expect(body).to.deep.equal({
        name: 'test-name', region: 'test-region', stack: 'test-stack'});
  });

  it('converts an options object that uses a Region', () => {
    const body = JSON.parse(createAppOptionsToFetchBody({
        name: 'test-name', region: region, stack: 'test-stack'}));
    expect(body).to.deep.equal({
        name: 'test-name', region: '01234567-89ab-cdef-0123-456789abcdef',
        stack: 'test-stack'});
  });

  it('converts an options object that uses a Stack', () => {
    const body = JSON.parse(createAppOptionsToFetchBody({
        name: 'test-name', region: 'test-region', stack: stack}));
    expect(body).to.deep.equal({
        name: 'test-name', region: 'test-region',
        stack: '01234567-89ab-cdef-0123-456789abcdef'});
  });
});
