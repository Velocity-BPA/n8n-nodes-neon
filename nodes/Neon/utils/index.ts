/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, INodeExecutionData } from 'n8n-workflow';

/**
 * Convert API response items to n8n execution data
 */
export function toExecutionData(items: IDataObject[]): INodeExecutionData[] {
  return items.map((item) => ({
    json: item,
  }));
}

/**
 * Convert a single API response to n8n execution data
 */
export function toSingleExecutionData(item: IDataObject): INodeExecutionData[] {
  return [{ json: item }];
}

/**
 * Simplify the response by extracting the main data key
 */
export function simplifyResponse(response: IDataObject, dataKey: string): IDataObject {
  if (response[dataKey] !== undefined) {
    return response[dataKey] as IDataObject;
  }
  return response;
}

/**
 * Format a timestamp for display
 */
export function formatTimestamp(timestamp: string | undefined): string {
  if (!timestamp) {
    return '';
  }
  try {
    return new Date(timestamp).toISOString();
  } catch {
    return timestamp;
  }
}

/**
 * Validate project ID format
 */
export function isValidProjectId(projectId: string): boolean {
  // Neon project IDs follow the pattern: project-xxxx-xxxx
  return /^project-[a-z0-9-]+$/i.test(projectId);
}

/**
 * Validate branch ID format
 */
export function isValidBranchId(branchId: string): boolean {
  // Neon branch IDs follow the pattern: br-xxxx-xxxx
  return /^br-[a-z0-9-]+$/i.test(branchId);
}

/**
 * Validate endpoint ID format
 */
export function isValidEndpointId(endpointId: string): boolean {
  // Neon endpoint IDs follow the pattern: ep-xxxx-xxxx
  return /^ep-[a-z0-9-]+$/i.test(endpointId);
}

/**
 * Parse compute units from string to number
 */
export function parseComputeUnits(value: string | number): number {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) {
    return 0.25; // Default value
  }
  // Clamp to valid range
  if (num < 0.25) return 0.25;
  if (num > 10) return 10;
  return num;
}

/**
 * Convert seconds to human-readable duration
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return seconds === 1 ? '1 second' : `${seconds} seconds`;
  }
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return minutes === 1 ? '1 minute' : `${minutes} minutes`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }
  const days = Math.floor(seconds / 86400);
  return days === 1 ? '1 day' : `${days} days`;
}

/**
 * Build nested object from dot notation keys
 */
export function buildNestedObject(params: IDataObject): IDataObject {
  const result: IDataObject = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    const keys = key.split('.');
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current)) {
        current[k] = {};
      }
      current = current[k] as IDataObject;
    }

    current[keys[keys.length - 1]] = value;
  }

  return result;
}

/**
 * Remove empty objects from a nested structure
 */
export function removeEmptyObjects(obj: IDataObject): IDataObject {
  const result: IDataObject = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      const cleaned = removeEmptyObjects(value as IDataObject);
      if (Object.keys(cleaned).length > 0) {
        result[key] = cleaned;
      }
    } else if (value !== '') {
      result[key] = value;
    }
  }

  return result;
}
