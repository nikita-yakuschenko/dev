export type McpHealthStatus = "ok" | "degraded" | "unavailable";

export type McpHealthPayload = {
  status?: string;
  qdrant_reachable?: boolean;
  collection_exists?: boolean;
  collection_name?: string;
  error?: string;
};

export type McpHealthSnapshot = {
  status: McpHealthStatus;
  qdrantReachable: boolean;
  collectionExists: boolean;
  collectionName: string | null;
  label: string;
  detail: string;
  error?: string;
  checkedAt: string;
};

const DEFAULT_MCP_URL = "https://mcp.avgst.ru/mcp";

function getMcpUrl() {
  return process.env.MCP_URL?.trim() || DEFAULT_MCP_URL;
}

export function parseMcpHealthPayload(payload: McpHealthPayload): Omit<
  McpHealthSnapshot,
  "checkedAt"
> {
  const qdrantReachable = payload.qdrant_reachable === true;
  const collectionExists = payload.collection_exists === true;
  const collectionName =
    typeof payload.collection_name === "string" ? payload.collection_name : null;
  const error = typeof payload.error === "string" ? payload.error : undefined;

  if (payload.status === "ok" && qdrantReachable && collectionExists) {
    return {
      status: "ok",
      qdrantReachable,
      collectionExists,
      collectionName,
      label: "MCP online",
      detail: "Сервис 1C UPP MCP и база документации доступны.",
      error,
    };
  }

  if (payload.status === "ok" && qdrantReachable) {
    return {
      status: "degraded",
      qdrantReachable,
      collectionExists,
      collectionName,
      label: "MCP без данных",
      detail: "MCP доступен, но коллекция документации в Qdrant не загружена.",
      error,
    };
  }

  if (payload.status === "ok") {
    return {
      status: "degraded",
      qdrantReachable,
      collectionExists,
      collectionName,
      label: "MCP ограничен",
      detail: "MCP отвечает, но Qdrant недоступен.",
      error,
    };
  }

  return {
    status: "degraded",
    qdrantReachable,
    collectionExists,
    collectionName,
    label: "MCP ограничен",
    detail: error ?? "MCP вернул статус degraded.",
    error,
  };
}

export function parseMcpToolResult(body: unknown): McpHealthPayload | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const record = body as {
    result?: {
      structuredContent?: McpHealthPayload;
      content?: Array<{ type?: string; text?: string }>;
    };
  };

  if (record.result?.structuredContent) {
    return record.result.structuredContent;
  }

  const text = record.result?.content?.find((item) => item.type === "text")?.text;
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as McpHealthPayload;
  } catch {
    return null;
  }
}

function unavailableSnapshot(error: string): McpHealthSnapshot {
  return {
    status: "unavailable",
    qdrantReachable: false,
    collectionExists: false,
    collectionName: null,
    label: "MCP недоступен",
    detail: error,
    error,
    checkedAt: new Date().toISOString(),
  };
}

async function postMcp(
  url: string,
  body: unknown,
  sessionId?: string,
): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: "application/json, text/event-stream",
    "Content-Type": "application/json",
  };

  if (sessionId) {
    headers["Mcp-Session-Id"] = sessionId;
  }

  return fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12_000),
    cache: "no-store",
  });
}

export async function fetchMcpHealth(): Promise<McpHealthSnapshot> {
  const url = getMcpUrl();

  try {
    const initResponse = await postMcp(url, {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "avgst-dev-portal", version: "1.0.0" },
      },
    });

    if (!initResponse.ok) {
      return unavailableSnapshot(`MCP initialize вернул ${initResponse.status}.`);
    }

    const sessionId = initResponse.headers.get("Mcp-Session-Id");
    if (!sessionId) {
      return unavailableSnapshot("MCP не выдал идентификатор сессии.");
    }

    await postMcp(
      url,
      {
        jsonrpc: "2.0",
        method: "notifications/initialized",
        params: {},
      },
      sessionId,
    );

    const healthResponse = await postMcp(
      url,
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
          name: "health_check",
          arguments: {},
        },
      },
      sessionId,
    );

    if (!healthResponse.ok) {
      return unavailableSnapshot(`health_check вернул ${healthResponse.status}.`);
    }

    const payload = parseMcpToolResult(await healthResponse.json());
    if (!payload) {
      return unavailableSnapshot("Не удалось разобрать ответ health_check.");
    }

    return {
      ...parseMcpHealthPayload(payload),
      checkedAt: new Date().toISOString(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Неизвестная ошибка MCP.";
    return unavailableSnapshot(message);
  }
}
