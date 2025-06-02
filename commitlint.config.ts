import { type UserConfig } from '@commitlint/types';
import spendPlugin from './index';

export default {
  extends: [`@commitlint/config-conventional`],
  rules: {
    spend: [2, `always`],
  },
  plugins: [spendPlugin],
} satisfies UserConfig;
