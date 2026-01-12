/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const roleOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['role'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new role',
        action: 'Create a role',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a role',
        action: 'Delete a role',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get role details',
        action: 'Get a role',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many roles',
        action: 'Get many roles',
      },
      {
        name: 'Get Password',
        value: 'getPassword',
        description: 'Get role password',
        action: 'Get role password',
      },
      {
        name: 'Reset Password',
        value: 'resetPassword',
        description: 'Reset role password',
        action: 'Reset role password',
      },
    ],
    default: 'getMany',
  },
];

export const roleFields: INodeProperties[] = [
  // ----------------------------------
  //         role: all operations
  // ----------------------------------
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['role'],
      },
    },
    description: 'The ID of the project',
  },
  {
    displayName: 'Branch ID',
    name: 'branchId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['role'],
      },
    },
    description: 'The ID of the branch',
  },

  // ----------------------------------
  //         role: get/delete/getPassword/resetPassword
  // ----------------------------------
  {
    displayName: 'Role Name',
    name: 'roleName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['role'],
        operation: ['get', 'delete', 'getPassword', 'resetPassword'],
      },
    },
    description: 'The name of the role',
  },

  // ----------------------------------
  //         role: create
  // ----------------------------------
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['role'],
        operation: ['create'],
      },
    },
    description: 'Name for the new role',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['role'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Protected',
        name: 'protected',
        type: 'boolean',
        default: false,
        description: 'Whether the role is protected from deletion',
      },
    ],
  },

  // ----------------------------------
  //         role: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['role'],
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
        resource: ['role'],
        operation: ['getMany'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
];

export * from './execute';
