import { Command } from "../types/Command.ts";
import ai from "../helpers/ai.ts";
import * as p from "@clack/prompts";
import i18n from "../helpers/i18n.ts";
import * as colors from "@std/fmt/colors";
import { getConfig } from "../helpers/config.ts";
import { shell } from "../helpers/shell.ts";
import { ChatCompletionMessage } from "../types/ChatCompletionMessage.ts";

/**
 * Chat command
 */
export const ChatCommand: Command = {
  name: "chat",
  help: {
    description: i18n.t("Chat with the AI"),
    examples: ["ai chat"],
  },
  action: async (_: string[]) => {
    const config = await getConfig();
    const chatHistory: ChatCompletionMessage[] = [];
    p.intro(i18n.t("Starting new conversation"));
    const prompt = async () => {
      const msgYou = `${i18n.t("You")}:`;
      const userPrompt = (await p.text({
        message: `${colors.cyan(msgYou)}`,
        placeholder: i18n.t(`send a message ('exit' to quit)`),
        validate: (value) => {
          if (!value) return i18n.t("Please enter a prompt.");
        },
      })) as string;

      if (p.isCancel(userPrompt) || userPrompt === "exit") {
        p.outro(i18n.t("Goodbye!"));
        Deno.exit(0);
      }

      const infoSpin = p.spinner();
      infoSpin.start(i18n.t(`THINKING...`));
      chatHistory.push({
        role: "user",
        content: userPrompt,
      });
      const contentStream = await ai.generateChatCompletionStream({
        model: config.MODEL,
        messages: chatHistory,
      });

      infoSpin.stop(`${colors.green("AI:")}`);
      let content = "";
      for await (const chunk of contentStream) {
        shell.write(chunk.choices[0].delta.content || "");
        content += chunk.choices[0].delta.content || "";
      }
      chatHistory.push({
        role: "assistant",
        content,
      });

      shell.writeLine("\n");
      prompt();
    };

    prompt();
  },
};
