import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { getPatchProgress } from '../functions/get-patch-progress/resource';
import { listUsers } from '../functions/list-users/resource';

// allow.resource() is a valid runtime feature but is typed as absent on
// BaseAllowModifier in data-schema v1.21. Cast through any to use it.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resourceAllow = (allow: unknown, fn: unknown) => (allow as any).resource(fn);

const schema = a.schema({
  // ─── Enums ────────────────────────────────────────────────────────────────

  Difficulty: a.enum(['EASY', 'MODERATE', 'HARD', 'EXTRA_HARD', 'EXTRA_EXTRA_HARD']),
  PatchStatus: a.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  Season: a.enum(['FALL', 'WINTER', 'SPRING', 'SUMMER']),

  // ─── Custom type returned by Lambda-backed queries ─────────────────────────

  PatchProgress: a.customType({
    patchId: a.id().required(),
    userId: a.id().required(),
    completed: a.float().required(),
    denom: a.float().required(),
    percent: a.integer().required(),
    note: a.string(),
  }),

  // ─── Lambda-backed custom queries ──────────────────────────────────────────

  getPatchProgressSummary: a
    .query()
    .arguments({ patchId: a.id().required(), userId: a.id().required() })
    .returns(a.ref('PatchProgress'))
    .handler(a.handler.function(getPatchProgress))
    .authorization((allow) => [allow.authenticated()]),

  listPatchProgress: a
    .query()
    .arguments({ patchIds: a.id().required().array(), userId: a.id().required() })
    .returns(a.ref('PatchProgress').array().required())
    .handler(a.handler.function(getPatchProgress))
    .authorization((allow) => [allow.authenticated()]),

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
      allow.authenticated().to(['read']),
      allow.group('Admin'),
      resourceAllow(allow, listUsers).to(['read']),
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
      allow.group('Admin').to(['read', 'update', 'delete']),
      resourceAllow(allow, listUsers).to(['read']),
    ]),

  PatchRequest: a
    .model({
      email: a.string().required(),
      description: a.string().required(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(['create']),
      allow.group('Admin').to(['read']),
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
      allow.group('Admin'),
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
      allow.authenticated().to(['read']),
      allow.group('Admin'),
      resourceAllow(allow, getPatchProgress).to(['read']),
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
      allow.group('Admin').to(['read', 'delete', 'update']),
      resourceAllow(allow, getPatchProgress).to(['read']),
      resourceAllow(allow, listUsers).to(['read']),
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
      allow.group('Admin'),
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
      allow.authenticated().to(['read']),
      allow.group('Admin'),
      resourceAllow(allow, getPatchProgress).to(['read']),
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
      allow.group('Admin').to(['read', 'delete', 'update']),
      resourceAllow(allow, getPatchProgress).to(['read']),
      resourceAllow(allow, listUsers).to(['read']),
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
