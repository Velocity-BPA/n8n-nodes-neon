/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { buildQueryParams, buildRequestBody } from '../../nodes/Neon/transport';

describe('Transport Functions', () => {
  describe('buildQueryParams', () => {
    it('should filter out undefined values', () => {
      const params = {
        limit: 10,
        cursor: undefined,
        search: 'test',
      };
      const result = buildQueryParams(params);
      expect(result).toEqual({ limit: 10, search: 'test' });
    });

    it('should filter out null values', () => {
      const params = {
        limit: 10,
        cursor: null,
        search: 'test',
      };
      const result = buildQueryParams(params);
      expect(result).toEqual({ limit: 10, search: 'test' });
    });

    it('should filter out empty strings', () => {
      const params = {
        limit: 10,
        cursor: '',
        search: 'test',
      };
      const result = buildQueryParams(params);
      expect(result).toEqual({ limit: 10, search: 'test' });
    });

    it('should keep false boolean values', () => {
      const params = {
        enabled: false,
        disabled: true,
      };
      const result = buildQueryParams(params);
      expect(result).toEqual({ enabled: false, disabled: true });
    });

    it('should keep zero numeric values', () => {
      const params = {
        limit: 0,
        offset: 10,
      };
      const result = buildQueryParams(params);
      expect(result).toEqual({ limit: 0, offset: 10 });
    });
  });

  describe('buildRequestBody', () => {
    it('should filter out undefined values', () => {
      const body = {
        name: 'test',
        description: undefined,
        enabled: true,
      };
      const result = buildRequestBody(body);
      expect(result).toEqual({ name: 'test', enabled: true });
    });

    it('should filter out null values', () => {
      const body = {
        name: 'test',
        description: null,
        enabled: true,
      };
      const result = buildRequestBody(body);
      expect(result).toEqual({ name: 'test', enabled: true });
    });

    it('should filter out empty strings', () => {
      const body = {
        name: 'test',
        description: '',
        enabled: true,
      };
      const result = buildRequestBody(body);
      expect(result).toEqual({ name: 'test', enabled: true });
    });

    it('should keep nested objects', () => {
      const body = {
        name: 'test',
        settings: {
          autoscaling: true,
          limit: 10,
        },
      };
      const result = buildRequestBody(body);
      expect(result).toEqual({
        name: 'test',
        settings: {
          autoscaling: true,
          limit: 10,
        },
      });
    });

    it('should keep arrays', () => {
      const body = {
        name: 'test',
        tags: ['a', 'b', 'c'],
      };
      const result = buildRequestBody(body);
      expect(result).toEqual({
        name: 'test',
        tags: ['a', 'b', 'c'],
      });
    });
  });
});
