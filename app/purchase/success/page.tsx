import Link from 'next/link';

type Props = {
  searchParams: Promise<{
    session_id?: string;
    patchId?: string;
  }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const sessionId = params.session_id ?? '';
  const patchId = params.patchId ?? '';

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Payment complete 🎉</h1>
      <p className="mt-3 text-gray-700">
        Thanks for your purchase! Your payment has been processed.
      </p>

      {sessionId ? (
        <p className="mt-2 text-sm text-gray-500">
          Checkout Session ID: <span className="font-mono">{sessionId}</span>
        </p>
      ) : (
        <p className="mt-2 text-sm text-gray-500">
          No session id found in the URL.
        </p>
      )}

      <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-800">
        We’ll enable your access automatically via our secure payment webhook.
        This usually happens within a few seconds. You can safely close this page.
      </div>

      <div className="mt-8 flex items-center gap-3">
        {patchId ? (
          <Link
            href={`/patch/${patchId}`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Continue to Patch
          </Link>
        ) : (
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
        )}

        <Link
          href="/support"
          className="text-sm text-gray-600 underline-offset-2 hover:underline"
        >
          Need help?
        </Link>
      </div>
    </main>
  );
}

