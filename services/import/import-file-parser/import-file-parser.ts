import { S3Event } from 'aws-lambda';
import { S3, GetObjectCommandOutput } from '@aws-sdk/client-s3';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

export async function importFileParserHandler(event: S3Event): Promise<void> {
  const csvFileKey = event.Records[0].s3.object.key;

  const s3 = new S3({
    region: process.env.region,
  });

  const response: GetObjectCommandOutput = await s3.getObject({
    Bucket: process.env.uploadedBucket,
    Key: csvFileKey,
  });

  const resultContent = await new Promise((resolve) => {
    const csvContent: Record<string, unknown>[] = [];

    (response.Body as Readable)
      .pipe(csv())
      .on('data', (data: Record<string, unknown>) => {
        csvContent.push(data);
      })
      .on('end', () => {
        resolve(csvContent);
      });
  });

  console.log('csv content', resultContent);
}
