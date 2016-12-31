/** The JSON serialization of DirectCredential. */
export interface DirectCredentialJSON {
  /** The user's email. */
  readonly email: string;

  /** The user's password or API key. */
  readonly password: string;
}

/**
 * Credentials used for direct authentication.
 *
 * @see https://devcenter.heroku.com/articles/oauth#direct-authorization
 */
export class DirectCredential {
  /** The user's email. */
  private readonly email: string;
  /** The user's password or API key. */
  private readonly password: string;

  /** Creates a credential wrapping a user's email and password. */
  public constructor(json: DirectCredentialJSON) {
    this.email = json.email;
    this.password = json.password;
  }

  /** Creates a credential wrapping a user's API key. */
  public static fromApiKey(apiKey: string): DirectCredential {
    return new DirectCredential({ email: '', password: apiKey });
  }

  /** The Authorization HTTP header value that represents this credential. */
  public authorizationHeader(): string {
    return `Basic ${btoa(`${this.email}:${this.password}`)}`;
  }

  /** ES5.1+ protocol for obtaining the JSON representation of an object. */
  public toJSON(): DirectCredentialJSON {
    return { email: this.email, password: this.password };
  }
}
