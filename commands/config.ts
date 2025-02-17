import { Command } from "../types/Command.ts";
import { exeName } from "../helpers/app.ts";
import { getConfig, setConfigs, showConfigUI } from "../helpers/config.ts";
import { KnownError } from "../helpers/error.ts";
import i18n from "../helpers/i18n.ts";
import { shell } from "../helpers/shell.ts";

/**
 * Config command
 */
export const ConfigCommand: Command = {
  name: "config",
  help: {
    description: i18n.t("Configure the CLI"),
    usage: exeName + " config [set|get|ui] [key=value...]",
    examples: [
      `${exeName} config set OPENAI_KEY=sk-******`,
      `${exeName} config get`,
      `${exeName} config ui`,
    ],
  },
  action: async (args: string[]) => {
    const mode = args[0] as "set" | "get" | "ui";
    switch (mode) {
      case "set": {
        const keyValues = args.slice(1).map((arg) =>
          arg.split("=") as [string, string]
        );
        await setConfigs(keyValues);
        break;
      }
      case "get": {
        const config = await getConfig();
        for (const [key] of Object.entries(config)) {
          if (Object.hasOwn(config, key)) {
            shell.writeLine(`${key}=${config[key as keyof typeof config]}`);
          } else {
            throw new KnownError(
              `${i18n.t("Invalid config property")}: ${key}`,
            );
          }
        }
        break;
      }
      case "ui":
      default: {
        await showConfigUI();
        break;
      }
    }
  },
};
