import { readRuntimeConfig } from "./runtime-config.js";

describe("readRuntimeConfig", () => {
  const databaseUrl = "postgresql://orbit:root@localhost:5432/orbit";

  it("uses safe local defaults when optional values are absent", () => {
    expect(readRuntimeConfig({ DATABASE_URL: databaseUrl })).toEqual({
      databaseUrl,
      host: "0.0.0.0",
      port: 4000,
    });
  });

  it("accepts a valid configured host and port", () => {
    expect(
      readRuntimeConfig({
        API_HOST: "127.0.0.1",
        API_PORT: "4100",
        DATABASE_URL: databaseUrl,
      }),
    ).toEqual({
      databaseUrl,
      host: "127.0.0.1",
      port: 4100,
    });
  });

  it.each(["0", "65536", "12.5", "not-a-port"])(
    "rejects invalid API_PORT value %s",
    (value) => {
      expect(() =>
        readRuntimeConfig({ API_PORT: value, DATABASE_URL: databaseUrl }),
      ).toThrow("API_PORT must be an integer between 1 and 65535.");
    },
  );

  it("rejects a missing database URL", () => {
    expect(() => readRuntimeConfig({})).toThrow("DATABASE_URL is required.");
  });

  it("rejects a non-PostgreSQL database URL", () => {
    expect(() =>
      readRuntimeConfig({ DATABASE_URL: "mysql://localhost/orbit" }),
    ).toThrow("DATABASE_URL must use the postgresql protocol.");
  });

  it("rejects a malformed database URL with a configuration error", () => {
    expect(() => readRuntimeConfig({ DATABASE_URL: "not-a-url" })).toThrow(
      "DATABASE_URL must be a valid PostgreSQL URL.",
    );
  });
});
