import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';

import { ProductApiModel } from '../get-products-list/get-products.models';
import { addProduct } from '../products.service';

export async function addProductHandler(
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback
): Promise<void> {
  const corsHeaders = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET',
  };

  console.log('POST product', event);

  try {
    if (!event.body) {
      callback(null, {
        statusCode: 400,
        body: 'Product not provided',
      });

      return;
    }

    let parsedProduct: ProductApiModel;

    try {
      parsedProduct = JSON.parse(event.body!);
    } catch {
      callback(null, {
        statusCode: 400,
        body: 'Invalid Product',
      });

      return;
    }

    await addProduct(parsedProduct);

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(parsedProduct),
    });
  } catch {
    callback(null, {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify('Something went wrong'),
    });
  }
}
