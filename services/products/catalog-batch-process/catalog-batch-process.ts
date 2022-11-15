import { PutItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { SQSEvent } from 'aws-lambda';

import { addProduct } from '../shared/commands';
import { ProductApiModel } from '../shared/models';

export async function catalogBatchProcessHandler(
  event: SQSEvent
): Promise<unknown> {
  const addProductCommands = event.Records.reduce<
    Promise<PutItemCommandOutput[]>[]
  >((acc, record) => {
    let product: ProductApiModel;

    try {
      console.log('Parse product', record.body);

      product = JSON.parse(record.body);
    } catch (error) {
      console.error(`Error while parsing product: ${record.body}`);

      return acc;
    }

    acc.push(addProduct(product));

    return acc;
  }, []);

  return Promise.all(addProductCommands).then(() => {
    const snsClient = new SNSClient({ region: process.env.region });

    return snsClient.send(
      new PublishCommand({
        Subject: 'New Products added',
        Message: 'New products added to dynamodb',
        TopicArn: process.env.snsArn,
      })
    );
  });
}
