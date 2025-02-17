import { parseArgs } from "@std/cli/parse-args";
import * as colors from "@std/fmt/colors";
import { getConfig } from "../helpers/config.ts";
import i18n from "../helpers/i18n.ts";
import * as app from "../helpers/app.ts";
import { shell } from "../helpers/shell.ts";
import ai from "../helpers/ai.ts";
import { handleCliError } from "../helpers/error.ts";
import { Command } from "../types/Command.ts";

const indent = " ".repeat(2);

export default async function cli(commands: Command[]): Promise<void> {
  const flags = parseArgs(Deno.args, {
    boolean: ["help", "version"],
    alias: {
      help: "h",
      version: "v",
    },
  });
  const commandName = flags._[0] as string | undefined;

  const config = await getConfig();
  i18n.setLanguage(config.LANGUAGE || "en");
  ai.init(config.OPENAI_KEY, config.OPENAI_API_ENDPOINT);

  const command = commands.find((cmd) => cmd.name === commandName);

  if (flags.help) {
    printHelp(command, commands);
    Deno.exit(0);
  }

  if (flags.version) {
    shell.writeLine(app.version);
    Deno.exit(0);
  }

  if (command) {
    try {
      await command.action(Deno.args.slice(1) as string[]);
    } catch (error) {
      handleCliError(error);
      Deno.exit(1);
    }
  } else {
    shell.writeLine(colors.red("Error: Invalid command"));
    shell.writeLine();
    printHelp();
    Deno.exit(1);
  }
}

function printHelp(command?: Command | undefined, commands: Command[] = []) {
  shell.writeLine(`${app.name} v${app.version}`);

  if (command) {
    printCommandHelp(command);
    return;
  }

  shell.writeLine();
  shell.writeLine(`${indent}${app.exeName} [flags]`);
  shell.writeLine(`${indent}${app.exeName} <command>`);
  shell.writeLine();
  shell.writeLine(colors.bold("Commands:"));
  for (const cmd of commands) {
    shell.writeLine(
      `  ${cmd.name.padEnd(15)}${i18n.t(cmd.help?.description || "")}`,
    );
  }
  shell.writeLine();
  shell.writeLine(colors.bold("Flags:"));
  shell.writeLine(indent + "-h, --help".padEnd(20) + i18n.t("Show help"));
  shell.writeLine(indent + "-v, --version".padEnd(20) + i18n.t("Show version"));
}

function printCommandHelp(command: Command) {
  if (command.help) {
    if (command.help.description) {
      shell.writeLine();
      shell.writeLine(i18n.t(command.help.description));
    }
    if (command.help.usage && command.help.usage.length > 0) {
      shell.writeLine();
      shell.writeLine(colors.bold("Usage:"));
      shell.writeLine(indent + command.help.usage);
    }

    if (command.help.examples && command.help.examples.length > 0) {
      shell.writeLine();
      shell.writeLine(colors.bold("Examples:"));
      for (const example of command.help.examples) {
        shell.writeLine(indent + i18n.t(example));
      }
    }

    if (command.help.flags && Object.keys(command.help.flags).length > 0) {
      shell.writeLine();
      shell.writeLine(colors.bold("Flags:"));
      for (const flag in command.help.flags) {
        shell.writeLine(
          indent + flag.padEnd(20) +
            i18n.t(command.help.flags[flag].description),
        );
      }
    }
  }
  shell.writeLine();
  shell.writeLine(colors.bold("Flags:"));
  shell.writeLine(indent + "-h, --help".padEnd(20) + i18n.t("Show help"));
  shell.writeLine();
  Deno.exit(0);
}
