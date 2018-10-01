import {
  createAttachmentOptionsToFetchBody,
} from '../src/create_attachment_options';

import { expect } from 'chai';

import { Plan } from '../src/plan';
import { herokuPlan } from './heroku_api_examples';

describe('createAttachmentOptionsToFetchBody', () => {
  let plan: Plan;

  beforeEach(() => {
    plan = Plan.fromHerokuPlan(herokuPlan);
  });

  it('converts an options object that only uses strings', () => {
    const body = JSON.parse(createAttachmentOptionsToFetchBody({
        plan: 'plan-id'}));
    expect(body).to.deep.equal({ plan: 'plan-id' });
  });

  it('converts an options object that uses a Plan', () => {
    const body = JSON.parse(createAttachmentOptionsToFetchBody({ plan }));
    expect(body).to.deep.equal({
        plan: '11234567-89ab-cdef-0123-456789abcdef' });
  });
});
