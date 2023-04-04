import { Octokit } from "@octokit/rest";
import { IIssueParams, IOctoOptions } from "../types";
import { env } from "../utils/env";

class OctoHandler {
  private octokit;
  private orgName;

  constructor(octoOptions: IOctoOptions) {
    this.octokit = new Octokit(octoOptions);
    this.orgName = "kamp-us";
  }

  // TeachMeJS çok güzel bir abimiz <3.

  async getWeeklyIssues(params: IIssueParams) {
    const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
    const date = this.getISODate(ONE_WEEK_IN_MS);
    const orgRepos = await this.getOrgRepos();

    const issues = await Promise.all(
      orgRepos.data.map(async (repo) => {
        const issuesListForRepo = await this.octokit.rest.issues.listForRepo({
          owner: repo.owner.login,
          repo: repo.name,
          state: params.state,
          sort: params.sort,
          since: date,
        });

        return issuesListForRepo.data
          .filter((issue) => issue.pull_request === undefined)
          .map((issue) => ({
            repoName: repo.name,
            issueTitle: issue.title,
            issueBody: issue.body,
          }));
      })
    );

    return issues.filter((arr) => arr.length > 0);
  }

  async getWeeklyPRs(params: IIssueParams) {
    const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
    const date = this.getISODate(ONE_WEEK_IN_MS);
    const orgRepos = await this.getOrgRepos();

    const prs = await Promise.all(
      orgRepos.data.map(async (repo) => {
        const issuesListForRepo = await this.octokit.rest.issues.listForRepo({
          owner: repo.owner.login,
          repo: repo.name,
          state: params.state,
          sort: params.sort,
          since: date,
        });

        return issuesListForRepo.data
          .filter((issue) => issue.pull_request !== undefined)
          .map((issue) => ({
            repoName: repo.name,
            prTitle: issue.title,
            prBody: issue.body,
          }));
      })
    );

    return prs.filter((arr) => arr.length > 0);
  }

  async getWeeklyForks() {
    const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
    const date = this.getISODate(ONE_WEEK_IN_MS);
    const orgRepos = await this.getOrgRepos();

    const forks = await Promise.all(
      orgRepos.data.map(async (repo) => {
        const forkListForRepo = await this.octokit.rest.repos.listForks({
          owner: repo.owner.login,
          repo: repo.name,
          since: date,
        });

        return forkListForRepo.data.map((fork) => ({
          repoName: repo.name,
          forkRepoName: fork.name,
          forkOwnerName: fork.owner.login,
        }));
      })
    );

    return forks.filter((arr) => arr.length > 0);
  }

  async getOrgRepos() {
    const orgRepos = await this.octokit.rest.repos.listForOrg({
      org: this.orgName,
    });
    return orgRepos;
  }

  private getISODate(timeInMs: number): string {
    const since = Date.now() - timeInMs;

    const date = new Date(since).toISOString();
    return date;
  }

  getHandler() {
    return this.octokit;
  }

  set organization(orgName: string) {
    this.orgName = orgName;
  }

  get organization() {
    return this.orgName;
  }
}

const octoHandler = new OctoHandler({ auth: env.GITHUB_SECRET });

export { octoHandler };
