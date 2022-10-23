import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { ScanCommandInput } from '@aws-sdk/client-dynamodb';

import { HTTPErrorResponseBody } from '../../../shared/models/http-error-response-body.model';
import { getProducts, getStocks } from '../products.service';

import { PRODUCTS_RETRIEVAL_ERROR_MESSAGE } from './get-products-list.constants';
import { ProductApiModel } from './get-products.models';

export async function getProductsListHandler(
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback
): Promise<void> {
  const corsHeaders = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET',
  };

  console.log('GET /products', event);

  try {
    const productsScanParams: ScanCommandInput = {
      TableName: process.env.productsTable,
    };
    const stocksScanParams: ScanCommandInput = {
      TableName: process.env.stocksTable,
    };

    try {
      const products = await getProducts(productsScanParams);
      console.log('Success, Products retrieved', JSON.stringify(products));

      const stocks = await getStocks(stocksScanParams);
      console.log('Success, Stocks retrieved', stocks);

      const stocksMap = new Map(stocks.map((item) => [item.product_id, item]));
      const productsResponse: ProductApiModel[] = products.map((product) => ({
        ...product,
        count: stocksMap.get(product.id)!.count,
      }));

      callback(null, {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(productsResponse),
      });
    } catch (err) {
      const errorReponse: HTTPErrorResponseBody = {
        errorMessage: PRODUCTS_RETRIEVAL_ERROR_MESSAGE,
      };

      callback(null, {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify(errorReponse),
      });
    }
  } catch {
    callback(null, {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify('Something went wrong'),
    });
  }
}
