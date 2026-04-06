import { dmUsers } from "../../data/mockData";

function ChatHeader({ isDark, activeRoom, isBotRoom, isDM }) {
  const headerTitle = isDM
    ? dmUsers.find((dm) => dm.id === activeRoom)?.name || "Chat"
    : `# ${activeRoom}`;

  const headerSubtitle = isBotRoom
    ? "Hỏi đáp với trợ lý AI"
    : isDM
      ? dmUsers.find((dm) => dm.id === activeRoom)?.isOnline
        ? "Đang hoạt động"
        : "Ngoại tuyến"
      : "Giải tích - tuần 1";

  return (
    <div
      className="px-4 py-3 border-b flex-shrink-0"
      style={{
        borderColor: "var(--border-primary)",
        background: "var(--bg-surface-secondary)",
      }}
    >
      <div
        className="text-[15px] font-semibold flex items-center gap-1.5"
        style={{ color: "var(--text-primary)" }}
      >
        {headerTitle}
      </div>
      <div
        className="text-xs mt-0.5"
        style={{ color: "var(--text-secondary)" }}
      >
        {headerSubtitle}
      </div>
    </div>
  );
}

export default ChatHeader;
