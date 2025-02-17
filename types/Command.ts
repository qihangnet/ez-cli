/**
 * Command interface
 */
export interface Command {
  /**
   * Command name
   * @type {string}
   * @required
   * @description The name of the command
   * @example "commit"
   */
  name: string;
  /**
   * Command help
   * @type {Object}
   * @description The help information for the command
   * @example {
   *   description: "Commit changes to the git repository",
   *   usage: "commit [options]",
   *   examples: ["commit", "commit --message 'Commit message'"],
   *   flags: {
   *     "message": {
   *       type: "string",
   *       description: "The message to commit"
   *     }
   *   }
   * }
   */
  help?: {
    description: string;
    usage?: string;
    examples?: string[];
    flags?: {
      [key: string]: {
        type: string;
        description: string;
      };
    };
  };

  /**
   * Command action
   * @type {Function}
   * @description The action to be performed when the command is executed
   * @example (args: string[]) => Promise<void>
   */
  action: (args: string[]) => Promise<void>;
}
