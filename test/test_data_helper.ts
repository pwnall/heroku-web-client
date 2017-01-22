// Schema for the content of testdata/heroku_account.json
export interface HerokuAccountJSON {
  readonly email: string;
  readonly password: string;
}

// Schema for the content of testdata/test-app.json
export interface TestAppJSON {
  readonly url: string;
  readonly sha256: string;
}

// Dirty hack to keep TypeScript happy about the require() statement below.
//
// We don't want require() to typecheck throughout the project.
declare const require: (name: string) => any;

// tslint:disable:no-var-requires
export const herokuAccount: HerokuAccountJSON =
    require('testdata/heroku_account.json');

export const testApp: TestAppJSON = require('testdata/test_app.json');

export const appSlug: ArrayBuffer = require('testdata/slug.tar.gz');
// tslint:enable:no-var-requires
