/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { neonApiRequest, neonApiRequestAllItems, buildRequestBody } from '../../transport';
import { toExecutionData, toSingleExecutionData } from '../../utils';

export async function execute(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let response: IDataObject;

  switch (operation) {
    case 'create': {
      const name = this.getNodeParameter('name', i) as string;
      const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

      const body: IDataObject = {
        project: {
          name,
          ...(additionalFields.pgVersion && { pg_version: additionalFields.pgVersion }),
          ...(additionalFields.regionId && { region_id: additionalFields.regionId }),
          ...(additionalFields.storePasswords !== undefined && {
            store_passwords: additionalFields.storePasswords,
          }),
          ...(additionalFields.historyRetentionSeconds && {
            history_retention_seconds: additionalFields.historyRetentionSeconds,
          }),
        },
      };

      // Add default endpoint settings if compute units are specified
      if (additionalFields.autoscalingLimitMinCu || additionalFields.autoscalingLimitMaxCu) {
        (body.project as IDataObject).default_endpoint_settings = {
          autoscaling_limit_min_cu: additionalFields.autoscalingLimitMinCu || 0.25,
          autoscaling_limit_max_cu: additionalFields.autoscalingLimitMaxCu || 1,
          suspend_timeout_seconds: additionalFields.suspendTimeoutSeconds || 300,
        };
      }

      const query: IDataObject = {};
      if (additionalFields.orgId) {
        query.org_id = additionalFields.orgId;
      }

      response = await neonApiRequest.call(this, 'POST', '/projects', body, query);
      return toSingleExecutionData(response);
    }

    case 'get': {
      const projectId = this.getNodeParameter('projectId', i) as string;
      response = await neonApiRequest.call(this, 'GET', `/projects/${projectId}`);
      return toSingleExecutionData(response);
    }

    case 'getMany': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;
      const filters = this.getNodeParameter('filters', i) as IDataObject;

      const query: IDataObject = {};
      if (filters.orgId) query.org_id = filters.orgId;
      if (filters.search) query.search = filters.search;

      if (returnAll) {
        const projects = await neonApiRequestAllItems.call(
          this,
          'GET',
          '/projects',
          'projects',
          undefined,
          query,
        );
        return toExecutionData(projects);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        query.limit = limit;
        response = await neonApiRequest.call(this, 'GET', '/projects', undefined, query);
        const projects = (response.projects as IDataObject[]) || [];
        return toExecutionData(projects);
      }
    }

    case 'listShared': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;

      if (returnAll) {
        const projects = await neonApiRequestAllItems.call(
          this,
          'GET',
          '/projects/shared',
          'projects',
        );
        return toExecutionData(projects);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        response = await neonApiRequest.call(this, 'GET', '/projects/shared', undefined, { limit });
        const projects = (response.projects as IDataObject[]) || [];
        return toExecutionData(projects);
      }
    }

    case 'update': {
      const projectId = this.getNodeParameter('projectId', i) as string;
      const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

      const projectUpdate: IDataObject = {};
      if (updateFields.name) projectUpdate.name = updateFields.name;
      if (updateFields.historyRetentionSeconds) {
        projectUpdate.history_retention_seconds = updateFields.historyRetentionSeconds;
      }

      const body = buildRequestBody({ project: projectUpdate });
      response = await neonApiRequest.call(this, 'PATCH', `/projects/${projectId}`, body);
      return toSingleExecutionData(response);
    }

    case 'delete': {
      const projectId = this.getNodeParameter('projectId', i) as string;
      response = await neonApiRequest.call(this, 'DELETE', `/projects/${projectId}`);
      return toSingleExecutionData(response);
    }

    case 'getConnectionUri': {
      const projectId = this.getNodeParameter('projectId', i) as string;
      const connectionOptions = this.getNodeParameter('connectionOptions', i) as IDataObject;

      const query: IDataObject = {};
      if (connectionOptions.branchId) query.branch_id = connectionOptions.branchId;
      if (connectionOptions.endpointId) query.endpoint_id = connectionOptions.endpointId;
      if (connectionOptions.databaseName) query.database_name = connectionOptions.databaseName;
      if (connectionOptions.roleName) query.role_name = connectionOptions.roleName;
      if (connectionOptions.pooled !== undefined) query.pooled = connectionOptions.pooled;

      response = await neonApiRequest.call(
        this,
        'GET',
        `/projects/${projectId}/connection_uri`,
        undefined,
        query,
      );
      return toSingleExecutionData(response);
    }

    case 'listPermissions': {
      const projectId = this.getNodeParameter('projectId', i) as string;
      response = await neonApiRequest.call(this, 'GET', `/projects/${projectId}/permissions`);
      const permissions = (response.project_permissions as IDataObject[]) || [];
      return toExecutionData(permissions);
    }

    case 'grantPermission': {
      const projectId = this.getNodeParameter('projectId', i) as string;
      const email = this.getNodeParameter('email', i) as string;

      const body = { email };
      response = await neonApiRequest.call(
        this,
        'POST',
        `/projects/${projectId}/permissions`,
        body,
      );
      return toSingleExecutionData(response);
    }

    case 'revokePermission': {
      const projectId = this.getNodeParameter('projectId', i) as string;
      const permissionId = this.getNodeParameter('permissionId', i) as string;

      response = await neonApiRequest.call(
        this,
        'DELETE',
        `/projects/${projectId}/permissions/${permissionId}`,
      );
      return toSingleExecutionData(response);
    }

    case 'createTransferRequest': {
      const projectId = this.getNodeParameter('projectId', i) as string;
      const targetOrgId = this.getNodeParameter('targetOrgId', i) as string;

      const body = { target_org_id: targetOrgId };
      response = await neonApiRequest.call(this, 'POST', `/projects/${projectId}/transfer`, body);
      return toSingleExecutionData(response);
    }

    case 'acceptTransfer': {
      const transferToken = this.getNodeParameter('transferToken', i) as string;

      const body = { token: transferToken };
      response = await neonApiRequest.call(this, 'POST', '/projects/transfer/accept', body);
      return toSingleExecutionData(response);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
