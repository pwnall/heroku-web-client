import { Account } from './account';
import { Addon } from './addon';
import { Attachment } from './attachment';
import { App } from './app';
import { Build } from './build';
import {
  CreateAppOptions, createAppOptionsToFetchBody,
} from './create_app_options';
import {
  CreateAttachmentOptions, createAttachmentOptionsToFetchBody,
} from './create_attachment_options';
import {
  CreateBuildOptions, createBuildOptionsToFetchBody,
} from './create_build_options';
import {
  CreateReleaseOptions, createReleaseOptionsToFetchBody,
} from './create_release_options';
import {
  CreateSlugOptions, createSlugOptionsToFetchBody,
} from './create_slug_options';
import {
  ConfigVarUpdates, configVarUpdatesToFetchBody,
} from './config_var_updates';
import { DirectCredential } from './direct_credential';
import { HerokuError } from './error';
import { Formation } from './formation';
import {
  FormationUpdates, formationUpdatesToFetchBody,
} from './formation_updates';
import { Plan } from './plan';
import { Region } from './region';
import { Release } from './release';
import { Slug } from './slug';
import { SourceLocation } from './source_location';
import { Stack } from './stack';
import { AccessToken } from './tokens';

export class Client {
  /** The origin for all the API URLs used by this client. */
  private readonly rootUrl: string;

  /** The access token used by this client's API calls. */
  private token: AccessToken | null;

  /** Creates a client without any credentials.
   *
   * The client needs a credential for most API calls to work.
   * @see Client#login
   */
  public constructor() {
    this.rootUrl = 'https://api.heroku.com';
    this.token = null;
  }

  /** Logs in with an email/password or an API key. */
  public login(credential: DirectCredential): Promise<AccessToken> {
    return fetch(`${this.rootUrl}/oauth/authorizations`, {
      body: JSON.stringify({}),
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': credential.authorizationHeader(),
        'Content-Type': 'application/json',
      },
      method: 'POST',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((authorizationJson: any) => {
      this.token = AccessToken.fromHerokuAuthorization(
          Date.now(), authorizationJson);
      return this.token;
    });
  }

  /**
   * Revokes the authorization for the client's token.
   *
   * After calling this method, all calls that rely on a token will fail.
   */
  public revokeAuthorization(): Promise<boolean> {
    const id = this.token.authorizationId();
    return fetch(`${this.rootUrl}/oauth/authorizations/${id}`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
      },
      method: 'DELETE',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then(() => {
      this.token = null;
      return true;
    });
  }

  /** Obtains information about the user who owns this client's token. */
  public account(): Promise<Account> {
    return fetch(`${this.rootUrl}/account`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
      },
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((accountJson: any) => {
      return Account.fromHerokuAccount(accountJson);
    });
  }

  /** Obtains information about a single Heroku addon. */
  public addon(addon: Addon | string): Promise<Addon> {
    const addonId = Addon.toUrlSegment(addon);
    return fetch(`${this.rootUrl}/addon-services/${addonId}`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
      },
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuAddonService: any) => {
      return Addon.fromHerokuAddonService(herokuAddonService);
    });
  }

  /** Obtains detailed information about Heroku's addons. */
  public addons(): Promise<Addon[]> {
    return fetch(`${this.rootUrl}/addon-services/`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
      },
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuAddonServices: any) => {
      const addons: Addon[] = [];
      for (let i = 0; i < herokuAddonServices.length; ++i) {
        const addon = Addon.fromHerokuAddonService(herokuAddonServices[i]);
        if (addon === null) {
          continue;
        }
        addons.push(addon);
      }
      return addons;
    });
  }

  /** Obtains information about the pricing plans for a Heroku addon. */
  public plans(addon: Addon | string): Promise<Plan[]> {
    const addonId = Addon.toUrlSegment(addon);
    return fetch(`${this.rootUrl}/addon-services/${addonId}/plans`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
      },
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuPlans: any) => {
      const plans: Plan[] = [];
      for (let i = 0; i < herokuPlans.length; ++i) {
        const plan = Plan.fromHerokuPlan(herokuPlans[i]);
        if (plan === null) {
          continue;
        }
        plans.push(plan);
      }
      return plans;
    });
  }

  /** Obtains detailed information about Heroku's regions. */
  public regions(): Promise<Region[]> {
    return fetch(`${this.rootUrl}/regions/`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
      },
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuRegions: any) => {
      const regions: Region[] = [];
      for (let i = 0; i < herokuRegions.length; ++i) {
        const region = Region.fromHerokuRegion(herokuRegions[i]);
        if (region === null) {
          continue;
        }
        regions.push(region);
      }
      return regions;
    });
  }

  /** Obtains detailed information about Heroku's application environments. */
  public stacks(): Promise<Stack[]> {
    return fetch(`${this.rootUrl}/stacks/`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
      },
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuStacks: any) => {
      const stacks: Stack[] = [];
      for (let i = 0; i < herokuStacks.length; ++i) {
        const stack = Stack.fromHerokuStack(herokuStacks[i]);
        if (stack === null) {
          continue;
        }
        stacks.push(stack);
      }
      return stacks;
    });
  }

  /** Obtains the user's Heroku applications. */
  public apps(): Promise<App[]> {
    return fetch(`${this.rootUrl}/apps/`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
      },
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuApps: any) => {
      const apps: App[] = [];
      for (let i = 0; i < herokuApps.length; ++i) {
        const app = App.fromHerokuApp(herokuApps[i]);
        if (app === null) {
          continue;
        }
        apps.push(app);
      }
      return apps;
    });
  }

  /** Gets information about one of the user's Heroku applications. */
  public app(app: App | string): Promise<App> {
    const appId = App.toUrlSegment(app);
    return fetch(`${this.rootUrl}/apps/${appId}`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
      },
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuApp: any) => {
      return App.fromHerokuApp(herokuApp);
    });
  }

  /** Creates a new Heroku application. */
  public createApp(options: CreateAppOptions): Promise<App> {
    return fetch(`${this.rootUrl}/apps/`, {
      body: createAppOptionsToFetchBody(options),
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
        'Content-Type': 'application/json',
      },
      method: 'POST',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuApp: any) => {
      return App.fromHerokuApp(herokuApp);
    });
  }

  /** Deletes a Heroku application. */
  public deleteApp(app: App | string): Promise<App> {
    const appId: string = App.toUrlSegment(app);
    return fetch(`${this.rootUrl}/apps/${appId}`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
      },
      method: 'DELETE',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuApp: any) => {
      return App.fromHerokuApp(herokuApp);
    });
  }

  /** Fetches an attachment's information. */
  public attachment(app: App | string, attachment: Attachment | string):
      Promise<Attachment> {
    const appId = App.toUrlSegment(app);
    const attachmentId = Attachment.toUrlSegment(attachment);
    return fetch(`${this.rootUrl}/apps/${appId}/addons/${attachmentId}`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
      },
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuAddon: any) => {
      return Attachment.fromHerokuAddon(herokuAddon);
    });
  }

  /** Fetches an application's attachments. */
  public attachments(app: App | string): Promise<Attachment[]> {
    const appId = App.toUrlSegment(app);
    return fetch(`${this.rootUrl}/apps/${appId}/addons`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
      },
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuAddons: any) => {
      const attachments: Attachment[] = [];
      for (let i = 0; i < herokuAddons.length; ++i) {
        const attachment = Attachment.fromHerokuAddon(herokuAddons[i]);
        if (attachment === null) {
          continue;
        }
        attachments.push(attachment);
      }
      return attachments;
    });
  }

  /** Creates a Heroku attachment (add-on installation) for an application. */
  public createAttachment(app: App, options: CreateAttachmentOptions):
      Promise<Attachment> {
    const appId = App.toUrlSegment(app);
    return fetch(`${this.rootUrl}/apps/${appId}/addons`, {
      body: createAttachmentOptionsToFetchBody(options),
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
        'Content-Type': 'application/json',
      },
      method: 'POST',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuAddon: any) => {
      return Attachment.fromHerokuAddon(herokuAddon);
    });
  }

  /** Removes an attachment (un-installs an add-on from an app). */
  public deleteAttachment(app: App | string, attachment: Attachment | string):
      Promise<Attachment> {
    const appId = App.toUrlSegment(app);
    const attachmentId = Attachment.toUrlSegment(attachment);
    return fetch(`${this.rootUrl}/apps/${appId}/addons/${attachmentId}`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
      },
      method: 'DELETE',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuAddon: any) => {
      return Attachment.fromHerokuAddon(herokuAddon);
    });
  }

  /** Waits for a attachment to leave the provisioning state. */
  public waitForAttachment(
      app: App | string, attachment: Attachment | string,
      milliseconds: number = 60000): Promise<Attachment> {
    const stopWaitingAt = Date.now() + milliseconds;
    const step = (): Promise<Attachment> => {
      return this.attachment(app, attachment).then((newAttachment) => {
        if (newAttachment.state !== 'provisioning') {
          return newAttachment;
        }
        if (Date.now() > stopWaitingAt) {
          throw new Error('Timed out waiting for the Heroku attachment');
        }
        return new Promise((resolve) => {
          // Wait between checks so we don't hammer Heroku's API and run out of
          // quota if the user has a fast Internet connection.
          setTimeout(resolve, 1000);
        }).then(() => step());
      });
    };
    return step();
  }

  /** Fetches a build's information. */
  public build(app: App | string, build: Build | string): Promise<Build> {
    const appId = App.toUrlSegment(app);
    const buildId: string = Build.toUrlSegment(build);
    return fetch(`${this.rootUrl}/apps/${appId}/builds/${buildId}`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
      },
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuBuild: any) => {
      return Build.fromHerokuBuild(herokuBuild);
    });
  }

  /** Fetches an application's builds. */
  public builds(app: App | string): Promise<Build[]> {
    const appId = App.toUrlSegment(app);
    return fetch(`${this.rootUrl}/apps/${appId}/builds`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
      },
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuBuilds: any) => {
      const builds: Build[] = [];
      for (let i = 0; i < herokuBuilds.length; ++i) {
        const build = Build.fromHerokuBuild(herokuBuilds[i]);
        if (build === null) {
          continue;
        }
        builds.push(build);
      }
      return builds;
    });
  }

  /** Creates a Heroku build for an application. */
  public createBuild(app: App, options: CreateBuildOptions): Promise<Build> {
    const appId = App.toUrlSegment(app);
    return fetch(`${this.rootUrl}/apps/${appId}/builds`, {
      body: createBuildOptionsToFetchBody(options),
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
        'Content-Type': 'application/json',
      },
      method: 'POST',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuBuild: any) => {
      return Build.fromHerokuBuild(herokuBuild);
    });
  }

  /** Waits for a build to leave the pending state. */
  public waitForBuild(
      app: App | string, build: Build | string, milliseconds: number = 60000):
      Promise<Build> {
    const stopWaitingAt = Date.now() + milliseconds;
    const step = (): Promise<Build> => {
      return this.build(app, build).then((newBuild) => {
        if (newBuild.status !== 'pending') {
          return newBuild;
        }
        if (Date.now() > stopWaitingAt) {
          throw new Error('Timed out waiting for the Heroku build');
        }
        return new Promise((resolve) => {
          // Wait between checks so we don't hammer Heroku's API and run out of
          // quota if the user has a fast Internet connection.
          setTimeout(resolve, 1000);
        }).then(() => step());
      });
    };
    return step();
  }

  /** Fetches an application's configuration (environment) variables. */
  public configVars(app: App | string): Promise<{[name: string]: string}> {
    const appId = App.toUrlSegment(app);
    return fetch(`${this.rootUrl}/apps/${appId}/config-vars`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
      },
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuConfigVars: any) => {
      // TODO(pwnall): Is this worth parsing and error-checking?
      return herokuConfigVars as {[name: string]: string};
    });
  }

  /** Creates a Heroku build for an application. */
  public updateConfigVars(app: App, updates: ConfigVarUpdates):
      Promise<{[name: string]: string}> {
    const appId = App.toUrlSegment(app);
    return fetch(`${this.rootUrl}/apps/${appId}/config-vars`, {
      body: configVarUpdatesToFetchBody(updates),
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuConfigVars: any) => {
      // TODO(pwnall): Is this worth parsing and error-checking?
      return herokuConfigVars as {[name: string]: string};
    });
  }

  /** Fetches an application's dynos running predefined process types. */
  public formations(app: App | string): Promise<Formation[]> {
    const appId = App.toUrlSegment(app);
    return fetch(`${this.rootUrl}/apps/${appId}/formation`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
      },
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuFormations: any) => {
      const formations: Formation[] = [];
      for (let i = 0; i < herokuFormations.length; ++i) {
        const formation = Formation.fromHerokuFormation(herokuFormations[i]);
        if (formation === null) {
          continue;
        }
        formations.push(formation);
      }
      return formations;
    });
  }

  /** Updates an application's formations (dynos running process types). */
  public updateFormations(app: App | string, updates: FormationUpdates):
      Promise<Formation[]> {
    const appId = App.toUrlSegment(app);
    return fetch(`${this.rootUrl}/apps/${appId}/formation`, {
      body: formationUpdatesToFetchBody(updates),
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuFormations: any) => {
      const formations: Formation[] = [];
      for (let i = 0; i < herokuFormations.length; ++i) {
        const formation = Formation.fromHerokuFormation(herokuFormations[i]);
        if (formation === null) {
          continue;
        }
        formations.push(formation);
      }
      return formations;
    });
  }

  /** Fetches a release's information. */
  public release(app: App | string, release: Release | string):
      Promise<Release> {
    const appId = App.toUrlSegment(app);
    const releaseId: string = Release.toUrlSegment(release);
    return fetch(`${this.rootUrl}/apps/${appId}/releases/${releaseId}`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
      },
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuRelease: any) => {
      return Release.fromHerokuRelease(herokuRelease);
    });
  }

  /** Fetches an application's releases. */
  public releases(app: App | string): Promise<Release[]> {
    const appId = App.toUrlSegment(app);
    return fetch(`${this.rootUrl}/apps/${appId}/releases`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
      },
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuReleases: any) => {
      const releases: Release[] = [];
      for (let i = 0; i < herokuReleases.length; ++i) {
        const release = Release.fromHerokuRelease(herokuReleases[i]);
        if (release === null) {
          continue;
        }
        releases.push(release);
      }
      return releases;
    });
  }

  /** Creates a Heroku release for an application. */
  public createRelease(app: App, options: CreateReleaseOptions):
      Promise<Release> {
    const appId = App.toUrlSegment(app);
    return fetch(`${this.rootUrl}/apps/${appId}/releases`, {
      body: createReleaseOptionsToFetchBody(options),
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
        'Content-Type': 'application/json',
      },
      method: 'POST',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuRelease: any) => {
      return Release.fromHerokuRelease(herokuRelease);
    });
  }

  /** Waits for a release to leave the pending state. */
  public waitForRelease(
      app: App | string, release: Release | string,
      milliseconds: number = 60000): Promise<Release> {
    const stopWaitingAt = Date.now() + milliseconds;
    const step = (): Promise<Release> => {
      return this.release(app, release).then((newRelease) => {
        if (newRelease.status !== 'pending') {
          return newRelease;
        }
        if (Date.now() > stopWaitingAt) {
          throw new Error('Timed out waiting for the Heroku release');
        }
        return new Promise((resolve) => {
          // Wait between checks so we don't hammer Heroku's API and run out of
          // quota if the user has a fast Internet connection.
          setTimeout(resolve, 1000);
        }).then(() => step());
      });
    };
    return step();
  }

  /** Fetches a slug's information. */
  public slug(app: App | string, slug: Slug | string): Promise<Slug> {
    const appId = App.toUrlSegment(app);
    const slugId: string = Slug.toUrlSegment(slug);
    return fetch(`${this.rootUrl}/apps/${appId}/slugs/${slugId}`, {
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
      },
      method: 'GET',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuSlug: any) => {
      return Slug.fromHerokuSlug(herokuSlug);
    });
  }

  /** Creates a Heroku slug for an application.
   *
   * The slug is empty right after being created. The slug's contents must be
   * uploaded to the slug's blob URL using a HTTP request with the slug's blob
   * method.
   */
  public createSlug(app: App, options: CreateSlugOptions): Promise<Slug> {
    const appId = App.toUrlSegment(app);
    return fetch(`${this.rootUrl}/apps/${appId}/slugs`, {
      body: createSlugOptionsToFetchBody(options),
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
        'Content-Type': 'application/json',
      },
      method: 'POST',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuSlug: any) => {
      return Slug.fromHerokuSlug(herokuSlug);
    });
  }

  /** Creates a Heroku-managed location for uploading a source archive.
   *
   * The location is valid for a limited time. Source locations are expected to
   * be used as arguments to createBuild, when the source archive is not
   * already published to an URL.
   */
  public createSourceLocation(): Promise<SourceLocation> {
    return fetch(`${this.rootUrl}/sources`, {
      body: '{}',
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': this.token.authorizationHeader(),
        'Content-Type': 'application/json',
      },
      method: 'POST',
      referrer: 'no-referrer',
    }).then((response: Response) => {
      return HerokuError.parseResponse(response);
    }).then((response: Response) => {
      return response.json();
    }).then((herokuSource: any) => {
      return SourceLocation.fromHerokuSource(herokuSource);
    });
  }
}
