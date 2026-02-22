import fetch from "node-fetch";

export type ModelProvider = "openai" | "anthropic" | "local";

interface AIRequest {
  userId: string;
  workspaceId: string;
  model: ModelProvider;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

interface ModelConfig {
  name: ModelProvider;
  apiKey?: string;
  priority: number;
  enabled: boolean;
}

const modelRegistry: Record<ModelProvider, ModelConfig> = {
  openai: {
    name: "openai",
    apiKey: process.env.OPENAI_KEY,
    priority: 1,
    enabled: true
  },
  anthropic: {
    name: "anthropic",
    apiKey: process.env.ANTHROPIC_KEY,
    priority: 2,
    enabled: true
  },
  local: {
    name: "local",
    priority: 3,
    enabled: true
  }
};

export class AIRouter {

  async generate(request: AIRequest) {

    if (!modelRegistry[request.model].enabled) {
      throw new Error("Selected model is disabled");
    }

    try {
      switch (request.model) {

        case "openai":
          return await this.callOpenAI(request);

        case "anthropic":
          return await this.callAnthropic(request);

        case "local":
          return await this.callLocal(request);

        default:
          throw new Error("Model not supported");
      }

    } catch (err) {

      // Failover mechanism
      const fallback = this.getFallbackModel(request.model);

      if (fallback) {
        return this.generate({ ...request, model: fallback });
      }

      throw err;
    }
  }

  private getFallbackModel(current: ModelProvider): ModelProvider | null {
    const sorted = Object.values(modelRegistry)
      .filter(m => m.enabled)
      .sort((a, b) => a.priority - b.priority);

    const next = sorted.find(m => m.name !== current);
    return next ? next.name : null;
  }

  private async callOpenAI(req: AIRequest) {

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${modelRegistry.openai.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: req.temperature ?? 0.7,
          max_tokens: req.maxTokens ?? 1500,
          messages: [
            { role: "system", content: "You are DevForge AI website builder." },
            { role: "user", content: req.prompt }
          ]
        })
      }
    );

    const data = await response.json();

    return {
      provider: "openai",
      output: data.choices?.[0]?.message?.content
    };
  }

  private async callAnthropic(req: AIRequest) {

    const response = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "x-api-key": modelRegistry.anthropic.apiKey!,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: req.maxTokens ?? 1500,
          temperature: req.temperature ?? 0.7,
          messages: [
            { role: "user", content: req.prompt }
          ]
        })
      }
    );

    const data = await response.json();

    return {
      provider: "anthropic",
      output: data.content?.[0]?.text
    };
  }

  private async callLocal(req: AIRequest) {

    return {
      provider: "local",
      output: `Local Model Generated:\n${req.prompt}`
    };
  }

  }
