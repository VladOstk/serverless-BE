import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function importProductsFileHandler(
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback
): Promise<void> {
  const corsHeaders = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET',
  };
  const contentTypeText = {
    'Content-Type': 'text/plain',
  };

  const nameQueryParam = event.queryStringParameters?.name;

  if (!nameQueryParam) {
    callback(null, {
      statusCode: 400,
      headers: corsHeaders,
      body: 'Name not provided',
    });
  }

  const client = new S3Client({ region: process.env.region });
  const command = new PutObjectCommand({
    Key: `${process.env.uploadedBucketPrefix}/${nameQueryParam}`,
    Bucket: process.env.uploadedBucket,
    ContentType: 'text/csv',
  });
  const url = await getSignedUrl(client, command, {
    expiresIn: 3600,
    signableHeaders: new Set(['content-type']),
  });

  try {
    callback(null, {
      statusCode: 200,
      headers: { ...corsHeaders, ...contentTypeText },
      body: url,
    });
  } catch {
    callback(null, {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify('Something went wrong'),
    });
  }
}
