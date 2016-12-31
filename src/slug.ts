import { HerokuError } from './error';

/** An archive of a Heroku application's filesystem. */
export class Slug {
  /** The HTTP method used to fetch the slug's archive. */
  public readonly blobMethod: string;
  /** The HTTP URL used to fetch or upload the slug's archive. */
  public readonly blobUrl: string;
  /** A description provided by the buildpack used by the application. */
  public readonly buildpackDescription: string | null;
  /** SHA-256 hash of the archive. */
  public readonly checksum: string | null;
  /** ID of the version control commit with the source for this slug. */
  public readonly commitId: string | null;
  /** The description associated with the slug's version control commit. */
  public readonly commitMessage: string | null;
  /** The time when the slug was created. */
  public readonly createdAt: Date;
  /** The slug's unique ID. */
  public readonly id: string;
  /** Maps process type names to command lines for starting the processes. */
  public readonly processTypes: { [name: string]: string };
  /** The filesystem archive's size, in bytes. */
  public readonly size: number | null;
  /** The unique ID of the environment used by the application. */
  public readonly stackId: string;
  /** The unique name of the environment used by the application. */
  public readonly stackName: string;
  /** The time when the Heroku application was changed most recently. */
  public readonly updatedAt: Date;

  /** Initializes a slug from Heroku data. */
  private constructor(herokuSlug: any) {
    this.blobMethod = herokuSlug.blob.method;
    this.blobUrl = herokuSlug.blob.url;
    this.buildpackDescription = herokuSlug.buildpack_provided_description;
    this.checksum = herokuSlug.checksum;
    this.commitId = herokuSlug.commit;
    this.commitMessage = herokuSlug.commit_description;
    this.createdAt = new Date(herokuSlug.created_at);
    this.id = herokuSlug.id;
    this.processTypes = {};
    for (let processName in herokuSlug.process_types) {
      if (herokuSlug.process_types.hasOwnProperty(processName)) {
        const commandLine = herokuSlug.process_types[processName];
        this.processTypes[processName] = commandLine.toString();
      }
    }
    this.size = herokuSlug.size;
    this.stackId = herokuSlug.stack.id;
    this.stackName = herokuSlug.stack.name;
    this.updatedAt = new Date(herokuSlug.updated_at);
  }

  /** Parses a Heroku slug response. */
  public static fromHerokuSlug(herokuSlug: any): Slug | null {
    if (typeof(herokuSlug) !== 'object') {
      return null;
    }

    if (typeof(herokuSlug.blob) !== 'object' &&
        (herokuSlug.buildpack_provided_description !== null &&
         typeof(herokuSlug.buildpack_provided_description) !== 'string') ||
        (herokuSlug.checksum !== null &&
         typeof(herokuSlug.checksum) !== 'string') ||
        (herokuSlug.commit !== null &&
         typeof(herokuSlug.commit) !== 'string') ||
        (herokuSlug.commit_description !== null &&
         typeof(herokuSlug.commit_description) !== 'string') ||
        typeof(herokuSlug.created_at) !== 'string' ||
        typeof(herokuSlug.id) !== 'string' ||
        typeof(herokuSlug.process_types) !== 'object' ||
        (herokuSlug.size !== null && typeof(herokuSlug.size) !== 'number') ||
        typeof(herokuSlug.stack) !== 'object' ||
        typeof(herokuSlug.updated_at) !== 'string') {
      return null;
    }

    if (typeof(herokuSlug.blob.method) !== 'string' ||
        typeof(herokuSlug.blob.url) !== 'string') {
      return null;
    }
    if (typeof(herokuSlug.stack.id) !== 'string' ||
        typeof(herokuSlug.stack.name) !== 'string') {
      return null;
    }

    return new Slug(herokuSlug);
  }

  /** Creates an API server URL segment representing a slug.
   *
   * If a string is given, it must be the slug's ID.
   */
  public static toUrlSegment(slug: Slug | string): string {
    return (slug instanceof Slug) ? slug.id : slug;
  }

  /** Uploads the archived filesystem held by this Heroku slug.
   *
   * A slug becomes immutable once its contents is uploaded.
   */
  public upload(data: ArrayBuffer | ArrayBufferView | Blob):
      Promise<null> {
    return fetch(this.blobUrl, {
      body: data,
      headers: {
        'Content-Type': 'application/gzip',
      },
      method: this.blobMethod,
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then(() => null);
  }
}
