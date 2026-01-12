/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const operationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['operation'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Get operation details',
        action: 'Get an operation',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many operations',
        action: 'Get many operations',
      },
    ],
    default: 'getMany',
  },
];

export const operationFields: INodeProperties[] = [
  // ----------------------------------
  //         operation: all operations
  // ----------------------------------
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['operation'],
      },
    },
    description: 'The ID of the project',
  },

  // ----------------------------------
  //         operation: get
  // ----------------------------------
  {
    displayName: 'Operation ID',
    name: 'operationId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['operation'],
        operation: ['get'],
      },
    },
    description: 'The UUID of the operation',
  },

  // ----------------------------------
  //         operation: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['operation'],
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
        resource: ['operation'],
        operation: ['getMany'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
];

export * from './execute';
