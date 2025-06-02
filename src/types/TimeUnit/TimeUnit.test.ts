import { describe, expect, test } from 'bun:test';
import { isTimeUnit, type TimeUnit } from './TimeUnit';

describe(isTimeUnit.name, () => {
  test(`should return true for valid time units`, () => {
    expect(isTimeUnit(`y`)).toBe(true);
    expect(isTimeUnit(`mo`)).toBe(true);
    expect(isTimeUnit(`w`)).toBe(true);
    expect(isTimeUnit(`d`)).toBe(true);
    expect(isTimeUnit(`h`)).toBe(true);
    expect(isTimeUnit(`m`)).toBe(true);
  });

  test(`should return false for invalid time units`, () => {
    expect(isTimeUnit(`s`)).toBe(false);
    expect(isTimeUnit(`min`)).toBe(false);
    expect(isTimeUnit(`hour`)).toBe(false);
    expect(isTimeUnit(`day`)).toBe(false);
    expect(isTimeUnit(`week`)).toBe(false);
    expect(isTimeUnit(`month`)).toBe(false);
    expect(isTimeUnit(`year`)).toBe(false);
    expect(isTimeUnit(``)).toBe(false);
    expect(isTimeUnit(`invalid`)).toBe(false);
    expect(isTimeUnit(`Y`)).toBe(false);
    expect(isTimeUnit(`MO`)).toBe(false);
  });

  test(`should act as type guard`, () => {
    const value = `h`;
    if (isTimeUnit(value)) {
      const unit: TimeUnit = value;
      expect(unit).toBe(`h`);
    }
  });
});
