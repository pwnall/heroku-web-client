import { Region } from '../src/region';

import { expect } from 'chai';

import { herokuRegion } from './heroku_api_examples';

describe('Region', () => {
  describe('.fromHerokuRegion', () => {
    it('parses a correct response', () => {
      const region = Region.fromHerokuRegion(herokuRegion);
      expect(region).to.be.an.instanceOf(Region);
      expect(region.area).to.equal('Virginia');
      expect(region.country).to.equal('United States');
      expect(region.description).to.equal('United States');
      expect(region.id).to.equal('01234567-89ab-cdef-0123-456789abcdef');
      expect(region.name).to.equal('us');
      expect(region.providerName).to.equal('amazon-web-services');
      expect(region.providerRegion).to.equal('us-east-1');
    });
  });
});
