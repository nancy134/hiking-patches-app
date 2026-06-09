import { defineFunction } from '@aws-amplify/backend';

export const migrateUser = defineFunction({
  name: 'migrate-user',
  entry: './handler.ts',
});
