import {
  BatchWriteItemCommand,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';

const REGION = 'eu-west-1';
const ddbClient = new DynamoDBClient({ region: REGION });
export const params = {
  RequestItems: {
    Products: [
      {
        PutRequest: {
          Item: {
            id: { S: 'product1' },
            title: { S: 'Product 1' },
            description: { S: 'Product 1 description' },
            price: { N: '9.99' },
          },
        },
      },
      {
        PutRequest: {
          Item: {
            id: { S: 'product2' },
            title: { S: 'Product 2' },
            description: { S: 'Product 2 description' },
            price: { N: '5.99' },
          },
        },
      },
    ],
    Stocks: [
      {
        PutRequest: {
          Item: {
            product_id: { S: 'product1' },
            count: { N: '9' },
          },
        },
      },
      {
        PutRequest: {
          Item: {
            product_id: { S: 'product2' },
            count: { N: '5' },
          },
        },
      },
    ],
  },
};

export const run = async () => {
  try {
    const data = await ddbClient.send(new BatchWriteItemCommand(params));
    console.log('Success, items inserted', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};
run();
