import { useState, useEffect, useRef, useCallback } from "react";
import { FiX, FiPaperclip } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import MentionSuggestions from "./MentionSuggestions";
import { dmUsers } from "../../data/mockData";

// Get color for a user (same as ChatMessages)
const usernameColors = [
  "#ff6b6b",
  "#ffa94d",
  "#ffd43b",
  "#69db7c",
  "#38d9a9",
  "#74c0fc",
  "#b197fc",
  "#f783ac",
  "#66d9e8",
  "#e599f7",
  "#9775fa",
  "#8ce99a",
  "#ffe066",
  "#a5d8ff",
  "#c4b5fd",
  "#ff8787",
];

function getUserColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % usernameColors.length;
  return usernameColors[index];
}

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
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [mentionStartOffset, setMentionStartOffset] = useState(-1);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [mentions, setMentions] = useState([]); // Track inserted mentions for deletion
  const [isEmpty, setIsEmpty] = useState(true);
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  const placeholderText = editMessage
    ? "Chỉnh sửa tin nhắn..."
    : replyTo
      ? `Reply to ${replyTo.sender}...`
      : placeholder;

  useEffect(() => {
    if (editMessage) {
      if (editorRef.current) {
        editorRef.current.innerHTML = editMessage.content;
      }
      setIsEmpty(!editMessage.content);
    } else {
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
      setMentions([]);
      setIsEmpty(true);
    }
    setShowMentions(false);
  }, [editMessage]);

  // Close mentions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowMentions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get plain text from contentEditable
  const getPlainText = useCallback(() => {
    if (editorRef.current) {
      return editorRef.current.innerText || "";
    }
    return "";
  }, []);

  // Get cursor position as text offset
  const getCursorOffset = useCallback(() => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return 0;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editorRef.current);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  }, []);

  // Check for @ mention pattern
  const checkForMention = useCallback(() => {
    const cursorOffset = getCursorOffset();
    const plainText = getPlainText();
    const textBeforeCursor = plainText.substring(0, cursorOffset);
    const mentionMatch = textBeforeCursor.match(/@([a-zA-Z0-9À-ỹ_]*)$/);

    if (mentionMatch) {
      setMentionFilter(mentionMatch[1]);
      setMentionStartOffset(cursorOffset - mentionMatch[0].length);
      setShowMentions(true);
      setSelectedMentionIndex(0);
    } else {
      setShowMentions(false);
      setMentionStartOffset(-1);
    }
  }, [getCursorOffset, getPlainText]);

  const handleInput = (e) => {
    checkForMention();
    // Update empty state for placeholder visibility
    const plainText = getPlainText();
    setIsEmpty(plainText.trim() === "");
  };

  const handleMentionSelect = (user) => {
    if (user === null) {
      setShowMentions(false);
      return;
    }

    // Remove the @filter text and insert colored mention
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const plainText = getPlainText();
    const cursorOffset = getCursorOffset();

    // Calculate where the @ starts
    const textBeforeCursor = plainText.substring(0, cursorOffset);
    const mentionMatch = textBeforeCursor.match(/@([a-zA-Z0-9À-ỹ_]*)$/);
    if (!mentionMatch) return;

    const atPosition = cursorOffset - mentionMatch[0].length;

    // Create a text node for the part before @
    const beforeText = plainText.substring(0, atPosition);

    // Create the mention span
    const mentionColor = getUserColor(user.name);
    const mentionSpan = document.createElement("span");
    mentionSpan.className = "mention-tag";
    mentionSpan.contentEditable = "false";
    mentionSpan.style.cssText = `color: ${mentionColor}; font-weight: 600; cursor: pointer;`;
    mentionSpan.textContent = `@${user.name} `;
    mentionSpan.dataset.userId = user.id;
    mentionSpan.dataset.userName = user.name;

    // Clear the editor and rebuild
    editorRef.current.innerHTML = "";

    // Add text before mention
    if (beforeText) {
      editorRef.current.appendChild(document.createTextNode(beforeText));
    }

    // Add mention
    editorRef.current.appendChild(mentionSpan);

    // Add remaining text after cursor
    const afterText = plainText.substring(cursorOffset);
    if (afterText) {
      editorRef.current.appendChild(document.createTextNode(afterText));
    }

    // Track this mention for deletion
    setMentions((prev) => [...prev, { id: user.id, name: user.name }]);

    // Move cursor after the mention
    const newRange = document.createRange();
    newRange.setStartAfter(mentionSpan);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);

    setShowMentions(false);
    editorRef.current.focus();
  };

  const handleSend = () => {
    const content = getPlainText().trim();
    if (content) {
      if (editMessage && onEdit) {
        onEdit(editMessage.id, content);
        if (onCancelEdit) onCancelEdit();
      } else if (onSend) {
        onSend(content, replyTo);
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
        }
        setMentions([]);
        setIsEmpty(true);
        if (onCancelReply) onCancelReply();
      }
      setShowMentions(false);
    }
  };

  const handleKeyDown = (e) => {
    // Handle mention navigation when popup is open
    if (showMentions) {
      const filteredUsers = dmUsers.filter((user) =>
        user.name.toLowerCase().includes(mentionFilter.toLowerCase()),
      );

      if (e.key === "ArrowDown") {
        e.preventDefault();
        e.stopPropagation();
        setSelectedMentionIndex((prev) =>
          prev < filteredUsers.length - 1 ? prev + 1 : prev,
        );
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        setSelectedMentionIndex((prev) => (prev > 0 ? prev - 1 : prev));
        return;
      }

      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        e.stopPropagation();
        if (filteredUsers[selectedMentionIndex]) {
          handleMentionSelect(filteredUsers[selectedMentionIndex]);
        }
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setShowMentions(false);
        return;
      }
    }

    // Handle Enter to send message (only if not selecting a mention)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }

    // Handle backspace to delete entire mention
    if (e.key === "Backspace") {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const cursorOffset = getCursorOffset();

      // Check if cursor is right after a mention
      if (cursorOffset > 0 && range.startOffset === 0) {
        const prevNode = range.startContainer.previousSibling;
        if (
          prevNode &&
          prevNode.classList &&
          prevNode.classList.contains("mention-tag")
        ) {
          e.preventDefault();
          prevNode.remove();
          setMentions((prev) =>
            prev.filter((m) => m.id !== prevNode.dataset.userId),
          );
          return;
        }
      }

      // Check if we're deleting into a mention from within text
      if (cursorOffset > 0) {
        const plainText = getPlainText();
        const charBeforeCursor = plainText[cursorOffset - 1];

        if (charBeforeCursor === " ") {
          // Check if there's a mention before the space
          const textBeforeSpace = plainText.substring(0, cursorOffset - 1);
          const lastAtPos = textBeforeSpace.lastIndexOf("@");
          if (lastAtPos >= 0) {
            const potentialMention = textBeforeSpace.substring(lastAtPos);
            const mentionedUser = dmUsers.find(
              (u) =>
                `@${u.name} ` === potentialMention ||
                `@${u.name}` === potentialMention,
            );
            if (mentionedUser) {
              e.preventDefault();
              // Remove the mention and the space
              const beforeMention = plainText.substring(0, lastAtPos);
              const afterMention = plainText.substring(cursorOffset);
              editorRef.current.innerHTML = "";
              if (beforeMention) {
                editorRef.current.appendChild(
                  document.createTextNode(beforeMention),
                );
              }
              if (afterMention) {
                editorRef.current.appendChild(
                  document.createTextNode(afterMention),
                );
              }
              // Set cursor position
              const newRange = document.createRange();
              const textNode = editorRef.current.lastChild || editorRef.current;
              newRange.setStart(textNode, beforeMention.length);
              newRange.collapse(true);
              selection.removeAllRanges();
              selection.addRange(newRange);
              setMentions((prev) =>
                prev.filter((m) => m.id !== mentionedUser.id),
              );
              return;
            }
          }
        }
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="px-4 py-3 border-t flex-shrink-0 relative"
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

      {/* Mention Suggestions Popup */}
      {showMentions && (
        <div
          className="absolute bottom-full left-4 right-4 mb-2 rounded-lg shadow-lg border overflow-hidden z-50"
          style={{
            background: isDark ? "var(--bg-surface-secondary)" : "#fff",
            borderColor: "var(--border-primary)",
          }}
        >
          <MentionSuggestions
            onSelect={handleMentionSelect}
            isDark={isDark}
            filterText={mentionFilter}
            selectedIndex={selectedMentionIndex}
          />
        </div>
      )}

      <div
        className="chat-input-wrapper flex items-center gap-2 border rounded-lg p-1 transition-colors relative"
        style={{
          background: "var(--input-bg)",
          borderColor: "var(--input-border)",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = "var(--input-border)")
        }
      >
        {/* Placeholder element */}
        <div className={`chat-input-placeholder ${isEmpty ? "" : "hidden"}`}>
          {placeholderText}
        </div>
        <div
          ref={editorRef}
          contentEditable
          className="flex-1 border-none bg-transparent px-3 py-2 text-sm outline-none font-sans min-h-[36px] max-h-32 overflow-y-auto relative z-10"
          style={{
            color: "var(--input-text)",
          }}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          suppressContentEditableWarning
        />
        <button
          type="button"
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
          type="button"
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
