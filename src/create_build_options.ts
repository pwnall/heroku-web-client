import { SourceBlob } from './source_blob';

/** Options for creating a Heroku build process. */
export interface CreateBuildOptions {
  /** Version control repository URLs for the buildpacks used in this build. */
  buildpackUrls?: string[] | null;

  /** The source code used to build the application's filesystem (slug). */
  sourceBlob: SourceBlob;
}

/** Generates a value that can be used with the Fetch API's body option. */
export const createBuildOptionsToFetchBody =
    (options: CreateBuildOptions): string => {
  const fetchBody: any = {
    source_blob: {
      checksum: options.sourceBlob.checksum,
      url: options.sourceBlob.url,
      version: options.sourceBlob.version,
    },
  };

  if ('buildpackUrls' in options) {
    const urls = options.buildpackUrls;
    if (urls !== null) {
      fetchBody.buildpacks = [];
      for (let i = 0; i < urls.length; ++i) {
        fetchBody.buildpacks.push({ url: urls[i] });
      }
    } else {
      fetchBody.buildpacks = null;
    }
  }

  return JSON.stringify(fetchBody);
};
