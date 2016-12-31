# Heroku Platform API Client for Web Applications

This is a client library for the
[Heroku Platform API](https://devcenter.heroku.com/articles/platform-api-reference)
that can be used by Web applications.

The library relies on the
[fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), which
can be used natively in [most modern browsers](http://caniuse.com/fetch).
[The fetch polyfill](https://github.com/github/fetch) extends this library's
compatibility all the way down to Internet Explorer 10.

## Development Setup

Install the project's dependencies and run a one-time setup script.

```bash
npm install
node test/setup.js
```

Create a testing Heroku account and plug in the email and password into
`testdata/heroku_account.json`. Using a real Heroku account is not recommended,
as bugs in the library could result in your applications getting deleted.

```json
{
  "email": "your@test.account",
  "password": "your-secret"
}
```

## License

This project is Copyright (c) 2016 Victor Costan, and distributed under the MIT
License.
