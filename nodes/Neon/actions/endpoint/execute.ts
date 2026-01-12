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
      const branchId = this.getNodeParameter('branchId', i) as string;
      const type = this.getNodeParameter('type', i) as string;
      const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

      const endpoint: IDataObject = {
        branch_id: branchId,
        type,
      };

      if (additionalFields.regionId) endpoint.region_id = additionalFields.regionId;
      if (additionalFields.autoscalingLimitMinCu !== undefined) {
        endpoint.autoscaling_limit_min_cu = additionalFields.autoscalingLimitMinCu;
      }
      if (additionalFields.autoscalingLimitMaxCu !== undefined) {
        endpoint.autoscaling_limit_max_cu = additionalFields.autoscalingLimitMaxCu;
      }
      if (additionalFields.suspendTimeoutSeconds !== undefined) {
        endpoint.suspend_timeout_seconds = additionalFields.suspendTimeoutSeconds;
      }
      if (additionalFields.poolerEnabled !== undefined) {
        endpoint.pooler_enabled = additionalFields.poolerEnabled;
      }
      if (additionalFields.poolerMode) endpoint.pooler_mode = additionalFields.poolerMode;
      if (additionalFields.disabled !== undefined) endpoint.disabled = additionalFields.disabled;
      if (additionalFields.passwordlessAccess !== undefined) {
        endpoint.passwordless_access = additionalFields.passwordlessAccess;
      }

      response = await neonApiRequest.call(this, 'POST', `/projects/${projectId}/endpoints`, {
        endpoint,
      });
      return toSingleExecutionData(response);
    }

    case 'get': {
      const endpointId = this.getNodeParameter('endpointId', i) as string;
      response = await neonApiRequest.call(
        this,
        'GET',
        `/projects/${projectId}/endpoints/${endpointId}`,
      );
      return toSingleExecutionData(response);
    }

    case 'getMany': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;

      if (returnAll) {
        const endpoints = await neonApiRequestAllItems.call(
          this,
          'GET',
          `/projects/${projectId}/endpoints`,
          'endpoints',
        );
        return toExecutionData(endpoints);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        response = await neonApiRequest.call(
          this,
          'GET',
          `/projects/${projectId}/endpoints`,
          undefined,
          { limit },
        );
        const endpoints = (response.endpoints as IDataObject[]) || [];
        return toExecutionData(endpoints);
      }
    }

    case 'update': {
      const endpointId = this.getNodeParameter('endpointId', i) as string;
      const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

      const endpoint: IDataObject = {};
      if (updateFields.branchId) endpoint.branch_id = updateFields.branchId;
      if (updateFields.autoscalingLimitMinCu !== undefined) {
        endpoint.autoscaling_limit_min_cu = updateFields.autoscalingLimitMinCu;
      }
      if (updateFields.autoscalingLimitMaxCu !== undefined) {
        endpoint.autoscaling_limit_max_cu = updateFields.autoscalingLimitMaxCu;
      }
      if (updateFields.suspendTimeoutSeconds !== undefined) {
        endpoint.suspend_timeout_seconds = updateFields.suspendTimeoutSeconds;
      }
      if (updateFields.poolerEnabled !== undefined) {
        endpoint.pooler_enabled = updateFields.poolerEnabled;
      }
      if (updateFields.poolerMode) endpoint.pooler_mode = updateFields.poolerMode;
      if (updateFields.disabled !== undefined) endpoint.disabled = updateFields.disabled;
      if (updateFields.passwordlessAccess !== undefined) {
        endpoint.passwordless_access = updateFields.passwordlessAccess;
      }

      response = await neonApiRequest.call(
        this,
        'PATCH',
        `/projects/${projectId}/endpoints/${endpointId}`,
        { endpoint },
      );
      return toSingleExecutionData(response);
    }

    case 'delete': {
      const endpointId = this.getNodeParameter('endpointId', i) as string;
      response = await neonApiRequest.call(
        this,
        'DELETE',
        `/projects/${projectId}/endpoints/${endpointId}`,
      );
      return toSingleExecutionData(response);
    }

    case 'start': {
      const endpointId = this.getNodeParameter('endpointId', i) as string;
      response = await neonApiRequest.call(
        this,
        'POST',
        `/projects/${projectId}/endpoints/${endpointId}/start`,
      );
      return toSingleExecutionData(response);
    }

    case 'suspend': {
      const endpointId = this.getNodeParameter('endpointId', i) as string;
      response = await neonApiRequest.call(
        this,
        'POST',
        `/projects/${projectId}/endpoints/${endpointId}/suspend`,
      );
      return toSingleExecutionData(response);
    }

    case 'restart': {
      const endpointId = this.getNodeParameter('endpointId', i) as string;
      response = await neonApiRequest.call(
        this,
        'POST',
        `/projects/${projectId}/endpoints/${endpointId}/restart`,
      );
      return toSingleExecutionData(response);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
