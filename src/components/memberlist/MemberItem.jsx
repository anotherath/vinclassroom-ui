// MemberItem component - receives isDark as prop from parent

// Same color palette as ChatMessages
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
  if (name === "You") {
    const savedColor = localStorage.getItem("usernameColor");
    if (savedColor) return savedColor;
  }
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % usernameColors.length;
  return usernameColors[index];
}

function MemberItem({ isDark, member, onClick }) {
  const memberColor = getUserColor(member.name);

  return (
    <div
      className="flex items-center gap-2.5 p-2 rounded-md cursor-pointer"
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--hover-primary)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      onClick={() => onClick?.()}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold flex-shrink-0 relative"
        style={{
          background: member.isBot ? "var(--tertiary-active)" : memberColor,
          color: member.isBot
            ? "var(--tertiary)"
            : isDark
              ? "var(--bg-surface)"
              : "#fff",
        }}
      >
        {member.avatar}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
          style={{
            borderColor: isDark ? "var(--bg-surface-secondary)" : "#fff",
            background: member.isOnline ? "var(--online)" : "var(--offline)",
          }}
        />
      </div>
      <span
        className="text-[13px] flex-1"
        style={{ color: member.isOnline ? memberColor : "var(--text-muted)" }}
      >
        {member.name}
      </span>
      {member.isBot && (
        <span
          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
          style={{
            background: "var(--tertiary-active)",
            color: "var(--tertiary)",
          }}
        >
          Trợ lý
        </span>
      )}
    </div>
  );
}

export default MemberItem;
