import type { SyncRule } from '@commitlint/types';
import { spendingCommands } from '../../types/SpendCommand/SpendCommand';
import { type TimeUnit, orderedTimeUnits } from '../../types/TimeUnit/TimeUnit';
import {
  timeValuePattern,
  type TimeValue,
  isTimeValue,
  maxValueByTimeUnit,
} from '../../types/TimeValue/TimeValue';

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
export const validateCommitMsg: SyncRule = (parsed, when) => {
  if (when === `never`) {
    return [true, undefined];
  }

  const { body } = parsed;
  if (!body) {
    return [
      false,
      `Commit message must contain a body (with a spend directive)`,
    ];
  }

  const lines = body.split(`\n`);

  const spendLines = lines.filter((line) =>
    spendingCommands.some((cmd) => line.startsWith(cmd)),
  );

  if (spendLines.length !== 1 || !spendLines[0]) {
    return [
      false,
      `Commit message body must contain a single spend directive, i.e., one of the following: ${spendingCommands.join(
        `, `,
      )}. Found ${spendLines.length} spend directives.`,
    ];
  }

  const spendLine = spendLines[0];
  const spendLineSplit = spendLine.split(` `);

  if (spendLineSplit.length < 2) {
    return [
      false,
      `Spend directive must contain at least one time value. A time value must follow the RegEx pattern: ${timeValuePattern.source}`,
    ];
  }

  const maybeTimeValues = spendLineSplit.slice(1);

  const timeValues: TimeValue[] = [];

  // ensure that all strings are valid time values
  for (const maybeTimeValue of maybeTimeValues) {
    if (!isTimeValue(maybeTimeValue)) {
      return [
        false,
        `The time value "${maybeTimeValue}" is not a valid time value. A time value must follow the RegEx pattern: ${timeValuePattern.source}`,
      ];
    }
    timeValues.push(maybeTimeValue);
  }

  const unsortedTimeUnits: TimeUnit[] = [];

  for (const timeValue of timeValues) {
    const numericPart = /^(\d+)/.exec(timeValue)?.[1];
    if (!numericPart) {
      return [
        false,
        `The time value "${timeValue}" does not contain a numeric part. A time value must follow the RegEx pattern: ${timeValuePattern.source}`,
      ];
    }
    const absoluteNumericValue = Math.abs(parseInt(numericPart, 10));
    const unitPart: TimeUnit = timeValue.replace(numericPart, ``) as TimeUnit;

    if (absoluteNumericValue > maxValueByTimeUnit[unitPart]) {
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
      ].join(`, `)}`,
    ];
  }

  // ensure that the time values are in the correct order, i.e., from largest to smallest unit
  const unitIndices = unsortedTimeUnits.map((unit) =>
    orderedTimeUnits.indexOf(unit),
  );
  const isEveryPreviousIndexLarger = unitIndices.every((index, i) => {
    if (i === 0) return true; // The first index is always valid
    const prev = unitIndices[i - 1];
    return prev && index >= prev;
  });
  if (!isEveryPreviousIndexLarger) {
    return [
      false,
      `Time values are not in the correct order. Time values must be ordered from largest to smallest unit: ${orderedTimeUnits.join(
        `, `,
      )}. Found: ${unsortedTimeUnits.join(`, `)}`,
    ];
  }

  return [true, undefined];
};
