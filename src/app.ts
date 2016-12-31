/** A Heroku application environment. */
export class App {
  /** The unique ID of the environment used by the app's buildpack. */
  public readonly buildStackId: string;
  /** The unique name of the environment used by the app's buildpack. */
  public readonly buildStackName: string;
  /** A description provided by the buildpack used by the application. */
  public readonly buildpackDescription: string | null;
  /** The time when the Heroku application was created. */
  public readonly createdAt: Date;
  /** The URL of the git repository that hosts the application's source.
   *
   * The application can be updated by pushing code to the repository.
   */
  public readonly gitUrl: string;
  /** The application's unique ID. Apps can be identified by ID or name. */
  public readonly id: string;
  /** True if the application was taken offline for dev ops. */
  public readonly inMaintenanceMode: boolean;
  /** The application's unique name. Apps can be identified by ID or name. */
  public readonly name: string;
  /** The time of the most release for the Heroku application. */
  public readonly releasedAt: Date;
  /** The e-mail address of the account that owns this application. */
  public readonly ownerEmail: string;
  /** The unique ID of the account that owns this application. */
  public readonly ownerId: string;
  /** The unique ID of the region where the application is hosted. */
  public readonly regionId: string;
  /** The unique name of the region where the application is hosted. */
  public readonly regionName: string;
  /** The size (in bytes) of the application's git repository. */
  public readonly repositorySize: number | null;
  /** The size (in bytes) of the application's slug. */
  public readonly slugSize: number | null;
  /** The unique ID of the environment used by the application. */
  public readonly stackId: string;
  /** The unique name of the environment used by the application. */
  public readonly stackName: string;
  /** The time when the Heroku application was changed most recently. */
  public readonly updatedAt: Date;
  /** The URL at which the Heroku application is available. */
  public readonly webUrl: string;

  /** Initializes an application from Heroku data. */
  private constructor(herokuApp: any) {
    if (herokuApp.build_stack) {
      this.buildStackId = herokuApp.build_stack.id;
      this.buildStackName = herokuApp.build_stack.name;
    } else {
      this.buildStackId = null;
      this.buildStackName = null;
    }
    this.buildpackDescription = herokuApp.buildpack_provided_description;
    this.createdAt = new Date(herokuApp.created_at);
    if ('git_url' in herokuApp) {
      this.gitUrl = herokuApp.git_url;
    } else {
      this.gitUrl = null;
    }
    this.id = herokuApp.id;
    this.inMaintenanceMode = herokuApp.maintenance;
    this.name = herokuApp.name;
    this.ownerEmail = herokuApp.owner.email;
    this.ownerId = herokuApp.owner.id;
    this.regionId = herokuApp.region.id;
    this.regionName = herokuApp.region.name;
    this.releasedAt = new Date(herokuApp.released_at);
    this.repositorySize = herokuApp.repo_size;
    this.slugSize = herokuApp.slug_size;
    this.stackId = herokuApp.stack.id;
    this.stackName = herokuApp.stack.name;
    this.updatedAt = new Date(herokuApp.updated_at);
    this.webUrl = herokuApp.web_url;
  }

  /** Parses a Heroku app response. */
  public static fromHerokuApp(herokuApp: any): App | null {
    if (typeof(herokuApp) !== 'object') {
      return null;
    }

    if (typeof(herokuApp.build_stack) !== 'object' ||
        (herokuApp.buildpack_provided_description !== null &&
         typeof(herokuApp.buildpack_provided_description) !== 'string') ||
        typeof(herokuApp.created_at) !== 'string' ||
        typeof(herokuApp.git_url) !== 'string' ||
        typeof(herokuApp.id) !== 'string' ||
        typeof(herokuApp.maintenance) !== 'boolean' ||
        typeof(herokuApp.name) !== 'string' ||
        typeof(herokuApp.owner) !== 'object' ||
        typeof(herokuApp.region) !== 'object' ||
        (herokuApp.repo_size !== null &&
         typeof(herokuApp.repo_size) !== 'number') ||
        (herokuApp.released_at !== null &&
         typeof(herokuApp.released_at) !== 'string') ||
        (herokuApp.slug_size !== null &&
         typeof(herokuApp.slug_size) !== 'number') ||
        typeof(herokuApp.stack) !== 'object' ||
        typeof(herokuApp.updated_at) !== 'string' ||
        typeof(herokuApp.web_url) !== 'string') {
      return null;
    }

    if (typeof(herokuApp.build_stack.id) !== 'string' ||
        typeof(herokuApp.build_stack.name) !== 'string') {
      return null;
    }
    if (typeof(herokuApp.owner.email) !== 'string' ||
        typeof(herokuApp.owner.id) !== 'string') {
      return null;
    }
    if (typeof(herokuApp.region.id) !== 'string' ||
        typeof(herokuApp.region.name) !== 'string') {
      return null;
    }
    if (typeof(herokuApp.stack.id) !== 'string' ||
        typeof(herokuApp.stack.name) !== 'string') {
      return null;
    }

    return new App(herokuApp);
  }

  /** Verifies if the given string is a valid Heroku app name. */
  public static isValidName(name: string): boolean {
    return /^[a-z][a-z0-9-]{2,29}$/.test(name);
  }

  /** Creates an API server URL segment representing an application.
   *
   * If a string is given, it can be the application's name or ID.
   */
  public static toUrlSegment(app: App | string): string {
    return (app instanceof App) ? app.id : app;
  }
}
