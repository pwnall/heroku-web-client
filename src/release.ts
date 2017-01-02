/** A snapshot of an application's add-ons, code, and config vars. */
export class Release {
  /** The ID of the application that owns the release. */
  public readonly appId: string;
  /** The name of the application that owns the release. */
  public readonly appName: string;
  /** The pricing plans for the add-ons used by this release. */
  public readonly addonPlans: string[];
  /** The time when the release was created. */
  public readonly createdAt: Date;
  /** True if this is the current release. */
  public readonly current: boolean;
  /** A description of the changes in this release. */
  public readonly description: string;
  /** The release's unique ID. */
  public readonly id: string;
  /** ID of the slug containing the release's source code. */
  public readonly slugId: string | null;
  /** The release's state. */
  public readonly status: 'failed' | 'pending' | 'succeeded';
  /** The time when the Heroku application was changed most recently. */
  public readonly updatedAt: Date;
  /** The e-mail address of the account that kicked off this build. */
  public readonly userEmail: string;
  /** The unique ID of the account that kicked off this build. */
  public readonly userId: string;

  /** Initializes a build from Heroku data. */
  private constructor(herokuRelease: any) {
    this.appId = herokuRelease.app.id;
    this.appName = herokuRelease.app.name;
    this.addonPlans = [];
    for (let i = 0; i < herokuRelease.addon_plan_names.length; ++i) {
      this.addonPlans.push(herokuRelease.addon_plan_names[i]);
    }
    this.createdAt = new Date(herokuRelease.created_at);
    this.current = herokuRelease.current;
    this.description = herokuRelease.description;
    this.id = herokuRelease.id;
    if (herokuRelease.slug) {
      this.slugId = herokuRelease.slug.id;
    } else {
      this.slugId = null;
    }
    this.status = herokuRelease.status;
    this.updatedAt = new Date(herokuRelease.updated_at);
    this.userEmail = herokuRelease.user.email;
    this.userId = herokuRelease.user.id;
  }

  /** Parses a Heroku release response. */
  public static fromHerokuRelease(herokuRelease: any): Release | null {
    if (typeof(herokuRelease) !== 'object') {
      return null;
    }

    if (typeof(herokuRelease.app) !== 'object' &&
        !Array.isArray(herokuRelease.addon_plan_names) ||
        typeof(herokuRelease.created_at) !== 'string' ||
        typeof(herokuRelease.current) !== 'boolean' ||
        typeof(herokuRelease.description) !== 'string' ||
        typeof(herokuRelease.id) !== 'string' ||
        (herokuRelease.slug !== null &&
         typeof(herokuRelease.slug) !== 'object') ||
        (herokuRelease.status !== 'failed' &&
         herokuRelease.status !== 'pending' &&
         herokuRelease.status !== 'succeeded') ||
        typeof(herokuRelease.updated_at) !== 'string' ||
        typeof(herokuRelease.user) !== 'object') {
      return null;
    }

    for (let i = 0; i < herokuRelease.addon_plan_names.length; ++i) {
      if (typeof(herokuRelease.addon_plan_names[i]) !== 'string') {
        return null;
      }
    }
    if (typeof(herokuRelease.app.id) !== 'string' ||
        typeof(herokuRelease.app.name) !== 'string') {
      return null;
    }
    if (herokuRelease.slug !== null &&
        typeof(herokuRelease.slug.id) !== 'string') {
      return null;
    }
    if (typeof(herokuRelease.user.email) !== 'string' ||
        typeof(herokuRelease.user.id) !== 'string') {
      return null;
    }

    return new Release(herokuRelease);
  }

  /** Creates an API server URL segment representing a release.
   *
   * If a string is given, it must be the release's ID.
   */
  public static toUrlSegment(release: Release | string): string {
    return (release instanceof Release) ? release.id : release;
  }
}
