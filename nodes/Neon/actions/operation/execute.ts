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
  const projectId = this.getNodeParameter('projectId', i) as string;
  let response: IDataObject;

  switch (operation) {
    case 'get': {
      const operationId = this.getNodeParameter('operationId', i) as string;
      response = await neonApiRequest.call(
        this,
        'GET',
        `/projects/${projectId}/operations/${operationId}`,
      );
      return toSingleExecutionData(response);
    }

    case 'getMany': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;

      if (returnAll) {
        const operations = await neonApiRequestAllItems.call(
          this,
          'GET',
          `/projects/${projectId}/operations`,
          'operations',
        );
        return toExecutionData(operations);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        response = await neonApiRequest.call(
          this,
          'GET',
          `/projects/${projectId}/operations`,
          undefined,
          { limit },
        );
        const operations = (response.operations as IDataObject[]) || [];
        return toExecutionData(operations);
      }
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
