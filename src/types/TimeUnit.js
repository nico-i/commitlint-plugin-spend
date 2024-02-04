/**
 * The ordered time units based on the GitLab time unit pattern.
 * @see https://docs.gitlab.com/ee/user/project/time_tracking.html#available-time-units
 */
const orderedTimeUnits = ["m", "h", "d", "w", "mo", "y"];

/**
 * The maximum value for each time unit.
 */
const maxValueByUnit = {
  m: 59,
  h: 23,
  d: 6,
  w: 4,
  mo: 11,
  y: 100,
};

/**
 * Validate a given string array based on the GitLab time unit pattern.
 * @see orderedTimeUnits
 *
 * @param timeValues - The time values to validate sorted from largest to smallest time unit (e.g., ["3m", "2h", "1d"])
 * @returns - True if the time values are valid and in the correct order, false otherwise
 */
exports.validateTimeUnit = (timeValues) => {
  let lastUnitIndex = -1;
  const unitCount = new Array(orderedTimeUnits.length).fill(0);
  for (const timeValue of timeValues) {
    const regex = /^(\d+)(\D+)$/; // Match numbers followed by a non-digit characters (e.g., "2234234abcdef")
    const match = timeValue.match(regex);

    if (!match) {
      return [
        false,
        `The time value "${timeValue}" cannot be parsed. Please provide a valid time value with no whitespace in between (e.g., "2${orderedTimeUnits[0]}")`,
      ];
    }

    // match[1] will contain the numeric part, match[2] will contain the char part
    const numberString = match[1];
    const charString = match[2];

    const unitIndex = orderedTimeUnits.findIndex((u) => charString === u);
    const unit = orderedTimeUnits[unitIndex];

    if (unitIndex === -1) {
      return [false, `No valid time unit found in "${timeValue}"`];
    }
    // Increment the count for the unit
    unitCount[unitIndex] += 1;
    if (unitCount[unitIndex] > 1) {
      return [false, `Duplicate time unit found in "${timeValue}"`];
    }

    const timeValueNumber = parseInt(numberString, 10);
    if (isNaN(timeValueNumber)) {
      return [
        false,
        `The time value "${timeValue}" cannot be parsed. Please provide a valid time value with no whitespace in between (e.g., "2${unit}")`,
      ];
    }

    if (timeValueNumber > maxValueByUnit[unit]) {
      return [
        false,
        `The time value "${timeValue}" exceeds the maximum value for ${unit} (max value: ${maxValueByUnit[unit]})`,
      ];
    }

    if (lastUnitIndex !== -1 && unitIndex > lastUnitIndex) {
      return [
        false,
        `Time values are not in the correct order. Found "${unit}" after "${orderedTimeUnits[lastUnitIndex]}"`,
      ];
    }

    lastUnitIndex = unitIndex;
  }

  if (lastUnitIndex === -1) {
    return [false, "No time value found"];
  }

  return [true, undefined];
};
