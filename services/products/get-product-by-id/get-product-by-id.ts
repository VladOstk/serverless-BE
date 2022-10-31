import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';

import { HTTPErrorResponseBody } from '../../../shared/models/http-error-response-body.model';
import { getProductById } from '../products.service';

import {
  GetProductByIdPathParameter,
  PRODUCT_NOT_FOUND_ERROR_MESSAGE,
} from './get-product-by-id.constants';

export async function getProductByIdHandler(
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback
): Promise<void> {
  const corsHeaders = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET',
  };

  console.log('GET /products/{productId}', event);

  try {
    const product = await getProductById(
      event.pathParameters![GetProductByIdPathParameter.ProductId]!
    );

    if (product === null) {
      const errorReponse: HTTPErrorResponseBody = {
        errorMessage: PRODUCT_NOT_FOUND_ERROR_MESSAGE,
      };

      callback(null, {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify(errorReponse),
      });

      return;
    }

    callback(null, {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(product),
    });
  } catch {
    callback(null, {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify('Something went wrong'),
    });
  }
}
