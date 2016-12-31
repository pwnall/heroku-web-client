export class HerokuError extends Error {
  /** Identifier representing the HTTP error code. */
  public readonly id: string;

  /** Pointer to more information. */
  public readonly url: string;

  /** Creates an Error representing an error response from Heroku. */
  private constructor(id: string, message: string, url: string) {
    super(message);
    this.id = id;
    this.url = url;
  }

  /** Attempts to extract a Heroku error out of a fetch response.
   *
   * @param response the fetch response
   * @return a promise that resolves to given response, or rejects as a
   *   HerokuError if the response contains an error
   */
  public static parseResponse(response: Response): Promise<Response> {
    const defaultUrl: string =
        'https://devcenter.heroku.com/articles/platform-api-reference';

    const status = response.status;
    if (status < 400) {
      return Promise.resolve(response);
    }

    return response.json().catch((syntaxError) => {  // Heroku error.
      return Promise.reject(new HerokuError(
          `status_${status}`,
          'The Heroku API server response contained invalid JSON: ' +
          syntaxError.message,
          defaultUrl));
    }).then((json) => Promise.reject(new HerokuError(
        (json.id || 'missing_id').toString(),
        (json.message || '(Heroku error missing message)').toString(),
        (json.url || defaultUrl).toString())));
  }
}
