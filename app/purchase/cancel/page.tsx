import Link from 'next/link';

export default function CancelPage({
  searchParams
}: {
  searchParams: {patchId?: string};
})
 {
  const { patchId } = searchParams;
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Payment canceled</h1>
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
          <Link href="/" className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800">
            Back to Dashboard
          </Link>
        )}
      </div>
    </main>
  );
}

