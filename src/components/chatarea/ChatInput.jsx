import { useState, useEffect } from "react";
import { FiX, FiPaperclip } from "react-icons/fi";
import { IoSend } from "react-icons/io5";

function ChatInput({
  isDark,
  placeholder,
  replyTo,
  onCancelReply,
  editMessage,
  onCancelEdit,
  onSend,
  onEdit,
}) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (editMessage) {
      setInputValue(editMessage.content);
    } else {
      setInputValue("");
    }
  }, [editMessage]);

  const handleSend = () => {
    if (inputValue.trim()) {
      if (editMessage && onEdit) {
        onEdit(editMessage.id, inputValue);
        if (onCancelEdit) onCancelEdit();
      } else if (onSend) {
        onSend(inputValue, replyTo);
        setInputValue("");
        if (onCancelReply) onCancelReply();
      } else {
        console.log(
          "Sending message:",
          inputValue,
          replyTo ? "replying to" : replyTo,
        );
        setInputValue("");
        if (onCancelReply) onCancelReply();
      }
    }
  };

  return (
    <div
      className="px-4 py-3 border-t flex-shrink-0"
      style={{
        borderColor: "var(--border-primary)",
        background: "var(--bg-surface-secondary)",
      }}
    >
      {editMessage && (
        <div
          className="flex items-center justify-between px-3 py-2 mb-2 rounded-md text-xs"
          style={{
            background: isDark ? "var(--bg-surface-tertiary)" : "#f0f2f5",
            border: "1px solid var(--primary)",
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span style={{ color: "var(--primary)", fontWeight: "600" }}>
              Chỉnh sửa tin nhắn
            </span>
            <span
              className="truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              {editMessage.content}
            </span>
          </div>
          <button
            className="ml-2 flex-shrink-0 p-0.5 rounded hover:bg-opacity-20"
            style={{ color: "var(--text-secondary)" }}
            onClick={onCancelEdit}
          >
            <FiX size={14} />
          </button>
        </div>
      )}
      {replyTo && !editMessage && (
        <div
          className="flex items-center justify-between px-3 py-2 mb-2 rounded-md text-xs"
          style={{
            background: isDark ? "var(--bg-surface-tertiary)" : "#f0f2f5",
            border: "1px solid var(--border-primary)",
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span style={{ color: "var(--primary)", fontWeight: "600" }}>
              Replying to {replyTo.sender}
            </span>
            <span
              className="truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              {replyTo.content}
            </span>
          </div>
          <button
            className="ml-2 flex-shrink-0 p-0.5 rounded hover:bg-opacity-20"
            style={{ color: "var(--text-secondary)" }}
            onClick={onCancelReply}
          >
            <FiX size={14} />
          </button>
        </div>
      )}
      <div
        className="flex items-center gap-2 border rounded-lg p-1 transition-colors"
        style={{
          background: "var(--input-bg)",
          borderColor: "var(--input-border)",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = "var(--input-border)")
        }
      >
        <input
          type="text"
          className="flex-1 border-none bg-transparent px-3 py-2 text-sm outline-none font-sans"
          style={{
            color: "var(--input-text)",
          }}
          placeholder={
            editMessage
              ? "Chỉnh sửa tin nhắn..."
              : replyTo
                ? `Reply to ${replyTo.sender}...`
                : placeholder
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputValue.trim()) handleSend();
          }}
        />
        <button
          className="w-9 h-9 border-none rounded-md cursor-pointer flex items-center justify-center transition-colors"
          style={{
            background: "transparent",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--hover-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
          title="Đính kèm file"
        >
          <FiPaperclip size={18} />
        </button>
        <button
          className="w-9 h-9 border-none rounded-md cursor-pointer flex items-center justify-center transition-colors"
          style={{
            background: editMessage
              ? "var(--secondary-active, #f59e0b)"
              : "var(--primary)",
            color: isDark ? "var(--bg-surface)" : "#fff",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = editMessage
              ? "var(--secondary-hover, #d97706)"
              : "var(--primary-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = editMessage
              ? "var(--secondary-active, #f59e0b)"
              : "var(--primary)")
          }
          onClick={handleSend}
          title={editMessage ? "Lưu chỉnh sửa" : "Gửi"}
        >
          <IoSend size={18} />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
