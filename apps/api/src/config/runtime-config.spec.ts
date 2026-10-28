import { readRuntimeConfig } from "./runtime-config.js";

describe("readRuntimeConfig", () => {
  it("uses safe local defaults when optional values are absent", () => {
    expect(readRuntimeConfig({})).toEqual({
      host: "0.0.0.0",
      port: 4000,
    });
  });

  it("accepts a valid configured host and port", () => {
    expect(
      readRuntimeConfig({ API_HOST: "127.0.0.1", API_PORT: "4100" }),
    ).toEqual({
      host: "127.0.0.1",
      port: 4100,
    });
  });

  it.each(["0", "65536", "12.5", "not-a-port"])(
    "rejects invalid API_PORT value %s",
    (value) => {
      expect(() => readRuntimeConfig({ API_PORT: value })).toThrow(
        "API_PORT must be an integer between 1 and 65535.",
      );
    },
  );
});
