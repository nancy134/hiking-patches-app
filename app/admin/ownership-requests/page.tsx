'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '@/context/auth-context';
import Header from '@/components/Header';
import { listAllOwnerRequests } from '@/graphql/custom-queries';
import {
  createPatchOwnerCustom,
  updatePatchOwnerRequestStatus,
} from '@/graphql/custom-mutations';

const client = generateClient();

type OwnerRequest = {
  id: string;
  patchID: string;
  patchName: string;
  userID: string;
  userEmail: string;
  message?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
};

const statusBadge: Record<OwnerRequest['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export default function AdminOwnershipRequestsPage() {
  const { isAdmin } = useAuth();
  const [requests, setRequests] = useState<OwnerRequest[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await client.graphql({
        query: listAllOwnerRequests,
        variables: { limit: 1000 },
        authMode: 'userPool',
      });
      const items: OwnerRequest[] =
        (res as any).data?.listPatchOwnerRequests?.items ?? [];
      items.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
      setRequests(items);
    } catch (err) {
      console.error('Error fetching ownership requests:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (req: OwnerRequest) => {
    setProcessingId(req.id);
    try {
      await client.graphql({
        query: createPatchOwnerCustom,
        variables: {
          input: {
            patchID: req.patchID,
            userID: req.userID,
            userEmail: req.userEmail,
            patchName: req.patchName,
          },
        },
        authMode: 'userPool',
      });
      await client.graphql({
        query: updatePatchOwnerRequestStatus,
        variables: { input: { id: req.id, status: 'APPROVED' } },
        authMode: 'userPool',
      });
      setRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, status: 'APPROVED' } : r))
      );
    } catch (err) {
      console.error('Error approving request:', err);
      alert('Failed to approve request.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (req: OwnerRequest) => {
    setProcessingId(req.id);
    try {
      await client.graphql({
        query: updatePatchOwnerRequestStatus,
        variables: { input: { id: req.id, status: 'REJECTED' } },
        authMode: 'userPool',
      });
      setRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, status: 'REJECTED' } : r))
      );
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert('Failed to reject request.');
    } finally {
      setProcessingId(null);
    }
  };

  if (isAdmin === null) return <p className="p-6">Checking permissions...</p>;
  if (!isAdmin) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Header />
        <p className="p-6 text-red-600 font-semibold">⛔ Access denied. Admins only.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Header />
      <h1 className="text-2xl font-bold mb-4">Ownership Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-600">No ownership requests submitted.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req.id} className="border p-4 rounded shadow bg-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/patch/${req.patchID}`}
                    className="text-blue-600 underline font-semibold"
                  >
                    {req.patchName}
                  </Link>
                  <p className="text-sm text-gray-700 mt-1">{req.userEmail}</p>
                  <p className="text-xs text-gray-500">
                    {req.createdAt ? new Date(req.createdAt).toLocaleString() : ''}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded font-medium ${statusBadge[req.status]}`}
                >
                  {req.status}
                </span>
              </div>

              {req.message && (
                <p className="mt-3 whitespace-pre-line text-sm">{req.message}</p>
              )}

              {req.status === 'PENDING' && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleApprove(req)}
                    disabled={processingId === req.id}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    {processingId === req.id ? 'Working…' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(req)}
                    disabled={processingId === req.id}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
