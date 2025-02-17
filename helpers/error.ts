import i18n from "./i18n.ts";
import * as colors from "@std/fmt/colors";
import { name, version } from "./app.ts";
export class KnownError extends Error {}

const indent = " ".repeat(2);

export const handleCliError = (error: unknown) => {
  if (error instanceof Error && !(error instanceof KnownError)) {
    if (error.stack) {
      console.error(colors.dim(error.stack.split("\n").slice(1).join("\n")));
    }
    console.error(`\n${indent}${colors.dim(`${name} v${version}`)}`);
    console.error(
      `\n${indent}${
        i18n.t(
          "Please open a Bug report with the information above",
        )
      }:`,
    );
    console.error(`${indent}https://github.com/qihangnet/ez-cli/issues/new`);
  }
};
