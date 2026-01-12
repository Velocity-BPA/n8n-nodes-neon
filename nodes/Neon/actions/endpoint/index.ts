/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const endpointOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['endpoint'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new compute endpoint',
        action: 'Create an endpoint',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a compute endpoint',
        action: 'Delete an endpoint',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get compute endpoint details',
        action: 'Get an endpoint',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many compute endpoints',
        action: 'Get many endpoints',
      },
      {
        name: 'Restart',
        value: 'restart',
        description: 'Restart a compute endpoint',
        action: 'Restart an endpoint',
      },
      {
        name: 'Start',
        value: 'start',
        description: 'Start a suspended compute endpoint',
        action: 'Start an endpoint',
      },
      {
        name: 'Suspend',
        value: 'suspend',
        description: 'Suspend a running compute endpoint',
        action: 'Suspend an endpoint',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update compute endpoint configuration',
        action: 'Update an endpoint',
      },
    ],
    default: 'getMany',
  },
];

export const endpointFields: INodeProperties[] = [
  // ----------------------------------
  //         endpoint: all operations
  // ----------------------------------
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
      },
    },
    description: 'The ID of the project',
  },

  // ----------------------------------
  //         endpoint: get/update/delete/start/suspend/restart
  // ----------------------------------
  {
    displayName: 'Endpoint ID',
    name: 'endpointId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['get', 'update', 'delete', 'start', 'suspend', 'restart'],
      },
    },
    description: 'The ID of the endpoint (format: ep-xxxx-xxxx)',
  },

  // ----------------------------------
  //         endpoint: create
  // ----------------------------------
  {
    displayName: 'Branch ID',
    name: 'branchId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['create'],
      },
    },
    description: 'The ID of the branch to attach the endpoint to',
  },
  {
    displayName: 'Endpoint Type',
    name: 'type',
    type: 'options',
    required: true,
    options: [
      { name: 'Read Write', value: 'read_write' },
      { name: 'Read Only', value: 'read_only' },
    ],
    default: 'read_write',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['create'],
      },
    },
    description: 'Type of the endpoint',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['endpoint'],
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
        displayName: 'Disabled',
        name: 'disabled',
        type: 'boolean',
        default: false,
        description: 'Whether the endpoint is disabled',
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
        displayName: 'Passwordless Access',
        name: 'passwordlessAccess',
        type: 'boolean',
        default: false,
        description: 'Whether to allow passwordless access',
      },
      {
        displayName: 'Pooler Enabled',
        name: 'poolerEnabled',
        type: 'boolean',
        default: true,
        description: 'Whether to enable connection pooling',
      },
      {
        displayName: 'Pooler Mode',
        name: 'poolerMode',
        type: 'options',
        options: [
          { name: 'Transaction', value: 'transaction' },
          { name: 'Session', value: 'session' },
        ],
        default: 'transaction',
        description: 'Connection pooler mode',
      },
      {
        displayName: 'Region',
        name: 'regionId',
        type: 'string',
        default: '',
        description: 'Region for the endpoint (uses project region if not specified)',
      },
    ],
  },

  // ----------------------------------
  //         endpoint: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['endpoint'],
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
        resource: ['endpoint'],
        operation: ['getMany'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },

  // ----------------------------------
  //         endpoint: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['update'],
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
        displayName: 'Branch ID',
        name: 'branchId',
        type: 'string',
        default: '',
        description: 'Move endpoint to a different branch',
      },
      {
        displayName: 'Disabled',
        name: 'disabled',
        type: 'boolean',
        default: false,
        description: 'Whether the endpoint is disabled',
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
        displayName: 'Passwordless Access',
        name: 'passwordlessAccess',
        type: 'boolean',
        default: false,
        description: 'Whether to allow passwordless access',
      },
      {
        displayName: 'Pooler Enabled',
        name: 'poolerEnabled',
        type: 'boolean',
        default: true,
        description: 'Whether to enable connection pooling',
      },
      {
        displayName: 'Pooler Mode',
        name: 'poolerMode',
        type: 'options',
        options: [
          { name: 'Transaction', value: 'transaction' },
          { name: 'Session', value: 'session' },
        ],
        default: 'transaction',
        description: 'Connection pooler mode',
      },
    ],
  },
];

export * from './execute';
