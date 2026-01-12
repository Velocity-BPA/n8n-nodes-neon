/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { neonApiRequest } from '../../transport';
import { toExecutionData } from '../../utils';

export async function execute(
  this: IExecuteFunctions,
  operation: string,
  _i: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getMany': {
      const response = await neonApiRequest.call(this, 'GET', '/regions');
      const regions = (response.regions as IDataObject[]) || [];
      return toExecutionData(regions);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
