import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { ProductApiModel, ProductsModel, StocksModel } from '../models';

const ddbClient = new DynamoDBClient({ region: process.env.region });

export const addProduct = (product: ProductApiModel) => {
  const isInvalidProduct =
    product.id == null ||
    product.price == null ||
    product.title == null ||
    product.count == null;

  if (isInvalidProduct) {
    const errorMessage = `Invalid product ${JSON.stringify(product)}`;

    console.error(errorMessage);

    return Promise.reject(errorMessage);
  }

  return Promise.all([
    ddbClient.send(
      new PutItemCommand({
        TableName: process.env.productsTable,
        Item: marshall({
          id: product.id,
          description: product.description,
          price: product.price,
          title: product.title,
        } as ProductsModel),
      })
    ),
    ddbClient.send(
      new PutItemCommand({
        TableName: process.env.stocksTable,
        Item: marshall({
          product_id: product.id,
          count: product.count,
        } as StocksModel),
      })
    ),
  ]);
};
