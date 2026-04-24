import { google } from "@ai-sdk/google";

// ═══════════════════════════════════════════════════════════════
// AI Provider Configuration
// Change this ONE line to switch to a different AI provider.
//
// Examples:
//   import { openai } from "@ai-sdk/openai";
//   export const aiModel = openai("gpt-4o");
//
//   import { anthropic } from "@ai-sdk/anthropic";
//   export const aiModel = anthropic("claude-sonnet-4-20250514");
// ═══════════════════════════════════════════════════════════════

export const aiModel = google("gemini-2.5-flash");

export const MODEL_DISPLAY_NAME = "Gemini 2.5 Flash";
