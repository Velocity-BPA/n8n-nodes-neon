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
  const projectId = this.getNodeParameter('projectId', i) as string;
  let response: IDataObject;

  switch (operation) {
    case 'create': {
      const branchId = this.getNodeParameter('branchId', i) as string;
      const name = this.getNodeParameter('name', i, '') as string;

      const body: IDataObject = { branch_id: branchId };
      if (name) body.name = name;

      response = await neonApiRequest.call(
        this,
        'POST',
        `/projects/${projectId}/snapshots`,
        body,
      );
      return toSingleExecutionData(response);
    }

    case 'get': {
      const snapshotId = this.getNodeParameter('snapshotId', i) as string;
      response = await neonApiRequest.call(
        this,
        'GET',
        `/projects/${projectId}/snapshots/${snapshotId}`,
      );
      return toSingleExecutionData(response);
    }

    case 'getMany': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;

      if (returnAll) {
        const snapshots = await neonApiRequestAllItems.call(
          this,
          'GET',
          `/projects/${projectId}/snapshots`,
          'snapshots',
        );
        return toExecutionData(snapshots);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        response = await neonApiRequest.call(
          this,
          'GET',
          `/projects/${projectId}/snapshots`,
          undefined,
          { limit },
        );
        const snapshots = (response.snapshots as IDataObject[]) || [];
        return toExecutionData(snapshots);
      }
    }

    case 'update': {
      const snapshotId = this.getNodeParameter('snapshotId', i) as string;
      const name = this.getNodeParameter('name', i) as string;

      response = await neonApiRequest.call(
        this,
        'PATCH',
        `/projects/${projectId}/snapshots/${snapshotId}`,
        { name },
      );
      return toSingleExecutionData(response);
    }

    case 'delete': {
      const snapshotId = this.getNodeParameter('snapshotId', i) as string;
      response = await neonApiRequest.call(
        this,
        'DELETE',
        `/projects/${projectId}/snapshots/${snapshotId}`,
      );
      return toSingleExecutionData(response);
    }

    case 'restore': {
      const snapshotId = this.getNodeParameter('snapshotId', i) as string;
      const targetBranchId = this.getNodeParameter('targetBranchId', i, '') as string;

      const body: IDataObject = {};
      if (targetBranchId) body.target_branch_id = targetBranchId;

      response = await neonApiRequest.call(
        this,
        'POST',
        `/projects/${projectId}/snapshots/${snapshotId}/restore`,
        body,
      );
      return toSingleExecutionData(response);
    }

    case 'getSchedule': {
      response = await neonApiRequest.call(
        this,
        'GET',
        `/projects/${projectId}/backup_schedule`,
      );
      return toSingleExecutionData(response);
    }

    case 'setSchedule': {
      const scheduleEnabled = this.getNodeParameter('scheduleEnabled', i) as boolean;
      const scheduleSettings = this.getNodeParameter('scheduleSettings', i, {}) as IDataObject;

      const body: IDataObject = { enabled: scheduleEnabled };
      if (scheduleEnabled && Object.keys(scheduleSettings).length > 0) {
        if (scheduleSettings.frequency) body.frequency = scheduleSettings.frequency;
        if (scheduleSettings.retentionDays) body.retention_days = scheduleSettings.retentionDays;
      }

      response = await neonApiRequest.call(
        this,
        'PUT',
        `/projects/${projectId}/backup_schedule`,
        body,
      );
      return toSingleExecutionData(response);
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
