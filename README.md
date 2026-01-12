# n8n-nodes-neon

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for **Neon**, the serverless Postgres platform with Git-like branching, autoscaling, and bottomless storage. This node enables workflow automation for database management, branch operations, compute endpoint control, and infrastructure management through Neon's REST API.

![n8n](https://img.shields.io/badge/n8n-community_node-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **12 Resource Categories** covering the complete Neon API
- **70+ Operations** for comprehensive database management
- **Git-like Branching** for database development workflows
- **Autoscaling Endpoints** with configurable compute units
- **Point-in-Time Restore** for branch recovery
- **Schema Comparison** between branches
- **Polling Triggers** for event-driven workflows
- **Organization Management** for team environments

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-neon`
5. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-neon
```

### Development Installation

```bash
# Clone or extract the package
cd n8n-nodes-neon

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-neon

# Restart n8n
n8n start
```

## Credentials Setup

| Field | Description |
|-------|-------------|
| **API Key** | Your Neon API key |

### How to Get Your API Key

1. Log into [Neon Console](https://console.neon.tech)
2. Click on your account avatar (top right)
3. Select **Account settings**
4. Navigate to **API keys** section
5. Click **Create new API key**
6. Name the key and click **Create**
7. Copy the API key (shown only once)

For organization-scoped operations, create API keys from organization settings.

## Resources & Operations

### Project

| Operation | Description |
|-----------|-------------|
| Create | Create a new project |
| Get | Get project details |
| Get Many | List all projects |
| List Shared | List projects shared with you |
| Update | Update project settings |
| Delete | Delete a project |
| Get Connection URI | Get connection string |
| List Permissions | List project access permissions |
| Grant Permission | Grant project access to a user |
| Revoke Permission | Revoke project access |
| Create Transfer Request | Initiate project transfer |
| Accept Transfer | Accept a project transfer |

### Branch

| Operation | Description |
|-----------|-------------|
| Create | Create a new branch |
| Get | Get branch details |
| Get Many | List all branches |
| Update | Update branch configuration |
| Delete | Delete a branch |
| Set Default | Set branch as primary |
| Restore | Restore branch to point-in-time |
| Get Schema | Get database schema |
| Compare Schema | Compare schema between branches |
| List Endpoints | List compute endpoints for branch |

### Endpoint (Compute)

| Operation | Description |
|-----------|-------------|
| Create | Create a new compute endpoint |
| Get | Get endpoint details |
| Get Many | List all endpoints |
| Update | Update endpoint configuration |
| Delete | Delete an endpoint |
| Start | Start a suspended endpoint |
| Suspend | Suspend a running endpoint |
| Restart | Restart an endpoint |

### Database

| Operation | Description |
|-----------|-------------|
| Create | Create a new database |
| Get | Get database details |
| Get Many | List databases in branch |
| Update | Update database configuration |
| Delete | Delete a database |

### Role

| Operation | Description |
|-----------|-------------|
| Create | Create a new role |
| Get | Get role details |
| Get Many | List roles in branch |
| Delete | Delete a role |
| Get Password | Retrieve role password |
| Reset Password | Reset role password |

### Operation

| Operation | Description |
|-----------|-------------|
| Get | Get operation details |
| Get Many | List operations for project |

### Snapshot

| Operation | Description |
|-----------|-------------|
| Create | Create a new snapshot |
| Get | Get snapshot details |
| Get Many | List snapshots |
| Update | Update snapshot metadata |
| Delete | Delete a snapshot |
| Restore | Restore from snapshot |
| Get Schedule | Get backup schedule |
| Set Schedule | Configure backup schedule |

### Organization

| Operation | Description |
|-----------|-------------|
| Get | Get organization details |
| List Members | List organization members |
| Get Member | Get member details |
| Update Member | Update member role |
| Remove Member | Remove member from org |
| List Invitations | List pending invitations |
| Create Invitation | Invite user to org |
| List API Keys | List organization API keys |
| Create API Key | Create org API key |
| Revoke API Key | Revoke org API key |

### User

| Operation | Description |
|-----------|-------------|
| Get Current | Get authenticated user |
| List Organizations | List user's organizations |

### API Key

| Operation | Description |
|-----------|-------------|
| Create | Create a new API key |
| Get Many | List API keys |
| Revoke | Revoke an API key |

### Region

| Operation | Description |
|-----------|-------------|
| Get Many | List available regions |

### Consumption

| Operation | Description |
|-----------|-------------|
| Get Account Metrics | Get account consumption |
| Get Project Metrics | Get project consumption |

## Trigger Node

The Neon Trigger node polls for changes and can trigger workflows based on:

- **project.created** - New project created
- **branch.created** - New branch created
- **branch.deleted** - Branch deleted
- **endpoint.started** - Endpoint started
- **endpoint.suspended** - Endpoint suspended
- **operation.completed** - Operation finished
- **operation.failed** - Operation failed

## Usage Examples

### Create a Development Branch

```json
{
  "resource": "branch",
  "operation": "create",
  "projectId": "project-xxxx-xxxx",
  "name": "feature/new-schema",
  "parentBranchId": "br-main-xxxx"
}
```

### Get Connection String

```json
{
  "resource": "project",
  "operation": "getConnectionUri",
  "projectId": "project-xxxx-xxxx",
  "connectionOptions": {
    "pooled": true,
    "databaseName": "mydb"
  }
}
```

### Create Endpoint with Autoscaling

```json
{
  "resource": "endpoint",
  "operation": "create",
  "projectId": "project-xxxx-xxxx",
  "branchId": "br-xxxx-xxxx",
  "additionalFields": {
    "autoscalingLimitMinCu": 0.25,
    "autoscalingLimitMaxCu": 4,
    "suspendTimeoutSeconds": 300
  }
}
```

## Neon Concepts

### Branching

Neon brings Git-like workflows to databases. Each branch is a copy-on-write clone that shares storage with its parent until modified. This enables:

- **Feature Branches** - Isolated environments for development
- **Preview Environments** - Database branches for PR previews
- **Testing** - Safe environments to test schema changes
- **Point-in-Time Recovery** - Restore to any moment in retention window

### Compute Endpoints

Endpoints are the compute instances that run Postgres. They can:

- **Autoscale** - Automatically adjust from 0.25 to 10 compute units
- **Scale to Zero** - Suspend when idle to save costs
- **Connection Pooling** - Built-in PgBouncer support

### Regions

Neon operates in multiple AWS regions:

| Region ID | Location |
|-----------|----------|
| aws-us-east-1 | N. Virginia |
| aws-us-east-2 | Ohio |
| aws-us-west-2 | Oregon |
| aws-eu-central-1 | Frankfurt |
| aws-eu-west-1 | Ireland |
| aws-eu-west-2 | London |
| aws-ap-southeast-1 | Singapore |
| aws-ap-southeast-2 | Sydney |

## Error Handling

The node handles common Neon API errors:

| Code | Description |
|------|-------------|
| 400 | Invalid request parameters |
| 401 | Invalid or missing API key |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Resource conflict |
| 422 | Validation errors |
| 423 | Resource locked |
| 429 | Rate limit exceeded |

## Security Best Practices

1. **API Key Security** - Store API keys in n8n credentials, never in workflow data
2. **Least Privilege** - Use project-scoped keys when possible
3. **Branch Protection** - Enable protection for production branches
4. **Password Management** - Use `storePasswords: false` for sensitive environments

## Development

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build the project
npm run build

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use

Permitted for personal, educational, research, and internal business use.

### Commercial Use

Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## Support

- [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-neon/issues)
- [Neon Documentation](https://neon.tech/docs)
- [n8n Community](https://community.n8n.io)

## Acknowledgments

- [Neon](https://neon.tech) for their excellent serverless Postgres platform and API
- [n8n](https://n8n.io) for the powerful workflow automation platform
