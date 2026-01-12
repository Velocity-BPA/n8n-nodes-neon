/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  toExecutionData,
  toSingleExecutionData,
  isValidProjectId,
  isValidBranchId,
  isValidEndpointId,
  parseComputeUnits,
  formatDuration,
  buildNestedObject,
} from '../../nodes/Neon/utils';

describe('Utility Functions', () => {
  describe('toExecutionData', () => {
    it('should convert array of objects to execution data', () => {
      const data = [
        { id: '1', name: 'Project 1' },
        { id: '2', name: 'Project 2' },
      ];
      const result = toExecutionData(data);
      expect(result).toHaveLength(2);
      expect(result[0].json).toEqual({ id: '1', name: 'Project 1' });
      expect(result[1].json).toEqual({ id: '2', name: 'Project 2' });
    });

    it('should return empty array for empty input', () => {
      const result = toExecutionData([]);
      expect(result).toEqual([]);
    });
  });

  describe('toSingleExecutionData', () => {
    it('should wrap single object in execution data array', () => {
      const data = { id: '1', name: 'Project 1' };
      const result = toSingleExecutionData(data);
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ id: '1', name: 'Project 1' });
    });
  });

  describe('isValidProjectId', () => {
    it('should return true for valid project ID', () => {
      expect(isValidProjectId('project-abc-123')).toBe(true);
      expect(isValidProjectId('project-test-xyz')).toBe(true);
    });

    it('should return false for invalid project ID', () => {
      expect(isValidProjectId('abc-123')).toBe(false);
      expect(isValidProjectId('proj-abc-123')).toBe(false);
      expect(isValidProjectId('')).toBe(false);
    });
  });

  describe('isValidBranchId', () => {
    it('should return true for valid branch ID', () => {
      expect(isValidBranchId('br-abc-123')).toBe(true);
      expect(isValidBranchId('br-test-xyz')).toBe(true);
    });

    it('should return false for invalid branch ID', () => {
      expect(isValidBranchId('abc-123')).toBe(false);
      expect(isValidBranchId('branch-abc-123')).toBe(false);
      expect(isValidBranchId('')).toBe(false);
    });
  });

  describe('isValidEndpointId', () => {
    it('should return true for valid endpoint ID', () => {
      expect(isValidEndpointId('ep-abc-123')).toBe(true);
      expect(isValidEndpointId('ep-test-xyz')).toBe(true);
    });

    it('should return false for invalid endpoint ID', () => {
      expect(isValidEndpointId('abc-123')).toBe(false);
      expect(isValidEndpointId('endpoint-abc-123')).toBe(false);
      expect(isValidEndpointId('')).toBe(false);
    });
  });

  describe('parseComputeUnits', () => {
    it('should parse valid compute unit values', () => {
      expect(parseComputeUnits('0.25')).toBe(0.25);
      expect(parseComputeUnits('1')).toBe(1);
      expect(parseComputeUnits('4.5')).toBe(4.5);
      expect(parseComputeUnits(2)).toBe(2);
    });

    it('should return default for invalid values', () => {
      expect(parseComputeUnits('invalid')).toBe(0.25);
      expect(parseComputeUnits('')).toBe(0.25);
    });

    it('should clamp values to valid range', () => {
      expect(parseComputeUnits('0.1')).toBe(0.25);
      expect(parseComputeUnits('15')).toBe(10);
    });
  });

  describe('formatDuration', () => {
    it('should format seconds correctly', () => {
      expect(formatDuration(30)).toBe('30 seconds');
      expect(formatDuration(1)).toBe('1 second');
    });

    it('should format minutes correctly', () => {
      expect(formatDuration(120)).toBe('2 minutes');
      expect(formatDuration(60)).toBe('1 minute');
    });

    it('should format hours correctly', () => {
      expect(formatDuration(7200)).toBe('2 hours');
      expect(formatDuration(3600)).toBe('1 hour');
    });

    it('should format days correctly', () => {
      expect(formatDuration(172800)).toBe('2 days');
      expect(formatDuration(86400)).toBe('1 day');
    });
  });

  describe('buildNestedObject', () => {
    it('should build nested object from flat keys', () => {
      const input = {
        'settings.autoscaling.min': 0.25,
        'settings.autoscaling.max': 4,
        'settings.timeout': 300,
        'name': 'test',
      };
      const result = buildNestedObject(input);
      expect(result).toEqual({
        settings: {
          autoscaling: {
            min: 0.25,
            max: 4,
          },
          timeout: 300,
        },
        name: 'test',
      });
    });

    it('should handle empty object', () => {
      expect(buildNestedObject({})).toEqual({});
    });
  });
});
