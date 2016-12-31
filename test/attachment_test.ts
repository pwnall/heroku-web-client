import { Attachment } from '../src/attachment';

import { expect } from 'chai';

import { herokuAddon } from './heroku_api_examples';

describe('Attachment', () => {
  describe('.fromHerokuAddon', () => {
    it('parses a correct response', () => {
      const attachment = Attachment.fromHerokuAddon(herokuAddon);
      expect(attachment).to.be.an.instanceOf(Attachment);
      expect(attachment.addonId).to.equal(
          '01234567-89ab-cdef-0123-456789abcdef');
      expect(attachment.addonName).to.equal('heroku-postgresql');
      expect(attachment.appId).to.equal(
          '11234567-89ab-cdef-0123-456789abcdef');
      expect(attachment.appName).to.equal('example');
      expect(attachment.configVars).to.deep.equal(['FOO', 'BAZ']);
      expect(attachment.createdAt.toISOString()).to.equal(
          '2012-01-01T12:00:00.000Z');
      expect(attachment.id).to.equal('21234567-89ab-cdef-0123-456789abcdef');
      expect(attachment.name).to.equal('acme-inc-primary-database');
      expect(attachment.planId).to.equal(
          '31234567-89ab-cdef-0123-456789abcdef');
      expect(attachment.planName).to.equal('heroku-postgresql:dev');
      expect(attachment.providerId).to.equal('abcd1234');
      expect(attachment.state).to.equal('provisioned');
      expect(attachment.updatedAt.toISOString()).to.equal(
          '2012-01-02T12:00:00.000Z');
      expect(attachment.webAdminUrl).to.equal(
          'https://data.heroku.com/datastore/01234567-89ab-cdef-0123-' +
          '456789abcdef');
    });
  });

  describe('.toUrlSegment', () => {
    let attachment: Attachment;
    beforeEach(() => {
      attachment = Attachment.fromHerokuAddon(herokuAddon);
    });

    it('converts an options object with an Attachment object', () => {
      expect(Attachment.toUrlSegment(attachment)).to.equal(
          '21234567-89ab-cdef-0123-456789abcdef');
    });

    it('converts an options object with an attachment string', () => {
      expect(Attachment.toUrlSegment('attachment-id')).to.equal(
          'attachment-id');
    });
  });
});
