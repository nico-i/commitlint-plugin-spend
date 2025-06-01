import { orderedTimeUnits, type TimeUnit } from "../TimeUnit/TimeUnit";

/**
 * The maximum value for each time unit.
 */
export const maxValueByTimeUnit: Record<TimeUnit, number> = {
  y: 99,
  mo: 11,
  w: 4,
  d: 6,
  h: 23,
  m: 59,
};

export type TimeValue = `${number}${TimeUnit}`;

/**
 * The regular expression pattern for validating time values.
 * It matches number time unit pairs like "2d", "3h", "30m", etc.
 * Can optionally start with a negative sign for negative time values.
 */
export const timeValuePattern = new RegExp(
  `^(-*\\d{1,2})(${orderedTimeUnits.join("|")})$`
);

export function isTimeValue(value: string): value is TimeValue {
  return timeValuePattern.test(value);
}
