export class Config {
  public setConfig(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public getConfig(key: string): string | null {
    return localStorage.getItem(key);
  }

  public getParsedConfig(key: string): any {
    const configItem: any = localStorage.getItem(key);
    return JSON.parse(configItem);
  }

  public removeConfig(key: string): void {
    localStorage.removeItem(key);
  }
}
