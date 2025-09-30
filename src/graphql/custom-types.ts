export type GetPatchCompletionRuleQuery = {
  getPatch?: {
    __typename?: "Patch";
    id: string;
    name: string;
    completionRule?: string | null;
  } | null;
};

