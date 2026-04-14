import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useCallback, useRef } from "react";
import { messages, directMessages, dmUsers } from "../data/mockData";
import { ChatHeader, ChatMessages, ChatInput } from "./chatarea/index.js";
import { SettingsView } from "./settings/index.js";
import { UserProfilePopup } from "./memberlist/index.js";
import {
  setReplyTo,
  cancelReply,
  setEditMessage,
  cancelEdit,
  setSelectedUser,
  clearSelectedUser,
} from "../store/slices/chatSlice";
import { addMessage } from "../store/slices/messageSlice";
import { agentService } from "../services/agent.service";

function ChatArea({ activeView, activeRoom }) {
  const dispatch = useDispatch();
  const { isDark } = useSelector((state) => state.theme);
  const { replyTo, editMessage, selectedUser } = useSelector(
    (state) => state.chat,
  );
  const appState = useSelector((state) => state.app);

  const room = activeRoom || appState.activeRoom;
  const view = activeView || appState.activeView;

  const isBotRoom = room === "tro-ly-ai";
  const isDM = dmUsers.some((dm) => dm.id === room);
  const isStudyBotDM = room === "studybot-dm";

  // StudyBot API states
  const [studyBotMessages, setStudyBotMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const studyBotAgentId = useRef(null);

  // Get mock messages and user-sent messages
  const mockMessages = isDM ? directMessages[room] || [] : messages[room] || [];
  const userMessages = useSelector(
    (state) => state.message.userMessages[room] || [],
  );

  // Use StudyBot API messages if in StudyBot DM, otherwise use mock + user messages
  const chatMessages = isStudyBotDM
    ? studyBotMessages
    : [...mockMessages, ...userMessages];

  const placeholder =
    isBotRoom || isStudyBotDM
      ? "Hỏi trợ lý AI..."
      : "Nhắn tin cho nhóm học...";

  // Load StudyBot messages from API
  const loadStudyBotMessages = useCallback(async () => {
    if (!isStudyBotDM) return;

    try {
      // Get or create agent
      const agent = await agentService.getOrCreateAgent();
      studyBotAgentId.current = agent.agentId || agent.id;

      // Get messages
      const apiMessages = await agentService.getMessages(studyBotAgentId.current);
      const uiMessages = apiMessages.map(agentService.convertToUIMessage);
      setStudyBotMessages(uiMessages);
    } catch (error) {
      console.error("Failed to load StudyBot messages:", error);
      // Fall back to mock data on error
      setStudyBotMessages(directMessages["studybot-dm"] || []);
    }
  }, [isStudyBotDM]);

  // Load messages when entering StudyBot DM
  useEffect(() => {
    if (isStudyBotDM) {
      loadStudyBotMessages();
    }
  }, [isStudyBotDM, loadStudyBotMessages]);

  // Send message to StudyBot
  const sendMessageToStudyBot = useCallback(async (content) => {
    if (!content.trim()) return;

    setIsStreaming(true);
    setIsTyping(true);

    // Add user message optimistically
    const userMessage = {
      id: `temp-${Date.now()}`,
      sender: "You",
      avatar: "Y",
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      content,
      isPinned: false,
    };

    setStudyBotMessages((prev) => [...prev, userMessage]);

    let fullResponse = "";
    let hasReceivedFirstToken = false;

    try {
      for await (const event of agentService.sendMessage(content)) {
        switch (event.type) {
          case "token":
            // Hide typing indicator on first token received
            if (!hasReceivedFirstToken) {
              hasReceivedFirstToken = true;
              setIsTyping(false);
            }
            fullResponse += event.content || "";
            // Update streaming message
            setStudyBotMessages((prev) => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg?.sender === "StudyBot" && lastMsg.id.startsWith("stream-")) {
                // Update existing streaming message
                return [
                  ...prev.slice(0, -1),
                  { ...lastMsg, content: fullResponse },
                ];
              }
              // Add new streaming message
              return [
                ...prev,
                {
                  id: `stream-${Date.now()}`,
                  sender: "StudyBot",
                  avatar: "🤖",
                  timestamp: new Date().toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  content: fullResponse,
                  isPinned: false,
                  isBot: true,
                },
              ];
            });
            break;

          case "done":
            if (event.agent_id) {
              studyBotAgentId.current = event.agent_id;
            }
            break;

          case "tool_start":
            console.log("Tool called:", event.tool, event.args);
            break;

          case "tool_end":
            console.log("Tool result:", event.result);
            break;
        }
      }

      // Don't reload messages immediately after streaming to avoid losing the message
      // The streaming message already has full content and is displayed correctly
      // Messages will be properly loaded when user revisits the room
    } catch (error) {
      console.error("StudyBot chat error:", error);
      // Add error message
      setStudyBotMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: "StudyBot",
          avatar: "🤖",
          timestamp: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
          isPinned: false,
          isBot: true,
        },
      ]);
    } finally {
      setIsStreaming(false);
      setIsTyping(false);
    }
  }, [loadStudyBotMessages]);

  // Settings view
  if (view === "settings") {
    return <SettingsView isDark={isDark} />;
  }

  // Normal chat view
  return (
    <div
      className="flex-1 flex flex-col min-w-0"
      style={{ background: "var(--bg-surface)" }}
    >
      <ChatHeader
        isDark={isDark}
        activeRoom={room}
        isBotRoom={isBotRoom}
        isDM={isDM}
      />
      {/* User Profile Popup */}
      {selectedUser && (
        <UserProfilePopup
          user={selectedUser}
          isDark={isDark}
          onClose={() => dispatch(clearSelectedUser())}
          onSendMessage={() => {
            dispatch(clearSelectedUser());
          }}
        />
      )}

      <ChatMessages
        isDark={isDark}
        chatMessages={chatMessages}
        onReply={(msg) => {
          dispatch(setReplyTo(msg));
          dispatch(cancelEdit());
        }}
        onEdit={(msg) => {
          dispatch(setEditMessage(msg));
          dispatch(cancelReply());
        }}
        onShowProfile={(senderName) => {
          // Find user info from dmUsers or create a mock user
          const dmUser = dmUsers.find((dm) => dm.name === senderName);
          if (dmUser) {
            dispatch(setSelectedUser(dmUser));
          } else {
            // Create a mock user for senders not in dmUsers
            dispatch(
              setSelectedUser({
                id: senderName.toLowerCase(),
                name: senderName,
                avatar: senderName.charAt(0).toUpperCase(),
                isOnline: true,
                isFriend: false,
                email: `${senderName.toLowerCase()}@vinclassroom.edu.vn`,
                mutualFriends: Math.floor(Math.random() * 10),
                sharedSpaces: ["Toán cao cấp"],
              }),
            );
          }
        }}
        isTyping={(isBotRoom || isStudyBotDM) && isTyping}
      />
      <ChatInput
        isDark={isDark}
        placeholder={placeholder}
        replyTo={replyTo}
        onCancelReply={() => dispatch(cancelReply())}
        editMessage={editMessage}
        onCancelEdit={() => dispatch(cancelEdit())}
        onSend={(content, replyToMsg, files) => {
          // For StudyBot DM, use API
          if (isStudyBotDM) {
            sendMessageToStudyBot(content);
            return;
          }

          // For other rooms/DMs, use mock + Redux
          const newMessage = {
            id: Date.now(),
            sender: "You",
            avatar: "Y",
            timestamp: new Date().toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            content,
            isPinned: false,
            replyTo: replyToMsg || null,
          };

          // Add attachment info if files are selected
          if (files && files.length > 0) {
            const firstFile = files[0];
            newMessage.hasAttachment = true;
            newMessage.attachmentName = firstFile.name;
            newMessage.attachmentType = firstFile.type.startsWith("image/")
              ? "image"
              : firstFile.type === "application/pdf"
                ? "pdf"
                : "other";
            newMessage.attachmentUrl = firstFile.preview || firstFile.name;
            newMessage.attachments = files.map((f) => ({
              name: f.name,
              type: f.type.startsWith("image/")
                ? "image"
                : f.type === "application/pdf"
                  ? "pdf"
                  : "other",
              url: f.preview || f.name,
            }));
          }

          dispatch(addMessage({ roomId: room, message: newMessage }));
        }}
      />
    </div>
  );
}

export default ChatArea;
