import { defineFunction } from '@aws-amplify/backend';

export const getRelatedPatches = defineFunction({
  name: 'get-related-patches',
  entry: './handler.ts',
  resourceGroupName: 'data',
});
