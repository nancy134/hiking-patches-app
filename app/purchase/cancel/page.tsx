import Link from 'next/link';
import Header from '@/components/Header';

type Props = {
  searchParams?: {
    patchId?: string;
  };
};

export default function CancelPage({ searchParams }: Props) {
  const patchId = searchParams?.patchId ?? '';

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Header />

      <main className="max-w-xl">
        <h1 className="text-3xl font-bold">Payment canceled</h1>

        <p className="mt-3 text-gray-700">
          Your payment wasn’t completed. You can try again any time.
        </p>

        <div className="mt-8 flex items-center gap-3">
          {patchId ? (
            <Link
              href={`/patch/${patchId}`}
              className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
            >
              Back to Patch
            </Link>
          ) : (
            <Link
              href="/"
              className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
            >
              Back to Dashboard
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

