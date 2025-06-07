/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreatePatchInput = {
  id?: string | null,
  name: string,
  description?: string | null,
  imageUrl?: string | null,
  regions?: Array< string | null > | null,
};

export type ModelPatchConditionInput = {
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
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
  imageUrl?: string | null,
  regions?: Array< string | null > | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdatePatchInput = {
  id: string,
  name?: string | null,
  description?: string | null,
  imageUrl?: string | null,
  regions?: Array< string | null > | null,
};

export type DeletePatchInput = {
  id: string,
};

export type ModelPatchFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  regions?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPatchFilterInput | null > | null,
  or?: Array< ModelPatchFilterInput | null > | null,
  not?: ModelPatchFilterInput | null,
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

export type ModelPatchConnection = {
  __typename: "ModelPatchConnection",
  items:  Array<Patch | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionPatchFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
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
    imageUrl?: string | null,
    regions?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
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
      imageUrl?: string | null,
      regions?: Array< string | null > | null,
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
    imageUrl?: string | null,
    regions?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
