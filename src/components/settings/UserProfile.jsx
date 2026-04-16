import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const usernameColors = [
  { name: "Mặc định", value: "" },
  { name: "Đỏ", value: "#ff6b6b" },
  { name: "Cam", value: "#ff9f43" },
  { name: "Vàng", value: "#feca57" },
  { name: "Xanh lá", value: "#69f6b8" },
  { name: "Xanh dương", value: "#a3a6ff" },
  { name: "Tím", value: "#ac8aff" },
  { name: "Hồng", value: "#ff6b9d" },
  { name: "Xanh ngọc", value: "#48dbfb" },
  { name: "Trắng", value: "#e8ecf4" },
];

function UserProfile() {
  const { isDark } = useSelector((state) => state.theme);
  const authUser = useSelector((state) => state.auth.user);

  const [userName, setUserName] = useState(
    () => localStorage.getItem("userName") || authUser?.name || "Sinh viên",
  );
  const [userEmail, setUserEmail] = useState(
    () => localStorage.getItem("userEmail") || authUser?.email || "sinhvien@vinuni.edu.vn",
  );
  const [userAvatar, setUserAvatar] = useState(
    () => localStorage.getItem("userAvatar") || authUser?.name?.charAt(0) || "S",
  );
  const [usernameColor, setUsernameColor] = useState(
    () => localStorage.getItem("usernameColor") || "",
  );

  useEffect(() => {
    if (authUser) {
      if (!localStorage.getItem("userName")) {
        setUserName(authUser.name || "Sinh viên");
      }
      if (!localStorage.getItem("userEmail")) {
        setUserEmail(authUser.email || "sinhvien@vinuni.edu.vn");
      }
      if (!localStorage.getItem("userAvatar")) {
        setUserAvatar(authUser.name?.charAt(0) || "S");
      }
    }
  }, [authUser]);

  const handleColorChange = (color) => {
    setUsernameColor(color);
    localStorage.setItem("usernameColor", color);
  };

  return (
    <div
      className="p-4 rounded-lg space-y-4"
      style={{ background: "var(--card-bg-secondary)" }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-semibold"
          style={{
            background: "var(--primary)",
            color: isDark ? "var(--bg-surface)" : "#fff",
          }}
        >
          {userAvatar}
        </div>
        <div className="flex-1">
          <label
            className="text-xs font-medium mb-1 block"
            style={{ color: "var(--text-secondary)" }}
          >
            Avatar (1 ký tự)
          </label>
          <input
            type="text"
            maxLength={1}
            value={userAvatar}
            onChange={(e) => setUserAvatar(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 rounded-md text-sm border outline-none"
            style={{
              background: "var(--input-bg)",
              borderColor: "var(--input-border)",
              color: "var(--input-text)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--primary)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--input-border)")
            }
          />
        </div>
      </div>
      <div>
        <label
          className="text-xs font-medium mb-1 block"
          style={{ color: "var(--text-secondary)" }}
        >
          Tên hiển thị
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm border outline-none"
          style={{
            background: "var(--input-bg)",
            borderColor: "var(--input-border)",
            color: "var(--input-text)",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--primary)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--input-border)")
          }
        />
      </div>
      <div>
        <label
          className="text-xs font-medium mb-1 block"
          style={{ color: "var(--text-secondary)" }}
        >
          Email
        </label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm border outline-none"
          style={{
            background: "var(--input-bg)",
            borderColor: "var(--input-border)",
            color: "var(--input-text)",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--primary)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--input-border)")
          }
        />
      </div>

      {/* Username Color Picker */}
      <div>
        <label
          className="text-xs font-medium mb-2 block"
          style={{ color: "var(--text-secondary)" }}
        >
          Màu tên hiển thị
        </label>
        <div className="flex flex-wrap gap-2">
          {usernameColors.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorChange(color.value)}
              className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all"
              style={{
                background: color.value || "var(--text-primary)",
                borderColor:
                  usernameColor === color.value
                    ? "var(--primary)"
                    : "transparent",
                transform:
                  usernameColor === color.value ? "scale(1.15)" : "scale(1)",
              }}
              title={color.name}
            >
              {usernameColor === color.value && (
                <span
                  style={{
                    color: color.value ? "#fff" : "var(--bg-surface)",
                    fontSize: "14px",
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
          Màu hiện tại:{" "}
          <span
            style={{
              color: usernameColor || "var(--text-primary)",
              fontWeight: "600",
            }}
          >
            {usernameColors.find((c) => c.value === usernameColor)?.name ||
              "Mặc định"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
