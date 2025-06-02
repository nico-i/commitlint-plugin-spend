import type { Plugin } from '@commitlint/types';
import { validateCommitMsg } from './src/utils/validateCommitMsg/validateCommitMsg';

export default {
  rules: {
    spend: validateCommitMsg,
  },
} satisfies Plugin;
