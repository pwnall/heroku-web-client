import { Plan } from '../src/plan';

import { expect } from 'chai';

import { herokuPlan } from './heroku_api_examples';

describe('Plan', () => {
  describe('.fromHerokuPlan', () => {
    it('parses a correct response', () => {
      const plan = Plan.fromHerokuPlan(herokuPlan);
      expect(plan).to.be.an.instanceOf(Plan);
      expect(plan.addonId).to.equal('01234567-89ab-cdef-0123-456789abcdef');
      expect(plan.addonName).to.equal('heroku-postgresql');
      expect(plan.availability).to.equal('public');
      expect(plan.createdAt.toISOString()).to.equal(
          '2012-01-01T12:00:00.000Z');
      expect(plan.description).to.equal('Heroku Postgres Dev');
      expect(plan.humanName).to.equal('Dev');
      expect(plan.id).to.equal('11234567-89ab-cdef-0123-456789abcdef');
      expect(plan.isDefault).to.equal(true);
      expect(plan.name).to.equal('heroku-postgresql:dev');
      expect(plan.priceCents).to.equal(0);
      expect(plan.priceDuration).to.equal('month');
      expect(plan.updatedAt.toISOString()).to.equal(
          '2012-01-02T12:00:00.000Z');
      expect(plan.worksOutsideSpaces).to.equal(true);
    });
  });

  describe('.toUrlSegment', () => {
    let plan: Plan;
    beforeEach(() => {
      plan = Plan.fromHerokuPlan(herokuPlan);
    });

    it('converts an options object with an Plan object', () => {
      expect(Plan.toUrlSegment(plan)).to.equal(
          '11234567-89ab-cdef-0123-456789abcdef');
    });

    it('converts an options object with an plan string', () => {
      expect(Plan.toUrlSegment('plan-id')).to.equal(
          'plan-id');
    });
  });
});
