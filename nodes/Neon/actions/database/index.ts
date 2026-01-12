/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const databaseOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['database'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new database',
        action: 'Create a database',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a database',
        action: 'Delete a database',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get database details',
        action: 'Get a database',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many databases',
        action: 'Get many databases',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update database configuration',
        action: 'Update a database',
      },
    ],
    default: 'getMany',
  },
];

export const databaseFields: INodeProperties[] = [
  // ----------------------------------
  //         database: all operations
  // ----------------------------------
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['database'],
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
        resource: ['database'],
      },
    },
    description: 'The ID of the branch',
  },

  // ----------------------------------
  //         database: get/update/delete
  // ----------------------------------
  {
    displayName: 'Database Name',
    name: 'databaseName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['database'],
        operation: ['get', 'update', 'delete'],
      },
    },
    description: 'The name of the database',
  },

  // ----------------------------------
  //         database: create
  // ----------------------------------
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['database'],
        operation: ['create'],
      },
    },
    description: 'Name for the new database',
  },
  {
    displayName: 'Owner Name',
    name: 'ownerName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['database'],
        operation: ['create'],
      },
    },
    description: 'Role name that will own the database',
  },

  // ----------------------------------
  //         database: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['database'],
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
        resource: ['database'],
        operation: ['getMany'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },

  // ----------------------------------
  //         database: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['database'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'New name for the database',
      },
      {
        displayName: 'Owner Name',
        name: 'ownerName',
        type: 'string',
        default: '',
        description: 'New owner role for the database',
      },
    ],
  },
];

export * from './execute';
