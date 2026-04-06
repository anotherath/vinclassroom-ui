import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { dmUsers, pendingFriendRequests } from "../../data/mockData";
import { FiUserPlus } from "react-icons/fi";
import { setActiveRoom } from "../../store/slices/appSlice";

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

function FriendRequestItem({
  user,
  isDark,
  onAccept,
  onDecline,
  onNavigateToChat,
}) {
  const userColor = getUserColor(user.name);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center px-3 py-2.5 rounded-md gap-2.5 mb-1 cursor-pointer"
      style={{
        background: isHovered
          ? isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.03)"
          : "transparent",
        borderRadius: "8px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 relative cursor-pointer"
        style={{
          background: userColor,
          color: isDark ? "var(--bg-surface)" : "#fff",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onNavigateToChat(user);
        }}
      >
        {user.avatar}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
          style={{
            borderColor: isDark ? "var(--bg-surface-secondary)" : "#fff",
            background: user.isOnline ? "var(--online)" : "var(--offline)",
          }}
        />
      </div>
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onNavigateToChat(user);
        }}
      >
        <div className="text-sm font-medium" style={{ color: userColor }}>
          {user.name}
        </div>
        <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {user.mutualFriends} bạn chung
        </div>
      </div>
      <div className="flex gap-1.5">
        <button
          className="w-5 h-5 flex items-center justify-center rounded transition-colors text-xs font-bold"
          style={{
            background: "transparent",
            color: "var(--text-secondary)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onAccept(user);
          }}
          title="Chấp nhận"
        >
          ✓
        </button>
        <button
          className="w-5 h-5 flex items-center justify-center rounded transition-colors text-xs font-bold"
          style={{
            background: "transparent",
            color: "var(--text-secondary)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDecline(user);
          }}
          title="Từ chối"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function DMItem({ dm, isDark, isActive, onClick, onAddFriend }) {
  const dmColor = getUserColor(dm.name);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    // Only navigate to the chat, don't show profile popup
    console.log("hello");
    onClick();
  };

  return (
    <div
      className="flex items-center px-3 py-2.5 rounded-md cursor-pointer transition-colors gap-2.5 mb-0.5"
      style={{
        background: isActive
          ? "var(--primary-active)"
          : isHovered
            ? isDark
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.03)"
            : "transparent",
        borderRadius: "8px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 relative"
        style={{
          background: dm.isBot ? "var(--tertiary-active)" : dmColor,
          color: dm.isBot
            ? "var(--tertiary)"
            : isDark
              ? "var(--bg-surface)"
              : "#fff",
        }}
      >
        {dm.avatar}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
          style={{
            borderColor: isDark ? "var(--bg-surface-secondary)" : "#fff",
            background: dm.isOnline ? "var(--online)" : "var(--offline)",
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <div className="text-sm font-medium" style={{ color: dmColor }}>
            {dm.name}
          </div>
        </div>
        <div
          className="text-xs mt-0.5 truncate"
          style={{
            color: dm.hasNewMessage
              ? "var(--text-primary)"
              : "var(--text-secondary)",
          }}
        >
          {dm.lastMessage}
        </div>
      </div>
      {!dm.isFriend && onAddFriend && (
        <button
          className="w-5 h-5 flex items-center justify-center rounded transition-colors flex-shrink-0"
          style={{
            background: "transparent",
            color: "var(--text-secondary)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onAddFriend(dm);
          }}
          title="Gửi lời mời kết bạn"
        >
          <FiUserPlus size={14} />
        </button>
      )}
    </div>
  );
}

function DMList({ activeRoom, setActiveRoom, searchQuery, setSearchQuery }) {
  const dispatch = useDispatch();
  const { isDark } = useSelector((state) => state.theme);
  const [pendingRequests, setPendingRequests] = useState(pendingFriendRequests);
  const [sentRequests, setSentRequests] = useState([]);

  const friends = dmUsers.filter((dm) => dm.isFriend);
  const nonFriends = dmUsers.filter((dm) => !dm.isFriend);

  const filteredFriends = friends.filter((dm) =>
    dm.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredNonFriends = nonFriends.filter((dm) =>
    dm.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isSearching = searchQuery.length > 0;

  const handleAcceptRequest = (user) => {
    setPendingRequests(pendingRequests.filter((u) => u.id !== user.id));
    console.log("Accepted friend request from:", user.name);
  };

  const handleDeclineRequest = (user) => {
    setPendingRequests(pendingRequests.filter((u) => u.id !== user.id));
    console.log("Declined friend request from:", user.name);
  };

  const handleNavigateToChat = (user) => {
    if (setActiveRoom) {
      setActiveRoom(user.id);
    } else {
      dispatch(setActiveRoom(user.id));
    }
  };

  const handleAddFriend = (user) => {
    setSentRequests([...sentRequests, user.id]);
    console.log("Sent friend request to:", user.name);
  };

  return (
    <div
      className="w-60 min-w-60 flex flex-col h-screen border-r"
      style={{
        background: "var(--bg-surface-secondary)",
        borderColor: "var(--border-primary)",
      }}
    >
      <div
        className="p-4 border-b"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <div className="mb-3">
          <div
            className="text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Tin nhắn
          </div>
        </div>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md text-sm outline-none transition-colors"
          style={{
            background: "var(--input-bg)",
            borderColor: "var(--input-border)",
            color: "var(--input-text)",
          }}
          placeholder="Tìm kiếm bạn bè..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2 relative">
        {/* Search Results */}
        {isSearching && (
          <>
            {/* Friend matches */}
            {filteredFriends.length > 0 && (
              <div className="mb-4">
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-2 px-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Bạn bè
                </div>
                {filteredFriends.map((dm) => (
                  <DMItem
                    key={dm.id}
                    dm={dm}
                    isDark={isDark}
                    isActive={activeRoom === dm.id}
                    onClick={() => setActiveRoom(dm.id)}
                  />
                ))}
              </div>
            )}

            {/* Non-friend matches */}
            {filteredNonFriends.length > 0 && (
              <div className="mb-4">
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-2 px-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Tin nhắn chưa kết bạn
                </div>
                {filteredNonFriends.map((dm) => (
                  <DMItem
                    key={dm.id}
                    dm={dm}
                    isDark={isDark}
                    isActive={activeRoom === dm.id}
                    onClick={() => setActiveRoom(dm.id)}
                    onAddFriend={handleAddFriend}
                  />
                ))}
              </div>
            )}

            {/* Friend Requests in search */}
            {pendingRequests.length > 0 && (
              <div className="mb-4">
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-2 px-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Lời mời kết bạn
                </div>
                {pendingRequests
                  .filter((user) =>
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                  .map((user) => (
                    <FriendRequestItem
                      key={user.id}
                      user={user}
                      isDark={isDark}
                      onAccept={handleAcceptRequest}
                      onDecline={handleDeclineRequest}
                      onNavigateToChat={handleNavigateToChat}
                    />
                  ))}
              </div>
            )}

            {filteredFriends.length === 0 &&
              filteredNonFriends.length === 0 &&
              pendingRequests.filter((user) =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()),
              ).length === 0 && (
                <div
                  className="text-center py-8 text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  Không tìm thấy kết quả
                </div>
              )}
          </>
        )}

        {/* Default View - No Search */}
        {!isSearching && (
          <>
            {/* Friends List */}
            {friends.length > 0 && (
              <div className="mb-4">
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-2 px-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Bạn bè
                </div>
                {friends.map((dm) => (
                  <DMItem
                    key={dm.id}
                    dm={dm}
                    isDark={isDark}
                    isActive={activeRoom === dm.id}
                    onClick={() => setActiveRoom(dm.id)}
                  />
                ))}
              </div>
            )}

            {/* Non-friends with conversations */}
            {nonFriends.length > 0 && (
              <div className="mb-4">
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-2 px-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Tin nhắn chưa kết bạn
                </div>
                {nonFriends.map((dm) => (
                  <DMItem
                    key={dm.id}
                    dm={dm}
                    isDark={isDark}
                    isActive={activeRoom === dm.id}
                    onClick={() => setActiveRoom(dm.id)}
                    onAddFriend={handleAddFriend}
                  />
                ))}
              </div>
            )}

            {/* Friend Requests Section */}
            {pendingRequests.length > 0 && (
              <div className="mb-4">
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-2 px-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Lời mời kết bạn
                </div>
                {pendingRequests.map((user) => (
                  <FriendRequestItem
                    key={user.id}
                    user={user}
                    isDark={isDark}
                    onAccept={handleAcceptRequest}
                    onDecline={handleDeclineRequest}
                    onNavigateToChat={handleNavigateToChat}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DMList;
