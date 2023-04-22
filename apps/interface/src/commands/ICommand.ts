export interface ICommand {
  name: string;
  aliases?: string[];
  execute(args: string): void;
  help(): void;
  description?: string;
  usage?: string;
  hidden?: boolean;
  admin?: boolean;
}
