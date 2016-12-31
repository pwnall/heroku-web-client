import { Addon } from '../src/addon';

import { expect } from 'chai';

import { herokuAddonService } from './heroku_api_examples';

describe('Addon', () => {
  describe('.fromHerokuAddonService', () => {
    it('parses a correct response', () => {
      const addon = Addon.fromHerokuAddonService(herokuAddonService);
      expect(addon).to.be.an.instanceOf(Addon);
      expect(addon.availability).to.equal('ga');
      expect(addon.createdAt.toISOString()).to.equal(
          '2012-01-01T12:00:00.000Z');
      expect(addon.id).to.equal('01234567-89ab-cdef-0123-456789abcdef');
      expect(addon.humanName).to.equal('Heroku Postgres');
      expect(addon.name).to.equal('heroku-postgresql');
      expect(addon.supportsMultipleInstances).to.equal(true);
      expect(addon.supportsSharing).to.equal(false);
      expect(addon.updatedAt.toISOString()).to.equal(
          '2012-01-02T12:00:00.000Z');
    });
  });

  describe('.toUrlSegment', () => {
    let addon: Addon;
    beforeEach(() => {
      addon = Addon.fromHerokuAddonService(herokuAddonService);
    });

    it('converts an options object with an Addon object', () => {
      expect(Addon.toUrlSegment(addon)).to.equal(
          '01234567-89ab-cdef-0123-456789abcdef');
    });

    it('converts an options object with an addon string', () => {
      expect(Addon.toUrlSegment('addon-name')).to.equal('addon-name');
    });
  });
});
