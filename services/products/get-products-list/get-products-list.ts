import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';

import { getProducts } from '../products.service';

export async function getProductsListHandler(
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback
): Promise<void> {
  const products = await new Promise((resolve) =>
    setTimeout(() => {
      resolve(getProducts());
    }, 500)
  );

  callback(null, {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,GET',
    },
    body: JSON.stringify(products),
  });
}
