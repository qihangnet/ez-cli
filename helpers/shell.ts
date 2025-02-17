class shell {
  /**
   * Execute a shell command and return its output
   * @param cmd Array of command and its arguments
   * @returns Promise resolving to command output as string
   */
  static async run(cmd: string[]): Promise<string> {
    const process = new Deno.Command(cmd[0], {
      args: cmd.slice(1),
    });
    const { stdout } = await process.output();
    return new TextDecoder().decode(stdout);
  }

  static write(text: string): void {
    Deno.stdout.writeSync(new TextEncoder().encode(text));
  }

  static writeLine(text?: string): void {
    if (text && text.length > 0) {
      Deno.stdout.writeSync(new TextEncoder().encode(text));
    }
    Deno.stdout.writeSync(new TextEncoder().encode("\n"));
  }
}

export { shell };
