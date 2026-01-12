/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const apiKeyOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['apiKey'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new API key',
        action: 'Create an API key',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many API keys',
        action: 'Get many API keys',
      },
      {
        name: 'Revoke',
        value: 'revoke',
        description: 'Revoke an API key',
        action: 'Revoke an API key',
      },
    ],
    default: 'getMany',
  },
];

export const apiKeyFields: INodeProperties[] = [
  // ----------------------------------
  //         apiKey: create
  // ----------------------------------
  {
    displayName: 'Key Name',
    name: 'keyName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['apiKey'],
        operation: ['create'],
      },
    },
    description: 'Name for the new API key',
  },

  // ----------------------------------
  //         apiKey: revoke
  // ----------------------------------
  {
    displayName: 'API Key ID',
    name: 'apiKeyId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['apiKey'],
        operation: ['revoke'],
      },
    },
    description: 'The ID of the API key to revoke',
  },

  // ----------------------------------
  //         apiKey: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['apiKey'],
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
        resource: ['apiKey'],
        operation: ['getMany'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
];

export * from './execute';
