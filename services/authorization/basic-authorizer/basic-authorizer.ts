import {
  APIGatewayRequestAuthorizerEventV2,
  APIGatewaySimpleAuthorizerResult,
} from 'aws-lambda';

export async function basicAuthorizerHandler(
  event: APIGatewayRequestAuthorizerEventV2
): Promise<APIGatewaySimpleAuthorizerResult> {
  console.log(event);

  const authHeader = event.headers?.authorization;

  if (!authHeader) {
    return Promise.resolve({ isAuthorized: false });
  }

  const [tokenType, token] = authHeader.split(' ');
  const [username, password] = Buffer.from(token, 'base64')
    .toString('ascii')
    .split(':');

  if (!process.env[username] || process.env[username] !== password) {
    return Promise.resolve({ isAuthorized: false });
  }

  return Promise.resolve({
    isAuthorized: true,
  });
}
