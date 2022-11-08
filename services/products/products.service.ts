import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

import {
  ProductApiModel,
  ProductsModel,
  StocksModel,
} from './shared/models/product.model';

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
