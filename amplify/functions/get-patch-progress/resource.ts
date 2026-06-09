import { defineFunction } from '@aws-amplify/backend';

export const getPatchProgress = defineFunction({
  name: 'get-patch-progress',
  entry: './handler.ts',
  environment: {
    HIKES_TZ: 'America/New_York',
  },
});
