import type { Plugin } from '@commitlint/types';
import { validateCommitMsg } from './src/utils/validateCommitMsg/validateCommitMsg';

const spendPlugin: Plugin = {
  rules: {
    spend: validateCommitMsg,
  },
};

export default spendPlugin;
