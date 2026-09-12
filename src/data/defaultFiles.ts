import { TabItem } from '../types';

export const DEFAULT_TABS: TabItem[] = [
  {
    id: 'tab-welcome',
    title: 'Welcome.md',
    isDirty: false,
    syntax: 'Markdown',
    lineEndings: 'CRLF',
    encoding: 'UTF-8',
    createdAt: Date.now() - 10000,
    updatedAt: Date.now() - 10000,
    originalContent: `# CoreEditor 🐕🎯

A modern, high-performance Markdown & Text Editor with **AI Agent Assistance**, rich formatting tools, and **real-time synchronized live preview**.

---

## ⚡ Core Capabilities

- **🐕 Core AI Agent (Ctrl+J)**: Integrated intelligent assistant for continuation, proofreading, Markdown tables, and translation (supports built-in Gemini or custom Ollama / OpenAI-compatible endpoints).
- **Desktop Experience**: Windows 11 Fluent layout with full Tab Management & Auto Save.
- **Side-by-Side Split View**: Edit on the left, instant live rendering on the right.
- **Enhanced Formatting Bar**: Insert tables, headers, lists, quotes, adjust casing, and clean up whitespace with one click.
- **Minimap & Navigation**: Sublime-style interactive code minimap and line numbers.
- **Windows .exe Packaging**: One-click build script \`build-windows-exe.bat\` for portable desktop executable.

---

## 📋 Task Checklist

- [x] Renamed to CoreEditor with Doge Bullseye Target icon
- [x] Core AI Agent integration (Ctrl+J)
- [x] Real-time synchronized Markdown live preview
- [x] Debounced Auto-Save with status indicator
- [x] Windows Portable .exe build configuration
- [ ] Try asking Core AI Agent to write or summarize your notes!

---

## 📊 Sample Table & Shortcuts

| Command | Shortcut | Description |
| :--- | :--- | :--- |
| **AI Agent** | \`Ctrl + J\` | Open intelligent writing assistant |
| **Command Palette** | \`Ctrl + P\` | Quick actions & file switcher |
| **New Tab** | \`Ctrl + N\` | Creates an empty scratchpad tab |
| **Save File** | \`Ctrl + S\` | Manual save (Auto-save is on by default) |
| **Find & Replace** | \`Ctrl + F\` / \`Ctrl + H\` | Full regex search across document |
| **Toggle Preview** | \`Ctrl + E\` | Switch between Split, Editor, or Preview |
`,
    content: `# CoreEditor 🐕🎯

A modern, high-performance Markdown & Text Editor with **AI Agent Assistance**, rich formatting tools, and **real-time synchronized live preview**.

---

## ⚡ Core Capabilities

- **🐕 Core AI Agent (Ctrl+J)**: Integrated intelligent assistant for continuation, proofreading, Markdown tables, and translation (supports built-in Gemini or custom Ollama / OpenAI-compatible endpoints).
- **Desktop Experience**: Windows 11 Fluent layout with full Tab Management & Auto Save.
- **Side-by-Side Split View**: Edit on the left, instant live rendering on the right.
- **Enhanced Formatting Bar**: Insert tables, headers, lists, quotes, adjust casing, and clean up whitespace with one click.
- **Minimap & Navigation**: Sublime-style interactive code minimap and line numbers.
- **Windows .exe Packaging**: One-click build script \`build-windows-exe.bat\` for portable desktop executable.

---

## 📋 Task Checklist

- [x] Renamed to CoreEditor with Doge Bullseye Target icon
- [x] Core AI Agent integration (Ctrl+J)
- [x] Real-time synchronized Markdown live preview
- [x] Debounced Auto-Save with status indicator
- [x] Windows Portable .exe build configuration
- [ ] Try asking Core AI Agent to write or summarize your notes!

---

## 📊 Sample Table & Shortcuts

| Command | Shortcut | Description |
| :--- | :--- | :--- |
| **AI Agent** | \`Ctrl + J\` | Open intelligent writing assistant |
| **Command Palette** | \`Ctrl + P\` | Quick actions & file switcher |
| **New Tab** | \`Ctrl + N\` | Creates an empty scratchpad tab |
| **Save File** | \`Ctrl + S\` | Manual save (Auto-save is on by default) |
| **Find & Replace** | \`Ctrl + F\` / \`Ctrl + H\` | Full regex search across document |
| **Toggle Preview** | \`Ctrl + E\` | Switch between Split, Editor, or Preview |
`,
  },
  {
    id: 'tab-typesetting',
    title: 'Formatting_Showcase.md',
    isDirty: false,
    syntax: 'Markdown',
    lineEndings: 'CRLF',
    encoding: 'UTF-8',
    createdAt: Date.now() - 5000,
    updatedAt: Date.now() - 5000,
    originalContent: `# Advanced Typesetting & Formatting Demo

Use the **Formatting Bar** on top of the editor to apply instant styling:

### Text Treatments
- **Bold Emphasis**: Select any word and click the **B** button or press \`Ctrl+B\`.
- *Italic Tone*: Click the **I** button or press \`Ctrl+I\`.
- ~~Strikethrough~~: Click the **S** button.
- \`Inline Code Snippet\`: Click the **<>** button.

### Casing Tools
Convert any selected block of text into:
1. UPPERCASE
2. lowercase
3. Title Case
4. Capitalized Case

### Structural Blocks
> Blockquotes help highlight key design takeaways, customer remarks, or important cautions.

### Math & Technical Blocks
\`\`\`bash
# Install and run local build
npm run dev
\`\`\`
`,
    content: `# Advanced Typesetting & Formatting Demo

Use the **Formatting Bar** on top of the editor to apply instant styling:

### Text Treatments
- **Bold Emphasis**: Select any word and click the **B** button or press \`Ctrl+B\`.
- *Italic Tone*: Click the **I** button or press \`Ctrl+I\`.
- ~~Strikethrough~~: Click the **S** button.
- \`Inline Code Snippet\`: Click the **<>** button.

### Casing Tools
Convert any selected block of text into:
1. UPPERCASE
2. lowercase
3. Title Case
4. Capitalized Case

### Structural Blocks
> Blockquotes help highlight key design takeaways, customer remarks, or important cautions.

### Math & Technical Blocks
\`\`\`bash
# Install and run local build
npm run dev
\`\`\`
`,
  }
];
