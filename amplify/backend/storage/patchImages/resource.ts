import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'patchImages',
  access: (allow) => ({
    'public/': [
      allow.groups(['Admin']).to(['read', 'write', 'delete']),
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
    ],
    'public/${userId}/': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  }),
});

