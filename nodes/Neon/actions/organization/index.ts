/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const organizationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['organization'],
      },
    },
    options: [
      {
        name: 'Create API Key',
        value: 'createApiKey',
        description: 'Create organization API key',
        action: 'Create API key',
      },
      {
        name: 'Create Invitation',
        value: 'createInvitation',
        description: 'Invite user to organization',
        action: 'Create invitation',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get organization details',
        action: 'Get an organization',
      },
      {
        name: 'Get Member',
        value: 'getMember',
        description: 'Get member details',
        action: 'Get member',
      },
      {
        name: 'List API Keys',
        value: 'listApiKeys',
        description: 'List organization API keys',
        action: 'List API keys',
      },
      {
        name: 'List Invitations',
        value: 'listInvitations',
        description: 'List pending invitations',
        action: 'List invitations',
      },
      {
        name: 'List Members',
        value: 'listMembers',
        description: 'List organization members',
        action: 'List members',
      },
      {
        name: 'Remove Member',
        value: 'removeMember',
        description: 'Remove member from organization',
        action: 'Remove member',
      },
      {
        name: 'Revoke API Key',
        value: 'revokeApiKey',
        description: 'Revoke organization API key',
        action: 'Revoke API key',
      },
      {
        name: 'Update Member',
        value: 'updateMember',
        description: 'Update member role',
        action: 'Update member',
      },
    ],
    default: 'get',
  },
];

export const organizationFields: INodeProperties[] = [
  // ----------------------------------
  //         organization: all operations
  // ----------------------------------
  {
    displayName: 'Organization ID',
    name: 'orgId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['organization'],
      },
    },
    description: 'The ID of the organization',
  },

  // ----------------------------------
  //         organization: getMember/updateMember/removeMember
  // ----------------------------------
  {
    displayName: 'Member ID',
    name: 'memberId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['organization'],
        operation: ['getMember', 'updateMember', 'removeMember'],
      },
    },
    description: 'The ID of the member',
  },

  // ----------------------------------
  //         organization: updateMember
  // ----------------------------------
  {
    displayName: 'Role',
    name: 'role',
    type: 'options',
    required: true,
    options: [
      { name: 'Admin', value: 'admin' },
      { name: 'Member', value: 'member' },
    ],
    default: 'member',
    displayOptions: {
      show: {
        resource: ['organization'],
        operation: ['updateMember'],
      },
    },
    description: 'New role for the member',
  },

  // ----------------------------------
  //         organization: createInvitation
  // ----------------------------------
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'user@example.com',
    displayOptions: {
      show: {
        resource: ['organization'],
        operation: ['createInvitation'],
      },
    },
    description: 'Email of the user to invite',
  },
  {
    displayName: 'Role',
    name: 'inviteRole',
    type: 'options',
    options: [
      { name: 'Admin', value: 'admin' },
      { name: 'Member', value: 'member' },
    ],
    default: 'member',
    displayOptions: {
      show: {
        resource: ['organization'],
        operation: ['createInvitation'],
      },
    },
    description: 'Role to assign to the invited user',
  },

  // ----------------------------------
  //         organization: createApiKey
  // ----------------------------------
  {
    displayName: 'API Key Name',
    name: 'keyName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['organization'],
        operation: ['createApiKey'],
      },
    },
    description: 'Name for the new API key',
  },

  // ----------------------------------
  //         organization: revokeApiKey
  // ----------------------------------
  {
    displayName: 'API Key ID',
    name: 'apiKeyId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['organization'],
        operation: ['revokeApiKey'],
      },
    },
    description: 'The ID of the API key to revoke',
  },

  // ----------------------------------
  //         organization: listMembers/listInvitations/listApiKeys
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['organization'],
        operation: ['listMembers', 'listInvitations', 'listApiKeys'],
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
        resource: ['organization'],
        operation: ['listMembers', 'listInvitations', 'listApiKeys'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
];

export * from './execute';
