import SharedFile from "./SharedFile";
import { getUserColor } from "../../utils/userColor";
import { FiMail, FiFileText, FiInbox } from "react-icons/fi";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isEmoji(str) {
  if (!str) return false;
  return /\p{Emoji}/u.test(str) && str.length <= 2;
}

function UserAvatar({ name, avatarUrl, isOnline, isDark, isBot }) {
  const userColor = isBot ? "var(--tertiary-active)" : getUserColor(name);
  const textColor = isBot
    ? "var(--tertiary)"
    : isDark
      ? "var(--bg-surface)"
      : "#fff";

  const avatarEmoji = isEmoji(avatarUrl) ? avatarUrl : null;
  const imageUrl = avatarUrl && !avatarEmoji ? avatarUrl : null;

  return (
    <div className="relative flex-shrink-0">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold overflow-hidden"
        style={{
          background: userColor,
          color: textColor,
        }}
      >
        {avatarEmoji ? (
          <span className="text-3xl">{avatarEmoji}</span>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          getInitials(name)
        )}
      </div>
      {!isBot && (
        <div
          className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2"
          style={{
            borderColor: isDark ? "var(--bg-surface-secondary)" : "#fff",
            background: isOnline ? "var(--online)" : "var(--offline)",
          }}
        />
      )}
    </div>
  );
}

function DMProfile({ isDark, dmUser }) {
  if (!dmUser) return null;

  return (
    <div
      className="w-60 min-w-60 flex flex-col h-screen overflow-y-auto border-l"
      style={{
        background: "var(--bg-surface-secondary)",
        borderColor: "var(--border-primary)",
      }}
    >
      {/* Avatar + Name */}
      <div className="p-4 text-center">
        <div className="flex justify-center">
          <UserAvatar
            name={dmUser.name}
            avatarUrl={dmUser.avatar}
            isOnline={dmUser.isOnline}
            isDark={isDark}
            isBot={dmUser.isBot}
          />
        </div>
        <div
          className="text-base font-semibold mt-3"
          style={{ color: "var(--text-primary)" }}
        >
          {dmUser.name}
        </div>
        <div
          className="text-xs mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {dmUser.isOnline ? "Đang hoạt động" : "Ngoại tuyến"}
        </div>
      </div>

      {/* Info */}
      <div
        className="mx-4 py-3 border-t"
        style={{ borderColor: "var(--border-primary)" }}
      >
        {dmUser.email && (
          <div className="flex items-center gap-2 py-1.5">
            <FiMail size={14} style={{ color: "var(--text-muted)" }} />
            <span
              className="text-sm truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              {dmUser.email}
            </span>
          </div>
        )}
        {dmUser.bio && (
          <div className="flex items-start gap-2 py-1.5">
            <FiFileText size={14} style={{ color: "var(--text-muted)" }} />
            <span
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {dmUser.bio}
            </span>
          </div>
        )}
      </div>

      {/* Shared Files */}
      <div
        className="mx-4 mt-2 py-3 border-t"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <div
          className="text-xs font-medium mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          Tệp chia sẻ
        </div>
        {dmUser.sharedFiles && dmUser.sharedFiles.length > 0 ? (
          dmUser.sharedFiles.map((file, idx) => (
            <SharedFile
              key={idx}
              isDark={isDark}
              fileName={file.name}
              time={file.time}
              type={file.type}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <FiInbox size={24} style={{ color: "var(--text-muted)" }} />
            <div
              className="text-xs mt-2"
              style={{ color: "var(--text-muted)" }}
            >
              Chưa có tệp nào
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DMProfile;
