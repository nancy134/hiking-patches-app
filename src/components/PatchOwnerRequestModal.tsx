'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useAuth } from '@/context/auth-context';
import { createPatchOwnerRequestCustom } from '@/graphql/custom-mutations';
import { notifyAdmins } from '@/lib/notify';

const client = generateClient();

type Props = {
  open: boolean;
  onClose: () => void;
  patchId: string;
  patchName: string;
  onSubmitted: () => void;
};

export default function PatchOwnerRequestModal({
  open,
  onClose,
  patchId,
  patchName,
  onSubmitted,
}: Props) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!user?.userId || !message.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      // Email isn't on the auth-context user object; read it from the ID token.
      const session = await fetchAuthSession();
      const email = (session.tokens?.idToken?.payload?.email as string | undefined) ?? '';

      await client.graphql({
        query: createPatchOwnerRequestCustom,
        variables: {
          input: {
            patchID: patchId,
            patchName,
            userID: user.userId,
            userEmail: email,
            message: message.trim(),
            status: 'PENDING',
          },
        },
        authMode: 'userPool',
      });

      await notifyAdmins({
        type: 'OWNER_REQUEST',
        title: `New ownership request for ${patchName}`,
        body: email,
        link: '/admin/ownership-requests',
      });

      setSubmitted(true);
      onSubmitted();
    } catch (err) {
      console.error('Error submitting ownership request:', err);
      setError('Something went wrong submitting your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset transient state so re-opening starts fresh.
    setMessage('');
    setSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-bold mb-2">
            Apply to be listed as the owner of {patchName}
          </Dialog.Title>

          {submitted ? (
            <>
              <p className="text-sm text-gray-700 mb-4">
                Your request has been submitted. We&apos;ll review it and follow up by email.
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-3">
                Tell us a bit about who you are and your connection to this patch (e.g. the
                hiking club or organization you represent). We&apos;ll review and follow up by email.
              </p>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full border rounded p-2 text-sm mb-3"
                placeholder="Your message…"
              />

              {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm rounded border hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !message.trim()}
                  className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Submitting…' : 'Submit Request'}
                </button>
              </div>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
