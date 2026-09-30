/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type AdminNotification = {
  __typename: "AdminNotification",
  body?: string | null,
  createdAt: string,
  id: string,
  link?: string | null,
  read?: boolean | null,
  title: string,
  type: NotificationType,
  updatedAt: string,
};

export enum NotificationType {
  NEW_USER = "NEW_USER",
  OWNER_REQUEST = "OWNER_REQUEST",
  PATCH_PURCHASED = "PATCH_PURCHASED",
}


export type AppSetting = {
  __typename: "AppSetting",
  createdAt: string,
  key: string,
  updatedAt: string,
  value?: string | null,
};

export type Mountain = {
  __typename: "Mountain",
  alltrailsUrl?: string | null,
  city?: string | null,
  createdAt: string,
  elevation?: number | null,
  id: string,
  latitude?: number | null,
  longitude?: number | null,
  name: string,
  patchMountains?: ModelPatchMountainConnection | null,
  peakbaggerUrl?: string | null,
  state?: string | null,
  updatedAt: string,
  userMountains?: ModelUserMountainConnection | null,
  weatherUrl?: string | null,
};

export type ModelPatchMountainConnection = {
  __typename: "ModelPatchMountainConnection",
  items:  Array<PatchMountain | null >,
  nextToken?: string | null,
};

export type PatchMountain = {
  __typename: "PatchMountain",
  createdAt: string,
  delisted?: boolean | null,
  id: string,
  mountain?: Mountain | null,
  mountainPatchMountainsId?: string | null,
  patch?: Patch | null,
  patchPatchMountainsId?: string | null,
  updatedAt: string,
};

export type Patch = {
  __typename: "Patch",
  alltrailsUrl?: string | null,
  completionRule?: string | null,
  createdAt: string,
  description?: string | null,
  difficulty?: Difficulty | null,
  facebookUrl?: string | null,
  formUrl?: string | null,
  hasPeaks?: boolean | null,
  hasTrails?: boolean | null,
  howToGet?: string | null,
  id: string,
  imageUrl?: string | null,
  isPurchasable?: boolean | null,
  latitude?: number | null,
  longitude?: number | null,
  name: string,
  patchMountains?: ModelPatchMountainConnection | null,
  patchTrails?: ModelPatchTrailConnection | null,
  popularity?: number | null,
  purchaseUrl?: string | null,
  regions?: Array< string | null > | null,
  seasons?: Array< Season | null > | null,
  status?: string | null,
  updatedAt: string,
  userPatches?: ModelUserPatchConnection | null,
  websiteUrl?: string | null,
};

export enum Difficulty {
  EASY = "EASY",
  EXTRA_EXTRA_HARD = "EXTRA_EXTRA_HARD",
  EXTRA_HARD = "EXTRA_HARD",
  HARD = "HARD",
  MODERATE = "MODERATE",
}


export type ModelPatchTrailConnection = {
  __typename: "ModelPatchTrailConnection",
  items:  Array<PatchTrail | null >,
  nextToken?: string | null,
};

export type PatchTrail = {
  __typename: "PatchTrail",
  createdAt: string,
  id: string,
  patch?: Patch | null,
  patchPatchTrailsId?: string | null,
  requiredMiles?: number | null,
  trail?: Trail | null,
  trailPatchTrailsId?: string | null,
  updatedAt: string,
};

export type Trail = {
  __typename: "Trail",
  alltrailsUrl?: string | null,
  createdAt: string,
  description?: string | null,
  id: string,
  lengthMiles: number,
  name: string,
  patchTrails?: ModelPatchTrailConnection | null,
  trailLinkUrl?: string | null,
  updatedAt: string,
  userTrails?: ModelUserTrailConnection | null,
};

export type ModelUserTrailConnection = {
  __typename: "ModelUserTrailConnection",
  items:  Array<UserTrail | null >,
  nextToken?: string | null,
};

export type UserTrail = {
  __typename: "UserTrail",
  createdAt: string,
  dateCompleted?: string | null,
  milesRemaining?: number | null,
  notes?: string | null,
  trail?: Trail | null,
  trailID: string,
  updatedAt: string,
  userID: string,
};

export enum Season {
  FALL = "FALL",
  SPRING = "SPRING",
  SUMMER = "SUMMER",
  WINTER = "WINTER",
}


export type ModelUserPatchConnection = {
  __typename: "ModelUserPatchConnection",
  items:  Array<UserPatch | null >,
  nextToken?: string | null,
};

export type UserPatch = {
  __typename: "UserPatch",
  createdAt: string,
  dateCompleted?: string | null,
  difficulty?: number | null,
  id: string,
  imageUrl?: string | null,
  inProgress?: boolean | null,
  notes?: string | null,
  patch?: Patch | null,
  patchID: string,
  updatedAt: string,
  userID: string,
  wishlisted?: boolean | null,
};

export type ModelUserMountainConnection = {
  __typename: "ModelUserMountainConnection",
  items:  Array<UserMountain | null >,
  nextToken?: string | null,
};

export type UserMountain = {
  __typename: "UserMountain",
  createdAt: string,
  dateClimbed: string,
  id: string,
  mountain?: Mountain | null,
  mountainID: string,
  notes?: string | null,
  owner?: string | null,
  updatedAt: string,
  userID: string,
};

export type PatchOwner = {
  __typename: "PatchOwner",
  createdAt: string,
  id: string,
  patchID: string,
  patchName: string,
  updatedAt: string,
  userEmail: string,
  userID: string,
};

export type PatchOwnerRequest = {
  __typename: "PatchOwnerRequest",
  createdAt: string,
  id: string,
  message?: string | null,
  patchID: string,
  patchName: string,
  status: OwnershipRequestStatus,
  updatedAt: string,
  userEmail: string,
  userID: string,
};

export enum OwnershipRequestStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}


export type PatchProgress = {
  __typename: "PatchProgress",
  completed: number,
  denom: number,
  note?: string | null,
  patchId: string,
  percent: number,
  userId: string,
};

export type PatchPurchase = {
  __typename: "PatchPurchase",
  amount?: number | null,
  createdAt: string,
  currency?: string | null,
  id: string,
  patchId: string,
  stripeReceiptUrl?: string | null,
  stripeSessionId: string,
  updatedAt: string,
  userId: string,
};

export type PatchRequest = {
  __typename: "PatchRequest",
  createdAt: string,
  description: string,
  email: string,
  id: string,
  updatedAt: string,
};

export type RelatedPatch = {
  __typename: "RelatedPatch",
  description?: string | null,
  difficulty?: Difficulty | null,
  hasPeaks?: boolean | null,
  hasTrails?: boolean | null,
  id: string,
  imageUrl?: string | null,
  isPurchasable?: boolean | null,
  matchScore: number,
  name: string,
  popularity?: number | null,
  regions?: Array< string | null > | null,
};

export type ModelAdminNotificationFilterInput = {
  and?: Array< ModelAdminNotificationFilterInput | null > | null,
  body?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  link?: ModelStringInput | null,
  not?: ModelAdminNotificationFilterInput | null,
  or?: Array< ModelAdminNotificationFilterInput | null > | null,
  read?: ModelBooleanInput | null,
  title?: ModelStringInput | null,
  type?: ModelNotificationTypeInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelNotificationTypeInput = {
  eq?: NotificationType | null,
  ne?: NotificationType | null,
};

export type ModelAdminNotificationConnection = {
  __typename: "ModelAdminNotificationConnection",
  items:  Array<AdminNotification | null >,
  nextToken?: string | null,
};

export type ModelAppSettingFilterInput = {
  and?: Array< ModelAppSettingFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  key?: ModelStringInput | null,
  not?: ModelAppSettingFilterInput | null,
  or?: Array< ModelAppSettingFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
  value?: ModelStringInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelAppSettingConnection = {
  __typename: "ModelAppSettingConnection",
  items:  Array<AppSetting | null >,
  nextToken?: string | null,
};

export type ModelMountainFilterInput = {
  alltrailsUrl?: ModelStringInput | null,
  and?: Array< ModelMountainFilterInput | null > | null,
  city?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  elevation?: ModelIntInput | null,
  id?: ModelIDInput | null,
  latitude?: ModelFloatInput | null,
  longitude?: ModelFloatInput | null,
  name?: ModelStringInput | null,
  not?: ModelMountainFilterInput | null,
  or?: Array< ModelMountainFilterInput | null > | null,
  peakbaggerUrl?: ModelStringInput | null,
  state?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  weatherUrl?: ModelStringInput | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelFloatInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelMountainConnection = {
  __typename: "ModelMountainConnection",
  items:  Array<Mountain | null >,
  nextToken?: string | null,
};

export type ModelPatchMountainFilterInput = {
  and?: Array< ModelPatchMountainFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  delisted?: ModelBooleanInput | null,
  id?: ModelIDInput | null,
  mountainPatchMountainsId?: ModelIDInput | null,
  not?: ModelPatchMountainFilterInput | null,
  or?: Array< ModelPatchMountainFilterInput | null > | null,
  patchPatchMountainsId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelPatchOwnerRequestFilterInput = {
  and?: Array< ModelPatchOwnerRequestFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  message?: ModelStringInput | null,
  not?: ModelPatchOwnerRequestFilterInput | null,
  or?: Array< ModelPatchOwnerRequestFilterInput | null > | null,
  patchID?: ModelIDInput | null,
  patchName?: ModelStringInput | null,
  status?: ModelOwnershipRequestStatusInput | null,
  updatedAt?: ModelStringInput | null,
  userEmail?: ModelStringInput | null,
  userID?: ModelStringInput | null,
};

export type ModelOwnershipRequestStatusInput = {
  eq?: OwnershipRequestStatus | null,
  ne?: OwnershipRequestStatus | null,
};

export type ModelPatchOwnerRequestConnection = {
  __typename: "ModelPatchOwnerRequestConnection",
  items:  Array<PatchOwnerRequest | null >,
  nextToken?: string | null,
};

export type ModelPatchOwnerFilterInput = {
  and?: Array< ModelPatchOwnerFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelPatchOwnerFilterInput | null,
  or?: Array< ModelPatchOwnerFilterInput | null > | null,
  patchID?: ModelIDInput | null,
  patchName?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userEmail?: ModelStringInput | null,
  userID?: ModelStringInput | null,
};

export type ModelPatchOwnerConnection = {
  __typename: "ModelPatchOwnerConnection",
  items:  Array<PatchOwner | null >,
  nextToken?: string | null,
};

export type ModelPatchPurchaseFilterInput = {
  amount?: ModelIntInput | null,
  and?: Array< ModelPatchPurchaseFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  currency?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelPatchPurchaseFilterInput | null,
  or?: Array< ModelPatchPurchaseFilterInput | null > | null,
  patchId?: ModelIDInput | null,
  stripeReceiptUrl?: ModelStringInput | null,
  stripeSessionId?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelIDInput | null,
};

export type ModelPatchPurchaseConnection = {
  __typename: "ModelPatchPurchaseConnection",
  items:  Array<PatchPurchase | null >,
  nextToken?: string | null,
};

export type ModelPatchRequestFilterInput = {
  and?: Array< ModelPatchRequestFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  email?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelPatchRequestFilterInput | null,
  or?: Array< ModelPatchRequestFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelPatchRequestConnection = {
  __typename: "ModelPatchRequestConnection",
  items:  Array<PatchRequest | null >,
  nextToken?: string | null,
};

export type ModelPatchTrailFilterInput = {
  and?: Array< ModelPatchTrailFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelPatchTrailFilterInput | null,
  or?: Array< ModelPatchTrailFilterInput | null > | null,
  patchPatchTrailsId?: ModelIDInput | null,
  requiredMiles?: ModelFloatInput | null,
  trailPatchTrailsId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelPatchFilterInput = {
  alltrailsUrl?: ModelStringInput | null,
  and?: Array< ModelPatchFilterInput | null > | null,
  completionRule?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  difficulty?: ModelDifficultyInput | null,
  facebookUrl?: ModelStringInput | null,
  formUrl?: ModelStringInput | null,
  hasPeaks?: ModelBooleanInput | null,
  hasTrails?: ModelBooleanInput | null,
  howToGet?: ModelStringInput | null,
  id?: ModelIDInput | null,
  imageUrl?: ModelStringInput | null,
  isPurchasable?: ModelBooleanInput | null,
  latitude?: ModelFloatInput | null,
  longitude?: ModelFloatInput | null,
  name?: ModelStringInput | null,
  not?: ModelPatchFilterInput | null,
  or?: Array< ModelPatchFilterInput | null > | null,
  popularity?: ModelIntInput | null,
  purchaseUrl?: ModelStringInput | null,
  regions?: ModelStringInput | null,
  seasons?: ModelSeasonListInput | null,
  status?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  websiteUrl?: ModelStringInput | null,
};

export type ModelDifficultyInput = {
  eq?: Difficulty | null,
  ne?: Difficulty | null,
};

export type ModelSeasonListInput = {
  contains?: Season | null,
  eq?: Array< Season | null > | null,
  ne?: Array< Season | null > | null,
  notContains?: Season | null,
};

export type ModelPatchConnection = {
  __typename: "ModelPatchConnection",
  items:  Array<Patch | null >,
  nextToken?: string | null,
};

export type ModelTrailFilterInput = {
  alltrailsUrl?: ModelStringInput | null,
  and?: Array< ModelTrailFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  id?: ModelIDInput | null,
  lengthMiles?: ModelFloatInput | null,
  name?: ModelStringInput | null,
  not?: ModelTrailFilterInput | null,
  or?: Array< ModelTrailFilterInput | null > | null,
  trailLinkUrl?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelTrailConnection = {
  __typename: "ModelTrailConnection",
  items:  Array<Trail | null >,
  nextToken?: string | null,
};

export type ModelUserMountainFilterInput = {
  and?: Array< ModelUserMountainFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  dateClimbed?: ModelStringInput | null,
  id?: ModelIDInput | null,
  mountainID?: ModelIDInput | null,
  not?: ModelUserMountainFilterInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelUserMountainFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userID?: ModelIDInput | null,
};

export type ModelUserPatchFilterInput = {
  and?: Array< ModelUserPatchFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  dateCompleted?: ModelStringInput | null,
  difficulty?: ModelIntInput | null,
  id?: ModelIDInput | null,
  imageUrl?: ModelStringInput | null,
  inProgress?: ModelBooleanInput | null,
  not?: ModelUserPatchFilterInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelUserPatchFilterInput | null > | null,
  patchID?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
  userID?: ModelStringInput | null,
  wishlisted?: ModelBooleanInput | null,
};

export type ModelUserTrailFilterInput = {
  and?: Array< ModelUserTrailFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  dateCompleted?: ModelStringInput | null,
  id?: ModelIDInput | null,
  milesRemaining?: ModelFloatInput | null,
  not?: ModelUserTrailFilterInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelUserTrailFilterInput | null > | null,
  trailID?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
  userID?: ModelIDInput | null,
};

export type ModelIDKeyConditionInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
};

export type ModelStringKeyConditionInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
};

export type ModelAdminNotificationConditionInput = {
  and?: Array< ModelAdminNotificationConditionInput | null > | null,
  body?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  link?: ModelStringInput | null,
  not?: ModelAdminNotificationConditionInput | null,
  or?: Array< ModelAdminNotificationConditionInput | null > | null,
  read?: ModelBooleanInput | null,
  title?: ModelStringInput | null,
  type?: ModelNotificationTypeInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateAdminNotificationInput = {
  body?: string | null,
  id?: string | null,
  link?: string | null,
  read?: boolean | null,
  title: string,
  type: NotificationType,
};

export type ModelAppSettingConditionInput = {
  and?: Array< ModelAppSettingConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelAppSettingConditionInput | null,
  or?: Array< ModelAppSettingConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
  value?: ModelStringInput | null,
};

export type CreateAppSettingInput = {
  key: string,
  value?: string | null,
};

export type ModelMountainConditionInput = {
  alltrailsUrl?: ModelStringInput | null,
  and?: Array< ModelMountainConditionInput | null > | null,
  city?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  elevation?: ModelIntInput | null,
  latitude?: ModelFloatInput | null,
  longitude?: ModelFloatInput | null,
  name?: ModelStringInput | null,
  not?: ModelMountainConditionInput | null,
  or?: Array< ModelMountainConditionInput | null > | null,
  peakbaggerUrl?: ModelStringInput | null,
  state?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  weatherUrl?: ModelStringInput | null,
};

export type CreateMountainInput = {
  alltrailsUrl?: string | null,
  city?: string | null,
  elevation?: number | null,
  id?: string | null,
  latitude?: number | null,
  longitude?: number | null,
  name: string,
  peakbaggerUrl?: string | null,
  state?: string | null,
  weatherUrl?: string | null,
};

export type ModelPatchConditionInput = {
  alltrailsUrl?: ModelStringInput | null,
  and?: Array< ModelPatchConditionInput | null > | null,
  completionRule?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  difficulty?: ModelDifficultyInput | null,
  facebookUrl?: ModelStringInput | null,
  formUrl?: ModelStringInput | null,
  hasPeaks?: ModelBooleanInput | null,
  hasTrails?: ModelBooleanInput | null,
  howToGet?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  isPurchasable?: ModelBooleanInput | null,
  latitude?: ModelFloatInput | null,
  longitude?: ModelFloatInput | null,
  name?: ModelStringInput | null,
  not?: ModelPatchConditionInput | null,
  or?: Array< ModelPatchConditionInput | null > | null,
  popularity?: ModelIntInput | null,
  purchaseUrl?: ModelStringInput | null,
  regions?: ModelStringInput | null,
  seasons?: ModelSeasonListInput | null,
  status?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  websiteUrl?: ModelStringInput | null,
};

export type CreatePatchInput = {
  alltrailsUrl?: string | null,
  completionRule?: string | null,
  description?: string | null,
  difficulty?: Difficulty | null,
  facebookUrl?: string | null,
  formUrl?: string | null,
  hasPeaks?: boolean | null,
  hasTrails?: boolean | null,
  howToGet?: string | null,
  id?: string | null,
  imageUrl?: string | null,
  isPurchasable?: boolean | null,
  latitude?: number | null,
  longitude?: number | null,
  name: string,
  popularity?: number | null,
  purchaseUrl?: string | null,
  regions?: Array< string | null > | null,
  seasons?: Array< Season | null > | null,
  status?: string | null,
  websiteUrl?: string | null,
};

export type ModelPatchMountainConditionInput = {
  and?: Array< ModelPatchMountainConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  delisted?: ModelBooleanInput | null,
  mountainPatchMountainsId?: ModelIDInput | null,
  not?: ModelPatchMountainConditionInput | null,
  or?: Array< ModelPatchMountainConditionInput | null > | null,
  patchPatchMountainsId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreatePatchMountainInput = {
  delisted?: boolean | null,
  id?: string | null,
  mountainPatchMountainsId?: string | null,
  patchPatchMountainsId?: string | null,
};

export type ModelPatchOwnerConditionInput = {
  and?: Array< ModelPatchOwnerConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelPatchOwnerConditionInput | null,
  or?: Array< ModelPatchOwnerConditionInput | null > | null,
  patchID?: ModelIDInput | null,
  patchName?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userEmail?: ModelStringInput | null,
  userID?: ModelStringInput | null,
};

export type CreatePatchOwnerInput = {
  id?: string | null,
  patchID: string,
  patchName: string,
  userEmail: string,
  userID: string,
};

export type ModelPatchOwnerRequestConditionInput = {
  and?: Array< ModelPatchOwnerRequestConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  message?: ModelStringInput | null,
  not?: ModelPatchOwnerRequestConditionInput | null,
  or?: Array< ModelPatchOwnerRequestConditionInput | null > | null,
  patchID?: ModelIDInput | null,
  patchName?: ModelStringInput | null,
  status?: ModelOwnershipRequestStatusInput | null,
  updatedAt?: ModelStringInput | null,
  userEmail?: ModelStringInput | null,
  userID?: ModelStringInput | null,
};

export type CreatePatchOwnerRequestInput = {
  id?: string | null,
  message?: string | null,
  patchID: string,
  patchName: string,
  status: OwnershipRequestStatus,
  userEmail: string,
  userID: string,
};

export type ModelPatchPurchaseConditionInput = {
  amount?: ModelIntInput | null,
  and?: Array< ModelPatchPurchaseConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  currency?: ModelStringInput | null,
  not?: ModelPatchPurchaseConditionInput | null,
  or?: Array< ModelPatchPurchaseConditionInput | null > | null,
  patchId?: ModelIDInput | null,
  stripeReceiptUrl?: ModelStringInput | null,
  stripeSessionId?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelIDInput | null,
};

export type CreatePatchPurchaseInput = {
  amount?: number | null,
  currency?: string | null,
  id?: string | null,
  patchId: string,
  stripeReceiptUrl?: string | null,
  stripeSessionId: string,
  userId: string,
};

export type ModelPatchRequestConditionInput = {
  and?: Array< ModelPatchRequestConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  email?: ModelStringInput | null,
  not?: ModelPatchRequestConditionInput | null,
  or?: Array< ModelPatchRequestConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreatePatchRequestInput = {
  description: string,
  email: string,
  id?: string | null,
};

export type ModelPatchTrailConditionInput = {
  and?: Array< ModelPatchTrailConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelPatchTrailConditionInput | null,
  or?: Array< ModelPatchTrailConditionInput | null > | null,
  patchPatchTrailsId?: ModelIDInput | null,
  requiredMiles?: ModelFloatInput | null,
  trailPatchTrailsId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreatePatchTrailInput = {
  id?: string | null,
  patchPatchTrailsId?: string | null,
  requiredMiles?: number | null,
  trailPatchTrailsId?: string | null,
};

export type ModelTrailConditionInput = {
  alltrailsUrl?: ModelStringInput | null,
  and?: Array< ModelTrailConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  lengthMiles?: ModelFloatInput | null,
  name?: ModelStringInput | null,
  not?: ModelTrailConditionInput | null,
  or?: Array< ModelTrailConditionInput | null > | null,
  trailLinkUrl?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateTrailInput = {
  alltrailsUrl?: string | null,
  description?: string | null,
  id?: string | null,
  lengthMiles: number,
  name: string,
  trailLinkUrl?: string | null,
};

export type ModelUserMountainConditionInput = {
  and?: Array< ModelUserMountainConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  dateClimbed?: ModelStringInput | null,
  mountainID?: ModelIDInput | null,
  not?: ModelUserMountainConditionInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelUserMountainConditionInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userID?: ModelIDInput | null,
};

export type CreateUserMountainInput = {
  dateClimbed: string,
  id?: string | null,
  mountainID: string,
  notes?: string | null,
  userID: string,
};

export type ModelUserPatchConditionInput = {
  and?: Array< ModelUserPatchConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  dateCompleted?: ModelStringInput | null,
  difficulty?: ModelIntInput | null,
  imageUrl?: ModelStringInput | null,
  inProgress?: ModelBooleanInput | null,
  not?: ModelUserPatchConditionInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelUserPatchConditionInput | null > | null,
  patchID?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
  userID?: ModelStringInput | null,
  wishlisted?: ModelBooleanInput | null,
};

export type CreateUserPatchInput = {
  dateCompleted?: string | null,
  difficulty?: number | null,
  id?: string | null,
  imageUrl?: string | null,
  inProgress?: boolean | null,
  notes?: string | null,
  patchID: string,
  userID: string,
  wishlisted?: boolean | null,
};

export type ModelUserTrailConditionInput = {
  and?: Array< ModelUserTrailConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  dateCompleted?: ModelStringInput | null,
  milesRemaining?: ModelFloatInput | null,
  not?: ModelUserTrailConditionInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelUserTrailConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
  userID?: ModelStringInput | null,
};

export type CreateUserTrailInput = {
  dateCompleted?: string | null,
  milesRemaining?: number | null,
  notes?: string | null,
  trailID: string,
  userID: string,
};

export type DeleteAdminNotificationInput = {
  id: string,
};

export type DeleteAppSettingInput = {
  key: string,
};

export type DeleteMountainInput = {
  id: string,
};

export type DeletePatchInput = {
  id: string,
};

export type DeletePatchMountainInput = {
  id: string,
};

export type DeletePatchOwnerInput = {
  id: string,
};

export type DeletePatchOwnerRequestInput = {
  id: string,
};

export type DeletePatchPurchaseInput = {
  id: string,
};

export type DeletePatchRequestInput = {
  id: string,
};

export type DeletePatchTrailInput = {
  id: string,
};

export type DeleteTrailInput = {
  id: string,
};

export type DeleteUserMountainInput = {
  id: string,
};

export type DeleteUserPatchInput = {
  id: string,
};

export type DeleteUserTrailInput = {
  trailID: string,
  userID: string,
};

export type UpdateAdminNotificationInput = {
  body?: string | null,
  id: string,
  link?: string | null,
  read?: boolean | null,
  title?: string | null,
  type?: NotificationType | null,
};

export type UpdateAppSettingInput = {
  key: string,
  value?: string | null,
};

export type UpdateMountainInput = {
  alltrailsUrl?: string | null,
  city?: string | null,
  elevation?: number | null,
  id: string,
  latitude?: number | null,
  longitude?: number | null,
  name?: string | null,
  peakbaggerUrl?: string | null,
  state?: string | null,
  weatherUrl?: string | null,
};

export type UpdatePatchInput = {
  alltrailsUrl?: string | null,
  completionRule?: string | null,
  description?: string | null,
  difficulty?: Difficulty | null,
  facebookUrl?: string | null,
  formUrl?: string | null,
  hasPeaks?: boolean | null,
  hasTrails?: boolean | null,
  howToGet?: string | null,
  id: string,
  imageUrl?: string | null,
  isPurchasable?: boolean | null,
  latitude?: number | null,
  longitude?: number | null,
  name?: string | null,
  popularity?: number | null,
  purchaseUrl?: string | null,
  regions?: Array< string | null > | null,
  seasons?: Array< Season | null > | null,
  status?: string | null,
  websiteUrl?: string | null,
};

export type UpdatePatchMountainInput = {
  delisted?: boolean | null,
  id: string,
  mountainPatchMountainsId?: string | null,
  patchPatchMountainsId?: string | null,
};

export type UpdatePatchOwnerInput = {
  id: string,
  patchID?: string | null,
  patchName?: string | null,
  userEmail?: string | null,
  userID?: string | null,
};

export type UpdatePatchOwnerRequestInput = {
  id: string,
  message?: string | null,
  patchID?: string | null,
  patchName?: string | null,
  status?: OwnershipRequestStatus | null,
  userEmail?: string | null,
  userID?: string | null,
};

export type UpdatePatchPurchaseInput = {
  amount?: number | null,
  currency?: string | null,
  id: string,
  patchId?: string | null,
  stripeReceiptUrl?: string | null,
  stripeSessionId?: string | null,
  userId?: string | null,
};

export type UpdatePatchRequestInput = {
  description?: string | null,
  email?: string | null,
  id: string,
};

export type UpdatePatchTrailInput = {
  id: string,
  patchPatchTrailsId?: string | null,
  requiredMiles?: number | null,
  trailPatchTrailsId?: string | null,
};

export type UpdateTrailInput = {
  alltrailsUrl?: string | null,
  description?: string | null,
  id: string,
  lengthMiles?: number | null,
  name?: string | null,
  trailLinkUrl?: string | null,
};

export type UpdateUserMountainInput = {
  dateClimbed?: string | null,
  id: string,
  mountainID?: string | null,
  notes?: string | null,
  userID?: string | null,
};

export type UpdateUserPatchInput = {
  dateCompleted?: string | null,
  difficulty?: number | null,
  id: string,
  imageUrl?: string | null,
  inProgress?: boolean | null,
  notes?: string | null,
  patchID?: string | null,
  userID?: string | null,
  wishlisted?: boolean | null,
};

export type UpdateUserTrailInput = {
  dateCompleted?: string | null,
  milesRemaining?: number | null,
  notes?: string | null,
  trailID: string,
  userID: string,
};

export type ModelSubscriptionAdminNotificationFilterInput = {
  and?: Array< ModelSubscriptionAdminNotificationFilterInput | null > | null,
  body?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  link?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionAdminNotificationFilterInput | null > | null,
  read?: ModelSubscriptionBooleanInput | null,
  title?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelSubscriptionAppSettingFilterInput = {
  and?: Array< ModelSubscriptionAppSettingFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  key?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionAppSettingFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  value?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionMountainFilterInput = {
  alltrailsUrl?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMountainFilterInput | null > | null,
  city?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  elevation?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  latitude?: ModelSubscriptionFloatInput | null,
  longitude?: ModelSubscriptionFloatInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionMountainFilterInput | null > | null,
  peakbaggerUrl?: ModelSubscriptionStringInput | null,
  state?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  weatherUrl?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionFloatInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionPatchFilterInput = {
  alltrailsUrl?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPatchFilterInput | null > | null,
  completionRule?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  difficulty?: ModelSubscriptionStringInput | null,
  facebookUrl?: ModelSubscriptionStringInput | null,
  formUrl?: ModelSubscriptionStringInput | null,
  hasPeaks?: ModelSubscriptionBooleanInput | null,
  hasTrails?: ModelSubscriptionBooleanInput | null,
  howToGet?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  imageUrl?: ModelSubscriptionStringInput | null,
  isPurchasable?: ModelSubscriptionBooleanInput | null,
  latitude?: ModelSubscriptionFloatInput | null,
  longitude?: ModelSubscriptionFloatInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionPatchFilterInput | null > | null,
  popularity?: ModelSubscriptionIntInput | null,
  purchaseUrl?: ModelSubscriptionStringInput | null,
  regions?: ModelSubscriptionStringInput | null,
  seasons?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  websiteUrl?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionPatchMountainFilterInput = {
  and?: Array< ModelSubscriptionPatchMountainFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  delisted?: ModelSubscriptionBooleanInput | null,
  id?: ModelSubscriptionIDInput | null,
  mountainPatchMountainsId?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionPatchMountainFilterInput | null > | null,
  patchPatchMountainsId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionPatchOwnerFilterInput = {
  and?: Array< ModelSubscriptionPatchOwnerFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionPatchOwnerFilterInput | null > | null,
  patchID?: ModelSubscriptionIDInput | null,
  patchName?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userEmail?: ModelSubscriptionStringInput | null,
  userID?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionPatchOwnerRequestFilterInput = {
  and?: Array< ModelSubscriptionPatchOwnerRequestFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  message?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionPatchOwnerRequestFilterInput | null > | null,
  patchID?: ModelSubscriptionIDInput | null,
  patchName?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userEmail?: ModelSubscriptionStringInput | null,
  userID?: ModelStringInput | null,
};

export type ModelSubscriptionPatchPurchaseFilterInput = {
  amount?: ModelSubscriptionIntInput | null,
  and?: Array< ModelSubscriptionPatchPurchaseFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  currency?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionPatchPurchaseFilterInput | null > | null,
  patchId?: ModelSubscriptionIDInput | null,
  stripeReceiptUrl?: ModelSubscriptionStringInput | null,
  stripeSessionId?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userId?: ModelStringInput | null,
};

export type ModelSubscriptionPatchRequestFilterInput = {
  and?: Array< ModelSubscriptionPatchRequestFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionPatchRequestFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionPatchTrailFilterInput = {
  and?: Array< ModelSubscriptionPatchTrailFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionPatchTrailFilterInput | null > | null,
  patchPatchTrailsId?: ModelSubscriptionIDInput | null,
  requiredMiles?: ModelSubscriptionFloatInput | null,
  trailPatchTrailsId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionTrailFilterInput = {
  alltrailsUrl?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTrailFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  lengthMiles?: ModelSubscriptionFloatInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionTrailFilterInput | null > | null,
  trailLinkUrl?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionUserMountainFilterInput = {
  and?: Array< ModelSubscriptionUserMountainFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  dateClimbed?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  mountainID?: ModelSubscriptionIDInput | null,
  notes?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionUserMountainFilterInput | null > | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userID?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionUserPatchFilterInput = {
  and?: Array< ModelSubscriptionUserPatchFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  dateCompleted?: ModelSubscriptionStringInput | null,
  difficulty?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  imageUrl?: ModelSubscriptionStringInput | null,
  inProgress?: ModelSubscriptionBooleanInput | null,
  notes?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionUserPatchFilterInput | null > | null,
  patchID?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userID?: ModelStringInput | null,
  wishlisted?: ModelSubscriptionBooleanInput | null,
};

export type ModelSubscriptionUserTrailFilterInput = {
  and?: Array< ModelSubscriptionUserTrailFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  dateCompleted?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  milesRemaining?: ModelSubscriptionFloatInput | null,
  notes?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionUserTrailFilterInput | null > | null,
  trailID?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userID?: ModelStringInput | null,
};

export type GetAdminNotificationQueryVariables = {
  id: string,
};

export type GetAdminNotificationQuery = {
  getAdminNotification?:  {
    __typename: "AdminNotification",
    body?: string | null,
    createdAt: string,
    id: string,
    link?: string | null,
    read?: boolean | null,
    title: string,
    type: NotificationType,
    updatedAt: string,
  } | null,
};

export type GetAppSettingQueryVariables = {
  key: string,
};

export type GetAppSettingQuery = {
  getAppSetting?:  {
    __typename: "AppSetting",
    createdAt: string,
    key: string,
    updatedAt: string,
    value?: string | null,
  } | null,
};

export type GetMountainQueryVariables = {
  id: string,
};

export type GetMountainQuery = {
  getMountain?:  {
    __typename: "Mountain",
    alltrailsUrl?: string | null,
    city?: string | null,
    createdAt: string,
    elevation?: number | null,
    id: string,
    latitude?: number | null,
    longitude?: number | null,
    name: string,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    peakbaggerUrl?: string | null,
    state?: string | null,
    updatedAt: string,
    userMountains?:  {
      __typename: "ModelUserMountainConnection",
      nextToken?: string | null,
    } | null,
    weatherUrl?: string | null,
  } | null,
};

export type GetPatchQueryVariables = {
  id: string,
};

export type GetPatchQuery = {
  getPatch?:  {
    __typename: "Patch",
    alltrailsUrl?: string | null,
    completionRule?: string | null,
    createdAt: string,
    description?: string | null,
    difficulty?: Difficulty | null,
    facebookUrl?: string | null,
    formUrl?: string | null,
    hasPeaks?: boolean | null,
    hasTrails?: boolean | null,
    howToGet?: string | null,
    id: string,
    imageUrl?: string | null,
    isPurchasable?: boolean | null,
    latitude?: number | null,
    longitude?: number | null,
    name: string,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    popularity?: number | null,
    purchaseUrl?: string | null,
    regions?: Array< string | null > | null,
    seasons?: Array< Season | null > | null,
    status?: string | null,
    updatedAt: string,
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    websiteUrl?: string | null,
  } | null,
};

export type GetPatchMountainQueryVariables = {
  id: string,
};

export type GetPatchMountainQuery = {
  getPatchMountain?:  {
    __typename: "PatchMountain",
    createdAt: string,
    delisted?: boolean | null,
    id: string,
    mountain?:  {
      __typename: "Mountain",
      alltrailsUrl?: string | null,
      city?: string | null,
      createdAt: string,
      elevation?: number | null,
      id: string,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      peakbaggerUrl?: string | null,
      state?: string | null,
      updatedAt: string,
      weatherUrl?: string | null,
    } | null,
    mountainPatchMountainsId?: string | null,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchPatchMountainsId?: string | null,
    updatedAt: string,
  } | null,
};

export type GetPatchOwnerQueryVariables = {
  id: string,
};

export type GetPatchOwnerQuery = {
  getPatchOwner?:  {
    __typename: "PatchOwner",
    createdAt: string,
    id: string,
    patchID: string,
    patchName: string,
    updatedAt: string,
    userEmail: string,
    userID: string,
  } | null,
};

export type GetPatchOwnerRequestQueryVariables = {
  id: string,
};

export type GetPatchOwnerRequestQuery = {
  getPatchOwnerRequest?:  {
    __typename: "PatchOwnerRequest",
    createdAt: string,
    id: string,
    message?: string | null,
    patchID: string,
    patchName: string,
    status: OwnershipRequestStatus,
    updatedAt: string,
    userEmail: string,
    userID: string,
  } | null,
};

export type GetPatchProgressSummaryQueryVariables = {
  patchId: string,
  userId: string,
};

export type GetPatchProgressSummaryQuery = {
  getPatchProgressSummary?:  {
    __typename: "PatchProgress",
    completed: number,
    denom: number,
    note?: string | null,
    patchId: string,
    percent: number,
    userId: string,
  } | null,
};

export type GetPatchPurchaseQueryVariables = {
  id: string,
};

export type GetPatchPurchaseQuery = {
  getPatchPurchase?:  {
    __typename: "PatchPurchase",
    amount?: number | null,
    createdAt: string,
    currency?: string | null,
    id: string,
    patchId: string,
    stripeReceiptUrl?: string | null,
    stripeSessionId: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type GetPatchRequestQueryVariables = {
  id: string,
};

export type GetPatchRequestQuery = {
  getPatchRequest?:  {
    __typename: "PatchRequest",
    createdAt: string,
    description: string,
    email: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type GetPatchTrailQueryVariables = {
  id: string,
};

export type GetPatchTrailQuery = {
  getPatchTrail?:  {
    __typename: "PatchTrail",
    createdAt: string,
    id: string,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchPatchTrailsId?: string | null,
    requiredMiles?: number | null,
    trail?:  {
      __typename: "Trail",
      alltrailsUrl?: string | null,
      createdAt: string,
      description?: string | null,
      id: string,
      lengthMiles: number,
      name: string,
      trailLinkUrl?: string | null,
      updatedAt: string,
    } | null,
    trailPatchTrailsId?: string | null,
    updatedAt: string,
  } | null,
};

export type GetRelatedPatchesQueryVariables = {
  limit?: number | null,
  patchId: string,
};

export type GetRelatedPatchesQuery = {
  getRelatedPatches:  Array< {
    __typename: "RelatedPatch",
    description?: string | null,
    difficulty?: Difficulty | null,
    hasPeaks?: boolean | null,
    hasTrails?: boolean | null,
    id: string,
    imageUrl?: string | null,
    isPurchasable?: boolean | null,
    matchScore: number,
    name: string,
    popularity?: number | null,
    regions?: Array< string | null > | null,
  } >,
};

export type GetTrailQueryVariables = {
  id: string,
};

export type GetTrailQuery = {
  getTrail?:  {
    __typename: "Trail",
    alltrailsUrl?: string | null,
    createdAt: string,
    description?: string | null,
    id: string,
    lengthMiles: number,
    name: string,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    trailLinkUrl?: string | null,
    updatedAt: string,
    userTrails?:  {
      __typename: "ModelUserTrailConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type GetUserMountainQueryVariables = {
  id: string,
};

export type GetUserMountainQuery = {
  getUserMountain?:  {
    __typename: "UserMountain",
    createdAt: string,
    dateClimbed: string,
    id: string,
    mountain?:  {
      __typename: "Mountain",
      alltrailsUrl?: string | null,
      city?: string | null,
      createdAt: string,
      elevation?: number | null,
      id: string,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      peakbaggerUrl?: string | null,
      state?: string | null,
      updatedAt: string,
      weatherUrl?: string | null,
    } | null,
    mountainID: string,
    notes?: string | null,
    owner?: string | null,
    updatedAt: string,
    userID: string,
  } | null,
};

export type GetUserPatchQueryVariables = {
  id: string,
};

export type GetUserPatchQuery = {
  getUserPatch?:  {
    __typename: "UserPatch",
    createdAt: string,
    dateCompleted?: string | null,
    difficulty?: number | null,
    id: string,
    imageUrl?: string | null,
    inProgress?: boolean | null,
    notes?: string | null,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchID: string,
    updatedAt: string,
    userID: string,
    wishlisted?: boolean | null,
  } | null,
};

export type GetUserTrailQueryVariables = {
  trailID: string,
  userID: string,
};

export type GetUserTrailQuery = {
  getUserTrail?:  {
    __typename: "UserTrail",
    createdAt: string,
    dateCompleted?: string | null,
    milesRemaining?: number | null,
    notes?: string | null,
    trail?:  {
      __typename: "Trail",
      alltrailsUrl?: string | null,
      createdAt: string,
      description?: string | null,
      id: string,
      lengthMiles: number,
      name: string,
      trailLinkUrl?: string | null,
      updatedAt: string,
    } | null,
    trailID: string,
    updatedAt: string,
    userID: string,
  } | null,
};

export type ListAdminNotificationsQueryVariables = {
  filter?: ModelAdminNotificationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAdminNotificationsQuery = {
  listAdminNotifications?:  {
    __typename: "ModelAdminNotificationConnection",
    items:  Array< {
      __typename: "AdminNotification",
      body?: string | null,
      createdAt: string,
      id: string,
      link?: string | null,
      read?: boolean | null,
      title: string,
      type: NotificationType,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListAppSettingsQueryVariables = {
  filter?: ModelAppSettingFilterInput | null,
  key?: string | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListAppSettingsQuery = {
  listAppSettings?:  {
    __typename: "ModelAppSettingConnection",
    items:  Array< {
      __typename: "AppSetting",
      createdAt: string,
      key: string,
      updatedAt: string,
      value?: string | null,
    } | null >,
    nextToken?: string | null,
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
      alltrailsUrl?: string | null,
      city?: string | null,
      createdAt: string,
      elevation?: number | null,
      id: string,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      peakbaggerUrl?: string | null,
      state?: string | null,
      updatedAt: string,
      weatherUrl?: string | null,
    } | null >,
    nextToken?: string | null,
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
      createdAt: string,
      delisted?: boolean | null,
      id: string,
      mountainPatchMountainsId?: string | null,
      patchPatchMountainsId?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPatchOwnerRequestsQueryVariables = {
  filter?: ModelPatchOwnerRequestFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPatchOwnerRequestsQuery = {
  listPatchOwnerRequests?:  {
    __typename: "ModelPatchOwnerRequestConnection",
    items:  Array< {
      __typename: "PatchOwnerRequest",
      createdAt: string,
      id: string,
      message?: string | null,
      patchID: string,
      patchName: string,
      status: OwnershipRequestStatus,
      updatedAt: string,
      userEmail: string,
      userID: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPatchOwnersQueryVariables = {
  filter?: ModelPatchOwnerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPatchOwnersQuery = {
  listPatchOwners?:  {
    __typename: "ModelPatchOwnerConnection",
    items:  Array< {
      __typename: "PatchOwner",
      createdAt: string,
      id: string,
      patchID: string,
      patchName: string,
      updatedAt: string,
      userEmail: string,
      userID: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPatchProgressQueryVariables = {
  patchIds: Array< string >,
  userId: string,
};

export type ListPatchProgressQuery = {
  listPatchProgress:  Array< {
    __typename: "PatchProgress",
    completed: number,
    denom: number,
    note?: string | null,
    patchId: string,
    percent: number,
    userId: string,
  } >,
};

export type ListPatchPurchasesQueryVariables = {
  filter?: ModelPatchPurchaseFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPatchPurchasesQuery = {
  listPatchPurchases?:  {
    __typename: "ModelPatchPurchaseConnection",
    items:  Array< {
      __typename: "PatchPurchase",
      amount?: number | null,
      createdAt: string,
      currency?: string | null,
      id: string,
      patchId: string,
      stripeReceiptUrl?: string | null,
      stripeSessionId: string,
      updatedAt: string,
      userId: string,
    } | null >,
    nextToken?: string | null,
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
      createdAt: string,
      description: string,
      email: string,
      id: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
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
      createdAt: string,
      id: string,
      patchPatchTrailsId?: string | null,
      requiredMiles?: number | null,
      trailPatchTrailsId?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
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
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null >,
    nextToken?: string | null,
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
      alltrailsUrl?: string | null,
      createdAt: string,
      description?: string | null,
      id: string,
      lengthMiles: number,
      name: string,
      trailLinkUrl?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
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
      createdAt: string,
      dateClimbed: string,
      id: string,
      mountainID: string,
      notes?: string | null,
      owner?: string | null,
      updatedAt: string,
      userID: string,
    } | null >,
    nextToken?: string | null,
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
      createdAt: string,
      dateCompleted?: string | null,
      difficulty?: number | null,
      id: string,
      imageUrl?: string | null,
      inProgress?: boolean | null,
      notes?: string | null,
      patchID: string,
      updatedAt: string,
      userID: string,
      wishlisted?: boolean | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUserTrailsQueryVariables = {
  filter?: ModelUserTrailFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  trailID?: ModelIDKeyConditionInput | null,
  userID?: string | null,
};

export type ListUserTrailsQuery = {
  listUserTrails?:  {
    __typename: "ModelUserTrailConnection",
    items:  Array< {
      __typename: "UserTrail",
      createdAt: string,
      dateCompleted?: string | null,
      milesRemaining?: number | null,
      notes?: string | null,
      trailID: string,
      updatedAt: string,
      userID: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PatchMountainsByMountainQueryVariables = {
  filter?: ModelPatchMountainFilterInput | null,
  limit?: number | null,
  mountainPatchMountainsId: string,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type PatchMountainsByMountainQuery = {
  patchMountainsByMountain?:  {
    __typename: "ModelPatchMountainConnection",
    items:  Array< {
      __typename: "PatchMountain",
      createdAt: string,
      delisted?: boolean | null,
      id: string,
      mountainPatchMountainsId?: string | null,
      patchPatchMountainsId?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PatchMountainsByPatchQueryVariables = {
  filter?: ModelPatchMountainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  patchPatchMountainsId: string,
  sortDirection?: ModelSortDirection | null,
};

export type PatchMountainsByPatchQuery = {
  patchMountainsByPatch?:  {
    __typename: "ModelPatchMountainConnection",
    items:  Array< {
      __typename: "PatchMountain",
      createdAt: string,
      delisted?: boolean | null,
      id: string,
      mountainPatchMountainsId?: string | null,
      patchPatchMountainsId?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PatchOwnersByPatchQueryVariables = {
  filter?: ModelPatchOwnerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  patchID: string,
  sortDirection?: ModelSortDirection | null,
};

export type PatchOwnersByPatchQuery = {
  patchOwnersByPatch?:  {
    __typename: "ModelPatchOwnerConnection",
    items:  Array< {
      __typename: "PatchOwner",
      createdAt: string,
      id: string,
      patchID: string,
      patchName: string,
      updatedAt: string,
      userEmail: string,
      userID: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PatchOwnersByUserQueryVariables = {
  filter?: ModelPatchOwnerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  userID: string,
};

export type PatchOwnersByUserQuery = {
  patchOwnersByUser?:  {
    __typename: "ModelPatchOwnerConnection",
    items:  Array< {
      __typename: "PatchOwner",
      createdAt: string,
      id: string,
      patchID: string,
      patchName: string,
      updatedAt: string,
      userEmail: string,
      userID: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PatchTrailsByPatchQueryVariables = {
  filter?: ModelPatchTrailFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  patchPatchTrailsId: string,
  sortDirection?: ModelSortDirection | null,
};

export type PatchTrailsByPatchQuery = {
  patchTrailsByPatch?:  {
    __typename: "ModelPatchTrailConnection",
    items:  Array< {
      __typename: "PatchTrail",
      createdAt: string,
      id: string,
      patchPatchTrailsId?: string | null,
      requiredMiles?: number | null,
      trailPatchTrailsId?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PatchTrailsByTrailQueryVariables = {
  filter?: ModelPatchTrailFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  trailPatchTrailsId: string,
};

export type PatchTrailsByTrailQuery = {
  patchTrailsByTrail?:  {
    __typename: "ModelPatchTrailConnection",
    items:  Array< {
      __typename: "PatchTrail",
      createdAt: string,
      id: string,
      patchPatchTrailsId?: string | null,
      requiredMiles?: number | null,
      trailPatchTrailsId?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserMountainsByMountainQueryVariables = {
  filter?: ModelUserMountainFilterInput | null,
  limit?: number | null,
  mountainID: string,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type UserMountainsByMountainQuery = {
  userMountainsByMountain?:  {
    __typename: "ModelUserMountainConnection",
    items:  Array< {
      __typename: "UserMountain",
      createdAt: string,
      dateClimbed: string,
      id: string,
      mountainID: string,
      notes?: string | null,
      owner?: string | null,
      updatedAt: string,
      userID: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserMountainsByUserQueryVariables = {
  filter?: ModelUserMountainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  userID: string,
};

export type UserMountainsByUserQuery = {
  userMountainsByUser?:  {
    __typename: "ModelUserMountainConnection",
    items:  Array< {
      __typename: "UserMountain",
      createdAt: string,
      dateClimbed: string,
      id: string,
      mountainID: string,
      notes?: string | null,
      owner?: string | null,
      updatedAt: string,
      userID: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserMountainsByUserByDateQueryVariables = {
  dateClimbed?: ModelStringKeyConditionInput | null,
  filter?: ModelUserMountainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  userID: string,
};

export type UserMountainsByUserByDateQuery = {
  userMountainsByUserByDate?:  {
    __typename: "ModelUserMountainConnection",
    items:  Array< {
      __typename: "UserMountain",
      createdAt: string,
      dateClimbed: string,
      id: string,
      mountainID: string,
      notes?: string | null,
      owner?: string | null,
      updatedAt: string,
      userID: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserMountainsByUserByMountainQueryVariables = {
  filter?: ModelUserMountainFilterInput | null,
  limit?: number | null,
  mountainID?: ModelIDKeyConditionInput | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  userID: string,
};

export type UserMountainsByUserByMountainQuery = {
  userMountainsByUserByMountain?:  {
    __typename: "ModelUserMountainConnection",
    items:  Array< {
      __typename: "UserMountain",
      createdAt: string,
      dateClimbed: string,
      id: string,
      mountainID: string,
      notes?: string | null,
      owner?: string | null,
      updatedAt: string,
      userID: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserPatchesByPatchQueryVariables = {
  filter?: ModelUserPatchFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  patchID: string,
  sortDirection?: ModelSortDirection | null,
};

export type UserPatchesByPatchQuery = {
  userPatchesByPatch?:  {
    __typename: "ModelUserPatchConnection",
    items:  Array< {
      __typename: "UserPatch",
      createdAt: string,
      dateCompleted?: string | null,
      difficulty?: number | null,
      id: string,
      imageUrl?: string | null,
      inProgress?: boolean | null,
      notes?: string | null,
      patchID: string,
      updatedAt: string,
      userID: string,
      wishlisted?: boolean | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserPatchesByUserByPatchQueryVariables = {
  filter?: ModelUserPatchFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  patchID?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  userID: string,
};

export type UserPatchesByUserByPatchQuery = {
  userPatchesByUserByPatch?:  {
    __typename: "ModelUserPatchConnection",
    items:  Array< {
      __typename: "UserPatch",
      createdAt: string,
      dateCompleted?: string | null,
      difficulty?: number | null,
      id: string,
      imageUrl?: string | null,
      inProgress?: boolean | null,
      notes?: string | null,
      patchID: string,
      updatedAt: string,
      userID: string,
      wishlisted?: boolean | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserTrailsByTrailQueryVariables = {
  filter?: ModelUserTrailFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  trailID: string,
};

export type UserTrailsByTrailQuery = {
  userTrailsByTrail?:  {
    __typename: "ModelUserTrailConnection",
    items:  Array< {
      __typename: "UserTrail",
      createdAt: string,
      dateCompleted?: string | null,
      milesRemaining?: number | null,
      notes?: string | null,
      trailID: string,
      updatedAt: string,
      userID: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserTrailsByUserQueryVariables = {
  filter?: ModelUserTrailFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  userID: string,
};

export type UserTrailsByUserQuery = {
  userTrailsByUser?:  {
    __typename: "ModelUserTrailConnection",
    items:  Array< {
      __typename: "UserTrail",
      createdAt: string,
      dateCompleted?: string | null,
      milesRemaining?: number | null,
      notes?: string | null,
      trailID: string,
      updatedAt: string,
      userID: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserTrailsByUserByDateCompletedQueryVariables = {
  dateCompleted?: ModelStringKeyConditionInput | null,
  filter?: ModelUserTrailFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  userID: string,
};

export type UserTrailsByUserByDateCompletedQuery = {
  userTrailsByUserByDateCompleted?:  {
    __typename: "ModelUserTrailConnection",
    items:  Array< {
      __typename: "UserTrail",
      createdAt: string,
      dateCompleted?: string | null,
      milesRemaining?: number | null,
      notes?: string | null,
      trailID: string,
      updatedAt: string,
      userID: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateAdminNotificationMutationVariables = {
  condition?: ModelAdminNotificationConditionInput | null,
  input: CreateAdminNotificationInput,
};

export type CreateAdminNotificationMutation = {
  createAdminNotification?:  {
    __typename: "AdminNotification",
    body?: string | null,
    createdAt: string,
    id: string,
    link?: string | null,
    read?: boolean | null,
    title: string,
    type: NotificationType,
    updatedAt: string,
  } | null,
};

export type CreateAppSettingMutationVariables = {
  condition?: ModelAppSettingConditionInput | null,
  input: CreateAppSettingInput,
};

export type CreateAppSettingMutation = {
  createAppSetting?:  {
    __typename: "AppSetting",
    createdAt: string,
    key: string,
    updatedAt: string,
    value?: string | null,
  } | null,
};

export type CreateMountainMutationVariables = {
  condition?: ModelMountainConditionInput | null,
  input: CreateMountainInput,
};

export type CreateMountainMutation = {
  createMountain?:  {
    __typename: "Mountain",
    alltrailsUrl?: string | null,
    city?: string | null,
    createdAt: string,
    elevation?: number | null,
    id: string,
    latitude?: number | null,
    longitude?: number | null,
    name: string,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    peakbaggerUrl?: string | null,
    state?: string | null,
    updatedAt: string,
    userMountains?:  {
      __typename: "ModelUserMountainConnection",
      nextToken?: string | null,
    } | null,
    weatherUrl?: string | null,
  } | null,
};

export type CreatePatchMutationVariables = {
  condition?: ModelPatchConditionInput | null,
  input: CreatePatchInput,
};

export type CreatePatchMutation = {
  createPatch?:  {
    __typename: "Patch",
    alltrailsUrl?: string | null,
    completionRule?: string | null,
    createdAt: string,
    description?: string | null,
    difficulty?: Difficulty | null,
    facebookUrl?: string | null,
    formUrl?: string | null,
    hasPeaks?: boolean | null,
    hasTrails?: boolean | null,
    howToGet?: string | null,
    id: string,
    imageUrl?: string | null,
    isPurchasable?: boolean | null,
    latitude?: number | null,
    longitude?: number | null,
    name: string,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    popularity?: number | null,
    purchaseUrl?: string | null,
    regions?: Array< string | null > | null,
    seasons?: Array< Season | null > | null,
    status?: string | null,
    updatedAt: string,
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    websiteUrl?: string | null,
  } | null,
};

export type CreatePatchMountainMutationVariables = {
  condition?: ModelPatchMountainConditionInput | null,
  input: CreatePatchMountainInput,
};

export type CreatePatchMountainMutation = {
  createPatchMountain?:  {
    __typename: "PatchMountain",
    createdAt: string,
    delisted?: boolean | null,
    id: string,
    mountain?:  {
      __typename: "Mountain",
      alltrailsUrl?: string | null,
      city?: string | null,
      createdAt: string,
      elevation?: number | null,
      id: string,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      peakbaggerUrl?: string | null,
      state?: string | null,
      updatedAt: string,
      weatherUrl?: string | null,
    } | null,
    mountainPatchMountainsId?: string | null,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchPatchMountainsId?: string | null,
    updatedAt: string,
  } | null,
};

export type CreatePatchOwnerMutationVariables = {
  condition?: ModelPatchOwnerConditionInput | null,
  input: CreatePatchOwnerInput,
};

export type CreatePatchOwnerMutation = {
  createPatchOwner?:  {
    __typename: "PatchOwner",
    createdAt: string,
    id: string,
    patchID: string,
    patchName: string,
    updatedAt: string,
    userEmail: string,
    userID: string,
  } | null,
};

export type CreatePatchOwnerRequestMutationVariables = {
  condition?: ModelPatchOwnerRequestConditionInput | null,
  input: CreatePatchOwnerRequestInput,
};

export type CreatePatchOwnerRequestMutation = {
  createPatchOwnerRequest?:  {
    __typename: "PatchOwnerRequest",
    createdAt: string,
    id: string,
    message?: string | null,
    patchID: string,
    patchName: string,
    status: OwnershipRequestStatus,
    updatedAt: string,
    userEmail: string,
    userID: string,
  } | null,
};

export type CreatePatchPurchaseMutationVariables = {
  condition?: ModelPatchPurchaseConditionInput | null,
  input: CreatePatchPurchaseInput,
};

export type CreatePatchPurchaseMutation = {
  createPatchPurchase?:  {
    __typename: "PatchPurchase",
    amount?: number | null,
    createdAt: string,
    currency?: string | null,
    id: string,
    patchId: string,
    stripeReceiptUrl?: string | null,
    stripeSessionId: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type CreatePatchRequestMutationVariables = {
  condition?: ModelPatchRequestConditionInput | null,
  input: CreatePatchRequestInput,
};

export type CreatePatchRequestMutation = {
  createPatchRequest?:  {
    __typename: "PatchRequest",
    createdAt: string,
    description: string,
    email: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type CreatePatchTrailMutationVariables = {
  condition?: ModelPatchTrailConditionInput | null,
  input: CreatePatchTrailInput,
};

export type CreatePatchTrailMutation = {
  createPatchTrail?:  {
    __typename: "PatchTrail",
    createdAt: string,
    id: string,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchPatchTrailsId?: string | null,
    requiredMiles?: number | null,
    trail?:  {
      __typename: "Trail",
      alltrailsUrl?: string | null,
      createdAt: string,
      description?: string | null,
      id: string,
      lengthMiles: number,
      name: string,
      trailLinkUrl?: string | null,
      updatedAt: string,
    } | null,
    trailPatchTrailsId?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateTrailMutationVariables = {
  condition?: ModelTrailConditionInput | null,
  input: CreateTrailInput,
};

export type CreateTrailMutation = {
  createTrail?:  {
    __typename: "Trail",
    alltrailsUrl?: string | null,
    createdAt: string,
    description?: string | null,
    id: string,
    lengthMiles: number,
    name: string,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    trailLinkUrl?: string | null,
    updatedAt: string,
    userTrails?:  {
      __typename: "ModelUserTrailConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type CreateUserMountainMutationVariables = {
  condition?: ModelUserMountainConditionInput | null,
  input: CreateUserMountainInput,
};

export type CreateUserMountainMutation = {
  createUserMountain?:  {
    __typename: "UserMountain",
    createdAt: string,
    dateClimbed: string,
    id: string,
    mountain?:  {
      __typename: "Mountain",
      alltrailsUrl?: string | null,
      city?: string | null,
      createdAt: string,
      elevation?: number | null,
      id: string,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      peakbaggerUrl?: string | null,
      state?: string | null,
      updatedAt: string,
      weatherUrl?: string | null,
    } | null,
    mountainID: string,
    notes?: string | null,
    owner?: string | null,
    updatedAt: string,
    userID: string,
  } | null,
};

export type CreateUserPatchMutationVariables = {
  condition?: ModelUserPatchConditionInput | null,
  input: CreateUserPatchInput,
};

export type CreateUserPatchMutation = {
  createUserPatch?:  {
    __typename: "UserPatch",
    createdAt: string,
    dateCompleted?: string | null,
    difficulty?: number | null,
    id: string,
    imageUrl?: string | null,
    inProgress?: boolean | null,
    notes?: string | null,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchID: string,
    updatedAt: string,
    userID: string,
    wishlisted?: boolean | null,
  } | null,
};

export type CreateUserTrailMutationVariables = {
  condition?: ModelUserTrailConditionInput | null,
  input: CreateUserTrailInput,
};

export type CreateUserTrailMutation = {
  createUserTrail?:  {
    __typename: "UserTrail",
    createdAt: string,
    dateCompleted?: string | null,
    milesRemaining?: number | null,
    notes?: string | null,
    trail?:  {
      __typename: "Trail",
      alltrailsUrl?: string | null,
      createdAt: string,
      description?: string | null,
      id: string,
      lengthMiles: number,
      name: string,
      trailLinkUrl?: string | null,
      updatedAt: string,
    } | null,
    trailID: string,
    updatedAt: string,
    userID: string,
  } | null,
};

export type DeleteAdminNotificationMutationVariables = {
  condition?: ModelAdminNotificationConditionInput | null,
  input: DeleteAdminNotificationInput,
};

export type DeleteAdminNotificationMutation = {
  deleteAdminNotification?:  {
    __typename: "AdminNotification",
    body?: string | null,
    createdAt: string,
    id: string,
    link?: string | null,
    read?: boolean | null,
    title: string,
    type: NotificationType,
    updatedAt: string,
  } | null,
};

export type DeleteAppSettingMutationVariables = {
  condition?: ModelAppSettingConditionInput | null,
  input: DeleteAppSettingInput,
};

export type DeleteAppSettingMutation = {
  deleteAppSetting?:  {
    __typename: "AppSetting",
    createdAt: string,
    key: string,
    updatedAt: string,
    value?: string | null,
  } | null,
};

export type DeleteMountainMutationVariables = {
  condition?: ModelMountainConditionInput | null,
  input: DeleteMountainInput,
};

export type DeleteMountainMutation = {
  deleteMountain?:  {
    __typename: "Mountain",
    alltrailsUrl?: string | null,
    city?: string | null,
    createdAt: string,
    elevation?: number | null,
    id: string,
    latitude?: number | null,
    longitude?: number | null,
    name: string,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    peakbaggerUrl?: string | null,
    state?: string | null,
    updatedAt: string,
    userMountains?:  {
      __typename: "ModelUserMountainConnection",
      nextToken?: string | null,
    } | null,
    weatherUrl?: string | null,
  } | null,
};

export type DeletePatchMutationVariables = {
  condition?: ModelPatchConditionInput | null,
  input: DeletePatchInput,
};

export type DeletePatchMutation = {
  deletePatch?:  {
    __typename: "Patch",
    alltrailsUrl?: string | null,
    completionRule?: string | null,
    createdAt: string,
    description?: string | null,
    difficulty?: Difficulty | null,
    facebookUrl?: string | null,
    formUrl?: string | null,
    hasPeaks?: boolean | null,
    hasTrails?: boolean | null,
    howToGet?: string | null,
    id: string,
    imageUrl?: string | null,
    isPurchasable?: boolean | null,
    latitude?: number | null,
    longitude?: number | null,
    name: string,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    popularity?: number | null,
    purchaseUrl?: string | null,
    regions?: Array< string | null > | null,
    seasons?: Array< Season | null > | null,
    status?: string | null,
    updatedAt: string,
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    websiteUrl?: string | null,
  } | null,
};

export type DeletePatchMountainMutationVariables = {
  condition?: ModelPatchMountainConditionInput | null,
  input: DeletePatchMountainInput,
};

export type DeletePatchMountainMutation = {
  deletePatchMountain?:  {
    __typename: "PatchMountain",
    createdAt: string,
    delisted?: boolean | null,
    id: string,
    mountain?:  {
      __typename: "Mountain",
      alltrailsUrl?: string | null,
      city?: string | null,
      createdAt: string,
      elevation?: number | null,
      id: string,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      peakbaggerUrl?: string | null,
      state?: string | null,
      updatedAt: string,
      weatherUrl?: string | null,
    } | null,
    mountainPatchMountainsId?: string | null,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchPatchMountainsId?: string | null,
    updatedAt: string,
  } | null,
};

export type DeletePatchOwnerMutationVariables = {
  condition?: ModelPatchOwnerConditionInput | null,
  input: DeletePatchOwnerInput,
};

export type DeletePatchOwnerMutation = {
  deletePatchOwner?:  {
    __typename: "PatchOwner",
    createdAt: string,
    id: string,
    patchID: string,
    patchName: string,
    updatedAt: string,
    userEmail: string,
    userID: string,
  } | null,
};

export type DeletePatchOwnerRequestMutationVariables = {
  condition?: ModelPatchOwnerRequestConditionInput | null,
  input: DeletePatchOwnerRequestInput,
};

export type DeletePatchOwnerRequestMutation = {
  deletePatchOwnerRequest?:  {
    __typename: "PatchOwnerRequest",
    createdAt: string,
    id: string,
    message?: string | null,
    patchID: string,
    patchName: string,
    status: OwnershipRequestStatus,
    updatedAt: string,
    userEmail: string,
    userID: string,
  } | null,
};

export type DeletePatchPurchaseMutationVariables = {
  condition?: ModelPatchPurchaseConditionInput | null,
  input: DeletePatchPurchaseInput,
};

export type DeletePatchPurchaseMutation = {
  deletePatchPurchase?:  {
    __typename: "PatchPurchase",
    amount?: number | null,
    createdAt: string,
    currency?: string | null,
    id: string,
    patchId: string,
    stripeReceiptUrl?: string | null,
    stripeSessionId: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type DeletePatchRequestMutationVariables = {
  condition?: ModelPatchRequestConditionInput | null,
  input: DeletePatchRequestInput,
};

export type DeletePatchRequestMutation = {
  deletePatchRequest?:  {
    __typename: "PatchRequest",
    createdAt: string,
    description: string,
    email: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type DeletePatchTrailMutationVariables = {
  condition?: ModelPatchTrailConditionInput | null,
  input: DeletePatchTrailInput,
};

export type DeletePatchTrailMutation = {
  deletePatchTrail?:  {
    __typename: "PatchTrail",
    createdAt: string,
    id: string,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchPatchTrailsId?: string | null,
    requiredMiles?: number | null,
    trail?:  {
      __typename: "Trail",
      alltrailsUrl?: string | null,
      createdAt: string,
      description?: string | null,
      id: string,
      lengthMiles: number,
      name: string,
      trailLinkUrl?: string | null,
      updatedAt: string,
    } | null,
    trailPatchTrailsId?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteTrailMutationVariables = {
  condition?: ModelTrailConditionInput | null,
  input: DeleteTrailInput,
};

export type DeleteTrailMutation = {
  deleteTrail?:  {
    __typename: "Trail",
    alltrailsUrl?: string | null,
    createdAt: string,
    description?: string | null,
    id: string,
    lengthMiles: number,
    name: string,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    trailLinkUrl?: string | null,
    updatedAt: string,
    userTrails?:  {
      __typename: "ModelUserTrailConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type DeleteUserMountainMutationVariables = {
  condition?: ModelUserMountainConditionInput | null,
  input: DeleteUserMountainInput,
};

export type DeleteUserMountainMutation = {
  deleteUserMountain?:  {
    __typename: "UserMountain",
    createdAt: string,
    dateClimbed: string,
    id: string,
    mountain?:  {
      __typename: "Mountain",
      alltrailsUrl?: string | null,
      city?: string | null,
      createdAt: string,
      elevation?: number | null,
      id: string,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      peakbaggerUrl?: string | null,
      state?: string | null,
      updatedAt: string,
      weatherUrl?: string | null,
    } | null,
    mountainID: string,
    notes?: string | null,
    owner?: string | null,
    updatedAt: string,
    userID: string,
  } | null,
};

export type DeleteUserPatchMutationVariables = {
  condition?: ModelUserPatchConditionInput | null,
  input: DeleteUserPatchInput,
};

export type DeleteUserPatchMutation = {
  deleteUserPatch?:  {
    __typename: "UserPatch",
    createdAt: string,
    dateCompleted?: string | null,
    difficulty?: number | null,
    id: string,
    imageUrl?: string | null,
    inProgress?: boolean | null,
    notes?: string | null,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchID: string,
    updatedAt: string,
    userID: string,
    wishlisted?: boolean | null,
  } | null,
};

export type DeleteUserTrailMutationVariables = {
  condition?: ModelUserTrailConditionInput | null,
  input: DeleteUserTrailInput,
};

export type DeleteUserTrailMutation = {
  deleteUserTrail?:  {
    __typename: "UserTrail",
    createdAt: string,
    dateCompleted?: string | null,
    milesRemaining?: number | null,
    notes?: string | null,
    trail?:  {
      __typename: "Trail",
      alltrailsUrl?: string | null,
      createdAt: string,
      description?: string | null,
      id: string,
      lengthMiles: number,
      name: string,
      trailLinkUrl?: string | null,
      updatedAt: string,
    } | null,
    trailID: string,
    updatedAt: string,
    userID: string,
  } | null,
};

export type UpdateAdminNotificationMutationVariables = {
  condition?: ModelAdminNotificationConditionInput | null,
  input: UpdateAdminNotificationInput,
};

export type UpdateAdminNotificationMutation = {
  updateAdminNotification?:  {
    __typename: "AdminNotification",
    body?: string | null,
    createdAt: string,
    id: string,
    link?: string | null,
    read?: boolean | null,
    title: string,
    type: NotificationType,
    updatedAt: string,
  } | null,
};

export type UpdateAppSettingMutationVariables = {
  condition?: ModelAppSettingConditionInput | null,
  input: UpdateAppSettingInput,
};

export type UpdateAppSettingMutation = {
  updateAppSetting?:  {
    __typename: "AppSetting",
    createdAt: string,
    key: string,
    updatedAt: string,
    value?: string | null,
  } | null,
};

export type UpdateMountainMutationVariables = {
  condition?: ModelMountainConditionInput | null,
  input: UpdateMountainInput,
};

export type UpdateMountainMutation = {
  updateMountain?:  {
    __typename: "Mountain",
    alltrailsUrl?: string | null,
    city?: string | null,
    createdAt: string,
    elevation?: number | null,
    id: string,
    latitude?: number | null,
    longitude?: number | null,
    name: string,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    peakbaggerUrl?: string | null,
    state?: string | null,
    updatedAt: string,
    userMountains?:  {
      __typename: "ModelUserMountainConnection",
      nextToken?: string | null,
    } | null,
    weatherUrl?: string | null,
  } | null,
};

export type UpdatePatchMutationVariables = {
  condition?: ModelPatchConditionInput | null,
  input: UpdatePatchInput,
};

export type UpdatePatchMutation = {
  updatePatch?:  {
    __typename: "Patch",
    alltrailsUrl?: string | null,
    completionRule?: string | null,
    createdAt: string,
    description?: string | null,
    difficulty?: Difficulty | null,
    facebookUrl?: string | null,
    formUrl?: string | null,
    hasPeaks?: boolean | null,
    hasTrails?: boolean | null,
    howToGet?: string | null,
    id: string,
    imageUrl?: string | null,
    isPurchasable?: boolean | null,
    latitude?: number | null,
    longitude?: number | null,
    name: string,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    popularity?: number | null,
    purchaseUrl?: string | null,
    regions?: Array< string | null > | null,
    seasons?: Array< Season | null > | null,
    status?: string | null,
    updatedAt: string,
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    websiteUrl?: string | null,
  } | null,
};

export type UpdatePatchMountainMutationVariables = {
  condition?: ModelPatchMountainConditionInput | null,
  input: UpdatePatchMountainInput,
};

export type UpdatePatchMountainMutation = {
  updatePatchMountain?:  {
    __typename: "PatchMountain",
    createdAt: string,
    delisted?: boolean | null,
    id: string,
    mountain?:  {
      __typename: "Mountain",
      alltrailsUrl?: string | null,
      city?: string | null,
      createdAt: string,
      elevation?: number | null,
      id: string,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      peakbaggerUrl?: string | null,
      state?: string | null,
      updatedAt: string,
      weatherUrl?: string | null,
    } | null,
    mountainPatchMountainsId?: string | null,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchPatchMountainsId?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdatePatchOwnerMutationVariables = {
  condition?: ModelPatchOwnerConditionInput | null,
  input: UpdatePatchOwnerInput,
};

export type UpdatePatchOwnerMutation = {
  updatePatchOwner?:  {
    __typename: "PatchOwner",
    createdAt: string,
    id: string,
    patchID: string,
    patchName: string,
    updatedAt: string,
    userEmail: string,
    userID: string,
  } | null,
};

export type UpdatePatchOwnerRequestMutationVariables = {
  condition?: ModelPatchOwnerRequestConditionInput | null,
  input: UpdatePatchOwnerRequestInput,
};

export type UpdatePatchOwnerRequestMutation = {
  updatePatchOwnerRequest?:  {
    __typename: "PatchOwnerRequest",
    createdAt: string,
    id: string,
    message?: string | null,
    patchID: string,
    patchName: string,
    status: OwnershipRequestStatus,
    updatedAt: string,
    userEmail: string,
    userID: string,
  } | null,
};

export type UpdatePatchPurchaseMutationVariables = {
  condition?: ModelPatchPurchaseConditionInput | null,
  input: UpdatePatchPurchaseInput,
};

export type UpdatePatchPurchaseMutation = {
  updatePatchPurchase?:  {
    __typename: "PatchPurchase",
    amount?: number | null,
    createdAt: string,
    currency?: string | null,
    id: string,
    patchId: string,
    stripeReceiptUrl?: string | null,
    stripeSessionId: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type UpdatePatchRequestMutationVariables = {
  condition?: ModelPatchRequestConditionInput | null,
  input: UpdatePatchRequestInput,
};

export type UpdatePatchRequestMutation = {
  updatePatchRequest?:  {
    __typename: "PatchRequest",
    createdAt: string,
    description: string,
    email: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type UpdatePatchTrailMutationVariables = {
  condition?: ModelPatchTrailConditionInput | null,
  input: UpdatePatchTrailInput,
};

export type UpdatePatchTrailMutation = {
  updatePatchTrail?:  {
    __typename: "PatchTrail",
    createdAt: string,
    id: string,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchPatchTrailsId?: string | null,
    requiredMiles?: number | null,
    trail?:  {
      __typename: "Trail",
      alltrailsUrl?: string | null,
      createdAt: string,
      description?: string | null,
      id: string,
      lengthMiles: number,
      name: string,
      trailLinkUrl?: string | null,
      updatedAt: string,
    } | null,
    trailPatchTrailsId?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateTrailMutationVariables = {
  condition?: ModelTrailConditionInput | null,
  input: UpdateTrailInput,
};

export type UpdateTrailMutation = {
  updateTrail?:  {
    __typename: "Trail",
    alltrailsUrl?: string | null,
    createdAt: string,
    description?: string | null,
    id: string,
    lengthMiles: number,
    name: string,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    trailLinkUrl?: string | null,
    updatedAt: string,
    userTrails?:  {
      __typename: "ModelUserTrailConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type UpdateUserMountainMutationVariables = {
  condition?: ModelUserMountainConditionInput | null,
  input: UpdateUserMountainInput,
};

export type UpdateUserMountainMutation = {
  updateUserMountain?:  {
    __typename: "UserMountain",
    createdAt: string,
    dateClimbed: string,
    id: string,
    mountain?:  {
      __typename: "Mountain",
      alltrailsUrl?: string | null,
      city?: string | null,
      createdAt: string,
      elevation?: number | null,
      id: string,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      peakbaggerUrl?: string | null,
      state?: string | null,
      updatedAt: string,
      weatherUrl?: string | null,
    } | null,
    mountainID: string,
    notes?: string | null,
    owner?: string | null,
    updatedAt: string,
    userID: string,
  } | null,
};

export type UpdateUserPatchMutationVariables = {
  condition?: ModelUserPatchConditionInput | null,
  input: UpdateUserPatchInput,
};

export type UpdateUserPatchMutation = {
  updateUserPatch?:  {
    __typename: "UserPatch",
    createdAt: string,
    dateCompleted?: string | null,
    difficulty?: number | null,
    id: string,
    imageUrl?: string | null,
    inProgress?: boolean | null,
    notes?: string | null,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchID: string,
    updatedAt: string,
    userID: string,
    wishlisted?: boolean | null,
  } | null,
};

export type UpdateUserTrailMutationVariables = {
  condition?: ModelUserTrailConditionInput | null,
  input: UpdateUserTrailInput,
};

export type UpdateUserTrailMutation = {
  updateUserTrail?:  {
    __typename: "UserTrail",
    createdAt: string,
    dateCompleted?: string | null,
    milesRemaining?: number | null,
    notes?: string | null,
    trail?:  {
      __typename: "Trail",
      alltrailsUrl?: string | null,
      createdAt: string,
      description?: string | null,
      id: string,
      lengthMiles: number,
      name: string,
      trailLinkUrl?: string | null,
      updatedAt: string,
    } | null,
    trailID: string,
    updatedAt: string,
    userID: string,
  } | null,
};

export type OnCreateAdminNotificationSubscriptionVariables = {
  filter?: ModelSubscriptionAdminNotificationFilterInput | null,
};

export type OnCreateAdminNotificationSubscription = {
  onCreateAdminNotification?:  {
    __typename: "AdminNotification",
    body?: string | null,
    createdAt: string,
    id: string,
    link?: string | null,
    read?: boolean | null,
    title: string,
    type: NotificationType,
    updatedAt: string,
  } | null,
};

export type OnCreateAppSettingSubscriptionVariables = {
  filter?: ModelSubscriptionAppSettingFilterInput | null,
};

export type OnCreateAppSettingSubscription = {
  onCreateAppSetting?:  {
    __typename: "AppSetting",
    createdAt: string,
    key: string,
    updatedAt: string,
    value?: string | null,
  } | null,
};

export type OnCreateMountainSubscriptionVariables = {
  filter?: ModelSubscriptionMountainFilterInput | null,
};

export type OnCreateMountainSubscription = {
  onCreateMountain?:  {
    __typename: "Mountain",
    alltrailsUrl?: string | null,
    city?: string | null,
    createdAt: string,
    elevation?: number | null,
    id: string,
    latitude?: number | null,
    longitude?: number | null,
    name: string,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    peakbaggerUrl?: string | null,
    state?: string | null,
    updatedAt: string,
    userMountains?:  {
      __typename: "ModelUserMountainConnection",
      nextToken?: string | null,
    } | null,
    weatherUrl?: string | null,
  } | null,
};

export type OnCreatePatchSubscriptionVariables = {
  filter?: ModelSubscriptionPatchFilterInput | null,
};

export type OnCreatePatchSubscription = {
  onCreatePatch?:  {
    __typename: "Patch",
    alltrailsUrl?: string | null,
    completionRule?: string | null,
    createdAt: string,
    description?: string | null,
    difficulty?: Difficulty | null,
    facebookUrl?: string | null,
    formUrl?: string | null,
    hasPeaks?: boolean | null,
    hasTrails?: boolean | null,
    howToGet?: string | null,
    id: string,
    imageUrl?: string | null,
    isPurchasable?: boolean | null,
    latitude?: number | null,
    longitude?: number | null,
    name: string,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    popularity?: number | null,
    purchaseUrl?: string | null,
    regions?: Array< string | null > | null,
    seasons?: Array< Season | null > | null,
    status?: string | null,
    updatedAt: string,
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    websiteUrl?: string | null,
  } | null,
};

export type OnCreatePatchMountainSubscriptionVariables = {
  filter?: ModelSubscriptionPatchMountainFilterInput | null,
};

export type OnCreatePatchMountainSubscription = {
  onCreatePatchMountain?:  {
    __typename: "PatchMountain",
    createdAt: string,
    delisted?: boolean | null,
    id: string,
    mountain?:  {
      __typename: "Mountain",
      alltrailsUrl?: string | null,
      city?: string | null,
      createdAt: string,
      elevation?: number | null,
      id: string,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      peakbaggerUrl?: string | null,
      state?: string | null,
      updatedAt: string,
      weatherUrl?: string | null,
    } | null,
    mountainPatchMountainsId?: string | null,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchPatchMountainsId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreatePatchOwnerSubscriptionVariables = {
  filter?: ModelSubscriptionPatchOwnerFilterInput | null,
};

export type OnCreatePatchOwnerSubscription = {
  onCreatePatchOwner?:  {
    __typename: "PatchOwner",
    createdAt: string,
    id: string,
    patchID: string,
    patchName: string,
    updatedAt: string,
    userEmail: string,
    userID: string,
  } | null,
};

export type OnCreatePatchOwnerRequestSubscriptionVariables = {
  filter?: ModelSubscriptionPatchOwnerRequestFilterInput | null,
  userID?: string | null,
};

export type OnCreatePatchOwnerRequestSubscription = {
  onCreatePatchOwnerRequest?:  {
    __typename: "PatchOwnerRequest",
    createdAt: string,
    id: string,
    message?: string | null,
    patchID: string,
    patchName: string,
    status: OwnershipRequestStatus,
    updatedAt: string,
    userEmail: string,
    userID: string,
  } | null,
};

export type OnCreatePatchPurchaseSubscriptionVariables = {
  filter?: ModelSubscriptionPatchPurchaseFilterInput | null,
  userId?: string | null,
};

export type OnCreatePatchPurchaseSubscription = {
  onCreatePatchPurchase?:  {
    __typename: "PatchPurchase",
    amount?: number | null,
    createdAt: string,
    currency?: string | null,
    id: string,
    patchId: string,
    stripeReceiptUrl?: string | null,
    stripeSessionId: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnCreatePatchRequestSubscriptionVariables = {
  filter?: ModelSubscriptionPatchRequestFilterInput | null,
};

export type OnCreatePatchRequestSubscription = {
  onCreatePatchRequest?:  {
    __typename: "PatchRequest",
    createdAt: string,
    description: string,
    email: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type OnCreatePatchTrailSubscriptionVariables = {
  filter?: ModelSubscriptionPatchTrailFilterInput | null,
};

export type OnCreatePatchTrailSubscription = {
  onCreatePatchTrail?:  {
    __typename: "PatchTrail",
    createdAt: string,
    id: string,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchPatchTrailsId?: string | null,
    requiredMiles?: number | null,
    trail?:  {
      __typename: "Trail",
      alltrailsUrl?: string | null,
      createdAt: string,
      description?: string | null,
      id: string,
      lengthMiles: number,
      name: string,
      trailLinkUrl?: string | null,
      updatedAt: string,
    } | null,
    trailPatchTrailsId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateTrailSubscriptionVariables = {
  filter?: ModelSubscriptionTrailFilterInput | null,
};

export type OnCreateTrailSubscription = {
  onCreateTrail?:  {
    __typename: "Trail",
    alltrailsUrl?: string | null,
    createdAt: string,
    description?: string | null,
    id: string,
    lengthMiles: number,
    name: string,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    trailLinkUrl?: string | null,
    updatedAt: string,
    userTrails?:  {
      __typename: "ModelUserTrailConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnCreateUserMountainSubscriptionVariables = {
  filter?: ModelSubscriptionUserMountainFilterInput | null,
  owner?: string | null,
};

export type OnCreateUserMountainSubscription = {
  onCreateUserMountain?:  {
    __typename: "UserMountain",
    createdAt: string,
    dateClimbed: string,
    id: string,
    mountain?:  {
      __typename: "Mountain",
      alltrailsUrl?: string | null,
      city?: string | null,
      createdAt: string,
      elevation?: number | null,
      id: string,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      peakbaggerUrl?: string | null,
      state?: string | null,
      updatedAt: string,
      weatherUrl?: string | null,
    } | null,
    mountainID: string,
    notes?: string | null,
    owner?: string | null,
    updatedAt: string,
    userID: string,
  } | null,
};

export type OnCreateUserPatchSubscriptionVariables = {
  filter?: ModelSubscriptionUserPatchFilterInput | null,
  userID?: string | null,
};

export type OnCreateUserPatchSubscription = {
  onCreateUserPatch?:  {
    __typename: "UserPatch",
    createdAt: string,
    dateCompleted?: string | null,
    difficulty?: number | null,
    id: string,
    imageUrl?: string | null,
    inProgress?: boolean | null,
    notes?: string | null,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchID: string,
    updatedAt: string,
    userID: string,
    wishlisted?: boolean | null,
  } | null,
};

export type OnCreateUserTrailSubscriptionVariables = {
  filter?: ModelSubscriptionUserTrailFilterInput | null,
  userID?: string | null,
};

export type OnCreateUserTrailSubscription = {
  onCreateUserTrail?:  {
    __typename: "UserTrail",
    createdAt: string,
    dateCompleted?: string | null,
    milesRemaining?: number | null,
    notes?: string | null,
    trail?:  {
      __typename: "Trail",
      alltrailsUrl?: string | null,
      createdAt: string,
      description?: string | null,
      id: string,
      lengthMiles: number,
      name: string,
      trailLinkUrl?: string | null,
      updatedAt: string,
    } | null,
    trailID: string,
    updatedAt: string,
    userID: string,
  } | null,
};

export type OnDeleteAdminNotificationSubscriptionVariables = {
  filter?: ModelSubscriptionAdminNotificationFilterInput | null,
};

export type OnDeleteAdminNotificationSubscription = {
  onDeleteAdminNotification?:  {
    __typename: "AdminNotification",
    body?: string | null,
    createdAt: string,
    id: string,
    link?: string | null,
    read?: boolean | null,
    title: string,
    type: NotificationType,
    updatedAt: string,
  } | null,
};

export type OnDeleteAppSettingSubscriptionVariables = {
  filter?: ModelSubscriptionAppSettingFilterInput | null,
};

export type OnDeleteAppSettingSubscription = {
  onDeleteAppSetting?:  {
    __typename: "AppSetting",
    createdAt: string,
    key: string,
    updatedAt: string,
    value?: string | null,
  } | null,
};

export type OnDeleteMountainSubscriptionVariables = {
  filter?: ModelSubscriptionMountainFilterInput | null,
};

export type OnDeleteMountainSubscription = {
  onDeleteMountain?:  {
    __typename: "Mountain",
    alltrailsUrl?: string | null,
    city?: string | null,
    createdAt: string,
    elevation?: number | null,
    id: string,
    latitude?: number | null,
    longitude?: number | null,
    name: string,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    peakbaggerUrl?: string | null,
    state?: string | null,
    updatedAt: string,
    userMountains?:  {
      __typename: "ModelUserMountainConnection",
      nextToken?: string | null,
    } | null,
    weatherUrl?: string | null,
  } | null,
};

export type OnDeletePatchSubscriptionVariables = {
  filter?: ModelSubscriptionPatchFilterInput | null,
};

export type OnDeletePatchSubscription = {
  onDeletePatch?:  {
    __typename: "Patch",
    alltrailsUrl?: string | null,
    completionRule?: string | null,
    createdAt: string,
    description?: string | null,
    difficulty?: Difficulty | null,
    facebookUrl?: string | null,
    formUrl?: string | null,
    hasPeaks?: boolean | null,
    hasTrails?: boolean | null,
    howToGet?: string | null,
    id: string,
    imageUrl?: string | null,
    isPurchasable?: boolean | null,
    latitude?: number | null,
    longitude?: number | null,
    name: string,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    popularity?: number | null,
    purchaseUrl?: string | null,
    regions?: Array< string | null > | null,
    seasons?: Array< Season | null > | null,
    status?: string | null,
    updatedAt: string,
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    websiteUrl?: string | null,
  } | null,
};

export type OnDeletePatchMountainSubscriptionVariables = {
  filter?: ModelSubscriptionPatchMountainFilterInput | null,
};

export type OnDeletePatchMountainSubscription = {
  onDeletePatchMountain?:  {
    __typename: "PatchMountain",
    createdAt: string,
    delisted?: boolean | null,
    id: string,
    mountain?:  {
      __typename: "Mountain",
      alltrailsUrl?: string | null,
      city?: string | null,
      createdAt: string,
      elevation?: number | null,
      id: string,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      peakbaggerUrl?: string | null,
      state?: string | null,
      updatedAt: string,
      weatherUrl?: string | null,
    } | null,
    mountainPatchMountainsId?: string | null,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchPatchMountainsId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeletePatchOwnerSubscriptionVariables = {
  filter?: ModelSubscriptionPatchOwnerFilterInput | null,
};

export type OnDeletePatchOwnerSubscription = {
  onDeletePatchOwner?:  {
    __typename: "PatchOwner",
    createdAt: string,
    id: string,
    patchID: string,
    patchName: string,
    updatedAt: string,
    userEmail: string,
    userID: string,
  } | null,
};

export type OnDeletePatchOwnerRequestSubscriptionVariables = {
  filter?: ModelSubscriptionPatchOwnerRequestFilterInput | null,
  userID?: string | null,
};

export type OnDeletePatchOwnerRequestSubscription = {
  onDeletePatchOwnerRequest?:  {
    __typename: "PatchOwnerRequest",
    createdAt: string,
    id: string,
    message?: string | null,
    patchID: string,
    patchName: string,
    status: OwnershipRequestStatus,
    updatedAt: string,
    userEmail: string,
    userID: string,
  } | null,
};

export type OnDeletePatchPurchaseSubscriptionVariables = {
  filter?: ModelSubscriptionPatchPurchaseFilterInput | null,
  userId?: string | null,
};

export type OnDeletePatchPurchaseSubscription = {
  onDeletePatchPurchase?:  {
    __typename: "PatchPurchase",
    amount?: number | null,
    createdAt: string,
    currency?: string | null,
    id: string,
    patchId: string,
    stripeReceiptUrl?: string | null,
    stripeSessionId: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnDeletePatchRequestSubscriptionVariables = {
  filter?: ModelSubscriptionPatchRequestFilterInput | null,
};

export type OnDeletePatchRequestSubscription = {
  onDeletePatchRequest?:  {
    __typename: "PatchRequest",
    createdAt: string,
    description: string,
    email: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePatchTrailSubscriptionVariables = {
  filter?: ModelSubscriptionPatchTrailFilterInput | null,
};

export type OnDeletePatchTrailSubscription = {
  onDeletePatchTrail?:  {
    __typename: "PatchTrail",
    createdAt: string,
    id: string,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchPatchTrailsId?: string | null,
    requiredMiles?: number | null,
    trail?:  {
      __typename: "Trail",
      alltrailsUrl?: string | null,
      createdAt: string,
      description?: string | null,
      id: string,
      lengthMiles: number,
      name: string,
      trailLinkUrl?: string | null,
      updatedAt: string,
    } | null,
    trailPatchTrailsId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteTrailSubscriptionVariables = {
  filter?: ModelSubscriptionTrailFilterInput | null,
};

export type OnDeleteTrailSubscription = {
  onDeleteTrail?:  {
    __typename: "Trail",
    alltrailsUrl?: string | null,
    createdAt: string,
    description?: string | null,
    id: string,
    lengthMiles: number,
    name: string,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    trailLinkUrl?: string | null,
    updatedAt: string,
    userTrails?:  {
      __typename: "ModelUserTrailConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnDeleteUserMountainSubscriptionVariables = {
  filter?: ModelSubscriptionUserMountainFilterInput | null,
  owner?: string | null,
};

export type OnDeleteUserMountainSubscription = {
  onDeleteUserMountain?:  {
    __typename: "UserMountain",
    createdAt: string,
    dateClimbed: string,
    id: string,
    mountain?:  {
      __typename: "Mountain",
      alltrailsUrl?: string | null,
      city?: string | null,
      createdAt: string,
      elevation?: number | null,
      id: string,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      peakbaggerUrl?: string | null,
      state?: string | null,
      updatedAt: string,
      weatherUrl?: string | null,
    } | null,
    mountainID: string,
    notes?: string | null,
    owner?: string | null,
    updatedAt: string,
    userID: string,
  } | null,
};

export type OnDeleteUserPatchSubscriptionVariables = {
  filter?: ModelSubscriptionUserPatchFilterInput | null,
  userID?: string | null,
};

export type OnDeleteUserPatchSubscription = {
  onDeleteUserPatch?:  {
    __typename: "UserPatch",
    createdAt: string,
    dateCompleted?: string | null,
    difficulty?: number | null,
    id: string,
    imageUrl?: string | null,
    inProgress?: boolean | null,
    notes?: string | null,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchID: string,
    updatedAt: string,
    userID: string,
    wishlisted?: boolean | null,
  } | null,
};

export type OnDeleteUserTrailSubscriptionVariables = {
  filter?: ModelSubscriptionUserTrailFilterInput | null,
  userID?: string | null,
};

export type OnDeleteUserTrailSubscription = {
  onDeleteUserTrail?:  {
    __typename: "UserTrail",
    createdAt: string,
    dateCompleted?: string | null,
    milesRemaining?: number | null,
    notes?: string | null,
    trail?:  {
      __typename: "Trail",
      alltrailsUrl?: string | null,
      createdAt: string,
      description?: string | null,
      id: string,
      lengthMiles: number,
      name: string,
      trailLinkUrl?: string | null,
      updatedAt: string,
    } | null,
    trailID: string,
    updatedAt: string,
    userID: string,
  } | null,
};

export type OnUpdateAdminNotificationSubscriptionVariables = {
  filter?: ModelSubscriptionAdminNotificationFilterInput | null,
};

export type OnUpdateAdminNotificationSubscription = {
  onUpdateAdminNotification?:  {
    __typename: "AdminNotification",
    body?: string | null,
    createdAt: string,
    id: string,
    link?: string | null,
    read?: boolean | null,
    title: string,
    type: NotificationType,
    updatedAt: string,
  } | null,
};

export type OnUpdateAppSettingSubscriptionVariables = {
  filter?: ModelSubscriptionAppSettingFilterInput | null,
};

export type OnUpdateAppSettingSubscription = {
  onUpdateAppSetting?:  {
    __typename: "AppSetting",
    createdAt: string,
    key: string,
    updatedAt: string,
    value?: string | null,
  } | null,
};

export type OnUpdateMountainSubscriptionVariables = {
  filter?: ModelSubscriptionMountainFilterInput | null,
};

export type OnUpdateMountainSubscription = {
  onUpdateMountain?:  {
    __typename: "Mountain",
    alltrailsUrl?: string | null,
    city?: string | null,
    createdAt: string,
    elevation?: number | null,
    id: string,
    latitude?: number | null,
    longitude?: number | null,
    name: string,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    peakbaggerUrl?: string | null,
    state?: string | null,
    updatedAt: string,
    userMountains?:  {
      __typename: "ModelUserMountainConnection",
      nextToken?: string | null,
    } | null,
    weatherUrl?: string | null,
  } | null,
};

export type OnUpdatePatchSubscriptionVariables = {
  filter?: ModelSubscriptionPatchFilterInput | null,
};

export type OnUpdatePatchSubscription = {
  onUpdatePatch?:  {
    __typename: "Patch",
    alltrailsUrl?: string | null,
    completionRule?: string | null,
    createdAt: string,
    description?: string | null,
    difficulty?: Difficulty | null,
    facebookUrl?: string | null,
    formUrl?: string | null,
    hasPeaks?: boolean | null,
    hasTrails?: boolean | null,
    howToGet?: string | null,
    id: string,
    imageUrl?: string | null,
    isPurchasable?: boolean | null,
    latitude?: number | null,
    longitude?: number | null,
    name: string,
    patchMountains?:  {
      __typename: "ModelPatchMountainConnection",
      nextToken?: string | null,
    } | null,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    popularity?: number | null,
    purchaseUrl?: string | null,
    regions?: Array< string | null > | null,
    seasons?: Array< Season | null > | null,
    status?: string | null,
    updatedAt: string,
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    websiteUrl?: string | null,
  } | null,
};

export type OnUpdatePatchMountainSubscriptionVariables = {
  filter?: ModelSubscriptionPatchMountainFilterInput | null,
};

export type OnUpdatePatchMountainSubscription = {
  onUpdatePatchMountain?:  {
    __typename: "PatchMountain",
    createdAt: string,
    delisted?: boolean | null,
    id: string,
    mountain?:  {
      __typename: "Mountain",
      alltrailsUrl?: string | null,
      city?: string | null,
      createdAt: string,
      elevation?: number | null,
      id: string,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      peakbaggerUrl?: string | null,
      state?: string | null,
      updatedAt: string,
      weatherUrl?: string | null,
    } | null,
    mountainPatchMountainsId?: string | null,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchPatchMountainsId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdatePatchOwnerSubscriptionVariables = {
  filter?: ModelSubscriptionPatchOwnerFilterInput | null,
};

export type OnUpdatePatchOwnerSubscription = {
  onUpdatePatchOwner?:  {
    __typename: "PatchOwner",
    createdAt: string,
    id: string,
    patchID: string,
    patchName: string,
    updatedAt: string,
    userEmail: string,
    userID: string,
  } | null,
};

export type OnUpdatePatchOwnerRequestSubscriptionVariables = {
  filter?: ModelSubscriptionPatchOwnerRequestFilterInput | null,
  userID?: string | null,
};

export type OnUpdatePatchOwnerRequestSubscription = {
  onUpdatePatchOwnerRequest?:  {
    __typename: "PatchOwnerRequest",
    createdAt: string,
    id: string,
    message?: string | null,
    patchID: string,
    patchName: string,
    status: OwnershipRequestStatus,
    updatedAt: string,
    userEmail: string,
    userID: string,
  } | null,
};

export type OnUpdatePatchPurchaseSubscriptionVariables = {
  filter?: ModelSubscriptionPatchPurchaseFilterInput | null,
  userId?: string | null,
};

export type OnUpdatePatchPurchaseSubscription = {
  onUpdatePatchPurchase?:  {
    __typename: "PatchPurchase",
    amount?: number | null,
    createdAt: string,
    currency?: string | null,
    id: string,
    patchId: string,
    stripeReceiptUrl?: string | null,
    stripeSessionId: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnUpdatePatchRequestSubscriptionVariables = {
  filter?: ModelSubscriptionPatchRequestFilterInput | null,
};

export type OnUpdatePatchRequestSubscription = {
  onUpdatePatchRequest?:  {
    __typename: "PatchRequest",
    createdAt: string,
    description: string,
    email: string,
    id: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePatchTrailSubscriptionVariables = {
  filter?: ModelSubscriptionPatchTrailFilterInput | null,
};

export type OnUpdatePatchTrailSubscription = {
  onUpdatePatchTrail?:  {
    __typename: "PatchTrail",
    createdAt: string,
    id: string,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchPatchTrailsId?: string | null,
    requiredMiles?: number | null,
    trail?:  {
      __typename: "Trail",
      alltrailsUrl?: string | null,
      createdAt: string,
      description?: string | null,
      id: string,
      lengthMiles: number,
      name: string,
      trailLinkUrl?: string | null,
      updatedAt: string,
    } | null,
    trailPatchTrailsId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateTrailSubscriptionVariables = {
  filter?: ModelSubscriptionTrailFilterInput | null,
};

export type OnUpdateTrailSubscription = {
  onUpdateTrail?:  {
    __typename: "Trail",
    alltrailsUrl?: string | null,
    createdAt: string,
    description?: string | null,
    id: string,
    lengthMiles: number,
    name: string,
    patchTrails?:  {
      __typename: "ModelPatchTrailConnection",
      nextToken?: string | null,
    } | null,
    trailLinkUrl?: string | null,
    updatedAt: string,
    userTrails?:  {
      __typename: "ModelUserTrailConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnUpdateUserMountainSubscriptionVariables = {
  filter?: ModelSubscriptionUserMountainFilterInput | null,
  owner?: string | null,
};

export type OnUpdateUserMountainSubscription = {
  onUpdateUserMountain?:  {
    __typename: "UserMountain",
    createdAt: string,
    dateClimbed: string,
    id: string,
    mountain?:  {
      __typename: "Mountain",
      alltrailsUrl?: string | null,
      city?: string | null,
      createdAt: string,
      elevation?: number | null,
      id: string,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      peakbaggerUrl?: string | null,
      state?: string | null,
      updatedAt: string,
      weatherUrl?: string | null,
    } | null,
    mountainID: string,
    notes?: string | null,
    owner?: string | null,
    updatedAt: string,
    userID: string,
  } | null,
};

export type OnUpdateUserPatchSubscriptionVariables = {
  filter?: ModelSubscriptionUserPatchFilterInput | null,
  userID?: string | null,
};

export type OnUpdateUserPatchSubscription = {
  onUpdateUserPatch?:  {
    __typename: "UserPatch",
    createdAt: string,
    dateCompleted?: string | null,
    difficulty?: number | null,
    id: string,
    imageUrl?: string | null,
    inProgress?: boolean | null,
    notes?: string | null,
    patch?:  {
      __typename: "Patch",
      alltrailsUrl?: string | null,
      completionRule?: string | null,
      createdAt: string,
      description?: string | null,
      difficulty?: Difficulty | null,
      facebookUrl?: string | null,
      formUrl?: string | null,
      hasPeaks?: boolean | null,
      hasTrails?: boolean | null,
      howToGet?: string | null,
      id: string,
      imageUrl?: string | null,
      isPurchasable?: boolean | null,
      latitude?: number | null,
      longitude?: number | null,
      name: string,
      popularity?: number | null,
      purchaseUrl?: string | null,
      regions?: Array< string | null > | null,
      seasons?: Array< Season | null > | null,
      status?: string | null,
      updatedAt: string,
      websiteUrl?: string | null,
    } | null,
    patchID: string,
    updatedAt: string,
    userID: string,
    wishlisted?: boolean | null,
  } | null,
};

export type OnUpdateUserTrailSubscriptionVariables = {
  filter?: ModelSubscriptionUserTrailFilterInput | null,
  userID?: string | null,
};

export type OnUpdateUserTrailSubscription = {
  onUpdateUserTrail?:  {
    __typename: "UserTrail",
    createdAt: string,
    dateCompleted?: string | null,
    milesRemaining?: number | null,
    notes?: string | null,
    trail?:  {
      __typename: "Trail",
      alltrailsUrl?: string | null,
      createdAt: string,
      description?: string | null,
      id: string,
      lengthMiles: number,
      name: string,
      trailLinkUrl?: string | null,
      updatedAt: string,
    } | null,
    trailID: string,
    updatedAt: string,
    userID: string,
  } | null,
};
