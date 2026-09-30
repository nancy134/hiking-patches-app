// Types for the custom operations in custom-queries.ts / custom-mutations.ts.
//
// These are hand-written: `ampx generate graphql-client-code` knows nothing about
// the custom operations, so it cannot emit them. They lived at the foot of
// src/API.ts, which meant every regeneration silently deleted them and they had to
// be re-appended by hand. Keeping them here instead makes API.ts purely generated
// and safe to overwrite.
//
// Only the types application code actually imports are kept. The other 34 that had
// accumulated in API.ts were dropped when this file was split out; recover any of
// them from git history if a custom operation needs one. If you add a custom
// operation, put its result type here, not in API.ts.

import type { Difficulty } from '@/API';

export enum PatchStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export type GetPatchWithMountainsQuery = {
  getPatch?:  {
    __typename: "Patch",
    id: string,
    name: string,
    description?: string | null,
    howToGet?: string | null,
    imageUrl?: string | null,
    regions?: Array< string | null > | null,
    difficulty?: Difficulty | null,
    popularity?: number | null,
    hasPeaks?: boolean | null,
    hasTrails?: boolean | null,
    completionRule?: string | null,
    isPurchasable?: boolean | null,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      items:  Array< {
        __typename: "PatchMountain",
        id: string,
        delisted?: boolean | null,
        mountain:  {
          __typename: "Mountain",
          id: string,
          name: string,
          elevation?: number | null,
          latitude?: number | null,
          longitude?: number | null,
          city?: string | null,
          state?: string | null,
        },
      } | null >,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type ListPatchMountainsWithMountainQuery = {
  listPatchMountains?:  {
    __typename: "ModelPatchMountainConnection",
    items:  Array< {
      __typename: "PatchMountain",
      id: string,
      createdAt: string,
      updatedAt: string,
      delisted?: boolean | null,
      patchPatchMountainsId?: string | null,
      mountainPatchMountainsId?: string | null,
      mountain:  {
        __typename: "Mountain",
        id: string,
        name: string,
        elevation?: number | null,
        city?: string | null,
        state?: string | null,
        latitude?: number | null,
        longitude?: number | null,
      },
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPatchMountainsWithPatchQuery = {
  listPatchMountains?:  {
    __typename: "ModelPatchMountainConnection",
    items:  Array< {
      __typename: "PatchMountain",
      id: string,
      createdAt: string,
      updatedAt: string,
      patchPatchMountainsId?: string | null,
      mountainPatchMountainsId?: string | null,
      patch:  {
        __typename: "Patch",
        id: string,
        name: string,
      },
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPatchWithTrailsQuery = {
  getPatch?:  {
    __typename: "Patch",
    id: string,
    name: string,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      items:  Array< {
        __typename: "PatchTrail",
        id: string,
        requiredMiles?: number | null,
        trailPatchTrailsId?: string | null,
        trail:  {
          __typename: "Trail",
          id: string,
          name: string,
          lengthMiles: number,
        },
      } | null >,
      nextToken?: string | null,
    } | null,
  } | null,
};

export type ListPatchTrailsWithTrailQuery = {
  listPatchTrails?:  {
    __typename: "ModelPatchTrailConnection",
    items:  Array< {
      __typename: "PatchTrail",
      id: string,
      requiredMiles?: number | null,
      patchPatchTrailsId?: string | null,
      trailPatchTrailsId?: string | null,
      trail:  {
        __typename: "Trail",
        id: string,
        name: string,
        lengthMiles: number,
      },
    } | null >,
    nextToken?: string | null,
  } | null,
};
