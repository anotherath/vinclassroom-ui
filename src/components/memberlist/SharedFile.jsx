import { FiFileText } from "react-icons/fi";

function SharedFile({ isDark, fileName, time }) {
  return (
    <div
      className="flex items-center gap-2 p-2 rounded-md cursor-pointer"
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--hover-primary)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center text-xs flex-shrink-0"
        style={{
          background: "var(--primary-active)",
          color: "var(--primary)",
        }}
      >
        <FiFileText size={12} />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-xs truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {fileName}
        </div>
        <div
          className="text-[11px] mt-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          Gửi lúc {time}
        </div>
      </div>
    </div>
  );
}

export default SharedFile;
