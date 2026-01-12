/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const snapshotOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['snapshot'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new snapshot',
        action: 'Create a snapshot',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a snapshot',
        action: 'Delete a snapshot',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get snapshot details',
        action: 'Get a snapshot',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many snapshots',
        action: 'Get many snapshots',
      },
      {
        name: 'Get Schedule',
        value: 'getSchedule',
        description: 'Get backup schedule',
        action: 'Get backup schedule',
      },
      {
        name: 'Restore',
        value: 'restore',
        description: 'Restore from snapshot',
        action: 'Restore from snapshot',
      },
      {
        name: 'Set Schedule',
        value: 'setSchedule',
        description: 'Configure backup schedule',
        action: 'Set backup schedule',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update snapshot metadata',
        action: 'Update a snapshot',
      },
    ],
    default: 'getMany',
  },
];

export const snapshotFields: INodeProperties[] = [
  // ----------------------------------
  //         snapshot: all operations
  // ----------------------------------
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['snapshot'],
      },
    },
    description: 'The ID of the project',
  },

  // ----------------------------------
  //         snapshot: get/update/delete/restore
  // ----------------------------------
  {
    displayName: 'Snapshot ID',
    name: 'snapshotId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['snapshot'],
        operation: ['get', 'update', 'delete', 'restore'],
      },
    },
    description: 'The ID of the snapshot',
  },

  // ----------------------------------
  //         snapshot: create
  // ----------------------------------
  {
    displayName: 'Branch ID',
    name: 'branchId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['snapshot'],
        operation: ['create'],
      },
    },
    description: 'The ID of the branch to snapshot',
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['snapshot'],
        operation: ['create'],
      },
    },
    description: 'Name for the snapshot (optional)',
  },

  // ----------------------------------
  //         snapshot: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['snapshot'],
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
        resource: ['snapshot'],
        operation: ['getMany'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },

  // ----------------------------------
  //         snapshot: update
  // ----------------------------------
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['snapshot'],
        operation: ['update'],
      },
    },
    description: 'New name for the snapshot',
  },

  // ----------------------------------
  //         snapshot: restore
  // ----------------------------------
  {
    displayName: 'Target Branch ID',
    name: 'targetBranchId',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['snapshot'],
        operation: ['restore'],
      },
    },
    description: 'Branch ID to restore to (creates new branch if not specified)',
  },

  // ----------------------------------
  //         snapshot: setSchedule
  // ----------------------------------
  {
    displayName: 'Schedule Enabled',
    name: 'scheduleEnabled',
    type: 'boolean',
    default: true,
    displayOptions: {
      show: {
        resource: ['snapshot'],
        operation: ['setSchedule'],
      },
    },
    description: 'Whether the backup schedule is enabled',
  },
  {
    displayName: 'Schedule Settings',
    name: 'scheduleSettings',
    type: 'collection',
    placeholder: 'Add Setting',
    default: {},
    displayOptions: {
      show: {
        resource: ['snapshot'],
        operation: ['setSchedule'],
        scheduleEnabled: [true],
      },
    },
    options: [
      {
        displayName: 'Frequency',
        name: 'frequency',
        type: 'options',
        options: [
          { name: 'Daily', value: 'daily' },
          { name: 'Weekly', value: 'weekly' },
        ],
        default: 'daily',
        description: 'Backup frequency',
      },
      {
        displayName: 'Retention Days',
        name: 'retentionDays',
        type: 'number',
        default: 7,
        description: 'Number of days to retain backups',
      },
    ],
  },
];

export * from './execute';
