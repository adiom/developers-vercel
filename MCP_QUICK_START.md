# MCP Server - Краткое руководство

## ✅ Ваш MCP сервер успешно работает!

**URL:** `http://localhost:3001/api/mcp`  
**API Key:** `5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80`

## 🚀 Быстрый старт

### 1. Получить список доступных инструментов

```bash
curl -X GET http://localhost:3001/api/mcp \
  -H "Authorization: Bearer 5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80"
```

**Ответ:** Список из 11 доступных инструментов (tools)

### 2. Вызвать инструмент

Базовая структура запроса:
```bash
curl -X POST http://localhost:3001/api/mcp \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "TOOL_NAME",
      "arguments": {}
    }
  }'
```

## 📋 Примеры использования

### Пример 1: Получить список клиентов

```bash
curl -X POST http://localhost:3001/api/mcp \
  -H "Authorization: Bearer 5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "list_clients",
      "arguments": {}
    }
  }'
```

### Пример 2: Получить информацию о конкретном клиенте

```bash
curl -X POST http://localhost:3001/api/mcp \
  -H "Authorization: Bearer 5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "get_client",
      "arguments": {
        "client_id": 1
      }
    }
  }'
```

### Пример 3: Создать нового клиента

```bash
curl -X POST http://localhost:3001/api/mcp \
  -H "Authorization: Bearer 5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "create_client",
      "arguments": {
        "name": "Новая компания",
        "industry": "IT",
        "email": "contact@example.com",
        "phone": "+7 (999) 123-4567"
      }
    }
  }'
```

### Пример 4: Получить список проектов

```bash
curl -X POST http://localhost:3001/api/mcp \
  -H "Authorization: Bearer 5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "list_projects",
      "arguments": {}
    }
  }'
```

### Пример 5: Получить проекты конкретного клиента

```bash
curl -X POST http://localhost:3001/api/mcp \
  -H "Authorization: Bearer 5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "list_projects",
      "arguments": {
        "client_id": 1
      }
    }
  }'
```

### Пример 6: Создать новый проект

```bash
curl -X POST http://localhost:3001/api/mcp \
  -H "Authorization: Bearer 5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "create_project",
      "arguments": {
        "client_id": 1,
        "name": "Проект по аудиту безопасности",
        "description": "Комплексный аудит безопасности инфраструктуры",
        "status": "in progress"
      }
    }
  }'
```

### Пример 7: Создать задачу

```bash
curl -X POST http://localhost:3001/api/mcp \
  -H "Authorization: Bearer 5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "create_task",
      "arguments": {
        "project_id": 1,
        "title": "Провести сканирование уязвимостей",
        "description": "Использовать Nessus для сканирования",
        "status": "pending"
      }
    }
  }'
```

### Пример 8: Получить список задач проекта

```bash
curl -X POST http://localhost:3001/api/mcp \
  -H "Authorization: Bearer 5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "list_tasks",
      "arguments": {
        "project_id": 1
      }
    }
  }'
```

## 🔧 Использование в коде

### Python

```python
import requests

class MCPClient:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.api_key = api_key
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def call_tool(self, tool_name, arguments=None):
        payload = {
            'method': 'tools/call',
            'params': {
                'name': tool_name,
                'arguments': arguments or {}
            }
        }
        response = requests.post(self.base_url, headers=self.headers, json=payload)
        return response.json()

# Использование
client = MCPClient(
    'http://localhost:3001/api/mcp',
    '5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80'
)

# Получить клиентов
clients = client.call_tool('list_clients')
print(clients)

# Создать клиента
new_client = client.call_tool('create_client', {
    'name': 'Test Company',
    'industry': 'Tech'
})
print(new_client)
```

### JavaScript/TypeScript

```javascript
class MCPClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async callTool(toolName, args = {}) {
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
    });
    return await response.json();
  }
}

// Использование
const client = new MCPClient(
  'http://localhost:3001/api/mcp',
  '5218225ca840c68d9f2fd7d25e1997bf41893d6727abe63873290397718dee80'
);

// Получить клиентов
const clients = await client.callTool('list_clients');
console.log(clients);

// Создать клиента
const newClient = await client.callTool('create_client', {
  name: 'Test Company',
  industry: 'Tech'
});
console.log(newClient);
```

## 📚 Доступные инструменты (Tools)

1. **list_clients** - Получить список всех клиентов
2. **get_client** - Получить информацию о клиенте (требует: client_id)
3. **create_client** - Создать нового клиента (требует: name)
4. **list_projects** - Получить список проектов (опционально: client_id)
5. **get_project** - Получить информацию о проекте (требует: project_id)
6. **create_project** - Создать новый проект (требует: client_id, name)
7. **list_tasks** - Получить список задач (опционально: project_id)
8. **get_task** - Получить информацию о задаче (требует: task_id)
9. **create_task** - Создать новую задачу (требует: project_id, title)
10. **list_assessments** - Получить список оценок безопасности (опционально: project_id)
11. **list_vulnerabilities** - Получить список уязвимостей (опционально: assessment_id)

## 🔐 Управление API ключами

### Где взять API ключ?

1. Войдите в систему: http://localhost:3001/auth/login
2. Перейдите в настройки: http://localhost:3001/settings
3. Найдите секцию "API ключи"
4. Нажмите "Создать ключ"
5. Введите название (например: "MCP для моего бота")
6. Скопируйте сгенерированный ключ (показывается только один раз!)

### Создание через API

```bash
# Сначала получите session_token через логин
curl -X POST http://localhost:3001/api/api-keys \
  -H "Cookie: session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Мой новый ключ"}'
```

## 🤖 Интеграция с AI-агентами

### Claude Desktop

1. Установите Claude Desktop
2. Создайте конфигурацию MCP в `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "security-platform": {
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

3. Перезапустите Claude Desktop
4. Теперь Claude может автоматически использовать ваш API!

## ⚠️ Важные замечания

1. **Безопасность:** Не публикуйте API ключ в публичных репозиториях
2. **Локальная разработка:** Сейчас сервер работает на localhost:3001
3. **Production:** При деплое на продакшн измените URL на ваш домен
4. **HTTPS:** В продакшне используйте HTTPS для безопасности

## 🎯 Следующие шаги

1. ✅ Попробуйте все примеры выше
2. ✅ Создайте своего первого клиента через MCP
3. ✅ Интегрируйте MCP в свое приложение
4. ✅ Настройте Claude Desktop для работы с MCP
5. ✅ Прочитайте полную документацию в `API_DOCUMENTATION.md`

## 📖 Дополнительная документация

- `API_DOCUMENTATION.md` - Полная документация по всем API
- [MCP Specification](https://spec.modelcontextprotocol.io/) - Официальная спецификация протокола
- [Claude MCP Guide](https://docs.anthropic.com/claude/docs/model-context-protocol) - Руководство по MCP от Anthropic