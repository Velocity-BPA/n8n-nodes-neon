/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const consumptionOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['consumption'],
      },
    },
    options: [
      {
        name: 'Get Account Metrics',
        value: 'getAccountMetrics',
        description: 'Get consumption metrics for account',
        action: 'Get account metrics',
      },
      {
        name: 'Get Project Metrics',
        value: 'getProjectMetrics',
        description: 'Get consumption metrics for a project',
        action: 'Get project metrics',
      },
    ],
    default: 'getAccountMetrics',
  },
];

export const consumptionFields: INodeProperties[] = [
  // ----------------------------------
  //         consumption: getProjectMetrics
  // ----------------------------------
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['consumption'],
        operation: ['getProjectMetrics'],
      },
    },
    description: 'The ID of the project',
  },

  // ----------------------------------
  //         consumption: all operations
  // ----------------------------------
  {
    displayName: 'From',
    name: 'from',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['consumption'],
      },
    },
    description: 'Start of time range (ISO 8601 format)',
  },
  {
    displayName: 'To',
    name: 'to',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['consumption'],
      },
    },
    description: 'End of time range (ISO 8601 format)',
  },
  {
    displayName: 'Granularity',
    name: 'granularity',
    type: 'options',
    options: [
      { name: 'Hourly', value: 'hourly' },
      { name: 'Daily', value: 'daily' },
      { name: 'Monthly', value: 'monthly' },
    ],
    default: 'daily',
    displayOptions: {
      show: {
        resource: ['consumption'],
      },
    },
    description: 'Granularity of the metrics',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['consumption'],
        operation: ['getAccountMetrics'],
      },
    },
    options: [
      {
        displayName: 'Organization ID',
        name: 'orgId',
        type: 'string',
        default: '',
        description: 'Organization ID for org-scoped metrics',
      },
    ],
  },
];

export * from './execute';
