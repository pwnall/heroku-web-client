import { SourceBlob } from './source_blob';

/** The process of building a slug (filesystem archive) from source code. */
export class Build {
  /** The ID of the application that owns the slug produced by the build. */
  public readonly appId: string;
  /** URLs to the repository URLs for the buildpacks used by this build. */
  public readonly buildpackUrls: string[] | null;
  /** The time when the slug was created. */
  public readonly createdAt: Date;
  /** The build's unique ID. */
  public readonly id: string;
  /** The URL of a stream containing the build's output. */
  public readonly outputStreamUrl: string;
  /** ID of the release produced by the build. */
  public readonly releaseId: string | null;
  /** ID of the slug produced by the build. */
  public readonly slugId: string | null;
  /** The build's state. */
  public readonly status: 'failed' | 'pending' | 'succeeded';
  /** The source code used by this build. */
  public readonly sourceBlob: SourceBlob;
  /** The time when the Heroku application was changed most recently. */
  public readonly updatedAt: Date;
  /** The e-mail address of the account that kicked off this build. */
  public readonly userEmail: string;
  /** The unique ID of the account that kicked off this build. */
  public readonly userId: string;

  /** Initializes a build from Heroku data. */
  private constructor(herokuBuild: any, sourceBlob: SourceBlob) {
    this.appId = herokuBuild.app.id;
    if (herokuBuild.buildpacks) {
      this.buildpackUrls = [];
      for (let i = 0; i < herokuBuild.buildpacks.length; ++i) {
        this.buildpackUrls.push(herokuBuild.buildpacks[i].url);
      }
    } else {
      this.buildpackUrls = null;
    }
    this.createdAt = new Date(herokuBuild.created_at);
    this.id = herokuBuild.id;
    this.outputStreamUrl = herokuBuild.output_stream_url;
    if (herokuBuild.release) {
      this.releaseId = herokuBuild.release.id;
    } else {
      this.releaseId = null;
    }
    if (herokuBuild.slug) {
      this.slugId = herokuBuild.slug.id;
    } else {
      this.slugId = null;
    }
    this.sourceBlob = sourceBlob;
    this.status = herokuBuild.status;
    this.updatedAt = new Date(herokuBuild.updated_at);
    this.userEmail = herokuBuild.user.email;
    this.userId = herokuBuild.user.id;
  }

  /** Parses a Heroku build response. */
  public static fromHerokuBuild(herokuBuild: any): Build | null {
    if (typeof(herokuBuild) !== 'object') {
      return null;
    }

    if (typeof(herokuBuild.app) !== 'object' &&
        (herokuBuild.buildpacks !== null &&
         !Array.isArray(herokuBuild.buildpacks)) ||
        typeof(herokuBuild.created_at) !== 'string' ||
        typeof(herokuBuild.id) !== 'string' ||
        typeof(herokuBuild.output_stream_url) !== 'string' ||
        (herokuBuild.release !== null &&
         typeof(herokuBuild.release) !== 'object') ||
        (herokuBuild.slug !== null &&
         typeof(herokuBuild.slug) !== 'object') ||
        (herokuBuild.status !== 'failed' && herokuBuild.status !== 'pending' &&
         herokuBuild.status !== 'succeeded') ||
        typeof(herokuBuild.updated_at) !== 'string' ||
        typeof(herokuBuild.user) !== 'object') {
      return null;
    }

    if (typeof(herokuBuild.app.id) !== 'string') {
      return null;
    }
    if (herokuBuild.buildpacks !== null) {
      for (let buildPack of herokuBuild.buildpacks) {
        if (typeof(buildPack) !== 'object' ||
            typeof(buildPack.url) !== 'string') {
          return null;
        }
      }
    }
    if (herokuBuild.release !== null &&
        typeof(herokuBuild.release.id) !== 'string') {
      return null;
    }
    if (herokuBuild.slug !== null &&
        typeof(herokuBuild.slug.id) !== 'string') {
      return null;
    }
    const sourceBlob = SourceBlob.fromHerokuBlob(herokuBuild.source_blob);
    if (sourceBlob === null) {
      return null;
    }
    if (typeof(herokuBuild.user.email) !== 'string' ||
        typeof(herokuBuild.user.id) !== 'string') {
      return null;
    }

    return new Build(herokuBuild, sourceBlob);
  }

  /** Creates an API server URL segment representing a build.
   *
   * If a string is given, it must be the build's ID.
   */
  public static toUrlSegment(build: Build | string): string {
    return (build instanceof Build) ? build.id : build;
  }
}
