/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreatePatchInput = {
  id?: string | null,
  name: string,
  description?: string | null,
  howToGet?: string | null,
  imageUrl?: string | null,
  regions?: Array< string | null > | null,
};

export type ModelPatchConditionInput = {
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  howToGet?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  regions?: ModelStringInput | null,
  and?: Array< ModelPatchConditionInput | null > | null,
  or?: Array< ModelPatchConditionInput | null > | null,
  not?: ModelPatchConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
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

export type Patch = {
  __typename: "Patch",
  id: string,
  name: string,
  description?: string | null,
  howToGet?: string | null,
  imageUrl?: string | null,
  regions?: Array< string | null > | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdatePatchInput = {
  id: string,
  name?: string | null,
  description?: string | null,
  howToGet?: string | null,
  imageUrl?: string | null,
  regions?: Array< string | null > | null,
};

export type DeletePatchInput = {
  id: string,
};

export type CreateUserPatchInput = {
  id?: string | null,
  patchID: string,
  userID: string,
  dateCompleted: string,
  notes?: string | null,
  difficulty?: number | null,
  imageUrl?: string | null,
};

export type ModelUserPatchConditionInput = {
  patchID?: ModelIDInput | null,
  userID?: ModelStringInput | null,
  dateCompleted?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  difficulty?: ModelIntInput | null,
  imageUrl?: ModelStringInput | null,
  and?: Array< ModelUserPatchConditionInput | null > | null,
  or?: Array< ModelUserPatchConditionInput | null > | null,
  not?: ModelUserPatchConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
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

export type UserPatch = {
  __typename: "UserPatch",
  id: string,
  patchID: string,
  userID: string,
  dateCompleted: string,
  notes?: string | null,
  difficulty?: number | null,
  imageUrl?: string | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type UpdateUserPatchInput = {
  id: string,
  patchID?: string | null,
  userID?: string | null,
  dateCompleted?: string | null,
  notes?: string | null,
  difficulty?: number | null,
  imageUrl?: string | null,
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

export type ModelUserPatchFilterInput = {
  id?: ModelIDInput | null,
  patchID?: ModelIDInput | null,
  userID?: ModelStringInput | null,
  dateCompleted?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  difficulty?: ModelIntInput | null,
  imageUrl?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserPatchFilterInput | null > | null,
  or?: Array< ModelUserPatchFilterInput | null > | null,
  not?: ModelUserPatchFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelUserPatchConnection = {
  __typename: "ModelUserPatchConnection",
  items:  Array<UserPatch | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionPatchFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  howToGet?: ModelSubscriptionStringInput | null,
  imageUrl?: ModelSubscriptionStringInput | null,
  regions?: ModelSubscriptionStringInput | null,
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

export type ModelSubscriptionUserPatchFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  patchID?: ModelSubscriptionIDInput | null,
  userID?: ModelSubscriptionStringInput | null,
  dateCompleted?: ModelSubscriptionStringInput | null,
  notes?: ModelSubscriptionStringInput | null,
  difficulty?: ModelSubscriptionIntInput | null,
  imageUrl?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserPatchFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserPatchFilterInput | null > | null,
  owner?: ModelStringInput | null,
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
    userID: string,
    dateCompleted: string,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
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
    userID: string,
    dateCompleted: string,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
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
    userID: string,
    dateCompleted: string,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
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
    userID: string,
    dateCompleted: string,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
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
      dateCompleted: string,
      notes?: string | null,
      difficulty?: number | null,
      imageUrl?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserPatchSubscriptionVariables = {
  filter?: ModelSubscriptionUserPatchFilterInput | null,
};

export type OnCreateUserPatchSubscription = {
  onCreateUserPatch?:  {
    __typename: "UserPatch",
    id: string,
    patchID: string,
    userID: string,
    dateCompleted: string,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateUserPatchSubscriptionVariables = {
  filter?: ModelSubscriptionUserPatchFilterInput | null,
};

export type OnUpdateUserPatchSubscription = {
  onUpdateUserPatch?:  {
    __typename: "UserPatch",
    id: string,
    patchID: string,
    userID: string,
    dateCompleted: string,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteUserPatchSubscriptionVariables = {
  filter?: ModelSubscriptionUserPatchFilterInput | null,
};

export type OnDeleteUserPatchSubscription = {
  onDeleteUserPatch?:  {
    __typename: "UserPatch",
    id: string,
    patchID: string,
    userID: string,
    dateCompleted: string,
    notes?: string | null,
    difficulty?: number | null,
    imageUrl?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};
