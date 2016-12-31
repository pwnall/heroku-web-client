import { Region } from './region';
import { Stack } from './stack';

/** Options for creating an application. */
export interface CreateAppOptions {
  /** The application name. By default, Heroku generates a random name. */
  name?: string;

  /** The region where the application will be hosted.
   *
   * If a string is supplied, it can be a region ID or a name.
   */
  region?: Region | string;

  /** The application's environment.
   *
   * If a string is supplied, it can be a stack ID or a name.
   */
  stack?: Stack | string;
}

/** Generates a value that can be used with the Fetch API's body option. */
export const createAppOptionsToFetchBody =
    (options: CreateAppOptions): string => {
  const fetchBody: any = {};
  if ('name' in options) {
    fetchBody.name = options.name;
  }
  if ('region' in options) {
    const region = options.region;
    if (region instanceof Region) {
      fetchBody.region = region.id;
    } else {
      fetchBody.region = region;
    }
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
