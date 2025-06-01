import { describe, it, expect } from "bun:test";
import { spendRule } from "./SpendRule";

const mockCommit = {
  merge: null,
  header: "feat: add new feature",
  body: "",
  footer: null,
  notes: [] as never,
  references: [] as never,
  mentions: [] as never,
  revert: null,
};

describe(spendRule.name, () => {
  it("should pass when 'when' is 'never'", () => {
    const result = spendRule({ ...mockCommit, body: "/spend 1mo" }, "never");
    expect(result).toEqual([true, undefined]);
  });

  it("should fail when commit message body is missing", () => {
    const result = spendRule({ ...mockCommit, body: null }, "always");
    expect(result).toEqual([
      false,
      "Commit message must contain a body (with a spend directive)",
    ]);
  });

  it("should fail when there are multiple spend directives", () => {
    const result = spendRule(
      { ...mockCommit, body: "/spend 1mo\n/spend_time 2w" },
      "always"
    );
    expect(result).toEqual([
      false,
      "Commit message body must contain a single spend directive, i.e., one of the following: /spend, /spend_time. Found 2 spend directives.",
    ]);
  });

  it("should fail when spend directive has no time values", () => {
    const result = spendRule({ ...mockCommit, body: "/spend" }, "always");
    expect(result).toEqual([
      false,
      `Spend directive must contain at least one time value. A time value must follow the RegEx pattern: ^(\\d{1,2})(y|mo|w|d|h|m)$`,
    ]);
  });

  it("should fail when a time value is invalid", () => {
    const result = spendRule(
      { ...mockCommit, body: "/spend 1x 2mo" },
      "always"
    );
    expect(result).toEqual([
      false,
      `The time value \"1x\" is not a valid time value. A time value must follow the RegEx pattern: ^(\\d{1,2})(y|mo|w|d|h|m)$`,
    ]);
  });

  it("should fail when the last time value is not a valid ISO date", () => {
    const result = spendRule(
      { ...mockCommit, body: "/spend 1mo 2022-13-01" },
      "always"
    );
    expect(result).toEqual([
      false,
      `The last time value \"2022-13-01\" is neither a valid time value nor a valid ISO date string (YYYY-MM-DD)`,
    ]);
  });

  it("should fail when a time value exceeds the maximum allowed value", () => {
    const result = spendRule({ ...mockCommit, body: "/spend 99mo" }, "always");
    expect(result).toEqual([
      false,
      `The time value "99mo" exceeds the maximum value for "mo" (max value: 11)`,
    ]);
  });

  it("should fail when there are duplicate time units", () => {
    const result = spendRule(
      { ...mockCommit, body: "/spend 1mo 2mo" },
      "always"
    );
    expect(result).toEqual([
      false,
      "Duplicate time units found in the spend directive: mo, mo",
    ]);
  });

  it("should fail when time values are not in correct order", () => {
    const result = spendRule(
      { ...mockCommit, body: "/spend 1d 1mo" },
      "always"
    );
    expect(result).toEqual([
      false,
      "Time values are not in the correct order. Time values must be ordered from largest to smallest unit: y, mo, w, d, h, m. Found: d, mo",
    ]);
  });

  it("should pass for a valid spend directive", () => {
    const result = spendRule(
      { ...mockCommit, body: "/spend 1mo 2w 3d 4h 5m 2022-08-26" },
      "always"
    );
    expect(result).toEqual([true, undefined]);
  });
});
