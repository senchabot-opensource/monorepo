export interface IOctoOptions {
  auth: string | undefined;
}

export interface IIssueParams {
  state: "open" | "closed" | "all" | undefined;
  sort: "created" | "updated" | "comments" | undefined;
}

export interface ICreateLiveStreamEventParams {
  platformDomain: string;
}
