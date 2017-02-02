import { HerokuError } from './error';

/** Heroku-owned Web location that accepts a source upload. */
export class SourceLocation {
  /** The URL ar which the uploaded source code can be downloaded. */
  public readonly url: string;

  /** The URL ar which the source code can be uploaded. */
  public readonly putUrl: string;

  /** Initializes a source location from valid Heroku data. */
  public constructor(herokuSource: any) {
    this.url = herokuSource.source_blob.get_url;
    this.putUrl = herokuSource.source_blob.put_url;
  }

  /** Parses a Heroku source creation response. */
  public static fromHerokuSource(herokuSource: any): SourceLocation | null {
    if (typeof(herokuSource) !== 'object') {
      return null;
    }

    if (typeof(herokuSource.source_blob) !== 'object') {
      return null;
    }

    if (typeof(herokuSource.source_blob.get_url) !== 'string' ||
        typeof(herokuSource.source_blob.put_url) !== 'string') {
      return null;
    }

    return new SourceLocation(herokuSource);
  }

  /** Uploads a source code archive to this location. */
  public upload(sourceArchive: ArrayBuffer | ArrayBufferView | Blob):
      Promise<null> {
    return fetch(this.putUrl, {
      body: sourceArchive,
      // NOTE: Headers is intentionally missing. Setting a Content-Type would
      //       cause the CORS request to be rejected, because of the CORS ACL
      //       that Heroku has set up on its source bucket.
      method: 'PUT',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then(() => null);
  }

  /** Downloads the source code archive at this location. */
  public download(): Promise<Response> {
    return fetch(this.url, {
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response) => response);
  }
}
