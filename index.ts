import { ensureCommitMsgHasValidSpendDirective } from "./src/utils/ensureCommitMsgHasValidSpendDirective/ensureCommitMsgHasValidSpendDirective";

export default {
  rules: {
    spend: ensureCommitMsgHasValidSpendDirective,
  },
};
