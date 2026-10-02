import { signUp } from 'aws-amplify/auth';
import { notifyAdmins } from '@/lib/notify';

/**
 * Authenticator `services` shared by every sign-up entry point.
 *
 * This MUST be passed to every <Authenticator> that can create an account.
 * It previously lived inline in app/auth/page.tsx, so the sign-up form in the
 * header's modal — a separate <Authenticator> without it — created accounts
 * without recording a notification. 25 production signups went unreported that
 * way. Keeping it here means a new entry point only has to pass `services`
 * rather than reimplement the hook.
 *
 * referenceAuth blocks a Cognito post-confirmation trigger, which is why this is
 * a client-side hook rather than a Lambda.
 */
export const authServices = {
  async handleSignUp(input: Parameters<typeof signUp>[0]) {
    const result = await signUp(input);
    // Awaited so the notification POST completes before the Authenticator
    // advances or the page redirects; fire-and-forget lost it to navigation.
    // notifyAdmins never throws, so this cannot break sign-up.
    await notifyAdmins({
      type: 'NEW_USER',
      title: 'New user signed up',
      body: input.username,
      link: '/admin/users',
    });
    return result;
  },
};
