import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "CoreEditor" });
});

// Test connection endpoint
app.post("/api/agent/test", async (req, res) => {
  try {
    const { customEndpoint, customApiKey, customModel } = req.body || {};

    if (customEndpoint) {
      // Test custom external endpoint
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (customApiKey) headers["Authorization"] = `Bearer ${customApiKey}`;

      const response = await fetch(customEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: customModel || "gpt-3.5-turbo",
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 5,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          success: false,
          error: `External Agent returned status ${response.status}: ${errorText.slice(0, 200)}`,
        });
      }

      return res.json({
        success: true,
        provider: "Custom External Agent",
        endpoint: customEndpoint,
        model: customModel || "default",
      });
    }

    // Default to Gemini check
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: "GEMINI_API_KEY is not configured in environment.",
      });
    }

    const ai = getGeminiClient();
    const candidateModels = ["gemini-3.1-flash-lite", "gemini-2.5-flash", "gemini-3.8-flash"];
    let testReply = "";
    let usedModel = "";
    let lastError: Error | null = null;

    for (const modelName of candidateModels) {
      try {
        const testResponse = await ai.models.generateContent({
          model: modelName,
          contents: "Reply with the exact word 'READY'",
        });
        testReply = testResponse.text?.trim() || "READY";
        usedModel = modelName;
        break;
      } catch (e: unknown) {
        lastError = e instanceof Error ? e : new Error(String(e));
      }
    }

    if (!usedModel) {
      throw lastError || new Error("Connection test failed on all Gemini models.");
    }

    res.json({
      success: true,
      provider: "Google Gemini",
      model: usedModel,
      reply: testReply,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error during agent test";
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// AI Agent Chat / Execution endpoint
app.post("/api/agent/chat", async (req, res) => {
  try {
    const {
      prompt,
      context,
      instructionType,
      customEndpoint,
      customApiKey,
      customModel,
      systemInstruction,
      history = [],
    } = req.body;

    if (!prompt && !instructionType) {
      return res.status(400).json({ error: "Prompt or instructionType is required." });
    }

    // 1. If user configured a custom external agent (e.g., Ollama, FastGPT, Dify, OpenAI-compatible proxy)
    if (customEndpoint) {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (customApiKey) headers["Authorization"] = `Bearer ${customApiKey}`;

      const messages = [
        {
          role: "system",
          content:
            systemInstruction ||
            "You are CoreEditor AI Agent, an intelligent writing and Markdown assistant. Produce clean Markdown formatted output.",
        },
        ...history,
      ];

      let userContent = prompt || "";
      if (context) {
        userContent = `[Editor Context / Markdown Document]:\n\`\`\`markdown\n${context}\n\`\`\`\n\n[User Request]:\n${userContent}`;
      }
      messages.push({ role: "user", content: userContent });

      const externalResponse = await fetch(customEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: customModel || "gpt-4o-mini",
          messages,
          temperature: 0.7,
        }),
      });

      if (!externalResponse.ok) {
        const errorText = await externalResponse.text();
        return res.status(externalResponse.status).json({
          error: `External agent error (${externalResponse.status}): ${errorText.slice(0, 300)}`,
        });
      }

      const externalData = await externalResponse.json();
      const replyText =
        externalData?.choices?.[0]?.message?.content ||
        externalData?.response ||
        externalData?.text ||
        JSON.stringify(externalData);

      return res.json({ reply: replyText, provider: "Custom External Agent" });
    }

    // 2. Default Built-in Gemini Agent
    const ai = getGeminiClient();

    let defaultSystem =
      "You are CoreEditor's dedicated AI Agent. You specialize in Markdown composition, editing, translation, formatting, code documentation, and concise writing. When returning Markdown snippets, ensure valid Markdown syntax.";
    if (systemInstruction) {
      defaultSystem = `${defaultSystem}\n${systemInstruction}`;
    }

    let fullPrompt = prompt;
    if (context) {
      fullPrompt = `=== CURRENT MARKDOWN EDITOR CONTEXT ===\n${context}\n=== END OF CONTEXT ===\n\nTask: ${prompt}`;
    }

    const candidateModels = ["gemini-3.1-flash-lite", "gemini-2.5-flash", "gemini-3.8-flash"];
    let responseText = "";
    let usedModel = "";
    let lastError: Error | null = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: fullPrompt,
          config: {
            systemInstruction: defaultSystem,
            temperature: 0.7,
          },
        });
        responseText = response.text || "";
        usedModel = modelName;
        break;
      } catch (e: unknown) {
        lastError = e instanceof Error ? e : new Error(String(e));
        console.warn(`Model ${modelName} encountered error, trying fallback...`, lastError.message);
      }
    }

    if (!usedModel) {
      throw lastError || new Error("All Gemini candidate models failed to respond.");
    }

    res.json({
      reply: responseText,
      provider: `Google Gemini (${usedModel})`,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to process agent request";
    console.error("Agent error:", err);
    res.status(500).json({ error: errorMessage });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CoreEditor Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
