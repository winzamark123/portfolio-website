import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authOptions, writerSession } from '../../src/lib/writing/auth';

const ownerId = '112555956';
const userDetails = { name: 'Win Cheng', email: 'writer@example.com' };

beforeEach(() => {
  vi.stubEnv('WRITER_GITHUB_ID', ownerId);
  vi.stubEnv('NEXTAUTH_SECRET', 'isolated-auth-test-secret-not-for-production');
});

afterEach(() => vi.unstubAllEnvs());

function sessionFor({ subject }: { subject?: string }) {
  return authOptions.callbacks.session({
    session: {
      user: userDetails,
      expires: new Date(Date.now() + 3600_000).toISOString(),
    },
    token: { ...userDetails, sub: subject },
    user: { ...userDetails, id: ownerId, emailVerified: null },
    newSession: undefined,
    trigger: 'update',
  });
}

describe('owner-only GitHub authorization', () => {
  it('only registers the GitHub provider', () => {
    expect(authOptions.providers.map((provider) => provider.id)).toEqual([
      'github',
    ]);
  });

  it('allows the configured GitHub account', () => {
    expect(
      authOptions.callbacks.signIn({
        user: { ...userDetails, id: ownerId },
        account: null,
      })
    ).toBe(true);
  });

  it('identifies the owner by ID even when their name or email changes', () => {
    expect(
      authOptions.callbacks.signIn({
        user: {
          id: ownerId,
          name: 'A different display name',
          email: 'changed@example.com',
        },
        account: null,
      })
    ).toBe(true);
  });

  it.each(['9999', '112555957', 'winzamark123', '112555956 ', ''])(
    'rejects sign-in for account %j even with the owner name and email',
    (id) => {
      expect(
        authOptions.callbacks.signIn({
          user: { ...userDetails, id },
          account: null,
        })
      ).toBe(false);
    }
  );

  it('rejects sign-in when the owner is not configured', () => {
    vi.stubEnv('WRITER_GITHUB_ID', '');
    expect(
      authOptions.callbacks.signIn({
        user: { ...userDetails, id: ownerId },
        account: null,
      })
    ).toBe(false);
  });

  it('exposes a session user only for the owner subject', () => {
    expect(sessionFor({ subject: ownerId }).user).toEqual(userDetails);
  });

  it.each(['9999', '112555957', 'winzamark123', undefined])(
    'rejects session subject %j regardless of its name, email, or adapter user',
    (subject) => {
      expect(sessionFor({ subject }).user).toBeUndefined();
    }
  );

  it('invalidates an existing owner session when the configured owner changes', () => {
    vi.stubEnv('WRITER_GITHUB_ID', '42');
    expect(sessionFor({ subject: ownerId }).user).toBeUndefined();
  });

  it('rejects sessions when the owner is not configured', async () => {
    vi.stubEnv('WRITER_GITHUB_ID', '');
    expect(sessionFor({ subject: ownerId }).user).toBeUndefined();
    expect(await writerSession()).toBeNull();
  });

  it('rejects sessions when the session secret is missing', async () => {
    vi.stubEnv('NEXTAUTH_SECRET', '');
    expect(await writerSession()).toBeNull();
  });
});
