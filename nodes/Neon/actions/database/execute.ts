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
  const branchId = this.getNodeParameter('branchId', i) as string;
  let response: IDataObject;

  switch (operation) {
    case 'create': {
      const name = this.getNodeParameter('name', i) as string;
      const ownerName = this.getNodeParameter('ownerName', i) as string;

      const body = {
        database: {
          name,
          owner_name: ownerName,
        },
      };

      response = await neonApiRequest.call(
        this,
        'POST',
        `/projects/${projectId}/branches/${branchId}/databases`,
        body,
      );
      return toSingleExecutionData(response);
    }

    case 'get': {
      const databaseName = this.getNodeParameter('databaseName', i) as string;
      response = await neonApiRequest.call(
        this,
        'GET',
        `/projects/${projectId}/branches/${branchId}/databases/${databaseName}`,
      );
      return toSingleExecutionData(response);
    }

    case 'getMany': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;

      if (returnAll) {
        const databases = await neonApiRequestAllItems.call(
          this,
          'GET',
          `/projects/${projectId}/branches/${branchId}/databases`,
          'databases',
        );
        return toExecutionData(databases);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        response = await neonApiRequest.call(
          this,
          'GET',
          `/projects/${projectId}/branches/${branchId}/databases`,
          undefined,
          { limit },
        );
        const databases = (response.databases as IDataObject[]) || [];
        return toExecutionData(databases);
      }
    }

    case 'update': {
      const databaseName = this.getNodeParameter('databaseName', i) as string;
      const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

      const database: IDataObject = {};
      if (updateFields.name) database.name = updateFields.name;
      if (updateFields.ownerName) database.owner_name = updateFields.ownerName;

      response = await neonApiRequest.call(
        this,
        'PATCH',
        `/projects/${projectId}/branches/${branchId}/databases/${databaseName}`,
        { database },
      );
      return toSingleExecutionData(response);
    }

    case 'delete': {
      const databaseName = this.getNodeParameter('databaseName', i) as string;
      response = await neonApiRequest.call(
        this,
        'DELETE',
        `/projects/${projectId}/branches/${branchId}/databases/${databaseName}`,
      );
      return toSingleExecutionData(response);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
