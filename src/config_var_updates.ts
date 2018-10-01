/** Updates to a Heroku application's environment variables.
 *
 * Deleting an environment variable is expressed by setting the value to null.
 */
export interface ConfigVarUpdates {
  [name: string]: any | null;
}

/** Generates a value that can be used with the Fetch API's body option. */
export const configVarUpdatesToFetchBody =
    (updates: ConfigVarUpdates): string => {
  const fetchBody: any = {};
  for (const name in updates) {
    if (updates.hasOwnProperty(name)) {
      const value = updates[name];
      fetchBody[name] = (value === null) ? value : value.toString();
    }
  }
  return JSON.stringify(fetchBody);
};
