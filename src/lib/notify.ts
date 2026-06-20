import { generateClient } from 'aws-amplify/api';
import { createAdminNotificationCustom } from '@/graphql/custom-mutations';

const client = generateClient();

export type AdminNotificationInput = {
  type: 'NEW_USER' | 'PATCH_PURCHASED' | 'OWNER_REQUEST';
  title: string;
  body?: string;
  link?: string;
};

/**
 * Records an in-app admin notification.
 *
 * Best-effort by design: a failed notification must never break the caller's
 * flow (signup, checkout, ownership request), so this swallows errors and only
 * logs. Created via the API key so it works from unauthenticated contexts too
 * (e.g. sign-up, before the user has a session).
 *
 * This is the single client-side producer point — to add email/Slack later,
 * fan out from here rather than touching the call sites. (The Stripe webhook
 * runs in Lambda and creates its notification directly via AppSync; see
 * amplify/functions/stripe-webhook/handler.ts.)
 */
export async function notifyAdmins(input: AdminNotificationInput): Promise<void> {
  try {
    await client.graphql({
      query: createAdminNotificationCustom,
      variables: { input: { ...input, read: false } },
      authMode: 'apiKey',
    });
  } catch (err) {
    console.error('notifyAdmins failed', err);
  }
}
