// Agent API Service for StudyBot integration
// API documentation: plans/api.md

const AGENT_API_URL = import.meta.env.VITE_AGENT_API_URL || "http://localhost:8000";

// User ID for the current user - in production, get from auth context
const CURRENT_USER_ID = "user123";

// StudyBot agent slug
const STUDYBOT_SLUG = "assistant";

/**
 * Parse streaming response from Agent API
 * Each line is a JSON object
 */
async function* parseStream(reader) {
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim()) {
          try {
            yield JSON.parse(line);
          } catch {
            console.error("Failed to parse stream line:", line);
          }
        }
      }
    }

    // Process remaining buffer
    if (buffer.trim()) {
      try {
        yield JSON.parse(buffer);
      } catch {
        console.error("Failed to parse buffer:", buffer);
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export const agentService = {
  // Get or create StudyBot agent
  async getOrCreateAgent() {
    try {
      // First, try to list existing agents
      const listRes = await fetch(`${AGENT_API_URL}/agents/${CURRENT_USER_ID}`);
      
      if (listRes.ok) {
        const data = await listRes.json();
        const agent = data.agents?.find((a) => a.slug === STUDYBOT_SLUG);
        if (agent) {
          return agent;
        }
      }

      // If not found, create new agent
      const params = new URLSearchParams({
        user_id: CURRENT_USER_ID,
        slug: STUDYBOT_SLUG,
        name: "StudyBot",
        persona: "default",
      });

      const createRes = await fetch(`${AGENT_API_URL}/agents?${params}`, {
        method: "POST",
      });

      if (!createRes.ok) {
        throw new Error("Failed to create agent");
      }

      return await createRes.json();
    } catch (error) {
      console.error("Error getting/creating agent:", error);
      throw error;
    }
  },

  // Get messages for StudyBot DM
  async getMessages(agentId) {
    try {
      const res = await fetch(
        `${AGENT_API_URL}/dms/${CURRENT_USER_ID}/${agentId}/messages?limit=50`
      );

      if (!res.ok) {
        throw new Error("Failed to get messages");
      }

      const data = await res.json();
      return data.messages || [];
    } catch (error) {
      console.error("Error getting messages:", error);
      throw error;
    }
  },

  // Send message to StudyBot and get streaming response
  async *sendMessage(message, agentSlug = STUDYBOT_SLUG) {
    try {
      const res = await fetch(`${AGENT_API_URL}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          user_id: CURRENT_USER_ID,
          agent_slug: agentSlug,
        }),
      });

      if (!res.ok) {
        throw new Error("Chat stream failed");
      }

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      yield* parseStream(reader);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // Clear conversation context
  async clearContext(agentId) {
    try {
      const res = await fetch(
        `${AGENT_API_URL}/dms/${CURRENT_USER_ID}/${agentId}/context`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to clear context");
      }

      return await res.json();
    } catch (error) {
      console.error("Error clearing context:", error);
      throw error;
    }
  },

  // Convert API message format to UI message format
  convertToUIMessage(apiMessage) {
    const isHuman = apiMessage.senderType === "human";
    const timestamp = new Date(parseInt(apiMessage.timestamp)).toLocaleTimeString(
      "vi-VN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    return {
      id: apiMessage.id,
      sender: isHuman ? "You" : "StudyBot",
      avatar: isHuman ? "Y" : "🤖",
      timestamp,
      content: apiMessage.content,
      isPinned: false,
      isBot: !isHuman,
      isEdited: apiMessage.edited === "true",
    };
  },
};
