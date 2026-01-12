/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['user'],
      },
    },
    options: [
      {
        name: 'Get Current',
        value: 'getCurrent',
        description: 'Get current authenticated user details',
        action: 'Get current user',
      },
      {
        name: 'List Organizations',
        value: 'listOrganizations',
        description: "List user's organizations",
        action: 'List organizations',
      },
    ],
    default: 'getCurrent',
  },
];

export const userFields: INodeProperties[] = [
  // ----------------------------------
  //         user: listOrganizations
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['listOrganizations'],
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
        resource: ['user'],
        operation: ['listOrganizations'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
];

export * from './execute';
