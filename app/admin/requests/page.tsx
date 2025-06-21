'use client';
import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listPatchRequests } from '@/graphql/queries';
import { PatchRequest } from '@/API';
import Header from '@/components/Header';

const client = generateClient();

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<PatchRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await client.graphql({
          query: listPatchRequests,
          authMode: 'userPool'
        });
        const items = response.data?.listPatchRequests?.items || [];
        setRequests(items);
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <Header />
      <h1 className="text-2xl font-bold mb-4">Patch Requests</h1>
      {requests.length === 0 ? (
        <p className="text-gray-600">No requests submitted.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req.id} className="border p-4 rounded shadow">
              <p className="text-sm text-gray-500">
  {req.createdAt ? new Date(req.createdAt).toLocaleString() : 'Unknown date'}
</p>

              <p className="font-semibold">{req.email}</p>
              <p className="mt-2 whitespace-pre-line">{req.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

