/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IPollFunctions,
  IDataObject,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const BASE_URL = 'https://console.neon.tech/api/v2';

export interface PaginatedResponse<T> {
  data: T[];
  pagination?: {
    cursor?: string;
  };
}

/**
 * Make a request to the Neon API
 */
export async function neonApiRequest(
  this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IPollFunctions,
  method: string,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
): Promise<IDataObject> {
  const options: IDataObject = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    json: true,
  };

  if (body && Object.keys(body).length > 0) {
    options.body = body;
  }

  if (query && Object.keys(query).length > 0) {
    options.qs = query;
  }

  try {
    const response = await this.helpers.requestWithAuthentication.call(this, 'neonApi', options);
    return response as IDataObject;
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject, {
      message: getErrorMessage(error as JsonObject),
    });
  }
}

/**
 * Make a paginated request to the Neon API and return all items
 */
export async function neonApiRequestAllItems(
  this: IExecuteFunctions | IHookFunctions,
  method: string,
  endpoint: string,
  dataKey: string,
  body?: IDataObject,
  query?: IDataObject,
): Promise<IDataObject[]> {
  const returnData: IDataObject[] = [];
  let cursor: string | undefined;

  do {
    const qs: IDataObject = { ...query };
    if (cursor) {
      qs.cursor = cursor;
    }

    const response = await neonApiRequest.call(this, method, endpoint, body, qs);

    const items = response[dataKey];
    if (items && Array.isArray(items)) {
      returnData.push(...(items as IDataObject[]));
    }

    // Check for pagination cursor
    const pagination = response.pagination as IDataObject | undefined;
    cursor = pagination?.cursor as string | undefined;
  } while (cursor);

  return returnData;
}

/**
 * Wait for an async operation to complete
 */
export async function waitForOperation(
  this: IExecuteFunctions,
  projectId: string,
  operationId: string,
  timeout: number = 300000,
): Promise<IDataObject> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const response = await neonApiRequest.call(
      this,
      'GET',
      `/projects/${projectId}/operations/${operationId}`,
    );

    const operation = response.operation as IDataObject;
    const status = operation.status as string;

    if (status === 'finished') {
      return response;
    }

    if (status === 'failed' || status === 'error') {
      const errorMessage = (operation.error as string) || 'Unknown error';
      throw new Error(`Operation failed: ${errorMessage}`);
    }

    // Wait 2 seconds before polling again
    await sleep(2000);
  }

  throw new Error(`Operation timed out after ${timeout / 1000} seconds`);
}

/**
 * Extract error message from API error response
 */
function getErrorMessage(error: JsonObject): string {
  if (error.message) {
    return String(error.message);
  }
  if (error.error && typeof error.error === 'object') {
    const errorObj = error.error as JsonObject;
    if (errorObj.message) {
      return String(errorObj.message);
    }
  }
  return 'An unknown error occurred';
}

/**
 * Sleep utility for polling
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Build query parameters, filtering out undefined values
 */
export function buildQueryParams(params: Record<string, unknown>): IDataObject {
  const query: IDataObject = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      query[key] = value;
    }
  }
  return query;
}

/**
 * Build request body, filtering out undefined values
 */
export function buildRequestBody(params: Record<string, unknown>): IDataObject {
  const body: IDataObject = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      body[key] = value;
    }
  }
  return body;
}
