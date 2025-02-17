import { OpenAI } from "@openai/openai";

/**
 * AI helper class
 * @class ai
 * @static init
 * @static getModels
 * @static generateChatCompletion
 * @static generateChatCompletionStream
 */
class ai {
  private static openai: OpenAI;

  /**
   * Initialize the AI client
   * @param key - The OpenAI API key
   * @param apiEndpoint - The OpenAI API endpoint
   */
  static init(key: string, apiEndpoint: string) {
    this.openai = new OpenAI({
      apiKey: key,
      baseURL: apiEndpoint,
    });
  }

  /**
   * Get the list of available models
   * @returns The list of models
   */
  static async getModels() {
    const models = await this.openai.models.list();
    return models.data;
  }

  /**
   * Generate a chat completion
   * @param body - The chat completion body
   * @returns The chat completion
   */
  static async generateChatCompletion(
    body: OpenAI.Chat.Completions.ChatCompletionCreateParams,
  ) {
    body.stream = false;

    const completion = await this.openai.chat.completions.create(
      body as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
    );
    return completion.choices[0].message.content;
  }

  /**
   * Generate a chat completion stream
   * @param body - The chat completion body
   * @returns The chat completion stream
   */
  static async generateChatCompletionStream(
    body: OpenAI.Chat.Completions.ChatCompletionCreateParams,
  ) {
    body.stream = true;
    const stream = await this.openai.chat.completions.create(
      body as OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming,
    );
    return stream;
  }
}

export default ai;
