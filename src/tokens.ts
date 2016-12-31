/** The JSON serialization of RefreshToken. */
export interface RefreshTokenJSON {
  /** The OAuth client ID associated with this token. */
  readonly clientId: string;

  /** The time when the readonly token expires. */
  readonly expiresAt: number;

  /** The refresh token token. */
  readonly token: string;
}

/** An OAuth 2.0 refresh token. */
export class RefreshToken {
  /** The OAuth client ID associated with this token. */
  private readonly clientId: string;

  /** The time when the readonly token expires. */
  private readonly expiresAt: Date;

  /** The refresh token token. */
  private readonly token: string;

  /** Creates an OAuth refresh token from a JSON representation. */
  public constructor(json: RefreshTokenJSON) {
    this.clientId = json.clientId;
    this.expiresAt = new Date(json.expiresAt);
    this.token = json.token;
  }

  /** ES5.1+ protocol for obtaining the JSON representation of an object. */
  public toJSON(): RefreshTokenJSON {
    return {
      clientId: this.clientId,
      expiresAt: this.expiresAt.valueOf(),
      token: this.token,
    };
  }
}

/** The JSON serialization of AccessToken. */
export interface AccessTokenJSON {
  /**
   * The time when the readonly token expires. null if the token never expires.
   *
   * Tokens obtained from direct authorization never expire.
   */
  readonly expiresAt: number | null;

  /** The authorization behind the access token. */
  readonly id: string;

  /** The refresh token token. */
  readonly token: string;
}

/** An OAuth 2.0 access token. */
export class AccessToken {
  /** Memoized Authorization HTTP header value. */
  private readonly _authorizationHeader: string;

  /** The time when the readonly token expires. */
  private readonly _expiresAt: Date | null;

  /** The authorization behind the access token. */
  private readonly _id: string;

  /** The refresh token token. */
  private readonly _token: string;

  /** Creates an OAuth 2.0 access token from a JSON representation. */
  public constructor(json: AccessTokenJSON) {
    this._expiresAt =
        (json.expiresAt === null) ? null : new Date(json.expiresAt);
    this._id = json.id;
    this._token = json.token;
    this._authorizationHeader = `Bearer ${this._token}`;
  }

  /** Extracts an OAuth 2.0 access token from a Heroku authorization. */
  public static fromHerokuAuthorization(
      referenceTimestamp: number, authorization: any): AccessToken | null {
    if (typeof(authorization) !== 'object') {
      return null;
    }

    if (typeof(authorization.id) !== 'string' ||
        typeof(authorization.access_token) !== 'object') {
      return null;
    }

    const token = authorization.access_token;
    if (typeof(token.token) !== 'string' || (token.expires_in !== null &&
        typeof(token.expires_in) !== 'number')) {
      return null;
    }

    const expiresAt: number | null = (token.expires_in === null) ? null :
        referenceTimestamp + token.expires_in;

    return new AccessToken({
      expiresAt: expiresAt, id: authorization.id as string,
      token: token.token as string,
    });
  }

  /** The Authorization HTTP header value that represents this token. */
  public authorizationHeader(): string {
    return this._authorizationHeader;
  }

  /** */
  public authorizationId(): string {
    return this._id;
  }

  /** ES5.1+ protocol for obtaining the JSON representation of an object. */
  public toJSON(): AccessTokenJSON {
    return {
      expiresAt: (this._expiresAt === null) ? null : this._expiresAt.valueOf(),
      id: this._id,
      token: this._token,
    };
  }
}
