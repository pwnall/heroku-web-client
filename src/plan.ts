/** A pricing plan for a Heroku add-on. */
export class Plan {
  /** The unique ID of the Heroku add-on associated with this plan. */
  public readonly addonId: string;
  /** The unique name of the Heroku add-on associated with this plan. */
  public readonly addonName: string;
  /** Release status for this add-on plan. */
  public readonly availability: string;
  /** The time when the plan was created. */
  public readonly createdAt: Date;
  /** User-friendly description for this plan. */
  public readonly description: string;
  /** User-friendly name for this add-on. */
  public readonly humanName: string;
  /** The pricing plan's unique ID. Plans can be identified by ID or name. */
  public readonly id: string;
  /** True if this is the default pricing plan for the add-on. */
  public readonly isDefault: boolean;
  /** The pricing plan's unique name. Plans can be identified by ID or name. */
  public readonly name: string;
  /** The plan's price, in US dollar cents. */
  public readonly priceCents: number;
  /** The time duration covered by the plan's advertised price. */
  public readonly priceDuration: number;
  /** The time when the plan was changed most recently. */
  public readonly updatedAt: Date;
  /** True if the plan can be used without Heroku's virtual private network. */
  public readonly worksOutsideSpaces: boolean;

  /** Initializes an add-on pricing plan from Heroku data. */
  private constructor(herokuPlan: any) {
    this.addonId = herokuPlan.addon_service.id;
    this.addonName = herokuPlan.addon_service.name;
    this.availability = herokuPlan.state;
    this.createdAt = new Date(herokuPlan.created_at);
    this.description = herokuPlan.description;
    this.humanName = herokuPlan.human_name;
    this.id = herokuPlan.id;
    this.isDefault = herokuPlan.default;
    this.name = herokuPlan.name;
    this.priceCents = herokuPlan.price.cents;
    this.priceDuration = herokuPlan.price.unit;
    this.updatedAt = new Date(herokuPlan.updated_at);
    this.worksOutsideSpaces = herokuPlan.installable_outside_private_network;
  }

  /** Parses a Heroku plan response. */
  public static fromHerokuPlan(herokuPlan: any): Plan | null {
    if (typeof(herokuPlan) !== 'object') {
      return null;
    }

    if (typeof(herokuPlan.addon_service) !== 'object' ||
        typeof(herokuPlan.created_at) !== 'string' ||
        typeof(herokuPlan.default) !== 'boolean' ||
        typeof(herokuPlan.description) !== 'string' ||
        typeof(herokuPlan.human_name) !== 'string' ||
        typeof(herokuPlan.id) !== 'string' ||
        typeof(herokuPlan.installable_outside_private_network) !== 'boolean' ||
        typeof(herokuPlan.name) !== 'string' ||
        typeof(herokuPlan.price) !== 'object' ||
        typeof(herokuPlan.state) !== 'string' ||
        typeof(herokuPlan.updated_at) !== 'string') {
      return null;
    }

    if (typeof(herokuPlan.addon_service.id) !== 'string' ||
        typeof(herokuPlan.addon_service.name) !== 'string') {
      return null;
    }
    if (typeof(herokuPlan.price.cents) !== 'number' ||
        typeof(herokuPlan.price.unit) !== 'string') {
      return null;
    }

    return new Plan(herokuPlan);
  }

  /** Creates an API server URL segment representing an add-on pricing plan.
   *
   * If a string is given, it can be the plan's name or ID.
   */
  public static toUrlSegment(plan: Plan | string): string {
    return (plan instanceof Plan) ? plan.id : plan;
  }
}
