import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
  ScanCommandInput,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import {
  ProductApiModel,
  ProductsModel,
  StocksModel,
} from './get-products-list/get-products.models';

const ddbClient = new DynamoDBClient({ region: process.env.region });

export const getProducts: (
  productsScanParams: ScanCommandInput
) => Promise<ProductsModel[]> = async (productsScanParams: ScanCommandInput) =>
  ddbClient
    .send(new ScanCommand(productsScanParams))
    .then((response) =>
      response.Items!.map((item) => unmarshall(item) as ProductsModel)
    );

export const getStocks: (
  stocksScanParams: ScanCommandInput
) => Promise<StocksModel[]> = async (stocksScanParams: ScanCommandInput) =>
  ddbClient
    .send(new ScanCommand(stocksScanParams))
    .then((response) =>
      response.Items!.map((item) => unmarshall(item) as StocksModel)
    );

export const getProductById: (id: string) => Promise<ProductApiModel | null> = (
  id: string
) =>
  ddbClient
    .send(
      new GetItemCommand({
        TableName: process.env.productsTable,
        Key: { id: { S: id } },
      })
    )
    .then((response) =>
      response.Item ? (unmarshall(response.Item) as ProductApiModel) : null
    );

export const addProduct = (product: ProductsModel) =>
  Promise.all([
    ddbClient.send(
      new PutItemCommand({
        TableName: process.env.productsTable,
        Item: marshall(product),
      })
    ),
    ddbClient.send(
      new PutItemCommand({
        TableName: process.env.stocksTable,
        Item: marshall({ product_id: product.id, count: 0 } as StocksModel),
      })
    ),
  ]);
