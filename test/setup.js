// One-time setup tasks for running the test suite.
//
// The script must be run in the repository's node.js environment, not in the
// browser environment created by Karma.

const crypto = require('crypto');
const decompress = require('decompress');
const decompressTargz = require('decompress-targz');
const fsp = require('fs-promise');
const path = require('path');
const request = require('request-promise-native');
const TarGz = require('tar.gz');

const testAppUrl =
    'https://github.com/pwnall/heroku-test-app/archive/master.tar.gz';
const nodeUrl =
    'https://nodejs.org/dist/v6.9.2/node-v6.9.2-linux-x64.tar.gz';

fsp.mkdirp('testdata').then(() => {
  return fsp.exists('testdata/node.tar.gz');
}).then((nodeTarGzExists) => {
  if (nodeTarGzExists)
    return true;
  return request({uri: nodeUrl, encoding: null}).then((body) => {
    return fsp.writeFile('testdata/node.tar.gz', body, { mode: 0o644 });
  });
}).then(() => {
  return fsp.exists('testdata/test_app.tar.gz');
}).then((testAppTarGzExists) => {
  if (testAppTarGzExists)
    return true;
  return request({uri: testAppUrl, encoding: null}).then((body) => {
    return fsp.writeFile('testdata/test_app.tar.gz', body, { mode: 0o644 });
  });
}).then(() => {
  return fsp.exists('testdata/test_app.json');
}).then((testAppJsonExists) => {
  if (testAppJsonExists)
    return true;
  return fsp.readFile('testdata/test_app.tar.gz').then((buffer) => {
    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    const sha256 = hash.digest('hex');
    const json = JSON.stringify({ url: testAppUrl, sha256: sha256 }, null, 2);
    return fsp.writeFile('testdata/test_app.json', json, { encoding: 'utf-8' });
  });
}).then(() => {
  return fsp.mkdirp('testdata/slug/app/node');
}).then(() => {
  return fsp.exists('testdata/slug/app/node/bin/node');
}).then((testSlugNodeExists) => {
  if (testSlugNodeExists)
    return true;
  return decompress(
      'testdata/node.tar.gz', 'testdata/slug/app/node', { strip: 1 });
}).then(() => {
  return fsp.exists('testdata/slug/package.json');
}).then((testSlugPackageExists) => {
  if (testSlugPackageExists)
    return true;
  return decompress(
      'testdata/test_app.tar.gz', 'testdata/slug/app', { strip: 1 });
}).then(() => {
  return fsp.exists('testdata/slug.tar.gz');
}).then((slugTarGzExists) => {
  if (slugTarGzExists)
    return true;
  const tarGz = new TarGz({ level: 9, memLevel: 9 }, { fromBase: true });
  return tarGz.compress('testdata/slug', 'testdata/slug.tar.gz');
}).then(() => {
  return fsp.exists('testdata/heroku_account.json');
}).then((testHerokuAccountExists) => {
  if (testHerokuAccountExists)
    return true;

  const match = /^([^:]+):(.*)$/.exec(process.env['HEROKU_ACCOUNT']);
  const json = JSON.stringify({ email: match[1], password: match[2] }, null, 2);
  return fsp.writeFile(
      'testdata/heroku_account.json', json, { encoding: 'utf-8' });
}).then(() => {
  console.log('Test setup done');
}).catch((error) => {
  console.error(error, error.stack);
  process.exitCode = 1;
});
