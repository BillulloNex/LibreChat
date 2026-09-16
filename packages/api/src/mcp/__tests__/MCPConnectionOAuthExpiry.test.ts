import { MCPConnection } from '~/mcp/connection';

function createConnection(expiresAt?: number): MCPConnection {
  return new MCPConnection({
    serverName: 'oauth-server',
    serverConfig: { type: 'stdio', command: 'node', args: [] },
    oauthTokens: {
      access_token: 'access-token',
      token_type: 'Bearer',
      obtained_at: 1_700_000_000_000,
      expires_at: expiresAt,
    },
  });
}

describe('MCPConnection OAuth token expiry', () => {
  it('recognizes an expired seconds-based timestamp', () => {
    const connection = createConnection(1_700_000_000);

    expect(connection.isOAuthTokenExpired(1_700_000_000_001)).toBe(true);
  });

  it('recognizes a valid milliseconds-based timestamp', () => {
    const connection = createConnection(1_700_000_060_000);

    expect(connection.isOAuthTokenExpired(1_700_000_000_000)).toBe(false);
  });

  it('does not expire connections whose token has no expiry timestamp', () => {
    const connection = createConnection();

    expect(connection.isOAuthTokenExpired(1_700_000_000_000)).toBe(false);
  });
});
