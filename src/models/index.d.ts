import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerPatch = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Patch, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly imageUrl?: string | null;
  readonly regions?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPatch = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Patch, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly imageUrl?: string | null;
  readonly regions?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Patch = LazyLoading extends LazyLoadingDisabled ? EagerPatch : LazyPatch

export declare const Patch: (new (init: ModelInit<Patch>) => Patch) & {
  copyOf(source: Patch, mutator: (draft: MutableModel<Patch>) => MutableModel<Patch> | void): Patch;
}