/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const branchOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['branch'],
      },
    },
    options: [
      {
        name: 'Compare Schema',
        value: 'compareSchema',
        description: 'Compare schema between branches',
        action: 'Compare schema between branches',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new branch',
        action: 'Create a branch',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a branch',
        action: 'Delete a branch',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get branch details',
        action: 'Get a branch',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many branches',
        action: 'Get many branches',
      },
      {
        name: 'Get Schema',
        value: 'getSchema',
        description: 'Get database schema for a branch',
        action: 'Get schema',
      },
      {
        name: 'List Endpoints',
        value: 'listEndpoints',
        description: 'List compute endpoints for a branch',
        action: 'List endpoints',
      },
      {
        name: 'Restore',
        value: 'restore',
        description: 'Restore branch to a point in time',
        action: 'Restore a branch',
      },
      {
        name: 'Set Default',
        value: 'setDefault',
        description: 'Set branch as default/primary',
        action: 'Set as default',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update branch configuration',
        action: 'Update a branch',
      },
    ],
    default: 'getMany',
  },
];

export const branchFields: INodeProperties[] = [
  // ----------------------------------
  //         branch: all operations
  // ----------------------------------
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['branch'],
      },
    },
    description: 'The ID of the project',
  },

  // ----------------------------------
  //         branch: get/update/delete/setDefault/restore
  // ----------------------------------
  {
    displayName: 'Branch ID',
    name: 'branchId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: [
          'get',
          'update',
          'delete',
          'setDefault',
          'restore',
          'getSchema',
          'listEndpoints',
        ],
      },
    },
    description: 'The ID of the branch',
  },

  // ----------------------------------
  //         branch: create
  // ----------------------------------
  {
    displayName: 'Branch Name',
    name: 'name',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['create'],
      },
    },
    description: 'Name for the new branch (optional, auto-generated if not provided)',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Parent Branch ID',
        name: 'parentId',
        type: 'string',
        default: '',
        description: 'Parent branch ID (uses default branch if not specified)',
      },
      {
        displayName: 'Parent LSN',
        name: 'parentLsn',
        type: 'string',
        default: '',
        description: 'Parent Log Sequence Number for point-in-time branching',
      },
      {
        displayName: 'Parent Timestamp',
        name: 'parentTimestamp',
        type: 'dateTime',
        default: '',
        description: 'Point-in-time to branch from (ISO 8601 format)',
      },
      {
        displayName: 'Protected',
        name: 'protected',
        type: 'boolean',
        default: false,
        description: 'Whether the branch is protected from deletion',
      },
    ],
  },
  {
    displayName: 'Create Endpoint',
    name: 'createEndpoint',
    type: 'boolean',
    default: true,
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['create'],
      },
    },
    description: 'Whether to create a compute endpoint for the branch',
  },
  {
    displayName: 'Endpoint Settings',
    name: 'endpointSettings',
    type: 'collection',
    placeholder: 'Add Setting',
    default: {},
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['create'],
        createEndpoint: [true],
      },
    },
    options: [
      {
        displayName: 'Auto-Suspend Timeout (Seconds)',
        name: 'suspendTimeoutSeconds',
        type: 'number',
        default: 300,
        description: 'Seconds of inactivity before auto-suspend (0 to disable)',
      },
      {
        displayName: 'Max Compute Units',
        name: 'autoscalingLimitMaxCu',
        type: 'number',
        default: 1,
        description: 'Maximum compute units (0.25-10)',
      },
      {
        displayName: 'Min Compute Units',
        name: 'autoscalingLimitMinCu',
        type: 'number',
        default: 0.25,
        description: 'Minimum compute units (0.25-10)',
      },
      {
        displayName: 'Pooler Enabled',
        name: 'poolerEnabled',
        type: 'boolean',
        default: true,
        description: 'Whether to enable connection pooling',
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
          { name: 'Read Write', value: 'read_write' },
          { name: 'Read Only', value: 'read_only' },
        ],
        default: 'read_write',
        description: 'Endpoint type',
      },
    ],
  },

  // ----------------------------------
  //         branch: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['getMany'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['getMany'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },

  // ----------------------------------
  //         branch: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'New name for the branch',
      },
      {
        displayName: 'Protected',
        name: 'protected',
        type: 'boolean',
        default: false,
        description: 'Whether the branch is protected from deletion',
      },
    ],
  },

  // ----------------------------------
  //         branch: restore
  // ----------------------------------
  {
    displayName: 'Restore Options',
    name: 'restoreOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['restore'],
      },
    },
    options: [
      {
        displayName: 'Source Branch ID',
        name: 'sourceBranchId',
        type: 'string',
        default: '',
        description: 'Source branch ID to restore from',
      },
      {
        displayName: 'Source LSN',
        name: 'sourceLsn',
        type: 'string',
        default: '',
        description: 'Log Sequence Number to restore to',
      },
      {
        displayName: 'Source Timestamp',
        name: 'sourceTimestamp',
        type: 'dateTime',
        default: '',
        description: 'Point-in-time to restore to (ISO 8601 format)',
      },
      {
        displayName: 'Preserve Under Name',
        name: 'preserveUnderName',
        type: 'string',
        default: '',
        description: 'Preserve current state under this branch name before restoring',
      },
    ],
  },

  // ----------------------------------
  //         branch: getSchema
  // ----------------------------------
  {
    displayName: 'Database Name',
    name: 'databaseName',
    type: 'string',
    default: 'neondb',
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['getSchema'],
      },
    },
    description: 'Database name to get schema for',
  },
  {
    displayName: 'Schema Options',
    name: 'schemaOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['getSchema'],
      },
    },
    options: [
      {
        displayName: 'LSN',
        name: 'lsn',
        type: 'string',
        default: '',
        description: 'Log Sequence Number for schema at specific point',
      },
      {
        displayName: 'Role',
        name: 'role',
        type: 'string',
        default: '',
        description: 'Role to use for schema retrieval',
      },
      {
        displayName: 'Timestamp',
        name: 'timestamp',
        type: 'dateTime',
        default: '',
        description: 'Point-in-time for schema (ISO 8601 format)',
      },
    ],
  },

  // ----------------------------------
  //         branch: compareSchema
  // ----------------------------------
  {
    displayName: 'Source Branch ID',
    name: 'sourceBranchId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['compareSchema'],
      },
    },
    description: 'Source branch ID for comparison',
  },
  {
    displayName: 'Target Branch ID',
    name: 'targetBranchId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['compareSchema'],
      },
    },
    description: 'Target branch ID for comparison',
  },
  {
    displayName: 'Database Name',
    name: 'databaseName',
    type: 'string',
    default: 'neondb',
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['compareSchema'],
      },
    },
    description: 'Database name to compare schema for',
  },
];

export * from './execute';
