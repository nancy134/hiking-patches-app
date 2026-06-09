import { defineAuth } from '@aws-amplify/backend';
import { migrateUser } from '../functions/migrate-user/resource';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ['Admin'],
  triggers: {
    userMigration: migrateUser,
  },
});
