// The example below is straight from Heroku's platform documentation.
// https://devcenter.heroku.com/articles/platform-api-reference#account
export const herokuAccount = {
  'allow_tracking': true,
  'beta': false,
  'created_at': '2012-01-01T12:00:00Z',
  'default_organization': {
    'id': '01234567-89ab-cdef-0123-456789abcdef',
    'name': 'example',
  },
  'delinquent_at': '2012-01-01T12:00:00Z',
  'email': 'username@example.com',
  'federated': false,
  'id': '01234567-89ab-cdef-0123-456789abcdef',
  'identity_provider': {
    'id': '01234567-89ab-cdef-0123-456789abcdef',
    'organization': {
      'name': 'example',
    },
  },
  'last_login': '2012-01-01T12:00:00Z',
  'name': 'Tina Edmonds',
  'sms_number': '+1 ***-***-1234',
  'suspended_at': '2012-01-01T12:00:00Z',
  'two_factor_authentication': false,
  'updated_at': '2012-01-01T12:00:00Z',
  'verified': false,
};

// The example below is straight from Heroku's platform documentation.
// https://devcenter.heroku.com/articles/platform-api-reference#add-on
export const herokuAddon = {
  'actions': {
    'action': 'example',
    'id': '01234567-89ab-cdef-0123-456789abcdef',
    'label': 'Example',
    'requires_owner': true,
    'url': 'http://example.com?resource_id=:resource_id',
  },
  'addon_service': {
    'id': '01234567-89ab-cdef-0123-456789abcdef',
    'name': 'heroku-postgresql',
  },
  'app': {
    'id': '11234567-89ab-cdef-0123-456789abcdef',
    'name': 'example',
  },
  'config_vars': [
    'FOO',
    'BAZ',
  ],
  'created_at': '2012-01-01T12:00:00Z',
  'id': '21234567-89ab-cdef-0123-456789abcdef',
  'name': 'acme-inc-primary-database',
  'plan': {
    'id': '31234567-89ab-cdef-0123-456789abcdef',
    'name': 'heroku-postgresql:dev',
  },
  'provider_id': 'abcd1234',
  'state': 'provisioned',
  'updated_at': '2012-01-02T12:00:00Z',
  'web_url':
      'https://data.heroku.com/datastore/01234567-89ab-cdef-0123-456789abcdef',
};

// The example below is straight from Heroku's platform documentation.
// https://devcenter.heroku.com/articles/platform-api-reference#add-on-service
export const herokuAddonService = {
  'cli_plugin_name': 'heroku-papertrail',
  'created_at': '2012-01-01T12:00:00Z',
  'human_name': 'Heroku Postgres',
  'id': '01234567-89ab-cdef-0123-456789abcdef',
  'name': 'heroku-postgresql',
  'state': 'ga',
  'supports_multiple_installations': true,
  'supports_sharing': false,
  'updated_at': '2012-01-02T12:00:00Z',
};

// The example below is straight from Heroku's platform documentation.
// https://devcenter.heroku.com/articles/platform-api-reference#app
export const herokuApp = {
  'archived_at': '2012-01-01T12:00:00Z',
  'build_stack': {
    'id': '01234567-89ab-cdef-0123-456789abcdef',
    'name': 'cedar-14-build',
  },
  'buildpack_provided_description': 'Ruby/Rack',
  'created_at': '2012-01-01T12:00:00Z',
  'git_url': 'https://git.heroku.com/example.git',
  'id': '11234567-89ab-cdef-0123-456789abcdef',
  'maintenance': false,
  'name': 'example',
  'organization': {
    'id': '21234567-89ab-cdef-0123-456789abcdef',
    'name': 'example',
  },
  'owner': {
    'email': 'username@example.com',
    'id': '31234567-89ab-cdef-0123-456789abcdef',
  },
  'region': {
    'id': '41234567-89ab-cdef-0123-456789abcdef',
    'name': 'us',
  },
  'released_at': '2012-01-02T12:00:00Z',
  'repo_size': 42,
  'slug_size': 16,
  'space': {
    'id': '51234567-89ab-cdef-0123-456789abcdef',
    'name': 'nasa',
  },
  'stack': {
    'id': '61234567-89ab-cdef-0123-456789abcdef',
    'name': 'cedar-14',
  },
  'updated_at': '2012-01-03T12:00:00Z',
  'web_url': 'https://example.herokuapp.com/',
};

// The example below is straight from Heroku's platform documentation.
// https://devcenter.heroku.com/articles/platform-api-reference#formation
export const herokuFormation = {
  'app': {
    'id': '01234567-89ab-cdef-0123-456789abcdef',
    'name': 'example',
  },
  'command': 'bundle exec rails server -p $PORT',
  'created_at': '2012-01-01T12:00:00Z',
  'id': '11234567-89ab-cdef-0123-456789abcdef',
  'quantity': 1,
  'size': 'standard-1X',
  'type': 'web',
  'updated_at': '2012-01-02T12:00:00Z',
};

// The example below is straight from Heroku's platform documentation.
// https://devcenter.heroku.com/articles/platform-api-reference#plan
export const herokuPlan = {
  'addon_service': {
    'id': '01234567-89ab-cdef-0123-456789abcdef',
    'name': 'heroku-postgresql',
  },
  'compliance': [
    'HIPAA',
  ],
  'created_at': '2012-01-01T12:00:00Z',
  'default': true,
  'description': 'Heroku Postgres Dev',
  'human_name': 'Dev',
  'id': '11234567-89ab-cdef-0123-456789abcdef',
  'installable_inside_private_network': false,
  'installable_outside_private_network': true,
  'name': 'heroku-postgresql:dev',
  'price': {
    'cents': 0,
    'unit': 'month',
  },
  'space_default': false,
  'state': 'public',
  'updated_at': '2012-01-02T12:00:00Z',
};

// The example below is straight from Heroku's platform documentation.
// https://devcenter.heroku.com/articles/platform-api-reference#region
export const herokuRegion = {
  'country': 'United States',
  'created_at': '2012-01-01T12:00:00Z',
  'description': 'United States',
  'id': '01234567-89ab-cdef-0123-456789abcdef',
  'locale': 'Virginia',
  'name': 'us',
  'private_capable': false,
  'provider': {
    'name': 'amazon-web-services',
    'region': 'us-east-1',
  },
  'updated_at': '2012-01-01T12:00:00Z',
};

// The example below is straight from Heroku's platform documentation.
// https://devcenter.heroku.com/articles/platform-api-reference#release
export const herokuRelease = {
  'addon_plan_names': [
    'heroku-postgresql:dev',
  ],
  'app': {
    'id': '01234567-89ab-cdef-0123-456789abcdef',
    'name': 'example',
  },
  'created_at': '2012-01-01T12:00:00Z',
  'current': true,
  'description': 'Added new feature',
  'id': '11234567-89ab-cdef-0123-456789abcdef',
  'slug': {
    'id': '21234567-89ab-cdef-0123-456789abcdef',
  },
  'status': 'succeeded',
  'updated_at': '2012-01-02T12:00:00Z',
  'user': {
    'email': 'username@example.com',
    'id': '31234567-89ab-cdef-0123-456789abcdef',
  },
  'version': 11,
};

// The example below is straight from Heroku's platform documentation.
// https://devcenter.heroku.com/articles/platform-api-reference#stack
export const herokuStack = {
  'created_at': '2012-01-01T12:00:00Z',
  'id': '01234567-89ab-cdef-0123-456789abcdef',
  'name': 'cedar-14',
  'state': 'public',
  'updated_at': '2012-01-01T12:00:00Z',
};

// The example below is straight from Heroku's platform documentation.
// https://devcenter.heroku.com/articles/platform-api-reference#source
export const herokuSource = {
  'source_blob': {
    'get_url': 'https://api.heroku.com/sources/1234.tgz',
    'put_url': 'https://api.heroku.com/sources/12345.tgz',
  },
};

// The example below is straight from Heroku's platform documentation.
// https://devcenter.heroku.com/articles/platform-api-reference#stack
export const herokuSourceBlobShaValue =
    'SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
export const herokuSourceBlob = {
  'checksum': herokuSourceBlobShaValue,
  'url': 'https://example.com/source.tgz?token=xyz',
  'version': 'v1.3.0',
};

// The example below is straight from Heroku's platform documentation.
// https://devcenter.heroku.com/articles/platform-api-reference#build
export const herokuBuild = {
  'app': {
    'id': '01234567-89ab-cdef-0123-456789abcdef',
  },
  'buildpacks': [
    {
      'url': 'https://github.com/heroku/heroku-buildpack-ruby',
    },
  ],
  'created_at': '2012-01-01T12:00:00Z',
  'id': '41234567-89ab-cdef-0123-456789abcdef',
  'output_stream_url':
      'https://build-output.heroku.com/streams/01234567-89ab-cdef-0123-' +
      '456789abcdef',
  'release': {
    'id': '11234567-89ab-cdef-0123-456789abcdef',
  },
  'slug': {
    'id': '21234567-89ab-cdef-0123-456789abcdef',
  },
  'source_blob': herokuSourceBlob,
  'status': 'succeeded',
  'updated_at': '2012-01-02T12:00:00Z',
  'user': {
    'email': 'username@example.com',
    'id': '31234567-89ab-cdef-0123-456789abcdef',
  },
};

// The example below is straight from Heroku's platform documentation.
// https://devcenter.heroku.com/articles/platform-api-reference#slug
export const herokuSlug = {
  'blob': {
    'method': 'GET',
    'url': 'https://api.heroku.com/slugs/1234.tgz',
  },
  'buildpack_provided_description': 'Ruby/Rack',
  'checksum': herokuSourceBlobShaValue,
  'commit': '60883d9e8947a57e04dc9124f25df004866a2051',
  'commit_description': 'fixed a bug with API documentation',
  'created_at': '2012-01-01T12:00:00Z',
  'id': '01234567-89ab-cdef-0123-456789abcdef',
  'process_types': {
    'web': './bin/web -p $PORT',
  },
  'size': 2048,
  'stack': {
    'id': '11234567-89ab-cdef-0123-456789abcdef',
    'name': 'cedar-14',
  },
  'updated_at': '2012-01-02T12:00:00Z',
};
