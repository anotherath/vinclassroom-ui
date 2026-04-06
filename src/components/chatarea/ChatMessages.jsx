import { useState } from "react";
import { useSelector } from "react-redux";
import {
  FiPaperclip,
  FiMessageSquare,
  FiCornerDownRight,
  FiEdit2,
} from "react-icons/fi";
import { UserProfilePopup } from "../memberlist/index.js";
import { dmUsers } from "../../data/mockData.js";

// Predefined color palette for usernames (like Discord/Telegram)
// Bright colors visible in both dark and light mode
const usernameColors = [
  "#ff6b6b", // Bright Red
  "#ffa94d", // Bright Orange
  "#ffd43b", // Bright Yellow
  "#69db7c", // Bright Green
  "#38d9a9", // Bright Teal
  "#74c0fc", // Bright Blue
  "#b197fc", // Bright Purple
  "#f783ac", // Bright Pink
  "#66d9e8", // Bright Cyan
  "#e599f7", // Bright Rose
  "#9775fa", // Bright Indigo
  "#8ce99a", // Bright Mint
  "#ffe066", // Bright Gold
  "#a5d8ff", // Bright Sky
  "#c4b5fd", // Bright Lavender
  "#ff8787", // Bright Coral
];

const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

// Helper function to render message content with @ mentions as styled tags
function renderMessageWithMentions(content, isDark, onShowProfile) {
  if (!content) return content;

  // Regex to match @username patterns (only letters, numbers, underscores - no spaces)
  const mentionRegex = /@([a-zA-Z0-9À-ỹ_]+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  // Create a map of user names to their data for quick lookup
  const userMap = {};
  dmUsers.forEach((user) => {
    userMap[user.name.toLowerCase()] = user;
  });

  while ((match = mentionRegex.exec(content)) !== null) {
    // Add text before the mention
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {content.substring(lastIndex, match.index)}
        </span>,
      );
    }

    // Extract the mentioned name
    const mentionedName = match[1].trim();
    const userData = userMap[mentionedName.toLowerCase()];

    // Get color for the mentioned user
    const mentionColor = userData ? getUserColor(userData.name) : "#74c0fc";

    // Render the mention as colored text
    parts.push(
      <span
        key={`mention-${match.index}`}
        className="font-semibold cursor-pointer"
        style={{
          color: mentionColor,
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (userData && onShowProfile) {
            onShowProfile(userData.name);
          }
        }}
      >
        @{mentionedName}
      </span>,
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(
      <span key={`text-end-${lastIndex}`}>{content.substring(lastIndex)}</span>,
    );
  }

  return parts.length > 0 ? parts : content;
}

// Generate a consistent color for each username
function getUserColor(name) {
  // Check if user has set a custom color for "You"
  if (name === "You") {
    const savedColor = localStorage.getItem("usernameColor");
    if (savedColor) return savedColor;
  }

  // Generate a hash-based color for consistent assignment
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % usernameColors.length;
  return usernameColors[index];
}

function ReplyPreview({ replyTo, isDark }) {
  if (!replyTo) return null;
  const replyColor = getUserColor(replyTo.sender);

  return (
    <div
      className="mb-2 px-2 py-1.5 rounded-md text-xs border-l-2 flex items-center gap-2"
      style={{
        borderColor: replyColor,
        background: isDark ? "var(--bg-surface-tertiary)" : "#f0f2f5",
      }}
    >
      {/* Single line: icon + name + content */}
      <FiCornerDownRight
        size={12}
        style={{ color: replyColor, flexShrink: 0 }}
      />
      <span style={{ color: replyColor, fontWeight: "600", flexShrink: 0 }}>
        {replyTo.sender}
      </span>
      <span className="truncate" style={{ color: "var(--text-secondary)" }}>
        {replyTo.content}
      </span>
    </div>
  );
}

function ReactionBar({ reactions, onAddReaction, isDark }) {
  return (
    <div className="flex items-center gap-1 mt-1 flex-wrap">
      {reactions?.map((reaction, idx) => (
        <button
          key={idx}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border transition-colors"
          style={{
            background: isDark ? "var(--bg-surface-tertiary)" : "#f0f2f5",
            borderColor: isDark ? "var(--border-secondary)" : "#e2e6ed",
          }}
          onClick={() => onAddReaction(reaction.emoji)}
        >
          <span>{reaction.emoji}</span>
          <span style={{ color: "var(--text-secondary)" }}>
            {reaction.count}
          </span>
        </button>
      ))}
    </div>
  );
}

function ChatMessage({ msg, isDark, onReply, onEdit, onShowProfile }) {
  const senderColor = getUserColor(msg.sender);
  const [showActions, setShowActions] = useState(false);
  const [reactions, setReactions] = useState(msg.reactions || []);
  const [showPicker, setShowPicker] = useState(false);
  const isOwnMessage = msg.sender === "You";

  const handleAddReaction = (emoji) => {
    const existing = reactions.find((r) => r.emoji === emoji);
    if (existing) {
      setReactions(
        reactions.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1 } : r,
        ),
      );
    } else {
      setReactions([...reactions, { emoji, count: 1, users: ["You"] }]);
    }
    setShowPicker(false);
  };

  return (
    <div
      className="flex gap-3 px-3 py-2 rounded-lg transition-colors relative group"
      style={{
        background: showActions ? "var(--hover-primary)" : "transparent",
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowPicker(false);
      }}
    >
      {/* Action buttons on hover: Reply + Add Reaction + Edit */}
      {showActions && (
        <div
          className="absolute -top-2 right-2 flex items-center gap-1 z-10"
          style={{
            background: isDark ? "var(--bg-surface-secondary)" : "#fff",
            border: "1px solid var(--border-primary)",
            borderRadius: "9999px",
            padding: "2px 4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          {/* Quick reactions */}
          {quickReactions.slice(0, 3).map((emoji) => (
            <button
              key={emoji}
              className="w-6 h-6 flex items-center justify-center rounded text-sm hover:scale-125 transition-transform"
              onClick={() => handleAddReaction(emoji)}
            >
              {emoji}
            </button>
          ))}
          {/* Reply button */}
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full transition-all"
            style={{
              color: "var(--text-secondary)",
            }}
            onClick={() => onReply(msg)}
            title="Reply"
          >
            <FiMessageSquare size={14} />
          </button>
          {/* Edit button (only for own messages) */}
          {isOwnMessage && onEdit && (
            <button
              className="w-7 h-7 flex items-center justify-center rounded-full transition-all"
              style={{
                color: "var(--text-secondary)",
              }}
              onClick={() => onEdit(msg)}
              title="Edit message"
            >
              <FiEdit2 size={13} />
            </button>
          )}
          {/* Add reaction button */}
          <div className="relative">
            <button
              className="w-7 h-7 flex items-center justify-center rounded-full transition-all"
              style={{
                color: "var(--text-secondary)",
              }}
              onClick={() => setShowPicker(!showPicker)}
              title="Add reaction"
            >
              <span className="text-sm font-bold">+</span>
            </button>
            {showPicker && (
              <div
                className="absolute bottom-8 right-0 flex gap-1 p-1 rounded-lg shadow-lg z-20"
                style={{
                  background: isDark ? "var(--bg-surface-secondary)" : "#fff",
                  border: "1px solid var(--border-primary)",
                }}
              >
                {quickReactions.map((emoji) => (
                  <button
                    key={emoji}
                    className="w-7 h-7 flex items-center justify-center rounded hover:bg-opacity-20 transition-colors"
                    style={{
                      background: isDark ? "var(--hover-primary)" : "#f0f2f5",
                    }}
                    onClick={() => {
                      handleAddReaction(emoji);
                      setShowPicker(false);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 cursor-pointer"
        style={{
          background: msg.isBot ? "var(--tertiary-active)" : senderColor,
          color: msg.isBot
            ? "var(--tertiary)"
            : isDark
              ? "var(--bg-surface)"
              : "#fff",
          fontSize: msg.isBot ? "1.25rem" : "0.875rem",
        }}
        onClick={() => onShowProfile && onShowProfile(msg.sender)}
      >
        {msg.avatar}
      </div>
      <div className="flex-1 min-w-0">
        {/* Sender name and timestamp first */}
        <div className="flex items-baseline gap-2 mb-1">
          <span
            className="text-[13px] font-semibold cursor-pointer hover:underline"
            style={{
              color: msg.isBot ? "var(--tertiary)" : senderColor,
            }}
            onClick={() => onShowProfile && onShowProfile(msg.sender)}
          >
            {msg.sender}
          </span>
          {msg.isBot && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{
                background: "var(--tertiary-active)",
                color: "var(--tertiary)",
              }}
            >
              Bot
            </span>
          )}
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {msg.timestamp}
          </span>
        </div>
        {/* Reply preview below sender info */}
        <ReplyPreview replyTo={msg.replyTo} isDark={isDark} />
        {/* Message content */}
        <div
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-primary)" }}
        >
          {renderMessageWithMentions(msg.content, isDark, onShowProfile)}
          {msg.isEdited && (
            <span
              className="ml-1 text-[10px] italic"
              style={{ color: "var(--text-muted)" }}
            >
              (đã chỉnh sửa)
            </span>
          )}
        </div>
        {msg.hasAttachment && (
          <div
            className="flex items-center gap-2 mt-2 px-3 py-2 border rounded-md text-sm cursor-pointer"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--border-primary)",
              color: "var(--primary)",
            }}
          >
            <FiPaperclip size={14} /> {msg.attachmentName}
          </div>
        )}
        {reactions.length > 0 && (
          <ReactionBar
            reactions={reactions}
            onAddReaction={handleAddReaction}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  );
}

function TypingIndicator({ isDark }) {
  return (
    <div className="flex gap-3 px-3 py-2">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
        style={{
          background: "var(--tertiary-active)",
          color: "var(--tertiary)",
        }}
      >
        🤖
      </div>
      <div className="flex items-center gap-1">
        <div
          className="w-2 h-2 rounded-full animate-bounce"
          style={{
            background: "var(--tertiary)",
            animationDelay: "0ms",
          }}
        />
        <div
          className="w-2 h-2 rounded-full animate-bounce"
          style={{
            background: "var(--tertiary)",
            animationDelay: "150ms",
          }}
        />
        <div
          className="w-2 h-2 rounded-full animate-bounce"
          style={{
            background: "var(--tertiary)",
            animationDelay: "300ms",
          }}
        />
      </div>
    </div>
  );
}

function ChatMessages({
  isDark,
  chatMessages,
  onReply,
  isTyping,
  onEdit,
  onShowProfile,
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
      {chatMessages.map((msg) => (
        <ChatMessage
          key={msg.id}
          msg={msg}
          isDark={isDark}
          onReply={onReply}
          onEdit={onEdit}
          onShowProfile={onShowProfile}
        />
      ))}
      {isTyping && <TypingIndicator isDark={isDark} />}
    </div>
  );
}

export default ChatMessages;
