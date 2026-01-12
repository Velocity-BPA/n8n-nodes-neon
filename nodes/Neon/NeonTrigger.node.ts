/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IPollFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from 'n8n-workflow';

import { neonApiRequest } from './transport';

export class NeonTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Neon Trigger',
    name: 'neonTrigger',
    icon: 'file:neon.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Starts workflow based on Neon events',
    defaults: {
      name: 'Neon Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'neonApi',
        required: true,
      },
    ],
    polling: true,
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        options: [
          {
            name: 'Branch Created',
            value: 'branch.created',
            description: 'Trigger when a new branch is created',
          },
          {
            name: 'Branch Deleted',
            value: 'branch.deleted',
            description: 'Trigger when a branch is deleted',
          },
          {
            name: 'Endpoint Started',
            value: 'endpoint.started',
            description: 'Trigger when an endpoint starts',
          },
          {
            name: 'Endpoint Suspended',
            value: 'endpoint.suspended',
            description: 'Trigger when an endpoint is suspended',
          },
          {
            name: 'Operation Completed',
            value: 'operation.completed',
            description: 'Trigger when any operation completes',
          },
          {
            name: 'Operation Failed',
            value: 'operation.failed',
            description: 'Trigger when an operation fails',
          },
          {
            name: 'Project Created',
            value: 'project.created',
            description: 'Trigger when a new project is created',
          },
        ],
        default: 'operation.completed',
        required: true,
      },
      {
        displayName: 'Project ID',
        name: 'projectId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            event: [
              'branch.created',
              'branch.deleted',
              'endpoint.started',
              'endpoint.suspended',
              'operation.completed',
              'operation.failed',
            ],
          },
        },
        description: 'The ID of the project to watch',
      },
      {
        displayName: 'Organization ID',
        name: 'orgId',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            event: ['project.created'],
          },
        },
        description: 'Organization ID to watch for new projects (optional)',
      },
    ],
  };

  async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
    const event = this.getNodeParameter('event') as string;
    const staticData = this.getWorkflowStaticData('node');
    const now = new Date();

    // Log licensing notice
    this.logger.warn(
      '[Velocity BPA Licensing Notice] This n8n node is licensed under the Business Source License 1.1 (BSL 1.1). ' +
        'Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA. ' +
        'For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.',
    );

    const events: INodeExecutionData[] = [];

    try {
      if (event === 'project.created') {
        // Watch for new projects
        const orgId = this.getNodeParameter('orgId', '') as string;
        const query: IDataObject = { limit: 20 };
        if (orgId) {
          query.org_id = orgId;
        }

        const response = await neonApiRequest.call(this, 'GET', '/projects', undefined, query);
        const projects = (response.projects as IDataObject[]) || [];

        const lastProjectId = staticData.lastProjectId as string | undefined;
        let foundLast = !lastProjectId;

        for (const project of projects) {
          if (project.id === lastProjectId) {
            foundLast = true;
            break;
          }

          if (!foundLast || !lastProjectId) {
            events.push({
              json: {
                event: 'project.created',
                project,
                timestamp: now.toISOString(),
              },
            });
          }
        }

        if (projects.length > 0) {
          staticData.lastProjectId = projects[0].id;
        }
      } else if (event.startsWith('branch.')) {
        // Watch for branch changes
        const projectId = this.getNodeParameter('projectId') as string;
        const response = await neonApiRequest.call(
          this,
          'GET',
          `/projects/${projectId}/branches`,
          undefined,
          { limit: 20 },
        );
        const branches = (response.branches as IDataObject[]) || [];

        const lastBranchIds = (staticData.branchIds as string[]) || [];
        const currentBranchIds = branches.map((b) => b.id as string);

        if (event === 'branch.created') {
          // Find new branches
          for (const branch of branches) {
            if (!lastBranchIds.includes(branch.id as string)) {
              events.push({
                json: {
                  event: 'branch.created',
                  branch,
                  timestamp: now.toISOString(),
                },
              });
            }
          }
        } else if (event === 'branch.deleted') {
          // Find deleted branches
          for (const branchId of lastBranchIds) {
            if (!currentBranchIds.includes(branchId)) {
              events.push({
                json: {
                  event: 'branch.deleted',
                  branchId,
                  timestamp: now.toISOString(),
                },
              });
            }
          }
        }

        staticData.branchIds = currentBranchIds;
      } else if (event.startsWith('endpoint.')) {
        // Watch for endpoint status changes
        const projectId = this.getNodeParameter('projectId') as string;
        const response = await neonApiRequest.call(
          this,
          'GET',
          `/projects/${projectId}/endpoints`,
          undefined,
          { limit: 20 },
        );
        const endpoints = (response.endpoints as IDataObject[]) || [];

        const lastEndpointStates = (staticData.endpointStates as IDataObject) || {};
        const currentEndpointStates: IDataObject = {};

        for (const endpoint of endpoints) {
          const id = endpoint.id as string;
          const currentState = endpoint.current_state as string;
          const previousState = lastEndpointStates[id] as string | undefined;

          currentEndpointStates[id] = currentState;

          if (previousState && previousState !== currentState) {
            if (event === 'endpoint.started' && currentState === 'active') {
              events.push({
                json: {
                  event: 'endpoint.started',
                  endpoint,
                  previousState,
                  timestamp: now.toISOString(),
                },
              });
            } else if (event === 'endpoint.suspended' && currentState === 'idle') {
              events.push({
                json: {
                  event: 'endpoint.suspended',
                  endpoint,
                  previousState,
                  timestamp: now.toISOString(),
                },
              });
            }
          }
        }

        staticData.endpointStates = currentEndpointStates;
      } else if (event.startsWith('operation.')) {
        // Watch for operation status changes
        const projectId = this.getNodeParameter('projectId') as string;
        const response = await neonApiRequest.call(
          this,
          'GET',
          `/projects/${projectId}/operations`,
          undefined,
          { limit: 20 },
        );
        const operations = (response.operations as IDataObject[]) || [];

        const lastOperationId = staticData.lastOperationId as string | undefined;
        let foundLast = !lastOperationId;

        for (const operation of operations) {
          if (operation.id === lastOperationId) {
            foundLast = true;
            break;
          }

          if (!foundLast || !lastOperationId) {
            const status = operation.status as string;

            if (event === 'operation.completed' && status === 'finished') {
              events.push({
                json: {
                  event: 'operation.completed',
                  operation,
                  timestamp: now.toISOString(),
                },
              });
            } else if (
              event === 'operation.failed' &&
              (status === 'failed' || status === 'error')
            ) {
              events.push({
                json: {
                  event: 'operation.failed',
                  operation,
                  timestamp: now.toISOString(),
                },
              });
            }
          }
        }

        if (operations.length > 0) {
          staticData.lastOperationId = operations[0].id;
        }
      }
    } catch (error) {
      // On error, return empty to avoid breaking the workflow
      this.logger.error(`Neon Trigger error: ${(error as Error).message}`);
      return null;
    }

    if (events.length === 0) {
      return null;
    }

    return [events];
  }
}
