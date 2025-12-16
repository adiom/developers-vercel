# API Documentation

## Overview

This API provides endpoints for managing tasks, sessions, projects, clients, and API keys. The system supports both session-based authentication (for web interface) and API key authentication (for programmatic access).

Additionally, the API includes an MCP (Model Context Protocol) server endpoint that allows AI agents to interact with the platform programmatically using a standardized protocol.

> 📖 **Quick Start:** См. [MCP_QUICK_START.md](./MCP_QUICK_START.md) для быстрого старта с MCP сервером

## Authentication

### Session Authentication
- Used for web interface interactions
- Requires `session_token` cookie
- Automatically managed via `/auth/login` endpoint

### API Key Authentication
- Used for programmatic API access
- Requires `Authorization: Bearer {api_key}` header
- API keys can be generated via `/api/api-keys` endpoint

## Endpoints

### Tasks Management

#### Create Task
- **Method:** POST
- **Path:** `/api/tasks`
- **Authentication:** API Key (Bearer token)
- **Description:** Create a new task
- **Request Body:**
  ```json
  {
    "project_id": "number (required)",
    "title": "string (required)",
    "description": "string (optional)"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "task": {
      "id": "number",
      "title": "string",
      "project_id": "number",
      "created_at": "string (ISO date)"
    }
  }
  ```
- **Error Responses:**
  - `401 Unauthorized` - Invalid or missing API key
  - `400 Bad Request` - Missing required fields or invalid JSON
  - `500 Internal Server Error` - Database error

### Sessions Management

#### Get User Sessions
- **Method:** GET
- **Path:** `/api/sessions`
- **Authentication:** Session cookie
- **Description:** Get all active sessions for current user
- **Success Response (200):**
  ```json
  {
    "sessions": [
      {
        "id": "number",
        "token": "string",
        "ip_address": "string",
        "created_at": "string (ISO date)",
        "expires_at": "string (ISO date)"
      }
    ]
  }
  ```

#### Delete Session
- **Method:** DELETE
- **Path:** `/api/sessions`
- **Authentication:** Session cookie
- **Description:** Delete a specific session
- **Request Body:**
  ```json
  {
    "token": "string (required) - session token to delete"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "success": true
  }
  ```

### Projects Management

#### Create Project
- **Method:** POST
- **Path:** `/api/projects`
- **Authentication:** Session cookie (x-user-id header required)
- **Description:** Create a new project for a client
- **Request Body:**
  ```json
  {
    "client_id": "number (required)",
    "name": "string (required, min length 1)",
    "description": "string (optional)",
    "start_date": "string (optional, ISO date)",
    "end_date": "string (optional, ISO date)",
    "status": "string (optional) - enum: ['pending', 'in progress', 'completed', 'on hold']"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "start_date": "string (ISO date)",
    "end_date": "string (ISO date)",
    "status": "string",
    "created_at": "string (ISO date)"
  }
  ```

### Clients Management

#### Update Client
- **Method:** PUT
- **Path:** `/api/clients/[id]`
- **Authentication:** Session cookie
- **Description:** Update client information
- **Path Parameters:**
  - `id` - Client ID (number)
- **Request Body:** Partial client data
  ```json
  {
    "name": "string (optional)",
    "industry": "string (optional)",
    "contact_person": "string (optional)",
    "email": "string (optional)",
    "phone": "string (optional)",
    "address": "string (optional)"
  }
  ```

### API Keys Management

#### Generate API Key
- **Method:** POST
- **Path:** `/api/api-keys`
- **Authentication:** Session cookie
- **Description:** Generate a new API key for programmatic access
- **Request Body:**
  ```json
  {
    "name": "string (required) - name for the API key"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "apiKey": {
      "id": "number",
      "name": "string",
      "key": "string (API key value - display once only)"
    }
  }
  ```

### MCP Server (Model Context Protocol)

#### Discover MCP Tools
- **Method:** GET
- **Path:** `/api/mcp`
- **Authentication:** API Key (Bearer token)
- **Description:** Get information about available MCP tools and server capabilities
- **Success Response (200):**
  ```json
  {
    "protocol_version": "2024-11-05",
    "capabilities": {
      "tools": true
    },
    "server_info": {
      "name": "Security Assessment Platform MCP Server",
      "version": "1.0.0"
    },
    "tools": [
      {
        "name": "string",
        "description": "string",
        "inputSchema": {
          "type": "object",
          "properties": {},
          "required": []
        }
      }
    ]
  }
  ```

#### Execute MCP Tool
- **Method:** POST
- **Path:** `/api/mcp`
- **Authentication:** API Key (Bearer token)
- **Description:** Execute an MCP tool call
- **Request Body:**
  ```json
  {
    "method": "tools/call",
    "params": {
      "name": "string (required) - tool name",
      "arguments": {
        "key": "value - tool-specific arguments"
      }
    }
  }
  ```
- **Success Response (200):**
  ```json
  {
    "content": [
      {
        "type": "text",
        "text": "JSON string with tool execution result"
      }
    ]
  }
  ```

#### Available MCP Tools

1. **list_clients** - Get a list of all clients
   - No arguments required

2. **get_client** - Get detailed information about a specific client
   - Arguments: `{ "client_id": number }`

3. **create_client** - Create a new client
   - Arguments: `{ "name": string, "industry"?: string, "contact_person"?: string, "email"?: string, "phone"?: string, "address"?: string }`

4. **list_projects** - Get a list of all projects, optionally filtered by client
   - Arguments: `{ "client_id"?: number }`

5. **get_project** - Get detailed information about a specific project
   - Arguments: `{ "project_id": number }`

6. **create_project** - Create a new project for a client
   - Arguments: `{ "client_id": number, "name": string, "description"?: string, "start_date"?: string, "end_date"?: string, "status"?: "pending" | "in progress" | "completed" | "on hold" }`

7. **list_tasks** - Get a list of all tasks, optionally filtered by project
   - Arguments: `{ "project_id"?: number }`

8. **get_task** - Get detailed information about a specific task
   - Arguments: `{ "task_id": number }`

9. **create_task** - Create a new task for a project
   - Arguments: `{ "project_id": number, "title": string, "description"?: string, "assigned_to"?: number, "due_date"?: string, "status"?: "pending" | "in progress" | "completed" }`

10. **list_assessments** - Get a list of all security assessments
    - Arguments: `{ "project_id"?: number }`

11. **list_vulnerabilities** - Get a list of all vulnerabilities
    - Arguments: `{ "assessment_id"?: number }`

## CORS Support

All API endpoints include CORS headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## Error Handling

Standard HTTP status codes are used:
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `404` - Not Found (resource not found)
- `500` - Internal Server Error

Error responses include an error message and optional details:
```json
{
  "error": "Error message",
  "details": "Additional error information (optional)"
}
```

## Data Models

### Task
```typescript
interface Task {
  id: number
  project_id: number
  title: string
  description?: string
  created_at: string
}
```

### Session
```typescript
interface Session {
  id: number
  token: string
  ip_address: string
  created_at: string
  expires_at: string
}
```

### Project
```typescript
interface Project {
  id: number
  client_id: number
  name: string
  description?: string
  start_date?: string
  end_date?: string
  status: 'pending' | 'in progress' | 'completed' | 'on hold'
  created_at: string
}
```

### Client
```typescript
interface Client {
  id: number
  name: string
  industry?: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  created_at: string
  updated_at: string
}
```

## Usage Examples

### Using API Key Authentication
```bash
curl -X POST https://your-domain.com/api/tasks \
  -H "Authorization: Bearer your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "title": "New task",
    "description": "Task description"
  }'
```

### Using MCP Server

#### Discover Available Tools
```bash
curl -X GET https://your-domain.com/api/mcp \
  -H "Authorization: Bearer your_api_key_here"
```

#### Execute MCP Tool - List Clients
```bash
curl -X POST https://your-domain.com/api/mcp \
  -H "Authorization: Bearer your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "list_clients",
      "arguments": {}
    }
  }'
```

#### Execute MCP Tool - Create Task
```bash
curl -X POST https://your-domain.com/api/mcp \
  -H "Authorization: Bearer your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "create_task",
      "arguments": {
        "project_id": 1,
        "title": "Security audit",
        "description": "Conduct comprehensive security audit",
        "status": "pending"
      }
    }
  }'
```

#### Using MCP with AI Agents (TypeScript/JavaScript)
```typescript
// Example: Using MCP server with an AI agent
const mcpClient = {
  apiKey: 'your_api_key_here',
  baseUrl: 'https://your-domain.com/api/mcp',
  
  async discoverTools() {
    const response = await fetch(this.baseUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    })
    return await response.json()
  },
  
  async callTool(toolName: string, args: any) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: args
        }
      })
    })
    return await response.json()
  }
}

// Discover available tools
const tools = await mcpClient.discoverTools()
console.log('Available tools:', tools.tools)

// Create a new client
const result = await mcpClient.callTool('create_client', {
  name: 'Acme Corp',
  industry: 'Technology',
  email: 'contact@acme.com'
})
console.log('Created client:', result)
```

### Using Session Authentication (browser)
```javascript
// Session is automatically handled via cookies
fetch('/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    client_id: 1,
    name: 'New Project'
  })
})
```

## Database Schema

The API uses the following main tables:
- `users` - User accounts
- `sessions` - User sessions
- `api_keys` - API keys for programmatic access
- `clients` - Client organizations
- `projects` - Projects associated with clients
- `tasks` - Tasks within projects

## MCP Protocol Integration

The MCP (Model Context Protocol) server implements the standard protocol for AI agent integration:

- **Protocol Version:** 2024-11-05
- **Discovery Endpoint:** GET `/api/mcp` - Returns available tools and their schemas
- **Execution Endpoint:** POST `/api/mcp` - Executes tool calls with proper error handling
- **Authentication:** Uses the same API key authentication as other endpoints
- **Response Format:** Follows MCP standard with structured content blocks

### MCP Benefits

1. **Standardized Interface:** AI agents can discover and use tools without custom integration
2. **Type Safety:** Input schemas ensure proper validation of tool arguments
3. **Extensibility:** New tools can be added without breaking existing integrations
4. **Error Handling:** Structured error responses help agents recover gracefully
5. **Multi-Agent Support:** Multiple AI agents can interact with the platform simultaneously

## Security Notes

- API keys are hashed before storage using PBKDF2
- Session tokens are randomly generated and expire after 7 days
- All passwords are hashed with salt
- CORS is enabled for cross-origin requests
- Input validation is performed using Zod schemas
- MCP endpoint requires API key authentication for all operations
- Tool execution is performed in the context of the authenticated user
