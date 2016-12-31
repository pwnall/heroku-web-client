/** A Heroku add-on service. */
export class Addon {
  /** Release status for this add-on. */
  public readonly availability: string;
  /** The time when the add-on was created. */
  public readonly createdAt: Date;
  /** The add-on's unique ID. Add-ons can be identified by ID or name. */
  public readonly id: string;
  /** User-friendly name for this add-on. */
  public readonly humanName: string;
  /** The region's unique name. Add-ons can be identified by ID or name. */
  public readonly name: string;
  /** True if an application can have multiple instances of this add-on. */
  public readonly supportsMultipleInstances: boolean;
  /** True if an add-on instance can be shared between multiple apps. */
  public readonly supportsSharing: boolean;
  /** The time when the add-on was changed most recently. */
  public readonly updatedAt: Date;

  /** Initializes an add-on from Heroku data. */
  private constructor(herokuAddonService: any) {
    this.availability = herokuAddonService.state;
    this.createdAt = new Date(herokuAddonService.created_at);
    this.humanName = herokuAddonService.human_name;
    this.id = herokuAddonService.id;
    this.name = herokuAddonService.name;
    this.supportsMultipleInstances =
        herokuAddonService.supports_multiple_installations;
    this.supportsSharing =
        herokuAddonService.supports_sharing;
    this.updatedAt = new Date(herokuAddonService.updated_at);
  }

  /** Parses a Heroku add-on service response. */
  public static fromHerokuAddonService(herokuAddonService: any): Addon | null {
    if (typeof(herokuAddonService) !== 'object') {
      return null;
    }

    if (typeof(herokuAddonService.created_at) !== 'string' ||
        typeof(herokuAddonService.id) !== 'string' ||
        typeof(herokuAddonService.human_name) !== 'string' ||
        typeof(herokuAddonService.name) !== 'string' ||
        typeof(herokuAddonService.state) !== 'string' ||
        typeof(herokuAddonService.supports_multiple_installations)
        !== 'boolean' ||
        typeof(herokuAddonService.supports_sharing) !== 'boolean' ||
        typeof(herokuAddonService.updated_at) !== 'string') {
      return null;
    }

    return new Addon(herokuAddonService);
  }

  /** Creates an API server URL segment representing an add-on.
   *
   * If a string is given, it can be the application's name or ID.
   */
  public static toUrlSegment(addon: Addon | string): string {
    return (addon instanceof Addon) ? addon.id : addon;
  }
}
