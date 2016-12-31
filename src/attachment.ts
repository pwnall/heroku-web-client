/** An installation of a Heroku add-on service into an application. */
export class Attachment {
  /** The add-on's unique ID. */
  public readonly addonId: string;
  /** The add-on's globally unique name. */
  public readonly addonName: string;
  /** The application's unique ID. */
  public readonly appId: string;
  /** The application's globally unique name. */
  public readonly appName: string;
  /** The names of the configuration variables exposed by the add-on. */
  public readonly configVars: string[];
  /** The time when the add-on was installed into the app. */
  public readonly createdAt: Date;
  /** The add-on installation's unique ID.
   *
   * Add-on installatons can be identified by ID or name.
   */
  public readonly id: string;
  /** The add-on installation's unique name.
   *
   * Add-on installations can be identified by ID or name.
   */
  public readonly name: string;
  /** The add-on's unique ID. */
  public readonly planId: string;
  /** The add-on's globally unique name. */
  public readonly planName: string;
  /** An installation ID generated by the add-on provider. */
  public readonly providerId: string;
  /** Release status for this add-on. */
  public readonly state: 'provisioning' | 'provisioned' | 'deprovisioned';
  /** The time when the add-on installation was changed most recently. */
  public readonly updatedAt: Date;
  /** URL for the installed add-on's Web admin console or dashboard.
   *
   * The URL should contain enough information for the admin console or
   * dashboard UI to be focused on this installation.
   */
  public readonly webAdminUrl: string | null;


  /** Initializes an add-on from Heroku data. */
  private constructor(herokuAddon: any) {
    this.addonId = herokuAddon.addon_service.id;
    this.addonName = herokuAddon.addon_service.name;
    this.appId = herokuAddon.app.id;
    this.appName = herokuAddon.app.name;
    this.configVars = herokuAddon.config_vars;
    this.createdAt = new Date(herokuAddon.created_at);
    this.id = herokuAddon.id;
    this.name = herokuAddon.name;
    this.planId = herokuAddon.plan.id;
    this.planName = herokuAddon.plan.name;
    this.providerId = herokuAddon.provider_id;
    this.state = herokuAddon.state;
    this.updatedAt = new Date(herokuAddon.updated_at);
    this.webAdminUrl = herokuAddon.web_url;
  }

  /** Parses a Heroku add-on response. */
  public static fromHerokuAddon(herokuAddon: any): Attachment | null {
    if (typeof(herokuAddon) !== 'object') {
      return null;
    }

    if (typeof(herokuAddon.addon_service) !== 'object' ||
        typeof(herokuAddon.app) !== 'object' ||
        !Array.isArray(herokuAddon.config_vars) ||
        typeof(herokuAddon.created_at) !== 'string' ||
        typeof(herokuAddon.id) !== 'string' ||
        typeof(herokuAddon.name) !== 'string' ||
        typeof(herokuAddon.plan) !== 'object' ||
        typeof(herokuAddon.provider_id) !== 'string' ||
        (herokuAddon.state !== 'provisioning' &&
         herokuAddon.state !== 'provisioned' &&
         herokuAddon.state !== 'deprovisioned') ||
        typeof(herokuAddon.updated_at) !== 'string' ||
        (herokuAddon.web_url !== null &&
         typeof(herokuAddon.web_url) !== 'string')) {
      return null;
    }

    if (typeof(herokuAddon.addon_service.id) !== 'string' ||
        typeof(herokuAddon.addon_service.name) !== 'string') {
      return null;
    }
    if (typeof(herokuAddon.app.id) !== 'string' ||
        typeof(herokuAddon.app.name) !== 'string') {
      return null;
    }
    if (typeof(herokuAddon.plan.id) !== 'string' ||
        typeof(herokuAddon.plan.name) !== 'string') {
      return null;
    }
    const config_vars: Array<any> = herokuAddon.config_vars;
    for (let i = 0; i < config_vars.length; ++i) {
      if (typeof(config_vars[i]) !== 'string') {
        return null;
      }
    }

    return new Attachment(herokuAddon);
  }

  /** Creates an API server URL segment representing an attachment.
   *
   * If a string is given, it can be the attachment's name or ID.
   */
  public static toUrlSegment(attachment: Attachment | string): string {
    return (attachment instanceof Attachment) ? attachment.id : attachment;
  }
}