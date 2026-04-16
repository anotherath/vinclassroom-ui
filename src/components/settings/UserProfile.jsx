import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authService } from "../../services/auth.service";
import { updateProfileSuccess } from "../../store/slices/authSlice";

const usernameColors = [
  { name: "Mặc định", value: "" },
  { name: "Đỏ gạch", value: "#e57373" },
  { name: "Cam đất", value: "#ff8a65" },
  { name: "Vàng mù tạt", value: "#ffb74d" },
  { name: "Vàng chanh", value: "#fff176" },
  { name: "Xanh lá bơ", value: "#aed581" },
  { name: "Xanh ngọc nhạt", value: "#4db6ac" },
  { name: "Xanh dương nhạt", value: "#64b5f6" },
  { name: "Xanh biển", value: "#4fc3f7" },
  { name: "Tím nhạt", value: "#ba68c8" },
  { name: "Hồng phấn", value: "#f06292" },
  { name: "Hồng tím", value: "#e040fb" },
  { name: "Xanh cổ vịt", value: "#26c6da" },
  { name: "Xanh rêu", value: "#81c784" },
  { name: "Xanh denim", value: "#7986cb" },
  { name: "Tím oải hương", value: "#9575cd" },
  { name: "Xám xanh", value: "#90a4ae" },
  { name: "Nâu đất", value: "#a1887f" },
  { name: "Đỏ san hô", value: "#ff7043" },
  { name: "Vàng nắng", value: "#ffd54f" },
  { name: "Xanh lá mạ", value: "#dce775" },
  { name: "Xanh ngọc", value: "#4dd0e1" },
  { name: "Xanh dương", value: "#42a5f5" },
  { name: "Tím hoa cà", value: "#7e57c2" },
  { name: "Hồng đào", value: "#ec407a" },
  { name: "Xám bạc", value: "#b0bec5" },
  { name: "Xanh rừng", value: "#66bb6a" },
  { name: "Xanh biển sâu", value: "#29b6f6" },
  { name: "Tím đậm", value: "#ab47bc" },
  { name: "Cam neon", value: "#ffa726" },
  { name: "Vàng tươi", value: "#ffee58" },
  { name: "Hồng nhạt", value: "#ff8a80" },
  { name: "Xanh ngọc bích", value: "#80cbc4" },
];

const UserProfile = forwardRef(function UserProfile(_, ref) {
  const { isDark } = useSelector((state) => state.theme);
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [userName, setUserName] = useState(
    () => localStorage.getItem("userName") || authUser?.name || "Sinh viên",
  );
  const [userAvatar, setUserAvatar] = useState(
    () => localStorage.getItem("userAvatar") || authUser?.avatar || null,
  );
  const [userBio, setUserBio] = useState(
    () => localStorage.getItem("userBio") || authUser?.bio || "",
  );
  const [usernameColor, setUsernameColor] = useState(
    () => localStorage.getItem("usernameColor") || "",
  );
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (authUser) {
      if (!localStorage.getItem("userName")) {
        setUserName(authUser.name || "Sinh viên");
      }
      if (!localStorage.getItem("userAvatar")) {
        setUserAvatar(authUser.avatar || null);
      }
      if (!localStorage.getItem("userBio")) {
        setUserBio(authUser.bio || "");
      }
    }
  }, [authUser]);

  useImperativeHandle(ref, () => ({
    validateAndSave: async () => {
      const trimmedName = userName.trim();
      if (!trimmedName) {
        setNameError("Vui lòng nhập tên hiển thị");
        return { success: false, changed: false };
      }
      setNameError("");

      const trimmedBio = userBio.trim();
      const originalName = authUser?.name || "";
      const originalBio = authUser?.bio || "";
      const originalAvatar = authUser?.avatar || null;

      const hasChanged =
        trimmedName !== originalName ||
        trimmedBio !== originalBio ||
        userAvatar !== originalAvatar;

      if (trimmedBio.length > 500) {
        return { success: false, changed: false, error: "Giới thiệu tối đa 500 ký tự" };
      }

      localStorage.setItem("userName", trimmedName);
      localStorage.setItem("userAvatar", userAvatar);
      localStorage.setItem("userBio", trimmedBio);
      localStorage.setItem("usernameColor", usernameColor);

      if (!hasChanged) {
        return { success: true, changed: false };
      }

      try {
        const payload = {
          displayName: trimmedName,
          bio: trimmedBio || null,
          avatar: userAvatar || null,
        };
        const { data } = await authService.updateProfile(payload);
        if (data?.user) {
          dispatch(updateProfileSuccess(data.user));
          localStorage.setItem("auth_user", JSON.stringify(data.user));
        }
        return { success: true, changed: true };
      } catch (err) {
        const msg = err?.response?.data?.message || "Cập nhật thất bại";
        return { success: false, changed: false, error: msg };
      }
    },
  }));

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
          {userAvatar || userName.charAt(0) || "S"}
        </div>
        <div className="flex-1">
          <label
            className="text-xs font-medium mb-1 block"
            style={{ color: "var(--text-secondary)" }}
          >
            Tên hiển thị <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              if (nameError) setNameError("");
            }}
            placeholder="Nhập tên hiển thị"
            className="w-full px-3 py-2 rounded-md text-sm border outline-none"
            style={{
              background: "var(--input-bg)",
              borderColor: nameError ? "var(--danger)" : "var(--input-border)",
              color: "var(--input-text)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--primary)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = nameError ? "var(--danger)" : "var(--input-border)")
            }
          />
          {nameError && (
            <div className="text-xs mt-1" style={{ color: "var(--danger)" }}>
              {nameError}
            </div>
          )}
        </div>
      </div>
      <div>
        <label
          className="text-xs font-medium mb-1 block"
          style={{ color: "var(--text-secondary)" }}
        >
          Giới thiệu <span style={{ color: "var(--text-muted)" }}>(tùy chọn)</span>
        </label>
        <textarea
          value={userBio}
          onChange={(e) => {
            if (e.target.value.length <= 500) {
              setUserBio(e.target.value);
            }
          }}
          rows={3}
          placeholder="Viết một chút về bản thân..."
          className="w-full px-3 py-2 rounded-md text-sm border outline-none resize-none"
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
        <div className="text-xs mt-1 text-right" style={{ color: "var(--text-muted)" }}>
          {userBio.length}/500
        </div>
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
});

export default UserProfile;
