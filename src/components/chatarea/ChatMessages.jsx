import { useState, useRef, useEffect, useCallback } from "react";
import { FiPaperclip } from "react-icons/fi";
import { MessageActions, ReplyPreview, ReactionBar } from "./MessageActions";
import { renderMessageWithMentions } from "./MessageContent";
import FileAttachment from "./FileAttachment";
import { getUserColor } from "../../utils/userColor";

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
      {/* Action buttons on hover */}
      <MessageActions
        show={showActions}
        isDark={isDark}
        isOwnMessage={isOwnMessage}
        onReply={() => onReply(msg)}
        onEdit={() => onEdit(msg)}
        onReaction={handleAddReaction}
        showPicker={showPicker}
        onTogglePicker={() => setShowPicker(!showPicker)}
      />

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
        {msg.hasAttachment && msg.attachments && msg.attachments.length > 0 ? (
          <div className="mt-2 space-y-2">
            {msg.attachments.map((attachment, index) => (
              <FileAttachment
                key={index}
                attachment={attachment}
                isDark={isDark}
              />
            ))}
          </div>
        ) : msg.hasAttachment ? (
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
        ) : null}
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
          className="w-2 h-2 rounded-full animate-pulse"
          style={{
            background: "var(--tertiary)",
            animationDelay: "0ms",
          }}
        />
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{
            background: "var(--tertiary)",
            animationDelay: "150ms",
          }}
        />
        <div
          className="w-2 h-2 rounded-full animate-pulse"
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
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isLoadingTop, setIsLoadingTop] = useState(false);

  // Auto-scroll to bottom instantly on initial load and when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [chatMessages.length]);

  // Scroll to bottom instantly on mount
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  // Handle scroll event to detect when user reaches the top
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Check if scrolled to top (within 10px threshold)
    if (container.scrollTop < 10 && !isLoadingTop) {
      setIsLoadingTop(true);
      // Simulate loading older messages
      setTimeout(() => {
        setIsLoadingTop(false);
      }, 1500);
    }
  }, [isLoadingTop]);

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-1"
      onScroll={handleScroll}
    >
      {/* Loading indicator at top */}
      {isLoadingTop && (
        <div className="flex items-center justify-center gap-2 py-3">
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                background: "var(--tertiary)",
                animationDelay: "0ms",
              }}
            />
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                background: "var(--tertiary)",
                animationDelay: "150ms",
              }}
            />
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                background: "var(--tertiary)",
                animationDelay: "300ms",
              }}
            />
          </div>
        </div>
      )}
      {/* Spacer to push messages to bottom */}
      <div className="flex-1" />
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
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;
