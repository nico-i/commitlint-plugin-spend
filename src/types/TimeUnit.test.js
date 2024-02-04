import { describe, expect, test } from "vitest";
import { validateTimeUnit } from "./TimeUnit";

describe("validateTimeUnit", () => {
  test("should return true for valid time values", () => {
    const timeValues = ["2d", "3h", "30m"];
    const [isValid, error] = validateTimeUnit(timeValues);
    expect(error).toBeUndefined();
    expect(isValid).toBe(true);
  });

  test("should return false and an error message for time values with invalid units", () => {
    const timeValues = ["2d", "3h", "30x"];
    const [isValid, error] = validateTimeUnit(timeValues);
    expect(isValid).toBe(false);
    expect(error).toBe('No valid time unit found in "30x"');

    const timeValues2 = ["2d", "3h", "30asdfasdfasdfm"];
    const [isValid2, error2] = validateTimeUnit(timeValues2);
    expect(isValid2).toBe(false);
    expect(error2).toBe('No valid time unit found in "30asdfasdfasdfm"');
  });

  test("should return false and an error message for time values that cannot be parsed", () => {
    const timeValues = ["2d", "3h", "xm"];
    const [isValid, error] = validateTimeUnit(timeValues);
    expect(isValid).toBe(false);
    expect(error).toBe(
      'The time value "xm" cannot be parsed. Please provide a valid time value with no whitespace in between (e.g., "2m")'
    );
  });

  test("should return false and an error message for time values that exceed the maximum value", () => {
    const timeValues = ["2d", "3h", "100m"];
    const [isValid, error] = validateTimeUnit(timeValues);
    expect(isValid).toBe(false);
    expect(error).toBe(
      'The time value "100m" exceeds the maximum value for m (max value: 59)'
    );
  });

  test("should return false for time values that are not in the correct order", () => {
    const timeValues = ["3h", "1d"];
    const [isValid, error] = validateTimeUnit(timeValues);
    expect(isValid).toBe(false);
    expect(error).toBe(
      'Time values are not in the correct order. Found "d" after "h"'
    );
  });

  test("should return false for no time values found", () => {
    const timeValues = [];
    const [isValid, error] = validateTimeUnit(timeValues);
    expect(isValid).toBe(false);
    expect(error).toBe("No time value found");
  });

  test("should return false for time values with duplicate units", () => {
    const timeValues = ["2d", "3d", "1d"];
    const [isValid, error] = validateTimeUnit(timeValues);
    expect(isValid).toBe(false);
    expect(error).toBe('Duplicate time unit found in "3d"');
  });
});
