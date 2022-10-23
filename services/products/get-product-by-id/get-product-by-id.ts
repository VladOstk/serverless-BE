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
  const products = await new Promise((resolve) =>
    setTimeout(() => {
      resolve(
        getProductById(
          event.pathParameters[GetProductByIdPathParameter.ProductId]
        )
      );
    }, 500)
  );

  if (products === null) {
    const errorReponse: HTTPErrorResponseBody = {
      errorMessage: PRODUCT_NOT_FOUND_ERROR_MESSAGE,
    };

    callback(null, {
      statusCode: 400,
      body: JSON.stringify(errorReponse),
    });

    return;
  }

  callback(null, {
    statusCode: 200,
    body: JSON.stringify(products),
  });
}
