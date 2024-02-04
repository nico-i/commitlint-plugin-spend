import { validateTimeUnit } from "./src/types/TimeUnit";

/**
 * The GitLab spend directives.
 * @see https://docs.gitlab.com/ee/user/project/quick_actions.html#issues-merge-requests-and-epics
 */
const spendDirectives = ["/spend", "/spend_time"];

module.exports = {
  rules: {
    spend: (ctx, applicable) => {
      if (applicable === "never") {
        return [false, 'the "spend" rule does not support "never"'];
      }

      const { body } = ctx;

      if (!body) {
        // Require a body
        return [false, "Commit message body must contain a spend directive"];
      }

      const lines = body.split("\n");

      const spendLines = lines.filter((line) =>
        spendDirectives.some((directive) => line.startsWith(directive))
      );

      if (spendLines.length === 0) {
        return [
          false,
          "Commit message body must contain a line starting with a spend directive",
        ];
      }

      for (const line of spendLines) {
        const lineSplit = line.split(" ");

        if (lineSplit.length < 2) {
          return [
            false,
            "Spend directive must be provided with at least one time value",
          ];
        }

        const timeValues = lineSplit.slice(1);

        const [isValid, msg] = validateTimeUnit(timeValues);

        if (!isValid) {
          return [false, msg];
        }
      }

      return [true, undefined];
    },
  },
};
