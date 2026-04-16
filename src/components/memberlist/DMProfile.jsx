import SharedFile from "./SharedFile";
import { getUserColor } from "../../utils/userColor";

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
      <div className="p-4">
        <div
          className="flex flex-col items-center text-center pb-4 border-b mb-4"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <UserAvatar
            name={dmUser.name}
            avatarUrl={dmUser.avatar}
            isOnline={dmUser.isOnline}
            isDark={isDark}
            isBot={dmUser.isBot}
          />
          <div
            className="text-base font-semibold mt-3"
            style={{ color: "var(--text-primary)" }}
          >
            {dmUser.name}
          </div>
          <div
            className="text-xs mt-1 flex items-center gap-1.5"
            style={{ color: "var(--text-secondary)" }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: dmUser.isOnline
                  ? "var(--online)"
                  : "var(--offline)",
              }}
            />
            {dmUser.isOnline ? "Đang hoạt động" : "Ngoại tuyến"}
          </div>
          {dmUser.bio && (
            <div
              className="text-xs mt-2 px-2"
              style={{ color: "var(--text-muted)" }}
            >
              {dmUser.bio}
            </div>
          )}
        </div>
        <div
          className="pt-4 border-t"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <div
            className="text-[11px] font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            Tệp chia sẻ
          </div>
          <SharedFile
            isDark={isDark}
            fileName="bai_tap_giai_tich.pdf"
            time="10:30"
          />
        </div>
      </div>
    </div>
  );
}

export default DMProfile;
