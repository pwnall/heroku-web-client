import { assert, expect } from 'chai';

import { HerokuError } from '../src/error';

describe('HerokuError', () => {
  describe('.parseResponse', () => {
    it('resolves for a response with a 200 HTTP status', () => {
      const response = new Response(
          '{"id":"rate_limit", "message":"Your account reached the API rate ' +
          'limit","url":"https://devcenter.heroku.com/articles/some#error"}',
          { headers: { 'Content-Type': 'application/json' }, status: 200 });

      return HerokuError.parseResponse(response).then((resolved: any) => {
        expect(resolved).to.equal(response);
      });
    });

    it('parses a well-formed error response', () => {
      const response = new Response(
          '{"id":"rate_limit", "message":"Your account reached the API rate ' +
          'limit","url":"https://devcenter.heroku.com/articles/some#error"}',
          { headers: { 'Content-Type': 'application/json' }, status: 409 });

      return HerokuError.parseResponse(response).then(() => {
        assert.fail(0, 1, 'Promise should reject with HerokuError');
      }).catch((error: any) => {
        expect(error).to.be.an.instanceOf(HerokuError);
        expect(error.id).to.equal('rate_limit');
        expect(error.message).to.equal(
            'Your account reached the API rate limit');
        expect(error.url).to.equal(
            'https://devcenter.heroku.com/articles/some#error');
      });
    });

    it('fills in missing fields', () => {
      const response = new Response(
          '{}',
          { headers: { 'Content-Type': 'application/json' }, status: 409 });

      return HerokuError.parseResponse(response).then(() => {
        assert.fail(0, 1, 'Promise should reject with HerokuError');
      }).catch((error: any) => {
        expect(error).to.be.an.instanceOf(HerokuError);
        expect(error.id).to.equal('missing_id');
        expect(error.message).to.equal('(Heroku error missing message)');
        expect(error.url).to.equal(
            'https://devcenter.heroku.com/articles/platform-api-reference');
      });
    });

    it('handles an error response with malformed json', () => {
      const response = new Response(
          'Something went wrong!',
          { headers: { 'Content-Type': 'application/json' }, status: 500 });

      return HerokuError.parseResponse(response).then(() => {
        assert.fail(0, 1, 'Promise should reject with HerokuError');
      }).catch((error: any) => {
        expect(error).to.be.an.instanceOf(HerokuError);
        expect(error.id).to.equal('status_500');
        expect(error.message).to.equal(
            'The Heroku API server response contained invalid JSON: ' +
            'Unexpected token S in JSON at position 0');
        expect(error.url).to.equal(
            'https://devcenter.heroku.com/articles/platform-api-reference');
      });
    });
  });
});
