declare module "tmi.js" {
  export interface ClientOptions {
    connection?: {
      secure?: boolean;
      reconnect?: boolean;
      maxReconnectAttempts?: number;
      maxReconnectInterval?: number;
    };
    channels?: string[];
    identity?: {
      username?: string;
      password?: string;
    };
    options?: {
      debug?: boolean;
    };
  }

  export interface Userstate {
    username?: string;
    "display-name"?: string;
    mod?: boolean | number | string;
    subscriber?: boolean | number | string;
    badges?: Record<string, string> | null;
    [key: string]: unknown;
  }

  export class Client {
    constructor(options: ClientOptions);
    on(event: string, listener: (...args: any[]) => void): this;
    connect(): Promise<[string, number]>;
    disconnect(): Promise<[string, number]>;
  }

  export const client: typeof Client;

  const tmi: { Client: typeof Client; client: typeof Client };
  export default tmi;
}
