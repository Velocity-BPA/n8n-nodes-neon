/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { neonApiRequest } from '../../transport';
import { toSingleExecutionData } from '../../utils';

export async function execute(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getAccountMetrics': {
      const from = this.getNodeParameter('from', i) as string;
      const to = this.getNodeParameter('to', i) as string;
      const granularity = this.getNodeParameter('granularity', i) as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

      const query: IDataObject = {
        from,
        to,
        granularity,
      };

      if (additionalOptions.orgId) {
        query.org_id = additionalOptions.orgId;
      }

      const response = await neonApiRequest.call(this, 'GET', '/consumption/account', undefined, query);
      return toSingleExecutionData(response);
    }

    case 'getProjectMetrics': {
      const projectId = this.getNodeParameter('projectId', i) as string;
      const from = this.getNodeParameter('from', i) as string;
      const to = this.getNodeParameter('to', i) as string;
      const granularity = this.getNodeParameter('granularity', i) as string;

      const query: IDataObject = {
        from,
        to,
        granularity,
      };

      const response = await neonApiRequest.call(this, 'GET', `/consumption/projects/${projectId}`, undefined, query);
      return toSingleExecutionData(response);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
