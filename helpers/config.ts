import * as fs from "@std/fs";
import * as path from "@std/path";
import * as colors from "@std/fmt/colors";
import { parse, stringify } from "@std/dotenv";

import * as p from "@clack/prompts";

import { exeName } from "./app.ts";
import { handleCliError, KnownError } from "./error.ts";
import i18n from "./i18n.ts";
import ai from "./ai.ts";
import { shell } from "./shell.ts";
// Constants
const homeDir = Deno.env.get("HOME") || "~/";
const configPath = path.join(homeDir, ".ez-cli");

// Utility functions
const { hasOwnProperty } = Object.prototype;
export const hasOwn = (object: unknown, key: PropertyKey) =>
  hasOwnProperty.call(object, key);

const fileExists = (filePath: string) => fs.exists(filePath);

const getModels = async (key: string, apiEndpoint: string) => {
  ai.init(key, apiEndpoint);
  const models = await ai.getModels();
  return models;
};

// Config options
const languagesOptions = Object.entries(i18n.languages).map(([key, value]) => ({
  value: key,
  label: value,
}));

// Config parsers and types
const configParsers = {
  OPENAI_KEY(key?: string) {
    if (!key) {
      throw new KnownError(
        `Please set your OpenAI API key via \`${exeName} config set OPENAI_KEY=<your token>\``, // TODO: i18n
      );
    }
    return key;
  },
  MODEL(model?: string) {
    if (!model || model.length === 0) {
      return "gpt-4o-mini";
    }
    return model;
  },
  SILENT_MODE(mode?: string) {
    return String(mode).toLowerCase() === "true";
  },
  OPENAI_API_ENDPOINT(apiEndpoint?: string) {
    return apiEndpoint || "https://api.openai.com/v1";
  },
  LANGUAGE(language?: string) {
    return language || "en";
  },
} as const;

type ConfigKeys = keyof typeof configParsers;
type RawConfig = {
  [key in ConfigKeys]?: string;
};
type ValidConfig = {
  [Key in ConfigKeys]: ReturnType<(typeof configParsers)[Key]>;
};

// File operations
const readConfigFile = async (): Promise<RawConfig> => {
  const configExists = await fileExists(configPath);
  if (!configExists) {
    return Object.create(null);
  }

  const configString = await Deno.readTextFile(configPath);
  return parse(configString);
};

// Config management functions
export const getConfig = async (
  cliConfig?: RawConfig,
): Promise<ValidConfig> => {
  const config = await readConfigFile();
  const parsedConfig: Record<string, unknown> = {};

  for (const key of Object.keys(configParsers) as ConfigKeys[]) {
    const parser = configParsers[key];
    const value = cliConfig?.[key] ?? config[key];
    parsedConfig[key] = parser(value);
  }

  return parsedConfig as ValidConfig;
};

export const setConfigs = async (keyValues: [key: string, value: string][]) => {
  const config = await readConfigFile();

  for (const [key, value] of keyValues) {
    if (!hasOwn(configParsers, key)) {
      throw new KnownError(`${i18n.t("Invalid config property")}: ${key}`);
    }

    const parsed = configParsers[key as ConfigKeys](value);
    config[key as ConfigKeys] = String(parsed);
  }

  await Deno.writeTextFile(
    configPath,
    stringify(config as Record<string, string>),
  );

  const newConfig = await getConfig();

  ai.init(newConfig.OPENAI_KEY, newConfig.OPENAI_API_ENDPOINT);
};

// UI handlers
const handleOpenAIKey = async () => {
  const key = await p.text({
    message: i18n.t("Enter your OpenAI API key"),
    validate: (value) => {
      if (!value.length) {
        return i18n.t("Please enter a key");
      }
    },
  });
  if (p.isCancel(key)) return;
  await setConfigs([["OPENAI_KEY", key as string]]);
};

const handleApiEndpoint = async () => {
  const apiEndpoint = await p.text({
    message: i18n.t("Enter your OpenAI API Endpoint"),
  });
  if (p.isCancel(apiEndpoint)) return;
  await setConfigs([["OPENAI_API_ENDPOINT", apiEndpoint as string]]);
};

const handleSilentMode = async () => {
  const silentMode = await p.confirm({
    message: i18n.t("Enable silent mode?"),
  });
  if (p.isCancel(silentMode)) return;
  await setConfigs([["SILENT_MODE", silentMode ? "true" : "false"]]);
};

const handleModel = async () => {
  const { OPENAI_KEY: key, OPENAI_API_ENDPOINT: apiEndpoint } =
    await getConfig();
  const models = await getModels(key, apiEndpoint);
  const model = (await p.select({
    message: "Pick a model.",
    options: models.map((m) => ({
      value: m.id,
      label: m.id,
    })),
  })) as string;

  if (p.isCancel(model)) return;
  await setConfigs([["MODEL", model]]);
};

const handleLanguage = async () => {
  const language = (await p.select({
    message: i18n.t("Enter the language you want to use"),
    options: languagesOptions,
  })) as string;
  if (p.isCancel(language)) return;
  await setConfigs([["LANGUAGE", language]]);
  i18n.setLanguage(language);
};

// Main UI function
export const showConfigUI = async () => {
  try {
    const config = await getConfig();
    const choice = (await p.select({
      message: i18n.t("Set config") + ":",
      options: [
        {
          label: i18n.t("OpenAI Key"),
          value: "OPENAI_KEY",
          hint: hasOwn(config, "OPENAI_KEY")
            ? "sk-..." + config.OPENAI_KEY.slice(-3)
            : i18n.t("(not set)"),
        },
        {
          label: i18n.t("OpenAI API Endpoint"),
          value: "OPENAI_API_ENDPOINT",
          hint: hasOwn(config, "OPENAI_API_ENDPOINT")
            ? config.OPENAI_API_ENDPOINT
            : i18n.t("(not set)"),
        },
        {
          label: i18n.t("Silent Mode"),
          value: "SILENT_MODE",
          hint: hasOwn(config, "SILENT_MODE")
            ? config.SILENT_MODE.toString()
            : i18n.t("(not set)"),
        },
        {
          label: i18n.t("Model"),
          value: "MODEL",
          hint: hasOwn(config, "MODEL") ? config.MODEL : i18n.t("(not set)"),
        },
        {
          label: i18n.t("Language"),
          value: "LANGUAGE",
          hint: hasOwn(config, "LANGUAGE")
            ? config.LANGUAGE
            : i18n.t("(not set)"),
        },
        {
          label: i18n.t("Exit"),
          value: "exit",
          hint: i18n.t("Exit the program"),
        },
      ],
    })) as ConfigKeys | "exit" | symbol;

    if (p.isCancel(choice)) return;

    const handlers: Record<string | symbol, () => Promise<void>> = {
      OPENAI_KEY: handleOpenAIKey,
      OPENAI_API_ENDPOINT: handleApiEndpoint,
      SILENT_MODE: handleSilentMode,
      MODEL: handleModel,
      LANGUAGE: handleLanguage,
    };

    if (choice !== "exit" && typeof choice === "string" && handlers[choice]) {
      await handlers[choice]();
    }

    if (choice !== "exit") {
      await showConfigUI();
    }
  } catch (error: any) {
    shell.writeLine(`\n${colors.red("✖")} ${error.message}`);
    handleCliError(error);
    Deno.exit(1);
  }
};
