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
      const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

      const role: IDataObject = { name };
      if (additionalFields.protected !== undefined) {
        role.protected = additionalFields.protected;
      }

      response = await neonApiRequest.call(
        this,
        'POST',
        `/projects/${projectId}/branches/${branchId}/roles`,
        { role },
      );
      return toSingleExecutionData(response);
    }

    case 'get': {
      const roleName = this.getNodeParameter('roleName', i) as string;
      response = await neonApiRequest.call(
        this,
        'GET',
        `/projects/${projectId}/branches/${branchId}/roles/${roleName}`,
      );
      return toSingleExecutionData(response);
    }

    case 'getMany': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;

      if (returnAll) {
        const roles = await neonApiRequestAllItems.call(
          this,
          'GET',
          `/projects/${projectId}/branches/${branchId}/roles`,
          'roles',
        );
        return toExecutionData(roles);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        response = await neonApiRequest.call(
          this,
          'GET',
          `/projects/${projectId}/branches/${branchId}/roles`,
          undefined,
          { limit },
        );
        const roles = (response.roles as IDataObject[]) || [];
        return toExecutionData(roles);
      }
    }

    case 'delete': {
      const roleName = this.getNodeParameter('roleName', i) as string;
      response = await neonApiRequest.call(
        this,
        'DELETE',
        `/projects/${projectId}/branches/${branchId}/roles/${roleName}`,
      );
      return toSingleExecutionData(response);
    }

    case 'getPassword': {
      const roleName = this.getNodeParameter('roleName', i) as string;
      response = await neonApiRequest.call(
        this,
        'GET',
        `/projects/${projectId}/branches/${branchId}/roles/${roleName}/reveal_password`,
      );
      return toSingleExecutionData(response);
    }

    case 'resetPassword': {
      const roleName = this.getNodeParameter('roleName', i) as string;
      response = await neonApiRequest.call(
        this,
        'POST',
        `/projects/${projectId}/branches/${branchId}/roles/${roleName}/reset_password`,
      );
      return toSingleExecutionData(response);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
