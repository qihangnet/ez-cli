import * as app from "./helpers/app.ts";
import cli from "./helpers/cli.ts";
import { ConfigCommand } from "./commands/config.ts";
import { CommitCommand } from "./commands/commit.ts";
import { ChatCommand } from "./commands/chat.ts";

const commands = [ConfigCommand, CommitCommand, ChatCommand];

const currentExeName = Deno.execPath().split("/").pop()?.split(".")[0] ||
  app.name;
app.initExeName(currentExeName);

cli(commands);
