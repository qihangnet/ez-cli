# ez

ez is an open-source command-line tool developed based on Deno, leveraging the power of artificial intelligence to provide convenient features for users. Below is an analysis of the core features and inspirations of ez:

## Features

1. **Based on Deno**:
   - Deno is a secure JavaScript and TypeScript runtime that performs well in terms of performance, security, and maintainability.

2. **AI-Driven**:
   - By integrating AI technology, ez can intelligently handle user commands and requests, enhancing user experience.
   - It can automatically complete some common tasks, reducing complexity.

3. **Command-Line Tool**:
   - The CLI tool provides developers with flexibility and speed, suitable for use in various environments.
   - It allows users to quickly execute common intelligent tasks through simple commands.

## Inspirations

1. **ai-shell**:
   - [ai-shell](https://github.com/BuilderIO/ai-shell) is an interactive command-line interface developed using NodeJS that provides AI support for users. We have drawn from its user-friendly design and some source code.

2. **gptcommit**:
   - [gptcommit](https://github.com/zhufengme/GPTCommit) is a shell script that uses the GPT model to generate intelligent suggestions for git commit messages. ez has borrowed its intelligent way of generating commit messages.

## Usage

```bash
ez <command> <args>
```

### Configure

Use the `ez config` command to configure the necessary system parameters in the Cli UI interface.

```bash
ez config
```

### Chat

Use the `ez chat` command to communicate with AI.

```bash
ez chat
```

### Commit

Use the `ez commit` command to automatically generate meaningful and standardized commit messages powered by AI.

```bash
ez commit
```
