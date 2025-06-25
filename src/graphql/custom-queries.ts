export const listUserPatchesWithPatch = /* GraphQL */ `
  query ListUserPatchesWithPatch {
    listUserPatches {
      items {
        id
        patchID
        userID
        dateCompleted
        notes
        difficulty
        imageUrl
	inProgress
	difficulty
        createdAt
        updatedAt
        patch {
          id
          name
          description
          howToGet
          imageUrl
          regions
	  difficulty
          createdAt
          updatedAt
        }
      }
    }
  }
`;

