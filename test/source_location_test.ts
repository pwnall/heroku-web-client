import { SourceLocation } from '../src/source_location';

import { expect } from 'chai';

import { Client } from '../src/client';
import { DirectCredential } from '../src/direct_credential';
import { herokuSource } from './heroku_api_examples';
import { appArchive, herokuAccount } from './test_data_helper';

describe('SourceLocation', () => {
  describe('.fromHerokuSource', () => {
    it('parses a correct response', () => {
      const source = SourceLocation.fromHerokuSource(herokuSource);
      expect(source.url).to.equal('https://api.heroku.com/sources/1234.tgz');
      expect(source.putUrl).to.equal(
          'https://api.heroku.com/sources/12345.tgz');
    });
  });

  describe('#upload', () => {
    let client: Client;
    beforeEach(() => {
      client = new Client();
      const credential = new DirectCredential({
        email: herokuAccount.email, password: herokuAccount.password });
      return client.login(credential);
    });

    it('causes #download to return the uploaded archive', () => {
      let sourceLocation: SourceLocation;
      return client.createSourceLocation().then(createdSourceLocation => {
        sourceLocation = createdSourceLocation;
        return sourceLocation.upload(appArchive);
      }).then(() => {
        return sourceLocation.download();
      }).then(response => {
        return response.arrayBuffer();
      }).then(responseBuffer => {
        expect(responseBuffer).to.deep.equal(appArchive);
      });
    });
  });
});
