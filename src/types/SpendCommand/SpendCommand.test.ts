import { describe, expect, test } from "bun:test";
import {
  spendingCommands,
  spendCommandPattern,
  isSpendCommand,
  type SpendCommand,
} from "./SpendCommand";

describe(isSpendCommand.name, () => {
  test("should return true for valid spend commands", () => {
    expect(isSpendCommand("/spend")).toBe(true);
    expect(isSpendCommand("/spend_time")).toBe(true);
  });

  test("should return false for invalid commands", () => {
    expect(isSpendCommand("/invalid")).toBe(false);
    expect(isSpendCommand("spend")).toBe(false);
    expect(isSpendCommand("/spend ")).toBe(false);
    expect(isSpendCommand("")).toBe(false);
    expect(isSpendCommand("/spend_time_extra")).toBe(false);
  });

  test("should act as type guard", () => {
    const value: string = "/spend";
    if (isSpendCommand(value)) {
      const command: SpendCommand = value;
      expect(command).toBe("/spend");
    }
  });
});
