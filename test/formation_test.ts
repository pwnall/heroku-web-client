import { Formation } from '../src/formation';

import { expect } from 'chai';

import { herokuFormation } from './heroku_api_examples';

describe('Formation', () => {
  describe('.fromHerokuFormation', () => {
    it('parses a sample response', () => {
      const formation = Formation.fromHerokuFormation(herokuFormation);
      expect(formation).to.be.an.instanceOf(Formation);
      expect(formation.appId).to.equal('01234567-89ab-cdef-0123-456789abcdef');
      expect(formation.appName).to.equal('example');
      expect(formation.command).to.equal('bundle exec rails server -p $PORT');
      expect(formation.createdAt.toISOString()).to.equal(
          '2012-01-01T12:00:00.000Z');
      expect(formation.dynoType).to.equal('standard-1X');
      expect(formation.id).to.equal('11234567-89ab-cdef-0123-456789abcdef');
      expect(formation.processType).to.equal('web');
      expect(formation.quantity).to.equal(1);
      expect(formation.updatedAt.toISOString()).to.equal(
          '2012-01-02T12:00:00.000Z');
    });

    it('parses a live API response', () => {
      const formation = Formation.fromHerokuFormation({
        app: {
          id: '8e26f783-0c58-4a7e-ad59-5b84587085da',
          name: 'hwc-test-ixg46soc-widx6r',
        },
        command: 'npm start',
        created_at: '2017-01-02T13:21:17Z',
        id: '685ee8e9-fac4-4550-83ad-06783f9fa9c8',
        quantity: 1,
        size: 'Free',
        type: 'web',
        updated_at: '2017-01-02T13:21:19Z',
      });
      expect(formation).to.be.an.instanceOf(Formation);
      expect(formation.appId).to.equal('8e26f783-0c58-4a7e-ad59-5b84587085da');
      expect(formation.appName).to.equal('hwc-test-ixg46soc-widx6r');
      expect(formation.command).to.equal('npm start');
      expect(formation.createdAt.toISOString()).to.equal(
          '2017-01-02T13:21:17.000Z');
      expect(formation.dynoType).to.equal('Free');
      expect(formation.id).to.equal('685ee8e9-fac4-4550-83ad-06783f9fa9c8');
      expect(formation.processType).to.equal('web');
      expect(formation.quantity).to.equal(1);
      expect(formation.updatedAt.toISOString()).to.equal(
          '2017-01-02T13:21:19.000Z');

    });
  });
});
