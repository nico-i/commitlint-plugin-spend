import { validateCommitMsg } from "./src/utils/validateCommitMsg/validateCommitMsg";

export default {
  rules: {
    spend: validateCommitMsg,
  },
};
