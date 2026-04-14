# Personal Agent API Documentation

## Run API Server

```bash
# Development with auto-reload
python src/api.py

# Or using uvicorn directly
python -m uvicorn src.api:app --reload --port 8000
```

Server runs at: `http://localhost:8000`

---

## Overview

This is a **Personal Agent** API where:
- Each user can have multiple agents
- Each agent is private to the user
- Conversations are stored in DMs (Direct Messages)
- Context is automatically managed from DM history

### Key Concepts

| Entity | Description |
|--------|-------------|
| `user_id` | Unique identifier for a user (e.g., "user123", "hoang") |
| `agent_id` | Format: `agent-personal-{user_id}-{slug}` |
| `slug` | Agent identifier like "assistant", "math", "writer" |
| `dm_id` | Format: `dm:{user_id}:{agent_id}` |

---

## Endpoints

### 1. Health Check
```bash
GET /
```

**Response:**
```json
{
  "status": "ok",
  "service": "Agent API",
  "model": "gemini-2.5-flash",
  "memory": "connected",
  "version": "2.0.0-personal-agent"
}
```

---

### 2. Create Agent
```bash
POST /agents?user_id={user_id}&slug={slug}&name={name}&persona={persona}
```

**Parameters:**
- `user_id` (required): User identifier
- `slug` (required): Agent slug (e.g., "assistant", "math")
- `name` (required): Display name
- `persona` (optional): Persona configuration (default: "default")

**Response:**
```json
{
  "agent_id": "agent-personal-user123-assistant",
  "user_id": "user123",
  "slug": "assistant",
  "name": "Trợ lý AI"
}
```

---

### 3. List User Agents
```bash
GET /agents/{user_id}
```

**Response:**
```json
{
  "user_id": "user123",
  "agents": [
    {
      "agentId": "agent-personal-user123-assistant",
      "userId": "user123",
      "name": "Trợ lý AI",
      "slug": "assistant",
      "status": "active",
      "createdAt": "1775908953000"
    }
  ]
}
```

---

### 4. Chat (Normal)
```bash
POST /chat
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "Giải phương trình x + 2 = 5",
  "user_id": "user123",
  "agent_slug": "assistant",
  "stream": false
}
```

Or with explicit `agent_id`:
```json
{
  "message": "Giải phương trình x + 2 = 5",
  "user_id": "user123",
  "agent_id": "agent-personal-user123-math",
  "stream": false
}
```

**Response:**
```json
{
  "response": "Phương trình x + 2 = 5 có nghiệm x = 3",
  "user_id": "user123",
  "agent_id": "agent-personal-user123-assistant",
  "dm_id": "dm:user123:agent-personal-user123-assistant",
  "used_tools": []
}
```

---

### 5. Chat (Streaming) ⭐ Recommended for FE
```bash
POST /chat/stream
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "Giải thích đạo hàm",
  "user_id": "user123",
  "agent_slug": "assistant"
}
```

**Response:** Stream `text/plain`, each line is a JSON object:

```
{"type": "status", "content": "thinking"}
{"type": "tool_start", "tool": "calculate", "args": {"expression": "1+1"}}
{"type": "tool_end", "tool": "calculate", "result": "2"}
{"type": "token", "content": "Đạo"}
{"type": "token", "content": "hàm"}
{"type": "token", "content": "là"}
...
{"type": "done", "user_id": "user123", "agent_id": "agent-personal-user123-assistant", "dm_id": "dm:user123:agent-personal-user123-assistant"}
```

**Event Types:**
| Type | Description | Data |
|------|-------------|------|
| `status` | Processing state | `content`: "thinking" |
| `tool_start` | Tool called | `tool`, `args` |
| `tool_end` | Tool completed | `tool`, `result` |
| `token` | Response chunk | `content` |
| `done` | Complete | `user_id`, `agent_id`, `dm_id` |

**Response Headers:**
```
X-User-Id: user123
X-Agent-Id: agent-personal-user123-assistant
X-DM-Id: dm:user123:agent-personal-user123-assistant
```

---

### 6. Get DM Messages
```bash
GET /dms/{user_id}/{agent_id}/messages?limit=50&before={timestamp}
```

**Parameters:**
- `limit` (optional): Max messages (default: 50)
- `before` (optional): Get messages before this timestamp (for pagination)

**Response:**
```json
{
  "dm_id": "dm:user123:agent-personal-user123-assistant",
  "user_id": "user123",
  "agent_id": "agent-personal-user123-assistant",
  "messages": [
    {
      "id": "17759097218208f5f106d",
      "dmId": "dm:user123:agent-personal-user123-assistant",
      "senderId": "user123",
      "senderType": "human",
      "content": "Xin chào",
      "timestamp": "1775909721820",
      "edited": "false"
    },
    {
      "id": "17759097415059618e12e",
      "dmId": "dm:user123:agent-personal-user123-assistant",
      "senderId": "agent-personal-user123-assistant",
      "senderType": "agent",
      "content": "Chào bạn! Tôi có thể giúp gì?",
      "timestamp": "1775909741505",
      "edited": "false"
    }
  ],
  "count": 2
}
```

---

### 7. List User DMs
```bash
GET /dms/{user_id}
```

**Response:**
```json
{
  "user_id": "user123",
  "dms": [
    {
      "id": "dm:user123:agent-personal-user123-assistant",
      "user1Id": "user123",
      "user2Id": "agent-personal-user123-assistant",
      "lastMessageAt": "1775909741505"
    }
  ]
}
```

---

### 8. Clear DM Context
```bash
DELETE /dms/{user_id}/{agent_id}/context
```

Clears all messages in the DM (permanent delete).

**Response:**
```json
{
  "message": "Context cleared",
  "user_id": "user123",
  "agent_id": "agent-personal-user123-assistant"
}
```

---

### 9. List Available Tools
```bash
GET /tools
```

---

## Next.js Integration

### TypeScript Types

```typescript
// types/agent.ts

export interface Agent {
  agentId: string;
  userId: string;
  name: string;
  slug: string;
  status: 'active' | 'paused' | 'archived';
  persona?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  dmId: string;
  senderId: string;
  senderType: 'human' | 'agent';
  content: string;
  timestamp: string;
  replyTo?: string;
  edited: string;
}

export interface DM {
  id: string;
  user1Id: string;
  user2Id: string;
  lastMessageId?: string;
  lastMessageAt?: string;
  user1Unread: string;
  user2Unread: string;
}

export interface ChatRequest {
  message: string;
  user_id: string;
  agent_id?: string;
  agent_slug?: string;
  stream?: boolean;
}

export interface ChatResponse {
  response: string;
  user_id: string;
  agent_id: string;
  dm_id: string;
  used_tools: any[];
}

export type StreamEventType = 'status' | 'tool_start' | 'tool_end' | 'token' | 'done';

export interface StreamEvent {
  type: StreamEventType;
  content?: string;
  tool?: string;
  args?: any;
  result?: string;
  user_id?: string;
  agent_id?: string;
  dm_id?: string;
}
```

---

### API Client

```typescript
// lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class AgentAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  // Health check
  async health() {
    const res = await fetch(`${this.baseUrl}/`);
    return res.json();
  }

  // Create agent
  async createAgent(userId: string, slug: string, name: string, persona: string = 'default') {
    const params = new URLSearchParams({ user_id: userId, slug, name, persona });
    const res = await fetch(`${this.baseUrl}/agents?${params}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to create agent');
    return res.json();
  }

  // List agents
  async listAgents(userId: string) {
    const res = await fetch(`${this.baseUrl}/agents/${userId}`);
    if (!res.ok) throw new Error('Failed to list agents');
    return res.json();
  }

  // Normal chat
  async chat(userId: string, message: string, agentSlug: string = 'assistant'): Promise<ChatResponse> {
    const res = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        user_id: userId,
        agent_slug: agentSlug,
      }),
    });
    if (!res.ok) throw new Error('Chat failed');
    return res.json();
  }

  // Streaming chat
  async *chatStream(
    userId: string,
    message: string,
    agentSlug: string = 'assistant'
  ): AsyncGenerator<StreamEvent, void, unknown> {
    const res = await fetch(`${this.baseUrl}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        user_id: userId,
        agent_slug: agentSlug,
      }),
    });

    if (!res.ok) throw new Error('Chat stream failed');
    if (!res.body) throw new Error('No response body');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              yield JSON.parse(line);
            } catch (e) {
              console.error('Failed to parse:', line);
            }
          }
        }
      }

      // Process remaining buffer
      if (buffer.trim()) {
        try {
          yield JSON.parse(buffer);
        } catch (e) {
          console.error('Failed to parse buffer:', buffer);
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  // Get messages
  async getMessages(userId: string, agentId: string, limit: number = 50) {
    const res = await fetch(`${this.baseUrl}/dms/${userId}/${agentId}/messages?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to get messages');
    return res.json();
  }

  // List DMs
  async listDMs(userId: string) {
    const res = await fetch(`${this.baseUrl}/dms/${userId}`);
    if (!res.ok) throw new Error('Failed to list DMs');
    return res.json();
  }

  // Clear context
  async clearContext(userId: string, agentId: string) {
    const res = await fetch(`${this.baseUrl}/dms/${userId}/${agentId}/context`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to clear context');
    return res.json();
  }
}

export const api = new AgentAPI();
```

---

### React Hook for Chat

```typescript
// hooks/useChat.ts
'use client';

import { useState, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import { Message, StreamEvent } from '@/types/agent';

interface UseChatOptions {
  userId: string;
  agentSlug?: string;
  agentId?: string;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  sendMessage: (content: string) => Promise<void>;
  loadMessages: () => Promise<void>;
  clearHistory: () => Promise<void>;
}

export function useChat({ userId, agentSlug = 'assistant', agentId }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const currentAgentId = useRef<string | null>(agentId || null);

  const loadMessages = useCallback(async () => {
    if (!currentAgentId.current) {
      // Get agent ID from list
      const { agents } = await api.listAgents(userId);
      const agent = agents.find((a: any) => a.slug === agentSlug);
      if (agent) {
        currentAgentId.current = agent.agentId;
      } else {
        // Create agent if not exists
        const newAgent = await api.createAgent(userId, agentSlug, 'Trợ lý AI');
        currentAgentId.current = newAgent.agent_id;
      }
    }

    if (currentAgentId.current) {
      const data = await api.getMessages(userId, currentAgentId.current);
      setMessages(data.messages);
    }
  }, [userId, agentSlug, agentId]);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setIsStreaming(true);

    // Add user message optimistically
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      dmId: '',
      senderId: userId,
      senderType: 'human',
      content,
      timestamp: Date.now().toString(),
      edited: 'false',
    };
    setMessages(prev => [...prev, userMessage]);

    let fullResponse = '';

    try {
      for await (const event of api.chatStream(userId, content, agentSlug)) {
        switch (event.type) {
          case 'token':
            fullResponse += event.content || '';
            // Update streaming message
            setMessages(prev => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg?.senderType === 'agent') {
                return [
                  ...prev.slice(0, -1),
                  { ...lastMsg, content: fullResponse }
                ];
              }
              return [
                ...prev,
                {
                  id: `stream-${Date.now()}`,
                  dmId: event.dm_id || '',
                  senderId: event.agent_id || '',
                  senderType: 'agent',
                  content: fullResponse,
                  timestamp: Date.now().toString(),
                  edited: 'false',
                }
              ];
            });
            break;

          case 'done':
            if (event.agent_id) {
              currentAgentId.current = event.agent_id;
            }
            break;

          case 'tool_start':
            console.log('Tool called:', event.tool, event.args);
            break;

          case 'tool_end':
            console.log('Tool result:', event.result);
            break;
        }
      }

      // Reload messages to get proper IDs from server
      await loadMessages();
    } catch (error) {
      console.error('Chat error:', error);
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          dmId: '',
          senderId: 'system',
          senderType: 'agent',
          content: 'Sorry, an error occurred. Please try again.',
          timestamp: Date.now().toString(),
          edited: 'false',
        }
      ]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [userId, agentSlug, loadMessages]);

  const clearHistory = useCallback(async () => {
    if (currentAgentId.current) {
      await api.clearContext(userId, currentAgentId.current);
      setMessages([]);
    }
  }, [userId]);

  return {
    messages,
    isLoading,
    isStreaming,
    sendMessage,
    loadMessages,
    clearHistory,
  };
}
```

---

### Chat Component Example

```tsx
// components/Chat.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/useChat';

interface ChatProps {
  userId: string;
  agentSlug?: string;
}

export function Chat({ userId, agentSlug = 'assistant' }: ChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, isStreaming, sendMessage, loadMessages } = useChat({
    userId,
    agentSlug,
  });

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const message = input;
    setInput('');
    await sendMessage(message);
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.senderType === 'human'
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-gray-200 text-black'
            } max-w-[80%]`}
          >
            {msg.content}
          </div>
        ))}
        {isStreaming && (
          <div className="text-gray-400 text-sm">AI is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 border rounded-lg"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
```

---

### Usage in Page

```tsx
// app/chat/page.tsx
import { Chat } from '@/components/Chat';

export default function ChatPage() {
  // In production, get userId from auth session
  const userId = 'user123'; // Replace with actual user ID

  return (
    <main>
      <Chat userId={userId} agentSlug="assistant" />
    </main>
  );
}
```

---

## Environment Setup

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Optional: Proxy API requests in development
    return [
      {
        source: '/api/agent/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## CORS Note

If running API server separately, ensure CORS is enabled (already configured in `src/api.py`):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For production, set:
```python
allow_origins=["https://yourdomain.com"]
```
