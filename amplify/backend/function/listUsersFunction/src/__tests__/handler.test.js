'use strict';

// Variables starting with 'mock' can be referenced inside jest.mock() factories (Jest hoisting rule)
const mockVerify = jest.fn();
const mockListUsersPromise = jest.fn();

jest.mock('aws-jwt-verify', () => ({
  CognitoJwtVerifier: {
    create: () => ({ verify: mockVerify }),
  },
}));

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn().mockImplementation(() => ({
    listUsers: jest.fn(() => ({ promise: mockListUsersPromise })),
  })),
}));

// These are imported by index.js but not exercised in unit tests
jest.mock('@aws-sdk/signature-v4', () => ({ SignatureV4: class {} }));
jest.mock('@aws-crypto/sha256-js', () => ({ Sha256: class {} }));
jest.mock('@aws-sdk/protocol-http', () => ({ HttpRequest: class {} }));
jest.mock('@aws-sdk/credential-provider-node', () => ({ defaultProvider: jest.fn() }));

process.env.AUTH_HIKINGPATCHESAPP368A1661_USERPOOLID = 'us-east-1_testPool';
process.env.AWS_REGION = 'us-east-1';

const { handler } = require('../index');

function makeEvent(method, path, headers = {}, body = null) {
  return {
    httpMethod: method,
    path,
    resource: path,
    headers,
    body: body ? JSON.stringify(body) : null,
  };
}

describe('requireAdmin — auth guard on /list-users', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns 403 when Authorization header is missing', async () => {
    const res = await handler(makeEvent('POST', '/list-users'));
    expect(res.statusCode).toBe(403);
  });

  test('returns 403 when token is invalid', async () => {
    mockVerify.mockRejectedValue(new Error('Invalid token'));
    const res = await handler(makeEvent('POST', '/list-users', { Authorization: 'Bearer bad-token' }));
    expect(res.statusCode).toBe(403);
  });

  test('returns 403 when user is not in Admin group', async () => {
    mockVerify.mockResolvedValue({ 'cognito:groups': ['Users'] });
    const res = await handler(makeEvent('POST', '/list-users', { Authorization: 'Bearer valid-token' }));
    expect(res.statusCode).toBe(403);
  });

  test('returns 403 when cognito:groups is empty', async () => {
    mockVerify.mockResolvedValue({ 'cognito:groups': [] });
    const res = await handler(makeEvent('POST', '/list-users', { Authorization: 'Bearer valid-token' }));
    expect(res.statusCode).toBe(403);
  });

  test('returns 200 and user list for Admin user', async () => {
    mockVerify.mockResolvedValue({ 'cognito:groups': ['Admin'] });
    mockListUsersPromise.mockResolvedValue({ Users: [{ Username: 'user1' }], PaginationToken: undefined });

    const res = await handler(makeEvent('POST', '/list-users', { Authorization: 'Bearer admin-token' }));

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual([{ Username: 'user1' }]);
  });

  test('handles lowercase authorization header', async () => {
    mockVerify.mockResolvedValue({ 'cognito:groups': ['Admin'] });
    mockListUsersPromise.mockResolvedValue({ Users: [], PaginationToken: undefined });

    const res = await handler(makeEvent('POST', '/list-users', { authorization: 'Bearer admin-token' }));
    expect(res.statusCode).toBe(200);
  });
});

describe('requireAdmin — auth guard on /user-entry-counts', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns 403 when Authorization header is missing', async () => {
    const res = await handler(makeEvent('POST', '/user-entry-counts', {}, { userIds: ['user1'] }));
    expect(res.statusCode).toBe(403);
  });

  test('returns 403 when user is not in Admin group', async () => {
    mockVerify.mockResolvedValue({ 'cognito:groups': ['Users'] });
    const res = await handler(makeEvent('POST', '/user-entry-counts', { Authorization: 'Bearer token' }, { userIds: ['user1'] }));
    expect(res.statusCode).toBe(403);
  });
});

describe('route matching', () => {
  beforeEach(() => jest.clearAllMocks());

  test('/popular-patches does not require admin JWT', async () => {
    // popular-patches is open — it should not return 403 (may 500 in test env without AppSync)
    const res = await handler(makeEvent('GET', '/popular-patches'));
    expect(res.statusCode).not.toBe(403);
  });

  test('unknown path returns 404', async () => {
    const res = await handler(makeEvent('GET', '/unknown'));
    expect(res.statusCode).toBe(404);
  });
});
