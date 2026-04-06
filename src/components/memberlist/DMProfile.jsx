import SharedFile from "./SharedFile";

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
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold mb-3 relative"
            style={{
              background: dmUser.isBot
                ? "var(--tertiary-active)"
                : "var(--primary)",
              color: dmUser.isBot
                ? "var(--tertiary)"
                : isDark
                  ? "var(--bg-surface)"
                  : "#fff",
            }}
          >
            {dmUser.avatar}
            <div
              className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full"
              style={{
                background: dmUser.isOnline
                  ? "var(--online)"
                  : "var(--offline)",
              }}
            />
          </div>
          <div
            className="text-base font-semibold"
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
