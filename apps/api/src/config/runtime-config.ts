const DEFAULT_API_HOST = "0.0.0.0";
const DEFAULT_API_PORT = 4000;

export interface RuntimeConfig {
  readonly host: string;
  readonly port: number;
}

export function readRuntimeConfig(
  environment: NodeJS.ProcessEnv,
): RuntimeConfig {
  const port = parsePort(environment.API_PORT);

  return {
    host: environment.API_HOST?.trim() || DEFAULT_API_HOST,
    port,
  };
}

function parsePort(rawPort: string | undefined): number {
  if (rawPort === undefined || rawPort.trim() === "") {
    return DEFAULT_API_PORT;
  }

  const port = Number(rawPort);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("API_PORT must be an integer between 1 and 65535.");
  }

  return port;
}
