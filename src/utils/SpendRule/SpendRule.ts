import type { SyncRule } from "@commitlint/types";
import { spendingCommands } from "../../types/SpendCommand/SpendCommand";
import { type TimeUnit, orderedTimeUnits } from "../../types/TimeUnit/TimeUnit";
import {
  timeValuePattern,
  type TimeValue,
  isTimeValue,
  maxValueByTimeUnit,
} from "../../types/TimeValue/TimeValue";

/**
 * Validate the spend command in the commit message.
 *
 * @example
 * // Valid commit message body
 * const commitMessage = {
 *   body: "/spend 1mo 2w 3d 4h 5m 2018-08-26"
 * };
 * // or
 * const commitMessage = {
 *   body: "/spend_time -1h 30m"
 * };
 *
 * @param parsed The parsed commit message.
 * @param when The condition under which the rule applies.
 * @returns A tuple indicating whether the validation passed and an error message if it failed.
 */
export const spendRule: SyncRule = (parsed, when) => {
  if (when === "never") {
    return [true, undefined];
  }

  const { body } = parsed;
  if (!body) {
    return [
      false,
      "Commit message must contain a body (with a spend directive)",
    ];
  }

  const lines = body.split("\n");

  const spendLines = lines.filter((line) =>
    spendingCommands.some((cmd) => line.startsWith(cmd))
  );

  if (spendLines.length !== 1 || !spendLines[0]) {
    return [
      false,
      `Commit message body must contain a single spend directive, i.e., one of the following: ${spendingCommands.join(
        ", "
      )}. Found ${spendLines.length} spend directives.`,
    ];
  }

  const spendLine = spendLines[0];
  const spendLineSplit = spendLine.split(" ");

  if (spendLineSplit.length < 2) {
    return [
      false,
      `Spend directive must contain at least one time value. A time value must follow the RegEx pattern: ${timeValuePattern.source}`,
    ];
  }

  const maybeTimeValues = spendLineSplit.slice(1);

  const timeValues: TimeValue[] = [];
  let maybeDate: Date | null = null;

  // ensure that all strings are valid time values
  for (let i = 0; i < maybeTimeValues.length; i++) {
    const maybeTimeValue = maybeTimeValues[i]!;

    if (!isTimeValue(maybeTimeValue)) {
      if (i === maybeTimeValues.length - 1) {
        // If this is the last value and it isn't a time value, it could be an ISO date string
        const date = new Date(maybeTimeValue);
        if (isNaN(date.getTime())) {
          return [
            false,
            `The last time value "${maybeTimeValue}" is neither a valid time value nor a valid ISO date string (YYYY-MM-DD)`,
          ];
        }
        maybeDate = date;
        continue;
      }
      return [
        false,
        `The time value "${maybeTimeValue}" is not a valid time value. A time value must follow the RegEx pattern: ${timeValuePattern.source}`,
      ];
    }

    timeValues.push(maybeTimeValue);
  }

  const timeValuesWithoutDate = maybeDate
    ? timeValues.slice(0, -1)
    : timeValues;

  const unsortedTimeUnits: TimeUnit[] = [];

  for (const timeValue of timeValuesWithoutDate) {
    const numericPart = /^(\d+)/.exec(timeValue)?.[1]!;
    const parsedNumericPart = parseInt(numericPart, 10);
    const unitPart: TimeUnit = timeValue.replace(numericPart, "") as TimeUnit;

    if (parsedNumericPart > maxValueByTimeUnit[unitPart]) {
      return [
        false,
        `The time value "${timeValue}" exceeds the maximum value for "${unitPart}" (max value: ${maxValueByTimeUnit[unitPart]})`,
      ];
    }

    unsortedTimeUnits.push(unitPart);
  }

  // Check for duplicates in the time units
  const uniqueTimeUnits = new Set(unsortedTimeUnits);
  if (uniqueTimeUnits.size !== unsortedTimeUnits.length) {
    return [
      false,
      `Duplicate time units found in the spend directive: ${[
        ...unsortedTimeUnits,
      ].join(", ")}`,
    ];
  }

  // ensure that the time values are in the correct order, i.e., from largest to smallest unit
  const unitIndices = unsortedTimeUnits.map((unit) =>
    orderedTimeUnits.indexOf(unit)
  );
  const isEveryPreviousIndexLarger = unitIndices.every(
    (index, i) => i === 0 || index >= unitIndices[i - 1]!
  );
  if (!isEveryPreviousIndexLarger) {
    return [
      false,
      `Time values are not in the correct order. Time values must be ordered from largest to smallest unit: ${orderedTimeUnits.join(
        ", "
      )}. Found: ${unsortedTimeUnits.join(", ")}`,
    ];
  }

  return [true, undefined];
};
