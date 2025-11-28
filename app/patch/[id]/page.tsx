// app/patch/[id]/page.tsx
import type { Metadata } from 'next';
import PatchDetailClient from './PatchDetailClient';
import awsmobile from '@/aws-exports';

// Pull AppSync info from aws-exports
const APPSYNC_URL = awsmobile.aws_appsync_graphqlEndpoint;
const APPSYNC_API_KEY = awsmobile.aws_appsync_apiKey;

// Minimal query just for metadata
const GET_PATCH_FOR_META = /* GraphQL */ `
  query GetPatchForMeta($id: ID!) {
    getPatch(id: $id) {
      id
      name
      description
      imageUrl
    }
  }
`;

type RouteProps = {
  params: Promise<{ id: string }>;
};

// Dynamically set <title>, OG, Twitter card based on patch
export async function generateMetadata(
  { params }: RouteProps
): Promise<Metadata> {
  const { id } = await params; // ✅ await params per Next.js requirement

  try {
    const res = await fetch(APPSYNC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': APPSYNC_API_KEY,
      },
      body: JSON.stringify({
        query: GET_PATCH_FOR_META,
        variables: { id },
      }),
      next: { revalidate: 60 },
    });

    const json = await res.json();
    const patch = json.data?.getPatch;

    if (!patch) {
      return {
        title: 'Patch Not Found — Hiking Patches',
      };
    }

    const title = `${patch.name} — Hiking Patches`;
    const description =
      patch.description ?? 'View details and progress for this hiking patch.';
    const imageUrl: string | undefined = patch.imageUrl || undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (err) {
    console.error('Error generating metadata for patch page:', err);
    return {
      title: 'Hiking Patches',
    };
  }
}

// Page component: also await params before using id
export default async function PatchDetailPage({ params }: RouteProps) {
  const { id } = await params; // ✅ await params

  return <PatchDetailClient id={id} />;
}

