/** A Heroku region. */
export class Region {
  /** Area in the country where the region's data centers are located. */
  public readonly area: string;
  /** The country where the region's data centers are located. */
  public readonly country: string;
  /** The region's description. Presumably user-friendly. */
  public readonly description: string;
  /** The region's unique ID. Regions can be identified by ID or name. */
  public readonly id: string;
  /** The region's unique name. Regions can be identified by ID or name. */
  public readonly name: string;
  /** The provider hosting this region's containers. */
  public readonly providerName: string;
  /** The provider-specific region name where the containers are hosted. */
  public readonly providerRegion: string;

  /** Initializes a region from Heroku data. */
  private constructor(herokuRegion: any) {
    this.area = herokuRegion.locale;
    this.country = herokuRegion.country;
    this.description = herokuRegion.description;
    this.id = herokuRegion.id;
    this.name = herokuRegion.name;
    this.providerName = herokuRegion.provider.name;
    this.providerRegion = herokuRegion.provider.region;
  }

  /** Parses a Heroku region response. */
  public static fromHerokuRegion(herokuRegion: any): Region | null {
    if (typeof(herokuRegion) !== 'object') {
      return null;
    }

    if (typeof(herokuRegion.country) !== 'string' ||
        typeof(herokuRegion.description) !== 'string' ||
        typeof(herokuRegion.id) !== 'string' ||
        typeof(herokuRegion.locale) !== 'string' ||
        typeof(herokuRegion.name) !== 'string' ||
        typeof(herokuRegion.provider) !== 'object') {
      return null;
    }

    if (typeof(herokuRegion.provider.name) !== 'string' ||
        typeof(herokuRegion.provider.region) !== 'string') {
      return null;
    }

    return new Region(herokuRegion);
  }
}
