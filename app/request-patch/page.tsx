'use client';
import { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { GraphQLResult } from '@aws-amplify/api';
import { useAuth } from '@/context/auth-context';
import Header from '@/components/Header';

const client = generateClient();

const createPatchRequest = `
  mutation CreatePatchRequest($input: CreatePatchRequestInput!) {
    createPatchRequest(input: $input) {
      id
    }
  }
`;

export default function RequestPatchPage() {
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!email || !description) {
      setMessage('❌ Please fill in both fields.');
      return;
    }

    try {
      const response = await client.graphql({
        query: createPatchRequest,
        variables: {
          input: {
            email,
            description,
          },
        },
        authMode: 'apiKey'
      }) as GraphQLResult<{ createPatchRequest: { id: string } }>;

      setMessage('✅ Request submitted successfully!');
      setEmail('');
      setDescription('');
    } catch (err) {
      console.error('Error submitting patch request:', err);
      setMessage('❌ Failed to submit request.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Header />
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <p className="mb-4 text-gray-600">
        If there’s a patch you'd like to see added to our website, let us know below.
      </p>

      <label className="block mb-3">
        Your Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full border p-2 rounded mt-1"
        />
      </label>

      <label className="block mb-3">
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full border p-2 rounded mt-1"
          rows={5}
          placeholder="Tell us the patch name, how to get it, and any relevant links."
        />
      </label>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Request
      </button>

      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </div>
  );
}

