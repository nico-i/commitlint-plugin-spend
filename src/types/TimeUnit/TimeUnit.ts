/**
 * The ordered time units based on the GitLab time unit pattern.
 * @see https://docs.gitlab.com/ee/user/project/time_tracking.html#available-time-units
 */
export const orderedTimeUnits = ["y", "mo", "w", "d", "h", "m"] as const;

export type TimeUnit = (typeof orderedTimeUnits)[number];

export function isTimeUnit(value: string): value is TimeUnit {
  return orderedTimeUnits.includes(value as TimeUnit);
}
