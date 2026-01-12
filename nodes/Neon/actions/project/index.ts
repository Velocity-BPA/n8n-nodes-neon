/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['project'],
      },
    },
    options: [
      {
        name: 'Accept Transfer',
        value: 'acceptTransfer',
        description: 'Accept a project transfer',
        action: 'Accept a project transfer',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new project',
        action: 'Create a project',
      },
      {
        name: 'Create Transfer Request',
        value: 'createTransferRequest',
        description: 'Create a project transfer request',
        action: 'Create a project transfer request',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a project',
        action: 'Delete a project',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get project details',
        action: 'Get a project',
      },
      {
        name: 'Get Connection URI',
        value: 'getConnectionUri',
        description: 'Get connection string for a project',
        action: 'Get connection URI',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many projects',
        action: 'Get many projects',
      },
      {
        name: 'Grant Permission',
        value: 'grantPermission',
        description: 'Grant project access to a user',
        action: 'Grant permission',
      },
      {
        name: 'List Permissions',
        value: 'listPermissions',
        description: 'List project access permissions',
        action: 'List permissions',
      },
      {
        name: 'List Shared',
        value: 'listShared',
        description: 'List projects shared with you',
        action: 'List shared projects',
      },
      {
        name: 'Revoke Permission',
        value: 'revokePermission',
        description: 'Revoke project access from a user',
        action: 'Revoke permission',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update project settings',
        action: 'Update a project',
      },
    ],
    default: 'getMany',
  },
];

export const projectFields: INodeProperties[] = [
  // ----------------------------------
  //         project: create
  // ----------------------------------
  {
    displayName: 'Project Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
    description: 'Name for the new project',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
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
        displayName: 'History Retention (Seconds)',
        name: 'historyRetentionSeconds',
        type: 'number',
        default: 604800,
        description: 'Log/branch history retention period in seconds',
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
        displayName: 'Organization ID',
        name: 'orgId',
        type: 'string',
        default: '',
        description: 'Organization ID for org-scoped projects',
      },
      {
        displayName: 'PostgreSQL Version',
        name: 'pgVersion',
        type: 'options',
        options: [
          { name: 'PostgreSQL 14', value: '14' },
          { name: 'PostgreSQL 15', value: '15' },
          { name: 'PostgreSQL 16', value: '16' },
          { name: 'PostgreSQL 17', value: '17' },
        ],
        default: '16',
        description: 'PostgreSQL version for the project',
      },
      {
        displayName: 'Region',
        name: 'regionId',
        type: 'options',
        options: [
          { name: 'AWS US East 1 (N. Virginia)', value: 'aws-us-east-1' },
          { name: 'AWS US East 2 (Ohio)', value: 'aws-us-east-2' },
          { name: 'AWS US West 2 (Oregon)', value: 'aws-us-west-2' },
          { name: 'AWS EU Central 1 (Frankfurt)', value: 'aws-eu-central-1' },
          { name: 'AWS EU West 1 (Ireland)', value: 'aws-eu-west-1' },
          { name: 'AWS EU West 2 (London)', value: 'aws-eu-west-2' },
          { name: 'AWS AP Southeast 1 (Singapore)', value: 'aws-ap-southeast-1' },
          { name: 'AWS AP Southeast 2 (Sydney)', value: 'aws-ap-southeast-2' },
        ],
        default: 'aws-us-east-1',
        description: 'Region for the project',
      },
      {
        displayName: 'Store Passwords',
        name: 'storePasswords',
        type: 'boolean',
        default: true,
        description: 'Whether to store passwords in Neon',
      },
    ],
  },

  // ----------------------------------
  //         project: get/update/delete
  // ----------------------------------
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: [
          'get',
          'update',
          'delete',
          'getConnectionUri',
          'listPermissions',
          'grantPermission',
          'revokePermission',
          'createTransferRequest',
        ],
      },
    },
    description: 'The ID of the project',
  },

  // ----------------------------------
  //         project: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'History Retention (Seconds)',
        name: 'historyRetentionSeconds',
        type: 'number',
        default: 604800,
        description: 'Log/branch history retention period in seconds',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'New name for the project',
      },
    ],
  },

  // ----------------------------------
  //         project: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['getMany', 'listShared'],
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
        resource: ['project'],
        operation: ['getMany', 'listShared'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Organization ID',
        name: 'orgId',
        type: 'string',
        default: '',
        description: 'Filter by organization ID',
      },
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search projects by name',
      },
    ],
  },

  // ----------------------------------
  //         project: getConnectionUri
  // ----------------------------------
  {
    displayName: 'Connection Options',
    name: 'connectionOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['getConnectionUri'],
      },
    },
    options: [
      {
        displayName: 'Branch ID',
        name: 'branchId',
        type: 'string',
        default: '',
        description: 'Branch ID (uses default branch if not specified)',
      },
      {
        displayName: 'Database Name',
        name: 'databaseName',
        type: 'string',
        default: 'neondb',
        description: 'Database name',
      },
      {
        displayName: 'Endpoint ID',
        name: 'endpointId',
        type: 'string',
        default: '',
        description: 'Endpoint ID',
      },
      {
        displayName: 'Pooled',
        name: 'pooled',
        type: 'boolean',
        default: true,
        description: 'Whether to use connection pooling',
      },
      {
        displayName: 'Role Name',
        name: 'roleName',
        type: 'string',
        default: '',
        description: 'Role name for connection',
      },
    ],
  },

  // ----------------------------------
  //         project: grantPermission
  // ----------------------------------
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['grantPermission'],
      },
    },
    description: 'Email of the user to grant access to',
  },

  // ----------------------------------
  //         project: revokePermission
  // ----------------------------------
  {
    displayName: 'Permission ID',
    name: 'permissionId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['revokePermission'],
      },
    },
    description: 'ID of the permission to revoke',
  },

  // ----------------------------------
  //         project: createTransferRequest
  // ----------------------------------
  {
    displayName: 'Target Organization ID',
    name: 'targetOrgId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['createTransferRequest'],
      },
    },
    description: 'Organization ID to transfer the project to',
  },

  // ----------------------------------
  //         project: acceptTransfer
  // ----------------------------------
  {
    displayName: 'Transfer Token',
    name: 'transferToken',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['acceptTransfer'],
      },
    },
    description: 'Transfer token received from the transfer request',
  },
];

export * from './execute';
