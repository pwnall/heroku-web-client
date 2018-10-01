/** Updates to a Heroku formation. */
export interface FormationUpdate {
  /** The type (size) of Heroku dyno used to run these processes. */
  dynoType: string;

  /** The number of processes of this type. */
  quantity: number;
}

/** Updates to a Heroku application's formations. */
export interface FormationUpdates {
  [processType: string]: FormationUpdate;
}

/** Generates a value that can be used with the Fetch API's body option. */
export const formationUpdatesToFetchBody =
    (updates: FormationUpdates): string => {
  const fetchUpdates: any = [];
  const fetchBody: any = { updates: fetchUpdates };
  for (const processType in updates) {
    if (updates.hasOwnProperty(processType)) {
      const update = updates[processType];
      fetchUpdates.push({
          quantity: update.quantity, size: update.dynoType,
          type: processType });
    }
  }
  return JSON.stringify(fetchBody);
};
