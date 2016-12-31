export interface SourceBlobJson {
  /** SHA-256 hash of the source code.
   *
   * This causes Heroku to check the downloaded source code's SHA-256 hash
   * against the given value, and gives fairly good protection against
   * deploying unexpected source code.
   */
  checksum: string | null;

  /** The URL ar which the source code can be downloaded. */
  url: string;

  /** Source code version. */
  version: string | null;
};

/** A source code packagge that will be deployed to Heroku. */
export class SourceBlob implements SourceBlobJson {
  /** SHA-256 hash of the source code.
   *
   * This causes Heroku to check the downloaded source code's SHA-256 hash
   * against the given value, and gives fairly good protection against
   * deploying unexpected source code.
   */
  public readonly checksum: string | null;

  /** The URL ar which the source code can be downloaded. */
  public readonly url: string;

  /** Source code version. */
  public readonly version: string | null;

  /** Initializes a source blob from valid Heroku data. */
  public constructor(json: SourceBlobJson) {
    this.checksum = json.checksum;
    this.url = json.url;
    this.version = json.version;
  }

  /** Parses a Heroku source blob response. */
  public static fromHerokuBlob(herokuBlob: any): SourceBlob | null {
    if (typeof(herokuBlob) !== 'object') {
      return null;
    }

    if ((herokuBlob.checksum !== null &&
         typeof(herokuBlob.checksum) !== 'string') ||
        typeof(herokuBlob.url) !== 'string' ||
        (herokuBlob.version !== null &&
         typeof(herokuBlob.version) !== 'string')) {
      return null;
    }

    return new SourceBlob(herokuBlob as SourceBlobJson);
  }

  /** Computes the checksum for a Heroku data blob. */
  public static checksumFor(data: BufferSource): Promise<string> {
    return crypto.subtle.digest('sha-256', data).then((arrayBuffer) => {
      let result: string = 'SHA256:';
      const view = new Uint8Array(arrayBuffer);
      const length = view.length;
      for (let i = 0; i < length; ++i) {
        const byte = view[i];
        result += (byte >> 4).toString(16);
        result += (byte & 0xf).toString(16);
      }
      return result;
    }) as Promise<string>;
    // HACK(pwnall): TypeScript's typings incorrectly declare digest to return
    //     PromiseLike<string>. The Web Crypto standard's IDL states that
    //     digest returns a Promise.
  }
}
