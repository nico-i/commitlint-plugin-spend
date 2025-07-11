import { type UserConfig } from '@commitlint/types';
import spendPlugin from './index';

const config: UserConfig = {
  extends: [`@commitlint/config-conventional`],
  rules: {
    spend: [2, `always`],
  },
  plugins: [spendPlugin],
};

export default config;
