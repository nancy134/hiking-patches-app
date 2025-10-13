/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type DeleteUserMountainInput = {
  id: string,
};

export type UserMountain = {
  __typename: "UserMountain",
  id: string,
  userID: string,
  mountainID: string,
  dateClimbed: string,
  notes?: string | null,
  mountain?: Mountain | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type Mountain = {
  __typename: "Mountain",
  id: string,
  name: string,
  elevation?: number | null,
  latitude?: number | null,
  longitude?: number | null,
  city?: string | null,
  state?: string | null,
  patchMountains?: ModelPatchMountainConnection | null,
  userMountains?: ModelUserMountainConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelPatchMountainConnection = {
  __typename: "ModelPatchMountainConnection",
  items:  Array<PatchMountain | null >,
  nextToken?: string | null,
};

export type PatchMountain = {
  __typename: "PatchMountain",
  id: string,
  patchPatchMountainsId?: string | null,
  mountainPatchMountainsId?: string | null,
  patch: Patch,
  mountain: Mountain,
  delisted?: boolean | null,
  createdAt: string,
  updatedAt: string,
};

export type Patch = {
  __typename: "Patch",
  id: string,
  name: string,
  description?: string | null,
  howToGet?: string | null,
  imageUrl?: string | null,
  regions?: Array< string | null > | null,
  difficulty?: Difficulty | null,
  latitude?: number | null,
  longitude?: number | null,
  popularity?: number | null,
  hasPeaks?: boolean | null,
  hasTrails?: boolean | null,
  completionRule?: string | null,
  userPatches?: ModelUserPatchConnection | null,
  patchMountains?: ModelPatchMountainConnection | null,
  patchTrails?: ModelPatchTrailConnection | null,
  createdAt: string,
  updatedAt: string,
};

export enum Difficulty {
  EASY = "EASY",
  MODERATE = "MODERATE",
  HARD = "HARD",
  EXTRA_HARD = "EXTRA_HARD",
  EXTRA_EXTRA_HARD = "EXTRA_EXTRA_HARD",
}


export type ModelUserPatchConnection = {
  __typename: "ModelUserPatchConnection",
  items:  Array<UserPatch | null >,
  nextToken?: string | null,
};

export type UserPatch = {
  __typename: "UserPatch",
  id: string,
  patchID: string,
  patch?: Patch | null,
  userID: string,
  dateCompleted?: string | null,
  notes?: string | null,
  difficulty?: number | null,
  imageUrl?: string | null,
  inProgress?: boolean | null,
  wishlisted?: boolean | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type ModelPatchTrailConnection = {
  __typename: "ModelPatchTrailConnection",
  items:  Array<PatchTrail | null >,
  nextToken?: string | null,
};

export type PatchTrail = {
  __typename: "PatchTrail",
  id: string,
  patchPatchTrailsId?: string | null,
  trailPatchTrailsId?: string | null,
  patch: Patch,
  trail: Trail,
  requiredMiles?: number | null,
  createdAt: string,
  updatedAt: string,
};

export type Trail = {
  __typename: "Trail",
  id: string,
  name: string,
  description?: string | null,
  lengthMiles: number,
  patchTrails?: ModelPatchTrailConnection | null,
  userTrails?: ModelUserTrailConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelUserTrailConnection = {
  __typename: "ModelUserTrailConnection",
  items:  Array<UserTrail | null >,
  nextToken?: string | null,
};

export type UserTrail = {
  __typename: "UserTrail",
  userID: string,
  trailID: string,
  dateCompleted?: string | null,
  milesRemaining?: number | null,
  notes?: string | null,
  trail?: Trail | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelUserMountainConnection = {
  __typename: "ModelUserMountainConnection",
  items:  Array<UserMountain | null >,
  nextToken?: string | null,
};

export type CreateUserMountainInput = {
  id?: string | null,
  userID: string,
  mountainID: string,
  dateClimbed: string,
  notes?: string | null,
};

export type CreateUserTrailInput = {
  userID: string,
  trailID: string,
  dateCompleted?: string | null,
  milesRemaining?: number | null,
  notes?: string | null,
};

export type UpdateUserTrailInput = {
  userID: string,
  trailID: string,
  dateCompleted?: string | null,
  milesRemaining?: number | null,
  notes?: string | null,
};

export type ModelUserPatchFilterInput = {
  id?: ModelIDInput | null,
  patchID?: ModelIDInput | null,
  userID?: ModelStringInput | null,
  dateCompleted?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  difficulty?: ModelIntInput | null,
  imageUrl?: ModelStringInput | null,
  inProgress?: ModelBooleanInput | null,
  wishlisted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserPatchFilterInput | null > | null,
  or?: Array< ModelUserPatchFilterInput | null > | null,
  not?: ModelUserPatchFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelPatchMountainFilterInput = {
  id?: ModelIDInput | null,
  patchPatchMountainsId?: ModelIDInput | null,
  mountainPatchMountainsId?: ModelIDInput | null,
  delisted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPatchMountainFilterInput | null > | null,
  or?: Array< ModelPatchMountainFilterInput | null > | null,
  not?: ModelPatchMountainFilterInput | null,
};

export type CreateUserPatchInput = {
  id?: string | null,
  patchID: string,
  userID: string,
  dateCompleted?: string | null,
  notes?: string | null,
  difficulty?: number | null,
  imageUrl?: string | null,
  inProgress?: boolean | null,
  wishlisted?: boolean | null,
};

export type UpdateUserPatchInput = {
  id: string,
  patchID?: string | null,
  userID?: string | null,
  dateCompleted?: string | null,
  notes?: string | null,
  difficulty?: number | null,
  imageUrl?: string | null,
  inProgress?: boolean | null,
  wishlisted?: boolean | null,
};

export type ModelPatchTrailFilterInput = {
  id?: ModelIDInput | null,
  patchPatchTrailsId?: ModelIDInput | null,
  trailPatchTrailsId?: ModelIDInput | null,
  requiredMiles?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPatchTrailFilterInput | null > | null,
  or?: Array< ModelPatchTrailFilterInput | null > | null,
  not?: ModelPatchTrailFilterInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type CreatePatchInput = {
  id?: string | null,
  name: string,
  description?: string | null,
  howToGet?: string | null,
  imageUrl?: string | null,
  regions?: Array< string | null > | null,
  difficulty?: Difficulty | null,
  latitude?: number | null,
  longitude?: number | null,
  popularity?: number | null,
  hasPeaks?: boolean | null,
  hasTrails?: boolean | null,
  completionRule?: string | null,
};

export type ModelPatchConditionInput = {
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  howToGet?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  regions?: ModelStringInput | null,
  difficulty?: ModelDifficultyInput | null,
  latitude?: ModelFloatInput | null,
  longitude?: ModelFloatInput | null,
  popularity?: ModelIntInput | null,
  hasPeaks?: ModelBooleanInput | null,
  hasTrails?: ModelBooleanInput | null,
  completionRule?: ModelStringInput | null,
  and?: Array< ModelPatchConditionInput | null > | null,
  or?: Array< ModelPatchConditionInput | null > | null,
  not?: ModelPatchConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelDifficultyInput = {
  eq?: Difficulty | null,
  ne?: Difficulty | null,
};

export type UpdatePatchInput = {
  id: string,
  name?: string | null,
  description?: string | null,
  howToGet?: string | null,
  imageUrl?: string | null,
  regions?: Array< string | null > | null,
  difficulty?: Difficulty | null,
  latitude?: number | null,
  longitude?: number | null,
  popularity?: number | null,
  hasPeaks?: boolean | null,
  hasTrails?: boolean | null,
  completionRule?: string | null,
};

export type DeletePatchInput = {
  id: string,
};

export type ModelUserPatchConditionInput = {
  patchID?: ModelIDInput | null,
  userID?: ModelStringInput | null,
  dateCompleted?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  difficulty?: ModelIntInput | null,
  imageUrl?: ModelStringInput | null,
  inProgress?: ModelBooleanInput | null,
  wishlisted?: ModelBooleanInput | null,
  and?: Array< ModelUserPatchConditionInput | null > | null,
  or?: Array< ModelUserPatchConditionInput | null > | null,
  not?: ModelUserPatchConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
};

export type DeleteUserPatchInput = {
  id: string,
};

export type CreatePatchRequestInput = {
  id?: string | null,
  email: string,
  description: string,
  createdAt?: string | null,
};

export type ModelPatchRequestConditionInput = {
  email?: ModelStringInput | null,
  description?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelPatchRequestConditionInput | null > | null,
  or?: Array< ModelPatchRequestConditionInput | null > | null,
  not?: ModelPatchRequestConditionInput | null,
  updatedAt?: ModelStringInput | null,
};

export type PatchRequest = {
  __typename: "PatchRequest",
  id: string,
  email: string,
  description: string,
  createdAt?: string | null,
  updatedAt: string,
};

export type UpdatePatchRequestInput = {
  id: string,
  email?: string | null,
  description?: string | null,
  createdAt?: string | null,
};

export type DeletePatchRequestInput = {
  id: string,
};

export type CreateMountainInput = {
  id?: string | null,
  name: string,
  elevation?: number | null,
  latitude?: number | null,
  longitude?: number | null,
  city?: string | null,
  state?: string | null,
};

export type ModelMountainConditionInput = {
  name?: ModelStringInput | null,
  elevation?: ModelIntInput | null,
  latitude?: ModelFloatInput | null,
  longitude?: ModelFloatInput | null,
  city?: ModelStringInput | null,
  state?: ModelStringInput | null,
  and?: Array< ModelMountainConditionInput | null > | null,
  or?: Array< ModelMountainConditionInput | null > | null,
  not?: ModelMountainConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateMountainInput = {
  id: string,
  name?: string | null,
  elevation?: number | null,
  latitude?: number | null,
  longitude?: number | null,
  city?: string | null,
  state?: string | null,
};

export type DeleteMountainInput = {
  id: string,
};

export type CreatePatchMountainInput = {
  id?: string | null,
  patchPatchMountainsId?: string | null,
  mountainPatchMountainsId?: string | null,
  delisted?: boolean | null,
};

export type ModelPatchMountainConditionInput = {
  patchPatchMountainsId?: ModelIDInput | null,
  mountainPatchMountainsId?: ModelIDInput | null,
  delisted?: ModelBooleanInput | null,
  and?: Array< ModelPatchMountainConditionInput | null > | null,
  or?: Array< ModelPatchMountainConditionInput | null > | null,
  not?: ModelPatchMountainConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdatePatchMountainInput = {
  id: string,
  patchPatchMountainsId?: string | null,
  mountainPatchMountainsId?: string | null,
  delisted?: boolean | null,
};

export type DeletePatchMountainInput = {
  id: string,
};

export type ModelUserMountainConditionInput = {
  userID?: ModelIDInput | null,
  mountainID?: ModelIDInput | null,
  dateClimbed?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  and?: Array< ModelUserMountainConditionInput | null > | null,
  or?: Array< ModelUserMountainConditionInput | null > | null,
  not?: ModelUserMountainConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
};

export type UpdateUserMountainInput = {
  id: string,
  userID?: string | null,
  mountainID?: string | null,
  dateClimbed?: string | null,
  notes?: string | null,
};

export type CreateTrailInput = {
  id?: string | null,
  name: string,
  description?: string | null,
  lengthMiles: number,
};

export type ModelTrailConditionInput = {
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  lengthMiles?: ModelFloatInput | null,
  and?: Array< ModelTrailConditionInput | null > | null,
  or?: Array< ModelTrailConditionInput | null > | null,
  not?: ModelTrailConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateTrailInput = {
  id: string,
  name?: string | null,
  description?: string | null,
  lengthMiles?: number | null,
};

export type DeleteTrailInput = {
  id: string,
};

export type CreatePatchTrailInput = {
  id?: string | null,
  patchPatchTrailsId?: string | null,
  trailPatchTrailsId?: string | null,
  requiredMiles?: number | null,
};

export type ModelPatchTrailConditionInput = {
  patchPatchTrailsId?: ModelIDInput | null,
  trailPatchTrailsId?: ModelIDInput | null,
  requiredMiles?: ModelFloatInput | null,
  and?: Array< ModelPatchTrailConditionInput | null > | null,
  or?: Array< ModelPatchTrailConditionInput | null > | null,
  not?: ModelPatchTrailConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdatePatchTrailInput = {
  id: string,
  patchPatchTrailsId?: string | null,
  trailPatchTrailsId?: string | null,
  requiredMiles?: number | null,
};

export type DeletePatchTrailInput = {
  id: string,
};

export type ModelUserTrailConditionInput = {
  dateCompleted?: ModelStringInput | null,
  milesRemaining?: ModelFloatInput | null,
  notes?: ModelStringInput | null,
  and?: Array< ModelUserTrailConditionInput | null > | null,
  or?: Array< ModelUserTrailConditionInput | null > | null,
  not?: ModelUserTrailConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userID?: ModelStringInput | null,
};

export type DeleteUserTrailInput = {
  userID: string,
  trailID: string,
};

export type PatchProgress = {
  __typename: "PatchProgress",
  patchId: string,
  userId: string,
  completed: number,
  denom: number,
  percent: number,
  note?: string | null,
};

export type ModelPatchFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  howToGet?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  regions?: ModelStringInput | null,
  difficulty?: ModelDifficultyInput | null,
  latitude?: ModelFloatInput | null,
  longitude?: ModelFloatInput | null,
  popularity?: ModelIntInput | null,
  hasPeaks?: ModelBooleanInput | null,
  hasTrails?: ModelBooleanInput | null,
  completionRule?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPatchFilterInput | null > | null,
  or?: Array< ModelPatchFilterInput | null > | null,
  not?: ModelPatchFilterInput | null,
};

export type ModelPatchConnection = {
  __typename: "ModelPatchConnection",
  items:  Array<Patch | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelIDKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelPatchRequestFilterInput = {
  id?: ModelIDInput | null,
  email?: ModelStringInput | null,
  description?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPatchRequestFilterInput | null > | null,
  or?: Array< ModelPatchRequestFilterInput | null > | null,
  not?: ModelPatchRequestFilterInput | null,
};

export type ModelPatchRequestConnection = {
  __typename: "ModelPatchRequestConnection",
  items:  Array<PatchRequest | null >,
  nextToken?: string | null,
};

export type ModelMountainFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  elevation?: ModelIntInput | null,
  latitude?: ModelFloatInput | null,
  longitude?: ModelFloatInput | null,
  city?: ModelStringInput | null,
  state?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMountainFilterInput | null > | null,
  or?: Array< ModelMountainFilterInput | null > | null,
  not?: ModelMountainFilterInput | null,
};

export type ModelMountainConnection = {
  __typename: "ModelMountainConnection",
  items:  Array<Mountain | null >,
  nextToken?: string | null,
};

export type ModelUserMountainFilterInput = {
  id?: ModelIDInput | null,
  userID?: ModelIDInput | null,
  mountainID?: ModelIDInput | null,
  dateClimbed?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserMountainFilterInput | null > | null,
  or?: Array< ModelUserMountainFilterInput | null > | null,
  not?: ModelUserMountainFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelTrailFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  lengthMiles?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelTrailFilterInput | null > | null,
  or?: Array< ModelTrailFilterInput | null > | null,
  not?: ModelTrailFilterInput | null,
};

export type ModelTrailConnection = {
  __typename: "ModelTrailConnection",
  items:  Array<Trail | null >,
  nextToken?: string | null,
};

export type ModelUserTrailFilterInput = {
  userID?: ModelIDInput | null,
  trailID?: ModelIDInput | null,
  dateCompleted?: ModelStringInput | null,
  milesRemaining?: ModelFloatInput | null,
  notes?: ModelStringInput | null,
  id?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserTrailFilterInput | null > | null,
  or?: Array< ModelUserTrailFilterInput | null > | null,
  not?: ModelUserTrailFilterInput | null,
};

export type ModelSubscriptionPatchFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  howToGet?: ModelSubscriptionStringInput | null,
  imageUrl?: ModelSubscriptionStringInput | null,
  regions?: ModelSubscriptionStringInput | null,
  difficulty?: ModelSubscriptionStringInput | null,
  latitude?: ModelSubscriptionFloatInput | null,
  longitude?: ModelSubscriptionFloatInput | null,
  popularity?: ModelSubscriptionIntInput | null,
  hasPeaks?: ModelSubscriptionBooleanInput | null,
  hasTrails?: ModelSubscriptionBooleanInput | null,
  completionRule?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPatchFilterInput | null > | null,
  or?: Array< ModelSubscriptionPatchFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionUserPatchFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  patchID?: ModelSubscriptionIDInput | null,
  userID?: ModelSubscriptionStringInput | null,
  dateCompleted?: ModelSubscriptionStringInput | null,
  notes?: ModelSubscriptionStringInput | null,
  difficulty?: ModelSubscriptionIntInput | null,
  imageUrl?: ModelSubscriptionStringInput | null,
  inProgress?: ModelSubscriptionBooleanInput | null,
  wishlisted?: ModelSubscriptionBooleanInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserPatchFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserPatchFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionPatchRequestFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  email?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPatchRequestFilterInput | null > | null,
  or?: Array< ModelSubscriptionPatchRequestFilterInput | null > | null,
};

export type ModelSubscriptionMountainFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  elevation?: ModelSubscriptionIntInput | null,
  latitude?: ModelSubscriptionFloatInput | null,
  longitude?: ModelSubscriptionFloatInput | null,
  city?: ModelSubscriptionStringInput | null,
  state?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMountainFilterInput | null > | null,
  or?: Array< ModelSubscriptionMountainFilterInput | null > | null,
};

export type ModelSubscriptionPatchMountainFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  patchPatchMountainsId?: ModelSubscriptionIDInput | null,
  mountainPatchMountainsId?: ModelSubscriptionIDInput | null,
  delisted?: ModelSubscriptionBooleanInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPatchMountainFilterInput | null > | null,
  or?: Array< ModelSubscriptionPatchMountainFilterInput | null > | null,
};

export type ModelSubscriptionUserMountainFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userID?: ModelSubscriptionIDInput | null,
  mountainID?: ModelSubscriptionIDInput | null,
  dateClimbed?: ModelSubscriptionStringInput | null,
  notes?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserMountainFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserMountainFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionTrailFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  lengthMiles?: ModelSubscriptionFloatInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTrailFilterInput | null > | null,
  or?: Array< ModelSubscriptionTrailFilterInput | null > | null,
};

export type ModelSubscriptionPatchTrailFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  patchPatchTrailsId?: ModelSubscriptionIDInput | null,
  trailPatchTrailsId?: ModelSubscriptionIDInput | null,
  requiredMiles?: ModelSubscriptionFloatInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPatchTrailFilterInput | null > | null,
  or?: Array< ModelSubscriptionPatchTrailFilterInput | null > | null,
};

export type ModelSubscriptionUserTrailFilterInput = {
  trailID?: ModelSubscriptionIDInput | null,
  dateCompleted?: ModelSubscriptionStringInput | null,
  milesRemaining?: ModelSubscriptionFloatInput | null,
  notes?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserTrailFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserTrailFilterInput | null > | null,
  userID?: ModelStringInput | null,
};

export type DeleteUserMountainMinimalMutationVariables = {
  input: DeleteUserMountainInput,
};

export type DeleteUserMountainMinimalMutation = {
  deleteUserMountain?:  {
    __typename: "UserMountain",
    id: string,
  } | null,
};

export type CreateUserMountainMinimalMutationVariables = {
  input: CreateUserMountainInput,
};

export type CreateUserMountainMinimalMutation = {
  createUserMountain?:  {
    __typename: "UserMountain",
    id: string,
    userID: string,
    mountainID: string,
    dateClimbed: string,
    notes?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateUserTrailMinimalMutationVariables = {
  input: CreateUserTrailInput,
};

export type CreateUserTrailMinimalMutation = {
  createUserTrail?:  {
    __typename: "UserTrail",
    userID: string,
    trailID: string,
    dateCompleted?: string | null,
    milesRemaining?: number | null,
    notes?: string | null,
  } | null,
};

export type UpdateUserTrailMinimalMutationVariables = {
  input: UpdateUserTrailInput,
};

export type UpdateUserTrailMinimalMutation = {
  updateUserTrail?:  {
    __typename: "UserTrail",
    userID: string,
    trailID: string,
    dateCompleted?: string | null,
    milesRemaining?: number | null,
    notes?: string | null,
  } | null,
};

export type ListUserPatchesWithPatchQueryVariables = {
  filter?: ModelUserPatchFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserPatchesWithPatchQuery = {
  listUserPatches?:  {
    __typename: "ModelUserPatchConnection",
    items:  Array< {
      __typename: "UserPatch",
      id: string,
      patchID: string,
      userID: string,
      dateCompleted?: string | null,
      notes?: string | null,
      difficulty?: number | null,
      imageUrl?: string | null,
      inProgress?: boolean | null,
      wishlisted?: boolean | null,
      createdAt: string,
      updatedAt: string,
      patch?:  {
        __typename: "Patch",
        id: string,
        name: string,
        description?: string | null,
        howToGet?: string | null,
        imageUrl?: string | null,
        regions?: Array< string | null > | null,
        difficulty?: Difficulty | null,
        hasPeaks?: boolean | null,
        createdAt: string,
        updatedAt: string,
      } | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPatchWithMountainsQueryVariables = {
  id: string,
  limit?: number | null,
  nextToken?: string | null,
};

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

export type ListPatchMountainsWithMountainQueryVariables = {
  filter?: ModelPatchMountainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
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

export type ListPatchMountainsWithPatchQueryVariables = {
  filter?: ModelPatchMountainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
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

export type GetPatchCompletionRuleQueryVariables = {
  id: string,
};

export type GetPatchCompletionRuleQuery = {
  getPatch?:  {
    __typename: "Patch",
    id: string,
    name: string,
    completionRule?: string | null,
  } | null,
};

export type CreateUserPatchLiteMutationVariables = {
  input: CreateUserPatchInput,
};

export type CreateUserPatchLiteMutation = {
  createUserPatch?:  {
    __typename: "UserPatch",
    id: string,
    patchID: string,
    userID: string,
    wishlisted?: boolean | null,
    inProgress?: boolean | null,
    dateCompleted?: string | null,
  } | null,
};

export type UpdateUserPatchLiteMutationVariables = {
  input: UpdateUserPatchInput,
};

export type UpdateUserPatchLiteMutation = {
  updateUserPatch?:  {
    __typename: "UserPatch",
    id: string,
    patchID: string,
    userID: string,
    wishlisted?: boolean | null,
    inProgress?: boolean | null,
    dateCompleted?: string | null,
  } | null,
};

export type customCreateUserPatchMutationVariables = {
  input: CreateUserPatchInput,
};

export type customCreateUserPatchMutation = {
  createUserPatch?:  {
    __typename: "UserPatch",
    id: string,
    patchID: string,
    userID: string,
    dateCompleted?: string | null,
    inProgress?: boolean | null,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    wishlisted?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type customUpdateUserPatchMutationVariables = {
  input: UpdateUserPatchInput,
};

export type customUpdateUserPatchMutation = {
  updateUserPatch?:  {
    __typename: "UserPatch",
    id: string,
    patchID: string,
    userID: string,
    dateCompleted?: string | null,
    inProgress?: boolean | null,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    wishlisted?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UserPatchesByUserByPatchLiteQueryVariables = {
  userID: string,
  patchID: string,
  limit?: number | null,
};

export type UserPatchesByUserByPatchLiteQuery = {
  userPatchesByUserByPatch?:  {
    __typename: "ModelUserPatchConnection",
    items:  Array< {
      __typename: "UserPatch",
      id: string,
      patchID: string,
      userID: string,
      wishlisted?: boolean | null,
      inProgress?: boolean | null,
      dateCompleted?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPatchTrailsWithPatchQueryVariables = {
  limit?: number | null,
  nextToken?: string | null,
  filter?: ModelPatchTrailFilterInput | null,
};

export type ListPatchTrailsWithPatchQuery = {
  listPatchTrails?:  {
    __typename: "ModelPatchTrailConnection",
    items:  Array< {
      __typename: "PatchTrail",
      id: string,
      patchPatchTrailsId?: string | null,
      trailPatchTrailsId?: string | null,
      requiredMiles?: number | null,
      patch:  {
        __typename: "Patch",
        id: string,
        name: string,
        description?: string | null,
        createdAt: string,
      },
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPatchWithTrailsQueryVariables = {
  id: string,
  limit?: number | null,
  nextToken?: string | null,
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

export type ListPatchTrailsWithTrailQueryVariables = {
  filter?: ModelPatchTrailFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
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

export type CreatePatchMutationVariables = {
  input: CreatePatchInput,
  condition?: ModelPatchConditionInput | null,
};

export type CreatePatchMutation = {
  createPatch?:  {
    __typename: "Patch",
    id: string,
    name: string,
    description?: string | null,
    howToGet?: string | null,
    imageUrl?: string | null,
    regions?: Array< string | null > | null,
    difficulty?: Difficulty | null,
    latitude?: number | null,
    longitude?: number | null,
    popularity?: number | null,
    hasPeaks?: boolean | null,
    hasTrails?: boolean | null,
    completionRule?: string | null,
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePatchMutationVariables = {
  input: UpdatePatchInput,
  condition?: ModelPatchConditionInput | null,
};

export type UpdatePatchMutation = {
  updatePatch?:  {
    __typename: "Patch",
    id: string,
    name: string,
    description?: string | null,
    howToGet?: string | null,
    imageUrl?: string | null,
    regions?: Array< string | null > | null,
    difficulty?: Difficulty | null,
    latitude?: number | null,
    longitude?: number | null,
    popularity?: number | null,
    hasPeaks?: boolean | null,
    hasTrails?: boolean | null,
    completionRule?: string | null,
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePatchMutationVariables = {
  input: DeletePatchInput,
  condition?: ModelPatchConditionInput | null,
};

export type DeletePatchMutation = {
  deletePatch?:  {
    __typename: "Patch",
    id: string,
    name: string,
    description?: string | null,
    howToGet?: string | null,
    imageUrl?: string | null,
    regions?: Array< string | null > | null,
    difficulty?: Difficulty | null,
    latitude?: number | null,
    longitude?: number | null,
    popularity?: number | null,
    hasPeaks?: boolean | null,
    hasTrails?: boolean | null,
    completionRule?: string | null,
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserPatchMutationVariables = {
  input: CreateUserPatchInput,
  condition?: ModelUserPatchConditionInput | null,
};

export type CreateUserPatchMutation = {
  createUserPatch?:  {
    __typename: "UserPatch",
    id: string,
    patchID: string,
    patch?:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userID: string,
    dateCompleted?: string | null,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    inProgress?: boolean | null,
    wishlisted?: boolean | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateUserPatchMutationVariables = {
  input: UpdateUserPatchInput,
  condition?: ModelUserPatchConditionInput | null,
};

export type UpdateUserPatchMutation = {
  updateUserPatch?:  {
    __typename: "UserPatch",
    id: string,
    patchID: string,
    patch?:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userID: string,
    dateCompleted?: string | null,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    inProgress?: boolean | null,
    wishlisted?: boolean | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteUserPatchMutationVariables = {
  input: DeleteUserPatchInput,
  condition?: ModelUserPatchConditionInput | null,
};

export type DeleteUserPatchMutation = {
  deleteUserPatch?:  {
    __typename: "UserPatch",
    id: string,
    patchID: string,
    patch?:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userID: string,
    dateCompleted?: string | null,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    inProgress?: boolean | null,
    wishlisted?: boolean | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreatePatchRequestMutationVariables = {
  input: CreatePatchRequestInput,
  condition?: ModelPatchRequestConditionInput | null,
};

export type CreatePatchRequestMutation = {
  createPatchRequest?:  {
    __typename: "PatchRequest",
    id: string,
    email: string,
    description: string,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdatePatchRequestMutationVariables = {
  input: UpdatePatchRequestInput,
  condition?: ModelPatchRequestConditionInput | null,
};

export type UpdatePatchRequestMutation = {
  updatePatchRequest?:  {
    __typename: "PatchRequest",
    id: string,
    email: string,
    description: string,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type DeletePatchRequestMutationVariables = {
  input: DeletePatchRequestInput,
  condition?: ModelPatchRequestConditionInput | null,
};

export type DeletePatchRequestMutation = {
  deletePatchRequest?:  {
    __typename: "PatchRequest",
    id: string,
    email: string,
    description: string,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateMountainMutationVariables = {
  input: CreateMountainInput,
  condition?: ModelMountainConditionInput | null,
};

export type CreateMountainMutation = {
  createMountain?:  {
    __typename: "Mountain",
    id: string,
    name: string,
    elevation?: number | null,
    latitude?: number | null,
    longitude?: number | null,
    city?: string | null,
    state?: string | null,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    userMountains?:  {
      __typename: "ModelUserMountainConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMountainMutationVariables = {
  input: UpdateMountainInput,
  condition?: ModelMountainConditionInput | null,
};

export type UpdateMountainMutation = {
  updateMountain?:  {
    __typename: "Mountain",
    id: string,
    name: string,
    elevation?: number | null,
    latitude?: number | null,
    longitude?: number | null,
    city?: string | null,
    state?: string | null,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    userMountains?:  {
      __typename: "ModelUserMountainConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMountainMutationVariables = {
  input: DeleteMountainInput,
  condition?: ModelMountainConditionInput | null,
};

export type DeleteMountainMutation = {
  deleteMountain?:  {
    __typename: "Mountain",
    id: string,
    name: string,
    elevation?: number | null,
    latitude?: number | null,
    longitude?: number | null,
    city?: string | null,
    state?: string | null,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    userMountains?:  {
      __typename: "ModelUserMountainConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreatePatchMountainMutationVariables = {
  input: CreatePatchMountainInput,
  condition?: ModelPatchMountainConditionInput | null,
};

export type CreatePatchMountainMutation = {
  createPatchMountain?:  {
    __typename: "PatchMountain",
    id: string,
    patchPatchMountainsId?: string | null,
    mountainPatchMountainsId?: string | null,
    patch:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    mountain:  {
      __typename: "Mountain",
      id: string,
      name: string,
      elevation?: number | null,
      latitude?: number | null,
      longitude?: number | null,
      city?: string | null,
      state?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    delisted?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePatchMountainMutationVariables = {
  input: UpdatePatchMountainInput,
  condition?: ModelPatchMountainConditionInput | null,
};

export type UpdatePatchMountainMutation = {
  updatePatchMountain?:  {
    __typename: "PatchMountain",
    id: string,
    patchPatchMountainsId?: string | null,
    mountainPatchMountainsId?: string | null,
    patch:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    mountain:  {
      __typename: "Mountain",
      id: string,
      name: string,
      elevation?: number | null,
      latitude?: number | null,
      longitude?: number | null,
      city?: string | null,
      state?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    delisted?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePatchMountainMutationVariables = {
  input: DeletePatchMountainInput,
  condition?: ModelPatchMountainConditionInput | null,
};

export type DeletePatchMountainMutation = {
  deletePatchMountain?:  {
    __typename: "PatchMountain",
    id: string,
    patchPatchMountainsId?: string | null,
    mountainPatchMountainsId?: string | null,
    patch:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    mountain:  {
      __typename: "Mountain",
      id: string,
      name: string,
      elevation?: number | null,
      latitude?: number | null,
      longitude?: number | null,
      city?: string | null,
      state?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    delisted?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserMountainMutationVariables = {
  input: CreateUserMountainInput,
  condition?: ModelUserMountainConditionInput | null,
};

export type CreateUserMountainMutation = {
  createUserMountain?:  {
    __typename: "UserMountain",
    id: string,
    userID: string,
    mountainID: string,
    dateClimbed: string,
    notes?: string | null,
    mountain?:  {
      __typename: "Mountain",
      id: string,
      name: string,
      elevation?: number | null,
      latitude?: number | null,
      longitude?: number | null,
      city?: string | null,
      state?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateUserMountainMutationVariables = {
  input: UpdateUserMountainInput,
  condition?: ModelUserMountainConditionInput | null,
};

export type UpdateUserMountainMutation = {
  updateUserMountain?:  {
    __typename: "UserMountain",
    id: string,
    userID: string,
    mountainID: string,
    dateClimbed: string,
    notes?: string | null,
    mountain?:  {
      __typename: "Mountain",
      id: string,
      name: string,
      elevation?: number | null,
      latitude?: number | null,
      longitude?: number | null,
      city?: string | null,
      state?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteUserMountainMutationVariables = {
  input: DeleteUserMountainInput,
  condition?: ModelUserMountainConditionInput | null,
};

export type DeleteUserMountainMutation = {
  deleteUserMountain?:  {
    __typename: "UserMountain",
    id: string,
    userID: string,
    mountainID: string,
    dateClimbed: string,
    notes?: string | null,
    mountain?:  {
      __typename: "Mountain",
      id: string,
      name: string,
      elevation?: number | null,
      latitude?: number | null,
      longitude?: number | null,
      city?: string | null,
      state?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateTrailMutationVariables = {
  input: CreateTrailInput,
  condition?: ModelTrailConditionInput | null,
};

export type CreateTrailMutation = {
  createTrail?:  {
    __typename: "Trail",
    id: string,
    name: string,
    description?: string | null,
    lengthMiles: number,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    userTrails?:  {
      __typename: "ModelUserTrailConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTrailMutationVariables = {
  input: UpdateTrailInput,
  condition?: ModelTrailConditionInput | null,
};

export type UpdateTrailMutation = {
  updateTrail?:  {
    __typename: "Trail",
    id: string,
    name: string,
    description?: string | null,
    lengthMiles: number,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    userTrails?:  {
      __typename: "ModelUserTrailConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteTrailMutationVariables = {
  input: DeleteTrailInput,
  condition?: ModelTrailConditionInput | null,
};

export type DeleteTrailMutation = {
  deleteTrail?:  {
    __typename: "Trail",
    id: string,
    name: string,
    description?: string | null,
    lengthMiles: number,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    userTrails?:  {
      __typename: "ModelUserTrailConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreatePatchTrailMutationVariables = {
  input: CreatePatchTrailInput,
  condition?: ModelPatchTrailConditionInput | null,
};

export type CreatePatchTrailMutation = {
  createPatchTrail?:  {
    __typename: "PatchTrail",
    id: string,
    patchPatchTrailsId?: string | null,
    trailPatchTrailsId?: string | null,
    patch:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    trail:  {
      __typename: "Trail",
      id: string,
      name: string,
      description?: string | null,
      lengthMiles: number,
      createdAt: string,
      updatedAt: string,
    },
    requiredMiles?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePatchTrailMutationVariables = {
  input: UpdatePatchTrailInput,
  condition?: ModelPatchTrailConditionInput | null,
};

export type UpdatePatchTrailMutation = {
  updatePatchTrail?:  {
    __typename: "PatchTrail",
    id: string,
    patchPatchTrailsId?: string | null,
    trailPatchTrailsId?: string | null,
    patch:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    trail:  {
      __typename: "Trail",
      id: string,
      name: string,
      description?: string | null,
      lengthMiles: number,
      createdAt: string,
      updatedAt: string,
    },
    requiredMiles?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePatchTrailMutationVariables = {
  input: DeletePatchTrailInput,
  condition?: ModelPatchTrailConditionInput | null,
};

export type DeletePatchTrailMutation = {
  deletePatchTrail?:  {
    __typename: "PatchTrail",
    id: string,
    patchPatchTrailsId?: string | null,
    trailPatchTrailsId?: string | null,
    patch:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    trail:  {
      __typename: "Trail",
      id: string,
      name: string,
      description?: string | null,
      lengthMiles: number,
      createdAt: string,
      updatedAt: string,
    },
    requiredMiles?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserTrailMutationVariables = {
  input: CreateUserTrailInput,
  condition?: ModelUserTrailConditionInput | null,
};

export type CreateUserTrailMutation = {
  createUserTrail?:  {
    __typename: "UserTrail",
    userID: string,
    trailID: string,
    dateCompleted?: string | null,
    milesRemaining?: number | null,
    notes?: string | null,
    trail?:  {
      __typename: "Trail",
      id: string,
      name: string,
      description?: string | null,
      lengthMiles: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserTrailMutationVariables = {
  input: UpdateUserTrailInput,
  condition?: ModelUserTrailConditionInput | null,
};

export type UpdateUserTrailMutation = {
  updateUserTrail?:  {
    __typename: "UserTrail",
    userID: string,
    trailID: string,
    dateCompleted?: string | null,
    milesRemaining?: number | null,
    notes?: string | null,
    trail?:  {
      __typename: "Trail",
      id: string,
      name: string,
      description?: string | null,
      lengthMiles: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserTrailMutationVariables = {
  input: DeleteUserTrailInput,
  condition?: ModelUserTrailConditionInput | null,
};

export type DeleteUserTrailMutation = {
  deleteUserTrail?:  {
    __typename: "UserTrail",
    userID: string,
    trailID: string,
    dateCompleted?: string | null,
    milesRemaining?: number | null,
    notes?: string | null,
    trail?:  {
      __typename: "Trail",
      id: string,
      name: string,
      description?: string | null,
      lengthMiles: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetPatchProgressSummaryQueryVariables = {
  patchId: string,
  userId: string,
};

export type GetPatchProgressSummaryQuery = {
  getPatchProgressSummary?:  {
    __typename: "PatchProgress",
    patchId: string,
    userId: string,
    completed: number,
    denom: number,
    percent: number,
    note?: string | null,
  } | null,
};

export type ListPatchProgressQueryVariables = {
  patchIds: Array< string >,
  userId: string,
};

export type ListPatchProgressQuery = {
  listPatchProgress:  Array< {
    __typename: "PatchProgress",
    patchId: string,
    userId: string,
    completed: number,
    denom: number,
    percent: number,
    note?: string | null,
  } >,
};

export type GetPatchQueryVariables = {
  id: string,
};

export type GetPatchQuery = {
  getPatch?:  {
    __typename: "Patch",
    id: string,
    name: string,
    description?: string | null,
    howToGet?: string | null,
    imageUrl?: string | null,
    regions?: Array< string | null > | null,
    difficulty?: Difficulty | null,
    latitude?: number | null,
    longitude?: number | null,
    popularity?: number | null,
    hasPeaks?: boolean | null,
    hasTrails?: boolean | null,
    completionRule?: string | null,
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPatchesQueryVariables = {
  filter?: ModelPatchFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPatchesQuery = {
  listPatches?:  {
    __typename: "ModelPatchConnection",
    items:  Array< {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserPatchQueryVariables = {
  id: string,
};

export type GetUserPatchQuery = {
  getUserPatch?:  {
    __typename: "UserPatch",
    id: string,
    patchID: string,
    patch?:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userID: string,
    dateCompleted?: string | null,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    inProgress?: boolean | null,
    wishlisted?: boolean | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListUserPatchesQueryVariables = {
  filter?: ModelUserPatchFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserPatchesQuery = {
  listUserPatches?:  {
    __typename: "ModelUserPatchConnection",
    items:  Array< {
      __typename: "UserPatch",
      id: string,
      patchID: string,
      userID: string,
      dateCompleted?: string | null,
      notes?: string | null,
      difficulty?: number | null,
      imageUrl?: string | null,
      inProgress?: boolean | null,
      wishlisted?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserPatchesByPatchQueryVariables = {
  patchID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserPatchFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserPatchesByPatchQuery = {
  userPatchesByPatch?:  {
    __typename: "ModelUserPatchConnection",
    items:  Array< {
      __typename: "UserPatch",
      id: string,
      patchID: string,
      userID: string,
      dateCompleted?: string | null,
      notes?: string | null,
      difficulty?: number | null,
      imageUrl?: string | null,
      inProgress?: boolean | null,
      wishlisted?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserPatchesByUserByPatchQueryVariables = {
  userID: string,
  patchID?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserPatchFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserPatchesByUserByPatchQuery = {
  userPatchesByUserByPatch?:  {
    __typename: "ModelUserPatchConnection",
    items:  Array< {
      __typename: "UserPatch",
      id: string,
      patchID: string,
      userID: string,
      dateCompleted?: string | null,
      notes?: string | null,
      difficulty?: number | null,
      imageUrl?: string | null,
      inProgress?: boolean | null,
      wishlisted?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPatchRequestQueryVariables = {
  id: string,
};

export type GetPatchRequestQuery = {
  getPatchRequest?:  {
    __typename: "PatchRequest",
    id: string,
    email: string,
    description: string,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type ListPatchRequestsQueryVariables = {
  filter?: ModelPatchRequestFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPatchRequestsQuery = {
  listPatchRequests?:  {
    __typename: "ModelPatchRequestConnection",
    items:  Array< {
      __typename: "PatchRequest",
      id: string,
      email: string,
      description: string,
      createdAt?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMountainQueryVariables = {
  id: string,
};

export type GetMountainQuery = {
  getMountain?:  {
    __typename: "Mountain",
    id: string,
    name: string,
    elevation?: number | null,
    latitude?: number | null,
    longitude?: number | null,
    city?: string | null,
    state?: string | null,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    userMountains?:  {
      __typename: "ModelUserMountainConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMountainsQueryVariables = {
  filter?: ModelMountainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMountainsQuery = {
  listMountains?:  {
    __typename: "ModelMountainConnection",
    items:  Array< {
      __typename: "Mountain",
      id: string,
      name: string,
      elevation?: number | null,
      latitude?: number | null,
      longitude?: number | null,
      city?: string | null,
      state?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPatchMountainQueryVariables = {
  id: string,
};

export type GetPatchMountainQuery = {
  getPatchMountain?:  {
    __typename: "PatchMountain",
    id: string,
    patchPatchMountainsId?: string | null,
    mountainPatchMountainsId?: string | null,
    patch:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    mountain:  {
      __typename: "Mountain",
      id: string,
      name: string,
      elevation?: number | null,
      latitude?: number | null,
      longitude?: number | null,
      city?: string | null,
      state?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    delisted?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPatchMountainsQueryVariables = {
  filter?: ModelPatchMountainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPatchMountainsQuery = {
  listPatchMountains?:  {
    __typename: "ModelPatchMountainConnection",
    items:  Array< {
      __typename: "PatchMountain",
      id: string,
      patchPatchMountainsId?: string | null,
      mountainPatchMountainsId?: string | null,
      delisted?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PatchMountainsByPatchQueryVariables = {
  patchPatchMountainsId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPatchMountainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PatchMountainsByPatchQuery = {
  patchMountainsByPatch?:  {
    __typename: "ModelPatchMountainConnection",
    items:  Array< {
      __typename: "PatchMountain",
      id: string,
      patchPatchMountainsId?: string | null,
      mountainPatchMountainsId?: string | null,
      delisted?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PatchMountainsByMountainQueryVariables = {
  mountainPatchMountainsId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPatchMountainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PatchMountainsByMountainQuery = {
  patchMountainsByMountain?:  {
    __typename: "ModelPatchMountainConnection",
    items:  Array< {
      __typename: "PatchMountain",
      id: string,
      patchPatchMountainsId?: string | null,
      mountainPatchMountainsId?: string | null,
      delisted?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserMountainQueryVariables = {
  id: string,
};

export type GetUserMountainQuery = {
  getUserMountain?:  {
    __typename: "UserMountain",
    id: string,
    userID: string,
    mountainID: string,
    dateClimbed: string,
    notes?: string | null,
    mountain?:  {
      __typename: "Mountain",
      id: string,
      name: string,
      elevation?: number | null,
      latitude?: number | null,
      longitude?: number | null,
      city?: string | null,
      state?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListUserMountainsQueryVariables = {
  filter?: ModelUserMountainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserMountainsQuery = {
  listUserMountains?:  {
    __typename: "ModelUserMountainConnection",
    items:  Array< {
      __typename: "UserMountain",
      id: string,
      userID: string,
      mountainID: string,
      dateClimbed: string,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserMountainsByUserQueryVariables = {
  userID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserMountainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserMountainsByUserQuery = {
  userMountainsByUser?:  {
    __typename: "ModelUserMountainConnection",
    items:  Array< {
      __typename: "UserMountain",
      id: string,
      userID: string,
      mountainID: string,
      dateClimbed: string,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserMountainsByUserByMountainQueryVariables = {
  userID: string,
  mountainID?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserMountainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserMountainsByUserByMountainQuery = {
  userMountainsByUserByMountain?:  {
    __typename: "ModelUserMountainConnection",
    items:  Array< {
      __typename: "UserMountain",
      id: string,
      userID: string,
      mountainID: string,
      dateClimbed: string,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserMountainsByUserByDateQueryVariables = {
  userID: string,
  dateClimbed?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserMountainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserMountainsByUserByDateQuery = {
  userMountainsByUserByDate?:  {
    __typename: "ModelUserMountainConnection",
    items:  Array< {
      __typename: "UserMountain",
      id: string,
      userID: string,
      mountainID: string,
      dateClimbed: string,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserMountainsByMountainQueryVariables = {
  mountainID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserMountainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserMountainsByMountainQuery = {
  userMountainsByMountain?:  {
    __typename: "ModelUserMountainConnection",
    items:  Array< {
      __typename: "UserMountain",
      id: string,
      userID: string,
      mountainID: string,
      dateClimbed: string,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTrailQueryVariables = {
  id: string,
};

export type GetTrailQuery = {
  getTrail?:  {
    __typename: "Trail",
    id: string,
    name: string,
    description?: string | null,
    lengthMiles: number,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    userTrails?:  {
      __typename: "ModelUserTrailConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListTrailsQueryVariables = {
  filter?: ModelTrailFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTrailsQuery = {
  listTrails?:  {
    __typename: "ModelTrailConnection",
    items:  Array< {
      __typename: "Trail",
      id: string,
      name: string,
      description?: string | null,
      lengthMiles: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPatchTrailQueryVariables = {
  id: string,
};

export type GetPatchTrailQuery = {
  getPatchTrail?:  {
    __typename: "PatchTrail",
    id: string,
    patchPatchTrailsId?: string | null,
    trailPatchTrailsId?: string | null,
    patch:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    trail:  {
      __typename: "Trail",
      id: string,
      name: string,
      description?: string | null,
      lengthMiles: number,
      createdAt: string,
      updatedAt: string,
    },
    requiredMiles?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPatchTrailsQueryVariables = {
  filter?: ModelPatchTrailFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPatchTrailsQuery = {
  listPatchTrails?:  {
    __typename: "ModelPatchTrailConnection",
    items:  Array< {
      __typename: "PatchTrail",
      id: string,
      patchPatchTrailsId?: string | null,
      trailPatchTrailsId?: string | null,
      requiredMiles?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PatchTrailsByPatchQueryVariables = {
  patchPatchTrailsId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPatchTrailFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PatchTrailsByPatchQuery = {
  patchTrailsByPatch?:  {
    __typename: "ModelPatchTrailConnection",
    items:  Array< {
      __typename: "PatchTrail",
      id: string,
      patchPatchTrailsId?: string | null,
      trailPatchTrailsId?: string | null,
      requiredMiles?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PatchTrailsByTrailQueryVariables = {
  trailPatchTrailsId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPatchTrailFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PatchTrailsByTrailQuery = {
  patchTrailsByTrail?:  {
    __typename: "ModelPatchTrailConnection",
    items:  Array< {
      __typename: "PatchTrail",
      id: string,
      patchPatchTrailsId?: string | null,
      trailPatchTrailsId?: string | null,
      requiredMiles?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserTrailQueryVariables = {
  userID: string,
  trailID: string,
};

export type GetUserTrailQuery = {
  getUserTrail?:  {
    __typename: "UserTrail",
    userID: string,
    trailID: string,
    dateCompleted?: string | null,
    milesRemaining?: number | null,
    notes?: string | null,
    trail?:  {
      __typename: "Trail",
      id: string,
      name: string,
      description?: string | null,
      lengthMiles: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUserTrailsQueryVariables = {
  userID?: string | null,
  trailID?: ModelIDKeyConditionInput | null,
  filter?: ModelUserTrailFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUserTrailsQuery = {
  listUserTrails?:  {
    __typename: "ModelUserTrailConnection",
    items:  Array< {
      __typename: "UserTrail",
      userID: string,
      trailID: string,
      dateCompleted?: string | null,
      milesRemaining?: number | null,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserTrailsByUserQueryVariables = {
  userID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserTrailFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserTrailsByUserQuery = {
  userTrailsByUser?:  {
    __typename: "ModelUserTrailConnection",
    items:  Array< {
      __typename: "UserTrail",
      userID: string,
      trailID: string,
      dateCompleted?: string | null,
      milesRemaining?: number | null,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserTrailsByUserByDateCompletedQueryVariables = {
  userID: string,
  dateCompleted?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserTrailFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserTrailsByUserByDateCompletedQuery = {
  userTrailsByUserByDateCompleted?:  {
    __typename: "ModelUserTrailConnection",
    items:  Array< {
      __typename: "UserTrail",
      userID: string,
      trailID: string,
      dateCompleted?: string | null,
      milesRemaining?: number | null,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserTrailsByTrailQueryVariables = {
  trailID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserTrailFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserTrailsByTrailQuery = {
  userTrailsByTrail?:  {
    __typename: "ModelUserTrailConnection",
    items:  Array< {
      __typename: "UserTrail",
      userID: string,
      trailID: string,
      dateCompleted?: string | null,
      milesRemaining?: number | null,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreatePatchSubscriptionVariables = {
  filter?: ModelSubscriptionPatchFilterInput | null,
};

export type OnCreatePatchSubscription = {
  onCreatePatch?:  {
    __typename: "Patch",
    id: string,
    name: string,
    description?: string | null,
    howToGet?: string | null,
    imageUrl?: string | null,
    regions?: Array< string | null > | null,
    difficulty?: Difficulty | null,
    latitude?: number | null,
    longitude?: number | null,
    popularity?: number | null,
    hasPeaks?: boolean | null,
    hasTrails?: boolean | null,
    completionRule?: string | null,
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePatchSubscriptionVariables = {
  filter?: ModelSubscriptionPatchFilterInput | null,
};

export type OnUpdatePatchSubscription = {
  onUpdatePatch?:  {
    __typename: "Patch",
    id: string,
    name: string,
    description?: string | null,
    howToGet?: string | null,
    imageUrl?: string | null,
    regions?: Array< string | null > | null,
    difficulty?: Difficulty | null,
    latitude?: number | null,
    longitude?: number | null,
    popularity?: number | null,
    hasPeaks?: boolean | null,
    hasTrails?: boolean | null,
    completionRule?: string | null,
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePatchSubscriptionVariables = {
  filter?: ModelSubscriptionPatchFilterInput | null,
};

export type OnDeletePatchSubscription = {
  onDeletePatch?:  {
    __typename: "Patch",
    id: string,
    name: string,
    description?: string | null,
    howToGet?: string | null,
    imageUrl?: string | null,
    regions?: Array< string | null > | null,
    difficulty?: Difficulty | null,
    latitude?: number | null,
    longitude?: number | null,
    popularity?: number | null,
    hasPeaks?: boolean | null,
    hasTrails?: boolean | null,
    completionRule?: string | null,
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserPatchSubscriptionVariables = {
  filter?: ModelSubscriptionUserPatchFilterInput | null,
  owner?: string | null,
};

export type OnCreateUserPatchSubscription = {
  onCreateUserPatch?:  {
    __typename: "UserPatch",
    id: string,
    patchID: string,
    patch?:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userID: string,
    dateCompleted?: string | null,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    inProgress?: boolean | null,
    wishlisted?: boolean | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateUserPatchSubscriptionVariables = {
  filter?: ModelSubscriptionUserPatchFilterInput | null,
  owner?: string | null,
};

export type OnUpdateUserPatchSubscription = {
  onUpdateUserPatch?:  {
    __typename: "UserPatch",
    id: string,
    patchID: string,
    patch?:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userID: string,
    dateCompleted?: string | null,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    inProgress?: boolean | null,
    wishlisted?: boolean | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteUserPatchSubscriptionVariables = {
  filter?: ModelSubscriptionUserPatchFilterInput | null,
  owner?: string | null,
};

export type OnDeleteUserPatchSubscription = {
  onDeleteUserPatch?:  {
    __typename: "UserPatch",
    id: string,
    patchID: string,
    patch?:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userID: string,
    dateCompleted?: string | null,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    inProgress?: boolean | null,
    wishlisted?: boolean | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreatePatchRequestSubscriptionVariables = {
  filter?: ModelSubscriptionPatchRequestFilterInput | null,
};

export type OnCreatePatchRequestSubscription = {
  onCreatePatchRequest?:  {
    __typename: "PatchRequest",
    id: string,
    email: string,
    description: string,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdatePatchRequestSubscriptionVariables = {
  filter?: ModelSubscriptionPatchRequestFilterInput | null,
};

export type OnUpdatePatchRequestSubscription = {
  onUpdatePatchRequest?:  {
    __typename: "PatchRequest",
    id: string,
    email: string,
    description: string,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeletePatchRequestSubscriptionVariables = {
  filter?: ModelSubscriptionPatchRequestFilterInput | null,
};

export type OnDeletePatchRequestSubscription = {
  onDeletePatchRequest?:  {
    __typename: "PatchRequest",
    id: string,
    email: string,
    description: string,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateMountainSubscriptionVariables = {
  filter?: ModelSubscriptionMountainFilterInput | null,
};

export type OnCreateMountainSubscription = {
  onCreateMountain?:  {
    __typename: "Mountain",
    id: string,
    name: string,
    elevation?: number | null,
    latitude?: number | null,
    longitude?: number | null,
    city?: string | null,
    state?: string | null,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    userMountains?:  {
      __typename: "ModelUserMountainConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMountainSubscriptionVariables = {
  filter?: ModelSubscriptionMountainFilterInput | null,
};

export type OnUpdateMountainSubscription = {
  onUpdateMountain?:  {
    __typename: "Mountain",
    id: string,
    name: string,
    elevation?: number | null,
    latitude?: number | null,
    longitude?: number | null,
    city?: string | null,
    state?: string | null,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    userMountains?:  {
      __typename: "ModelUserMountainConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMountainSubscriptionVariables = {
  filter?: ModelSubscriptionMountainFilterInput | null,
};

export type OnDeleteMountainSubscription = {
  onDeleteMountain?:  {
    __typename: "Mountain",
    id: string,
    name: string,
    elevation?: number | null,
    latitude?: number | null,
    longitude?: number | null,
    city?: string | null,
    state?: string | null,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    userMountains?:  {
      __typename: "ModelUserMountainConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreatePatchMountainSubscriptionVariables = {
  filter?: ModelSubscriptionPatchMountainFilterInput | null,
};

export type OnCreatePatchMountainSubscription = {
  onCreatePatchMountain?:  {
    __typename: "PatchMountain",
    id: string,
    patchPatchMountainsId?: string | null,
    mountainPatchMountainsId?: string | null,
    patch:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    mountain:  {
      __typename: "Mountain",
      id: string,
      name: string,
      elevation?: number | null,
      latitude?: number | null,
      longitude?: number | null,
      city?: string | null,
      state?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    delisted?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePatchMountainSubscriptionVariables = {
  filter?: ModelSubscriptionPatchMountainFilterInput | null,
};

export type OnUpdatePatchMountainSubscription = {
  onUpdatePatchMountain?:  {
    __typename: "PatchMountain",
    id: string,
    patchPatchMountainsId?: string | null,
    mountainPatchMountainsId?: string | null,
    patch:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    mountain:  {
      __typename: "Mountain",
      id: string,
      name: string,
      elevation?: number | null,
      latitude?: number | null,
      longitude?: number | null,
      city?: string | null,
      state?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    delisted?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePatchMountainSubscriptionVariables = {
  filter?: ModelSubscriptionPatchMountainFilterInput | null,
};

export type OnDeletePatchMountainSubscription = {
  onDeletePatchMountain?:  {
    __typename: "PatchMountain",
    id: string,
    patchPatchMountainsId?: string | null,
    mountainPatchMountainsId?: string | null,
    patch:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    mountain:  {
      __typename: "Mountain",
      id: string,
      name: string,
      elevation?: number | null,
      latitude?: number | null,
      longitude?: number | null,
      city?: string | null,
      state?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    delisted?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserMountainSubscriptionVariables = {
  filter?: ModelSubscriptionUserMountainFilterInput | null,
  owner?: string | null,
};

export type OnCreateUserMountainSubscription = {
  onCreateUserMountain?:  {
    __typename: "UserMountain",
    id: string,
    userID: string,
    mountainID: string,
    dateClimbed: string,
    notes?: string | null,
    mountain?:  {
      __typename: "Mountain",
      id: string,
      name: string,
      elevation?: number | null,
      latitude?: number | null,
      longitude?: number | null,
      city?: string | null,
      state?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateUserMountainSubscriptionVariables = {
  filter?: ModelSubscriptionUserMountainFilterInput | null,
  owner?: string | null,
};

export type OnUpdateUserMountainSubscription = {
  onUpdateUserMountain?:  {
    __typename: "UserMountain",
    id: string,
    userID: string,
    mountainID: string,
    dateClimbed: string,
    notes?: string | null,
    mountain?:  {
      __typename: "Mountain",
      id: string,
      name: string,
      elevation?: number | null,
      latitude?: number | null,
      longitude?: number | null,
      city?: string | null,
      state?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteUserMountainSubscriptionVariables = {
  filter?: ModelSubscriptionUserMountainFilterInput | null,
  owner?: string | null,
};

export type OnDeleteUserMountainSubscription = {
  onDeleteUserMountain?:  {
    __typename: "UserMountain",
    id: string,
    userID: string,
    mountainID: string,
    dateClimbed: string,
    notes?: string | null,
    mountain?:  {
      __typename: "Mountain",
      id: string,
      name: string,
      elevation?: number | null,
      latitude?: number | null,
      longitude?: number | null,
      city?: string | null,
      state?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateTrailSubscriptionVariables = {
  filter?: ModelSubscriptionTrailFilterInput | null,
};

export type OnCreateTrailSubscription = {
  onCreateTrail?:  {
    __typename: "Trail",
    id: string,
    name: string,
    description?: string | null,
    lengthMiles: number,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    userTrails?:  {
      __typename: "ModelUserTrailConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTrailSubscriptionVariables = {
  filter?: ModelSubscriptionTrailFilterInput | null,
};

export type OnUpdateTrailSubscription = {
  onUpdateTrail?:  {
    __typename: "Trail",
    id: string,
    name: string,
    description?: string | null,
    lengthMiles: number,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    userTrails?:  {
      __typename: "ModelUserTrailConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteTrailSubscriptionVariables = {
  filter?: ModelSubscriptionTrailFilterInput | null,
};

export type OnDeleteTrailSubscription = {
  onDeleteTrail?:  {
    __typename: "Trail",
    id: string,
    name: string,
    description?: string | null,
    lengthMiles: number,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    userTrails?:  {
      __typename: "ModelUserTrailConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreatePatchTrailSubscriptionVariables = {
  filter?: ModelSubscriptionPatchTrailFilterInput | null,
};

export type OnCreatePatchTrailSubscription = {
  onCreatePatchTrail?:  {
    __typename: "PatchTrail",
    id: string,
    patchPatchTrailsId?: string | null,
    trailPatchTrailsId?: string | null,
    patch:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    trail:  {
      __typename: "Trail",
      id: string,
      name: string,
      description?: string | null,
      lengthMiles: number,
      createdAt: string,
      updatedAt: string,
    },
    requiredMiles?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePatchTrailSubscriptionVariables = {
  filter?: ModelSubscriptionPatchTrailFilterInput | null,
};

export type OnUpdatePatchTrailSubscription = {
  onUpdatePatchTrail?:  {
    __typename: "PatchTrail",
    id: string,
    patchPatchTrailsId?: string | null,
    trailPatchTrailsId?: string | null,
    patch:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    trail:  {
      __typename: "Trail",
      id: string,
      name: string,
      description?: string | null,
      lengthMiles: number,
      createdAt: string,
      updatedAt: string,
    },
    requiredMiles?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePatchTrailSubscriptionVariables = {
  filter?: ModelSubscriptionPatchTrailFilterInput | null,
};

export type OnDeletePatchTrailSubscription = {
  onDeletePatchTrail?:  {
    __typename: "PatchTrail",
    id: string,
    patchPatchTrailsId?: string | null,
    trailPatchTrailsId?: string | null,
    patch:  {
      __typename: "Patch",
      id: string,
      name: string,
      description?: string | null,
      howToGet?: string | null,
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
      difficulty?: Difficulty | null,
      latitude?: number | null,
      longitude?: number | null,
      popularity?: number | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      completionRule?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    trail:  {
      __typename: "Trail",
      id: string,
      name: string,
      description?: string | null,
      lengthMiles: number,
      createdAt: string,
      updatedAt: string,
    },
    requiredMiles?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserTrailSubscriptionVariables = {
  filter?: ModelSubscriptionUserTrailFilterInput | null,
  userID?: string | null,
};

export type OnCreateUserTrailSubscription = {
  onCreateUserTrail?:  {
    __typename: "UserTrail",
    userID: string,
    trailID: string,
    dateCompleted?: string | null,
    milesRemaining?: number | null,
    notes?: string | null,
    trail?:  {
      __typename: "Trail",
      id: string,
      name: string,
      description?: string | null,
      lengthMiles: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserTrailSubscriptionVariables = {
  filter?: ModelSubscriptionUserTrailFilterInput | null,
  userID?: string | null,
};

export type OnUpdateUserTrailSubscription = {
  onUpdateUserTrail?:  {
    __typename: "UserTrail",
    userID: string,
    trailID: string,
    dateCompleted?: string | null,
    milesRemaining?: number | null,
    notes?: string | null,
    trail?:  {
      __typename: "Trail",
      id: string,
      name: string,
      description?: string | null,
      lengthMiles: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserTrailSubscriptionVariables = {
  filter?: ModelSubscriptionUserTrailFilterInput | null,
  userID?: string | null,
};

export type OnDeleteUserTrailSubscription = {
  onDeleteUserTrail?:  {
    __typename: "UserTrail",
    userID: string,
    trailID: string,
    dateCompleted?: string | null,
    milesRemaining?: number | null,
    notes?: string | null,
    trail?:  {
      __typename: "Trail",
      id: string,
      name: string,
      description?: string | null,
      lengthMiles: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
