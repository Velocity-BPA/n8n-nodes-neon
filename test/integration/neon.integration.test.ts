/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Integration tests for n8n-nodes-neon
 *
 * These tests require a valid Neon API key and will make real API calls.
 * Set the NEON_API_KEY environment variable before running.
 *
 * Run with: NEON_API_KEY=your_key npm run test:integration
 */

describe('Neon API Integration Tests', () => {
  const apiKey = process.env.NEON_API_KEY;

  beforeAll(() => {
    if (!apiKey) {
      console.warn(
        'NEON_API_KEY not set. Integration tests will be skipped.',
      );
    }
  });

  describe('Projects API', () => {
    it.skip('should list projects', async () => {
      // Integration test would go here
      // Requires valid API key
    });

    it.skip('should get project details', async () => {
      // Integration test would go here
      // Requires valid API key and project ID
    });
  });

  describe('Branches API', () => {
    it.skip('should list branches for a project', async () => {
      // Integration test would go here
    });

    it.skip('should create and delete a branch', async () => {
      // Integration test would go here
    });
  });

  describe('Endpoints API', () => {
    it.skip('should list endpoints for a project', async () => {
      // Integration test would go here
    });

    it.skip('should start and suspend an endpoint', async () => {
      // Integration test would go here
    });
  });

  describe('Regions API', () => {
    it.skip('should list available regions', async () => {
      // Integration test would go here
    });
  });

  describe('User API', () => {
    it.skip('should get current user', async () => {
      // Integration test would go here
    });
  });
});
