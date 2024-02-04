import { describe, expect, test } from "vitest";
import { rules } from "./index.js";

describe("commitlint-plugin-spend", () => {
  const { spend } = rules;
  const alwaysApplicable = "always";

  test("should return false if the applicable value is 'never'", () => {
    const ctx = { body: "body" };
    const applicable = "never";
    const [isValid, error] = spend(ctx, applicable);
    expect(isValid).toBe(false);
    expect(error).toBe('the "spend" rule does not support "never"');
  });

  test("should return false if the body is empty", () => {
    const ctx = { body: "" };
    const [isValid, error] = spend(ctx, alwaysApplicable);
    expect(isValid).toBe(false);
    expect(error).toBe("Commit message body must contain a spend directive");
  });

  test("should return false if the body does not contain a spend directive", () => {
    const ctx = { body: "body" };
    const [isValid, error] = spend(ctx, alwaysApplicable);
    expect(isValid).toBe(false);
    expect(error).toBe(
      "Commit message body must contain a line starting with a spend directive"
    );
  });

  test("should return false if the spend directive does not contain a time value", () => {
    const ctx = { body: "/spend" };
    const [isValid, error] = spend(ctx, alwaysApplicable);
    expect(isValid).toBe(false);
    expect(error).toBe(
      "Spend directive must be provided with at least one time value"
    );
  });

  test("should support alternative spend directive", () => {
    const ctx = { body: "/spend_time" };
    const [isValid, error] = spend(ctx, alwaysApplicable);
    expect(isValid).toBe(false);
    expect(error).toBe(
      "Spend directive must be provided with at least one time value"
    );
  });

  test("should return true for valid time values", () => {
    const ctx = { body: "/spend 2d 3h 30m" };
    const [isValid, error] = spend(ctx, alwaysApplicable);
    expect(error).toBeUndefined();
    expect(isValid).toBe(true);
  });
});
