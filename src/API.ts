/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type ModelUserPatchFilterInput = {
  id?: ModelIDInput | null,
  patchID?: ModelIDInput | null,
  userID?: ModelStringInput | null,
  dateCompleted?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  difficulty?: ModelIntInput | null,
  imageUrl?: ModelStringInput | null,
  inProgress?: ModelBooleanInput | null,
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
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
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
  userPatches?: ModelUserPatchConnection | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export enum Difficulty {
  EASY = "EASY",
  MODERATE = "MODERATE",
  HARD = "HARD",
  EXTRA_HARD = "EXTRA_HARD",
  EXTRA_EXTRA_HARD = "EXTRA_EXTRA_HARD",
}


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
  and?: Array< ModelPatchConditionInput | null > | null,
  or?: Array< ModelPatchConditionInput | null > | null,
  not?: ModelPatchConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
};

export type ModelDifficultyInput = {
  eq?: Difficulty | null,
  ne?: Difficulty | null,
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
};

export type DeletePatchInput = {
  id: string,
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
};

export type ModelUserPatchConditionInput = {
  patchID?: ModelIDInput | null,
  userID?: ModelStringInput | null,
  dateCompleted?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  difficulty?: ModelIntInput | null,
  imageUrl?: ModelStringInput | null,
  inProgress?: ModelBooleanInput | null,
  and?: Array< ModelUserPatchConditionInput | null > | null,
  or?: Array< ModelUserPatchConditionInput | null > | null,
  not?: ModelUserPatchConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
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
};

export type DeleteUserPatchInput = {
  id: string,
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
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPatchFilterInput | null > | null,
  or?: Array< ModelPatchFilterInput | null > | null,
  not?: ModelPatchFilterInput | null,
  owner?: ModelStringInput | null,
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
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPatchFilterInput | null > | null,
  or?: Array< ModelSubscriptionPatchFilterInput | null > | null,
  owner?: ModelStringInput | null,
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

export type ModelSubscriptionUserPatchFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  patchID?: ModelSubscriptionIDInput | null,
  userID?: ModelSubscriptionStringInput | null,
  dateCompleted?: ModelSubscriptionStringInput | null,
  notes?: ModelSubscriptionStringInput | null,
  difficulty?: ModelSubscriptionIntInput | null,
  imageUrl?: ModelSubscriptionStringInput | null,
  inProgress?: ModelSubscriptionBooleanInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserPatchFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserPatchFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
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
        createdAt: string,
        updatedAt: string,
      } | null,
    } | null >,
    nextToken?: string | null,
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
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
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
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
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
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
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
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    userID: string,
    dateCompleted?: string | null,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    inProgress?: boolean | null,
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
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    userID: string,
    dateCompleted?: string | null,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    inProgress?: boolean | null,
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
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    userID: string,
    dateCompleted?: string | null,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    inProgress?: boolean | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
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
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
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
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    userID: string,
    dateCompleted?: string | null,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    inProgress?: boolean | null,
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
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserPatchesByPatchIDQueryVariables = {
  patchID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserPatchFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserPatchesByPatchIDQuery = {
  userPatchesByPatchID?:  {
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

export type OnCreatePatchSubscriptionVariables = {
  filter?: ModelSubscriptionPatchFilterInput | null,
  owner?: string | null,
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
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdatePatchSubscriptionVariables = {
  filter?: ModelSubscriptionPatchFilterInput | null,
  owner?: string | null,
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
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeletePatchSubscriptionVariables = {
  filter?: ModelSubscriptionPatchFilterInput | null,
  owner?: string | null,
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
    userPatches?:  {
      __typename: "ModelUserPatchConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
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
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    userID: string,
    dateCompleted?: string | null,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    inProgress?: boolean | null,
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
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    userID: string,
    dateCompleted?: string | null,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    inProgress?: boolean | null,
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
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    userID: string,
    dateCompleted?: string | null,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    inProgress?: boolean | null,
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
