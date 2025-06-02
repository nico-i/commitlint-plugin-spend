/**
 * The GitLab spend commands.
 * @see https://docs.gitlab.com/ee/user/project/quick_actions.html#issues-merge-requests-and-epics
 */
export const spendingCommands = [`/spend`, `/spend_time`] as const;

export type SpendCommand = (typeof spendingCommands)[number];

export const spendCommandPattern = new RegExp(
  `^(${spendingCommands.join(`|`)})$`,
);

export function isSpendCommand(value: string): value is SpendCommand {
  return spendingCommands.includes(value as SpendCommand);
}
