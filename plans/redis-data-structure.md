# Redis Data Structure Design for Chat Application

## Overview

This document outlines the Redis data structure design for a chat application supporting:

- **Direct Messages (DM)**: 1-on-1 conversations
- **Space/Room Messages**: Group conversations in spaces
- **Reactions**: Emoji reactions to messages
- **Reply**: Threaded replies to messages
- **Edit**: Message editing with history
- **@Mentions**: Tagging users in messages

---

## Key Naming Convention

```
{prefix}:{entity}:{id}:{field}
```

Prefixes:

- `msg:` - Messages
- `room:` - Rooms/Spaces
- `dm:` - Direct messages
- `user:` - User data
- `react:` - Reactions
- `mention:` - Mentions

---

## 1. Message Storage

### Message Hash

Each message stored as a Redis Hash:

```
msg:{messageId}
  ├── id: "12345"
  ├── roomId: "toan-cao-cap" or "dm:minh:you"
  ├── roomType: "space" | "dm"
  ├── senderId: "user123"
  ├── senderName: "Minh"
  ├── content: "Hello @Linh, check this out!"
  ├── timestamp: 1712345678000 (Unix ms)
  ├── edited: "false" | "true"
  ├── editHistory: JSON string of edits
  ├── replyTo: "98765" (messageId being replied to)
  ├── pinned: "false" | "true"
  ├── deleted: "false" | "true"
  └── attachment: JSON string if has attachment
```

### Message Lists (Sorted Sets for ordering)

**For Space/Room messages:**

```
room:messages:{roomId}
  ├── member: messageId, score: timestamp
```

**For DM messages:**

```
dm:messages:{dmId}
  ├── member: messageId, score: timestamp
```

**Example:**

```
ZADD room:messages:toan-cao-cap 1712345678000 msg:12345
ZADD dm:messages:dm:minh:you 1712345678000 msg:12345
```

---

## 2. Room/Space Storage

### Room Hash

```
room:{roomId}
  ├── id: "toan-cao-cap"
  ├── name: "Toán cao cấp"
  ├── type: "space" | "dm"
  ├── spaceId: "space123" (if belongs to a space)
  ├── createdAt: 1712345678000
  ├── memberCount: 25
  └── lastActivity: 1712345678000
```

### Room Members (Set)

```
room:members:{roomId}
  ├── member: userId
```

### Room Message Count

```
room:msgcount:{roomId} = 1523
```

---

## 3. Direct Message Storage

### DM Room ID Generation

```
dm:{userId1}:{userId2}  (sorted alphabetically)
Example: dm:minh:you
```

### DM Metadata

```
dm:{dmId}
  ├── id: "dm:minh:you"
  ├── user1Id: "minh"
  ├── user2Id: "you"
  ├── lastMessageId: "msg:12345"
  ├── lastMessageAt: 1712345678000
  └── unreadCount:{userId}: 3
```

### User's DM List (Sorted Set)

```
user:dms:{userId}
  ├── member: dmId, score: lastMessageAt
```

---

## 4. Reactions Storage

### Message Reactions (Hash)

```
react:msg:{messageId}
  ├── 👍: JSON string of {count, users: ["user1", "user2"]}
  ├── ❤️: JSON string of {count, users: ["user3"]}
  └── 😂: JSON string of {count, users: ["user1", "user4"]}
```

### User's Reactions (Set) - for quick lookup

```
user:reactions:{userId}
  ├── member: "{messageId}:{emoji}"
```

**Example:**

```
HSET react:msg:12345 👍 '{"count":2,"users":["user1","user2"]}'
SADD user:reactions:user1 "12345:👍"
```

---

## 5. Reply/Thread Storage

### Reply Index

```
msg:replies:{parentMessageId}
  ├── member: replyMessageId, score: timestamp
```

### Message Reply Count

```
msg:replycount:{messageId} = 5
```

---

## 6. Edit History Storage

### Edit History (List)

```
msg:edithistory:{messageId}
  ├── LPUSH: JSON string of {content, editedAt, editedBy}
```

**Example:**

```
LPUSH msg:edithistory:12345 '{"content":"Original text","editedAt":1712345600000,"editedBy":"user1"}'
LPUSH msg:edithistory:12345 '{"content":"Edited text","editedAt":1712345678000,"editedBy":"user1"}'
```

---

## 7. @Mentions Storage

### Message Mentions (Set)

```
mention:msg:{messageId}
  ├── member: mentionedUserId
```

### User's Mentions (Sorted Set) - for notification

```
user:mentions:{userId}
  ├── member: messageId, score: timestamp
```

### Unread Mentions Count

```
user:mentioncount:{userId} = 3
```

**Example:**

```
SADD mention:msg:12345 user456
ZADD user:mentions:user456 1712345678000 msg:12345
INCR user:mentioncount:user456
```

---

## 8. Unread Count Storage

### User's Unread per Room

```
user:unread:{userId}:{roomId} = 5
```

### User's Total Unread

```
user:unreadtotal:{userId} = 23
```

---

## 9. Pinned Messages

### Room Pinned Messages (Set)

```
room:pinned:{roomId}
  ├── member: messageId
```

---

## 10. User Online Status

### User Status (Hash)

```
user:status:{userId}
  ├── online: "true" | "false"
  ├── lastSeen: 1712345678000
  └── socketId: "socket123" (for real-time)
```

### Online Users (Set)

```
users:online
  ├── member: userId
```

---

## Data Flow Examples

### Sending a Message

```
1. Generate messageId
2. HSET msg:{messageId} {fields}
3. ZADD room:messages:{roomId} {timestamp} {messageId}
4. If has mentions:
   - SADD mention:msg:{messageId} {mentionedUserIds}
   - ZADD user:mentions:{userId} {timestamp} {messageId}
5. If reply:
   - SADD msg:replies:{replyToId} {messageId}
6. Update room last activity
7. Increment unread counts for other members
8. Publish to Redis Pub/Sub for real-time
```

### Adding a Reaction

```
1. HGET react:msg:{messageId} {emoji}
2. Update count and users array
3. HSET react:msg:{messageId} {emoji} {updatedJson}
4. SADD user:reactions:{userId} "{messageId}:{emoji}"
5. Publish reaction update
```

### Editing a Message

```
1. HGET msg:{messageId} content (store old content)
2. LPUSH msg:edithistory:{messageId} {oldContentJson}
3. HSET msg:{messageId} content {newContent}
4. HSET msg:{messageId} edited "true"
5. Publish edit update
```

---

## Redis Pub/Sub Channels

```
# Room message events
channel:room:{roomId}
  ├── message:new
  ├── message:edit
  ├── message:delete
  ├── reaction:add
  ├── reaction:remove

# DM events
channel:dm:{dmId}
  ├── message:new
  ├── message:edit
  ├── typing:start
  ├── typing:stop

# User events
channel:user:{userId}
  ├── mention:new
  ├── dm:new
  ├── status:change
```

---

## Caching Strategy

### Hot Data (Keep in Redis)

- Recent messages (last 100 per room)
- Online users
- Unread counts
- Recent reactions

### Warm Data (Redis + DB)

- Message history (older messages)
- User profiles
- Room metadata

### Cold Data (DB only)

- Very old messages (archive)
- Edit history (older than 30 days)
- Deleted messages

---

## Memory Optimization

### Use Redis Modules

- **RedisJSON**: For nested data (reactions, attachments)
- **RedisSearch**: For message search
- **RedisTimeSeries**: For analytics

### Compression

- Compress large message content
- Use message IDs instead of full objects in lists

### Expiration

```
EXPIRE msg:edithistory:{messageId} 2592000  # 30 days
EXPIRE user:mentions:{userId} 604800  # 7 days (keep recent)
```

---

## Example: Complete Message Object in Redis

```
# Message Hash
HSETALL msg:1712345678001 {
  "id": "1712345678001",
  "roomId": "toan-cao-cap",
  "roomType": "space",
  "senderId": "user123",
  "senderName": "Minh",
  "content": "Cho mình hỏi thêm: tích phân của sin(x) từ 0 đến π bằng bao nhiêu? @Linh @Huy giúp mình với",
  "timestamp": 1712345678001,
  "edited": "false",
  "replyTo": "1712345678000",
  "pinned": "false",
  "deleted": "false"
}

# Reactions
HSETALL react:msg:1712345678001 {
  "👍": "{\"count\":2,\"users\":[\"user456\",\"user789\"]}",
  "❤️": "{\"count\":1,\"users\":[\"user456\"]}"
}

# Mentions
SADD mention:msg:1712345678001 user456 user789

# Add to room messages
ZADD room:messages:toan-cao-cap 1712345678001 msg:1712345678001

# Add to reply thread
SADD msg:replies:1712345678000 1712345678001
```

---

## Scaling Considerations

### Sharding

- Shard by roomId for room messages
- Shard by userId for user-specific data

### Clustering

- Use Redis Cluster for horizontal scaling
- Hash slots based on roomId/userId

### Persistence

- AOF (Append Only File) for durability
- RDB snapshots for backup

---

## Summary Table

| Feature   | Redis Structure   | Key Pattern                                  |
| --------- | ----------------- | -------------------------------------------- |
| Messages  | Hash + Sorted Set | `msg:{id}`, `room:messages:{roomId}`         |
| DM        | Hash + Sorted Set | `dm:{id}`, `dm:messages:{dmId}`              |
| Reactions | Hash + Set        | `react:msg:{id}`, `user:reactions:{userId}`  |
| Reply     | Set               | `msg:replies:{parentId}`                     |
| Edit      | List              | `msg:edithistory:{id}`                       |
| @Mentions | Set + Sorted Set  | `mention:msg:{id}`, `user:mentions:{userId}` |
| Unread    | String            | `user:unread:{userId}:{roomId}`              |
| Online    | Set + Hash        | `users:online`, `user:status:{id}`           |
| Pinned    | Set               | `room:pinned:{roomId}`                       |
