import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // ─── Enums ────────────────────────────────────────────────────────────────

  Difficulty: a.enum(['EASY', 'MODERATE', 'HARD', 'EXTRA_HARD', 'EXTRA_EXTRA_HARD']),
  PatchStatus: a.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  Season: a.enum(['FALL', 'WINTER', 'SPRING', 'SUMMER']),

  // ─── Models ────────────────────────────────────────────────────────────────

  Patch: a
    .model({
      name: a.string().required(),
      description: a.string(),
      howToGet: a.string(),
      imageUrl: a.string(),
      regions: a.string().array(),
      difficulty: a.ref('Difficulty'),
      latitude: a.float(),
      longitude: a.float(),
      popularity: a.integer(),
      hasPeaks: a.boolean(),
      hasTrails: a.boolean(),
      completionRule: a.json(),
      isPurchasable: a.boolean(),
      status: a.string().default('PUBLISHED'),
      seasons: a.ref('Season').array(),
      userPatches: a.hasMany('UserPatch', 'patchID'),
      patchMountains: a.hasMany('PatchMountain', 'patchPatchMountainsId'),
      patchTrails: a.hasMany('PatchTrail', 'patchPatchTrailsId'),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated(),
    ]),

  UserPatch: a
    .model({
      patchID: a.id().required(),
      patch: a.belongsTo('Patch', 'patchID'),
      userID: a.string().required(),
      dateCompleted: a.date(),
      notes: a.string(),
      difficulty: a.integer(),
      imageUrl: a.string(),
      inProgress: a.boolean(),
      wishlisted: a.boolean(),
    })
    .secondaryIndexes((index) => [
      index('patchID').name('byPatch').queryField('userPatchesByPatch'),
      index('userID').sortKeys(['patchID']).name('byUserByPatch').queryField('userPatchesByUserByPatch'),
    ])
    .authorization((allow) => [
      allow.ownerDefinedIn('userID'),
      allow.authenticated().to(['read', 'update', 'delete']),
    ]),

  PatchRequest: a
    .model({
      email: a.string().required(),
      description: a.string().required(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(['create']),
      allow.authenticated().to(['read']),
    ]),

  Mountain: a
    .model({
      name: a.string().required(),
      elevation: a.integer(),
      latitude: a.float(),
      longitude: a.float(),
      city: a.string(),
      state: a.string(),
      patchMountains: a.hasMany('PatchMountain', 'mountainPatchMountainsId'),
      userMountains: a.hasMany('UserMountain', 'mountainID'),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated(),
    ]),

  PatchMountain: a
    .model({
      patchPatchMountainsId: a.id(),
      mountainPatchMountainsId: a.id(),
      patch: a.belongsTo('Patch', 'patchPatchMountainsId'),
      mountain: a.belongsTo('Mountain', 'mountainPatchMountainsId'),
      delisted: a.boolean(),
    })
    .secondaryIndexes((index) => [
      index('patchPatchMountainsId').name('byPatch').queryField('patchMountainsByPatch'),
      index('mountainPatchMountainsId').name('byMountain').queryField('patchMountainsByMountain'),
    ])
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated(),
    ]),

  UserMountain: a
    .model({
      userID: a.id().required(),
      mountainID: a.id().required(),
      dateClimbed: a.date().required(),
      notes: a.string(),
      mountain: a.belongsTo('Mountain', 'mountainID'),
    })
    .secondaryIndexes((index) => [
      index('userID').name('byUser').queryField('userMountainsByUser'),
      index('userID').sortKeys(['mountainID']).name('byUserByMountain').queryField('userMountainsByUserByMountain'),
      index('userID').sortKeys(['dateClimbed']).name('byUserByDate').queryField('userMountainsByUserByDate'),
      index('mountainID').name('byMountain').queryField('userMountainsByMountain'),
    ])
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read', 'delete', 'update']),
    ]),

  Trail: a
    .model({
      name: a.string().required(),
      description: a.string(),
      lengthMiles: a.float().required(),
      patchTrails: a.hasMany('PatchTrail', 'trailPatchTrailsId'),
      userTrails: a.hasMany('UserTrail', 'trailID'),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated(),
    ]),

  PatchTrail: a
    .model({
      patchPatchTrailsId: a.id(),
      trailPatchTrailsId: a.id(),
      patch: a.belongsTo('Patch', 'patchPatchTrailsId'),
      trail: a.belongsTo('Trail', 'trailPatchTrailsId'),
      requiredMiles: a.float(),
    })
    .secondaryIndexes((index) => [
      index('patchPatchTrailsId').name('byPatch').queryField('patchTrailsByPatch'),
      index('trailPatchTrailsId').name('byTrail').queryField('patchTrailsByTrail'),
    ])
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated(),
    ]),

  UserTrail: a
    .model({
      userID: a.id().required(),
      trailID: a.id().required(),
      dateCompleted: a.date(),
      milesRemaining: a.float(),
      notes: a.string(),
      trail: a.belongsTo('Trail', 'trailID'),
    })
    .identifier(['userID', 'trailID'])
    .secondaryIndexes((index) => [
      index('userID').name('byUser').queryField('userTrailsByUser'),
      index('userID').sortKeys(['dateCompleted']).name('byUserByDateCompleted').queryField('userTrailsByUserByDateCompleted'),
      index('trailID').name('byTrail').queryField('userTrailsByTrail'),
    ])
    .authorization((allow) => [
      allow.ownerDefinedIn('userID'),
      allow.authenticated().to(['read', 'delete', 'update']),
    ]),

  PatchPurchase: a
    .model({
      userId: a.id().required(),
      patchId: a.id().required(),
      stripeSessionId: a.string().required(),
      amount: a.integer(),
      currency: a.string(),
      stripeReceiptUrl: a.string(),
    })
    .authorization((allow) => [
      allow.ownerDefinedIn('userId'),
      allow.publicApiKey().to(['create', 'read']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
