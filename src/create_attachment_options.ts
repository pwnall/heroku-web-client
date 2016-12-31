import { Plan } from './plan';

/** Options for installing an add-on into an application. */
export interface CreateAttachmentOptions {
  /** The add-on's pricing plan.
   *
   * If a string is supplied, it can be a plan ID or a name.
   */
  plan: Plan | string;
}

/** Generates a value that can be used with the Fetch API's body option. */
export const createAttachmentOptionsToFetchBody =
    (options: CreateAttachmentOptions): string => {

  const plan = options.plan;
  const fetchBody: any = {
    plan: Plan.toUrlSegment((plan instanceof Plan) ? plan.id : plan),
  };
  return JSON.stringify(fetchBody);
};
