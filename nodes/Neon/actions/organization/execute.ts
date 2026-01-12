/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { neonApiRequest, neonApiRequestAllItems } from '../../transport';
import { toExecutionData, toSingleExecutionData } from '../../utils';

export async function execute(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  const orgId = this.getNodeParameter('orgId', i) as string;
  let response: IDataObject;

  switch (operation) {
    case 'get': {
      response = await neonApiRequest.call(this, 'GET', `/orgs/${orgId}`);
      return toSingleExecutionData(response);
    }

    case 'listMembers': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;

      if (returnAll) {
        const members = await neonApiRequestAllItems.call(
          this,
          'GET',
          `/orgs/${orgId}/members`,
          'members',
        );
        return toExecutionData(members);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        response = await neonApiRequest.call(this, 'GET', `/orgs/${orgId}/members`, undefined, {
          limit,
        });
        const members = (response.members as IDataObject[]) || [];
        return toExecutionData(members);
      }
    }

    case 'getMember': {
      const memberId = this.getNodeParameter('memberId', i) as string;
      response = await neonApiRequest.call(this, 'GET', `/orgs/${orgId}/members/${memberId}`);
      return toSingleExecutionData(response);
    }

    case 'updateMember': {
      const memberId = this.getNodeParameter('memberId', i) as string;
      const role = this.getNodeParameter('role', i) as string;

      response = await neonApiRequest.call(this, 'PATCH', `/orgs/${orgId}/members/${memberId}`, {
        role,
      });
      return toSingleExecutionData(response);
    }

    case 'removeMember': {
      const memberId = this.getNodeParameter('memberId', i) as string;
      response = await neonApiRequest.call(this, 'DELETE', `/orgs/${orgId}/members/${memberId}`);
      return toSingleExecutionData(response);
    }

    case 'listInvitations': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;

      if (returnAll) {
        const invitations = await neonApiRequestAllItems.call(
          this,
          'GET',
          `/orgs/${orgId}/invitations`,
          'invitations',
        );
        return toExecutionData(invitations);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        response = await neonApiRequest.call(
          this,
          'GET',
          `/orgs/${orgId}/invitations`,
          undefined,
          { limit },
        );
        const invitations = (response.invitations as IDataObject[]) || [];
        return toExecutionData(invitations);
      }
    }

    case 'createInvitation': {
      const email = this.getNodeParameter('email', i) as string;
      const role = this.getNodeParameter('inviteRole', i) as string;

      response = await neonApiRequest.call(this, 'POST', `/orgs/${orgId}/invitations`, {
        email,
        role,
      });
      return toSingleExecutionData(response);
    }

    case 'listApiKeys': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;

      if (returnAll) {
        const apiKeys = await neonApiRequestAllItems.call(
          this,
          'GET',
          `/orgs/${orgId}/api_keys`,
          'api_keys',
        );
        return toExecutionData(apiKeys);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        response = await neonApiRequest.call(this, 'GET', `/orgs/${orgId}/api_keys`, undefined, {
          limit,
        });
        const apiKeys = (response.api_keys as IDataObject[]) || [];
        return toExecutionData(apiKeys);
      }
    }

    case 'createApiKey': {
      const keyName = this.getNodeParameter('keyName', i) as string;
      response = await neonApiRequest.call(this, 'POST', `/orgs/${orgId}/api_keys`, {
        key_name: keyName,
      });
      return toSingleExecutionData(response);
    }

    case 'revokeApiKey': {
      const apiKeyId = this.getNodeParameter('apiKeyId', i) as string;
      response = await neonApiRequest.call(
        this,
        'DELETE',
        `/orgs/${orgId}/api_keys/${apiKeyId}`,
      );
      return toSingleExecutionData(response);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
