import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserByApiKey } from "@/lib/auth"

// MCP Protocol Version
const MCP_VERSION = "2024-11-05"

// Server capabilities
const SERVER_CAPABILITIES = {
  tools: {
    listChanged: false
  },
  logging: {}
}

const SERVER_INFO = {
  name: "Security Assessment Platform MCP Servмer",
  version: "1.0.0"
}

// Helper function to add CORS headers
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 })
  return addCorsHeaders(response)
}

// MCP Tools Definition
const MCP_TOOLS: Array<{
  name: string
  description: string
  inputSchema: {
    type: "object"
    properties?: Record<string, any>
    required?: string[]
  }
}> = [
  {
    name: "list_clients",
    description: "Get a list of all clients",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "get_client",
    description: "Get detailed information about a specific client",
    inputSchema: {
      type: "object",
      properties: {
        client_id: {
          type: "number",
          description: "The ID of the client"
        }
      },
      required: ["client_id"]
    }
  },
  {
    name: "create_client",
    description: "Create a new client",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Client name" },
        industry: { type: "string", description: "Client industry" },
        contact_person: { type: "string", description: "Contact person name" },
        email: { type: "string", description: "Contact email" },
        phone: { type: "string", description: "Contact phone" },
        address: { type: "string", description: "Client address" }
      },
      required: ["name"]
    }
  },
  {
    name: "list_projects",
    description: "Get a list of all projects, optionally filtered by client",
    inputSchema: {
      type: "object",
      properties: {
        client_id: {
          type: "number",
          description: "Optional: Filter projects by client ID"
        }
      },
      required: []
    }
  },
  {
    name: "get_project",
    description: "Get detailed information about a specific project",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "number",
          description: "The ID of the project"
        }
      },
      required: ["project_id"]
    }
  },
  {
    name: "create_project",
    description: "Create a new project for a client",
    inputSchema: {
      type: "object",
      properties: {
        client_id: { type: "number", description: "Client ID" },
        name: { type: "string", description: "Project name" },
        description: { type: "string", description: "Project description" },
        start_date: { type: "string", description: "Start date (ISO format)" },
        end_date: { type: "string", description: "End date (ISO format)" },
        status: { 
          type: "string", 
          enum: ["pending", "in progress", "completed", "on hold"],
          description: "Project status" 
        }
      },
      required: ["client_id", "name"]
    }
  },
  {
    name: "list_tasks",
    description: "Get a list of all tasks, optionally filtered by project",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "number",
          description: "Optional: Filter tasks by project ID"
        }
      },
      required: []
    }
  },
  {
    name: "get_task",
    description: "Get detailed information about a specific task",
    inputSchema: {
      type: "object",
      properties: {
        task_id: {
          type: "number",
          description: "The ID of the task"
        }
      },
      required: ["task_id"]
    }
  },
  {
    name: "create_task",
    description: "Create a new task for a project",
    inputSchema: {
      type: "object",
      properties: {
        project_id: { type: "number", description: "Project ID" },
        title: { type: "string", description: "Task title" },
        description: { type: "string", description: "Task description" },
        assigned_to: { type: "number", description: "User ID to assign task to" },
        due_date: { type: "string", description: "Due date (ISO format)" },
        status: { 
          type: "string", 
          enum: ["pending", "in progress", "completed"],
          description: "Task status" 
        }
      },
      required: ["project_id", "title"]
    }
  },
  {
    name: "list_assessments",
    description: "Get a list of all security assessments, optionally filtered by project",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "number",
          description: "Optional: Filter assessments by project ID"
        }
      },
      required: []
    }
  },
  {
    name: "list_vulnerabilities",
    description: "Get a list of all vulnerabilities, optionally filtered by assessment",
    inputSchema: {
      type: "object",
      properties: {
        assessment_id: {
          type: "number",
          description: "Optional: Filter vulnerabilities by assessment ID"
        }
      },
      required: []
    }
  }
]

// Authenticate request
async function authenticate(req: NextRequest): Promise<{ user: any, error?: NextResponse }> {
  const auth = req.headers.get("authorization")
  if (!auth || !auth.startsWith("Bearer ")) {
    return { 
      user: null, 
      error: addCorsHeaders(NextResponse.json({
        jsonrpc: "2.0",
        id: null,
        error: { code: "UNAUTHORIZED", message: "Missing or invalid Authorization header" }
      }, { status: 401 }))
    }
  }
  
  const apiKey = auth.replace("Bearer ", "").trim()
  const user = await getUserByApiKey(apiKey)
  
  if (!user) {
    return { 
      user: null, 
      error: addCorsHeaders(NextResponse.json({
        jsonrpc: "2.0",
        id: null,
        error: { code: "UNAUTHORIZED", message: "Invalid API key" }
      }, { status: 401 }))
    }
  }
  
  return { user }
}

// Execute tool calls
async function executeTool(toolName: string, args: any): Promise<any> {
  switch (toolName) {
    case "list_clients":
      return await sql`SELECT * FROM clients ORDER BY created_at DESC`
    
    case "get_client":
      const client = await sql`SELECT * FROM clients WHERE id = ${args.client_id}`
      if (client.length === 0) throw new Error("Client not found")
      return client[0]
    
    case "create_client":
      const newClient = await sql`
        INSERT INTO clients (name, industry, contact_person, email, phone, address)
        VALUES (${args.name}, ${args.industry}, ${args.contact_person}, ${args.email}, ${args.phone}, ${args.address})
        RETURNING *
      `
      return newClient[0]
    
    case "list_projects":
      if (args.client_id) {
        return await sql`SELECT * FROM projects WHERE client_id = ${args.client_id} ORDER BY created_at DESC`
      }
      return await sql`SELECT * FROM projects ORDER BY created_at DESC`
    
    case "get_project":
      const project = await sql`SELECT * FROM projects WHERE id = ${args.project_id}`
      if (project.length === 0) throw new Error("Project not found")
      return project[0]
    
    case "create_project":
      const newProject = await sql`
        INSERT INTO projects (client_id, name, description, start_date, end_date, status)
        VALUES (${args.client_id}, ${args.name}, ${args.description}, ${args.start_date}, ${args.end_date}, ${args.status || 'pending'})
        RETURNING *
      `
      return newProject[0]
    
    case "list_tasks":
      if (args.project_id) {
        return await sql`SELECT * FROM tasks WHERE project_id = ${args.project_id} ORDER BY created_at DESC`
      }
      return await sql`SELECT * FROM tasks ORDER BY created_at DESC`
    
    case "get_task":
      const task = await sql`SELECT * FROM tasks WHERE id = ${args.task_id}`
      if (task.length === 0) throw new Error("Task not found")
      return task[0]
    
    case "create_task":
      const newTask = await sql`
        INSERT INTO tasks (project_id, title, description, assigned_to, due_date, status)
        VALUES (${args.project_id}, ${args.title}, ${args.description}, ${args.assigned_to}, ${args.due_date}, ${args.status || 'pending'})
        RETURNING *
      `
      return newTask[0]
    
    case "list_assessments":
      if (args.project_id) {
        return await sql`SELECT * FROM assessments WHERE project_id = ${args.project_id} ORDER BY created_at DESC`
      }
      return await sql`SELECT * FROM assessments ORDER BY created_at DESC`
    
    case "list_vulnerabilities":
      if (args.assessment_id) {
        return await sql`SELECT * FROM vulnerabilities WHERE assessment_id = ${args.assessment_id} ORDER BY created_at DESC`
      }
      return await sql`SELECT * FROM vulnerabilities ORDER BY created_at DESC`
    
    default:
      throw new Error(`Unknown tool: ${toolName}`)
  }
}

// GET: Support SSE for MCP
export async function GET(req: NextRequest) {
  // Check if this is an SSE request
  const accept = req.headers.get('accept')
  if (accept?.includes('text/event-stream')) {
    // Return SSE headers
    const headers = new Headers()
    headers.set('Content-Type', 'text/event-stream')
    headers.set('Cache-Control', 'no-cache')
    headers.set('Connection', 'keep-alive')
    headers.set('Access-Control-Allow-Origin', '*')
    
    // For SSE, we need to handle the connection differently
    // This is a simplified implementation - in production you'd want proper SSE handling
    return new NextResponse('data: {"error":"SSE not fully implemented yet"}\n\n', {
      headers,
      status: 200
    })
  }
  
  return addCorsHeaders(NextResponse.json({
    error: "MCP requires JSON-RPC 2.0 over POST. Use POST with method: 'initialize' to start."
  }, { status: 400 }))
}

// POST: Execute tool calls
export async function POST(req: NextRequest) {
  // Parse body first
  let body
  try {
    body = await req.json()
  } catch (e) {
    return addCorsHeaders(NextResponse.json({
      jsonrpc: "2.0",
      id: null,
      error: { code: "INVALID_JSON", message: "Invalid JSON" }
    }, { status: 400 }))
  }

  const { method, params, id } = body

  // Allow initialize and notifications without auth
  if (method !== "initialize" && !method?.startsWith("notifications/")) {
    const { user, error } = await authenticate(req)
    if (error) return error
  }

  // Validate ID for requests (must not be null)
  if (method !== "notifications/initialized" && method?.startsWith("notifications/") === false) {
    if (id === null || id === undefined) {
      return addCorsHeaders(NextResponse.json({
        jsonrpc: "2.0",
        error: { code: -32600, message: "Request ID must not be null" }
      }, { status: 400 }))
    }
  }

  // Handle MCP lifecycle: initialize
  if (method === "initialize") {
    const { protocolVersion, capabilities: clientCapabilities, clientInfo } = params || {}
    
    // Log version for debugging but accept any version for compatibility
    console.log(`MCP initialize: client version ${protocolVersion}, server supports ${MCP_VERSION}`)

    return addCorsHeaders(NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: MCP_VERSION,
        capabilities: SERVER_CAPABILITIES,
        serverInfo: SERVER_INFO
      }
    }))
  }

  // Handle notifications (no response needed)
  if (method === "notifications/initialized") {
    console.log('MCP client initialized')
    return new NextResponse(null, { status: 204 })
  }

  if (method === "notifications/cancelled") {
    console.log('MCP request cancelled')
    return new NextResponse(null, { status: 204 })
  }

  // Handle tools/list
  if (method === "tools/list") {
    return addCorsHeaders(NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: { tools: MCP_TOOLS }
    }))
  }

  if (method === "tools/call") {
    const { name, arguments: args } = params || {}

    if (!name) {
      return addCorsHeaders(NextResponse.json({
        jsonrpc: "2.0",
        id,
        error: { code: -32602, message: "Missing tool name in params" }
      }, { status: 400 }))
    }

    try {
      const result = await executeTool(name, args || {})
      
      // MCP requires content array format
      return addCorsHeaders(NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        }
      }))
    } catch (error: any) {
      return addCorsHeaders(NextResponse.json({
        jsonrpc: "2.0",
        id,
        error: {
          code: -32603,
          message: error.message || "Tool execution failed"
        }
      }, { status: 500 }))
    }
  }

  return addCorsHeaders(NextResponse.json({
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method not found: ${method}` }
  }, { status: 400 }))
}
