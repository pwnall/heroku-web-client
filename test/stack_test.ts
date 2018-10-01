import { Stack } from '../src/stack';

import { expect } from 'chai';

import { herokuStack } from './heroku_api_examples';

describe('Stack', () => {
  describe('.fromHerokuStack', () => {
    it('parses a correct response', () => {
      const stack = Stack.fromHerokuStack(herokuStack);
      expect(stack).to.be.an.instanceOf(Stack);
      expect(stack.id).to.equal('01234567-89ab-cdef-0123-456789abcdef');
      expect(stack.name).to.equal('heroku-18');
      expect(stack.availability).to.equal('public');
    });
  });
});
