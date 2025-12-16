# MCP Server - Шпаргалка

## 🔑 Ваши данные

```
URL: http://localhost:3001/api/mcp
API Key: 5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80
```

## 🚀 Базовые команды

### Получить список инструментов
```bash
curl -X GET http://localhost:3001/api/mcp \
  -H "Authorization: Bearer 5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80"
```

### Вызвать инструмент
```bash
curl -X POST http://localhost:3001/api/mcp \
  -H "Authorization: Bearer 5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "TOOL_NAME",
      "arguments": {}
    }
  }'
```

## 📋 Все инструменты

| Инструмент | Описание | Аргументы |
|-----------|----------|-----------|
| `list_clients` | Список клиентов | - |
| `get_client` | Данные клиента | `client_id` |
| `create_client` | Создать клиента | `name`, `industry?`, `email?`, `phone?` |
| `list_projects` | Список проектов | `client_id?` |
| `get_project` | Данные проекта | `project_id` |
| `create_project` | Создать проект | `client_id`, `name`, `status?` |
| `list_tasks` | Список задач | `project_id?` |
| `get_task` | Данные задачи | `task_id` |
| `create_task` | Создать задачу | `project_id`, `title`, `status?` |
| `list_assessments` | Список оценок | `project_id?` |
| `list_vulnerabilities` | Список уязвимостей | `assessment_id?` |

## 💡 Частые примеры

### Клиенты
```bash
# Список
curl -X POST http://localhost:3001/api/mcp \
  -H "Authorization: Bearer 5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80" \
  -H "Content-Type: application/json" \
  -d '{"method":"tools/call","params":{"name":"list_clients","arguments":{}}}'

# Создать
curl -X POST http://localhost:3001/api/mcp \
  -H "Authorization: Bearer 5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80" \
  -H "Content-Type: application/json" \
  -d '{"method":"tools/call","params":{"name":"create_client","arguments":{"name":"Test Corp","industry":"IT"}}}'
```

### Проекты
```bash
# Список всех
curl -X POST http://localhost:3001/api/mcp \
  -H "Authorization: Bearer 5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80" \
  -H "Content-Type: application/json" \
  -d '{"method":"tools/call","params":{"name":"list_projects","arguments":{}}}'

# Список для клиента
curl -X POST http://localhost:3001/api/mcp \
  -H "Authorization: Bearer 5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80" \
  -H "Content-Type: application/json" \
  -d '{"method":"tools/call","params":{"name":"list_projects","arguments":{"client_id":1}}}'
```

### Задачи
```bash
# Создать задачу
curl -X POST http://localhost:3001/api/mcp \
  -H "Authorization: Bearer 5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80" \
  -H "Content-Type: application/json" \
  -d '{"method":"tools/call","params":{"name":"create_task","arguments":{"project_id":1,"title":"New task"}}}'
```

## 🐍 Python клиент

```python
import requests

class MCP:
    def __init__(self):
        self.url = "http://localhost:3001/api/mcp"
        self.key = "5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80"
        self.headers = {
            'Authorization': f'Bearer {self.key}',
            'Content-Type': 'application/json'
        }
    
    def call(self, tool, args={}):
        return requests.post(self.url, headers=self.headers, json={
            'method': 'tools/call',
            'params': {'name': tool, 'arguments': args}
        }).json()

# Использование
mcp = MCP()
clients = mcp.call('list_clients')
print(clients)
```

## 🟨 JavaScript клиент

```javascript
class MCP {
  constructor() {
    this.url = "http://localhost:3001/api/mcp";
    this.key = "5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80";
  }

  async call(tool, args = {}) {
    const res = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method: 'tools/call',
        params: { name: tool, arguments: args }
      })
    });
    return await res.json();
  }
}

// Использование
const mcp = new MCP();
const clients = await mcp.call('list_clients');
console.log(clients);
```

## 🤖 Claude Desktop Config

`~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "security": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"],
      "env": {
        "FETCH_API_KEY": "5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80",
        "FETCH_BASE_URL": "http://localhost:3001/api/mcp"
      }
    }
  }
}
```

## ⚠️ Важно

- ❌ Не публикуйте API ключ
- ✅ Храните в переменных окружения
- ✅ Создавайте новые ключи для каждого приложения
- ✅ Удаляйте неиспользуемые ключи
</content>