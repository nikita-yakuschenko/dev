import { describe, expect, it } from "vitest";

import {
  parseMcpHealthPayload,
  parseMcpToolResult,
} from "@/lib/mcp/health";

describe("parseMcpHealthPayload", () => {
  it("marks fully healthy MCP as ok", () => {
    expect(
      parseMcpHealthPayload({
        status: "ok",
        qdrant_reachable: true,
        collection_exists: true,
        collection_name: "1c_upp_docs",
      }),
    ).toMatchObject({
      status: "ok",
      label: "MCP online",
      collectionExists: true,
    });
  });

  it("marks MCP without collection as degraded", () => {
    expect(
      parseMcpHealthPayload({
        status: "ok",
        qdrant_reachable: true,
        collection_exists: false,
        collection_name: "1c_upp_docs",
      }),
    ).toMatchObject({
      status: "degraded",
      label: "MCP без данных",
    });
  });

  it("marks degraded MCP response as degraded", () => {
    expect(
      parseMcpHealthPayload({
        status: "degraded",
        qdrant_reachable: false,
        collection_exists: false,
        error: "connection refused",
      }),
    ).toMatchObject({
      status: "degraded",
      label: "MCP ограничен",
      error: "connection refused",
    });
  });
});

describe("parseMcpToolResult", () => {
  it("reads structured MCP tool content", () => {
    expect(
      parseMcpToolResult({
        result: {
          structuredContent: {
            status: "ok",
            qdrant_reachable: true,
            collection_exists: true,
          },
        },
      }),
    ).toEqual({
      status: "ok",
      qdrant_reachable: true,
      collection_exists: true,
    });
  });

  it("falls back to text JSON content", () => {
    expect(
      parseMcpToolResult({
        result: {
          content: [
            {
              type: "text",
              text: '{"status":"ok","qdrant_reachable":true,"collection_exists":true}',
            },
          ],
        },
      }),
    ).toEqual({
      status: "ok",
      qdrant_reachable: true,
      collection_exists: true,
    });
  });
});
