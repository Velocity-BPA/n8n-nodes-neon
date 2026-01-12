/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { neonApiRequest, neonApiRequestAllItems } from '../../transport';
import { toExecutionData, toSingleExecutionData } from '../../utils';

export async function execute(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let response: IDataObject;

  switch (operation) {
    case 'create': {
      const keyName = this.getNodeParameter('keyName', i) as string;
      response = await neonApiRequest.call(this, 'POST', '/api_keys', { key_name: keyName });
      return toSingleExecutionData(response);
    }

    case 'getMany': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;

      if (returnAll) {
        const apiKeys = await neonApiRequestAllItems.call(
          this,
          'GET',
          '/api_keys',
          'api_keys',
        );
        return toExecutionData(apiKeys);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        response = await neonApiRequest.call(this, 'GET', '/api_keys', undefined, { limit });
        const apiKeys = (response.api_keys as IDataObject[]) || [];
        return toExecutionData(apiKeys);
      }
    }

    case 'revoke': {
      const apiKeyId = this.getNodeParameter('apiKeyId', i) as string;
      response = await neonApiRequest.call(this, 'DELETE', `/api_keys/${apiKeyId}`);
      return toSingleExecutionData(response);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
