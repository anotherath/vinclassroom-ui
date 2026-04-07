import { useSelector, useDispatch } from "react-redux";
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

  // Get mock messages and user-sent messages
  const mockMessages = isDM ? directMessages[room] || [] : messages[room] || [];
  const userMessages = useSelector(
    (state) => state.message.userMessages[room] || [],
  );
  const chatMessages = [...mockMessages, ...userMessages];

  const placeholder =
    isBotRoom || (isDM && room === "studybot-dm")
      ? "Hỏi trợ lý AI..."
      : "Nhắn tin cho nhóm học...";

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
          onSendMessage={(user) => {
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
        isTyping={isBotRoom || (isDM && room === "studybot-dm")}
      />
      <ChatInput
        isDark={isDark}
        placeholder={placeholder}
        replyTo={replyTo}
        onCancelReply={() => dispatch(cancelReply())}
        editMessage={editMessage}
        onCancelEdit={() => dispatch(cancelEdit())}
        onSend={(content, replyToMsg, files) => {
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
