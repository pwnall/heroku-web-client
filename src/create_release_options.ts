import { Slug } from './slug';

/** Options for creating a Heroku release. */
export interface CreateReleaseOptions {
  description?: string;

  /** The application's filesystem (slug) used in this release.
   *
   * If a string is given, it must be the slug's ID.
   */
  slug: Slug | string;
}

/** Generates a value that can be used with the Fetch API's body option. */
export const createReleaseOptionsToFetchBody =
    (options: CreateReleaseOptions): string => {
  const slug = options.slug;
  const fetchBody: any = { slug: (slug instanceof Slug) ? slug.id : slug };

  if ('description' in options) {
    fetchBody.description = options.description;
  }

  return JSON.stringify(fetchBody);
};
