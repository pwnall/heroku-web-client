// One-time setup tasks for running the test suite.
//
// The script must be run in the repository's node.js environment, not in the
// browser environment created by Karma.

const crypto = require('crypto');
const decompress = require('decompress');
const decompressTargz = require('decompress-targz');
const decompressTarxz = require('decompress-tarxz');
const fsp = require('fs-promise');
const path = require('path');
const request = require('request-promise-native');
const tar = require('tar');

const testAppUrl =
    'https://github.com/pwnall/heroku-test-app/archive/master.tar.gz';
const nodeUrl =
    'https://nodejs.org/dist/v8.12.0/node-v8.12.0-linux-x64.tar.xz';

async function doTestSetup() {
  await fsp.mkdirp('testdata');
  if (!(await fsp.exists('testdata/node.tar.xz'))) {
    const body = await request({uri: nodeUrl, encoding: null});
    await fsp.writeFile('testdata/node.tar.xz', body, { mode: 0o644 });
  }

  if (!(await fsp.exists('testdata/test_app.tar.gz'))) {
    const body = await request({uri: testAppUrl, encoding: null});
    await fsp.writeFile('testdata/test_app.tar.gz', body, { mode: 0o644 });
  }

  if (!(await fsp.exists('testdata/test_app.json'))) {
    const buffer = await fsp.readFile('testdata/test_app.tar.gz');
    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    const sha256 = hash.digest('hex');
    const json = JSON.stringify({ url: testAppUrl, sha256 }, null, 2);
    await fsp.writeFile('testdata/test_app.json', json, { encoding: 'utf-8' });
  }

  await fsp.mkdirp('testdata/slug/app/node');
  if (!(await fsp.exists('testdata/slug/app/node/bin/node'))) {
    await decompress('testdata/node.tar.xz', 'testdata/slug/app/node',
                     { plugins: [decompressTarxz()], strip: 1 });
  }
  if (!(await fsp.exists('testdata/slug/app/package.json'))) {
    await decompress('testdata/test_app.tar.gz', 'testdata/slug/app',
                     { plugins: [decompressTargz()], strip: 1 });
  }
  if (!(await fsp.exists('testdata/slug.tar.gz'))) {
    await tar.create({
      cwd: path.resolve(process.cwd(), 'testdata', 'slug'),
      file: path.resolve(process.cwd(), 'testdata', 'slug.tar.gz'),
      gzip: { level: 9, memLevel: 9 },
      portable: true,
      strict: true,
    }, ['app']);
  }

  if (!(await fsp.exists('testdata/heroku_account.json'))) {
    const match = /^([^:]+):(.*)$/.exec(process.env['HEROKU_ACCOUNT']);
    const json = JSON.stringify({ email: match[1], password: match[2] },
                                null, 2);
    await fsp.writeFile(
        'testdata/heroku_account.json', json, { encoding: 'utf-8' });
  }
}

doTestSetup();