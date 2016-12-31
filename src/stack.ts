/** A Heroku application environment. */
export class Stack {
  /** The environment's unique ID. Stacks can be identified by ID or name. */
  public readonly id: string;
  /** The environment's unique name. Stacks can be identified by ID or name. */
  public readonly name: string;
  /** The availability of the environment. */
  public readonly availability: string;

  /** Initializes an application environment from Heroku data. */
  private constructor(herokuStack: any) {
    this.id = herokuStack.id;
    this.name = herokuStack.name;
    this.availability = herokuStack.state;
  }

  /** Parses a Heroku stack response. */
  public static fromHerokuStack(herokuStack: any): Stack | null {
    if (typeof(herokuStack) !== 'object') {
      return null;
    }

    if (typeof(herokuStack.id) !== 'string' ||
        typeof(herokuStack.name) !== 'string' ||
        typeof(herokuStack.state) !== 'string') {
      return null;
    }

    return new Stack(herokuStack);
  }
}
