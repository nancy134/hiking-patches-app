// app/patch/[id]/page.tsx
'use client';
import { 
  createUserPatch,
  updateUserPatch
} from '@/graphql/mutations';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { generateClient } from 'aws-amplify/api';
import { 
  getPatch,
  listUserPatches,
  listUserMountains
} from '@/graphql/queries';
import { 
  Patch,
  UserPatch,
  UserMountain
} from '@/API';
import Header from '@/components/Header';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/context/auth-context';
import { GraphQLResult } from '@aws-amplify/api';
import {
  UpdateUserPatchMutation,
  CreateUserPatchMutation,
} from '@/API';
import { getPatchWithMountains } from '@/graphql/custom-queries';
import PatchMountains from '@/components/PatchMountains';
import PatchProgress from '@/components/PatchProgress';

type UserMountainMap = {
  [mountainID: string]: UserMountain[];
};
const client = generateClient();

const customCreateUserPatch = `
  mutation CreateUserPatch($input: CreateUserPatchInput!) {
    createUserPatch(input: $input) {
      id
      patchID
      userID
      dateCompleted
      inProgress
      notes
      difficulty
      imageUrl
      createdAt
      updatedAt
    }
  }
`;

const customUpdateUserPatch = `
  mutation UpdateUserPatch($input: UpdateUserPatchInput!) {
    updateUserPatch(input: $input) {
      id
      patchID
      userID
      dateCompleted
      inProgress
      notes
      difficulty
      imageUrl
      createdAt
      updatedAt
    }
  }
`;

const customCreateUserMountain = `
mutation CreateUserMountain($input: CreateUserMountainInput!) {
  createUserMountain(input: $input) {
    id
    userID
    mountainID
    dateClimbed
  }
}
`;

export default function PatchDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  if (!id) {
    return <p>Missing patch ID</p>;
  }
  const [patch, setPatch] = useState<Patch | null>(null);
  const [dateCompleted, setDateCompleted] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userPatch, setUserPatch] = useState<UserPatch | null>(null);
  const [isInProgress, setIsInProgress] = useState<boolean | null>(null);
  const [dates, setDates] = useState<{ [mountainId: string]: string }>({});
  const [userMountainMap, setUserMountainMap] = useState<UserMountainMap>({});

  const { user } = useAuth();

  useEffect(() => {
    const fetchPatch = async () => {
      try {
        const response = await client.graphql({
          query: getPatchWithMountains,
          variables: { id },
        });
        if ('data' in response) {
          setPatch(response.data?.getPatch as Patch);
        }
      } catch (error) {
        console.error('Error fetching patch:', error);
      }
    };

    if (id) fetchPatch();
  }, [id]);

  useEffect(() => {
    const fetchUserPatch = async () => {
      if (!user?.userId || !id) return;
      try {
        const response = await client.graphql({
          query: listUserPatches,
          variables: {
            filter: {
              userID: { eq: user.userId },
              patchID: { eq: id },
            },
          },
        });
        const match = response.data?.listUserPatches?.items?.[0];
        if (match) {
          setUserPatch(match);
          if (match.dateCompleted) setDateCompleted(match.dateCompleted);
          else setDateCompleted(null);
          setDifficulty(match.difficulty?.toString() || '');
          setNotes(match.notes || '');
          setIsInProgress(match.inProgress !== undefined ? match.inProgress : null);
        }
      } catch (err) {
        console.error('Error fetching userPatch:', err);
      }
    };
    fetchUserPatch();
  }, [user, id]);

  const handleDateChange = (mountainId: string, value: string) => {
    setDates((prev) => ({ ...prev, [mountainId]: value }))
  }

  const handleSave = async (mountainId: string) => {
    const dateCompleted = dates[mountainId]
    if (!dateCompleted || !user?.username) return

    try {
      await client.graphql({
        query: customCreateUserMountain,
        variables: {
          input: {
            userID: user.username,
            mountainID: mountainId,
            dateClimbed: dateCompleted,
          },
        },
        authMode: 'userPool'
      })
      alert('Saved!')
    } catch (err) {
      console.error('Error saving UserMountain:', err)
      alert('Failed to save')
    }
  }

  useEffect(() => {
    const fetchUserMountains = async () => {
      if (!user?.userId) return;
      try {
        const response = await client.graphql({
          query: listUserMountains,
          variables: { filter: { userID: { eq: user.userId } } },
          authMode: 'userPool'
        });
        const c_userMountainMap: Record<string, UserMountain[]> = {};
        response.data?.listUserMountains?.items?.forEach((um: UserMountain | null) => {
          if (um?.mountainID) {
            if (!c_userMountainMap[um.mountainID]) {
              c_userMountainMap[um.mountainID] = [];
            }
            c_userMountainMap[um.mountainID].push(um);
          }
        });
        console.log(c_userMountainMap);
        setUserMountainMap(c_userMountainMap);
      } catch (err) {
        console.error('Error fetching user mountains:', err);
      }
    };

    fetchUserMountains();
  }, [user]);

  // Update dateCompleted whenever "In Progress" is selected
  const handleInProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsInProgress(checked);
    if (checked) {
      setDateCompleted('');
    }
  };

  // Determine whether to enable Submit
  const canSubmit = isInProgress !== null && (isInProgress || Boolean(dateCompleted));


  const handleSubmit = async () => {
    if (!patch || !user?.userId) {
      setMessage('❌ Missing patch or user information.');
      return;
    }

    const input = {
      patchID: patch.id,
      userID: user.userId,
      dateCompleted: isInProgress ? null : dateCompleted || null,
      difficulty: difficulty ? parseInt(difficulty) : null,
      inProgress: isInProgress,
      notes: notes ? notes : null,
      ...(userPatch && { id: userPatch.id }), // include ID if updating
    };

    try {
      const mutation = userPatch ? customUpdateUserPatch : customCreateUserPatch;
      const response = await client.graphql({
        query: mutation,
        variables: { input},
        authMode: 'userPool'
      }) as GraphQLResult<UpdateUserPatchMutation | CreateUserPatchMutation>;
     

      let updatedUserPatch;

      if (userPatch) {
        const updateResponse = response as GraphQLResult<UpdateUserPatchMutation>;
        updatedUserPatch = updateResponse.data?.updateUserPatch;
      } else {
         const createResponse = response as GraphQLResult<CreateUserPatchMutation>;
         updatedUserPatch = createResponse.data?.createUserPatch;
     }
 
      //const updatedUserPatch = userPatch ? response.data?.updateUserPatch : response.data?.createUserPatch;
      if (updatedUserPatch) setUserPatch(updatedUserPatch);
      setMessage('🎉 Patch progress updated!');
      setShowModal(false);
    } catch (err) {
      console.error('Error submitting UserPatch:', err);
      setMessage('❌ Failed to mark patch as completed.');
    }
  };
  if (!patch) return <p className="p-4">Loading patch...</p>;
  return (
    <>
    <div className="p-4 max-w-4xl mx-auto">
      <Header />
      <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{patch.name}</h1>
          <p className="text-lg mb-2">{patch.description}</p>
          {Array.isArray(patch.regions) && patch.regions.length > 0 && (
            <p className="text-gray-700">
              <strong>Regions:</strong> {patch.regions.filter(Boolean).join(', ')}
            </p>
          )}
        </div>
        {patch.imageUrl && (
          <img
            src={patch.imageUrl}
            alt={patch.name}
            className="w-40 h-auto rounded shadow"
          />
        )}
      </div>
      {patch.howToGet && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">How to Get This Patch</h2>
          <div className="prose max-w-none">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => {
                  const isExternal = href?.startsWith('http');

                  return isExternal ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline inline-flex items-center gap-1"
                     >
                       {children}
                       <svg
                         xmlns="http://www.w3.org/2000/svg"
                         className="h-4 w-4 inline"
                         fill="none"
                         viewBox="0 0 24 24"
                         stroke="currentColor"
                         strokeWidth={2}
                         aria-hidden="true"
                        >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18 13V18a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h5M15 3h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ) : (
                    <a href={href} className="text-blue-600 underline">
                      {children}
                    </a>
                  );
                },
              }}
            >{patch.howToGet}</ReactMarkdown>
          </div>
        </div>
      )}


      {user ? (
        <>
        <div className="bg-white p-4 rounded shadow mt-6">
          <PatchProgress
            patchId={patch.id}
            userId={user.userId}
            initialUserPatch={userPatch}
            onUpdate={(newPatch) => {
              setUserPatch(newPatch);
              if (newPatch?.dateCompleted) {
                setDateCompleted(newPatch.dateCompleted);
              }
            }}
          />
        </div>
        <div className="bg-white p-4 rounded shadow mt-6">
          <PatchMountains patchId={patch.id} userId={user.userId} />
        </div>
        </>
      ) : (
        <>
          <div className="bg-white p-4 mt-6 rounded shadow">
            <PatchMountains patchId={patch.id} />
          </div>
          <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded text-blue-800">
            <p className="text-lg font-medium mb-2">Want to keep track of your progress?</p>
            <p>Sign in to mark your patch progress and log your climbs.</p>
          </div>
        </>
      )}
    </div>
    </>
  );
}


