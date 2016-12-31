import { Stack } from './stack';

/** Options for creating an application. */
export interface CreateSlugOptions {
  /** A description provided by the buildpack used by the application. */
  buildpackDescription?: string | null;
  /** SHA-256 hash of the archive. */
  checksum?: string | null;
  /** ID of the version control commit with the source for this slug. */
  commitId?: string | null;
  /** The description associated with the slug's version control commit. */
  commitMessage?: string | null;
  /** Maps process types to command lines that start the processes. */
  processTypes: { [name: string]: string };
  /** The application's environment.
   *
   * If a string is supplied, it can be a stack ID or a name.
   */
  stack?: Stack | string | null;
}

/** Generates a value that can be used with the Fetch API's body option. */
export const createSlugOptionsToFetchBody =
    (options: CreateSlugOptions): string => {
  const fetchBody: any = { process_types: options.processTypes };
  if ('buildpackDescription' in options) {
    fetchBody.buildpack_provided_description = options.buildpackDescription;
  }
  if ('checksum' in options) {
    fetchBody.checksum = options.checksum;
  }
  if ('commitId' in options) {
    fetchBody.commit = options.commitId;
  }
  if ('commitMessage' in options) {
    fetchBody.commit_description = options.commitMessage;
  }
  if ('stack' in options) {
    const stack = options.stack;
    if (stack instanceof Stack) {
      fetchBody.stack = stack.id;
    } else {
      fetchBody.stack = stack;
    }
  }
  return JSON.stringify(fetchBody);
};
