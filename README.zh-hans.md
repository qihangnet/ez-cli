# ez

ez 是一个基于 Deno 开发的开源命令行工具，利用人工智能的力量为用户提供便捷的功能。以下是 ez 的核心特色与灵感来源的分析：

## 核心特色

1. **基于 Deno**：
   - Deno 是一个安全的 JavaScript 和 TypeScript 运行时，在性能、安全性和可维护性等方面有很好的表现。

2. **AI 驱动**：
   - 通过集成 AI 技术，ez 能够智能地处理用户的命令和请求，提升用户体验。
   - 可以实现自动完成一些常用工作，减少复杂度。

3. **命令行工具**：
   - CLI 工具为开发者提供了灵活性和快速性，适合各种环境下的使用。
   - 允许用户通过简单的命令迅速执行常见智能化任务。

## 灵感来源

1. **ai-shell**：
   - [ai-shell](https://github.com/BuilderIO/ai-shell) 是使用 NodeJS 开发的为用户提供了 AI 支持的交互式命令行界面，我们借鉴了其用户友好的设计和部分源代码。

2. **gptcommit**：
   - [gptcommit](https://github.com/zhufengme/GPTCommit) 是一个利用 GPT 模型为 git 提交消息生成智能化建议的 shell script，ez 借鉴了其生成 提交消息的智能化方式。

## 用法

```bash
ez <command> <args>
```

### 配置

用 `ez config` 命令在 Cli UI 界面配置必要的系统参数。

```bash
ez config
```

### 聊天

用 `ez chat` 命令与 AI 进行对话沟通。

```bash
ez chat
```

### 智能 Commit

用 `ez commit` 命令自动生成有意义且规范的提交消息。

```bash
ez commit
```
