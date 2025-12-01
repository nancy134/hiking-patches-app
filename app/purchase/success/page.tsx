import Link from 'next/link';
import Header from '@/components/Header';

type Props = {
  searchParams?: {
    session_id?: string;
    patchId?: string;
  };
};

export default async function SuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const sessionId = params?.session_id ?? '';
  const patchId = params?.patchId ?? '';

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Header />

      <main className="max-w-xl">
        <h1 className="text-3xl font-bold">Payment complete 🎉</h1>
        <p className="mt-3 text-gray-700">
          Thanks for your purchase! Your payment has been processed.
        </p>

        <div className="mt-8 flex items-center gap-3">
          {patchId ? (
            <Link
              href={`/patch/${patchId}`}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Back to Patch
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
            href="/about"
            className="text-sm text-gray-600 underline-offset-2 hover:underline"
          >
            Need help?
          </Link>
        </div>
      </main>
    </div>
  );
}

