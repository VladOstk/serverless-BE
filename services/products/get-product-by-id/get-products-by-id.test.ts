import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

import { HTTPErrorResponseBody } from '../../../shared/models/http-error-response-body.model';

import { getProductByIdHandler } from './get-product-by-id';
import {
  GetProductByIdPathParameter,
  PRODUCT_NOT_FOUND_ERROR_MESSAGE,
} from './get-product-by-id.constants';

test('should return product for valid id', async () => {
  const validId = '1';
  const apiGatewayEventMock: Partial<APIGatewayEvent> = {
    pathParameters: { [GetProductByIdPathParameter.ProductId]: validId },
  };
  const callbackSpy = jest.fn((err, result) => void 0);

  await getProductByIdHandler(
    apiGatewayEventMock as APIGatewayEvent,
    null,
    callbackSpy
  );

  const result: APIGatewayProxyResult = callbackSpy.mock.calls[0][1];

  expect(result.statusCode).toBe(200);
  expect(JSON.parse(result.body)).toBeTruthy();
});

test('should return error for invalid id', async () => {
  const invalidId = '3';
  const apiGatewayEventMock: Partial<APIGatewayEvent> = {
    pathParameters: { [GetProductByIdPathParameter.ProductId]: invalidId },
  };
  const expectedError: HTTPErrorResponseBody = {
    errorMessage: PRODUCT_NOT_FOUND_ERROR_MESSAGE,
  };
  const callbackSpy = jest.fn((err, result) => void 0);

  await getProductByIdHandler(
    apiGatewayEventMock as APIGatewayEvent,
    null,
    callbackSpy
  );

  const result: APIGatewayProxyResult = callbackSpy.mock.calls[0][1];

  expect(result.statusCode).toBe(400);
  expect(JSON.parse(result.body)).toStrictEqual(expectedError);
});
