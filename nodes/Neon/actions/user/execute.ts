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
    case 'getCurrent': {
      response = await neonApiRequest.call(this, 'GET', '/users/me');
      return toSingleExecutionData(response);
    }

    case 'listOrganizations': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;

      if (returnAll) {
        const organizations = await neonApiRequestAllItems.call(
          this,
          'GET',
          '/users/me/organizations',
          'organizations',
        );
        return toExecutionData(organizations);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        response = await neonApiRequest.call(
          this,
          'GET',
          '/users/me/organizations',
          undefined,
          { limit },
        );
        const organizations = (response.organizations as IDataObject[]) || [];
        return toExecutionData(organizations);
      }
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
