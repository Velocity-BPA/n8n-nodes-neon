/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import { projectOperations, projectFields } from './actions/project';
import { branchOperations, branchFields } from './actions/branch';
import { endpointOperations, endpointFields } from './actions/endpoint';
import { databaseOperations, databaseFields } from './actions/database';
import { roleOperations, roleFields } from './actions/role';
import { operationOperations, operationFields } from './actions/operation';
import { snapshotOperations, snapshotFields } from './actions/snapshot';
import { organizationOperations, organizationFields } from './actions/organization';
import { userOperations, userFields } from './actions/user';
import { apiKeyOperations, apiKeyFields } from './actions/apiKey';
import { regionOperations, regionFields } from './actions/region';
import { consumptionOperations, consumptionFields } from './actions/consumption';

import { execute as executeProject } from './actions/project';
import { execute as executeBranch } from './actions/branch';
import { execute as executeEndpoint } from './actions/endpoint';
import { execute as executeDatabase } from './actions/database';
import { execute as executeRole } from './actions/role';
import { execute as executeOperation } from './actions/operation';
import { execute as executeSnapshot } from './actions/snapshot';
import { execute as executeOrganization } from './actions/organization';
import { execute as executeUser } from './actions/user';
import { execute as executeApiKey } from './actions/apiKey';
import { execute as executeRegion } from './actions/region';
import { execute as executeConsumption } from './actions/consumption';

export class Neon implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Neon',
    name: 'neon',
    icon: 'file:neon.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Neon serverless Postgres API',
    defaults: {
      name: 'Neon',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'neonApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'API Key',
            value: 'apiKey',
          },
          {
            name: 'Branch',
            value: 'branch',
          },
          {
            name: 'Consumption',
            value: 'consumption',
          },
          {
            name: 'Database',
            value: 'database',
          },
          {
            name: 'Endpoint',
            value: 'endpoint',
          },
          {
            name: 'Operation',
            value: 'operation',
          },
          {
            name: 'Organization',
            value: 'organization',
          },
          {
            name: 'Project',
            value: 'project',
          },
          {
            name: 'Region',
            value: 'region',
          },
          {
            name: 'Role',
            value: 'role',
          },
          {
            name: 'Snapshot',
            value: 'snapshot',
          },
          {
            name: 'User',
            value: 'user',
          },
        ],
        default: 'project',
      },
      // Operations
      ...projectOperations,
      ...branchOperations,
      ...endpointOperations,
      ...databaseOperations,
      ...roleOperations,
      ...operationOperations,
      ...snapshotOperations,
      ...organizationOperations,
      ...userOperations,
      ...apiKeyOperations,
      ...regionOperations,
      ...consumptionOperations,
      // Fields
      ...projectFields,
      ...branchFields,
      ...endpointFields,
      ...databaseFields,
      ...roleFields,
      ...operationFields,
      ...snapshotFields,
      ...organizationFields,
      ...userFields,
      ...apiKeyFields,
      ...regionFields,
      ...consumptionFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    // Log licensing notice (once per execution)
    this.logger.warn(
      '[Velocity BPA Licensing Notice] This n8n node is licensed under the Business Source License 1.1 (BSL 1.1). ' +
        'Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA. ' +
        'For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.',
    );

    for (let i = 0; i < items.length; i++) {
      try {
        let executionData: INodeExecutionData[] = [];

        switch (resource) {
          case 'project':
            executionData = await executeProject.call(this, operation, i);
            break;
          case 'branch':
            executionData = await executeBranch.call(this, operation, i);
            break;
          case 'endpoint':
            executionData = await executeEndpoint.call(this, operation, i);
            break;
          case 'database':
            executionData = await executeDatabase.call(this, operation, i);
            break;
          case 'role':
            executionData = await executeRole.call(this, operation, i);
            break;
          case 'operation':
            executionData = await executeOperation.call(this, operation, i);
            break;
          case 'snapshot':
            executionData = await executeSnapshot.call(this, operation, i);
            break;
          case 'organization':
            executionData = await executeOrganization.call(this, operation, i);
            break;
          case 'user':
            executionData = await executeUser.call(this, operation, i);
            break;
          case 'apiKey':
            executionData = await executeApiKey.call(this, operation, i);
            break;
          case 'region':
            executionData = await executeRegion.call(this, operation, i);
            break;
          case 'consumption':
            executionData = await executeConsumption.call(this, operation, i);
            break;
          default:
            throw new Error(`Unknown resource: ${resource}`);
        }

        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
