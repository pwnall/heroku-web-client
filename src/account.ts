export class Account {
  /** True if the account allows Heroku to use 3rd party activity tracking. */
  public readonly allowsTracking: boolean;
  /** True if the account has access to Heroku's beta features. */
  public readonly canAccessBeta: boolean;
  /** The e-mail address associated with the account. */
  public readonly email: string;
  /** The account's unique ID. Accounts can be identified by ID or email. */
  public readonly id: string;
  /** True if the account has provided verified billing info.
   *
   * If true, the account enjoys more generous free quotas.
   */
  public readonly isVerified: boolean;
  /** The full name of the user's account. */
  public readonly name: string;
  /** Phone number where the account wishes to receive SMS messages. */
  public readonly smsNumber: string | null;

  /** Initializes an account from Heroku data. */
  private constructor(herokuAccount: any) {
    this.allowsTracking = herokuAccount.allow_tracking;
    this.canAccessBeta = herokuAccount.beta;
    this.email = herokuAccount.email;
    this.id = herokuAccount.id;
    this.isVerified = herokuAccount.verified;
    this.name = herokuAccount.name;
    this.smsNumber = herokuAccount.sms_number;
  }

  /** Parses a Heroku account response. */
  public static fromHerokuAccount(herokuAccount: any): Account | null {
    if (typeof(herokuAccount) !== 'object') {
      return null;
    }

    if (typeof(herokuAccount.allow_tracking) !== 'boolean' ||
        typeof(herokuAccount.beta) !== 'boolean' ||
        typeof(herokuAccount.email) !== 'string' ||
        typeof(herokuAccount.id) !== 'string' ||
        typeof(herokuAccount.name) !== 'string' ||
        (herokuAccount.sms_number !== null &&
         typeof(herokuAccount.sms_number) !== 'string') ||
        typeof(herokuAccount.verified) !== 'boolean') {
      return null;
    }

    return new Account(herokuAccount);
  }
}
