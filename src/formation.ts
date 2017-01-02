/** A set of Heroku processes set to run the same process type in an app. */
export class Formation {
  /** The application's unique ID. */
  public readonly appId: string;
  /** The application's globally unique name. */
  public readonly appName: string;
  /** The command line used to launch the processes. */
  public readonly command: string;
  /** The time when the process type was created. */
  public readonly createdAt: Date;
  /** The type (size) of Heroku dyno used to run these processes. */
  public readonly dynoType: string;
  /** Unique identifier for the process type.
   *
   * Formations can be identified by ID or by process type.
   */
  public readonly id: string;
  /** The name of the process type ran by the processes in this formation.
   *
   * Formations can be identified by ID or by process type.
   */
  public readonly processType: string;
  /** The number of processes of this type. */
  public readonly quantity: number;
  /** The time when the dyno type was changed most recently. */
  public readonly updatedAt: Date;

  /** Initializes an add-on from Heroku data. */
  private constructor(herokuFormation: any) {
    this.appId = herokuFormation.app.id;
    this.appName = herokuFormation.app.name;
    this.command = herokuFormation.command;
    this.createdAt = new Date(herokuFormation.created_at);
    this.dynoType = herokuFormation.size;
    this.id = herokuFormation.id;
    this.processType = herokuFormation.type;
    this.quantity = herokuFormation.quantity;
    this.updatedAt = new Date(herokuFormation.updated_at);
  }

  /** Parses a Heroku add-on response. */
  public static fromHerokuFormation(herokuFormation: any): Formation | null {
    if (typeof(herokuFormation) !== 'object') {
      return null;
    }

    if (typeof(herokuFormation.app) !== 'object' ||
        typeof(herokuFormation.command) !== 'string' ||
        typeof(herokuFormation.created_at) !== 'string' ||
        typeof(herokuFormation.id) !== 'string' ||
        typeof(herokuFormation.quantity) !== 'number' ||
        typeof(herokuFormation.size) !== 'string' ||
        typeof(herokuFormation.type) !== 'string' ||
        typeof(herokuFormation.updated_at) !== 'string') {
      return null;
    }

    if (typeof(herokuFormation.app.id) !== 'string' ||
        typeof(herokuFormation.app.name) !== 'string') {
      return null;
    }

    return new Formation(herokuFormation);
  }

}
