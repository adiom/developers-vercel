# Security Assessment Platform

*Professional security assessment and project management platform with AI integration*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/metahumanists-projects/v0-fork-of-crm-for-neon)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/fnKJxwfRZg1)
[![MCP Ready](https://img.shields.io/badge/MCP-Ready-brightgreen?style=for-the-badge)](./MCP_QUICK_START.md)

## Overview

A comprehensive platform for managing security assessments, clients, projects, tasks, and vulnerabilities. Features include:

- 🏢 **Client Management** - Track and manage client information
- 📊 **Project Management** - Organize security assessment projects
- ✅ **Task Management** - Assign and track assessment tasks
- 🔒 **Vulnerability Tracking** - Document and manage security vulnerabilities
- 🔑 **API Access** - Programmatic access via REST API
- 🤖 **MCP Server** - AI agent integration via Model Context Protocol

This repository stays in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app are automatically pushed to this repository.

## Deployment

Your project is live at:

**[https://vercel.com/metahumanists-projects/v0-fork-of-crm-for-neon](https://vercel.com/metahumanists-projects/v0-fork-of-crm-for-neon)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/fnKJxwfRZg1](https://v0.dev/chat/projects/fnKJxwfRZg1)**

## 🚀 Quick Start

### For Users

1. **Access the platform:** Visit the deployed URL
2. **Sign up/Login:** Create an account or login
3. **Create API Key:** Go to Settings → API Keys
4. **Start using the API:** See [API Documentation](./API_DOCUMENTATION.md)

### For AI Agents (MCP Integration)

1. **Get your API Key** from the Settings page
2. **Use MCP endpoint:** `http://localhost:3001/api/mcp` (or your production URL)
3. **Follow the guide:** See [MCP Quick Start Guide](./MCP_QUICK_START.md)

```bash
# Test MCP endpoint
curl -X GET http://localhost:3001/api/mcp \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 📚 Documentation

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
- **[MCP_QUICK_START.md](./MCP_QUICK_START.md)** - MCP server quick start guide

## 🔧 Development

```bash
# Install dependencies
pnpm install

# Initialize database
pnpm db:init

# Run development server
pnpm dev

# Open http://localhost:3001
```

## 🤖 AI Integration

This platform supports the **Model Context Protocol (MCP)** for seamless AI agent integration:

```
┌─────────────────┐
│   AI Agent      │
│ (Claude/GPT)    │
└────────┬────────┘
         │
         │ MCP Protocol
         │
         ▼
┌─────────────────────────────┐
│  MCP Server Endpoint        │
│  /api/mcp                   │
│                             │
│  • Discovery (GET)          │
│  • Tool Calls (POST)        │
└────────┬────────────────────┘
         │
         │ API Key Auth
         │
         ▼
┌─────────────────────────────┐
│  Database (PostgreSQL)      │
│                             │
│  • Clients                  │
│  • Projects                 │
│  • Tasks                    │
│  • Assessments              │
│  • Vulnerabilities          │
└─────────────────────────────┘
```

### Available Tools (11)
- Client management (list, get, create)
- Project management (list, get, create)
- Task management (list, get, create)
- Assessment tracking (list)
- Vulnerability tracking (list)

### Example with Claude Desktop

```json
{
  "mcpServers": {
    "security-platform": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"],
      "env": {
        "FETCH_API_KEY": "your_api_key_here",
        "FETCH_BASE_URL": "http://localhost:3001/api/mcp"
      }
    }
  }
}
```

## 🔐 Authentication

- **Session-based:** For web interface (cookie-based)
- **API Key:** For programmatic access (Bearer token)
- **MCP Ready:** Full support for AI agent authentication

## 🛠️ Tech Stack

- **Framework:** Next.js 15.2
- **Database:** Neon (PostgreSQL)
- **UI:** React 19 + Tailwind CSS + shadcn/ui
- **Auth:** Custom session + API key system
- **Protocol:** Model Context Protocol (MCP)

## 📦 API Endpoints

### REST API
- `POST /api/tasks` - Create task
- `POST /api/projects` - Create project
- `GET /api/sessions` - Get user sessions
- `POST /api/api-keys` - Generate API key
- `PUT /api/clients/[id]` - Update client

### MCP Server
- `GET /api/mcp` - Discover tools
- `POST /api/mcp` - Execute tool calls

## 🔒 Security Features

- ✅ PBKDF2 password hashing
- ✅ API key encryption
- ✅ Session token management
- ✅ CORS support
- ✅ Input validation (Zod schemas)
- ✅ SQL injection protection

## 🌐 Deployment

### Automatic via v0.dev

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

### Manual Deployment

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_neon_database_url
NEXT_PUBLIC_APP_URL=your_app_url
```

## 📄 License

This project is private and proprietary.
