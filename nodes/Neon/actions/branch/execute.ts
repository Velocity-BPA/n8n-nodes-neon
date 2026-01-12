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
    case 'create': {
      const name = this.getNodeParameter('name', i, '') as string;
      const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
      const createEndpoint = this.getNodeParameter('createEndpoint', i, true) as boolean;

      const branch: IDataObject = {};
      if (name) branch.name = name;
      if (additionalFields.parentId) branch.parent_id = additionalFields.parentId;
      if (additionalFields.parentLsn) branch.parent_lsn = additionalFields.parentLsn;
      if (additionalFields.parentTimestamp) {
        branch.parent_timestamp = additionalFields.parentTimestamp;
      }
      if (additionalFields.protected !== undefined) {
        branch.protected = additionalFields.protected;
      }

      const body: IDataObject = { branch };

      if (createEndpoint) {
        const endpointSettings = this.getNodeParameter('endpointSettings', i, {}) as IDataObject;
        const endpoints: IDataObject[] = [
          {
            type: endpointSettings.type || 'read_write',
            ...(endpointSettings.autoscalingLimitMinCu && {
              autoscaling_limit_min_cu: endpointSettings.autoscalingLimitMinCu,
            }),
            ...(endpointSettings.autoscalingLimitMaxCu && {
              autoscaling_limit_max_cu: endpointSettings.autoscalingLimitMaxCu,
            }),
            ...(endpointSettings.suspendTimeoutSeconds !== undefined && {
              suspend_timeout_seconds: endpointSettings.suspendTimeoutSeconds,
            }),
            ...(endpointSettings.poolerEnabled !== undefined && {
              pooler_enabled: endpointSettings.poolerEnabled,
            }),
          },
        ];
        body.endpoints = endpoints;
      }

      response = await neonApiRequest.call(this, 'POST', `/projects/${projectId}/branches`, body);
      return toSingleExecutionData(response);
    }

    case 'get': {
      const branchId = this.getNodeParameter('branchId', i) as string;
      response = await neonApiRequest.call(
        this,
        'GET',
        `/projects/${projectId}/branches/${branchId}`,
      );
      return toSingleExecutionData(response);
    }

    case 'getMany': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;

      if (returnAll) {
        const branches = await neonApiRequestAllItems.call(
          this,
          'GET',
          `/projects/${projectId}/branches`,
          'branches',
        );
        return toExecutionData(branches);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        response = await neonApiRequest.call(
          this,
          'GET',
          `/projects/${projectId}/branches`,
          undefined,
          { limit },
        );
        const branches = (response.branches as IDataObject[]) || [];
        return toExecutionData(branches);
      }
    }

    case 'update': {
      const branchId = this.getNodeParameter('branchId', i) as string;
      const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

      const branch: IDataObject = {};
      if (updateFields.name) branch.name = updateFields.name;
      if (updateFields.protected !== undefined) branch.protected = updateFields.protected;

      response = await neonApiRequest.call(
        this,
        'PATCH',
        `/projects/${projectId}/branches/${branchId}`,
        { branch },
      );
      return toSingleExecutionData(response);
    }

    case 'delete': {
      const branchId = this.getNodeParameter('branchId', i) as string;
      response = await neonApiRequest.call(
        this,
        'DELETE',
        `/projects/${projectId}/branches/${branchId}`,
      );
      return toSingleExecutionData(response);
    }

    case 'setDefault': {
      const branchId = this.getNodeParameter('branchId', i) as string;
      response = await neonApiRequest.call(
        this,
        'POST',
        `/projects/${projectId}/branches/${branchId}/set_as_default`,
      );
      return toSingleExecutionData(response);
    }

    case 'restore': {
      const branchId = this.getNodeParameter('branchId', i) as string;
      const restoreOptions = this.getNodeParameter('restoreOptions', i) as IDataObject;

      const body: IDataObject = {};
      if (restoreOptions.sourceBranchId) body.source_branch_id = restoreOptions.sourceBranchId;
      if (restoreOptions.sourceLsn) body.source_lsn = restoreOptions.sourceLsn;
      if (restoreOptions.sourceTimestamp) body.source_timestamp = restoreOptions.sourceTimestamp;
      if (restoreOptions.preserveUnderName) {
        body.preserve_under_name = restoreOptions.preserveUnderName;
      }

      response = await neonApiRequest.call(
        this,
        'POST',
        `/projects/${projectId}/branches/${branchId}/restore`,
        body,
      );
      return toSingleExecutionData(response);
    }

    case 'getSchema': {
      const branchId = this.getNodeParameter('branchId', i) as string;
      const databaseName = this.getNodeParameter('databaseName', i, 'neondb') as string;
      const schemaOptions = this.getNodeParameter('schemaOptions', i, {}) as IDataObject;

      const query: IDataObject = { db_name: databaseName };
      if (schemaOptions.lsn) query.lsn = schemaOptions.lsn;
      if (schemaOptions.timestamp) query.timestamp = schemaOptions.timestamp;
      if (schemaOptions.role) query.role = schemaOptions.role;

      response = await neonApiRequest.call(
        this,
        'GET',
        `/projects/${projectId}/branches/${branchId}/schema`,
        undefined,
        query,
      );
      return toSingleExecutionData(response);
    }

    case 'compareSchema': {
      const sourceBranchId = this.getNodeParameter('sourceBranchId', i) as string;
      const targetBranchId = this.getNodeParameter('targetBranchId', i) as string;
      const databaseName = this.getNodeParameter('databaseName', i, 'neondb') as string;

      response = await neonApiRequest.call(
        this,
        'GET',
        `/projects/${projectId}/branches/${sourceBranchId}/schema/diff`,
        undefined,
        {
          target_branch_id: targetBranchId,
          db_name: databaseName,
        },
      );
      return toSingleExecutionData(response);
    }

    case 'listEndpoints': {
      const branchId = this.getNodeParameter('branchId', i) as string;
      response = await neonApiRequest.call(
        this,
        'GET',
        `/projects/${projectId}/branches/${branchId}/endpoints`,
      );
      const endpoints = (response.endpoints as IDataObject[]) || [];
      return toExecutionData(endpoints);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
