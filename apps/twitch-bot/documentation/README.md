# Senchabot - Twitch Usage Manual


## Commands
  
### Invite to Your Twitch Channel

Invite the bot to your channel by writing the command in [Senchabot](https://twitch.tv/senchabot/)'s chat. 

```
!invite [your_channel_name]
```

Then, give moderation role to [Senchabot](https://twitch.tv/senchabot/).

### Global Commands

These commands can be edited as described in the [Custom Commands](#custom-commands) topic.

| Command             | Description or Response                                                                                                                    |
| :------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| !cmds or !commands  | {channel.name}'s Channel Commands: ...                                                                                                     |
| !frontendship       | https://discord.gg/frontendship                                                                                                            |
| !kampus             | discord.gg/kampus • github.com/kamp-us                                                                                                     |
| !lurk               | Teşekkürler! {user.name}                                                                                                                   |
| !ping               | pong! VoHiYo                                                                                                                               |
| !senchabot          | Open source multi-platform bot development project, which works on Twitch and Discord. • senchabot.app • github.com/senchabot-opensource/monorepo |
| !sozluk [term-name] | (Reply to user) Term: Description                                                                                              |

### Custom Commands

With these commands, custom commands can be added to your Twitch channel.

| Command                                                      | Description or Response                                          |
| :----------------------------------------------------------- | ---------------------------------------------------------------- |
| !acmd [command_name] [command_content]                       | Add command.                                                     |
| !ucmd [command_name or command_alias] [new_command_content]  | Update command content or alias's original command content.      |
| !dcmd [command_name]                                         | Delete command with command itself or its one of command aliases |
| !acmda [command_name] [command_alias(es) separated by space] | Add command aliases.                                             |
| !dcmda [command_alias]                                       | Delete one of command aliases.                                   |
