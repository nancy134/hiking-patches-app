/**
 * Pull the caller's Cognito ID token off a request to one of our /api proxies.
 *
 * These used to read `Authorization: Bearer <token>`, which collides with HTTP
 * basic auth: Amplify Hosting's branch password protection is enforced at
 * CloudFront using the same header, and a browser fetch that sets Authorization
 * itself replaces the basic credentials. CloudFront then sees a Bearer token
 * where it wants Basic, answers 401 with WWW-Authenticate, and the browser
 * re-prompts for the password — so every admin page broke whenever the branch
 * was password-protected.
 *
 * Sending the ID token in its own header keeps the two mechanisms apart.
 * Authorization is still accepted as a fallback so that direct calls (curl, or a
 * caller not yet updated) keep working.
 */
export const ID_TOKEN_HEADER = 'x-id-token';

export function idTokenFromRequest(request: Request): string | null {
  const direct = request.headers.get(ID_TOKEN_HEADER);
  if (direct && direct.trim()) return direct.trim();

  const auth = request.headers.get('authorization');
  const bearer = auth?.split(' ')[1];
  return bearer && bearer.trim() ? bearer.trim() : null;
}
